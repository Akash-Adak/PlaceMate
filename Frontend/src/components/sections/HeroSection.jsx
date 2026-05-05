import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import {
  Brain,
  FileSearch,
  Target,
  Workflow,
  ArrowRight,
  Code2,
  BookOpen,
  TrendingUp,
  Sparkles,
  Rocket,
  Shield,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { getUserResults } from "../../services/resumeService";

// ─── Theme tokens (polished light theme + consistent dark) ───────────────
const buildTheme = (isDark) => ({
  // Section bg
  sectionBg:      isDark ? "bg-[#080808]"                : "bg-gradient-to-br from-[#F8FAFC] via-white to-[#F1F5F9]",
  // Radial gradient overlay
  radialOverlay:  isDark
    ? "bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(245,158,11,0.08),transparent)]"
    : "bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.12),rgba(236,72,153,0.08),transparent)]",
  // Grid pattern colors
  gridColor:      isDark ? "rgba(245,158,11,0.08)"       : "rgba(99,102,241,0.12)",
  // Central glow blob
  blobBg:         isDark ? "bg-amber-500/[0.025]"        : "bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10",
  // Bottom fade
  bottomFade:     isDark ? "from-[#080808]"              : "from-[#F8FAFC]",
  // Badge
  badgeBg:        isDark ? "bg-amber-500/10 border-amber-500/20"  : "bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200/50 shadow-sm",
  badgeText:      isDark ? "text-amber-400"              : "bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent",
  badgeDot:       isDark ? "bg-amber-400"                : "bg-indigo-500",
  // Heading
  headingOutline: isDark ? "rgba(245,158,11,0.6)"        : "rgba(99,102,241,0.4)",
  headingWhite:   isDark ? "text-white"                  : "text-slate-800",
  headingAccent:  isDark ? "text-amber-400"              : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent",
  // Body text
  bodyText:       isDark ? "text-slate-400"              : "text-slate-600",
  // Primary CTA
  pill:           isDark
    ? "bg-amber-500 hover:bg-amber-400 text-black"
    : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-md hover:shadow-xl",
  pillGradient:   isDark
    ? "from-amber-400 to-amber-500"
    : "from-indigo-500 via-purple-500 to-pink-500",
  // Secondary CTA
  outlineBtn:     isDark
    ? "border-white/10 text-white/70 hover:text-white hover:border-white/20"
    : "border-indigo-200 text-slate-700 hover:text-indigo-700 hover:border-indigo-300 hover:bg-indigo-50/50",
  // Stat pills
  statPillBg:     isDark ? "border-white/8 bg-white/3"   : "border-indigo-100 bg-white/80 backdrop-blur-sm shadow-sm",
  statIconBg:     isDark ? "bg-amber-500/10"             : "bg-gradient-to-br from-indigo-100 to-purple-100",
  statIcon:       isDark ? "text-amber-400"              : "text-indigo-600",
  statLabel:      isDark ? "text-slate-500"              : "text-slate-500",
  statValue:      isDark ? "text-white"                  : "text-slate-800",
  // Orb node cards
  nodeBorder:     isDark ? "border-amber-500/30"         : "border-indigo-200/60",
  nodeBg:         isDark ? "bg-[#110a00]/90"             : "bg-white/90 backdrop-blur-md",
  nodeHoverBorder:isDark ? "rgba(245,158,11,0.8)"        : "rgba(99,102,241,0.8)",
  nodeHoverGlow:  isDark ? "0 0 40px rgba(245,158,11,0.5)"    : "0 0 40px rgba(99,102,241,0.3)",
  nodeIcon:       isDark ? "text-amber-500"              : "text-indigo-600",
  nodeIconGlow:   isDark
    ? "drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]"
    : "drop-shadow-[0_0_8px_rgba(99,102,241,0.4)]",
  nodeLabel:      isDark ? "text-slate-300"              : "text-slate-700",
  nodeShadow:     isDark
    ? "shadow-[0_0_25px_rgba(245,158,11,0.15)]"
    : "shadow-[0_8px_20px_rgba(99,102,241,0.12)]",
  // Orb core
  coreBorder:     isDark ? "border-amber-500/50"         : "border-indigo-300/50",
  coreGradient:   isDark
    ? "from-[#2a1b00] to-[#0a0600]"
    : "from-white via-indigo-50/80 to-purple-50/80",
  coreShadow:     isDark
    ? "shadow-[0_0_60px_rgba(245,158,11,0.3),inset_0_0_20px_rgba(245,158,11,0.2)]"
    : "shadow-[0_0_60px_rgba(99,102,241,0.2),inset_0_0_20px_rgba(99,102,241,0.08)]",
  coreHoverShadow:isDark
    ? "0 0 80px rgba(245,158,11,0.5), inset 0 0 30px rgba(245,158,11,0.3)"
    : "0 0 80px rgba(99,102,241,0.3), inset 0 0 30px rgba(99,102,241,0.15)",
  coreGlow:       isDark ? "bg-amber-500/20"             : "bg-indigo-500/10",
  coreIcon:       isDark ? "text-amber-500"              : "bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent",
  coreIconGlow:   isDark
    ? "drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]"
    : "drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]",
  coreLabel:      isDark ? "text-amber-500"              : "text-indigo-600",
  // Particle
  particleColor:  isDark ? "bg-amber-500"                : "bg-indigo-400",
  // SVG orbit colors
  orbitColor:     isDark ? "rgba(245,158,11,0.2)"        : "rgba(99,102,241,0.15)",
  orbitAccent:    isDark ? "rgba(245,158,11,0.9)"        : "rgba(99,102,241,0.7)",
  radialLine:     isDark ? "rgba(245,158,11,0.3)"        : "rgba(99,102,241,0.2)",
});

// ─── Animated Counter ────────────────────────────────────────────────────────
const Counter = ({ to, suffix = "" }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString() + suffix);
  useEffect(() => {
    const controls = animate(count, to, { duration: 2.2, ease: "easeOut" });
    return controls.stop;
  }, [count, to]);
  return <motion.span>{rounded}</motion.span>;
};

// ─── Particle Field ──────────────────────────────────────────────────────────
const ParticleField = ({ colorClass }) => {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 5,
    duration: Math.random() * 8 + 6,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className={`absolute rounded-full ${colorClass}`}
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, opacity: 0.2 }}
          animate={{ y: [0, -40, 0], x: [0, 20, 0], opacity: [0.1, 0.5, 0.1] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
};

// ─── Floating Sparkles ───────────────────────────────────────────────────────
const FloatingSparkles = ({ isDark }) => {
  const sparkles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 3,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {sparkles.map((s) => (
        <motion.div
          key={s.id}
          className="absolute"
          style={{ left: `${s.x}%`, top: `${s.y}%` }}
          animate={{ scale: [0, 1, 0], opacity: [0, 0.8, 0] }}
          transition={{ duration: 2, delay: s.delay, repeat: Infinity, repeatDelay: Math.random() * 3 }}
        >
          <Sparkles size={s.size} className={isDark ? "text-amber-400" : "text-indigo-400"} />
        </motion.div>
      ))}
    </div>
  );
};

// ─── Node Card ───────────────────────────────────────────────────────────────
const NodeCard = ({ icon: Icon, label, positionClass, floatProps, T }) => (
  <motion.div
    className={`absolute ${positionClass} w-[84px] h-[84px] rounded-[22px] border ${T.nodeBorder} ${T.nodeBg} ${T.nodeShadow} backdrop-blur-md flex flex-col items-center justify-center gap-1.5 z-30 cursor-pointer`}
    whileHover={{
      scale: 1.15,
      borderColor: T.nodeHoverBorder,
      boxShadow: T.nodeHoverGlow,
    }}
    animate={floatProps.animate}
    transition={floatProps.transition}
  >
    <Icon size={24} className={`${T.nodeIcon} ${T.nodeIconGlow}`} />
    <span className={`text-[10px] font-black tracking-widest ${T.nodeLabel} uppercase`}>{label}</span>
  </motion.div>
);

// ─── AI Orb ──────────────────────────────────────────────────────────────────
const StunningAIOrb = ({ T }) => (
  <div className="relative w-[480px] h-[480px] flex items-center justify-center scale-75 md:scale-90 lg:scale-100 origin-center">
    <div className={`absolute inset-0 rounded-full ${T.blobBg} blur-[100px]`} />

    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 500 500">
      <defs>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <linearGradient id="orbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={T.orbitAccent} />
          <stop offset="100%" stopColor={T.orbitAccent} stopOpacity="0.3" />
        </linearGradient>
      </defs>

      {/* Diagonal Orbit 1 */}
      <g transform="rotate(45 250 250)">
        <ellipse cx="250" cy="250" rx="220" ry="80" fill="none" stroke={T.orbitColor} strokeWidth="1.5" />
        <motion.ellipse cx="250" cy="250" rx="220" ry="80" fill="none" stroke="url(#orbitGrad)" strokeWidth="3"
          strokeDasharray="20 1500" strokeLinecap="round" filter="url(#glow)"
          animate={{ strokeDashoffset: [1500, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} />
        <motion.ellipse cx="250" cy="250" rx="220" ry="80" fill="none" stroke="url(#orbitGrad)" strokeWidth="2"
          strokeDasharray="20 1500" strokeLinecap="round" filter="url(#glow)"
          animate={{ strokeDashoffset: [1500, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 2 }} />
      </g>

      {/* Diagonal Orbit 2 */}
      <g transform="rotate(-45 250 250)">
        <ellipse cx="250" cy="250" rx="220" ry="80" fill="none" stroke={T.orbitColor} strokeWidth="1.5" />
        <motion.ellipse cx="250" cy="250" rx="220" ry="80" fill="none" stroke="url(#orbitGrad)" strokeWidth="3"
          strokeDasharray="20 1500" strokeLinecap="round" filter="url(#glow)"
          animate={{ strokeDashoffset: [1500, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "linear", delay: 1 }} />
      </g>

      {/* Outer Circular Orbit */}
      <circle cx="250" cy="250" r="190" fill="none" stroke={T.orbitColor} strokeWidth="1.5" strokeDasharray="4 8" />
      <motion.circle cx="250" cy="250" r="190" fill="none" stroke="url(#orbitGrad)" strokeWidth="2"
        strokeDasharray="15 1500" strokeLinecap="round" filter="url(#glow)"
        animate={{ strokeDashoffset: [1500, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "linear" }} />

      {/* Radial Anchor Lines */}
      <g stroke={T.radialLine} strokeWidth="2" strokeDasharray="4 6" className="animate-pulse">
        <line x1="250" y1="250" x2="250" y2="60" />
        <line x1="250" y1="250" x2="250" y2="440" />
        <line x1="250" y1="250" x2="60" y2="250" />
        <line x1="250" y1="250" x2="440" y2="250" />
      </g>
    </svg>

    {/* Central AI Core */}
    <motion.div
      className={`relative z-20 w-[140px] h-[140px] rounded-[32px] border ${T.coreBorder} bg-gradient-to-br ${T.coreGradient} ${T.coreShadow} flex flex-col items-center justify-center gap-2 cursor-pointer`}
      whileHover={{ scale: 1.05, boxShadow: T.coreHoverShadow }}
      animate={{ scale: [1, 1.02, 1], rotate: [0, 2, -2, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className={`absolute inset-0 rounded-[32px] ${T.coreGlow} blur-md pointer-events-none`} />
      <Brain size={44} className={`${T.coreIcon} ${T.coreIconGlow} relative z-10`} />
      <span className={`text-[11px] font-black tracking-[0.2em] ${T.coreLabel} uppercase relative z-10`}>AI Core</span>
    </motion.div>

    {/* 4 Satellite Nodes */}
    <NodeCard icon={Code2} label="DSA" positionClass="top-[16px] left-[198px]" T={T}
      floatProps={{ animate: { y: [-6, 6, -6] }, transition: { duration: 4, repeat: Infinity, ease: "easeInOut" } }} />
    <NodeCard icon={Workflow} label="FLOW" positionClass="bottom-[16px] left-[198px]" T={T}
      floatProps={{ animate: { y: [6, -6, 6] }, transition: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 } }} />
    <NodeCard icon={FileSearch} label="OCR" positionClass="left-[16px] top-[198px]" T={T}
      floatProps={{ animate: { x: [-6, 6, -6] }, transition: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 } }} />
    <NodeCard icon={Target} label="MATCH" positionClass="right-[16px] top-[198px]" T={T}
      floatProps={{ animate: { x: [6, -6, 6] }, transition: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 } }} />
  </div>
);

// ─── Stat Pill ───────────────────────────────────────────────────────────────
const StatPill = ({ icon: Icon, value, label, delay = 0, T }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: delay + 0.5, duration: 0.5 }}
    className={`flex items-center gap-2.5 px-3 py-2 rounded-2xl border backdrop-blur-sm ${T.statPillBg}`}
  >
    <div className={`w-7 h-7 rounded-lg ${T.statIconBg} flex items-center justify-center`}>
      <Icon size={14} className={T.statIcon} />
    </div>
    <div>
      <p className={`text-base font-black ${T.statValue} leading-none`}>
        <Counter to={value} suffix="+" />
      </p>
      <p className={`text-[8px] ${T.statLabel} uppercase tracking-widest mt-0.5`}>{label}</p>
    </div>
  </motion.div>
);

// ─── Hero Section ─────────────────────────────────────────────────────────────
const HeroSection = () => {
  const { isDark } = useTheme();
  const T = buildTheme(isDark);
  const [hovered, setHovered] = useState(false);
  const [roadmapCompany, setRoadmapCompany] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const loadRoadmapCompany = async () => {
      if (!user?.uid) { setRoadmapCompany(""); return; }
      const data = await getUserResults(user.uid);
      setRoadmapCompany(data?.companies?.[0]?.name || "");
    };
    loadRoadmapCompany();
  }, [user?.uid]);

  const handleStartPreparing = () => navigate(user ? "/dashboard" : "/login");
  const handleExploreRoadmap = () =>
    navigate(user ? (roadmapCompany ? `/plan/${roadmapCompany}` : "/dashboard") : "/login");

  return (
    <section className={`relative h-screen min-h-[650px] flex items-center justify-center overflow-hidden ${T.sectionBg} pt-20 transition-colors duration-300`}>
      {/* Radial gradient */}
      <div className={`absolute inset-0 ${T.radialOverlay}`} />

      {/* Centre glow blob */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full ${T.blobBg} blur-[120px] pointer-events-none`} />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `linear-gradient(${T.gridColor} 1px, transparent 1px), linear-gradient(90deg, ${T.gridColor} 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      <ParticleField colorClass={T.particleColor} />
      <FloatingSparkles isDark={isDark} />

      <div className="relative z-10 max-w-[1100px] w-full mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 lg:gap-12 items-center justify-between">
        {/* ── Left: Text Content ── */}
        <div className="flex flex-col">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${T.badgeBg}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${T.badgeDot} animate-pulse`} />
              <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${T.badgeText}`}>
                Precision Drive 2026
              </span>
              <Rocket size={12} className={T.badgeText} />
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mb-4"
          >
            <h1 className="text-[56px] lg:text-[76px] font-black leading-[0.9] tracking-[-0.04em]">
              <span
                className="block italic"
                style={{
                  WebkitTextFillColor: "transparent",
                  WebkitTextStroke: `1.5px ${T.headingOutline}`,
                }}
              >
                Target.
              </span>
              <span className={`block ${T.headingWhite}`}>Train.</span>
              <span className={`block ${T.headingAccent}`}>Triumph.</span>
            </h1>
          </motion.div>

          {/* Body */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={`text-[15px] ${T.bodyText} max-w-md mb-8 leading-relaxed`}
          >
            The definitive AI ecosystem for placement mastery. Crack DSA, ace
            mock interviews, and land your dream offer — all in one
            precision-built platform.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="flex flex-wrap items-center gap-4 mb-8"
          >
            {/* Primary */}
            <motion.button
              onHoverStart={() => setHovered(true)}
              onHoverEnd={() => setHovered(false)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleStartPreparing}
              className={`relative group px-8 py-[17px] ${T.pill} font-black uppercase tracking-widest text-[11px] rounded-2xl transition-all flex items-center gap-3 overflow-hidden shadow-lg`}
            >
              <span className="relative z-10">Start Preparing</span>
              <motion.div animate={{ x: hovered ? 6 : 0, rotate: hovered ? 5 : 0 }} transition={{ type: "spring", stiffness: 300 }}>
                <ArrowRight size={16} className="relative z-10" />
              </motion.div>
              <div className={`absolute inset-0 bg-gradient-to-r ${T.pillGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            </motion.button>

            {/* Secondary */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleExploreRoadmap}
              className={`px-8 py-[17px] rounded-2xl border-2 font-bold uppercase tracking-widest text-[11px] transition-all flex items-center gap-2 ${T.outlineBtn}`}
            >
              <BookOpen size={14} />
              Explore Roadmap
            </motion.button>
          </motion.div>

          {/* Stat Pills */}
          <div className="flex flex-wrap gap-3">
            <StatPill icon={Target}    value={24} label="Companies" delay={0.1} T={T} />
            <StatPill icon={TrendingUp} value={86} label="Readiness"  delay={0.2} T={T} />
            <StatPill icon={Shield} value={100} label="Success Rate"  delay={0.3} T={T} />
          </div>
        </div>

        {/* ── Right: Orb ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-col items-center justify-center relative"
        >
          <StunningAIOrb T={T} />
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className={`absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t ${T.bottomFade} to-transparent pointer-events-none`} />
    </section>
  );
};

export default HeroSection;