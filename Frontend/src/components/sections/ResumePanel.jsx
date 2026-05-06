import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const loadingMessages = [
  "Scanning summary, skills, projects, and experience from your resume.",
  "Extracting role signals, keywords, and proof points from each section.",
  "Building your skill profile and comparing it with company expectations.",
  "Ranking the best-fit companies based on match strength and readiness.",
  "Preparing the final company shortlist and prep roadmap.",
];

const ResumePanel = ({ parsedData, isLoading = false }) => {
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    if (!isLoading) return;

    const timer = window.setInterval(() => {
      setLoadingStep(
        (currentStep) => (currentStep + 1) % loadingMessages.length,
      );
    }, 1400);

    return () => window.clearInterval(timer);
  }, [isLoading]);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0a0a0a] border border-amber-500/20 rounded-2xl p-6 overflow-hidden relative"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">
              AI is Understanding Your Resume
            </h4>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500">
              Processing
            </span>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl border border-amber-500/20 bg-amber-500/10 flex items-center justify-center">
              <div className="w-5 h-5 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
            </div>
            <div className="flex-1">
              <p className="text-lg font-black text-white mb-1">
                {loadingMessages[loadingStep]}
              </p>
              <p className="text-xs text-slate-500 font-medium">
                We are parsing your resume section by section, then matching it
                to the best companies and recommendations. This can take around
                40 to 50 seconds.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
            {[
              "Summary",
              "Skills",
              "Experience",
              "Projects",
              "Companies",
              "Plan",
            ].map((label, index) => {
              const active = index <= loadingStep % 3;
              return (
                <div
                  key={label}
                  className={`rounded-xl border p-3 transition-colors ${active ? "border-amber-500/30 bg-amber-500/10" : "border-white/5 bg-white/[0.03]"}`}
                >
                  <div
                    className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${active ? "text-amber-400" : "text-slate-600"}`}
                  >
                    {label}
                  </div>
                  <div
                    className={`h-1.5 rounded-full overflow-hidden ${active ? "bg-amber-500/20" : "bg-white/5"}`}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: active ? "100%" : "20%" }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-amber-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-2">
            {[
              "Reading profile summary and overall level",
              "Pulling out technical and soft skills",
              "Finding experience patterns and impact signals",
              "Checking projects, achievements, and proof points",
              "Matching your profile to the most suitable companies",
              "Generating a clear prep order for the shortlist",
            ].map((step, index) => (
              <div
                key={step}
                className="flex items-center gap-3 text-xs text-slate-400 font-medium"
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full ${index <= loadingStep ? "bg-amber-500 animate-pulse" : "bg-white/10"}`}
                />
                {step}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6"
    >
      <h4 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500 mb-3">
        Resume Summary
      </h4>
      <div className="text-xl font-black mb-2">
        Level:{" "}
        <span className="text-amber-500">{parsedData?.level || "N/A"}</span>
      </div>
      <div className="text-[13px] text-slate-400 mb-4">
        Companies matched:{" "}
        <span className="font-black text-white">
          {parsedData?.companies?.length || 0}
        </span>
      </div>

      <div>
        <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">
          Top Skills
        </h5>
        <div className="flex flex-wrap gap-2">
          {parsedData?.companies?.[0]?.skillOverlap?.slice(0, 8).map((s, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-[11px] font-black uppercase text-slate-300"
            >
              {s}
            </span>
          ))}
          {!parsedData?.companies?.[0]?.skillOverlap?.length && (
            <span className="text-slate-500 text-[12px]">
              No skills detected
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ResumePanel;
