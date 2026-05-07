import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  updateProfile,
  sendEmailVerification  // ← ADD THIS
} from "firebase/auth";
import { auth } from "../firebase";
import { syncUserToSheet } from "../services/n8nSync";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!isMounted) return;
      setUser(user);
      setLoading(false);
    });

    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          await syncUserToSheet(result.user, "google");
        }
      })
      .catch((error) => {
        if (error?.code !== "auth/no-auth-event") {
          console.warn("Firebase redirect sign-in result error:", error);
        }
      });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // ✅ FIXED: Now sends verification email after signup
  const signup = async (email, password, displayName) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    await sendEmailVerification(userCredential.user); // ← SENDS VERIFICATION EMAIL
    await syncUserToSheet(userCredential.user, "email");
    return userCredential;
  };

  // ✅ FIXED: Blocks login if email not verified
  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    if (!userCredential.user.emailVerified) {
      await signOut(auth); // sign them out immediately
      throw { code: "auth/email-not-verified" }; // throw custom error
    }

    await syncUserToSheet(userCredential.user, "email");
    return userCredential;
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      // Google accounts are pre-verified, no need to check
      await syncUserToSheet(userCredential.user, "google");
      return userCredential;
    } catch (error) {
      console.error("Google Sign-in error:", error);
      if (
        error?.code === "auth/popup-blocked" ||
        error?.code === "auth/popup-closed-by-user" ||
        error?.code === "auth/cancelled-popup-request"
      ) {
        await signInWithRedirect(auth, provider);
        return null;
      }
      throw error;
    }
  };

  // ✅ NEW: Resend verification email
  const resendVerificationEmail = async () => {
    if (auth.currentUser && !auth.currentUser.emailVerified) {
      await sendEmailVerification(auth.currentUser);
    }
  };

  const logout = () => signOut(auth);

  const value = {
    user,
    signup,
    login,
    logout,
    loginWithGoogle,
    resendVerificationEmail, // ← expose it
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};