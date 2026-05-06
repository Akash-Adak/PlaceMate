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
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import ResumePanel from '../components/sections/ResumePanel';
import { uploadResume, getUserResults, saveSelectedCompany } from '../services/resumeService';
import { basicCompanyCatalog } from '../data/mockCompanies';

const ResumeParsing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
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

  return (
    <div className="min-h-screen bg-black text-white selection:bg-amber-500/30">
      <Navbar />
      
      <main className="w-full max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-20 pt-32 pb-12">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-amber-500 transition-colors mb-12"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </button>

        <header className="mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-black tracking-tight mb-2 uppercase italic">
              Resume <span className="text-amber-500">Parsing</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">
              Upload and analyze your career profile with AI intelligence
            </p>
          </motion.div>
        </header>

        <div className="w-full">
          {isLoadingPersistent ? (
             <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-20 flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-6" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Checking Persistence...</p>
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
                    className="bg-[#0a0a0a] border border-amber-500/20 rounded-[2.5rem] p-12 lg:p-16 cursor-pointer hover:border-amber-500/50 transition-all group relative overflow-hidden flex flex-col justify-center"
                  >
                    <div className="absolute -right-8 -bottom-8 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity">
                       <FileText size={240} />
                    </div>
                    <div className="w-20 h-20 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                      <Upload className="text-amber-500" size={36} />
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-black mb-3 uppercase italic">I have a Resume</h3>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-lg">Let AI parse your history and find your perfect career match instantly.</p>
                  </div>

                  <div 
                    onClick={() => setOnboardingMode('basics')}
                    className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-12 lg:p-16 cursor-pointer hover:border-amber-500/50 transition-all group relative overflow-hidden flex flex-col justify-center"
                  >
                    <div className="absolute -right-8 -bottom-8 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity">
                       <TrendingUp size={240} />
                    </div>
                    <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                      <TrendingUp className="text-amber-500" size={36} />
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-black mb-3 uppercase italic">Start from Basics</h3>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-lg">Early in your journey? Start your preparation roadmap from scratch.</p>
                  </div>
                </motion.div>
              )}

              {!hasUploaded && onboardingMode === 'upload' && (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-[#0a0a0a] border border-amber-500/20 rounded-[2.5rem] p-12 lg:p-20 relative overflow-hidden group shadow-2xl shadow-amber-500/5"
                >
                  <button 
                    onClick={() => setOnboardingMode('choice')}
                    className="absolute top-8 left-8 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white"
                  >
                    ← Back
                  </button>
                  <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 blur-[100px] -mr-32 -mt-32 rounded-full group-hover:bg-amber-500/10 transition-colors" />
                  
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-amber-500/10 rounded-3xl flex items-center justify-center mb-10 border border-white/5 shadow-inner">
                      <CloudUpload className="text-amber-500" size={40} />
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-black mb-6 uppercase tracking-wider">Initialize AI Analysis</h2>
                    <p className="text-slate-500 text-base max-w-2xl mb-12 leading-relaxed font-medium">
                      Your career journey starts here. Upload your resume to allow our AI to parse your skills, match you with top companies, and build your personalized roadmap.
                    </p>
                    
                    <label className="cursor-pointer group">
                      <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileUpload} disabled={isUploading} />
                      <div className="px-14 py-6 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest text-sm rounded-full transition-all flex items-center gap-4 active:scale-95 shadow-xl shadow-amber-500/20">
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
                    <p className="mt-8 text-[11px] text-slate-600 font-bold uppercase tracking-widest">Supports PDF, DOCX (Max 10MB)</p>

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
                  className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-12 lg:p-20"
                >
                  <button 
                    onClick={() => setOnboardingMode('choice')}
                    className="mb-8 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white"
                  >
                    ← Back
                  </button>
                  <h2 className="text-3xl font-black mb-4 uppercase italic">Choose Your Target Company</h2>
                  <p className="text-slate-500 text-base mb-10 font-bold uppercase tracking-widest">Search and add companies to build your target list</p>

                  <div className="mb-8 relative max-w-3xl">
                    <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      value={companySearch}
                      onChange={(e) => {
                        setCompanySearch(e.target.value);
                        if (!showAllBasicsCompanies) setShowAllBasicsCompanies(true);
                      }}
                      placeholder="Search companies..."
                      className="w-full bg-black/50 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/40"
                    />
                  </div>

                  {selectedBasicsCompany && (
                    <div className="mb-6">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Selected Company</p>
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full">
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">{selectedBasicsCompany}</span>
                        <button onClick={handleClearSelectedBasicsCompany} className="text-slate-400 hover:text-white" aria-label="Clear selection"><X size={12} /></button>
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
                          className={`p-4 border rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                              : 'bg-white/5 border-white/5 hover:border-amber-500/50 text-white'
                          }`}
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
                        className="px-5 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-amber-500/40"
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
                          // navigate to plan for that company
                          navigate(`/plan/${selectedBasicsCompany}`);
                        } else {
                          setError(res.error || 'Failed to save selection');
                        }
                      }}
                      className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black rounded-xl font-black text-[10px] uppercase tracking-widest transition-colors"
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
                  <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-8 hover:border-amber-500/20 transition-all group">
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-3 bg-green-500/10 rounded-2xl border border-green-500/20">
                        <CheckCircle className="text-green-500" size={24} />
                      </div>
                      <span className="text-[10px] font-black text-slate-500 bg-white/5 px-3 py-1 rounded-full uppercase tracking-widest">Analysis Complete</span>
                    </div>
                    <h3 className="text-lg font-black mb-2 uppercase tracking-wide">Resume Intelligence</h3>
                    <p className="text-slate-500 text-xs leading-relaxed font-medium mb-6">Level Detected: <span className="text-amber-500 font-black uppercase italic">{parsedData?.level || 'N/A'}</span></p>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} className="h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]" />
                    </div>
                  </div>

                  <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-8 hover:border-amber-500/20 transition-all group">
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                        <Target className="text-amber-500" size={24} />
                      </div>
                      <span className="text-[10px] font-black text-amber-500 bg-amber-500/5 px-3 py-1 rounded-full uppercase tracking-widest">{parsedData?.companies?.length || 0} Matches Found</span>
                    </div>
                    <h3 className="text-lg font-black mb-2 uppercase tracking-wide">Company Pipeline</h3>
                    <p className="text-slate-500 text-xs leading-relaxed font-medium mb-6">Your profile is a high match for Tier 1 tech startups and product companies.</p>
                    <div className="flex -space-x-3">
                       {parsedData?.companies?.slice(0, 5).map((c, i) => (
                         <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-amber-500 flex items-center justify-center text-[8px] font-black text-black uppercase">
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
                  <div className="flex items-center justify-between px-2">
                     <h3 className="text-sm font-black uppercase tracking-[0.3em] text-slate-500">Career Trajectory Matches</h3>
                     <span className="text-[10px] font-black text-amber-500 bg-amber-500/5 px-3 py-1 rounded-full uppercase tracking-[0.2em] border border-amber-500/20">Deep AI Benchmarking</span>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-8">
                    {parsedData.companies.map((company, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-10 hover:bg-white/[0.01] transition-all group relative overflow-hidden"
                      >
                        <div className="flex flex-col md:flex-row gap-10 items-start">
                          <div className="w-full md:w-64 shrink-0">
                            <div className="flex justify-between items-start mb-8">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/20">
                                  <Target className="text-amber-500" size={24} />
                                </div>
                                <div>
                                  <h4 className="text-2xl font-black uppercase italic tracking-tight">{company.name}</h4>
                                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{company.location}</p>
                                </div>
                              </div>
                              
                              <div className="relative w-16 h-16 flex items-center justify-center">
                                 <svg className="w-16 h-16 transform -rotate-90">
                                    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-white/5" />
                                    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="3" fill="transparent" strokeDasharray={176} strokeDashoffset={176 - (176 * company.matchScore) / 100} className="text-amber-500" />
                                 </svg>
                                 <span className="absolute text-[10px] font-black italic">{company.matchScore}%</span>
                              </div>
                            </div>

                            <div className={`inline-block px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest mb-6 ${company.applyReadiness === 'ready' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                              {company.applyReadiness.replace('_', ' ')} • {company.type}
                            </div>
                            
                            <p className="text-slate-400 text-xs leading-relaxed font-medium mb-8 italic">&ldquo;{company.matchReason}&rdquo;</p>
                            
                            <div className="flex items-center gap-4">
                              <button 
                                onClick={() => handleViewPlan(company.name)}
                                className="px-6 py-3 bg-amber-500 text-black font-black uppercase tracking-widest text-[9px] rounded-xl hover:bg-amber-400 transition-all active:scale-95 flex items-center gap-2"
                              >
                                {unlockedCompany === company.name ? 'View Prep Plan' : (unlockedCompany ? 'Unlock Plan 🔒' : 'Unlock Free Plan')}
                                <ArrowRight size={14} />
                              </button>
                              <a href={company.careersUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-white transition-all">
                                Careers
                              </a>
                            </div>
                          </div>

                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 w-full border-t md:border-t-0 md:border-l border-white/5 pt-10 md:pt-0 md:pl-10">
                            <div>
                              <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Skill Overlap</h5>
                              <div className="flex flex-wrap gap-2">
                                {company.skillOverlap.map((skill, si) => (
                                  <span key={si} className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-[9px] font-black uppercase text-slate-300">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Interview Focus</h5>
                              <div className="space-y-2">
                                {company.interviewFocus.map((focus, fi) => (
                                  <div key={fi} className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                                    <div className="w-1 h-1 rounded-full bg-amber-500" />
                                    {focus}
                                  </div>
                                ))}
                              </div>
                            </div>
                            {company.weakAreaWarning !== "None" && (
                              <div className="md:col-span-2 p-4 bg-red-500/5 border border-red-500/10 rounded-2xl">
                                 <p className="text-[9px] font-black text-red-400 uppercase tracking-widest leading-relaxed">⚠️ Warning: {company.weakAreaWarning}</p>
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
              <div className="mt-8 bg-red-500/5 border border-red-500/20 text-red-300 text-xs font-bold uppercase tracking-widest rounded-2xl px-6 py-4">
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
