import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  TrendingUp, 
  Target, 
  ArrowRight,
  CloudUpload,
  ArrowLeft,
  Search,
  Plus,
  X,
  Sparkles,
  Zap,
  Briefcase,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import ResumePanel from '../components/sections/ResumePanel';
import { uploadResume, getUserResults, saveSelectedCompany } from '../services/resumeService';
import { basicCompanyCatalog } from '../data/mockCompanies';

const ResumeParsing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDark } = useTheme();
  
  const [hasUploaded, setHasUploaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [onboardingMode, setOnboardingMode] = useState('choice');
  const [isLoadingPersistent, setIsLoadingPersistent] = useState(true);
  const [unlockedCompany, setUnlockedCompany] = useState(localStorage.getItem('unlockedCompany') || null);
  const [companySearch, setCompanySearch] = useState('');
  const [selectedBasicsCompany, setSelectedBasicsCompany] = useState('');
  const [showAllBasicsCompanies, setShowAllBasicsCompanies] = useState(false);

  const normalizedSearch = companySearch.trim().toLowerCase();
  const filteredBasicsCompanies = basicCompanyCatalog.filter((company) =>
    company.toLowerCase().includes(normalizedSearch)
  );
  const visibleBasicsCompanies =
    showAllBasicsCompanies || normalizedSearch
      ? filteredBasicsCompanies
      : filteredBasicsCompanies.slice(0, 8);

  const handleSelectBasicsCompany = (company) => {
    setSelectedBasicsCompany(company);
  };

  const handleClearSelectedBasicsCompany = () => {
    setSelectedBasicsCompany('');
  };

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
    const checkExistingData = async () => {
      if (user?.uid) {
        setIsLoadingPersistent(true);
        const existingData = await getUserResults(user.uid);
        if (existingData) {
          setHasUploaded(true);
          setParsedData(existingData);
        }
        setIsLoadingPersistent(false);
      }
    };
    checkExistingData();
  }, [user]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const result = await uploadResume(file, user.uid, user.email);
      
      if (result.success) {
        setHasUploaded(true);
        setParsedData(result.data);
        console.log('✅ AI Parser: Resume Received', result.data);
      } else {
        setError("Network error. Please ensure n8n is active.");
        console.error('❌ AI Parser Error:', result.error);
      }
    } catch (err) {
      setError("Failed to reach intelligence node.");
    } finally {
      setIsUploading(false);
    }
  };

  /* ── Theme tokens ────────────────────────────────────────────── */
  const T = {
    pageBg: isDark
      ? "min-h-screen bg-black text-white selection:bg-amber-500/30"
      : "min-h-screen bg-gradient-to-br from-[#F8FAFC] via-white to-[#F1F5F9] text-slate-800 selection:bg-indigo-500/30",
    
    backButton: isDark
      ? "flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-amber-500 transition-colors mb-12"
      : "flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors mb-12",
    
    headerTitle: isDark
      ? "text-4xl font-black tracking-tight mb-2 uppercase italic text-white"
      : "text-4xl font-black tracking-tight mb-2 uppercase italic text-slate-800",
    
    headerAccent: isDark
      ? "text-amber-500"
      : "text-indigo-600",
    
    headerSubtext: isDark
      ? "text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]"
      : "text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]",
    
    loadingContainer: isDark
      ? "bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-20 flex flex-col items-center justify-center"
      : "bg-white border border-indigo-100 rounded-[2.5rem] p-20 flex flex-col items-center justify-center shadow-lg",
    
    loadingSpinner: isDark
      ? "w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-6"
      : "w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6",
    
    loadingText: isDark
      ? "text-[10px] font-black uppercase tracking-widest text-slate-500"
      : "text-[10px] font-black uppercase tracking-widest text-slate-400",
    
    choiceCard: (isResume) => isDark
      ? `bg-[#0a0a0a] border ${isResume ? 'border-amber-500/20' : 'border-white/5'} rounded-[2.5rem] p-10 cursor-pointer hover:border-amber-500/50 transition-all group relative overflow-hidden`
      : `bg-white border ${isResume ? 'border-indigo-200' : 'border-indigo-100'} rounded-[2.5rem] p-10 cursor-pointer hover:border-indigo-400 transition-all group relative overflow-hidden shadow-md hover:shadow-xl`,
    
    choiceIconBg: (isResume) => isDark
      ? `w-16 h-16 ${isResume ? 'bg-amber-500/10' : 'bg-white/5'} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`
      : `w-16 h-16 ${isResume ? 'bg-indigo-100' : 'bg-indigo-50'} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`,
    
    choiceTitle: isDark
      ? "text-xl font-black mb-2 uppercase italic text-white"
      : "text-xl font-black mb-2 uppercase italic text-slate-800",
    
    choiceDesc: isDark
      ? "text-slate-500 text-xs font-medium leading-relaxed"
      : "text-slate-500 text-xs font-medium leading-relaxed",
    
    uploadCard: isDark
      ? "bg-[#0a0a0a] border border-amber-500/20 rounded-[2.5rem] p-12 relative overflow-hidden group shadow-2xl shadow-amber-500/5"
      : "bg-white border border-indigo-200 rounded-[2.5rem] p-12 relative overflow-hidden group shadow-xl",
    
    uploadGlow: isDark
      ? "absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[80px] -mr-32 -mt-32 rounded-full group-hover:bg-amber-500/10 transition-colors"
      : "absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[80px] -mr-32 -mt-32 rounded-full group-hover:bg-indigo-500/10 transition-colors",
    
    uploadIcon: isDark
      ? "w-20 h-20 bg-amber-500/10 rounded-3xl flex items-center justify-center mb-8 border border-white/5 shadow-inner"
      : "w-20 h-20 bg-indigo-100 rounded-3xl flex items-center justify-center mb-8 border border-indigo-200 shadow-sm",
    
    uploadTitle: isDark
      ? "text-2xl font-black mb-4 uppercase tracking-wider text-white"
      : "text-2xl font-black mb-4 uppercase tracking-wider text-slate-800",
    
    uploadDesc: isDark
      ? "text-slate-500 text-sm max-w-md mb-10 leading-relaxed font-medium"
      : "text-slate-500 text-sm max-w-md mb-10 leading-relaxed font-medium",
    
    uploadButton: isDark
      ? "px-12 py-5 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest text-xs rounded-full transition-all flex items-center gap-3 active:scale-95 shadow-xl shadow-amber-500/20"
      : "px-12 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black uppercase tracking-widest text-xs rounded-full transition-all flex items-center gap-3 active:scale-95 shadow-xl shadow-indigo-500/20",
    
    uploadHint: isDark
      ? "mt-6 text-[10px] text-slate-600 font-bold uppercase tracking-widest"
      : "mt-6 text-[10px] text-slate-400 font-bold uppercase tracking-widest",
    
    basicsCard: isDark
      ? "bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-12"
      : "bg-white border border-indigo-100 rounded-[2.5rem] p-12 shadow-lg",
    
    basicsTitle: isDark
      ? "text-2xl font-black mb-4 uppercase italic text-white"
      : "text-2xl font-black mb-4 uppercase italic text-slate-800",
    
    basicsSubtext: isDark
      ? "text-slate-500 text-sm mb-8 font-bold uppercase tracking-widest"
      : "text-slate-400 text-sm mb-8 font-bold uppercase tracking-widest",
    
    searchInput: isDark
      ? "w-full bg-black/50 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/40"
      : "w-full bg-white border border-indigo-200 rounded-2xl pl-12 pr-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 shadow-sm",
    
    selectedCompany: isDark
      ? "text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3"
      : "text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3",
    
    selectedCompanyBadge: isDark
      ? "inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full"
      : "inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-100 border border-indigo-200 rounded-full",
    
    selectedCompanyText: isDark
      ? "text-[10px] font-black uppercase tracking-wider text-amber-400"
      : "text-[10px] font-black uppercase tracking-wider text-indigo-600",
    
    companyButton: (isSelected) => isDark
      ? `p-4 border rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-between ${
          isSelected
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            : 'bg-white/5 border-white/5 hover:border-amber-500/50 text-white'
        }`
      : `p-4 border rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-between ${
          isSelected
            ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
            : 'bg-white border-indigo-100 hover:border-indigo-400 text-slate-700 shadow-sm'
        }`,
    
    showMoreButton: isDark
      ? "px-5 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-amber-500/40"
      : "px-5 py-2 bg-indigo-50 border border-indigo-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:bg-indigo-100",
    
    startPlanButton: isDark
      ? "px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black rounded-xl font-black text-[10px] uppercase tracking-widest transition-colors shadow-lg"
      : "px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-colors shadow-md",
    
    progressCard: isDark
      ? "bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-8 hover:border-amber-500/20 transition-all group"
      : "bg-white border border-indigo-100 rounded-[2rem] p-8 hover:border-indigo-300 transition-all group shadow-md hover:shadow-xl",
    
    progressIconBg: (color) => isDark
      ? `p-3 ${color === 'green' ? 'bg-green-500/10' : 'bg-amber-500/10'} rounded-2xl border ${color === 'green' ? 'border-green-500/20' : 'border-amber-500/20'}`
      : `p-3 ${color === 'green' ? 'bg-green-100' : 'bg-indigo-100'} rounded-2xl border ${color === 'green' ? 'border-green-200' : 'border-indigo-200'}`,
    
    progressBadge: (color) => isDark
      ? `text-[10px] font-black ${color === 'green' ? 'text-green-500' : 'text-amber-500'} bg-white/5 px-3 py-1 rounded-full uppercase tracking-widest`
      : `text-[10px] font-black ${color === 'green' ? 'text-green-600' : 'text-indigo-600'} bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest`,
    
    progressTitle: isDark
      ? "text-lg font-black mb-2 uppercase tracking-wide text-white"
      : "text-lg font-black mb-2 uppercase tracking-wide text-slate-800",
    
    progressText: isDark
      ? "text-slate-500 text-xs leading-relaxed font-medium mb-6"
      : "text-slate-500 text-xs leading-relaxed font-medium mb-6",
    
    progressBar: isDark
      ? "h-1.5 w-full bg-white/5 rounded-full overflow-hidden"
      : "h-1.5 w-full bg-indigo-100 rounded-full overflow-hidden",
    
    progressBarFill: (color) => isDark
      ? `h-full ${color === 'green' ? 'bg-green-500' : 'bg-amber-500'} shadow-[0_0_10px_rgba(34,197,94,0.3)]`
      : `h-full ${color === 'green' ? 'bg-green-500' : 'bg-indigo-600'} shadow-sm`,
    
    companyAvatar: isDark
      ? "w-8 h-8 rounded-full border-2 border-black bg-amber-500 flex items-center justify-center text-[8px] font-black text-black uppercase"
      : "w-8 h-8 rounded-full border-2 border-white bg-indigo-600 flex items-center justify-center text-[8px] font-black text-white uppercase",
    
    matchesHeader: isDark
      ? "flex items-center justify-between px-2"
      : "flex items-center justify-between px-2",
    
    matchesTitle: isDark
      ? "text-sm font-black uppercase tracking-[0.3em] text-slate-500"
      : "text-sm font-black uppercase tracking-[0.3em] text-slate-400",
    
    matchesBadge: isDark
      ? "text-[10px] font-black text-amber-500 bg-amber-500/5 px-3 py-1 rounded-full uppercase tracking-[0.2em] border border-amber-500/20"
      : "text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-[0.2em] border border-indigo-200",
    
    companyMatchCard: isDark
      ? "bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-10 hover:bg-white/[0.01] transition-all group relative overflow-hidden"
      : "bg-white border border-indigo-100 rounded-[3rem] p-10 hover:shadow-xl transition-all group relative overflow-hidden",
    
    companyIcon: isDark
      ? "w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/20"
      : "w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center border border-indigo-200",
    
    companyName: isDark
      ? "text-2xl font-black uppercase italic tracking-tight text-white"
      : "text-2xl font-black uppercase italic tracking-tight text-slate-800",
    
    companyLocation: isDark
      ? "text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]"
      : "text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]",
    
    matchScoreText: isDark
      ? "absolute text-[10px] font-black italic text-amber-500"
      : "absolute text-[10px] font-black italic text-indigo-600",
    
    readinessBadge: (ready) => isDark
      ? `inline-block px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest mb-6 ${ready === 'ready' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`
      : `inline-block px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest mb-6 ${ready === 'ready' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-amber-100 text-amber-700 border border-amber-200'}`,
    
    matchReason: isDark
      ? "text-slate-400 text-xs leading-relaxed font-medium mb-8 italic"
      : "text-slate-500 text-xs leading-relaxed font-medium mb-8 italic",
    
    viewPlanButton: isDark
      ? "px-6 py-3 bg-amber-500 text-black font-black uppercase tracking-widest text-[9px] rounded-xl hover:bg-amber-400 transition-all active:scale-95 flex items-center gap-2"
      : "px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black uppercase tracking-widest text-[9px] rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all active:scale-95 flex items-center gap-2 shadow-sm",
    
    careersLink: isDark
      ? "flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-white transition-all"
      : "flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-indigo-600 transition-all",
    
    skillBadge: isDark
      ? "px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-[9px] font-black uppercase text-slate-300"
      : "px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-lg text-[9px] font-black uppercase text-indigo-600",
    
    focusItem: isDark
      ? "flex items-center gap-2 text-[10px] font-bold text-slate-400"
      : "flex items-center gap-2 text-[10px] font-bold text-slate-600",
    
    focusDot: isDark
      ? "w-1 h-1 rounded-full bg-amber-500"
      : "w-1 h-1 rounded-full bg-indigo-600",
    
    warningBox: isDark
      ? "p-4 bg-red-500/5 border border-red-500/10 rounded-2xl"
      : "p-4 bg-red-50 border border-red-200 rounded-2xl",
    
    warningText: isDark
      ? "text-[9px] font-black text-red-400 uppercase tracking-widest leading-relaxed"
      : "text-[9px] font-black text-red-600 uppercase tracking-widest leading-relaxed",
    
    errorBox: isDark
      ? "mt-8 bg-red-500/5 border border-red-500/20 text-red-300 text-xs font-bold uppercase tracking-widest rounded-2xl px-6 py-4"
      : "mt-8 bg-red-50 border border-red-200 text-red-600 text-xs font-bold uppercase tracking-widest rounded-2xl px-6 py-4",
  };

  return (
    <div className={T.pageBg}>
      <Navbar />
      
      <main className="w-full max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-20 pt-32 pb-12">
        <button 
          onClick={() => navigate('/dashboard')}
          className={T.backButton}
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </button>

        <header className="mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className={T.headerTitle}>
              Resume <span className={T.headerAccent}>Parsing</span>
            </h1>
            <p className={T.headerSubtext}>
              Upload and analyze your career profile with AI intelligence
            </p>
          </motion.div>
        </header>

        <div className="w-full">
          {isLoadingPersistent ? (
             <div className={T.loadingContainer}>
                <div className={T.loadingSpinner} />
                <p className={T.loadingText}>Checking Persistence...</p>
             </div>
          ) : (
            <>
            <AnimatePresence mode="wait">
              {!hasUploaded && onboardingMode === 'choice' && (
                <motion.div
                  key="choice"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10"
                >
                  <div 
                    onClick={() => setOnboardingMode('upload')}
                    className={T.choiceCard(true)}
                  >
                    <div className="absolute -right-8 -bottom-8 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity">
                       <FileText size={240} />
                    </div>
                    <div className={T.choiceIconBg(true)}>
                      <Upload className={isDark ? "text-amber-500" : "text-indigo-600"} size={28} />
                    </div>
                    <h3 className={T.choiceTitle}>I have a Resume</h3>
                    <p className={T.choiceDesc}>Let AI parse your history and find your perfect career match instantly.</p>
                  </div>

                  <div 
                    onClick={() => setOnboardingMode('basics')}
                    className={T.choiceCard(false)}
                  >
                    <div className="absolute -right-8 -bottom-8 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity">
                       <TrendingUp size={240} />
                    </div>
                    <div className={T.choiceIconBg(false)}>
                      <TrendingUp className={isDark ? "text-amber-500" : "text-indigo-600"} size={28} />
                    </div>
                    <h3 className={T.choiceTitle}>Start from Basics</h3>
                    <p className={T.choiceDesc}>Early in your journey? Start your preparation roadmap from scratch.</p>
                  </div>
                </motion.div>
              )}

              {!hasUploaded && onboardingMode === 'upload' && (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={T.uploadCard}
                >
                  <button 
                    onClick={() => setOnboardingMode('choice')}
                    className="absolute top-8 left-8 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white"
                  >
                    ← Back
                  </button>
                  <div className={T.uploadGlow} />
                  
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className={T.uploadIcon}>
                      <CloudUpload className={isDark ? "text-amber-500" : "text-indigo-600"} size={32} />
                    </div>
                    <h2 className={T.uploadTitle}>Initialize AI Analysis</h2>
                    <p className={T.uploadDesc}>
                      Your career journey starts here. Upload your resume to allow our AI to parse your skills, match you with top companies, and build your personalized roadmap.
                    </p>
                    
                    <label className="cursor-pointer group">
                      <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileUpload} disabled={isUploading} />
                      <div className={T.uploadButton}>
                        {isUploading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                            Processing Resume...
                          </>
                        ) : (
                          <>
                            Upload Your PDF
                            <ArrowRight size={20} />
                          </>
                        )}
                      </div>
                    </label>
                    <p className={T.uploadHint}>Supports PDF, DOCX (Max 10MB)</p>

                    <div className="w-full mt-12">
                      <ResumePanel parsedData={parsedData} isLoading={isUploading} />
                    </div>
                  </div>
                </motion.div>
              )}

              {!hasUploaded && onboardingMode === 'basics' && (
                <motion.div
                  key="basics"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={T.basicsCard}
                >
                  <button 
                    onClick={() => setOnboardingMode('choice')}
                    className="mb-8 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600"
                  >
                    ← Back
                  </button>
                  <h2 className={T.basicsTitle}>Choose Your Target Company</h2>
                  <p className={T.basicsSubtext}>Search and add companies to build your target list</p>

                  <div className="mb-6 relative">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      value={companySearch}
                      onChange={(e) => {
                        setCompanySearch(e.target.value);
                        if (!showAllBasicsCompanies) setShowAllBasicsCompanies(true);
                      }}
                      placeholder="Search companies..."
                      className={T.searchInput}
                    />
                  </div>

                  {selectedBasicsCompany && (
                    <div className="mb-6">
                      <p className={T.selectedCompany}>Selected Company</p>
                      <div className={T.selectedCompanyBadge}>
                        <span className={T.selectedCompanyText}>{selectedBasicsCompany}</span>
                        <button onClick={handleClearSelectedBasicsCompany} className="text-slate-400 hover:text-slate-600" aria-label="Clear selection"><X size={12} /></button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {visibleBasicsCompanies.map((company) => {
                      const isSelected = selectedBasicsCompany === company;
                      return (
                        <button
                          key={company}
                          onClick={() => handleSelectBasicsCompany(company)}
                          className={T.companyButton(isSelected)}
                        >
                          <span>{company}</span>
                          {isSelected ? <CheckCircle size={14} /> : <Plus size={14} />}
                        </button>
                      );
                    })}
                  </div>

                  {!normalizedSearch && filteredBasicsCompanies.length > 8 && (
                    <div className="mt-6 flex justify-center">
                      <button
                        onClick={() => setShowAllBasicsCompanies((prev) => !prev)}
                        className={T.showMoreButton}
                      >
                        {showAllBasicsCompanies ? 'Show Less' : `Show More (${filteredBasicsCompanies.length - 8} more)`}
                      </button>
                    </div>
                  )}

                  {visibleBasicsCompanies.length === 0 && (
                    <p className="mt-6 text-center text-xs text-slate-500 font-medium">No company matched your search.</p>
                  )}
                  <div className="mt-6 text-center">
                    <button
                      onClick={async () => {
                        if (!user?.uid) return setError('Please sign in to continue');
                        if (!selectedBasicsCompany) return setError('Select one company to continue');
                        setError(null);
                        const res = await saveSelectedCompany(user.uid, selectedBasicsCompany);
                        if (res.success) {
                          navigate(`/plan/${selectedBasicsCompany}`);
                        } else {
                          setError(res.error || 'Failed to save selection');
                        }
                      }}
                      className={T.startPlanButton}
                    >
                      Start Plan with Selected Company
                    </button>
                  </div>
                </motion.div>
              )}

              {hasUploaded && (
                <motion.div
                  key="progress"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div className={T.progressCard}>
                    <div className="flex justify-between items-start mb-6">
                      <div className={T.progressIconBg('green')}>
                        <CheckCircle className="text-green-500" size={24} />
                      </div>
                      <span className={T.progressBadge('green')}>Analysis Complete</span>
                    </div>
                    <h3 className={T.progressTitle}>Resume Intelligence</h3>
                    <p className={T.progressText}>Level Detected: <span className={isDark ? "text-amber-500 font-black uppercase italic" : "text-indigo-600 font-black uppercase italic"}>{parsedData?.level || 'N/A'}</span></p>
                    <div className={T.progressBar}>
                      <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} className={T.progressBarFill('green')} />
                    </div>
                  </div>

                  <div className={T.progressCard}>
                    <div className="flex justify-between items-start mb-6">
                      <div className={T.progressIconBg('amber')}>
                        <Target className={isDark ? "text-amber-500" : "text-indigo-600"} size={24} />
                      </div>
                      <span className={T.progressBadge('amber')}>{parsedData?.companies?.length || 0} Matches Found</span>
                    </div>
                    <h3 className={T.progressTitle}>Company Pipeline</h3>
                    <p className={T.progressText}>Your profile is a high match for Tier 1 tech startups and product companies.</p>
                    <div className="flex -space-x-3">
                       {parsedData?.companies?.slice(0, 5).map((c, i) => (
                         <div key={i} className={T.companyAvatar}>
                           {c.name.substring(0, 2)}
                         </div>
                       ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {parsedData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12 mt-12"
              >
                <div className="space-y-8">
                  <div className={T.matchesHeader}>
                     <h3 className={T.matchesTitle}>Career Trajectory Matches</h3>
                     <span className={T.matchesBadge}>Deep AI Benchmarking</span>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-8">
                    {parsedData.companies.map((company, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={T.companyMatchCard}
                      >
                        <div className="flex flex-col md:flex-row gap-10 items-start">
                          <div className="w-full md:w-64 shrink-0">
                            <div className="flex justify-between items-start mb-8">
                              <div className="flex items-center gap-4">
                                <div className={T.companyIcon}>
                                  <Target className={isDark ? "text-amber-500" : "text-indigo-600"} size={24} />
                                </div>
                                <div>
                                  <h4 className={T.companyName}>{company.name}</h4>
                                  <p className={T.companyLocation}>{company.location}</p>
                                </div>
                              </div>
                              
                              <div className="relative w-16 h-16 flex items-center justify-center">
                                 <svg className="w-16 h-16 transform -rotate-90">
                                    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="3" fill="transparent" className={isDark ? "text-white/5" : "text-indigo-100"} />
                                    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="3" fill="transparent" strokeDasharray={176} strokeDashoffset={176 - (176 * company.matchScore) / 100} className={isDark ? "text-amber-500" : "text-indigo-600"} />
                                 </svg>
                                 <span className={T.matchScoreText}>{company.matchScore}%</span>
                              </div>
                            </div>

                            <div className={T.readinessBadge(company.applyReadiness)}>
                              {company.applyReadiness.replace('_', ' ')} • {company.type}
                            </div>
                            
                            <p className={T.matchReason}>&ldquo;{company.matchReason}&rdquo;</p>
                            
                            <div className="flex items-center gap-4">
                              <button 
                                onClick={() => handleViewPlan(company.name)}
                                className={T.viewPlanButton}
                              >
                                {unlockedCompany === company.name ? 'View Prep Plan' : (unlockedCompany ? 'Unlock Plan 🔒' : 'Unlock Free Plan')}
                                <ArrowRight size={14} />
                              </button>
                              <a href={company.careersUrl} target="_blank" rel="noreferrer" className={T.careersLink}>
                                Careers
                              </a>
                            </div>
                          </div>

                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 w-full border-t md:border-t-0 md:border-l border-indigo-100 pt-10 md:pt-0 md:pl-10">
                            <div>
                              <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Skill Overlap</h5>
                              <div className="flex flex-wrap gap-2">
                                {company.skillOverlap.map((skill, si) => (
                                  <span key={si} className={T.skillBadge}>
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Interview Focus</h5>
                              <div className="space-y-2">
                                {company.interviewFocus.map((focus, fi) => (
                                  <div key={fi} className={T.focusItem}>
                                    <div className={T.focusDot} />
                                    {focus}
                                  </div>
                                ))}
                              </div>
                            </div>
                            {company.weakAreaWarning !== "None" && (
                              <div className={T.warningBox}>
                                 <p className={T.warningText}>⚠️ Warning: {company.weakAreaWarning}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {error && (
              <div className={T.errorBox}>
                {error}
              </div>
            )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ResumeParsing;