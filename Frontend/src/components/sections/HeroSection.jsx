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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getUserResults } from "../../services/resumeService";

const Counter = ({ to, suffix = "" }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString() + suffix);

  useEffect(() => {
    const controls = animate(count, to, { duration: 2.2, ease: "easeOut" });
    return controls.stop;
  }, [count, to]);

  return <motion.span>{rounded}</motion.span>;
};

const ParticleField = () => {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 5,
    duration: Math.random() * 8 + 6,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-amber-500"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, opacity: 0.15 }}
          animate={{ y: [0, -30, 0], opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
};

const NodeCard = ({ icon: Icon, label, positionClass, floatProps }) => (
  <motion.div 
    className={`absolute ${positionClass} w-[84px] h-[84px] rounded-[22px] border border-amber-500/30 bg-[#110a00]/90 backdrop-blur-md flex flex-col items-center justify-center gap-1.5 shadow-[0_0_25px_rgba(245,158,11,0.15)] z-30 cursor-pointer`}
    whileHover={{ scale: 1.15, borderColor: "rgba(245,158,11,0.8)", boxShadow: "0 0 40px rgba(245,158,11,0.5)" }}
    animate={floatProps.animate}
    transition={floatProps.transition}
  >
    <Icon size={24} className="text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
    <span className="text-[10px] font-black tracking-widest text-slate-300 uppercase">{label}</span>
  </motion.div>
);

const StunningAIOrb = () => {
  return (
    <div className="relative w-[480px] h-[480px] flex items-center justify-center scale-75 md:scale-90 lg:scale-100 origin-center">
      {/* Background Ambience */}
      <div className="absolute inset-0 rounded-full bg-amber-500/10 blur-[100px]" />

      {/* SVG Orbits & Anchor Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 500 500">
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Diagonal Orbit 1 */}
        <g transform="rotate(45 250 250)">
          <ellipse cx="250" cy="250" rx="220" ry="80" fill="none" stroke="rgba(245,158,11,0.2)" strokeWidth="1.5" />
          <motion.ellipse 
            cx="250" cy="250" rx="220" ry="80" fill="none" stroke="rgba(245,158,11,0.9)" strokeWidth="3" 
            strokeDasharray="20 1500" strokeLinecap="round" filter="url(#glow)"
            animate={{ strokeDashoffset: [1500, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} 
          />
          <motion.ellipse 
            cx="250" cy="250" rx="220" ry="80" fill="none" stroke="rgba(245,158,11,0.9)" strokeWidth="3" 
            strokeDasharray="20 1500" strokeLinecap="round" filter="url(#glow)"
            animate={{ strokeDashoffset: [1500, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 2 }} 
          />
        </g>
        
        {/* Diagonal Orbit 2 */}
        <g transform="rotate(-45 250 250)">
          <ellipse cx="250" cy="250" rx="220" ry="80" fill="none" stroke="rgba(245,158,11,0.2)" strokeWidth="1.5" />
          <motion.ellipse 
            cx="250" cy="250" rx="220" ry="80" fill="none" stroke="rgba(245,158,11,0.9)" strokeWidth="3" 
            strokeDasharray="20 1500" strokeLinecap="round" filter="url(#glow)"
            animate={{ strokeDashoffset: [1500, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "linear", delay: 1 }} 
          />
        </g>

        {/* Outer Circular Orbit */}
        <circle cx="250" cy="250" r="190" fill="none" stroke="rgba(245,158,11,0.15)" strokeWidth="1.5" strokeDasharray="4 8" />
        <motion.circle 
          cx="250" cy="250" r="190" fill="none" stroke="rgba(245,158,11,0.7)" strokeWidth="2" 
          strokeDasharray="15 1500" strokeLinecap="round" filter="url(#glow)"
          animate={{ strokeDashoffset: [1500, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "linear" }} 
        />

        {/* Radial Anchor Lines connecting AI Core perfectly to the center of the 4 nodes */}
        <g stroke="rgba(245,158,11,0.3)" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse">
          <line x1="250" y1="250" x2="250" y2="60" />
          <line x1="250" y1="250" x2="250" y2="440" />
          <line x1="250" y1="250" x2="60" y2="250" />
          <line x1="250" y1="250" x2="440" y2="250" />
        </g>
      </svg>

      {/* Central AI Core Node */}
      <motion.div 
        className="relative z-20 w-[140px] h-[140px] rounded-[32px] border border-amber-500/50 bg-gradient-to-br from-[#2a1b00] to-[#0a0600] shadow-[0_0_60px_rgba(245,158,11,0.3),inset_0_0_20px_rgba(245,158,11,0.2)] flex flex-col items-center justify-center gap-2 cursor-pointer"
        whileHover={{ scale: 1.05, boxShadow: "0 0 80px rgba(245,158,11,0.5), inset 0 0 30px rgba(245,158,11,0.3)" }}
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute inset-0 rounded-[32px] bg-amber-500/20 blur-md pointer-events-none" />
        <Brain size={44} className="text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.8)] relative z-10" />
        <span className="text-[11px] font-black tracking-[0.2em] text-amber-500 uppercase relative z-10">AI Core</span>
      </motion.div>

      {/* 4 Satellite Nodes perfectly anchored using explicit pixel coordinates */}
      {/* 480px width container. Node is 84px wide. Center is 240px. Left = 240 - 42 = 198px */}
      <NodeCard 
        icon={Code2} label="DSA" positionClass="top-[16px] left-[198px]" 
        floatProps={{ animate: { y: [-4, 4, -4] }, transition: { duration: 4, repeat: Infinity, ease: "easeInOut" } }} 
      />
      <NodeCard 
        icon={Workflow} label="FLOW" positionClass="bottom-[16px] left-[198px]" 
        floatProps={{ animate: { y: [4, -4, 4] }, transition: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 } }} 
      />
      <NodeCard 
        icon={FileSearch} label="OCR" positionClass="left-[16px] top-[198px]" 
        floatProps={{ animate: { x: [-4, 4, -4] }, transition: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 } }} 
      />
      <NodeCard 
        icon={Target} label="MATCH" positionClass="right-[16px] top-[198px]" 
        floatProps={{ animate: { x: [4, -4, 4] }, transition: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 } }} 
      />
    </div>
  );
};

const StatPill = ({ icon: Icon, value, label, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: delay + 0.5, duration: 0.5 }}
    className="flex items-center gap-2.5 px-3 py-2 rounded-2xl border border-white/8 bg-white/3 backdrop-blur-sm"
  >
    <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center">
      <Icon size={14} className="text-amber-400" />
    </div>
    <div>
      <p className="text-base font-black text-white leading-none">
        <Counter to={value} suffix="+" />
      </p>
      <p className="text-[8px] text-slate-500 uppercase tracking-widest mt-0.5">{label}</p>
    </div>
  </motion.div>
);

const HeroSection = () => {
  const [hovered, setHovered] = useState(false);
  const [roadmapCompany, setRoadmapCompany] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const loadRoadmapCompany = async () => {
      if (!user?.uid) {
        setRoadmapCompany("");
        return;
      }
      const data = await getUserResults(user.uid);
      setRoadmapCompany(data?.companies?.[0]?.name || "");
    };
    loadRoadmapCompany();
  }, [user?.uid]);

  const handleStartPreparing = () => navigate(user ? "/dashboard" : "/login");
  const handleExploreRoadmap = () =>
    navigate(
      user
        ? roadmapCompany
          ? `/plan/${roadmapCompany}`
          : "/dashboard"
        : "/login",
    );

  return (
    <section className="relative h-screen min-h-[650px] flex items-center justify-center overflow-hidden bg-[#080808] pt-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(245,158,11,0.08),transparent)]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-amber-500/[0.025] blur-[120px] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(245,158,11,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <ParticleField />

      {/* TIGHTENED LAYOUT: max-w-[1100px] instead of 7xl, reduced gap to bring them closer */}
      <div className="relative z-10 max-w-[1100px] w-full mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 lg:gap-12 items-center justify-between">
        {/* Left Side: Original Text Content */}
        <div className="flex flex-col">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-400">
                Precision Drive 2026
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mb-4"
          >
            <h1 className="text-[60px] lg:text-[76px] font-black leading-[0.88] tracking-[-0.04em] text-white">
              <span
                className="block italic"
                style={{
                  WebkitTextFillColor: "transparent",
                  WebkitTextStroke: "1px rgba(245,158,11,0.6)",
                }}
              >
                Target.
              </span>
              <span className="block text-white">Train.</span>
              <span className="block text-amber-400">Triumph.</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-[14px] text-slate-400 max-w-md mb-8 leading-relaxed"
          >
            The definitive AI ecosystem for placement mastery. Crack DSA, ace
            mock interviews, and land your dream offer - all in one
            precision-built platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="flex flex-wrap items-center gap-4 mb-8"
          >
            <motion.button
              onHoverStart={() => setHovered(true)}
              onHoverEnd={() => setHovered(false)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleStartPreparing}
              className="relative group px-8 py-[17px] bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest text-[11px] rounded-2xl transition-colors flex items-center gap-3 overflow-hidden"
            >
              <span className="relative z-10">Start Preparing</span>
              <motion.div
                animate={{ x: hovered ? 4 : 0 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <ArrowRight size={16} className="relative z-10" />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleExploreRoadmap}
              className="px-8 py-[17px] rounded-2xl border border-white/10 text-white/70 hover:text-white hover:border-white/20 font-bold uppercase tracking-widest text-[11px] transition-all flex items-center gap-2"
            >
              <BookOpen size={14} />
              Explore Roadmap
            </motion.button>
          </motion.div>

          <div className="flex flex-wrap gap-3">
            <StatPill icon={Target} value={24} label="Companies" delay={0.1} />
            <StatPill
              icon={TrendingUp}
              value={86}
              label="Readiness"
              delay={0.2}
            />
          </div>
        </div>

        {/* Right Side: The New Stunning AI Core Orbit */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-col items-center justify-center relative"
        >
          <StunningAIOrb />
        </motion.div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#080808] to-transparent pointer-events-none" />
    </section>
  );
};

export default HeroSection;