import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  Lightbulb,
  Clock,
  CheckCircle2,
  Layout,
  AlertTriangle,
  Code,
  Sparkles,
  ChevronRight,
  Award,
  Loader2
} from "lucide-react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { generateQuestions, submitAnswer } from "../services/resume";

const PracticePlan = () => {
  const { companyName, dayNumber } = useParams();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [answers, setAnswers] = useState({});
  const [submittingIds, setSubmittingIds] = useState(new Set());

  const fetchedRef = useRef(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!user) return;
      if (fetchedRef.current) return;
      fetchedRef.current = true;

      setLoading(true);
      setError(null);

      try {
        const result = await generateQuestions(
          user.uid,
          companyName,
          dayNumber,
        );
        if (result.success && result.data && result.data.length > 0) {
          const sorted = result.data.sort((a, b) => a.session - b.session);
          setQuestions(sorted);
        } else {
          setError(result.error || "No questions generated or backend failed.");
        }
      } catch (err) {
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [companyName, dayNumber, user]);

  const handleAnswerChange = (qId, value) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const handleSubmitAnswer = async (question) => {
    const userAnswer = answers[question.id] || "";
    if (!userAnswer.trim()) return;

    setSubmittingIds((prev) => new Set(prev).add(question.id));

    try {
      const result = await submitAnswer(user.uid, question.docId, question.id, userAnswer);
      if (result.success) {
        setQuestions((prev) =>
          prev.map((q) =>
            q.id === question.id ? { ...q, evaluation: result.data } : q
          )
        );
      } else {
        alert(result.error || "Failed to submit answer.");
      }
    } catch (err) {
      alert("Error submitting answer.");
    } finally {
      setSubmittingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(question.id);
        return newSet;
      });
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
    
    loadingCard: isDark
      ? "flex flex-col items-center justify-center py-32 bg-[#0a0a0a] border border-white/5 rounded-[3rem] shadow-2xl relative overflow-hidden"
      : "flex flex-col items-center justify-center py-32 bg-white border border-indigo-100 rounded-[3rem] shadow-xl relative overflow-hidden",
    
    loadingGlow: isDark
      ? "absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[80px] -mr-32 -mt-32 rounded-full"
      : "absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[80px] -mr-32 -mt-32 rounded-full",
    
    loadingSpinner: isDark
      ? "w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-8"
      : "w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-8",
    
    loadingTitle: isDark
      ? "text-2xl font-black uppercase tracking-widest mb-2 text-white"
      : "text-2xl font-black uppercase tracking-widest mb-2 text-slate-800",
    
    loadingSubtext: isDark
      ? "text-slate-500 text-xs font-bold uppercase tracking-widest animate-pulse"
      : "text-slate-400 text-xs font-bold uppercase tracking-widest animate-pulse",
    
    errorCard: isDark
      ? "bg-[#0a0a0a] border border-red-500/20 rounded-[3rem] p-16 text-center shadow-2xl relative overflow-hidden"
      : "bg-white border border-red-200 rounded-[3rem] p-16 text-center shadow-xl relative overflow-hidden",
    
    errorGlow: isDark
      ? "absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-500/10 blur-[80px] -mt-32 rounded-full pointer-events-none"
      : "absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-500/5 blur-[80px] -mt-32 rounded-full pointer-events-none",
    
    errorTitle: isDark
      ? "text-2xl font-black uppercase tracking-widest mb-4 text-white"
      : "text-2xl font-black uppercase tracking-widest mb-4 text-slate-800",
    
    errorMessage: isDark
      ? "text-slate-400 text-sm font-medium mb-8 max-w-md mx-auto"
      : "text-slate-500 text-sm font-medium mb-8 max-w-md mx-auto",
    
    errorButton: isDark
      ? "px-8 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-black text-[10px] uppercase tracking-widest transition-colors"
      : "px-8 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl font-black text-[10px] uppercase tracking-widest transition-colors",
    
    headerSection: isDark
      ? "mb-12 border-b border-white/5 pb-8 relative"
      : "mb-12 border-b border-indigo-100 pb-8 relative",
    
    headerGlow: isDark
      ? "absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-[100px] -mr-48 -mt-48 rounded-full pointer-events-none"
      : "absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[100px] -mr-48 -mt-48 rounded-full pointer-events-none",
    
    dayBadge: isDark
      ? "px-3 py-1 bg-amber-500 text-black font-black text-[10px] uppercase tracking-widest rounded-full"
      : "px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-[10px] uppercase tracking-widest rounded-full",
    
    timeBadge: isDark
      ? "text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-full border border-white/5"
      : "text-slate-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100",
    
    headerTitle: isDark
      ? "text-4xl md:text-5xl font-black uppercase italic tracking-tight mb-3 text-white"
      : "text-4xl md:text-5xl font-black uppercase italic tracking-tight mb-3 text-slate-800",
    
    headerDesc: isDark
      ? "text-slate-400 text-base font-medium max-w-2xl"
      : "text-slate-600 text-base font-medium max-w-2xl",
    
    questionCard: isDark
      ? "bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-8 md:p-10 hover:border-amber-500/20 transition-colors shadow-2xl relative overflow-hidden group"
      : "bg-white border border-indigo-100 rounded-[2rem] p-8 md:p-10 hover:border-indigo-300 transition-all shadow-lg hover:shadow-xl relative overflow-hidden group",
    
    questionAccent: isDark
      ? "absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-500 to-transparent opacity-50"
      : "absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-600 to-transparent opacity-50",
    
    sessionBadge: isDark
      ? "px-3 py-1 bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest rounded-lg"
      : "px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-600 font-black text-[10px] uppercase tracking-widest rounded-lg",
    
    difficultyBadge: (difficulty) => {
      const styles = {
        easy: isDark ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-green-50 text-green-600 border-green-200",
        medium: isDark ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-amber-50 text-amber-600 border-amber-200",
        hard: isDark ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-red-50 text-red-600 border-red-200",
      };
      return `px-3 py-1 border font-black text-[10px] uppercase tracking-widest rounded-lg ${styles[difficulty] || styles.medium}`;
    },
    
    timeText: isDark
      ? "text-slate-400 font-bold text-[10px] uppercase tracking-widest ml-auto flex items-center gap-1"
      : "text-slate-400 font-bold text-[10px] uppercase tracking-widest ml-auto flex items-center gap-1",
    
    topicHeader: isDark
      ? "text-sm font-black text-amber-500 uppercase tracking-widest mb-3 flex items-center gap-2"
      : "text-sm font-black text-indigo-600 uppercase tracking-widest mb-3 flex items-center gap-2",
    
    questionBox: isDark
      ? "bg-white/[0.02] border border-white/5 rounded-2xl p-6 mb-6"
      : "bg-indigo-50/30 border border-indigo-100 rounded-2xl p-6 mb-6",
    
    questionText: isDark
      ? "text-lg font-medium text-white leading-relaxed whitespace-pre-line"
      : "text-lg font-medium text-slate-800 leading-relaxed whitespace-pre-line",
    
    linkBox: isDark
      ? "bg-white/[0.02] border border-white/5 rounded-2xl p-6 mb-6"
      : "bg-indigo-50/30 border border-indigo-100 rounded-2xl p-6 mb-6",
    
    linkText: isDark
      ? "text-lg font-medium text-amber-400 leading-relaxed break-all hover:text-amber-300 underline underline-offset-4"
      : "text-lg font-medium text-indigo-600 leading-relaxed break-all hover:text-indigo-700 underline underline-offset-4",
    
    hintBox: isDark
      ? "flex items-start gap-3 bg-blue-500/5 border border-blue-500/10 rounded-xl p-5 mb-6"
      : "flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-5 mb-6",
    
    hintTitle: isDark
      ? "text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1"
      : "text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1",
    
    hintText: isDark
      ? "text-sm text-slate-300 font-medium"
      : "text-sm text-slate-700 font-medium",
    
    evaluationBox: isDark
      ? "bg-white/[0.02] border border-amber-500/20 rounded-2xl p-6 mt-6 mb-6 overflow-hidden"
      : "bg-indigo-50/30 border border-indigo-200 rounded-2xl p-6 mt-6 mb-6 overflow-hidden",
    
    verdictBadge: (verdict) => {
      const styles = {
        correct: isDark ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-700",
        partial: isDark ? "bg-amber-500/20 text-amber-400" : "bg-amber-100 text-amber-700",
        incorrect: isDark ? "bg-red-500/20 text-red-400" : "bg-red-100 text-red-700",
      };
      return `px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ml-auto ${styles[verdict] || styles.incorrect}`;
    },
    
    evaluationTitle: isDark
      ? "font-black uppercase tracking-widest text-amber-500 text-sm"
      : "font-black uppercase tracking-widest text-indigo-600 text-sm",
    
    evaluationLabel: isDark
      ? "text-white block mb-2 uppercase text-[10px] tracking-widest"
      : "text-slate-800 block mb-2 uppercase text-[10px] tracking-widest",
    
    evaluationText: isDark
      ? "leading-relaxed text-slate-300"
      : "leading-relaxed text-slate-700",
    
    idealAnswerBox: isDark
      ? "bg-black/50 border border-white/5 p-5 rounded-xl mt-4"
      : "bg-indigo-100/50 border border-indigo-200 p-5 rounded-xl mt-4",
    
    idealAnswerTitle: isDark
      ? "text-amber-500 flex items-center gap-2 mb-3 text-[10px] uppercase tracking-widest"
      : "text-indigo-600 flex items-center gap-2 mb-3 text-[10px] uppercase tracking-widest",
    
    idealAnswerPre: isDark
      ? "text-xs font-mono text-slate-400 whitespace-pre-wrap overflow-x-auto custom-scrollbar"
      : "text-xs font-mono text-slate-600 whitespace-pre-wrap overflow-x-auto custom-scrollbar",
    
    textarea: isDark
      ? "w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-sm font-mono text-slate-300 focus:border-amber-500 outline-none transition-colors min-h-[160px] custom-scrollbar resize-y"
      : "w-full bg-white border border-indigo-200 rounded-2xl p-5 text-sm font-mono text-slate-700 focus:border-indigo-500 outline-none transition-colors min-h-[160px] custom-scrollbar resize-y shadow-sm",
    
    submitButton: (disabled) => isDark
      ? `px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all disabled:opacity-50 flex items-center gap-2 border border-white/10`
      : `px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm`,
    
    resourceLink: isDark
      ? "flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-[10px] font-black text-slate-300 uppercase tracking-wider transition-colors"
      : "flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-lg text-[10px] font-black text-indigo-600 uppercase tracking-wider transition-colors",
    
    markCompleteButton: isDark
      ? "flex items-center gap-2 px-6 py-2 bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 hover:border-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
      : "flex items-center gap-2 px-6 py-2 bg-indigo-100 hover:bg-indigo-600 text-indigo-700 hover:text-white border border-indigo-200 hover:border-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
    
    completeDayButton: isDark
      ? "px-8 py-3 bg-amber-500 hover:bg-amber-400 text-black rounded-xl font-black text-[10px] uppercase tracking-widest transition-colors shadow-lg shadow-amber-500/20"
      : "px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-colors shadow-lg shadow-indigo-500/20",
  };

  return (
    <div className={T.pageBg}>
      <Navbar />

      <main className="max-w-7xl w-full mx-auto px-6 pt-32 pb-24">
        <button
          onClick={() => navigate(`/plan/${companyName}`)}
          className={T.backButton}
        >
          <ArrowLeft size={14} /> Back to Prep Plan
        </button>

        {loading ? (
          <div className={T.loadingCard}>
            <div className={T.loadingGlow} />
            <div className={T.loadingSpinner} />
            <h2 className={T.loadingTitle}>
              Generating Questions
            </h2>
            <p className={T.loadingSubtext}>
              Running AI generation pipeline...
            </p>
          </div>
        ) : error ? (
          <div className={T.errorCard}>
            <div className={T.errorGlow} />
            <AlertTriangle size={48} className="text-red-500 mx-auto mb-6" />
            <h2 className={T.errorTitle}>
              Generation Failed
            </h2>
            <p className={T.errorMessage}>
              {error}
            </p>
            <button
              onClick={() => navigate(`/plan/${companyName}`)}
              className={T.errorButton}
            >
              Return to Prep Plan
            </button>
          </div>
        ) : (
          questions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className={T.headerSection}>
                <div className={T.headerGlow} />
                <div className="flex items-center gap-3 mb-4">
                  <span className={T.dayBadge}>
                    Day {dayNumber}
                  </span>
                  <span className={T.timeBadge}>
                    <Clock size={12} className={isDark ? "text-amber-500" : "text-indigo-600"} />{" "}
                    {questions[0].estimated_total_time || "N/A"}
                  </span>
                </div>
                <h1 className={T.headerTitle}>
                  {questions[0].day_title || "Practice Session"}
                </h1>
                <p className={T.headerDesc}>
                  Complete these practice questions to solidify your
                  understanding before moving on.
                </p>
              </div>

              <div className="space-y-8">
                {questions.map((q, idx) => (
                  <div
                    key={q.id || idx}
                    className={T.questionCard}
                  >
                    <div className={T.questionAccent} />

                    <div className="flex flex-wrap items-center gap-3 mb-6">
                      <span className={T.sessionBadge}>
                        Session {q.session}
                      </span>
                      <span className={T.difficultyBadge(q.difficulty)}>
                        {q.difficulty}
                      </span>
                      <span className={T.timeText}>
                        <Clock size={12} /> {q.expected_time}
                      </span>
                    </div>

                    <h3 className={T.topicHeader}>
                      <Layout size={14} /> {q.topic}
                    </h3>

                    <div className={T.questionBox}>
                      <p className={T.questionText}>
                        {q.question}
                      </p>
                    </div>

                    {q.link && (
                      <div className={T.linkBox}>
                        <a
                          href={q.link}
                          target="_blank"
                          rel="noreferrer"
                          className={T.linkText}
                        >
                          {q.link}
                        </a>
                      </div>
                    )}

                    {q.hint && (
                      <div className={T.hintBox}>
                        <Lightbulb
                          size={18}
                          className={isDark ? "text-blue-500 shrink-0 mt-0.5" : "text-blue-600 shrink-0 mt-0.5"}
                        />
                        <div>
                          <h4 className={T.hintTitle}>
                            Hint
                          </h4>
                          <p className={T.hintText}>
                            {q.hint}
                          </p>
                        </div>
                      </div>
                    )}

                    {q.evaluation ? (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: 'auto' }} 
                        className={T.evaluationBox}
                      >
                        <div className="flex flex-wrap items-center gap-3 mb-6 border-b border-indigo-100 pb-4">
                          <h4 className={T.evaluationTitle}>AI Evaluation</h4>
                          <span className={T.verdictBadge(q.evaluation.verdict)}>
                            {q.evaluation.verdict} • {q.evaluation.score}/10
                          </span>
                        </div>
                        <div className="space-y-6 text-sm font-medium">
                          <div>
                            <strong className={T.evaluationLabel}>Feedback</strong> 
                            <p className={T.evaluationText}>{q.evaluation.feedback}</p>
                          </div>
                          {q.evaluation.improvement && (
                            <div>
                              <strong className={T.evaluationLabel}>Improvement</strong> 
                              <p className={T.evaluationText}>{q.evaluation.improvement}</p>
                            </div>
                          )}
                          {q.evaluation.idealAnswer && (
                            <div className={T.idealAnswerBox}>
                              <strong className={T.idealAnswerTitle}>
                                <Code size={12} /> Ideal Answer
                              </strong>
                              <pre className={T.idealAnswerPre}>
                                {q.evaluation.idealAnswer}
                              </pre>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ) : (
                      <div className="mt-6 mb-6">
                        <textarea
                          value={answers[q.id] || ""}
                          onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                          placeholder="Type your code or answer here..."
                          className={T.textarea}
                        />
                        <div className="flex justify-end mt-4">
                          <button
                            onClick={() => handleSubmitAnswer(q)}
                            disabled={submittingIds.has(q.id) || !answers[q.id]}
                            className={T.submitButton(submittingIds.has(q.id) || !answers[q.id])}
                          >
                            {submittingIds.has(q.id) ? (
                              <>
                                <Loader2 size={12} className="animate-spin" />
                                Evaluating...
                              </>
                            ) : (
                              "Submit Answer"
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-4 justify-between pt-6 border-t border-indigo-100">
                      <div className="flex items-center gap-2">
                        {q.resource_url && (
                          <a
                            href={q.resource_url}
                            target="_blank"
                            rel="noreferrer"
                            className={T.resourceLink}
                          >
                            <BookOpen size={14} /> Review Topic
                          </a>
                        )}
                      </div>
                      <button className={T.markCompleteButton}>
                        <CheckCircle2 size={14} /> Mark Complete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-16 text-center">
                <button
                  onClick={() => navigate(`/plan/${companyName}`)}
                  className={T.completeDayButton}
                >
                  Complete Day {dayNumber}
                </button>
              </div>
            </motion.div>
          )
        )}
      </main>
    </div>
  );
};

export default PracticePlan;