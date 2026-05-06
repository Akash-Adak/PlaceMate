import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const getGoogleAuthErrorMessage = (err) => {
  const code = err?.code || '';

  if (code === 'auth/unauthorized-domain') {
    return 'This domain is not authorized in Firebase. Add your Vercel domain in Firebase Auth > Settings > Authorized domains.';
  }

  if (code === 'auth/operation-not-allowed') {
    return 'Google provider is disabled in Firebase Authentication. Enable Google sign-in method.';
  }

  if (code === 'auth/popup-closed-by-user') {
    return 'Google popup was closed before completing sign-in.';
  }

  if (code === 'auth/popup-blocked') {
    return 'Popup was blocked by the browser. Allow popups for this site and try again.';
  }

  if (code === 'auth/invalid-api-key') {
    return 'Firebase API key is invalid. Verify VITE_FIREBASE_API_KEY in Vercel environment variables.';
  }

  if (code === 'auth/network-request-failed') {
    return 'Network error during Google sign-in. Check internet connection and CORS/domain settings.';
  }

  return err?.message || 'Google Sign-in failed.';
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password.');
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      const userCredential = await loginWithGoogle();
      if (userCredential) {
        window.location.replace('/');
      }
    } catch (err) {
      console.error("Google Sign-in Error:", err);
      setError(getGoogleAuthErrorMessage(err));
    }
  };

  /* ── Theme tokens ────────────────────────────────────────────── */
  const T = {
    pageBg: isDark
      ? "h-screen bg-black flex items-center justify-center p-4 overflow-hidden relative"
      : "h-screen bg-gradient-to-br from-[#F8FAFC] via-white to-[#F1F5F9] flex items-center justify-center p-4 overflow-hidden relative",
    
    glowEffect: isDark
      ? "absolute inset-0 bg-amber-500/5 blur-[120px] pointer-events-none"
      : "absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-[120px] pointer-events-none",
    
    card: isDark
      ? "w-full max-w-[400px] bg-[#0a0a0a] border border-white/5 p-8 rounded-[2rem] shadow-2xl relative z-10"
      : "w-full max-w-[400px] bg-white border border-indigo-100 p-8 rounded-[2rem] shadow-xl relative z-10",
    
    backLink: isDark
      ? "inline-flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-amber-500 transition-colors mb-6 group"
      : "inline-flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors mb-6 group",
    
    title: isDark
      ? "text-2xl font-black text-white tracking-widest leading-tight"
      : "text-2xl font-black text-slate-800 tracking-widest leading-tight",
    
    subtitle: isDark
      ? "text-[10px] text-slate-500 uppercase tracking-[0.2em] mt-1"
      : "text-[10px] text-slate-400 uppercase tracking-[0.2em] mt-1",
    
    errorBox: isDark
      ? "mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] rounded-xl text-center"
      : "mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-[10px] rounded-xl text-center font-medium",
    
    label: isDark
      ? "text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1"
      : "text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1",
    
    inputWrapper: isDark
      ? "relative"
      : "relative",
    
    inputIcon: isDark
      ? "absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
      : "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400",
    
    input: isDark
      ? "w-full bg-black border border-white/10 rounded-xl py-4 pl-11 pr-4 text-sm text-white focus:border-amber-500 outline-none transition-all placeholder:text-slate-800"
      : "w-full bg-white border border-indigo-200 rounded-xl py-4 pl-11 pr-4 text-sm text-slate-800 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 shadow-sm",
    
    submitButton: isDark
      ? "w-full bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest py-4 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 text-[11px]"
      : "w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black uppercase tracking-widest py-4 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 text-[11px] shadow-md",
    
    divider: isDark
      ? "relative my-8"
      : "relative my-8",
    
    dividerLine: isDark
      ? "absolute inset-0 flex items-center text-white/5"
      : "absolute inset-0 flex items-center text-indigo-200",
    
    dividerText: isDark
      ? "relative flex justify-center text-[9px] uppercase font-bold tracking-widest bg-[#0a0a0a] px-3 text-slate-600"
      : "relative flex justify-center text-[9px] uppercase font-bold tracking-widest bg-white px-3 text-slate-400",
    
    googleButton: isDark
      ? "w-full bg-white/5 hover:bg-white/10 border border-white/5 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-3 active:scale-[0.98] text-xs"
      : "w-full bg-white hover:bg-indigo-50 border border-indigo-200 text-slate-700 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-3 active:scale-[0.98] text-xs shadow-sm",
    
    footerText: isDark
      ? "mt-8 text-center text-[10px] text-slate-500 font-medium"
      : "mt-8 text-center text-[10px] text-slate-500 font-medium",
    
    footerLink: isDark
      ? "text-amber-500 font-black hover:underline uppercase tracking-widest ml-1"
      : "text-indigo-600 font-black hover:underline uppercase tracking-widest ml-1",
  };

  return (
    <div className={T.pageBg}>
      <div className={T.glowEffect} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={T.card}
      >
        <Link to="/" className={T.backLink}>
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Return to Explore
        </Link>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <div className={`w-12 h-12 rounded-2xl ${isDark ? "bg-amber-500/20" : "bg-gradient-to-br from-indigo-100 to-purple-100"} flex items-center justify-center`}>
              <Sparkles size={20} className={isDark ? "text-amber-500" : "text-indigo-600"} />
            </div>
          </div>
          <h2 className={T.title}>WELCOME BACK</h2>
          <p className={T.subtitle}>Sign in to your account</p>
        </div>

        {error && (
          <div className={T.errorBox}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className={T.label}>Email</label>
            <div className={T.inputWrapper}>
              <Mail className={T.inputIcon} size={16} />
              <input 
                type="email" required
                className={T.input}
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className={T.label}>Password</label>
            <div className={T.inputWrapper}>
              <Lock className={T.inputIcon} size={16} />
              <input 
                type="password" required
                className={T.input}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className={T.submitButton}
          >
            {loading ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                Sign In Now
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className={T.divider}>
          <div className={T.dividerLine}><div className="w-full border-t border-current"></div></div>
          <div className={T.dividerText}>
            OR CONTINUE WITH
          </div>
        </div>

        <button 
          onClick={handleGoogleSignIn}
          className={T.googleButton}
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
          Google Account
        </button>

        <p className={T.footerText}>
          New here? 
          <Link to="/register" className={T.footerLink}>
            Create Account
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;