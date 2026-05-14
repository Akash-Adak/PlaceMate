import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { generateQuestions } from '../../services/resume';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Brain, Zap, Target, BookOpen, TrendingUp, AlertCircle, ChevronRight, CheckCircle, Code, Play, Trophy, RefreshCw } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const loadingStages = [
  'Analyzing your coding skills and experience level.',
  'Selecting optimal coding challenges for your profile.',
  'Preparing test cases and evaluation criteria.',
  'Building custom coding problems based on your background.',
  'Finalizing challenges and setting up the environment.'
];

const QuestionGenPanel = ({ user, parsedData }) => {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [currentType, setCurrentType] = useState(null);
  const [completedQuestions, setCompletedQuestions] = useState({});
  const [evaluationResults, setEvaluationResults] = useState({});
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
    setLoading(true);
    setLoadingStep(0);
    setError(null);
    setQuestions([]);
    setCompletedQuestions({});
    setEvaluationResults({});
    setCurrentType(questionType);
    try {
      const res = await generateQuestions(user.uid, '', 1, questionType, options);
      console.log(res.data);
      if (res.success) setQuestions(res.data || []);
      else setError(res.error || 'Failed to generate');
    } catch (err) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCoding = () => {
    handleGenerateQuestions('coding', codingOptions);
  };

  const handleMarkComplete = (questionId, evaluation) => {
    setCompletedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
    
    if (evaluation) {
      setEvaluationResults(prev => ({
        ...prev,
        [questionId]: evaluation
      }));
    }
  };

  const getCompletionStats = () => {
    const total = questions.length;
    const completed = Object.values(completedQuestions).filter(v => v === true).length;
    return { total, completed, percentage: total > 0 ? (completed / total) * 100 : 0 };
  };

  const getAverageScore = () => {
    const evaluated = Object.values(evaluationResults).filter(v => v && v.score);
    if (evaluated.length === 0) return null;
    const avg = evaluated.reduce((sum, val) => sum + val.score, 0) / evaluated.length;
    return Math.round(avg);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return isDark ? 'text-emerald-400' : 'text-emerald-600';
    if (score >= 60) return isDark ? 'text-yellow-400' : 'text-yellow-600';
    return isDark ? 'text-red-400' : 'text-red-600';
  };

  const handleQuestionClick = (question) => {
    navigate(`/editor/${question.docId}`, { 
      state: { 
        question: question, 
        user,
        onComplete: (evaluation) => handleMarkComplete(question.docId, evaluation)
      } 
    });
  };

  /* ── Theme tokens ────────────────────────────────────────────── */
  const T = {
    container: isDark
      ? "bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 overflow-hidden relative"
      : "bg-white border border-indigo-100 rounded-2xl p-6 overflow-hidden relative shadow-lg",
    
    gradient: isDark
      ? "from-blue-500/5 via-transparent to-transparent"
      : "from-blue-500/5 via-transparent to-transparent",
    
    headerText: isDark
      ? "text-slate-500"
      : "text-slate-400",
    
    description: isDark
      ? "text-slate-400"
      : "text-slate-500",
    
    button: isDark
      ? "px-4 py-2 bg-blue-500 text-white font-black rounded-lg text-sm mb-4 disabled:opacity-60 disabled:cursor-not-allowed hover:bg-blue-400 transition-all duration-200"
      : "px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-lg text-sm mb-4 disabled:opacity-60 disabled:cursor-not-allowed hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg",
    
    loadingContainer: isDark
      ? "mb-4 rounded-2xl border border-blue-500/20 bg-white/[0.02] p-5"
      : "mb-4 rounded-2xl border border-blue-200 bg-blue-50/30 p-5",
    
    loadingIconBorder: isDark
      ? "border-blue-500/20 bg-blue-500/10"
      : "border-blue-200 bg-blue-100",
    
    loadingSpinner: isDark
      ? "border-blue-500 border-t-transparent"
      : "border-blue-600 border-t-transparent",
    
    loadingBadge: isDark
      ? "text-blue-500"
      : "text-blue-600",
    
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
      ? active ? 'border-blue-500/30 bg-blue-500/10' : 'border-white/5 bg-white/[0.03]'
      : active ? 'border-blue-300 bg-blue-100' : 'border-blue-100 bg-white',
    
    loadingCardText: (active) => isDark
      ? active ? 'text-blue-400' : 'text-slate-600'
      : active ? 'text-blue-600' : 'text-slate-400',
    
    loadingCardBarBg: (active) => isDark
      ? active ? 'bg-blue-500/20' : 'bg-white/5'
      : active ? 'bg-blue-200' : 'bg-blue-100',
    
    loadingCardBarFill: isDark
      ? "bg-blue-500"
      : "bg-blue-600",
    
    loadingStepDot: (active) => isDark
      ? active ? 'bg-blue-500 animate-pulse' : 'bg-white/10'
      : active ? 'bg-blue-600 animate-pulse' : 'bg-blue-200',
    
    loadingStepText: isDark
      ? "text-slate-400"
      : "text-slate-500",
    
    errorText: isDark
      ? "text-red-400 text-sm mb-2 flex items-center gap-2"
      : "text-red-600 text-sm mb-2 flex items-center gap-2",
    
    questionContainer: isDark
      ? "space-y-2 mt-3"
      : "space-y-2 mt-3",
    
    questionCard: (completed) => isDark
      ? `p-3 rounded-xl text-sm border transition-all duration-200 cursor-pointer ${
          completed 
            ? 'bg-emerald-500/10 border-emerald-500/30' 
            : 'bg-white/5 border-white/5 hover:border-blue-500/20 hover:bg-white/10'
        }`
      : `p-3 rounded-xl text-sm border transition-all duration-200 cursor-pointer ${
          completed 
            ? 'bg-emerald-50 border-emerald-200' 
            : 'bg-blue-50/50 border-blue-100 hover:border-blue-300 hover:bg-blue-50'
        }`,
    
    questionTitle: (completed) => isDark
      ? `font-bold text-base ${completed ? 'text-emerald-400 line-through' : 'text-white'}`
      : `font-bold text-base ${completed ? 'text-emerald-600 line-through' : 'text-slate-800'}`,
    
    questionDifficulty: (difficulty) => {
      const colors = {
        easy: isDark ? 'text-emerald-400' : 'text-emerald-600',
        medium: isDark ? 'text-yellow-400' : 'text-yellow-600',
        hard: isDark ? 'text-red-400' : 'text-red-600'
      };
      return colors[difficulty] || colors.medium;
    },
    
    progressBarBg: isDark
      ? "bg-white/10"
      : "bg-indigo-100",
    
    progressBarFill: isDark
      ? "bg-emerald-500"
      : "bg-emerald-500",
    
    evaluationCard: isDark
      ? "mt-3 p-3 rounded-lg bg-white/5 border border-white/5"
      : "mt-3 p-3 rounded-lg bg-gray-50 border border-gray-200",
  };

  const stats = getCompletionStats();
  const allCompleted = stats.total > 0 && stats.completed === stats.total;
  const averageScore = getAverageScore();

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
            <Code size={16} className={T.loadingBadge} />
            <h4 className={`text-sm font-black uppercase tracking-[0.2em] ${T.headerText}`}>
              Coding Practice
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
          Generate coding challenges based on your skill level. Click on any challenge to open the code editor.
        </p>

        {/* Generate Button */}
        <button
          className={T.button}
          onClick={handleGenerateCoding}
          disabled={loading}
        >
          {loading && currentType === 'coding' ? (
            <span className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full border-2 ${T.loadingSpinner} animate-spin`} />
              Generating Challenges...
            </span>
          ) : (
            <span className="flex items-center gap-2 justify-center">
              <Zap size={14} />
              Generate Coding Challenges
            </span>
          )}
        </button>

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
                    Estimated 30 to 40 seconds
                  </span>
                </div>
                <p className={`font-black text-sm mb-1 ${T.loadingTitle}`}>
                  {loadingStages[loadingStep]}
                </p>
                <p className={`text-xs ${T.loadingSubtext}`}>
                  Creating personalized coding challenges based on your skill level.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {['Skills', 'Topics', 'Difficulty', 'Test Cases', 'Constraints', 'Finalize'].map((label, index) => {
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
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BookOpen size={12} className={T.loadingBadge} />
                <span className={`text-[9px] font-black uppercase tracking-wider ${T.loadingBadge}`}>
                  Coding Challenges
                </span>
              </div>
              <div className="flex items-center gap-3">
                {averageScore && (
                  <div className="flex items-center gap-2">
                    <Trophy size={12} className={getScoreColor(averageScore)} />
                    <span className={`text-xs font-black ${getScoreColor(averageScore)}`}>
                      Avg Score: {averageScore}%
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {stats.completed}/{stats.total} Completed
                  </span>
                  <div className={`w-16 h-1.5 rounded-full overflow-hidden ${T.progressBarBg}`}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stats.percentage}%` }}
                      transition={{ duration: 0.3 }}
                      className={`h-full rounded-full ${T.progressBarFill}`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {questions.map((q, i) => {
              const questionId = q.docId || q.id || `question_${i}`;
              const isCompleted = completedQuestions[questionId];
              const evaluation = evaluationResults[questionId];
              
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => handleQuestionClick(q)}
                  className={T.questionCard(isCompleted)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex-1">
                        <div className={T.questionTitle(isCompleted)}>
                          {q.title || `Challenge ${i + 1}`}
                        </div>
                      </div>
                      <div className={`text-xs font-bold px-2 py-0.5 rounded ${T.questionDifficulty(q.difficulty)} bg-opacity-10 ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}>
                        {q.difficulty || codingOptions.difficulty}
                      </div>
                      <ChevronRight size={16} className={isDark ? 'text-slate-600' : 'text-slate-400'} />
                    </div>
                  </div>

                  {/* Evaluation Results (if completed) */}
                  {evaluation && (
                    <div className={T.evaluationCard}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Play size={14} className={getScoreColor(evaluation.score)} />
                          <span className={`text-xs font-black ${getScoreColor(evaluation.score)}`}>
                            Score: {evaluation.score}%
                          </span>
                        </div>
                        <div className="text-xs text-slate-500">
                          {evaluation.executionTime && `⏱️ ${evaluation.executionTime}ms`}
                        </div>
                      </div>
                      
                      {evaluation.feedback && (
                        <div className="text-xs mt-2 text-slate-400">
                          <span className="font-bold">Feedback:</span> {evaluation.feedback}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
            
            <div className={`mt-3 pt-3 flex items-center justify-between ${isDark ? "border-t border-white/10" : "border-t border-indigo-100"}`}>
              <div className="flex items-center gap-2">
                <TrendingUp size={12} className={T.loadingBadge} />
                <span className={`text-[9px] font-black uppercase tracking-wider ${T.loadingBadge}`}>
                  {questions.length} challenges ready for coding
                </span>
              </div>
              
              {allCompleted && stats.total > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2"
                >
                  <div className={`px-3 py-1.5 rounded-full ${
                    isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    <div className="flex items-center gap-2 text-xs font-black">
                      <Trophy size={14} />
                      <span>🎉 All Challenges Completed! Great job! 🎉</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default QuestionGenPanel;