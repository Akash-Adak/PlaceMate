import React from "react";
import { motion } from "framer-motion";
import { Target, Users, ShieldCheck, Zap, Sparkles, ArrowRight, CheckCircle, Star, Award } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const AboutSection = () => {
  const { isDark } = useTheme();

  const T = {
    sectionBg: isDark 
      ? "py-20 px-6 lg:px-12 bg-[#080808] relative overflow-hidden" 
      : "py-20 px-6 lg:px-12 bg-gradient-to-br from-[#F8FAFC] via-white to-[#F1F5F9] relative overflow-hidden",
    
    ambientTop: isDark 
      ? "bg-amber-500/10" 
      : "bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-pink-500/15",
    
    ambientBottom: isDark 
      ? "bg-orange-500/5" 
      : "bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10",
    
    gridOverlay: isDark 
      ? "bg-amber-500/5" 
      : "bg-indigo-500/5",
    
    wrapper: isDark
      ? "relative rounded-[2.5rem] border border-white/5 bg-[#0a0a0a] overflow-hidden flex flex-col lg:flex-row shadow-2xl"
      : "relative rounded-[2.5rem] border border-indigo-100 bg-white/90 backdrop-blur-sm overflow-hidden flex flex-col lg:flex-row shadow-xl hover:shadow-2xl transition-shadow duration-500",
    
    left: isDark
      ? "p-8 md:p-12 lg:w-3/5 flex flex-col justify-center relative z-10 border-b lg:border-b-0 lg:border-r border-white/5"
      : "p-8 md:p-12 lg:w-3/5 flex flex-col justify-center relative z-10 border-b lg:border-b-0 lg:border-r border-indigo-100",
    
    tagText: isDark 
      ? "text-amber-500" 
      : "bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent",
    
    titleText: isDark 
      ? "text-white" 
      : "text-slate-800",
    
    titleGradient: isDark 
      ? "from-amber-400 to-orange-500" 
      : "from-indigo-600 via-purple-600 to-pink-600",
    
    descText: isDark 
      ? "text-slate-400" 
      : "text-slate-600",
    
    badge: isDark
      ? "flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-slate-300 text-xs font-bold transition-all duration-300 hover:bg-white/10 hover:border-amber-500/30 hover:scale-105"
      : "flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-100 bg-gradient-to-br from-indigo-50 to-purple-50 text-indigo-700 text-xs font-bold transition-all duration-300 hover:bg-gradient-to-br hover:from-indigo-100 hover:to-purple-100 hover:border-indigo-300 hover:scale-105",
    
    badgeIcon: isDark 
      ? "text-amber-400" 
      : "text-indigo-600",
    
    right: isDark 
      ? "p-8 md:p-12 lg:w-2/5 flex flex-col relative z-10 bg-white/[0.01]" 
      : "p-8 md:p-12 lg:w-2/5 flex flex-col relative z-10 bg-gradient-to-br from-indigo-50/30 to-purple-50/30",
    
    missionTitle: isDark 
      ? "text-xl font-black text-white mb-4" 
      : "text-2xl font-black text-slate-800 mb-4",
    
    missionText: isDark 
      ? "text-slate-400 text-sm leading-relaxed mb-8" 
      : "text-slate-600 text-base leading-relaxed mb-8",
    
    tagChip: isDark 
      ? "px-3 py-2.5 rounded-xl border border-white/5 bg-white/5 text-center text-xs font-bold text-slate-400 transition-all duration-300 hover:bg-white/10 hover:text-white hover:scale-105"
      : "px-3 py-2.5 rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-purple-50 text-center text-xs font-bold text-indigo-600 transition-all duration-300 hover:from-indigo-100 hover:to-purple-100 hover:border-indigo-300 hover:text-indigo-700 hover:scale-105",
    
    primaryBtn: isDark 
      ? "flex-1 text-center px-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
      : "flex-1 text-center px-6 py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105",
    
    secondaryBtn: isDark 
      ? "flex-1 text-center px-6 py-3.5 border border-white/10 hover:border-white/20 hover:bg-white/5 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 hover:scale-105"
      : "flex-1 text-center px-6 py-3.5 border-2 border-indigo-200 hover:border-indigo-400 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50 text-indigo-700 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 hover:scale-105",
    
    statNumber: isDark 
      ? "text-amber-400" 
      : "text-indigo-600",
    
    statLabel: isDark 
      ? "text-slate-500" 
      : "text-slate-600",
  };

  const stats = [
    { value: "10K+", label: "Active Users", icon: Users },
    { value: "95%", label: "Success Rate", icon: Award },
    { value: "200+", label: "Partner Companies", icon: Star },
  ];

  return (
    <section id="about" className={T.sectionBg}>
      {/* Background decorations */}
      <div className={`absolute inset-0 ${T.gridOverlay} opacity-[0.03] pointer-events-none`}
        style={{
          backgroundImage: `linear-gradient(rgba(99,102,241,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.2) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className={T.wrapper}
        >
          {/* Ambient Glow */}
          <div className={`absolute top-0 right-0 w-96 h-96 ${T.ambientTop} blur-[120px] pointer-events-none rounded-full`} />
          <div className={`absolute bottom-0 left-0 w-80 h-80 ${T.ambientBottom} blur-[100px] pointer-events-none rounded-full`} />

          {/* Left Side: About Content */}
          <div className={T.left}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <p className={`${T.tagText} font-black uppercase tracking-[0.35em] text-[10px] mb-4 flex items-center gap-3`}>
                <span className={`w-8 h-px ${isDark ? "bg-amber-500/50" : "bg-gradient-to-r from-indigo-500 to-purple-500"}`} />
                About PlaceMate
              </p>
              <h2 className={`text-4xl md:text-5xl font-black ${T.titleText} leading-tight mb-6`}>
                Bridging the gap between <br />
                <span className={`bg-clip-text text-transparent bg-gradient-to-r ${T.titleGradient}`}>
                  talent & opportunity.
                </span>
              </h2>
              <p className={`${T.descText} text-base md:text-lg mb-8 max-w-xl leading-relaxed`}>
                We combine AI-driven role matching, personalized learning paths, and interview-grade 
                mock practice to help students and early-career professionals secure offers faster.
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                {[
                  { label: "Company-specific Banks", icon: Target },
                  { label: "Adaptive Learning", icon: Zap },
                  { label: "Voice & Video Mocks", icon: Users },
                  { label: "ATS Intelligence", icon: ShieldCheck },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
                    className={T.badge}
                  >
                    <item.icon size={14} className={T.badgeIcon} />
                    {item.label}
                  </motion.div>
                ))}
              </div>

              {/* Stats Row */}
              <div className="flex flex-wrap gap-6 pt-4 border-t border-indigo-100">
                {stats.map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.4 + idx * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className={`p-2 rounded-xl ${isDark ? "bg-white/5" : "bg-gradient-to-br from-indigo-100 to-purple-100"}`}>
                      <stat.icon size={16} className={T.statNumber} />
                    </div>
                    <div>
                      <p className={`text-xl font-black ${T.statNumber}`}>{stat.value}</p>
                      <p className={`text-[10px] ${T.statLabel} uppercase tracking-wider`}>{stat.label}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Side: Mission & Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={T.right}
          >
            <div className="mb-6">
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${isDark ? "bg-white/5" : "bg-gradient-to-r from-indigo-100 to-purple-100"} mb-4`}>
                <Sparkles size={12} className={T.statNumber} />
                <span className={`text-[9px] font-black uppercase tracking-wider ${T.statNumber}`}>Our Promise</span>
              </div>
              <h3 className={T.missionTitle}>Our Mission</h3>
              <p className={T.missionText}>
                To make placement preparation accessible, data-driven, and outcome-focused - 
                so every candidate can compete with absolute confidence.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { label: "Ethical AI", icon: ShieldCheck },
                { label: "Student-first", icon: Users },
                { label: "Verified resources", icon: CheckCircle },
                { label: "Mentor-backed", icon: Star },
              ].map((tag, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.3 + i * 0.05 }}
                  className={T.tagChip}
                >
                  <div className="flex items-center justify-center gap-2">
                    <tag.icon size={12} className={T.badgeIcon} />
                    {tag.label}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.a
                href="/register"
                className={T.primaryBtn}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Join the Drive
                <ArrowRight size={12} className="inline ml-2" />
              </motion.a>
              <motion.a
                href="#features"
                className={T.secondaryBtn}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                See Features
              </motion.a>
            </div>

            {/* Trust badge */}
            <div className="mt-6 pt-4 flex items-center justify-center gap-2">
              <div className="flex -space-x-1">
                {[1, 2, 3, 4].map((_, idx) => (
                  <div key={idx} className={`w-6 h-6 rounded-full ${isDark ? "bg-white/10" : "bg-gradient-to-br from-indigo-100 to-purple-100"} border-2 ${isDark ? "border-[#0a0a0a]" : "border-white"} flex items-center justify-center`}>
                    <Users size={10} className={T.statNumber} />
                  </div>
                ))}
              </div>
              <p className={`text-[9px] ${T.statLabel} uppercase tracking-wider`}>
                Trusted by 10,000+ students
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;