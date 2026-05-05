import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getUserResults } from '../../services/resume';
import { useNavigate } from 'react-router-dom';
import { Flame, Target, ArrowRight, TrendingUp, Award, Sparkles, ChevronRight, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const DailyPrepSection = ({ user }) => {
  const [planData, setPlanData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const sectionRef = useRef(null);

  useEffect(() => {
    if (user?.uid) {
      setLoading(true);
      getUserResults(user.uid)
        .then((data) => {
          setPlanData(data);
        })
        .catch((err) => console.error('Error loading prep data:', err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sectionRef.current && !sectionRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!user || !planData) return null;

  const targetCompany = planData?.companies?.[0]?.name || 'Your Target';
  const readinessScore = planData?.companies?.[0]?.matchScore || 0;

  /* ── Theme tokens ────────────────────────────────────────────── */
  const T = {
    container: isDark
      ? "absolute top-full right-0 mt-2 w-80 md:w-96 bg-gradient-to-br from-[#0a0a0a] to-[#151515] border border-amber-500/30 rounded-2xl shadow-2xl shadow-amber-500/10 z-50"
      : "absolute top-full right-0 mt-2 w-80 md:w-96 bg-white border border-indigo-200 rounded-2xl shadow-2xl shadow-indigo-500/10 z-50",
    
    header: isDark
      ? "flex items-center justify-between mb-4"
      : "flex items-center justify-between mb-4",
    
    headerIcon: isDark
      ? "text-amber-500"
      : "text-indigo-600",
    
    headerTitle: isDark
      ? "text-sm font-black uppercase tracking-[0.2em] text-white"
      : "text-sm font-black uppercase tracking-[0.2em] text-slate-800",
    
    headerBadge: isDark
      ? "text-[10px] font-black text-amber-500 bg-amber-500/20 px-3 py-1 rounded-full"
      : "text-[10px] font-black text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full",
    
    closeBtn: isDark
      ? "p-1 hover:bg-white/10 rounded-lg transition-colors text-slate-500 hover:text-white"
      : "p-1 hover:bg-indigo-50 rounded-lg transition-colors text-slate-400 hover:text-indigo-600",
    
    targetCard: isDark
      ? "mb-4 p-4 bg-white/5 rounded-xl border border-white/10"
      : "mb-4 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100",
    
    targetLabel: isDark
      ? "text-xs text-slate-400 font-bold uppercase tracking-wider mb-1"
      : "text-xs text-slate-500 font-bold uppercase tracking-wider mb-1",
    
    targetTitle: isDark
      ? "text-lg font-black text-white mb-3"
      : "text-lg font-black text-slate-800 mb-3",
    
    progressBarBg: isDark
      ? "flex-1 h-2 bg-white/5 rounded-full overflow-hidden"
      : "flex-1 h-2 bg-indigo-100 rounded-full overflow-hidden",
    
    progressBarFill: isDark
      ? "h-full bg-gradient-to-r from-amber-500 to-amber-400"
      : "h-full bg-gradient-to-r from-indigo-600 to-purple-600",
    
    scoreText: isDark
      ? "text-sm font-black text-amber-400"
      : "text-sm font-black text-indigo-600",
    
    readinessLabel: isDark
      ? "text-[11px] text-slate-500 font-medium"
      : "text-[11px] text-slate-500 font-medium",
    
    statsGrid: isDark
      ? "grid grid-cols-2 gap-3 mb-4"
      : "grid grid-cols-2 gap-3 mb-4",
    
    statCard: isDark
      ? "p-3 bg-white/5 rounded-lg border border-white/10"
      : "p-3 bg-indigo-50/50 rounded-lg border border-indigo-100",
    
    statLabel: isDark
      ? "text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1"
      : "text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1",
    
    statValue: isDark
      ? "text-lg font-black text-white"
      : "text-lg font-black text-slate-800",
    
    statSubtext: isDark
      ? "text-[9px] text-slate-600"
      : "text-[9px] text-slate-400",
    
    statAccentValue: isDark
      ? "text-lg font-black text-amber-400 italic"
      : "text-lg font-black text-indigo-600 italic",
    
    button: isDark
      ? "w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-wider text-xs rounded-lg transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-amber-500/20"
      : "w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black uppercase tracking-wider text-xs rounded-lg transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-indigo-500/20",
    
    loadingContainer: isDark
      ? "absolute top-full right-0 mt-2 w-80 md:w-96 bg-[#0a0a0a] border border-amber-500/20 rounded-2xl p-6 z-50"
      : "absolute top-full right-0 mt-2 w-80 md:w-96 bg-white border border-indigo-200 rounded-2xl p-6 z-50 shadow-xl",
    
    loadingSpinner: isDark
      ? "w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin"
      : "w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin",
    
    loadingText: isDark
      ? "text-sm text-slate-400 font-medium"
      : "text-sm text-slate-500 font-medium",
  };

  if (!isOpen) return null;

  if (loading) {
    return (
      <motion.div
        ref={sectionRef}
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className={T.loadingContainer}
      >
        <div className="flex flex-col items-center justify-center gap-4 py-4">
          <div className={T.loadingSpinner} />
          <p className={T.loadingText}>Loading your daily prep...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={sectionRef}
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={T.container}
    >
      <div className="relative p-5">
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className={`absolute top-3 right-3 ${T.closeBtn}`}
        >
          <X size={14} />
        </button>

        <div className={T.header}>
          <div className="flex items-center gap-2">
            <Flame size={18} className={T.headerIcon} />
            <h3 className={T.headerTitle}>Daily Prep</h3>
          </div>
          <span className={T.headerBadge}>Active</span>
        </div>

        <div className={T.targetCard}>
          <div className={T.targetLabel}>Today's Target</div>
          <div className={T.targetTitle}>{targetCompany}</div>
          
          <div className="flex items-center gap-3 mb-2">
            <div className={T.progressBarBg}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, readinessScore)}%` }}
                transition={{ duration: 0.8 }}
                className={T.progressBarFill}
              />
            </div>
            <span className={T.scoreText}>{readinessScore}%</span>
          </div>
          <p className={T.readinessLabel}>Readiness Score</p>
        </div>

        <div className={T.statsGrid}>
          <div className={T.statCard}>
            <div className={T.statLabel}>Companies Matched</div>
            <div className={T.statValue}>{planData?.companies?.length || 0}</div>
            <p className={T.statSubtext}>Target Companies</p>
          </div>
          <div className={T.statCard}>
            <div className={T.statLabel}>Your Level</div>
            <div className={T.statAccentValue}>{planData?.level || 'N/A'}</div>
            <p className={T.statSubtext}>Profile Strength</p>
          </div>
        </div>

        {/* Quick stats row */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-1">
            <TrendingUp size={10} className={T.headerIcon} />
            <span className={`text-[8px] font-black uppercase tracking-wider ${isDark ? "text-slate-500" : "text-slate-400"}`}>
              Top {planData?.companies?.slice(0, 3).length || 0} matches
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Sparkles size={10} className={T.headerIcon} />
            <span className={`text-[8px] font-black uppercase tracking-wider ${isDark ? "text-slate-500" : "text-slate-400"}`}>
              AI Recommended
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate(`/plan/${encodeURIComponent(targetCompany)}`)}
          className={T.button}
        >
          <Target size={14} />
          Go to Plan & Solve
          <ArrowRight size={14} />
        </button>

        {/* Small hint text */}
        <p className={`text-[8px] text-center mt-3 ${isDark ? "text-slate-600" : "text-slate-400"}`}>
          Based on your resume analysis • Updated daily
        </p>
      </div>
    </motion.div>
  );
};

export default DailyPrepSection;