import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { generateQuestions } from '../../services/resume';
import { Sparkles, Brain, Zap, Target, BookOpen, TrendingUp, AlertCircle, ChevronRight, CheckCircle, Code } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const loadingStages = [
  'Reading your resume profile and target company.',
  'Finding the most relevant topics for practice questions.',
  'Selecting difficulty, format, and interview focus.',
  'Building a custom question set from your background.',
  'Finalizing the questions and prep order.'
];

const QuestionGenPanel = ({ user, parsedData }) => {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [currentType, setCurrentType] = useState(null);
  const [showCodingOptions, setShowCodingOptions] = useState(false);
  const [codingOptions, setCodingOptions] = useState({
    language: 'javascript',
    difficulty: 'medium',
    topic: '',
    count: 3,
  });

  useEffect(() => {
    if (!loading) return;

    const timer = window.setInterval(() => {
      setLoadingStep((currentStep) => (currentStep + 1) % loadingStages.length);
    }, 1400);

    return () => window.clearInterval(timer);
  }, [loading]);

  const handleGenerateQuestions = async (questionType, options = {}) => {
    if (!user?.uid) return setError('Please sign in to generate questions');
    const companyName = parsedData?.companies?.[0]?.name || 'General';
    setLoading(true);
    setLoadingStep(0);
    setError(null);
    setQuestions([]);
    setCurrentType(questionType);
    try {
      const res = await generateQuestions(user.uid, companyName, 1, questionType, options);
      if (res.success) setQuestions(res.data || []);
      else setError(res.error || 'Failed to generate');
    } catch (err) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateNormal = () => {
    setShowCodingOptions(false);
    handleGenerateQuestions('normal');
  };

  const openCodingOptions = () => {
    setShowCodingOptions(true);
  };

  const handleConfirmGenerateCoding = async () => {
    setShowCodingOptions(false);
    await handleGenerateQuestions('coding', codingOptions);
  };

  /* ── Theme tokens ────────────────────────────────────────────── */
  const T = {
    container: isDark
      ? "bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 overflow-hidden relative"
      : "bg-white border border-indigo-100 rounded-2xl p-6 overflow-hidden relative shadow-lg",
    
    gradient: isDark
      ? "from-amber-500/5 via-transparent to-transparent"
      : "from-indigo-500/5 via-transparent to-transparent",
    
    headerText: isDark
      ? "text-slate-500"
      : "text-slate-400",
    
    description: isDark
      ? "text-slate-400"
      : "text-slate-500",
    
    button: isDark
      ? "px-4 py-2 bg-amber-500 text-black font-black rounded-lg text-sm mb-4 disabled:opacity-60 disabled:cursor-not-allowed hover:bg-amber-400 transition-all duration-200"
      : "px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black rounded-lg text-sm mb-4 disabled:opacity-60 disabled:cursor-not-allowed hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg",
    
    // Loading styles
    loadingContainer: isDark
      ? "mb-4 rounded-2xl border border-amber-500/20 bg-white/[0.02] p-5"
      : "mb-4 rounded-2xl border border-indigo-200 bg-indigo-50/30 p-5",
    
    loadingIconBorder: isDark
      ? "border-amber-500/20 bg-amber-500/10"
      : "border-indigo-200 bg-indigo-100",
    
    loadingSpinner: isDark
      ? "border-amber-500 border-t-transparent"
      : "border-indigo-600 border-t-transparent",
    
    loadingBadge: isDark
      ? "text-amber-500"
      : "text-indigo-600",
    
    loadingSubBadge: isDark
      ? "text-slate-600"
      : "text-slate-400",
    
    loadingTitle: isDark
      ? "text-white"
      : "text-slate-800",
    
    loadingSubtext: isDark
      ? "text-slate-500"
      : "text-slate-400",
    
    loadingCardBorder: (active) => isDark
      ? active ? 'border-amber-500/30 bg-amber-500/10' : 'border-white/5 bg-white/[0.03]'
      : active ? 'border-indigo-300 bg-indigo-100' : 'border-indigo-100 bg-white',
    
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
    
    // Error styles
    errorText: isDark
      ? "text-red-400 text-sm mb-2 flex items-center gap-2"
      : "text-red-600 text-sm mb-2 flex items-center gap-2",
    
    // Question styles
    questionContainer: isDark
      ? "space-y-3 mt-3"
      : "space-y-3 mt-3",
    
    questionCard: isDark
      ? "p-4 bg-white/5 rounded-xl text-sm border border-white/5 hover:border-amber-500/20 transition-all duration-200"
      : "p-4 bg-indigo-50/50 rounded-xl text-sm border border-indigo-100 hover:border-indigo-300 transition-all duration-200",
    
    questionTopic: isDark
      ? "font-black text-xs uppercase text-slate-400 tracking-wider"
      : "font-black text-xs uppercase text-indigo-600 tracking-wider",
    
    questionText: isDark
      ? "mt-2 text-sm text-slate-300"
      : "mt-2 text-sm text-slate-700",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={T.container}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${T.gradient} pointer-events-none`} />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className={T.loadingBadge} />
            <h4 className={`text-sm font-black uppercase tracking-[0.2em] ${T.headerText}`}>
              Question Generator
            </h4>
          </div>
          <div className="flex items-center gap-1">
            <Target size={12} className={T.loadingBadge} />
            <span className={`text-[9px] font-black uppercase tracking-wider ${T.loadingBadge}`}>
              AI Powered
            </span>
          </div>
        </div>
        
        <p className={`text-xs ${T.description} mb-4`}>
          Create targeted practice questions based on your profile, project depth, and target company fit.
        </p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={handleGenerateNormal}
            className={T.button}
            disabled={loading}
            title="Generate behavioral and conceptual interview questions"
          >
            {loading && currentType === 'normal' ? (
              <span className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full border-2 ${T.loadingSpinner} animate-spin`} />
                Generating...
              </span>
            ) : (
              <span className="flex items-center gap-2 justify-center">
                <Brain size={14} />
                <span className="text-center">Normal</span>
              </span>
            )}
          </button>

          <button
            onClick={openCodingOptions}
            className={T.button}
            disabled={loading}
            title="Open coding options"
          >
            {loading && currentType === 'coding' ? (
              <span className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full border-2 ${T.loadingSpinner} animate-spin`} />
                Generating...
              </span>
            ) : (
              <span className="flex items-center gap-2 justify-center">
                <Code size={14} />
                <span className="text-center">Coding</span>
              </span>
            )}
          </button>
        </div>

        {showCodingOptions && (
          <div className={`p-4 rounded-xl border ${isDark ? 'border-white/5 bg-white/[0.02]' : 'border-indigo-100 bg-white'} mb-4`}>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <label className="text-xs font-black uppercase tracking-wider mb-1">Language</label>
                <select
                  value={codingOptions.language}
                  onChange={(e) => setCodingOptions({ ...codingOptions, language: e.target.value })}
                  className="w-full p-2 rounded-md border"
                  disabled={loading}
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                </select>
              </div>

              <div className="w-36">
                <label className="text-xs font-black uppercase tracking-wider mb-1">Difficulty</label>
                <select
                  value={codingOptions.difficulty}
                  onChange={(e) => setCodingOptions({ ...codingOptions, difficulty: e.target.value })}
                  className="w-full p-2 rounded-md border"
                  disabled={loading}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div className="w-24">
                <label className="text-xs font-black uppercase tracking-wider mb-1">Count</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={codingOptions.count}
                  onChange={(e) => setCodingOptions({ ...codingOptions, count: Math.max(1, parseInt(e.target.value || '1')) })}
                  className="w-full p-2 rounded-md border"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="text-xs font-black uppercase tracking-wider mb-1">Topic (optional)</label>
              <input
                type="text"
                placeholder="e.g. arrays, graphs, dynamic programming"
                value={codingOptions.topic}
                onChange={(e) => setCodingOptions({ ...codingOptions, topic: e.target.value })}
                className="w-full p-2 rounded-md border"
                disabled={loading}
              />
            </div>

            <div className="mt-3 flex items-center gap-2">
              <button
                className={T.button}
                onClick={handleConfirmGenerateCoding}
                disabled={loading}
              >
                {loading && currentType === 'coding' ? (
                  <span className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full border-2 ${T.loadingSpinner} animate-spin`} />
                    Generating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Zap size={14} />
                    Generate Coding
                  </span>
                )}
              </button>

              <button
                className="px-3 py-2 rounded-md border bg-transparent text-sm"
                onClick={() => setShowCodingOptions(false)}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className={T.loadingContainer}>
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 rounded-2xl border ${T.loadingIconBorder} flex items-center justify-center shrink-0`}>
                <div className={`w-5 h-5 rounded-full border-2 ${T.loadingSpinner} animate-spin`} />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${T.loadingBadge}`}>
                    AI Generation Running
                  </span>
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${T.loadingSubBadge}`}>
                    Estimated 40 to 50 seconds
                  </span>
                </div>
                <p className={`font-black text-sm mb-1 ${T.loadingTitle}`}>
                  {loadingStages[loadingStep]}
                </p>
                <p className={`text-xs ${T.loadingSubtext}`}>
                  We are turning your resume and company match into interview-ready questions.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {['Profile', 'Topics', 'Difficulty', 'Answer Style', 'Company Fit', 'Finalize'].map((label, index) => {
                const active = index <= loadingStep;
                return (
                  <div
                    key={label}
                    className={`rounded-xl border p-3 transition-colors ${T.loadingCardBorder(active)}`}
                  >
                    <div className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${T.loadingCardText(active)}`}>
                      {label}
                    </div>
                    <div className={`h-1.5 rounded-full overflow-hidden ${T.loadingCardBarBg(active)}`}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: active ? '100%' : '18%' }}
                        transition={{ duration: 0.5 }}
                        className={`h-full rounded-full ${T.loadingCardBarFill}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-2">
              {[
                'Reading your profile summary and target company',
                'Detecting skills, projects, and experience signals',
                'Choosing the most useful interview topics',
                'Balancing technical, behavioral, and practical questions',
                'Personalizing the set for your company match'
              ].map((step, index) => (
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
        )}

        {error && (
          <div className={T.errorText}>
            <AlertCircle size={14} />
            {error}
          </div>
        )}
        
        {questions.length > 0 && (
          <div className={T.questionContainer}>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={12} className={T.loadingBadge} />
              <span className={`text-[9px] font-black uppercase tracking-wider ${T.loadingBadge}`}>
                Generated Questions
              </span>
            </div>
            {questions.slice(0, 5).map((q, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={T.questionCard}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className={T.questionTopic}>
                      {q.topic || q.title || `Question ${i + 1}`}
                    </div>
                    <div className={T.questionText}>
                      {q.question}
                    </div>
                  </div>
                  <ChevronRight size={14} className={`${T.loadingBadge} opacity-50 ml-2 flex-shrink-0 mt-1`} />
                </div>
              </motion.div>
            ))}
            
            <div className={`mt-3 pt-2 flex items-center gap-2 ${isDark ? "border-t border-white/10" : "border-t border-indigo-100"}`}>
              <TrendingUp size={12} className={T.loadingBadge} />
              <span className={`text-[9px] font-black uppercase tracking-wider ${T.loadingBadge}`}>
                {questions.length} questions ready for practice
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default QuestionGenPanel;