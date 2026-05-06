import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Calendar, CheckCircle2, AlertTriangle, BookOpen, Link as LinkIcon, ArrowLeft, Lock, Unlock, Sparkles, Target, TrendingUp, Award, Hourglass } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { generateCompanyPlan, getUserResults, getUserProgress } from '../services/resume';

const loadingSteps = [
  'Reading your profile and company match data.',
  'Comparing strengths, gaps, and readiness.',
  'Building the day-by-day roadmap structure.',
  'Finalizing your custom prep plan.'
];

// Helper function to check if a day can be unlocked
const canUnlockDay = (dayNumber, progress, planLengthDays) => {
  if (dayNumber === 1) return true; // Day 1 is always unlocked
  
  const prevDayCompletion = progress[dayNumber - 1];
  if (!prevDayCompletion || !prevDayCompletion.completedAt) return false;
  
  const completedTime = new Date(prevDayCompletion.completedAt).getTime();
  const currentTime = new Date().getTime();
  const hoursSinceCompletion = (currentTime - completedTime) / (1000 * 60 * 60);
  
  // Require 24 hours between days
  return hoursSinceCompletion >= 24;
};

// Helper to get unlock status and time remaining
const getDayUnlockStatus = (dayNumber, progress) => {
  if (dayNumber === 1) {
    return { unlocked: true, timeRemaining: null, canUnlock: true };
  }
  
  const prevDayCompletion = progress[dayNumber - 1];
  if (!prevDayCompletion || !prevDayCompletion.completedAt) {
    return { unlocked: false, timeRemaining: null, canUnlock: false };
  }
  
  const completedTime = new Date(prevDayCompletion.completedAt).getTime();
  const currentTime = new Date().getTime();
  const hoursSinceCompletion = (currentTime - completedTime) / (1000 * 60 * 60);
  
  if (hoursSinceCompletion >= 24) {
    return { unlocked: true, timeRemaining: null, canUnlock: true };
  }
  
  const remainingHours = 24 - hoursSinceCompletion;
  const remainingMinutes = Math.ceil(remainingHours * 60);
  const hours = Math.floor(remainingHours);
  const minutes = Math.ceil(remainingHours % 1 * 60);
  
  return {
    unlocked: false,
    timeRemaining: { hours, minutes, totalMinutes: remainingMinutes },
    canUnlock: false
  };
};

const CompanyPlan = () => {
  const { companyName } = useParams();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState({});
  const [loadingStep, setLoadingStep] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute for countdowns
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchPlanAndProgress = async () => {
      if (!user) return;
      
      setLoading(true);
      setLoadingStep(0);
      setError(null);
      
      try {
        const profile = await getUserResults(user.uid);
        if (!profile || !profile.companies) {
          throw new Error("Could not find your profile data. Please upload your resume first.");
        }

        const companyObj = profile.companies.find(c => c.name === companyName);
        if (!companyObj) {
          throw new Error("Company not found in your target list.");
        }

        const progressData = await getUserProgress(user.uid, companyName);
        setProgress(progressData);

        const result = await generateCompanyPlan(user.uid, user.displayName || "User", profile.level, companyObj);
        if (result.success && result.data) {
          setPlan(result.data);
        } else {
          setError("Failed to generate plan. Please ensure the backend is available.");
        }
      } catch (err) {
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlanAndProgress();
  }, [companyName, user]);

  useEffect(() => {
    if (!loading) return;

    const timer = window.setInterval(() => {
      setLoadingStep((currentStep) => (currentStep + 1) % loadingSteps.length);
    }, 1500);

    return () => window.clearInterval(timer);
  }, [loading]);

  /* ── Theme tokens ────────────────────────────────────────────── */
  const T = {
    pageBg: isDark
      ? "min-h-screen bg-black text-white selection:bg-amber-500/30"
      : "min-h-screen bg-gradient-to-br from-[#F8FAFC] via-white to-[#F1F5F9] text-slate-800 selection:bg-indigo-500/30",
    
    backButton: isDark
      ? "flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-amber-500 transition-colors mb-12"
      : "flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors mb-12",
    
    loadingContainer: isDark
      ? "bg-[#0a0a0a] border border-amber-500/20 rounded-[3rem] shadow-2xl relative overflow-hidden"
      : "bg-white border border-indigo-200 rounded-[3rem] shadow-xl relative overflow-hidden",
    
    loadingGlow: isDark
      ? "absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-[100px] -mr-48 -mt-48 rounded-full pointer-events-none"
      : "absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[100px] -mr-48 -mt-48 rounded-full pointer-events-none",
    
    loadingIconWrapper: isDark
      ? "w-20 h-20 rounded-[2rem] border border-amber-500/20 bg-amber-500/10 flex items-center justify-center shrink-0 shadow-xl shadow-amber-500/10"
      : "w-20 h-20 rounded-[2rem] border border-indigo-200 bg-indigo-100 flex items-center justify-center shrink-0 shadow-lg",
    
    loadingSpinner: isDark
      ? "w-8 h-8 rounded-full border-4 border-amber-500 border-t-transparent animate-spin"
      : "w-8 h-8 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin",
    
    loadingBadge: isDark
      ? "px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-[10px] font-black uppercase tracking-widest"
      : "px-3 py-1 bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-full text-[10px] font-black uppercase tracking-widest",
    
    loadingSubBadge: isDark
      ? "text-[10px] font-black uppercase tracking-[0.2em] text-slate-500"
      : "text-[10px] font-black uppercase tracking-[0.2em] text-slate-400",
    
    loadingTitle: isDark
      ? "text-3xl md:text-4xl font-black uppercase italic tracking-tight mb-3 text-white"
      : "text-3xl md:text-4xl font-black uppercase italic tracking-tight mb-3 text-slate-800",
    
    loadingDesc: isDark
      ? "text-slate-400 text-sm md:text-base font-medium leading-relaxed max-w-3xl mb-8"
      : "text-slate-600 text-sm md:text-base font-medium leading-relaxed max-w-3xl mb-8",
    
    loadingStepCard: (active) => isDark
      ? `rounded-xl border p-4 ${active ? 'border-amber-500/30 bg-amber-500/10' : 'border-white/5 bg-white/[0.03]'}`
      : `rounded-xl border p-4 ${active ? 'border-indigo-300 bg-indigo-50' : 'border-indigo-100 bg-white'}`,
    
    loadingStepText: (active) => isDark
      ? active ? 'text-amber-400' : 'text-slate-600'
      : active ? 'text-indigo-600' : 'text-slate-400',
    
    loadingStepBarBg: (active) => isDark
      ? active ? 'bg-amber-500/20' : 'bg-white/5'
      : active ? 'bg-indigo-200' : 'bg-indigo-100',
    
    loadingStepBarFill: isDark
      ? "bg-amber-500"
      : "bg-indigo-600",
    
    loadingPhaseContainer: isDark
      ? "flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-4"
      : "flex items-center gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/30 p-4",
    
    loadingPhaseDot: (active) => isDark
      ? active ? 'bg-amber-500 animate-pulse' : 'bg-white/10'
      : active ? 'bg-indigo-600 animate-pulse' : 'bg-indigo-200',
    
    loadingPhaseText: isDark
      ? "text-sm text-slate-300 font-medium"
      : "text-sm text-slate-700 font-medium",
    
    errorContainer: isDark
      ? "bg-[#0a0a0a] border border-red-500/20 rounded-[3rem] p-16 text-center shadow-2xl relative overflow-hidden"
      : "bg-white border border-red-200 rounded-[3rem] p-16 text-center shadow-xl relative overflow-hidden",
    
    errorGlow: isDark
      ? "absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-500/10 blur-[80px] -mt-32 rounded-full pointer-events-none"
      : "absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-500/5 blur-[80px] -mt-32 rounded-full pointer-events-none",
    
    errorTitle: isDark
      ? "text-2xl font-black uppercase tracking-widest mb-4 text-white"
      : "text-2xl font-black uppercase tracking-widest mb-4 text-slate-800",
    
    errorMessage: isDark
      ? "text-slate-400 text-sm font-medium mb-8 max-w-md mx-auto"
      : "text-slate-600 text-sm font-medium mb-8 max-w-md mx-auto",
    
    errorButton: isDark
      ? "px-8 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-black text-[10px] uppercase tracking-widest transition-colors"
      : "px-8 py-3 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-xl font-black text-[10px] uppercase tracking-widest transition-colors",
    
    planContainer: isDark
      ? "bg-[#0a0a0a] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl"
      : "bg-white border border-indigo-100 rounded-[3rem] overflow-hidden shadow-xl",
    
    headerSection: isDark
      ? "p-10 md:p-16 border-b border-white/5 relative overflow-hidden"
      : "p-10 md:p-16 border-b border-indigo-100 relative overflow-hidden bg-gradient-to-r from-white to-indigo-50/30",
    
    headerGlow: isDark
      ? "absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-[100px] -mr-48 -mt-48 rounded-full pointer-events-none"
      : "absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[100px] -mr-48 -mt-48 rounded-full pointer-events-none",
    
    headerBadge: isDark
      ? "px-4 py-2 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-[10px] font-black uppercase tracking-widest"
      : "px-4 py-2 bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-full text-[10px] font-black uppercase tracking-widest",
    
    headerMeta: isDark
      ? "text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5"
      : "text-slate-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100",
    
    headerTitle: isDark
      ? "text-4xl md:text-5xl font-black uppercase italic tracking-tight mb-4 text-white"
      : "text-4xl md:text-5xl font-black uppercase italic tracking-tight mb-4 text-slate-800",
    
    headerTitleAccent: isDark
      ? "text-amber-500"
      : "text-indigo-600",
    
    headerDesc: isDark
      ? "text-slate-400 text-base font-medium leading-relaxed max-w-3xl"
      : "text-slate-600 text-base font-medium leading-relaxed max-w-3xl",
    
    contentSection: isDark
      ? "p-10 md:p-16"
      : "p-10 md:p-16",
    
    strengthCard: isDark
      ? "bg-white/5 border border-white/5 rounded-[2rem] p-8 hover:border-green-500/30 transition-colors group"
      : "bg-green-50 border border-green-100 rounded-[2rem] p-8 hover:border-green-300 transition-colors group",
    
    strengthIcon: isDark
      ? "w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500"
      : "w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600",
    
    strengthTitle: isDark
      ? "text-xs font-black uppercase tracking-widest text-white"
      : "text-xs font-black uppercase tracking-widest text-green-800",
    
    strengthText: isDark
      ? "text-sm text-slate-400 font-medium leading-relaxed"
      : "text-sm text-slate-700 font-medium leading-relaxed",
    
    gapCard: isDark
      ? "bg-white/5 border border-white/5 rounded-[2rem] p-8 hover:border-amber-500/30 transition-colors group"
      : "bg-amber-50 border border-amber-100 rounded-[2rem] p-8 hover:border-amber-300 transition-colors group",
    
    gapIcon: isDark
      ? "w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500"
      : "w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600",
    
    gapTitle: isDark
      ? "text-xs font-black uppercase tracking-widest text-white"
      : "text-xs font-black uppercase tracking-widest text-amber-800",
    
    gapText: isDark
      ? "text-sm text-slate-400 font-medium leading-relaxed"
      : "text-sm text-slate-700 font-medium leading-relaxed",
    
    verdictCard: isDark
      ? "bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 rounded-[2rem] p-8 md:p-12 mb-16 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden"
      : "bg-gradient-to-r from-indigo-100 to-transparent border border-indigo-200 rounded-[2rem] p-8 md:p-12 mb-16 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden",
    
    verdictScoreLabel: isDark
      ? "text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] mb-2"
      : "text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-2",
    
    verdictScore: isDark
      ? "text-6xl font-black text-white"
      : "text-6xl font-black text-slate-800",
    
    verdictScoreSub: isDark
      ? "text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2"
      : "text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2",
    
    verdictTitle: isDark
      ? "text-2xl font-black text-white capitalize mb-4 flex items-center gap-3"
      : "text-2xl font-black text-slate-800 capitalize mb-4 flex items-center gap-3",
    
    verdictApplyBadge: isDark
      ? "px-3 py-1 bg-white/10 text-white text-[9px] uppercase tracking-widest rounded-full font-bold"
      : "px-3 py-1 bg-indigo-100 text-indigo-700 text-[9px] uppercase tracking-widest rounded-full font-bold",
    
    verdictMessage: isDark
      ? "text-sm text-slate-400 leading-relaxed font-medium mb-6"
      : "text-sm text-slate-600 leading-relaxed font-medium mb-6",
    
    verdictLink: isDark
      ? "inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-slate-200 transition-colors"
      : "inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-indigo-700 transition-colors shadow-sm",
    
    timelineHeader: isDark
      ? "text-2xl font-black uppercase italic tracking-widest mb-10 border-b border-white/5 pb-4"
      : "text-2xl font-black uppercase italic tracking-widest mb-10 border-b border-indigo-100 pb-4 text-slate-800",
    
    timelineAccent: isDark
      ? "text-amber-500"
      : "text-indigo-600",
    
    dayCard: (isUnlocked, isComplete, isTimeLocked) => {
      let baseClasses = isDark
        ? "bg-white/[0.02] border rounded-3xl overflow-hidden transition-all duration-300"
        : "bg-white border rounded-3xl overflow-hidden transition-all duration-300";
      
      if (isComplete) {
        baseClasses += isDark ? " border-green-500/30 shadow-lg shadow-green-500/10" : " border-green-300 shadow-md";
      } else if (isUnlocked) {
        baseClasses += isDark ? " border-white/5 hover:border-amber-500/30 opacity-100" : " border-indigo-100 hover:border-indigo-300 shadow-sm hover:shadow-md opacity-100";
      } else if (isTimeLocked) {
        baseClasses += isDark ? " border-white/5 opacity-60" : " border-indigo-100 opacity-60";
      } else {
        baseClasses += isDark ? " border-white/5 opacity-50 grayscale pointer-events-none" : " border-indigo-100 opacity-50 grayscale pointer-events-none";
      }
      
      return baseClasses;
    },
    
    dayHeader: isDark
      ? "p-8 border-b border-white/5 bg-white/[0.01] flex flex-col md:flex-row md:items-center justify-between gap-4"
      : "p-8 border-b border-indigo-100 bg-indigo-50/20 flex flex-col md:flex-row md:items-center justify-between gap-4",
    
    dayNumberBadge: (isComplete, isUnlocked, isTimeLocked) => {
      if (isComplete) return isDark ? "bg-green-500 text-black" : "bg-green-500 text-white";
      if (isUnlocked) return isDark ? "bg-amber-500 text-black" : "bg-indigo-600 text-white";
      if (isTimeLocked) return isDark ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "bg-amber-100 text-amber-700 border border-amber-200";
      return isDark ? "bg-slate-700 text-slate-400" : "bg-slate-200 text-slate-500";
    },
    
    dayTime: isDark
      ? "text-slate-400 font-bold text-[10px] uppercase tracking-widest flex items-center gap-1"
      : "text-slate-500 font-bold text-[10px] uppercase tracking-widest flex items-center gap-1",
    
    dayTitle: isDark
      ? "text-xl font-black text-white flex items-center gap-3"
      : "text-xl font-black text-slate-800 flex items-center gap-3",
    
    dayTheme: isDark
      ? "text-sm text-slate-500 italic max-w-md md:text-right"
      : "text-sm text-slate-500 italic max-w-md md:text-right",
    
    dayButton: (isComplete) => isDark
      ? `px-6 py-2 font-black uppercase text-[10px] tracking-widest rounded-xl transition-colors shadow-lg flex items-center gap-2 ${isComplete ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30' : 'bg-white text-black hover:bg-amber-500'}`
      : `px-6 py-2 font-black uppercase text-[10px] tracking-widest rounded-xl transition-colors shadow-sm flex items-center gap-2 ${isComplete ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-200' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`,
    
    lockedButton: (isTimeLocked, timeRemaining) => isDark
      ? `px-6 py-2 bg-white/5 text-slate-400 font-black uppercase text-[10px] tracking-widest rounded-xl border border-white/5 flex items-center gap-2 cursor-not-allowed`
      : `px-6 py-2 bg-slate-100 text-slate-500 font-black uppercase text-[10px] tracking-widest rounded-xl border border-slate-200 flex items-center gap-2 cursor-not-allowed`,
    
    countdownText: isDark
      ? "text-[9px] text-amber-400 font-medium"
      : "text-[9px] text-amber-600 font-medium",
    
    dayContent: isDark
      ? "p-8 relative"
      : "p-8 relative",
    
    sessionBlock: (isUnlocked) => isDark
      ? `text-[10px] font-black uppercase tracking-widest block mb-1 ${isUnlocked ? 'text-amber-500' : 'text-slate-600'}`
      : `text-[10px] font-black uppercase tracking-widest block mb-1 ${isUnlocked ? 'text-indigo-600' : 'text-slate-400'}`,
    
    sessionDuration: isDark
      ? "text-xs font-bold text-slate-500 block"
      : "text-xs font-bold text-slate-500 block",
    
    sessionDivider: (isUnlocked) => isDark
      ? `w-0.5 min-h-[40px] bg-white/10 rounded-full shrink-0 relative mt-2`
      : `w-0.5 min-h-[40px] bg-indigo-100 rounded-full shrink-0 relative mt-2`,
    
    sessionDot: (isUnlocked) => isDark
      ? `absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full ${isUnlocked ? 'bg-amber-500' : 'bg-slate-700'}`
      : `absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full ${isUnlocked ? 'bg-indigo-600' : 'bg-slate-300'}`,
    
    sessionFocus: isDark
      ? "text-base font-bold text-slate-300 mb-3"
      : "text-base font-bold text-slate-700 mb-3",
  };

  return (
    <div className={T.pageBg}>
      <Navbar />
      
      <main className="max-w-7xl w-full mx-auto px-6 pt-32 pb-24">
        <button 
          onClick={() => navigate('/dashboard')}
          className={T.backButton}
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </button>

        {loading ? (
          <div className={T.loadingContainer}>
            <div className={T.loadingGlow} />
            <div className="p-10 md:p-16 flex flex-col lg:flex-row lg:items-center gap-10 relative z-10">
              <div className={T.loadingIconWrapper}>
                <div className={T.loadingSpinner} />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className={T.loadingBadge}>
                    AI Generated Plan
                  </span>
                  <span className={T.loadingSubBadge}>
                    Estimated 40 to 50 seconds
                  </span>
                </div>
                <h2 className={T.loadingTitle}>Generating Your Prep Plan</h2>
                <p className={T.loadingDesc}>
                  We are reading your profile, measuring your fit against {companyName}, and building the roadmap step by step so the final plan feels tailored instead of generic.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                  {['Profile', 'Match', 'Gaps', 'Roadmap'].map((label, index) => {
                    const active = index <= loadingStep;
                    return (
                      <div key={label} className={T.loadingStepCard(active)}>
                        <div className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${T.loadingStepText(active)}`}>
                          {label}
                        </div>
                        <div className={`h-1.5 rounded-full overflow-hidden ${T.loadingStepBarBg(active)}`}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: active ? '100%' : '18%' }}
                            transition={{ duration: 0.5 }}
                            className={`h-full rounded-full ${T.loadingStepBarFill}`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-3 max-w-2xl">
                  {loadingSteps.map((step, index) => (
                    <div key={step} className={T.loadingPhaseContainer}>
                      <div className={`w-2.5 h-2.5 rounded-full ${T.loadingPhaseDot(index <= loadingStep)}`} />
                      <p className={T.loadingPhaseText}>{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className={T.errorContainer}>
            <div className={T.errorGlow} />
            <AlertTriangle size={48} className="text-red-500 mx-auto mb-6" />
            <h2 className={T.errorTitle}>Generation Failed</h2>
            <p className={T.errorMessage}>{error}</p>
            <button onClick={() => navigate('/dashboard')} className={T.errorButton}>
              Return to Dashboard
            </button>
          </div>
        ) : plan && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={T.planContainer}
          >
            {/* Header Section */}
            <div className={T.headerSection}>
              <div className={T.headerGlow} />
              
              <div className="flex flex-wrap items-center gap-4 mb-6 relative z-10">
                <span className={T.headerBadge}>
                  Custom AI Roadmap
                </span>
                <span className={T.headerMeta}>
                  <Clock size={14} className={isDark ? "text-amber-500" : "text-indigo-600"} /> {plan.daily_commitment} / day
                </span>
                <span className={T.headerMeta}>
                  <Calendar size={14} className={isDark ? "text-amber-500" : "text-indigo-600"} /> {plan.plan_length_days} Days
                </span>
              </div>

              <h1 className={T.headerTitle}>
                {plan.target_company || companyName} <span className={T.headerTitleAccent}>Prep Plan</span>
              </h1>
              <p className={T.headerDesc}>
                {plan.plan_summary}
              </p>
              
              {/* Progress Overview */}
              <div className="mt-6 flex items-center gap-4">
                <div className="flex-1">
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                      style={{ width: `${Object.keys(progress).filter(day => progress[day]?.completed === progress[day]?.total).length / (plan.plan_length_days || 1) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs font-black text-amber-500">
                  {Object.keys(progress).filter(day => progress[day]?.completed === progress[day]?.total).length}/{plan.plan_length_days} Days Completed
                </span>
              </div>
            </div>

            {/* Analysis Grid */}
            <div className={T.contentSection}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className={T.strengthCard}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className={T.strengthIcon}>
                      <CheckCircle2 size={24} />
                    </div>
                    <h4 className={T.strengthTitle}>Profile Strengths</h4>
                  </div>
                  <ul className="space-y-3">
                    {plan.strengths?.map((s, i) => (
                      <li key={i} className={T.strengthText}>
                        <span className={isDark ? "text-green-500" : "text-green-600"} mt-1>•</span> {s}
                      </li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={T.gapCard}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className={T.gapIcon}>
                      <AlertTriangle size={24} />
                    </div>
                    <h4 className={T.gapTitle}>Identified Gaps</h4>
                  </div>
                  <ul className="space-y-3">
                    {plan.gaps?.map((g, i) => (
                      <li key={i} className={T.gapText}>
                        <span className={isDark ? "text-amber-500" : "text-amber-600"} mt-1>•</span> {g}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>

              {/* Verdict Banner */}
              {plan.verdict && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className={T.verdictCard}
                >
                  <div className="shrink-0 text-center">
                    <h4 className={T.verdictScoreLabel}>Match Score</h4>
                    <div className={T.verdictScore}>{plan.verdict.score}</div>
                    <div className={T.verdictScoreSub}>Out of 100</div>
                  </div>
                  <div className="flex-1">
                    <h4 className={T.verdictTitle}>
                      {plan.verdict.verdict?.replace('_', ' ')}
                      {plan.verdict.apply_after && (
                        <span className={T.verdictApplyBadge}>
                          Apply: {plan.verdict.apply_after}
                        </span>
                      )}
                    </h4>
                    <p className={T.verdictMessage}>
                      {plan.verdict.message?.replace(user.uid, user.displayName || "User")}
                    </p>
                    {plan.verdict.careers_url && (
                      <a href={plan.verdict.careers_url} target="_blank" rel="noreferrer" className={T.verdictLink}>
                        Visit Official Careers <LinkIcon size={14} />
                      </a>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Day-by-Day Timeline */}
              <div>
                <h3 className={T.timelineHeader}>
                  Day-by-Day <span className={T.timelineAccent}>Execution</span>
                </h3>
                
                <div className="space-y-8">
                  {plan.days?.map((day, idx) => {
                    const isCurrentDayComplete = progress[day.day_number] && progress[day.day_number].total > 0 && progress[day.day_number].completed === progress[day.day_number].total;
                    
                    // Check if day can be unlocked (requires previous day completion + 24 hours)
                    let isUnlocked = false;
                    let isTimeLocked = false;
                    let timeRemaining = null;
                    
                    if (day.day_number === 1) {
                      isUnlocked = true;
                    } else {
                      const prevCompletion = progress[day.day_number - 1];
                      if (prevCompletion && prevCompletion.completedAt) {
                        const completedTime = new Date(prevCompletion.completedAt).getTime();
                        const currentTimeMs = currentTime.getTime();
                        const hoursSinceCompletion = (currentTimeMs - completedTime) / (1000 * 60 * 60);
                        
                        if (hoursSinceCompletion >= 24) {
                          isUnlocked = true;
                        } else {
                          isUnlocked = false;
                          isTimeLocked = true;
                          const remainingHours = 24 - hoursSinceCompletion;
                          const hours = Math.floor(remainingHours);
                          const minutes = Math.ceil((remainingHours % 1) * 60);
                          timeRemaining = { hours, minutes };
                        }
                      } else {
                        // Previous day not completed yet
                        isUnlocked = false;
                        isTimeLocked = false;
                      }
                    }

                    return (
                      <motion.div 
                        key={day.day_number}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + idx * 0.1 }}
                        className={T.dayCard(isUnlocked, isCurrentDayComplete, isTimeLocked)}
                      >
                        <div className={T.dayHeader}>
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <span className={`px-3 py-1 font-black text-[10px] uppercase tracking-widest rounded-full ${T.dayNumberBadge(isCurrentDayComplete, isUnlocked, isTimeLocked)}`}>
                                Day {day.day_number}
                              </span>
                              <span className={T.dayTime}>
                                <Clock size={12}/> {day.total_time}
                              </span>
                            </div>
                            <h4 className={T.dayTitle}>
                              {day.title} 
                              {!isUnlocked && !isTimeLocked && <Lock size={16} className={isDark ? "text-slate-500" : "text-slate-400"} />}
                              {isTimeLocked && <Hourglass size={16} className="text-amber-500" />}
                              {isCurrentDayComplete && <CheckCircle2 size={16} className="text-green-500" />}
                            </h4>
                          </div>
                          <div className="flex flex-col md:items-end gap-3 mt-4 md:mt-0">
                            <p className={T.dayTheme}>{day.theme}</p>
                            {isUnlocked ? (
                              <button 
                                onClick={() => navigate(`/practice/${companyName}/${day.day_number}`)}
                                className={T.dayButton(isCurrentDayComplete)}
                              >
                                {isCurrentDayComplete ? 'Review Day' : `Practice Day ${day.day_number}`}
                              </button>
                            ) : isTimeLocked && timeRemaining ? (
                              <div className={T.lockedButton(true, timeRemaining)}>
                                <Hourglass size={12} /> 
                                Unlocks in {timeRemaining.hours}h {timeRemaining.minutes}m
                              </div>
                            ) : (
                              <div className={T.lockedButton(false, null)}>
                                <Lock size={12} /> Complete Day {day.day_number - 1} First
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className={T.dayContent}>
                          <div className="space-y-6">
                            {day.sessions?.map((session, i) => (
                              <div key={i} className="flex gap-6 items-start">
                                <div className="w-24 shrink-0 text-right pt-1">
                                  <span className={T.sessionBlock(isUnlocked)}>{session.block}</span>
                                  <span className={T.sessionDuration}>{session.duration}</span>
                                </div>
                                <div className={T.sessionDivider(isUnlocked)}>
                                  <div className={T.sessionDot(isUnlocked)} />
                                </div>
                                <div className="flex-1 pb-4">
                                  <p className={T.sessionFocus}>{session.focus}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
              
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default CompanyPlan;
