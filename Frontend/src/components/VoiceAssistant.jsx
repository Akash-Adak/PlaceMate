import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, X, Sparkles, MessageCircle, Zap, HelpCircle, Loader2 } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { getGeminiAssistantReply } from "../services/geminiAssistant";

const quickPrompts = [
  "Help me improve my resume",
  "How do I start interview practice?",
  "Explain my company plan flow",
  "What should I do next on PlaceMate?",
];

const createWelcomeMessage = (pathname) => ({
  id: "welcome",
  role: "assistant",
  content: `Hi, I'm your PlaceMate assistant. I can guide you on ${pathname === "/" ? "resume prep, interview practice, and company planning" : "the current page and next step"}. Type a question and I'll help.`,
});

const VoiceAssistant = () => {
  const { isDark } = useTheme();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);
  const [messages, setMessages] = useState([
    createWelcomeMessage(location.pathname),
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const messageListRef = useRef(null);

  useEffect(() => {
    setMessages([createWelcomeMessage(location.pathname)]);
  }, [location.pathname]);

  useEffect(() => {
    messageListRef.current?.scrollTo({
      top: messageListRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, open, showPrompts]);

  const appendMessage = (role, content) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        role,
        content,
      },
    ]);
  };

  const sendMessage = async (overrideText) => {
    const text = (overrideText ?? input).trim();
    if (!text || isSending) return;

    setIsSending(true);
    setError("");
    setInput("");
    const conversation = [...messages, { role: "user", content: text }];
    appendMessage("user", text);

    try {
      const reply = await getGeminiAssistantReply({
        messages: conversation,
        locationPathname: location.pathname,
      });
      appendMessage("assistant", reply);
    } catch (err) {
      const fallback = err.message || "The assistant is unavailable right now.";
      setError(fallback);
      appendMessage("assistant", fallback);
    } finally {
      setIsSending(false);
    }
  };

  const handleQuickPrompt = (prompt) => {
    setInput(prompt);
    // Optional: auto-send after a short delay
    // setTimeout(() => sendMessage(prompt), 100);
  };

  /* ── Theme tokens ────────────────────────────────────────────── */
  const T = {
    toggleButton: isDark
      ? "fixed bottom-6 right-6 z-[90] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-[0_0_40px_rgba(245,158,11,0.35)] transition-all hover:scale-105 active:scale-95"
      : "fixed bottom-6 right-6 z-[90] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_0_40px_rgba(99,102,241,0.35)] transition-all hover:scale-105 active:scale-95",
    
    container: isDark
      ? "fixed bottom-24 right-6 z-[90] w-[min(92vw,24rem)] overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a]/95 shadow-2xl backdrop-blur-xl"
      : "fixed bottom-24 right-6 z-[90] w-[min(92vw,24rem)] overflow-hidden rounded-2xl border border-indigo-100 bg-white/95 shadow-2xl backdrop-blur-xl",
    
    header: isDark
      ? "flex items-center justify-between border-b border-white/10 px-4 py-4"
      : "flex items-center justify-between border-b border-indigo-100 px-4 py-4",
    
    headerBadge: isDark
      ? "flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.35em] text-amber-500"
      : "flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.35em] text-indigo-600",
    
    headerSubtext: isDark
      ? "mt-1 text-[11px] text-slate-500"
      : "mt-1 text-[11px] text-slate-500",
    
    closeButton: isDark
      ? "text-slate-500 transition-colors hover:text-white"
      : "text-slate-400 transition-colors hover:text-indigo-600",
    
    messageList: isDark
      ? "max-h-[28rem] space-y-3 overflow-y-auto px-4 py-4 custom-scrollbar"
      : "max-h-[28rem] space-y-3 overflow-y-auto px-4 py-4 custom-scrollbar",
    
    assistantMessage: isDark
      ? "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed bg-white/5 text-slate-100"
      : "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed bg-indigo-50 text-slate-700",
    
    userMessage: isDark
      ? "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed bg-gradient-to-r from-amber-500 to-orange-500 text-black"
      : "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed bg-gradient-to-r from-indigo-600 to-purple-600 text-white",
    
    quickPromptsContainer: isDark
      ? "mb-3 flex flex-wrap gap-2"
      : "mb-3 flex flex-wrap gap-2",
    
    quickPromptButton: isDark
      ? "rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-300 transition-all hover:border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-400"
      : "rounded-full border border-indigo-200 bg-indigo-50 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-600 transition-all hover:border-indigo-400 hover:bg-indigo-100 hover:text-indigo-700",
    
    inputContainer: isDark
      ? "flex items-center gap-2 rounded-xl border border-white/10 bg-black/50 px-3 py-2"
      : "flex items-center gap-2 rounded-xl border border-indigo-200 bg-white px-3 py-2 shadow-sm",
    
    input: isDark
      ? "min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
      : "min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400",
    
    sendButton: isDark
      ? "flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
      : "flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60",
    
    footer: isDark
      ? "mt-3 flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-slate-500"
      : "mt-3 flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-slate-400",
    
    erro      ? "flex items-center gap-1 text-xs text-slate-500"
      : "flex items-center gap-1 text-xs text-slate-400",
  };

  return (
    <>
      <motion.button
        onClick={() => setOpen((prev) => !prev)}
        className={T.toggleButton}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open voice assistant"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={isDark 
              ? "fixed bottom-24 right-6 z-[90] w-[min(92vw,24rem)] h-[34rem] max-h-[calc(100vh-8rem)] flex flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#080808]/95 shadow-2xl backdrop-blur-xl"
              : "fixed bottom-24 right-6 z-[90] w-[min(92vw,24rem)] h-[34rem] max-h-[calc(100vh-8rem)] flex flex-col overflow-hidden rounded-[2rem] border border-indigo-100 bg-white/95 shadow-2xl backdrop-blur-xl"
            }
          >
            <div className={`shrink-0 ${T.header}`}>
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles size={12} className={isDark ? "text-amber-500" : "text-indigo-600"} />
                  <p className={T.headerBadge}>
                    AI Assistant
                  </p>
                </div>
                <p className={T.headerSubtext}>Gemini-powered • Always here to help</p>
              </div>
              <button 
                onClick={() => setOpen(false)} 
                className={T.closeButton}
                aria-label="Close voice assistant"
              >
                <X size={18} />
              </button>
            </div>

            <div ref={messageListRef} className={`flex-1 overflow-y-auto px-4 py-4 space-y-4 custom-scrollbar`}>
              {messages.map((message, idx) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, x: message.role === "assistant" ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: idx * 0.05 }}
                  className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
                >
                  <div className={message.role === "assistant" ? T.assistantMessage : T.userMessage}>
                    {message.content}
                  </div>
                </motion.div>
              ))}
              {isSending && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl bg-white/5 px-4 py-3">
                    <Loader2 size={14} className="animate-spin text-amber-500" />
                    <span className="text-xs text-slate-400">AI is thinking...</span>
                  </div>
                </div>
              )}
            </div>

            <div className={`shrink-0 ${isDark ? "border-t border-white/10 px-4 py-4" : "border-t border-indigo-100 px-4 py-4"}`}>
              <AnimatePresence>
                {showPrompts && (
                  <motion.div
                    initial={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0, overflow: "hidden" }}
                    className="mb-3 relative pr-6"
                  >
                    <button
                      onClick={() => setShowPrompts(false)}
                      className={`absolute top-0 right-[-10px] p-1 transition-colors ${isDark ? "text-slate-500 hover:text-white" : "text-slate-400 hover:text-indigo-600"}`}
                      title="Dismiss suggestions"
                      aria-label="Dismiss suggestions"
                    >
                      <X size={14} />
                    </button>
                    <div className={T.quickPromptsContainer}>
                      {quickPrompts.map((prompt) => (
                        <button
                          key={prompt}
                          onClick={() => handleQuickPrompt(prompt)}
                          className={T.quickPromptButton}
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className={T.inputContainer}>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void sendMessage();
                    }
                  }}
                  placeholder="Ask me anything about your prep flow..."
                  className={T.input}
                />
                <button
                  onClick={() => void sendMessage()}
                  disabled={isSending || !input.trim()}
                  className={T.sendButton}
                  aria-label="Send message"
                >
                  {isSending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                </button>
              </div>

              <div className={T.footer}>
                <span className="flex items-center gap-1">
                  <Zap size={10} />
                  {isSending ? "Thinking..." : "Ready"}
                </span>
                <span className="flex items-center gap-1">
                  <HelpCircle size={10} />
                  Text chat
                </span>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={T.errorText}
                >
                  {error}
                </motion.p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VoiceAssistant;
