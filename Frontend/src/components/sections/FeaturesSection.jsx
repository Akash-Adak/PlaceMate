import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Sparkles,
  BrainCircuit,
  RefreshCw,
  Target,
  MessageSquare,
  CheckCircle2,
  Lock,
  Zap,
  ChevronRight,
  ArrowRight,
  Star,
  TrendingUp,
  Award
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

/* ─── Data ─── */
const CORE_FEATURES = [
  {
    icon: FileText,
    tag: "Step 01",
    title: "Resume Intelligence",
    subtitle: "Parse. Score. Perfect.",
    description:
      "Drop your resume and our AI dissects every line - skills, gaps, ATS score, keyword density. Get a recruiter-eye-view before they even see it.",
    bullets: [
      "ATS compatibility score",
      "Skill gap analysis vs JD",
      "Auto-suggest improvements",
    ],
    accent: "from-indigo-500 via-purple-500 to-pink-500",
    iconColor: "text-indigo-600",
    stat: "95%",
    statLabel: "Accuracy Rate",
  },
  {
    icon: BrainCircuit,
    tag: "Step 02",
    title: "Predicted Questions",
    subtitle: "Company-matched. AI-generated.",
    description:
      "Our model studies hiring patterns from 200+ companies and generates the exact questions you're likely to face - technical, HR, and situational.",
    bullets: [
      "Role & company-specific",
      "Difficulty auto-calibrated",
      "STAR format suggestions",
    ],
    accent: "from-purple-500 via-pink-500 to-rose-500",
    iconColor: "text-purple-600",
    stat: "200+",
    statLabel: "Companies Analyzed",
  },
  {
    icon: RefreshCw,
    tag: "Step 03",
    title: "Daily Practice Loop",
    subtitle: "Automated. Adaptive. Relentless.",
    description:
      "Every morning you get a fresh personalized queue - DSA problems, mock questions, revision cards - all auto-selected by your weak zones.",
    bullets: [
      "Auto-curated daily plan",
      "Spaced repetition engine",
      "Streak tracking",
    ],
    accent: "from-pink-500 via-rose-500 to-orange-500",
    iconColor: "text-pink-600",
    stat: "85%",
    statLabel: "Retention Rate",
  },
  {
    icon: MessageSquare,
    tag: "Step 04",
    title: "AI Mock Interviews",
    subtitle: "Speak. Get judged. Improve.",
    description:
      "Full-blown mock sessions with an AI interviewer that adapts in real-time. Get scored on accuracy, communication, confidence, and structure.",
    bullets: [
      "Voice & text modes",
      "Instant scoring rubric",
      "Actionable debriefs",
    ],
    accent: "from-orange-500 via-amber-500 to-yellow-500",
    iconColor: "text-orange-600",
    stat: "1000+",
    statLabel: "Mock Interviews",
  },
];

/* ─── Main Section ─── */
const FeaturesSection = () => {
  const { isDark } = useTheme();

  const T = {
    sectionBg: isDark 
      ? "pt-24 pb-24 px-6 lg:px-12 bg-[#080808] relative overflow-hidden" 
      : "pt-24 pb-24 px-6 lg:px-12 bg-gradient-to-br from-[#F8FAFC] via-white to-[#F1F5F9] relative overflow-hidden",
    
    ambientBg: isDark 
      ? "bg-amber-500/[0.02]" 
      : "bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10",
    
    tagText: isDark 
      ? "text-amber-500" 
      : "bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent",
    
    titleText: isDark 
      ? "text-white" 
      : "text-slate-800",
    
    titleAccent: isDark 
      ? "text-amber-400 italic" 
      : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent italic",
    
    descText: isDark 
      ? "text-slate-400" 
      : "text-slate-600",
    
    cardBg: isDark 
      ? "bg-[#0a0a0a]" 
      : "bg-white/90 backdrop-blur-sm",
    
    cardBorder: isDark 
      ? "border-white/5" 
      : "border-indigo-100",
    
    cardHoverBorder: isDark 
      ? "hover:border-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/5" 
      : "hover:border-indigo-300/50 hover:shadow-2xl hover:shadow-indigo-500/10 hover:shadow-indigo-100",
    
    iconWrapper: isDark 
      ? "w-14 h-14 rounded-2xl bg-white/5 border border-white/10" 
      : "w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100",
    
    iconWrapperHover: isDark 
      ? "group-hover:bg-amber-500/10 group-hover:border-amber-500/20" 
      : "group-hover:from-indigo-100 group-hover:to-purple-100 group-hover:border-indigo-300",
    
    chevronBase: isDark 
      ? "w-8 h-8 rounded-full shrink-0 flex items-center justify-center bg-white/5 text-slate-500" 
      : "w-8 h-8 rounded-full shrink-0 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 text-indigo-600 border border-indigo-100",
    
    chevronHover: isDark 
      ? "group-hover:bg-amber-500 group-hover:text-black group-hover:rotate-90" 
      : "group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:text-white group-hover:rotate-90 group-hover:border-transparent",
    
    subtitle: isDark 
      ? "text-amber-400" 
      : "bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent",
    
    bulletText: isDark 
      ? "text-slate-300" 
      : "text-slate-700",
    
    checkIcon: isDark 
      ? "text-amber-500" 
      : "text-indigo-600",
    
    statValue: isDark 
      ? "text-amber-400" 
      : "text-indigo-600",
    
    statLabelText: isDark 
      ? "text-slate-500" 
      : "text-slate-500",
  };

  return (
    <section id="features" className={T.sectionBg}>
      {/* Ambient bg */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] ${T.ambientBg} blur-[120px] rounded-full pointer-events-none`} />
      
      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(99,102,241,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.2) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p className={`${T.tagText} font-black uppercase tracking-[0.35em] text-[12px] mb-6 flex items-center justify-center gap-4`}>
            <span className={`w-12 h-px ${isDark ? "bg-amber-500/50" : "bg-gradient-to-r from-indigo-500 to-purple-500"}`} />
            The System Inside
            <span className={`w-12 h-px ${isDark ? "bg-amber-500/50" : "bg-gradient-to-r from-purple-500 to-pink-500"}`} />
          </p>
          <h2 className={`text-5xl md:text-7xl font-black ${T.titleText} tracking-tight leading-[0.9] mb-8`}>
            Everything Automated.
            <br />
            <span className={T.titleAccent}>Nothing Left to Chance.</span>
          </h2>
          <p className={`${T.descText} text-lg md:text-xl max-w-2xl mx-auto leading-relaxed`}>
            From resume parsing to offer negotiation - our AI handles the entire pipeline. You just show up and practice.
          </p>
        </motion.div>

        {/* Interactive Hover Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
          {CORE_FEATURES.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`group relative rounded-[2rem] border-2 ${T.cardBorder} ${T.cardBg} overflow-hidden transition-all duration-500 ${T.cardHoverBorder} hover:-translate-y-2`}
            >
              {/* Background Accent on Hover */}
              <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${feature.accent} opacity-30 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className={`absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br ${feature.accent} blur-[100px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

              <div className="relative p-8 flex flex-col h-full w-full">
                {/* Default Visible Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`${T.iconWrapper} flex items-center justify-center shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${T.iconWrapperHover}`}>
                      <feature.icon size={28} className={feature.iconColor} />
                    </div>
                    <div className="flex flex-col">
                      <p className={`text-[10px] font-black uppercase tracking-[0.35em] ${T.tagText}/80 mb-1`}>
                        {feature.tag}
                      </p>
                      <h3 className={`text-2xl font-black ${T.titleText} leading-tight`}>
                        {feature.title}
                      </h3>
                    </div>
                  </div>
                  {/* Hover Hint Icon */}
                  <div className={`${T.chevronBase} transition-all duration-300 ${T.chevronHover}`}>
                    <ChevronRight size={16} />
                  </div>
                </div>

                {/* Stat Badge */}
                <div className="mb-4 flex items-center gap-2">
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${isDark ? "bg-white/5" : "bg-indigo-50"} border ${isDark ? "border-white/10" : "border-indigo-100"}`}>
                    <TrendingUp size={12} className={feature.iconColor} />
                    <span className={`text-xs font-black ${T.statValue}`}>{feature.stat}</span>
                    <span className={`text-[9px] ${T.statLabelText} uppercase tracking-wider`}>{feature.statLabel}</span>
                  </div>
                </div>

                {/* Always readable description */}
                <p className={`text-base ${T.descText} leading-relaxed`}>
                  {feature.description}
                </p>

                {/* Expandable Extra Details via CSS Grid trick */}
                <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-in-out">
                  <div className="overflow-hidden">
                    <div className={`pt-6 mt-6 border-t ${isDark ? 'border-white/10' : 'border-indigo-100'} opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75`}>
                      <p className={`text-sm font-black uppercase tracking-widest ${T.subtitle} mb-4`}>
                        {feature.subtitle}
                      </p>
                      <div className="space-y-3">
                        {feature.bullets.map((b, idx) => (
                          <div key={idx} className="flex items-center gap-3 group/bullet">
                            <CheckCircle2 size={16} className={`${T.checkIcon} shrink-0 transition-transform duration-200 group-hover/bullet:scale-110`} />
                            <span className={`text-base font-medium ${T.bulletText}`}>{b}</span>
                          </div>
                        ))}
                      </div>
                      
                      {/* CTA hint */}
                      <div className="mt-6 pt-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150">
                        <span className={T.tagText}>Learn more</span>
                        <ArrowRight size={12} className={T.tagText} />
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className={`inline-flex items-center gap-4 px-6 py-3 rounded-full ${isDark ? "bg-white/5 border-white/10" : "bg-white border-indigo-100"} border shadow-sm`}>
            <Sparkles size={18} className={isDark ? "text-amber-400" : "text-indigo-600"} />
            <span className={`text-sm font-bold ${T.descText}`}>
              Trusted by <span className={isDark ? "text-amber-400" : "text-indigo-600"}>10,000+</span> aspiring engineers
            </span>
            <Award size={18} className={isDark ? "text-amber-400" : "text-purple-600"} />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;