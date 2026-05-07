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
  sendEmailVerification
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

  const signup = async (email, password, displayName) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    await sendEmailVerification(userCredential.user);

    // Firebase User is a class instance — its properties (uid, email, displayName)
    // are non-enumerable, so spread { ...userCredential.user } gives an empty object.
    // Pass a plain object with the fields n8nSync needs explicitly.
    await syncUserToSheet({
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: displayName,   // use the param directly — guaranteed to be correct
    }, "email");

    return userCredential;
  };

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    if (!userCredential.user.emailVerified) {
      await signOut(auth);
      throw { code: "auth/email-not-verified" };
    }

    await syncUserToSheet({
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: userCredential.user.displayName,
    }, "email");

    return userCredential;
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      await syncUserToSheet({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
      }, "google");
      return userCredential;
    } catch (error) {
      console.error("Google Sign-in error:", error);
      if (
        error?.code === "auth/popup-blocked" ||
        error?.code === "auth/popup-closed-by-user" ||
        error?.code === "auth/cancelled-popup-request"
      ) {
        await signInWithRedirect(auth, new GoogleAuthProvider());
        return null;
      }
      throw error;
    }
  };

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
    resendVerificationEmail,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};