import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, X, Sparkles } from "lucide-react";
import { useLocation } from "react-router-dom";
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
  content: `Hi, I’m your PlaceMate assistant. I can guide you on ${pathname === "/" ? "resume prep, interview practice, and company planning" : "the current page and next step"}. Type a question and I’ll help.`,
});

const VoiceAssistant = () => {
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
  };

  return (
    <>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-[90] flex h-16 w-16 items-center justify-center rounded-full bg-amber-500 text-black shadow-[0_0_40px_rgba(245,158,11,0.35)] transition-transform hover:scale-105 active:scale-95"
        aria-label="Open voice assistant"
      >
        <Bot size={28} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-[90] w-[min(92vw,24rem)] h-[34rem] max-h-[calc(100vh-8rem)] flex flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#080808]/95 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-4 shrink-0">
              <div>
                <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.35em] text-amber-500">
                  <Sparkles size={12} /> Chat Assistant
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Gemini-powered text chat
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-slate-400 transition-colors hover:text-white"
                aria-label="Close voice assistant"
              >
                <X size={18} />
              </button>
            </div>

            <div
              ref={messageListRef}
              className="flex-1 space-y-4 overflow-y-auto px-4 py-4"
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-relaxed ${
                      message.role === "assistant"
                        ? "bg-white/5 text-slate-100"
                        : "bg-amber-500 text-black"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 px-4 py-4 shrink-0">
              <AnimatePresence>
                {showPrompts && (
                  <motion.div
                    initial={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0, overflow: "hidden" }}
                    className="mb-3 relative pr-6"
                  >
                    <button
                      onClick={() => setShowPrompts(false)}
                      className="absolute top-0 right-[-10px] p-1 text-slate-500 hover:text-white transition-colors"
                      title="Dismiss suggestions"
                      aria-label="Dismiss suggestions"
                    >
                      <X size={14} />
                    </button>
                    <div className="flex flex-wrap gap-2">
                      {quickPrompts.map((prompt) => (
                        <button
                          key={prompt}
                          onClick={() => handleQuickPrompt(prompt)}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-300 transition-colors hover:border-amber-500/30 hover:text-amber-400 text-left"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black px-3 py-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      void sendMessage();
                    }
                  }}
                  placeholder="Ask me anything about your prep flow..."
                  className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                />
                <button
                  onClick={() => void sendMessage()}
                  disabled={isSending}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-black transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
                  aria-label="Send message"
                >
                  <Send size={16} />
                </button>
              </div>

              <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-slate-500">
                <span>{isSending ? "Thinking..." : "Ready"}</span>
                <span>Text only</span>
              </div>

              {error ? (
                <p className="mt-3 text-xs text-red-400">{error}</p>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VoiceAssistant;
