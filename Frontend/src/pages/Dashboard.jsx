import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Target, 
  LayoutDashboard, 
  Briefcase, 
  BookOpen,
  Settings,
  ArrowRight,
  FileText,
  Zap,
  Crown,
  Award,
  Flame,
  BarChart3,
  Calendar,
  Sparkles,
  ChevronRight,
  CheckCircle,
  Clock,
  Star
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import { getUserResults, getDashboardAnalytics } from '../services/resumeService';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [parsedData, setParsedData] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unlockedCompany, setUnlockedCompany] = useState(localStorage.getItem('unlockedCompany') || null);
  const quizProgress = analytics?.quizProgress || { completed: 0, total: 0, completionRate: 0, averageScore: 0 };
  const progressTrend = analytics?.progressTrend || [];
  const skillProficiency = analytics?.skillProficiency || [];
  const weeklyGoals = analytics?.weeklyGoals || [];
  const activeDays = analytics?.activeDays || progressTrend.filter((value) => value > 0).length;
  const dailyPrepProgress = analytics?.dailyPrepProgress || 0;
  const momentumScore = analytics?.momentumScore || 0;

  const handleViewPlan = (companyName) => {
    if (!unlockedCompany) {
      localStorage.setItem('unlockedCompany', companyName);
      setUnlockedCompany(companyName);
      navigate(`/plan/${companyName}`);
    } else if (unlockedCompany === companyName) {
      navigate(`/plan/${companyName}`);
    } else {
      navigate('/pricing');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (user?.uid) {
        setLoading(true);
        try {
          const data = await getUserResults(user.uid);
          if (data) {
            setParsedData(data);
            const analyticsData = await getDashboardAnalytics(user.uid, data.companies || []);
            setAnalytics(analyticsData);
          }
        } catch (error) {
          console.error("Error loading dashboard data:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadData();
  }, [user]);

  useEffect(() => {
    const handleViewportChange = () => {
      if (window.innerWidth >= 1280) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleViewportChange();
    window.addEventListener('resize', handleViewportChange);
    return () => window.removeEventListener('resize', handleViewportChange);
  }, []);

  /* ── Theme tokens ────────────────────────────────────────────── */
  const T = {
    pageBg: isDark
      ? "min-h-screen bg-black text-white"
      : "min-h-screen bg-gradient-to-br from-[#F8FAFC] via-white to-[#F1F5F9] text-slate-800",
    
    headerCard: isDark
      ? "mb-8 sm:mb-10 lg:mb-12 bg-gradient-to-r from-amber-500/10 to-amber-500/5 border border-amber-500/30 rounded-3xl p-5 sm:p-6 lg:p-8"
      : "mb-8 sm:mb-10 lg:mb-12 bg-gradient-to-r from-indigo-500/10 to-purple-500/5 border border-indigo-200 rounded-3xl p-5 sm:p-6 lg:p-8",
    
    avatar: isDark
      ? "w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-xl sm:text-2xl font-black shrink-0 text-black"
      : "w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-xl sm:text-2xl font-black shrink-0 text-white",
    
    userName: isDark
      ? "text-2xl sm:text-3xl font-black uppercase italic mb-1 truncate text-white"
      : "text-2xl sm:text-3xl font-black uppercase italic mb-1 truncate text-slate-800",
    
    userEmail: isDark
      ? "text-amber-500 font-bold uppercase tracking-[0.2em] text-[10px] break-all"
      : "text-indigo-600 font-bold uppercase tracking-[0.2em] text-[10px] break-all",
    
    toggleButton: isDark
      ? "hidden xl:flex items-center gap-3 px-5 py-3 bg-black border border-amber-500/30 rounded-2xl hover:border-amber-500/60 transition-all group self-start"
      : "hidden xl:flex items-center gap-3 px-5 py-3 bg-white border border-indigo-200 rounded-2xl hover:border-indigo-400 transition-all group self-start shadow-sm",
    
    toggleText: isDark
      ? "text-[10px] font-black uppercase tracking-widest text-amber-500 group-hover:text-amber-400"
      : "text-[10px] font-black uppercase tracking-widest text-indigo-600 group-hover:text-indigo-700",
    
    mobileToggle: isDark
      ? "w-full flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left"
      : "w-full flex items-center justify-between gap-3 rounded-2xl border border-indigo-100 bg-white px-4 py-3 text-left shadow-sm",
    
    mobileToggleLabel: isDark
      ? "text-[10px] font-black uppercase tracking-[0.3em] text-slate-500"
      : "text-[10px] font-black uppercase tracking-[0.3em] text-slate-400",
    
    mobileToggleText: isDark
      ? "text-sm font-bold text-white"
      : "text-sm font-bold text-slate-800",
    
    loadingCard: isDark
      ? "bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-10 sm:p-14 lg:p-20 flex flex-col items-center justify-center text-center"
      : "bg-white border border-indigo-100 rounded-[2.5rem] p-10 sm:p-14 lg:p-20 flex flex-col items-center justify-center text-center shadow-lg",
    
    loadingSpinner: isDark
      ? "w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-6"
      : "w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6",
    
    loadingText: isDark
      ? "text-[10px] font-black uppercase tracking-widest text-slate-500"
      : "text-[10px] font-black uppercase tracking-widest text-slate-400",
    
    emptyStateCard: isDark
      ? "bg-gradient-to-r from-amber-500/10 to-amber-500/5 border border-amber-500/30 rounded-2xl p-5 sm:p-6 lg:p-8"
      : "bg-gradient-to-r from-indigo-500/10 to-purple-500/5 border border-indigo-200 rounded-2xl p-5 sm:p-6 lg:p-8",
    
    emptyStateIcon: isDark
      ? "p-3 bg-amber-500/20 rounded-xl"
      : "p-3 bg-indigo-100 rounded-xl",
    
    emptyStateTitle: isDark
      ? "text-base sm:text-lg font-black uppercase text-white"
      : "text-base sm:text-lg font-black uppercase text-slate-800",
    
    emptyStateDesc: isDark
      ? "text-slate-400 text-xs sm:text-sm font-medium mt-1"
      : "text-slate-500 text-xs sm:text-sm font-medium mt-1",
    
    emptyStateButton: isDark
      ? "w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest text-xs rounded-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap"
      : "w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black uppercase tracking-widest text-xs rounded-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-md",
    
    metricCard: isDark
      ? "bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-5 sm:p-6 hover:border-white/20 transition-all"
      : "bg-white border border-indigo-100 rounded-2xl p-5 sm:p-6 hover:border-indigo-300 transition-all shadow-sm hover:shadow-md",
    
    metricLabel: isDark
      ? "text-[9px] font-black uppercase tracking-widest text-slate-500"
      : "text-[9px] font-black uppercase tracking-widest text-slate-400",
    
    metricIconBg: (color) => isDark
      ? `p-2 rounded-lg bg-gradient-to-br ${color} shadow-lg`
      : `p-2 rounded-lg bg-gradient-to-br ${color} shadow-md`,
    
    metricValue: isDark
      ? "text-2xl font-black mb-2 text-white"
      : "text-2xl font-black mb-2 text-slate-800",
    
    metricChange: isDark
      ? "text-[9px] text-slate-500 font-bold"
      : "text-[9px] text-slate-400 font-bold",
    
    sectionCard: isDark
      ? "bg-[#0a0a0a] border border-white/5 rounded-3xl p-5 sm:p-6 lg:p-8"
      : "bg-white border border-indigo-100 rounded-3xl p-5 sm:p-6 lg:p-8 shadow-md",
    
    sectionTitle: isDark
      ? "text-xs sm:text-sm font-black uppercase tracking-[0.3em] text-white mb-1"
      : "text-xs sm:text-sm font-black uppercase tracking-[0.3em] text-slate-800 mb-1",
    
    sectionSubtitle: isDark
      ? "text-[10px] font-bold text-slate-500"
      : "text-[10px] font-bold text-slate-400",
    
    dayLabel: isDark
      ? "text-[9px] font-bold text-slate-600"
      : "text-[9px] font-bold text-slate-400",
    
    dayValue: isDark
      ? "text-[9px] font-bold text-slate-600"
      : "text-[9px] font-bold text-slate-500",
    
    skillName: isDark
      ? "text-[10px] font-bold text-slate-400"
      : "text-[10px] font-bold text-slate-600",
    
    skillPercent: isDark
      ? "text-[9px] font-black text-slate-500"
      : "text-[9px] font-black text-slate-400",
    
    companyCard: isDark
      ? "bg-[#0a0a0a] border border-white/5 rounded-2xl p-5 sm:p-6 hover:border-amber-500/30 transition-all"
      : "bg-white border border-indigo-100 rounded-2xl p-5 sm:p-6 hover:border-indigo-300 transition-all shadow-sm hover:shadow-md",
    
    companyName: isDark
      ? "text-base sm:text-lg font-black uppercase italic truncate text-white"
      : "text-base sm:text-lg font-black uppercase italic truncate text-slate-800",
    
    companyLocation: isDark
      ? "text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] truncate"
      : "text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] truncate",
    
    matchScore: isDark
      ? "text-2xl font-black text-amber-500"
      : "text-2xl font-black text-indigo-600",
    
    matchLabel: isDark
      ? "text-[9px] text-slate-600 font-bold"
      : "text-[9px] text-slate-400 font-bold",
    
    matchReason: isDark
      ? "text-slate-400 text-xs mb-4 leading-relaxed"
      : "text-slate-500 text-xs mb-4 leading-relaxed",
    
    planButton: isDark
      ? "w-full py-2 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest text-[9px] rounded-lg transition-all flex items-center justify-center gap-2 active:scale-95"
      : "w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black uppercase tracking-widest text-[9px] rounded-lg transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm",
    
    viewAllButton: isDark
      ? "w-full mt-8 py-3 border border-amber-500/30 hover:border-amber-500/60 hover:bg-amber-500/10 text-amber-500 font-bold uppercase tracking-widest text-[10px] rounded-lg transition-all flex items-center justify-center gap-2"
      : "w-full mt-8 py-3 border border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 text-indigo-600 font-bold uppercase tracking-widest text-[10px] rounded-lg transition-all flex items-center justify-center gap-2",
    
    // Sidebar styles
    sidebarCard: isDark
      ? "bg-[#0a0a0a] border border-white/5 rounded-3xl p-5 sm:p-6 lg:p-8"
      : "bg-white border border-indigo-100 rounded-3xl p-5 sm:p-6 lg:p-8 shadow-md",
    
    sidebarTitle: isDark
      ? "text-sm font-black uppercase tracking-[0.2em] text-white"
      : "text-sm font-black uppercase tracking-[0.2em] text-slate-800",
    
    goalTask: isDark
      ? "text-[10px] font-bold text-slate-400"
      : "text-[10px] font-bold text-slate-600",
    
    goalCount: isDark
      ? "text-[9px] font-black text-amber-500"
      : "text-[9px] font-black text-indigo-600",
    
    achievementCard: (unlocked) => isDark
      ? `flex flex-col items-center justify-center p-4 rounded-2xl text-center transition-all ${unlocked ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-white/5 border border-white/10 opacity-50'}`
      : `flex flex-col items-center justify-center p-4 rounded-2xl text-center transition-all ${unlocked ? 'bg-indigo-50 border border-indigo-200' : 'bg-slate-50 border border-slate-100 opacity-50'}`,
    
    achievementLabel: isDark
      ? "text-[8px] font-bold uppercase text-slate-400"
      : "text-[8px] font-bold uppercase text-slate-500",
    
    quickLink: (active) => isDark
      ? `w-full flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all text-left font-bold ${active ? 'bg-amber-500/20 border border-amber-500/40 text-amber-400' : 'hover:bg-white/5 border border-white/5 text-slate-400 hover:text-white'}`
      : `w-full flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all text-left font-bold ${active ? 'bg-indigo-50 border border-indigo-200 text-indigo-600' : 'hover:bg-indigo-50 border border-indigo-100 text-slate-500 hover:text-indigo-600'}`,
    
    premiumCard: isDark
      ? "bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl p-5 sm:p-6 lg:p-8 text-black relative overflow-hidden"
      : "bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-5 sm:p-6 lg:p-8 text-white relative overflow-hidden",
    
    premiumButton: isDark
      ? "w-full py-3 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] transition-all active:scale-[0.98]"
      : "w-full py-3 bg-white text-indigo-600 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] transition-all active:scale-[0.98] shadow-md",
  };

  return (
    <div className={T.pageBg}>
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 lg:pt-32 pb-10 sm:pb-12">
        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={T.headerCard}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 sm:gap-6 min-w-0">
              <div className={T.avatar}>
                {user?.displayName?.charAt(0) || 'U'}
              </div>
              <div className="min-w-0">
                <h1 className={T.userName}>
                  {user?.displayName || 'User'}
                </h1>
                <p className={T.userEmail}>
                  {user?.email}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={T.toggleButton}
            >
              <span className={T.toggleText}>
                {sidebarOpen ? 'Focus' : 'Expand'}
              </span>
              <LayoutDashboard size={16} className={isDark ? "text-amber-500" : "text-indigo-600"} />
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
          
          <div className={`${sidebarOpen ? 'xl:col-span-8' : 'xl:col-span-12'} space-y-6 lg:space-y-8 transition-all duration-500 min-w-0`}>
            <div className="xl:hidden mb-2">
              <button
                onClick={() => setSidebarOpen((prev) => !prev)}
                className={T.mobileToggle}
              >
                <div>
                  <div className={T.mobileToggleLabel}>Analytics Panel</div>
                  <div className={T.mobileToggleText}>{sidebarOpen ? 'Hide side insights' : 'Show side insights'}</div>
                </div>
                <LayoutDashboard size={16} className={isDark ? "text-amber-500" : "text-indigo-600"} />
              </button>
            </div>
            
            {loading ? (
              <div className={T.loadingCard}>
                <div className={T.loadingSpinner} />
                <p className={T.loadingText}>Loading Analytics...</p>
              </div>
            ) : (
              <>
              {!parsedData ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={T.emptyStateCard}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                    <div className={T.emptyStateIcon}>
                      <Zap className={isDark ? "text-amber-500" : "text-indigo-600"} size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className={T.emptyStateTitle}>Get Started with Resume Analysis</h3>
                      <p className={T.emptyStateDesc}>Upload your resume to unlock personalized prep plans for your target companies</p>
                    </div>
                    <button
                      onClick={() => navigate('/resume-parsing')}
                      className={T.emptyStateButton}
                    >
                      Upload Resume
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <>
                  {/* Key Metrics Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {[
                      { label: 'Job Readiness', value: `${analytics?.jobReadiness ?? 0}%`, icon: Briefcase, color: 'from-indigo-500 to-purple-600', change: 'From company matches' },
                      { label: 'Daily Prep', value: `${dailyPrepProgress}%`, icon: TrendingUp, color: 'from-green-500 to-emerald-600', change: `${quizProgress.completed}/${quizProgress.total} answered • ${momentumScore}% momentum` },
                      { label: 'Companies', value: `${parsedData.companies?.length || 0}`, icon: Target, color: 'from-blue-500 to-cyan-600', change: 'Real matches' },
                      { label: 'Average Score', value: `${quizProgress.averageScore || 0}%`, icon: BookOpen, color: 'from-purple-500 to-pink-600', change: `${activeDays} active days` },
                    ].map((metric, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={T.metricCard}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <span className={T.metricLabel}>{metric.label}</span>
                          <div className={T.metricIconBg(metric.color)}>
                            <metric.icon size={16} className="text-white" />
                          </div>
                        </div>
                        <div className={T.metricValue}>{metric.value}</div>
                        <p className={T.metricChange}>{metric.change}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Progress Chart & Skills Heatmap */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* Improvement Graph */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className={T.sectionCard}
                    >
                      <div className="flex items-center justify-between gap-4 mb-6 lg:mb-8">
                        <div>
                          <h3 className={T.sectionTitle}>Progress Trend</h3>
                          <p className={T.sectionSubtitle}>Actual completion rate by day</p>
                        </div>
                        <BarChart3 size={20} className={isDark ? "text-amber-500" : "text-indigo-600"} />
                      </div>

                      {progressTrend.length > 0 ? (
                        <div className="space-y-3 sm:space-y-4">
                          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
                            const value = progressTrend[idx] || 0;
                            const height = Math.max(18, value * 1.25);
                            return (
                              <div key={idx} className="flex items-end gap-2 sm:gap-3">
                                <span className={T.dayLabel}>{day}</span>
                                <div className="flex-1 flex items-end gap-1">
                                  <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${height}px` }}
                                    transition={{ delay: 0.3 + idx * 0.1, duration: 0.6 }}
                                    className="flex-1 bg-gradient-to-t from-indigo-500 to-purple-500 rounded-sm"
                                  />
                                </div>
                                <span className={T.dayValue}>{value}%</span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="min-h-[220px] sm:min-h-[260px] flex flex-col items-center justify-center text-center border border-dashed border-indigo-200 rounded-2xl bg-indigo-50/30 px-6">
                          <BarChart3 size={28} className="text-slate-400 mb-3" />
                          <p className="text-sm font-black text-slate-800 mb-1">No daily prep data yet</p>
                          <p className="text-xs text-slate-500 max-w-sm">Answer a few practice questions and the dashboard will build a real trend line from your activity.</p>
                        </div>
                      )}
                    </motion.div>

                    {/* Skills Distribution Heatmap */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className={T.sectionCard}
                    >
                      <div className="flex items-center justify-between gap-4 mb-6 lg:mb-8">
                        <div>
                          <h3 className={T.sectionTitle}>Skills Proficiency</h3>
                          <p className={T.sectionSubtitle}>Derived from your matched companies</p>
                        </div>
                        <Flame size={20} className={isDark ? "text-amber-500" : "text-indigo-600"} />
                      </div>

                      {skillProficiency.length > 0 ? (
                        <div className="space-y-3">
                          {skillProficiency.map((skill, idx) => (
                            <div key={idx}>
                              <div className="flex justify-between items-center mb-2">
                                <span className={T.skillName}>{skill.name}</span>
                                <span className={T.skillPercent}>{skill.proficiency}%</span>
                              </div>
                              <div className="h-2 bg-indigo-100 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${skill.proficiency}%` }}
                                  transition={{ delay: 0.4 + idx * 0.1, duration: 0.8 }}
                                  className={`h-full bg-gradient-to-r ${
                                    skill.proficiency >= 80 ? 'from-green-500 to-emerald-600' : 
                                    skill.proficiency >= 60 ? 'from-indigo-500 to-purple-600' : 
                                    'from-orange-500 to-red-500'
                                  } rounded-full`}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="min-h-[200px] sm:min-h-[220px] flex flex-col items-center justify-center text-center border border-dashed border-indigo-200 rounded-2xl bg-indigo-50/30 px-6">
                          <Flame size={28} className="text-slate-400 mb-3" />
                          <p className="text-sm font-black text-slate-800 mb-1">No skill profile yet</p>
                          <p className="text-xs text-slate-500 max-w-sm">Company matches will populate this chart with real proficiency signals once your resume analysis is available.</p>
                        </div>
                      )}
                    </motion.div>
                  </div>

                  {/* Company Match Heatmap */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className={T.sectionCard}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 lg:mb-8">
                      <div>
                        <h3 className={T.sectionTitle}>Company Match Heatmap</h3>
                        <p className={T.sectionSubtitle}>{parsedData.companies?.length || 0} companies analyzed</p>
                      </div>
                      <Target size={20} className={isDark ? "text-amber-500" : "text-indigo-600"} />
                    </div>

                    <div className="space-y-5 sm:space-y-6">
                      {parsedData.companies?.slice(0, 6).map((company, idx) => (
                        <div key={idx}>
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-black text-white">
                                {company.name.charAt(0)}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-black uppercase truncate text-slate-800">{company.name}</p>
                                <p className="text-[9px] text-slate-500 font-bold truncate">{company.location}</p>
                              </div>
                            </div>
                            <div className="text-left sm:text-right">
                              <p className="text-lg font-black text-indigo-600">{company.matchScore}%</p>
                              <p className="text-[9px] text-slate-500 font-bold">Match Score</p>
                            </div>
                          </div>
                          
                          <div className="h-3 bg-indigo-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(100, company.matchScore)}%` }}
                              transition={{ delay: 0.5 + idx * 0.1, duration: 0.8 }}
                              className={`h-full rounded-full ${
                                company.matchScore >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                                company.matchScore >= 60 ? 'bg-gradient-to-r from-indigo-500 to-purple-600' :
                                'bg-gradient-to-r from-orange-500 to-red-500'
                              }`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {parsedData.companies?.length > 6 && (
                      <button 
                        onClick={() => navigate('/resume-parsing')}
                        className={T.viewAllButton}
                      >
                        View All {parsedData.companies.length} Companies
                        <ArrowRight size={12} />
                      </button>
                    )}
                  </motion.div>

                  {/* Prep Plans Grid */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-6 lg:space-y-8 mt-8 pt-8 border-t border-indigo-100"
                  >
                    <div className="flex items-center justify-between px-2">
                      <h3 className="text-xs sm:text-sm font-black uppercase tracking-[0.3em] text-slate-400">Your Prep Plans</h3>
                      <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-[0.2em] border border-indigo-200">{parsedData.companies?.length || 0} Active</span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                      {parsedData.companies?.map((company, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 + i * 0.1 }}
                          className={T.companyCard}
                        >
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="min-w-0">
                              <h4 className={T.companyName}>{company.name}</h4>
                              <p className={T.companyLocation}>{company.location}</p>
                            </div>
                            <div className="text-right">
                              <div className={T.matchScore}>{company.matchScore}%</div>
                              <p className={T.matchLabel}>Match</p>
                            </div>
                          </div>
                          
                          <div className="h-1 w-full bg-indigo-100 rounded-full overflow-hidden mb-4">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(100, company.matchScore)}%` }}
                              transition={{ delay: 0.6 + i * 0.1 + 0.3, duration: 0.8 }}
                              className="h-full bg-indigo-600"
                            />
                          </div>
                          
                          <p className={T.matchReason}>{company.matchReason}</p>
                          
                          <button 
                            onClick={() => handleViewPlan(company.name)}
                            className={T.planButton}
                          >
                            {unlockedCompany === company.name ? 'View Plan' : (unlockedCompany ? 'Upgrade' : 'Start Free')}
                            <ArrowRight size={12} />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
              </>
            )}
          </div>

          {/* Sidebar / Advanced Analytics */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="xl:col-span-4 space-y-6 lg:space-y-8"
              >
                {/* Weekly Goals */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className={T.sidebarCard}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Calendar size={18} className={isDark ? "text-amber-500" : "text-indigo-600"} />
                    <h3 className={T.sidebarTitle}>This Week's Goals</h3>
                  </div>
                  {weeklyGoals.length > 0 ? (
                    <div className="space-y-4">
                      {weeklyGoals.map((goal, idx) => (
                        <div key={idx}>
                          <div className="flex justify-between items-center mb-2">
                            <span className={T.goalTask}>{goal.task}</span>
                            <span className={T.goalCount}>{goal.completed}/{goal.total}</span>
                          </div>
                          <div className="h-2 bg-indigo-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${goal.total > 0 ? (goal.completed / goal.total) * 100 : 0}%` }}
                              transition={{ delay: 0.2 + idx * 0.1, duration: 0.6 }}
                              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/30 p-6 text-center">
                      <Calendar size={24} className="text-slate-400 mx-auto mb-3" />
                      <p className="text-sm font-black text-slate-800 mb-1">No weekly goals found</p>
                      <p className="text-xs text-slate-500">Add goals in Firestore to show your live weekly prep plan here.</p>
                    </div>
                  )}
                </motion.div>

                {/* Achievements */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={T.sidebarCard}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Award size={18} className={isDark ? "text-amber-500" : "text-indigo-600"} />
                    <h3 className={T.sidebarTitle}>Achievements</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { icon: '🔥', label: `${analytics?.achievements?.streakDays || 0}-Day Streak`, unlocked: (analytics?.achievements?.streakDays || 0) > 0 },
                      { icon: '⭐', label: 'Expert Mode', unlocked: analytics?.achievements?.expertModeUnlocked || false },
                      { icon: '🎯', label: `${analytics?.achievements?.perfectMatches || 0} Perfect Matches`, unlocked: (analytics?.achievements?.perfectMatches || 0) > 0 }
                    ].map((achievement, idx) => (
                      <div 
                        key={idx}
                        className={T.achievementCard(achievement.unlocked)}
                      >
                        <span className="text-2xl mb-1">{achievement.icon}</span>
                        <p className={T.achievementLabel}>{achievement.label}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Quick Navigation */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className={T.sidebarCard}
                >
                  <h3 className={T.sidebarTitle}>Quick Links</h3>
                  <nav className="space-y-3 mt-4">
                    {[
                      { icon: FileText, label: 'Resume Analysis', action: () => navigate('/resume-parsing'), active: false },
                      { icon: Target, label: 'Interview Prep', action: () => navigate('/mock-interview'), active: false },
                      { icon: BarChart3, label: 'Analytics', action: () => {}, active: true },
                      { icon: Settings, label: 'Preferences', action: () => {}, active: false }
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        onClick={item.action}
                        className={T.quickLink(item.active)}
                      >
                        <item.icon size={16} />
                        <span className="text-[11px] uppercase">{item.label}</span>
                        {item.active && <ChevronRight size={12} className="ml-auto" />}
                      </button>
                    ))}
                  </nav>
                </motion.div>

                {/* Premium CTA */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className={T.premiumCard}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-[60px] -mr-16 -mt-16 rounded-full" />
                  <div className="flex items-center gap-2 mb-3">
                    <Crown size={18} />
                    <h3 className="font-black text-sm uppercase">Premium</h3>
                  </div>
                  <p className="text-[11px] font-bold mb-6 leading-relaxed opacity-90">Unlock AI mock interviews, direct HR referrals & advanced analytics.</p>
                  <button className={T.premiumButton}>Upgrade Now</button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;