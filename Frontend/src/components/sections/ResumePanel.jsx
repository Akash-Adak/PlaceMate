import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Sparkles, Brain, CheckCircle, Clock, Target, Code, Award, TrendingUp } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const loadingMessages = [
  "Scanning summary, skills, projects, and experience from your resume.",
  "Extracting role signals, keywords, and proof points from each section.",
  "Building your skill profile and comparing it with company expectations.",
  "Ranking the best-fit companies based on match strength and readiness.",
  "Preparing the final company shortlist and prep roadmap.",
];

const loadingSteps = [
  'Reading profile summary and overall level',
  'Pulling out technical and soft skills',
  'Finding experience patterns and impact signals',
  'Checking projects, achievements, and proof points',
  'Matching your profile to the most suitable companies',
  'Generating a clear prep order for the shortlist'
];

const ResumePanel = ({ parsedData, isLoading = false }) => {
  const { isDark } = useTheme();
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    if (!isLoading) return;

    const timer = window.setInterval(() => {
      setLoadingStep(
        (currentStep) => (currentStep + 1) % loadingMessages.length,
      );
    }, 1400);

    return () => window.clearInterval(timer);
  }, [isLoading]);

  /* ── Theme tokens ────────────────────────────────────────────── */
  const T = {
    // Loading container
    loadingContainer: isDark
      ? "bg-[#0a0a0a] border border-amber-500/20 rounded-2xl p-6 overflow-hidden relative"
      : "bg-white border border-indigo-200 rounded-2xl p-6 overflow-hidden relative shadow-lg",
    
    loadingGradient: isDark
      ? "from-amber-500/5 via-transparent to-transparent"
      : "from-indigo-500/5 via-transparent to-transparent",
    
    loadingHeaderText: isDark
      ? "text-slate-500"
      : "text-slate-400",
    
    loadingBadge: isDark
      ? "text-amber-500"
      : "text-indigo-600",
    
    loadingIconBorder: isDark
      ? "border-amber-500/20 bg-amber-500/10"
      : "border-indigo-200 bg-indigo-50",
    
    loadingSpinner: isDark
      ? "border-amber-500 border-t-transparent"
      : "border-indigo-600 border-t-transparent",
    
    loadingTitle: isDark
      ? "text-white"
      : "text-slate-800",
    
    loadingSubtext: isDark
      ? "text-slate-500"
      : "text-slate-400",
    
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
    
    loadingStepDot: (active) => isDark
      ? active ? 'bg-amber-500 animate-pulse' : 'bg-white/10'
      : active ? 'bg-indigo-600 animate-pulse' : 'bg-indigo-200',
    
    loadingStepText: isDark
      ? "text-slate-400"
      : "text-slate-500",
    
    // Results container
    resultContainer: isDark
      ? "bg-[#0a0a0a] border border-white/5 rounded-2xl p-6"
      : "bg-white border border-indigo-100 rounded-2xl p-6 shadow-lg",
    
    resultHeader: isDark
      ? "text-slate-500"
      : "text-slate-400",
    
    resultLevelLabel: isDark
      ? "text-slate-400"
      : "text-slate-600",
    
    resultLevelValue: isDark
      ? "text-amber-500"
      : "text-indigo-600",
    
    resultCompanies: isDark
      ? "text-slate-400"
      : "text-slate-500",
    
    resultCompaniesValue: isDark
      ? "text-white"
      : "text-slate-800",
    
    resultSkillsHeader: isDark
      ? "text-slate-500"
      : "text-slate-400",
    
    resultSkillBadge: isDark
      ? "bg-white/5 border border-white/5 text-slate-300"
      : "bg-indigo-50 border border-indigo-100 text-indigo-700",
    
    resultNoSkills: isDark
      ? "text-slate-500"
      : "text-slate-400",
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className={T.loadingContainer}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${T.loadingGradient} pointer-events-none`} />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Brain size={16} className={T.loadingBadge} />
              <h4 className={`text-sm font-black uppercase tracking-[0.2em] ${T.loadingHeaderText}`}>
                AI is Understanding Your Resume
              </h4>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${T.loadingBadge}`}>
                Processing
              </span>
              <Sparkles size={12} className={T.loadingBadge} />
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className={`w-12 h-12 rounded-2xl border ${T.loadingIconBorder} flex items-center justify-center`}>
              <div className={`w-5 h-5 rounded-full border-2 ${T.loadingSpinner} animate-spin`} />
            </div>
            <div className="flex-1">
              <p className={`text-lg font-black ${T.loadingTitle} mb-1`}>
                {loadingMessages[loadingStep]}
              </p>
              <p className={`text-xs font-medium ${T.loadingSubtext}`}>
                We are parsing your resume section by section, then matching it to the best companies and recommendations. This can take around 40 to 50 seconds.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
            {[
              "Summary",
              "Skills",
              "Experience",
              "Projects",
              "Companies",
              "Plan",
            ].map((label, index) => {
              const active = index <= loadingStep % 3;
              return (
                <div key={label} className={`rounded-xl border p-3 transition-colors ${T.loadingCardBorder(active)}`}>
                  <div className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${T.loadingCardText(active)}`}>
                    {label}
                  </div>
                  <div className={`h-1.5 rounded-full overflow-hidden ${T.loadingCardBarBg(active)}`}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: active ? "100%" : "20%" }}
                      transition={{ duration: 0.5 }}
                      className={`h-full rounded-full ${T.loadingCardBarFill}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-2">
            {loadingSteps.map((step, index) => (
              <div key={step} className="flex items-center gap-3 text-xs font-medium">
                <div className={`w-2.5 h-2.5 rounded-full ${T.loadingStepDot(index <= loadingStep)}`} />
                <span className={T.loadingStepText}>{step}</span>
                {index <= loadingStep && (
                  <CheckCircle size={10} className={T.loadingBadge} />
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={T.resultContainer}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText size={16} className={T.resultHeader} />
          <h4 className={`text-sm font-black uppercase tracking-[0.2em] ${T.resultHeader}`}>
            Resume Summary
          </h4>
        </div>
        <div className="flex items-center gap-1">
          <Award size={14} className={T.loadingBadge} />
          <span className={`text-[10px] font-black ${T.loadingBadge}`}>Analyzed</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className={`p-4 rounded-xl ${isDark ? "bg-white/5 border border-white/5" : "bg-indigo-50 border border-indigo-100"}`}>
          <div className="flex items-center gap-2 mb-1">
            <Target size={14} className={T.loadingBadge} />
            <span className={`text-[9px] font-black uppercase tracking-wider ${T.resultLevelLabel}`}>Profile Level</span>
          </div>
          <div className={`text-2xl font-black ${T.resultLevelValue}`}>
            {parsedData?.level || 'N/A'}
          </div>
        </div>
        
        <div className={`p-4 rounded-xl ${isDark ? "bg-white/5 border border-white/5" : "bg-indigo-50 border border-indigo-100"}`}>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={14} className={T.loadingBadge} />
            <span className={`text-[9px] font-black uppercase tracking-wider ${T.resultCompanies}`}>Companies Matched</span>
          </div>
          <div className={`text-2xl font-black ${T.resultCompaniesValue}`}>
            {parsedData?.companies?.length || 0}
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Code size={12} className={T.resultSkillsHeader} />
          <h5 className={`text-[10px] font-black uppercase tracking-[0.2em] ${T.resultSkillsHeader}`}>
            Top Skills Detected
          </h5>
        </div>
        <div className="flex flex-wrap gap-2">
          {parsedData?.companies?.[0]?.skillOverlap?.slice(0, 8).map((s, i) => (
            <span key={i} className={`px-3 py-1.5 rounded-xl text-[11px] font-black uppercase transition-all duration-200 hover:scale-105 ${T.resultSkillBadge}`}>
              {s}
            </span>
          ))}
          {!parsedData?.companies?.[0]?.skillOverlap?.length && (
            <span className={`text-[12px] ${T.resultNoSkills}`}>No skills detected</span>
          )}
        </div>
      </div>
      
      {/* Additional info if companies exist */}
      {parsedData?.companies?.length > 0 && (
        <div className={`mt-4 pt-4 border-t ${isDark ? "border-white/10" : "border-indigo-100"}`}>
          <div className="flex items-center gap-2">
            <Clock size={12} className={T.resultHeader} />
            <span className={`text-[9px] font-black uppercase tracking-wider ${T.resultHeader}`}>
              Ready for preparation
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ResumePanel;