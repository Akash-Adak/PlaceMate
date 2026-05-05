import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Mic, MicOff, RefreshCcw, Sparkles, Volume2, Loader2, CheckCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getGeminiMockInterviewReply } from "../services/geminiAssistant";

const starterQuestion = "Tell me about yourself and why you want this role.";

const parseMockInterviewResponse = (text) => {
  const cleaned = text.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    return {
      feedback: cleaned,
      nextQuestion: "Can you give me a specific example of a challenge you solved?",
      score: 6,
    };
  }
};

const MockInterview = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(starterQuestion);
  const [feedback, setFeedback] = useState("Press start, answer out loud, and the coach will keep the interview moving.");
  const [lastAnswer, setLastAnswer] = useState("");
  const [round, setRound] = useState(1);
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState("");
  const recognitionRef = useRef(null);
  const transcriptRef = useRef("");
  const shouldSubmitRef = useRef(false);
  const conversationRef = useRef([{ role: "assistant", content: starterQuestion }]);

  const speechRecognition = useMemo(() => {
    if (typeof window === "undefined") return null;
    return window.SpeechRecognition || window.webkitSpeechRecognition || null;
  }, []);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = useCallback((text) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.lang = "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, []);

  const submitAnswer = useCallback(async (answerText) => {
    const trimmedAnswer = answerText.trim();
    if (!trimmedAnswer || isThinking) return;

    setIsThinking(true);
    setError("");
    setLastAnswer(trimmedAnswer);

    const conversation = [
      ...conversationRef.current,
      { role: "user", content: trimmedAnswer },
    ];
    conversationRef.current = conversation;

    try {
      const reply = await getGeminiMockInterviewReply({
        messages: conversation,
        companyName: user?.displayName || user?.email?.split("@")[0] || "your target role",
      });

      const parsed = parseMockInterviewResponse(reply);
      const nextQuestion = parsed.nextQuestion || currentQuestion;
      const safeFeedback = parsed.feedback || "Good attempt. Keep building a stronger example.";
      const score = Number.isFinite(Number(parsed.score)) ? Number(parsed.score) : 6;

      setFeedback(`${safeFeedback} Score: ${score}/10.`);
      setCurrentQuestion(nextQuestion);
      setRound((value) => value + 1);
      conversationRef.current = [
        ...conversation,
        { role: "assistant", content: `${safeFeedback} Next question: ${nextQuestion}` },
      ];
      speak(`${safeFeedback} Next question. ${nextQuestion}`);
    } catch (err) {
      const fallback = err.message || "The mock interview coach is unavailable right now.";
      setError(fallback);
      setFeedback(fallback);
    } finally {
      setIsThinking(false);
    }
  }, [currentQuestion, isThinking, speak, user?.displayName, user?.email]);

  useEffect(() => {
    if (!speechRecognition) return undefined;

    const recognition = new speechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      let transcript = "";
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        transcript += event.results[index][0].transcript;
      }
      transcriptRef.current = transcript.trim();
      setLastAnswer(transcript.trim());
      setError("");
    };

    recognition.onerror = () => {
      setIsListening(false);
      shouldSubmitRef.current = false;
      setError("Voice input is not available in this browser.");
    };

    recognition.onend = () => {
      setIsListening(false);
      if (shouldSubmitRef.current && transcriptRef.current) {
        void submitAnswer(transcriptRef.current);
      }
      shouldSubmitRef.current = false;
      transcriptRef.current = "";
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, [speechRecognition, submitAnswer]);

  const startInterview = () => {
    setStarted(true);
    setError("");
    speak(currentQuestion);
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      setError("Voice input is not supported in this browser.");
      return;
    }

    shouldSubmitRef.current = true;
    transcriptRef.current = "";
    setLastAnswer("");
    setError("");
    setIsListening(true);

    try {
      recognitionRef.current.start();
    } catch {
      setIsListening(false);
      setError("Unable to start voice input.");
    }
  };

  const stopListening = () => {
    shouldSubmitRef.current = false;
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const resetInterview = () => {
    setStarted(false);
    setCurrentQuestion(starterQuestion);
    setFeedback("Press start, answer out loud, and the coach will keep the interview moving.");
    setLastAnswer("");
    setRound(1);
    setIsListening(false);
    setIsThinking(false);
    setError("");
    transcriptRef.current = "";
    shouldSubmitRef.current = false;
    conversationRef.current = [{ role: "assistant", content: starterQuestion }];
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  /* ── Theme tokens ────────────────────────────────────────────── */
  const T = {
    pageBg: isDark
      ? "min-h-screen bg-black text-white selection:bg-amber-500/30"
      : "min-h-screen bg-gradient-to-br from-[#F8FAFC] via-white to-[#F1F5F9] text-slate-800 selection:bg-indigo-500/30",
    
    mainCard: isDark
      ? "relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#0a0a0a] px-6 py-10 sm:px-10 sm:py-12 shadow-2xl"
      : "relative overflow-hidden rounded-[2.5rem] border border-indigo-100 bg-white px-6 py-10 sm:px-10 sm:py-12 shadow-xl",
    
    topBar: isDark
      ? "absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400"
      : "absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500",
    
    glowEffect: isDark
      ? "absolute -right-24 -top-24 h-72 w-72 rounded-full bg-amber-500/10 blur-[90px]"
      : "absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/10 blur-[90px]",
    
    badge: isDark
      ? "inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-amber-400"
      : "inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600",
    
    roundBadge: isDark
      ? "rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400"
      : "rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-indigo-600",
    
    title: isDark
      ? "text-4xl sm:text-5xl font-black uppercase italic tracking-tight text-white leading-none"
      : "text-4xl sm:text-5xl font-black uppercase italic tracking-tight text-slate-800 leading-none",
    
    subtitle: isDark
      ? "mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-400"
      : "mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-600",
    
    questionCard: isDark
      ? "rounded-[2rem] border border-white/5 bg-black/50 p-6 sm:p-8"
      : "rounded-[2rem] border border-indigo-100 bg-indigo-50/30 p-6 sm:p-8",
    
    questionLabel: isDark
      ? "text-[10px] font-black uppercase tracking-[0.3em] text-amber-400 mb-3"
      : "text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-3",
    
    questionText: isDark
      ? "text-xl sm:text-2xl font-semibold leading-relaxed text-white"
      : "text-xl sm:text-2xl font-semibold leading-relaxed text-slate-800",
    
    feedbackCard: isDark
      ? "mt-5 rounded-[1.75rem] border border-white/5 bg-white/[0.03] p-5"
      : "mt-5 rounded-[1.75rem] border border-indigo-100 bg-indigo-50/30 p-5",
    
    feedbackLabel: isDark
      ? "text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 mb-2"
      : "text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2",
    
    feedbackText: isDark
      ? "text-sm leading-relaxed text-slate-300"
      : "text-sm leading-relaxed text-slate-700",
    
    answerCard: isDark
      ? "rounded-[2rem] border border-white/5 bg-[#050505] p-6"
      : "rounded-[2rem] border border-indigo-100 bg-white p-6 shadow-sm",
    
    answerLabel: isDark
      ? "text-[10px] font-black uppercase tracking-[0.3em] text-slate-500"
      : "text-[10px] font-black uppercase tracking-[0.3em] text-slate-400",
    
    answerText: isDark
      ? "mt-3 min-h-28 text-sm leading-relaxed text-slate-300 whitespace-pre-line"
      : "mt-3 min-h-28 text-sm leading-relaxed text-slate-600 whitespace-pre-line",
    
    controlsCard: isDark
      ? "rounded-[2rem] border border-white/5 bg-white/[0.03] p-6"
      : "rounded-[2rem] border border-indigo-100 bg-indigo-50/20 p-6",
    
    controlsLabel: isDark
      ? "text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4"
      : "text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4",
    
    startButton: isDark
      ? "w-full rounded-2xl bg-amber-500 px-5 py-4 text-sm font-black uppercase tracking-[0.22em] text-black transition-transform hover:scale-[1.01] active:scale-[0.99]"
      : "w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-4 text-sm font-black uppercase tracking-[0.22em] text-white transition-transform hover:scale-[1.01] active:scale-[0.99] shadow-md",
    
    speakButton: (isListening) => isDark
      ? `flex items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-black uppercase tracking-[0.22em] transition-all ${isListening ? "bg-red-500 text-white" : "bg-amber-500 text-black"}`
      : `flex items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-black uppercase tracking-[0.22em] transition-all ${isListening ? "bg-red-500 text-white" : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"} shadow-md`,
    
    repeatButton: isDark
      ? "flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-black uppercase tracking-[0.22em] text-slate-200 transition-colors hover:border-amber-500/30 hover:text-amber-400"
      : "flex items-center justify-center gap-2 rounded-2xl border border-indigo-200 bg-white px-5 py-4 text-sm font-black uppercase tracking-[0.22em] text-indigo-600 transition-colors hover:border-indigo-400 hover:bg-indigo-50",
    
    resetButton: isDark
      ? "flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-transparent px-5 py-4 text-sm font-black uppercase tracking-[0.22em] text-slate-400 transition-colors hover:border-white/20 hover:text-white"
      : "flex items-center justify-center gap-2 rounded-2xl border border-indigo-200 bg-transparent px-5 py-4 text-sm font-black uppercase tracking-[0.22em] text-slate-500 transition-colors hover:border-indigo-400 hover:text-indigo-600",
    
    statusCard: isDark
      ? "rounded-[2rem] border border-white/5 bg-black/40 p-5 text-xs uppercase tracking-[0.22em] text-slate-500"
      : "rounded-[2rem] border border-indigo-100 bg-indigo-50/30 p-5 text-xs uppercase tracking-[0.22em] text-slate-500",
    
    errorText: isDark
      ? "mt-2 normal-case tracking-normal text-red-400"
      : "mt-2 normal-case tracking-normal text-red-500",
    
    thinkingIcon: isDark
      ? "w-5 h-5 rounded-full border-2 border-amber-500 border-t-transparent animate-spin"
      : "w-5 h-5 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin",
  };

  return (
    <div className={T.pageBg}>
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 pt-32 pb-20">
        <section className={T.mainCard}>
          <div className={T.topBar} />
          <div className={T.glowEffect} />

          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className={T.badge}>
              <Sparkles size={12} /> Mock Interview
            </span>
            <span className={T.roundBadge}>
              Round {round}
            </span>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <h1 className={T.title}>
                Voice Mock Interview
              </h1>
              <p className={T.subtitle}>
                Speak your answer, hear the next question, and keep the flow going without a typing chat box.
              </p>

              <div className="mt-8">
                <div className={T.questionCard}>
                  <p className={T.questionLabel}>Interviewer prompt</p>
                  <p className={T.questionText}>{currentQuestion}</p>
                </div>

                <div className={T.feedbackCard}>
                  <p className={T.feedbackLabel}>Coach feedback</p>
                  <p className={T.feedbackText}>{feedback}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className={T.answerCard}>
                <p className={T.answerLabel}>Your last answer</p>
                <p className={T.answerText}>
                  {lastAnswer || "Your spoken answer will appear here while you talk."}
                </p>
              </div>

              <div className={T.controlsCard}>
                <p className={T.controlsLabel}>Controls</p>
                {!started ? (
                  <button
                    onClick={startInterview}
                    className={T.startButton}
                  >
                    Start interview
                  </button>
                ) : (
                  <div className="grid gap-3">
                    <button
                      onClick={isListening ? stopListening : startListening}
                      className={T.speakButton(isListening)}
                    >
                      {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                      {isListening ? "Stop speaking" : isThinking ? "Thinking..." : "Answer now"}
                    </button>
                    <button
                      onClick={() => speak(currentQuestion)}
                      className={T.repeatButton}
                    >
                      <Volume2 size={16} /> Repeat question
                    </button>
                    <button
                      onClick={resetInterview}
                      className={T.resetButton}
                    >
                      <RefreshCcw size={16} /> Reset
                    </button>
                  </div>
                )}
              </div>

              <div className={T.statusCard}>
                <div className="flex items-center gap-2">
                  {isListening && <Mic size={12} className="text-green-500 animate-pulse" />}
                  {isThinking && <div className={T.thinkingIcon} />}
                  {!isListening && !isThinking && <CheckCircle size={12} className="text-green-500" />}
                  <span>
                    {isListening ? "Listening..." : isThinking ? "Evaluating answer..." : "Ready for voice input"}
                  </span>
                </div>
                {error && <p className={T.errorText}>{error}</p>}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default MockInterview;