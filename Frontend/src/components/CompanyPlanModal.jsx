import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Calendar, CheckCircle2, AlertTriangle, BookOpen, Link as LinkIcon, Sparkles, Target, TrendingUp, Award, ChevronRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { mockCompanyPlan } from '../data/mockCompanyPlan';

const loadingPhases = [
  'Reading your profile and target company context.',
  'Comparing strengths, gaps, and readiness signals.',
  'Assembling the roadmap, milestones, and practice blocks.',
  'Finalizing the company plan and study order.'
];

const CompanyPlanModal = ({ isOpen, onClose, companyName, isLoading = false }) => {
  const { isDark } = useTheme();

  if (!isOpen) return null;

  const plan = mockCompanyPlan;

  /* ── Theme tokens ────────────────────────────────────────────── */
  const T = {
    // Overlay
    overlay: isDark
      ? "bg-black/80 backdrop-blur-sm"
      : "bg-slate-900/60 backdrop-blur-sm",
    
    // Loading Modal
    loadingModal: isDark
      ? "relative w-full max-w-4xl bg-[#0a0a0a] border border-amber-500/20 rounded-[2rem] overflow-hidden shadow-2xl"
      : "relative w-full max-w-4xl bg-white border border-indigo-200 rounded-[2rem] overflow-hidden shadow-2xl",
    
    loadingGlow: isDark
      ? "bg-amber-500/10"
      : "bg-indigo-500/10",
    
    loadingBadge: isDark
      ? "px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-[10px] font-black uppercase tracking-widest"
      : "px-3 py-1 bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-full text-[10px] font-black uppercase tracking-widest",
    
    loadingSubBadge: isDark
      ? "text-[10px] font-black uppercase tracking-[0.2em] text-slate-500"
      : "text-[10px] font-black uppercase tracking-[0.2em] text-slate-400",
    
    loadingCloseBtn: isDark
      ? "p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
      : "p-2 bg-indigo-50 hover:bg-indigo-100 rounded-full transition-colors text-slate-500 hover:text-indigo-600",
    
    loadingIconBorder: isDark
      ? "w-14 h-14 rounded-2xl border border-amber-500/20 bg-amber-500/10"
      : "w-14 h-14 rounded-2xl border border-indigo-200 bg-indigo-50",
    
    loadingSpinner: isDark
      ? "border-amber-500 border-t-transparent"
      : "border-indigo-600 border-t-transparent",
    
    loadingTitle: isDark
      ? "text-3xl font-black uppercase italic tracking-tight mb-2 text-white"
      : "text-3xl font-black uppercase italic tracking-tight mb-2 text-slate-800",
    
    loadingTitleAccent: isDark
      ? "text-amber-500"
      : "text-indigo-600",
    
    loadingDesc: isDark
      ? "text-slate-400 text-sm font-medium leading-relaxed max-w-2xl"
      : "text-slate-600 text-sm font-medium leading-relaxed max-w-2xl",
    
    loadingCardBorder: (active) => isDark
      ? active ? 'border-amber-500/30 bg-amber-500/10' : 'border-white/5 bg-white/[0.03]'
      : active ? 'border-indigo-300 bg-indigo-50' : 'border-indigo-100 bg-white',
    
    loadingCardText: (active) => isDark
      ? active ? 'text-amber-400' : 'text-slate-600'
      : active ? 'text-indigo-600' : 'text-slate-400',
    
    loadingCardBarBg: (active) => isDark
      ? active ? 'bg-amber-500/20' : 'bg-white/5'
      : active ? 'bg-indigo-200' : 'bg-indigo-100',
    
    loadingCardBarFill: isDark
      ? "bg-amber-500"
      : "bg-indigo-600",
    
    loadingPhaseContainer: isDark
      ? "flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-4"
      : "flex items-center gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/30 p-4",
    
    loadingPhaseDot: (active) => isDark
      ? active ? 'bg-amber-500 animate-pulse' : 'bg-white/10'
      : active ? 'bg-indigo-600 animate-pulse' : 'bg-indigo-200',
    
    loadingPhaseTitle: isDark
      ? "text-sm font-black text-white"
      : "text-sm font-black text-slate-800",
    
    loadingPhaseSubtext: isDark
      ? "text-[11px] text-slate-500"
      : "text-[11px] text-slate-400",
    
    // Result Modal
    resultModal: isDark
      ? "relative w-full max-w-4xl max-h-[90vh] bg-[#0a0a0a] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col"
      : "relative w-full max-w-4xl max-h-[90vh] bg-white border border-indigo-100 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col",
    
    resultHeader: isDark
      ? "flex-none p-8 border-b border-white/5 relative overflow-hidden"
      : "flex-none p-8 border-b border-indigo-100 relative overflow-hidden bg-gradient-to-r from-white to-indigo-50/30",
    
    resultCloseBtn: isDark
      ? "absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white z-10"
      : "absolute top-6 right-6 p-2 bg-indigo-50 hover:bg-indigo-100 rounded-full transition-colors text-slate-500 hover:text-indigo-600 z-10",
    
    resultBadge: isDark
      ? "px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-[10px] font-black uppercase tracking-widest"
      : "px-3 py-1 bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-full text-[10px] font-black uppercase tracking-widest",
    
    resultCommitment: isDark
      ? "text-slate-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2"
      : "text-slate-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2",
    
    resultTitle: isDark
      ? "text-3xl font-black uppercase italic tracking-tight mb-2 text-white"
      : "text-3xl font-black uppercase italic tracking-tight mb-2 text-slate-800",
    
    resultTitleAccent: isDark
      ? "text-amber-500"
      : "text-indigo-600",
    
    resultDesc: isDark
      ? "text-slate-400 text-sm font-medium leading-relaxed max-w-2xl"
      : "text-slate-600 text-sm font-medium leading-relaxed max-w-2xl",
    
    resultContent: isDark
      ? "flex-1 overflow-y-auto p-8 custom-scrollbar"
      : "flex-1 overflow-y-auto p-8 custom-scrollbar",
    
    // Stats Cards
    strengthCard: isDark
      ? "bg-white/5 border border-white/5 rounded-2xl p-6 hover:border-green-500/30 transition-all"
      : "bg-green-50 border border-green-100 rounded-2xl p-6 hover:border-green-300 transition-all",
    
    strengthIcon: isDark
      ? "text-green-400"
      : "text-green-600",
    
    strengthTitle: isDark
      ? "text-[10px] font-black uppercase tracking-widest text-slate-500"
      : "text-[10px] font-black uppercase tracking-widest text-green-700",
    
    strengthText: isDark
      ? "text-xs text-slate-300 font-medium leading-relaxed"
      : "text-xs text-slate-700 font-medium leading-relaxed",
    
    gapCard: isDark
      ? "bg-amber-500/5 border border-amber-500/10 rounded-2xl p-6 hover:border-orange-500/30 transition-all"
      : "bg-amber-50 border border-amber-100 rounded-2xl p-6 hover:border-amber-300 transition-all",
    
    gapIcon: isDark
      ? "text-amber-500"
      : "text-amber-600",
    
    gapTitle: isDark
      ? "text-[10px] font-black uppercase tracking-widest text-slate-500"
      : "text-[10px] font-black uppercase tracking-widest text-amber-700",
    
    gapText: isDark
      ? "text-xs text-slate-300 font-medium leading-relaxed"
      : "text-xs text-slate-700 font-medium leading-relaxed",
    
    // Verdict Card
    verdictCard: isDark
      ? "bg-white/[0.02] border border-white/5 rounded-2xl p-6 mb-12"
      : "bg-gradient-to-br from-indigo-50/50 to-purple-50/50 border border-indigo-100 rounded-2xl p-6 mb-12",
    
    verdictLabel: isDark
      ? "text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1"
      : "text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1",
    
    verdictValue: isDark
      ? "text-lg font-black text-white capitalize"
      : "text-lg font-black text-slate-800 capitalize",
    
    verdictScore: isDark
      ? "text-2xl font-black text-amber-500"
      : "text-2xl font-black text-indigo-600",
    
    verdictMessage: isDark
      ? "text-xs text-slate-400 leading-relaxed font-medium mb-4"
      : "text-xs text-slate-600 leading-relaxed font-medium mb-4",
    
    verdictBadge: isDark
      ? "inline-block px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 text-[10px] font-bold uppercase tracking-widest"
      : "inline-block px-3 py-1.5 bg-blue-100 border border-blue-200 rounded-lg text-blue-700 text-[10px] font-bold uppercase tracking-widest",
    
    // Daily Plan
    planHeader: isDark
      ? "text-lg font-black uppercase tracking-widest mb-6 flex items-center gap-3 text-white"
      : "text-lg font-black uppercase tracking-widest mb-6 flex items-center gap-3 text-slate-800",
    
    planIcon: isDark
      ? "text-amber-500"
      : "text-indigo-600",
    
    dayCard: isDark
      ? "bg-[#111] border border-white/5 rounded-2xl overflow-hidden group hover:border-white/10 transition-all hover:shadow-xl"
      : "bg-white border border-indigo-100 rounded-2xl overflow-hidden group hover:border-indigo-300 transition-all hover:shadow-xl",
    
    dayHeader: isDark
      ? "p-6 border-b border-white/5 bg-white/[0.01]"
      : "p-6 border-b border-indigo-100 bg-gradient-to-r from-white to-indigo-50/30",
    
    dayNumber: isDark
      ? "text-amber-500 font-black text-[10px] uppercase tracking-widest"
      : "text-indigo-600 font-black text-[10px] uppercase tracking-widest",
    
    dayTime: isDark
      ? "text-slate-500 font-bold text-[10px] uppercase tracking-widest flex items-center gap-1"
      : "text-slate-500 font-bold text-[10px] uppercase tracking-widest flex items-center gap-1",
    
    dayTitle: isDark
      ? "text-base font-black text-white mb-1"
      : "text-base font-black text-slate-800 mb-1",
    
    dayTheme: isDark
      ? "text-xs text-slate-400 italic"
      : "text-xs text-slate-500 italic",
    
    dayContent: isDark
      ? "p-6"
      : "p-6",
    
    sessionBlock: isDark
      ? "text-[9px] font-black text-slate-500 uppercase tracking-widest block"
      : "text-[9px] font-black text-indigo-500 uppercase tracking-widest block",
    
    sessionDuration: isDark
      ? "text-[10px] font-bold text-slate-400 block"
      : "text-[10px] font-bold text-slate-500 block",
    
    sessionDivider: isDark
      ? "w-1 h-full bg-white/5 rounded-full mt-1 shrink-0"
      : "w-1 h-full bg-indigo-100 rounded-full mt-1 shrink-0",
    
    sessionFocus: isDark
      ? "text-xs font-bold text-white mb-1"
      : "text-xs font-bold text-slate-800 mb-1",
    
    sessionLink: isDark
      ? "inline-flex items-center gap-1 text-[9px] font-black text-amber-500 uppercase tracking-wider hover:text-amber-400 transition-colors"
      : "inline-flex items-center gap-1 text-[9px] font-black text-indigo-600 uppercase tracking-wider hover:text-indigo-700 transition-colors",
    
    sessionWrapper: isDark
      ? "flex gap-4 items-start p-3 rounded-xl hover:bg-white/5 transition-all"
      : "flex gap-4 items-start p-3 rounded-xl hover:bg-indigo-50/50 transition-all",
  };

  if (isLoading) {
    return (
      <AnimatePresence>
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`absolute inset-0 ${T.overlay}`}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className={T.loadingModal}
          >
            <div className={`absolute top-0 right-0 w-72 h-72 ${T.loadingGlow} blur-[90px] -mr-36 -mt-36 rounded-full pointer-events-none`} />
            <div className="p-8 sm:p-10 relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className={T.loadingBadge}>
                    AI Generated Plan
                  </span>
                  <span className={T.loadingSubBadge}>
                    Estimated 40 to 50 seconds
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className={T.loadingCloseBtn}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex items-start gap-5 mb-8">
                <div className={T.loadingIconBorder}>
                  <div className={`w-6 h-6 rounded-full border-2 ${T.loadingSpinner} animate-spin`} />
                </div>
                <div className="flex-1">
                  <h2 className={T.loadingTitle}>
                    {companyName} <span className={T.loadingTitleAccent}>Prep Plan</span>
                  </h2>
                  <p className={T.loadingDesc}>
                    We are generating your roadmap by comparing your profile with the target company, then turning the result into a step-by-step prep plan.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                {['Profile', 'Match', 'Gaps', 'Roadmap'].map((label, index) => {
                  const active = index <= 1;
                  return (
                    <div key={label} className={`rounded-xl border p-4 ${T.loadingCardBorder(active)}`}>
                      <div className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${T.loadingCardText(active)}`}>
                        {label}
                      </div>
                      <div className={`h-1.5 rounded-full overflow-hidden ${T.loadingCardBarBg(active)}`}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: active ? '100%' : '22%' }}
                          transition={{ duration: 0.5 }}
                          className={`h-full rounded-full ${T.loadingCardBarFill}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {loadingPhases.map((phase, index) => (
                  <div key={phase} className={T.loadingPhaseContainer}>
                    <div className={`w-2.5 h-2.5 rounded-full ${T.loadingPhaseDot(index === 0)}`} />
                    <div>
                      <p className={T.loadingPhaseTitle}>{phase}</p>
                      <p className={T.loadingPhaseSubtext}>The plan is being assembled in the background.</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className={`absolute inset-0 ${T.overlay}`}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={T.resultModal}
        >
          {/* Header */}
          <div className={T.resultHeader}>
            <div className={`absolute top-0 right-0 w-64 h-64 ${T.loadingGlow} blur-[80px] -mr-32 -mt-32 rounded-full pointer-events-none`} />
            
            <button 
              onClick={onClose}
              className={T.resultCloseBtn}
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-4 mb-4">
              <span className={T.resultBadge}>
                AI Generated Plan
              </span>
              <span className={T.resultCommitment}>
                <Clock size={14} /> {plan.daily_commitment} / day
              </span>
            </div>

            <h2 className={T.resultTitle}>
              {companyName} <span className={T.resultTitleAccent}>Prep Plan</span>
            </h2>
            <p className={T.resultDesc}>
              {plan.plan_summary}
            </p>
          </div>

          {/* Scrollable Content */}
          <div className={T.resultContent}>
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={T.strengthCard}
              >
                <div className={`flex items-center gap-3 mb-4 ${T.strengthIcon}`}>
                  <CheckCircle2 size={20} />
                  <h4 className={T.strengthTitle}>Strengths</h4>
                </div>
                <ul className="space-y-2">
                  {plan.strengths.map((s, i) => (
                    <li key={i} className={T.strengthText}>• {s}</li>
                  ))}
                </ul>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={T.gapCard}
              >
                <div className={`flex items-center gap-3 mb-4 ${T.gapIcon}`}>
                  <AlertTriangle size={20} />
                  <h4 className={T.gapTitle}>Key Gaps</h4>
                </div>
                <ul className="space-y-2">
                  {plan.gaps.map((g, i) => (
                    <li key={i} className={T.gapText}>• {g}</li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Verdict */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={T.verdictCard}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className={T.verdictLabel}>Final Verdict</h4>
                  <p className={T.verdictValue}>{plan.verdict.verdict.replace('_', ' ')}</p>
                </div>
                <div className="text-right">
                  <h4 className={T.verdictLabel}>Score</h4>
                  <p className={T.verdictScore}>{plan.verdict.score}/100</p>
                </div>
              </div>
              <p className={T.verdictMessage}>{plan.verdict.message}</p>
              <div className={T.verdictBadge}>
                Target Apply Date: {plan.verdict.apply_after}
              </div>
            </motion.div>

            {/* Daily Plan */}
            <motion.h3 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className={T.planHeader}
            >
              <Calendar className={T.planIcon} />
              {plan.plan_length_days}-Day Roadmap
            </motion.h3>
            
            <div className="space-y-6">
              {plan.days.map((day, idx) => (
                <motion.div 
                  key={day.day_number}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  className={T.dayCard}
                >
                  <div className={T.dayHeader}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={T.dayNumber}>Day {day.day_number}</span>
                      <span className={T.dayTime}><Clock size={12}/> {day.total_time}</span>
                    </div>
                    <h4 className={T.dayTitle}>{day.title}</h4>
                    <p className={T.dayTheme}>{day.theme}</p>
                  </div>
                  <div className={T.dayContent}>
                    <div className="space-y-3">
                      {day.sessions.map((session, i) => (
                        <div key={i} className={T.sessionWrapper}>
                          <div className="w-20 shrink-0 text-right">
                            <span className={T.sessionBlock}>{session.block}</span>
                            <span className={T.sessionDuration}>{session.duration}</span>
                          </div>
                          <div className={T.sessionDivider} />
                          <div className="flex-1">
                            <p className={T.sessionFocus}>{session.focus}</p>
                            <a href={session.resource} target="_blank" rel="noreferrer" className={T.sessionLink}>
                              <BookOpen size={10} /> Study Material <LinkIcon size={10} />
                            </a>
                          </div>
                          <ChevronRight size={14} className="opacity-30 group-hover:opacity-100 transition-opacity" />
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Footer hint */}
            <div className="mt-8 pt-4 text-center">
              <p className={`text-[9px] ${isDark ? "text-slate-600" : "text-slate-400"} uppercase tracking-widest`}>
                Complete each session to mark your progress
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CompanyPlanModal;