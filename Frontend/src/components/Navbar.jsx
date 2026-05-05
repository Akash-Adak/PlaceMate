import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserCircle, LogOut, Zap, Menu, X,
  LayoutDashboard, CreditCard, Moon, Sun,
  ChevronDown, Mic, FileText, Home, Star, Info
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import DailyPrepSection from "./sections/DailyPrepSection";

/* ─── tiny helper ──────────────────────────────────────────────────── */
const NavLink = ({ children, onClick, isDark }) => (
  <button
    onClick={onClick}
    className={`relative text-sm font-semibold pb-0.5 group transition-colors duration-200 ${
      isDark ? "text-slate-300 hover:text-amber-400" : "text-slate-600 hover:text-indigo-600"
    }`}
  >
    {children}
    <span
      className={`absolute bottom-0 left-0 w-0 h-[2px] rounded-full group-hover:w-full transition-all duration-300 ${
        isDark ? "bg-amber-400" : "bg-indigo-600"
      }`}
    />
  </button>
);

const DropdownItem = ({ icon: Icon, children, onClick, danger, isDark }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-150 ${
      danger
        ? isDark
          ? "text-red-400 hover:bg-red-500/10 hover:text-red-300"
          : "text-red-600 hover:bg-red-50 hover:text-red-700"
        : isDark
        ? "text-slate-300 hover:bg-white/[0.07] hover:text-amber-300"
        : "text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
    }`}
  >
    {Icon && <Icon size={15} className="flex-shrink-0 opacity-70" />}
    {children}
  </button>
);

/* ═══════════════════════════════════════════════════════════════════ */
const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [showDailyPrep, setShowDailyPrep] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const profileRef = useRef(null);
  const dailyPrepRef = useRef(null);
  const mobileRef = useRef(null);

  /* close on outside click / Escape */
  useEffect(() => {
    const onDown = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (dailyPrepRef.current && !dailyPrepRef.current.contains(e.target)) setShowDailyPrep(false);
      if (mobileRef.current && !mobileRef.current.contains(e.target)) setMobileOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") { setProfileOpen(false); setShowDailyPrep(false); setMobileOpen(false); }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, []);

  const go = (path) => {
    setProfileOpen(false); setShowDailyPrep(false); setMobileOpen(false);
    navigate(path);
  };

  const scrollTo = (id) => {
    setMobileOpen(false);
    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 60);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const displayName = user ? (user.displayName || user.email?.split("@")[0]) : "";

  /* ── theme tokens (polished light theme + consistent dark) ────── */
  const T = {
    nav: isDark 
      ? "bg-[#0b0b0f]/80 border-white/[0.06] backdrop-blur-md"
      : "bg-white/80 border-gray-200/80 backdrop-blur-md shadow-sm",

    card: isDark 
      ? "bg-[#12121a] border-white/10 shadow-black/50"
      : "bg-white border-gray-200 shadow-xl shadow-gray-200/50",

    divider: isDark 
      ? "bg-white/[0.06]" 
      : "bg-gray-200",

    accent: isDark 
      ? "text-amber-400" 
      : "text-indigo-600",

    pill: isDark 
      ? "bg-amber-500 hover:bg-amber-400 text-black"
      : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm",

    chipBg: isDark 
      ? "bg-white/[0.06] hover:bg-white/[0.12] border-white/10 text-amber-300"
      : "bg-gray-100 hover:bg-indigo-50 border-gray-200 text-indigo-700",

    iconBtn: isDark 
      ? "bg-white/[0.06] hover:bg-white/[0.12] border-white/10 text-amber-300"
      : "bg-gray-100 hover:bg-indigo-50 border-gray-200 text-indigo-600",

    menuBtn: isDark 
      ? "bg-white/[0.05] hover:bg-white/[0.10] border-white/10 text-slate-300 hover:text-amber-400"
      : "bg-gray-100 hover:bg-indigo-50 border-gray-200 text-slate-700 hover:text-indigo-600",

    name: isDark 
      ? "text-amber-400" 
      : "text-indigo-600",

    mobileItem: isDark
      ? "text-slate-300 hover:text-amber-400 hover:bg-white/[0.07]"
      : "text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/60"
  };

  /* ════════════════════════════════════════════════════════════════ */
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 h-[68px] flex items-center backdrop-blur-2xl border-b transition-colors duration-300 ${T.nav}`}>
      <div className="w-full max-w-7xl mx-auto px-5 lg:px-10 flex items-center justify-between h-full gap-4">

        {/* ── Logo ───────────────────────────────────────────────── */}
        <Link to="/" className="flex-shrink-0">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2.5 group"
          >
            <div className="relative">
              <img src={logo} alt="PlaceMate" className="h-9 w-9 object-contain rounded-lg group-hover:scale-110 transition-transform duration-200" />
            </div>
            <span className={`text-[1.55rem] font-black tracking-tight leading-none ${isDark ? "text-white" : "text-slate-800"}`}>
              Place<span className={T.accent}>Mate</span>
            </span>
          </motion.div>
        </Link>

        {/* ── Desktop Nav Links ───────────────────────────────────── */}
        <div className="hidden lg:flex items-center gap-7 flex-1 justify-center">
          <NavLink isDark={isDark} onClick={() => { if (window.location.pathname === "/") window.scrollTo({ top: 0, behavior: "smooth" }); else navigate("/"); }}>
            Home
          </NavLink>
          <NavLink isDark={isDark} onClick={() => scrollTo("features")}>Features</NavLink>
          <NavLink isDark={isDark} onClick={() => scrollTo("about")}>About</NavLink>
          <NavLink isDark={isDark} onClick={() => go("/mock-interview")}>Mock Interview</NavLink>
        </div>

        {/* ── Right Controls ─────────────────────────────────────── */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">

          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={`p-2 rounded-xl border transition-all duration-200 ${T.iconBtn}`}
          >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </motion.button>

          {/* ── Logged OUT ─────────────────────────────────────── */}
          {!user ? (
            <div className="hidden lg:flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={() => go("/login")}
                className={`px-4 py-2 text-sm font-semibold rounded-xl transition-colors duration-200 ${isDark ? "text-slate-300 hover:text-amber-400" : "text-slate-600 hover:text-indigo-600"}`}
              >
                Sign In
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={() => go("/register")}
                className={`px-5 py-2 text-sm font-bold rounded-xl transition-all shadow-sm ${T.pill}`}
              >
                Get Started
              </motion.button>
            </div>
          ) : (
            /* ── Logged IN ─────────────────────────────────────── */
            <div className="hidden lg:flex items-center gap-2">

              {/* Resume chip */}
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={() => go("/resume-parsing")}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all duration-200 ${T.chipBg}`}
              >
                <FileText size={13} /> Resume
              </motion.button>

              {/* Daily Prep chip */}
              <div ref={dailyPrepRef} className="relative">
                <motion.button
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  onClick={() => setShowDailyPrep((v) => !v)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all duration-200 ${T.chipBg}`}
                >
                  <Zap size={13} /> Daily Prep
                </motion.button>
                {showDailyPrep && user && <DailyPrepSection user={user} />}
              </div>

              {/* Divider */}
              <div className={`w-px h-6 mx-1 rounded-full ${T.divider}`} />

              {/* Display name */}
              <span className={`text-xs font-bold tracking-wide ${T.name}`}>{displayName}</span>

              {/* Profile Dropdown */}
              <div ref={profileRef} className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setProfileOpen((v) => !v)}
                  className={`flex items-center gap-1 p-1 rounded-full transition-all duration-200 ${isDark ? "hover:bg-white/10" : "hover:bg-gray-100"}`}
                  aria-label="Profile menu"
                >
                  <UserCircle size={30} className={T.accent} />
                  <motion.span
                    animate={{ rotate: profileOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={13} className={`${T.accent} opacity-70`} />
                  </motion.span>
                </motion.button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className={`absolute right-0 top-full mt-2.5 w-52 rounded-2xl border shadow-2xl overflow-hidden ${T.card}`}
                    >
                      {/* Header */}
                      <div className={`px-4 py-3 border-b ${T.divider}`}>
                        <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-0.5 ${isDark ? "text-slate-500" : "text-slate-400"}`}>Signed in as</p>
                        <p className={`text-sm font-bold truncate ${isDark ? "text-white" : "text-slate-800"}`}>{displayName}</p>
                      </div>

                      <div className="p-1.5">
                        <DropdownItem icon={LayoutDashboard} onClick={() => go("/dashboard")} isDark={isDark}>Dashboard</DropdownItem>
                        <DropdownItem icon={Mic} onClick={() => go("/mock-interview")} isDark={isDark}>Mock Interview</DropdownItem>
                        <DropdownItem icon={FileText} onClick={() => go("/resume-parsing")} isDark={isDark}>Resume Parsing</DropdownItem>
                        <DropdownItem icon={CreditCard} onClick={() => go("/pricing")} isDark={isDark}>Pricing & Plans</DropdownItem>
                        <div className={`my-1.5 h-px mx-2 rounded-full ${T.divider}`} />
                        <DropdownItem icon={LogOut} danger onClick={() => { setProfileOpen(false); logout(); }} isDark={isDark}>Logout</DropdownItem>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* ── Mobile Hamburger ─────────────────────────────────── */}
          <div ref={mobileRef} className="lg:hidden relative">
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
              className={`p-2.5 rounded-xl border transition-all duration-200 ${T.menuBtn}`}
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen
                  ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X size={18} /></motion.span>
                  : <motion.span key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><Menu size={18} /></motion.span>
                }
              </AnimatePresence>
            </motion.button>

            <AnimatePresence>
              {mobileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.97 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className={`absolute right-0 top-full mt-2.5 w-72 rounded-2xl border shadow-2xl overflow-hidden ${T.card}`}
                >
                  {/* Mobile Header */}
                  <div className={`px-5 py-4 border-b ${T.divider}`}>
                    <p className={`text-[10px] font-black uppercase tracking-[0.25em] mb-0.5 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                      {user ? "Account" : "Menu"}
                    </p>
                    <p className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-800"}`}>
                      {user ? displayName : "Welcome to PlaceMate"}
                    </p>
                  </div>

                  <div className="p-2.5 space-y-0.5">
                    {/* Nav links */}
                    {[
                      { label: "Home", icon: Home, action: () => { setMobileOpen(false); if (window.location.pathname === "/") window.scrollTo({ top: 0, behavior: "smooth" }); else navigate("/"); } },
                      { label: "Features", icon: Star, action: () => scrollTo("features") },
                      { label: "About", icon: Info, action: () => scrollTo("about") },
                    ].map(({ label, icon: Icon, action }) => (
                      <button key={label} onClick={action} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${T.mobileItem}`}>
                        <Icon size={15} className="opacity-60" /> {label}
                      </button>
                    ))}

                    <div className={`my-2 h-px mx-1 rounded-full ${T.divider}`} />

                    {!user ? (
                      <>
                        <button onClick={() => { setMobileOpen(false); navigate("/login"); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${T.mobileItem}`}>Sign In</button>
                        <button onClick={() => { setMobileOpen(false); navigate("/register"); }} className={`w-full px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${T.pill}`}>Get Started →</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => go("/mock-interview")} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${T.mobileItem}`}><Mic size={15} className="opacity-60" /> Mock Interview</button>
                        <button onClick={() => go("/resume-parsing")} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${T.mobileItem}`}><FileText size={15} className="opacity-60" /> Resume Parsing</button>
                        <button onClick={() => go("/dashboard")} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${T.mobileItem}`}><LayoutDashboard size={15} className="opacity-60" /> Dashboard</button>
                        <button onClick={() => go("/pricing")} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${T.mobileItem}`}><CreditCard size={15} className="opacity-60" /> Pricing & Plans</button>
                        <div className={`my-2 h-px mx-1 rounded-full ${T.divider}`} />
                        <button onClick={() => { setMobileOpen(false); logout(); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${isDark ? "text-red-400 hover:bg-red-500/10 hover:text-red-300" : "text-red-600 hover:bg-red-50 hover:text-red-700"}`}><LogOut size={15} /> Logout</button>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;