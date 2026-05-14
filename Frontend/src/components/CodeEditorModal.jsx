import React, { useState, useEffect } from 'react';
import { 
  X, Play, Send, RotateCcw, Code, FileCode, CheckCircle, 
  AlertCircle, Copy, Check, Maximize2, Minimize2, 
  Terminal, BookOpen, Zap, ChevronRight, Loader2,
  Settings, Moon, Sun
} from 'lucide-react';
import Editor from '@monaco-editor/react';
import toast from 'react-hot-toast';
import { Group, Panel, Separator } from 'react-resizable-panels';
import { evaluateCodeWithGemini, getQuestionAwareStarterCode } from '../services/codeEditorService';
import { submitAnswer } from '../services/resume/questionService';

const CodeEditorModal = ({ open, onClose, question: initialQuestion, user }) => {
  const questionKey = initialQuestion?.docId || initialQuestion?.id || initialQuestion?.task_id || initialQuestion?.title || 'default-question';
  const draftStorageKey = `placemate_code_draft_${user?.uid || 'guest'}_${questionKey}`;

  const getSavedCode = (question = {}, lang = 'java') => {
    const savedCode =
      question.savedCode ||
      question.submittedCode ||
      question.evaluation?.savedCode ||
      question.evaluation?.userAnswer?.code ||
      (typeof question.evaluation?.userAnswer === 'string' ? question.evaluation.userAnswer : '') ||
      '';

    if (savedCode) return savedCode;

    if (typeof window !== 'undefined') {
      try {
        const stored = window.localStorage.getItem(draftStorageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.code && parsed?.questionKey === questionKey && parsed?.language === lang) {
            return parsed.code;
          }
        }
      } catch {
        // Ignore malformed draft data and fall back to the starter template.
      }
    }

    return getQuestionAwareStarterCode(question, lang);
  };

  const [code, setCode] = useState(
    getSavedCode(initialQuestion || {}, initialQuestion?.language || 'java')
  );
  const [language, setLanguage] = useState(initialQuestion?.language );
  const [runningOutput, setRunningOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [question, setQuestion] = useState(initialQuestion || {});
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [activeTab, setActiveTab] = useState('output'); // 'output', 'evaluation'

  const monacoLanguageMap = {
     java: 'java',
    python: 'python',
    cpp: 'cpp',

  };

  useEffect(() => {
    if (!open) {
      return;
    }

    const nextQuestion = initialQuestion || {};
    const nextLanguage = nextQuestion.language || 'java';

    setQuestion(nextQuestion);
    setCode(getSavedCode(nextQuestion, nextLanguage));
    setLanguage(nextLanguage);
    setRunningOutput('');
    setResult(null);
    setActiveTab('output');
    setCopied(false);
  }, [open, questionKey]);

  useEffect(() => {
    if (!open || typeof window === 'undefined') return;

    try {
      window.localStorage.setItem(
        draftStorageKey,
        JSON.stringify({
          questionKey,
          language,
          code,
        }),
      );
    } catch {
      // Ignore storage quota or privacy mode failures.
    }
  }, [code, draftStorageKey, language, open, questionKey]);

  if (!open) return null;

  const getDefaultCode = (lang) => {
    return getQuestionAwareStarterCode(initialQuestion || question || {}, lang);
  };

  const getExampleBlocks = (currentQuestion = {}) => {
    if (Array.isArray(currentQuestion.examples) && currentQuestion.examples.length > 0) {
      return currentQuestion.examples;
    }

    const text = currentQuestion.question || '';
    const exampleMatch = text.match(/Example[s]?:([\s\S]*?)(?=\n(?:Constraints?|Hint|Acceptance Criteria|Why this matters|$))/i);

    if (exampleMatch?.[1]?.trim()) {
      return [exampleMatch[1].trim()];
    }

    const inputOutputPairs = [];
    const lines = text.split('\n');
    lines.forEach((line) => {
      if (/input\s*:|output\s*:/i.test(line)) {
        inputOutputPairs.push(line.trim());
      }
    });

    return inputOutputPairs.length > 0 ? [inputOutputPairs.join('\n')] : [];
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const resetCode = () => {
    setCode(getDefaultCode(language));
    setRunningOutput('');
    setResult(null);
    toast.success('Code reset to default');
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    setCode(getDefaultCode(newLang));
    toast.success(`Switched to ${newLang.toUpperCase()}`);
  };

  const runLocally = async () => {
    if (language !== 'java' && language !== 'typescript') {
      toast.loading('Checking code with Gemini...');
      const analysis = await evaluateCodeWithGemini({
        question,
        code,
        language,
        runOutput: runningOutput,
        mode: 'run',
      });

      if (analysis.success) {
        const summary = analysis.data?.summary || analysis.data?.feedback?.[0] || 'Gemini reviewed the code.';
        const compileErrors = Array.isArray(analysis.data?.compileErrors) ? analysis.data.compileErrors.join('\n') : '';
        const runtimeErrors = Array.isArray(analysis.data?.runtimeErrors) ? analysis.data.runtimeErrors.join('\n') : '';
        const testCases = Array.isArray(analysis.data?.testCases) ? analysis.data.testCases : [];
        const testSummary = testCases.length > 0
          ? testCases.map((testCase, index) => `${index + 1}. ${testCase.status?.toUpperCase() || 'UNKNOWN'} - input: ${testCase.input || 'n/a'} | expected: ${testCase.expected || 'n/a'} | actual: ${testCase.actual || 'n/a'}`).join('\n')
          : '';

        setRunningOutput([
          `🧠 GEMINI CODE CHECK`,
          '',
          summary,
          compileErrors ? `\nCompile issues:\n${compileErrors}` : '',
          runtimeErrors ? `\nRuntime issues:\n${runtimeErrors}` : '',
          testSummary ? `\nTest cases:\n${testSummary}` : '',
        ].filter(Boolean).join('\n'));
        setResult({ success: true, data: analysis.data });
        setActiveTab('output');
        toast.success('Gemini code check complete');
      } else {
        setRunningOutput(`❌ Gemini analysis error:\n\n${analysis.error}`);
        toast.error('Could not analyze code');
      }
      return;
    }

    setRunningOutput('');
    const loadingToast = toast.loading('Running code...');
    
    try {
      const logs = [];
      const consoleShim = { 
        log: (...args) => logs.push(args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ')),
        error: (...args) => logs.push('❌ ' + args.map(arg => String(arg)).join(' ')),
        warn: (...args) => logs.push('⚠️ ' + args.map(arg => String(arg)).join(' '))
      };

      const wrapped = `
        const console = {
          log: (...args) => __console.log(...args),
          error: (...args) => __console.error(...args),
          warn: (...args) => __console.warn(...args)
        };
        ${code}
      `;
      
      const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
      const fn = new AsyncFunction('__console', wrapped);
      await fn(consoleShim);
      
      const output = logs.length > 0 ? logs.join('\n') : '✓ Code executed successfully (no output)';
      setRunningOutput(output);
      toast.success('Code executed successfully!', { id: loadingToast });
    } catch (err) {
      const errorMsg = err.message || String(err);
      setRunningOutput('❌ Runtime Error:\n\n' + errorMsg);
      toast.error('Runtime error occurred', { id: loadingToast });
    }
  };

  const handleSubmit = async () => {
    if (!user?.uid) {
      toast.error('Please sign in to submit');
      return;
    }

    if (!code.trim()) {
      toast.error('Please write some code before submitting');
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading('Submitting code for AI evaluation...');
    
    try {
      const payload = {
        code,
        language,
        runOutput: runningOutput,
        questionText: question?.question || question?.title || '',
        questionId: question?.id || question?.task_id,
      };

      const res = await submitAnswer(user.uid, question?.docId, question?.id || question?.task_id, payload);

      if (res.success) {
        if (typeof window !== 'undefined') {
          try {
            window.localStorage.setItem(
              draftStorageKey,
              JSON.stringify({
                questionKey,
                language,
                code,
              }),
            );
          } catch {
            // Ignore storage failures; Firestore already has the submitted code.
          }
        }
        setResult({ success: true, data: res.data });
        setActiveTab('evaluation');
        toast.success('Evaluation complete! Check the AI feedback', { id: loadingToast });
      } else {
        setResult({ error: res.error || 'Submission failed' });
        toast.error(`Evaluation failed: ${res.error || 'Unknown error'}`, { id: loadingToast });
      }
    } catch (err) {
      setResult({ error: err.message || String(err) });
      toast.error('Error submitting code', { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  const formatEvaluation = (data) => {
    if (!data) return '';
    if (typeof data === 'string') return data;
    
    let output = '';
    if (data.verdict) output += `📊 VERDICT: ${String(data.verdict).toUpperCase()}\n`;
    if (data.score !== undefined) output += `⭐ SCORE: ${data.score}/10\n`;
    if (data.summary) output += `\n💬 SUMMARY:\n${data.summary}\n`;
    if (Array.isArray(data.feedback) && data.feedback.length > 0) output += `\n💡 FEEDBACK:\n- ${data.feedback.join('\n- ')}\n`;
    if (Array.isArray(data.improvements) && data.improvements.length > 0) output += `\n🚀 IMPROVEMENTS:\n- ${data.improvements.join('\n- ')}\n`;
    if (data.idealAnswer) output += `\n✨ IDEAL ANSWER:\n${data.idealAnswer}\n`;
    if (Array.isArray(data.testCases) && data.testCases.length > 0) {
      output += `\n🧪 TEST CASES:\n`;
      data.testCases.forEach((testCase, index) => {
        output += `${index + 1}. ${testCase.status || 'unknown'} | input: ${testCase.input || 'n/a'} | expected: ${testCase.expected || 'n/a'} | actual: ${testCase.actual || 'n/a'}\n`;
      });
    }
    
    return output || JSON.stringify(data, null, 2);
  };

  const toggleFullscreen = () => {
    const modalElement = document.getElementById('code-editor-modal');
    if (!isFullscreen) {
      modalElement?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const exampleBlocks = getExampleBlocks(question);

  return (
    <div 
      id="code-editor-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
    >
      <div className="relative w-full max-w-[1600px] h-[90vh] bg-[#1e1e1e] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#252526] to-[#1e1e1e] border-b border-[#3e3e42] px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-xl">
                <Code size={20} className="text-amber-500" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Code Editor
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {question?.title || question?.topic || 'Coding Challenge'}
                </p>
              </div>
            </div>
            
            {/* Difficulty Badge */}
            {question?.difficulty && (
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                question.difficulty === 'easy' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                question.difficulty === 'medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {question.difficulty}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button 
              onClick={() => setIsDarkTheme(!isDarkTheme)}
              className="p-2 rounded-lg hover:bg-white/10 transition"
              title="Toggle theme"
            >
              {isDarkTheme ? <Sun size={18} className="text-slate-400" /> : <Moon size={18} className="text-slate-400" />}
            </button>
            
            {/* Fullscreen Toggle */}
            <button 
              onClick={toggleFullscreen}
              className="p-2 rounded-lg hover:bg-white/10 transition"
              title="Fullscreen"
            >
              {isFullscreen ? <Minimize2 size={18} className="text-slate-400" /> : <Maximize2 size={18} className="text-slate-400" />}
            </button>
            
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-red-500/20 hover:text-red-400 transition"
            >
              <X size={20} className="text-slate-400" />
            </button>
          </div>
        </div>

        {/* Main Content - Resizable Panels */}
        <Group direction="horizontal" className="flex-1 overflow-hidden">
          
          {/* Left Panel - Problem Statement */}
          <Panel defaultSize={35} minSize={25} className="bg-[#252526] overflow-y-auto" id="problem-panel">
            <div className="h-full flex flex-col">
              {/* Problem Header */}
              <div className="sticky top-0 bg-[#252526] border-b border-[#3e3e42] px-6 py-4 z-10">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen size={16} className="text-amber-500" />
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Problem Statement</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  {question?.title || 'Coding Challenge'}
                </h3>
              </div>
              
              {/* Problem Content */}
              <div className="flex-1 px-6 py-4 space-y-6">
                {/* Description */}
                <div>
                  <h4 className="text-sm font-bold text-amber-500 mb-3 flex items-center gap-2">
                    <ChevronRight size={14} /> Description
                  </h4>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {question?.question || 'Write a function to solve the problem according to the specifications.'}
                    </p>
                  </div>
                </div>

                {/* Examples */}
                {question?.examples && question.examples.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold text-amber-500 mb-3 flex items-center gap-2">
                      <ChevronRight size={14} /> Examples
                    </h4>
                    <div className="space-y-3">
                      {question.examples.map((example, idx) => (
                        <div key={idx} className="bg-black/30 rounded-lg p-4 border border-white/10">
                          <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap">
                            {typeof example === 'string' ? example : JSON.stringify(example, null, 2)}
                          </pre>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Constraints */}
                {question?.constraints && (
                  <div>
                    <h4 className="text-sm font-bold text-amber-500 mb-3 flex items-center gap-2">
                      <ChevronRight size={14} /> Constraints
                    </h4>
                    <ul className="space-y-1">
                      {question.constraints.map((constraint, idx) => (
                        <li key={idx} className="text-xs text-slate-400 flex items-start gap-2">
                          <span className="text-amber-500 mt-0.5">•</span>
                          <span>{constraint}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {exampleBlocks.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold text-amber-500 mb-3 flex items-center gap-2">
                      <ChevronRight size={14} /> Sample Tests
                    </h4>
                    <div className="space-y-3">
                      {exampleBlocks.map((example, idx) => (
                        <div key={idx} className="bg-black/30 rounded-lg p-4 border border-white/10">
                          <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap break-words">
                            {typeof example === 'string' ? example : JSON.stringify(example, null, 2)}
                          </pre>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hint */}
                {question?.hint && (
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Zap size={16} className="text-blue-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Hint</p>
                        <p className="text-sm text-blue-300">{question.hint}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Additional Info */}
                {question?.timeLimit && (
                  <div className="flex items-center gap-4 text-xs text-slate-400 pt-4 border-t border-white/10">
                    <span>⏱️ Time Limit: {question.timeLimit}</span>
                    {question?.memoryLimit && <span>💾 Memory Limit: {question.memoryLimit}</span>}
                  </div>
                )}
              </div>
            </div>
          </Panel>

          <Separator className="bg-[#3e3e42]" />

          {/* Right Panel - Editor & Output */}
          <Panel defaultSize={65} minSize={40} className="bg-[#1e1e1e]">
            <Group direction="vertical">
              
              {/* Code Editor */}
              <Panel defaultSize={60} minSize={30} className="bg-[#1e1e1e]" id="editor-panel">
                <div className="h-full flex flex-col">
                  {/* Editor Toolbar */}
                  <div className="bg-[#252526] border-b border-[#3e3e42] px-4 py-2 flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Language:</label>
                      <select 
                        value={language} 
                        onChange={(e) => handleLanguageChange(e.target.value)}
                        className="px-3 py-1.5 bg-[#3e3e42] text-white rounded-lg text-xs font-mono border border-[#555] focus:outline-none focus:border-amber-500 transition"
                      >
                        <option value="java">Java</option>
                        <option value="python">Python</option>
                        
                        <option value="cpp">C++</option>

                      </select>
                    </div>
                    
                    <div className="h-6 w-px bg-[#3e3e42]" />
                    
                    <button 
                      onClick={copyToClipboard}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/10 transition text-xs"
                    >
                      {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                      <span className="text-slate-300">Copy</span>
                    </button>
                    
                    <button 
                      onClick={resetCode}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/10 transition text-xs"
                    >
                      <RotateCcw size={14} />
                      <span className="text-slate-300">Reset</span>
                    </button>
                    
                    <div className="flex-1" />
                    
                    {/* Editor Settings */}
                    <button className="p-1.5 rounded-lg hover:bg-white/10 transition">
                      <Settings size={14} className="text-slate-400" />
                    </button>
                  </div>
                  
                  {/* Monaco Editor */}
                  <Editor
                    height="100%"
                    language={monacoLanguageMap[language]}
                    value={code}
                    onChange={(value) => setCode(value || '')}
                    theme={isDarkTheme ? 'vs-dark' : 'light'}
                    options={{
                      fontSize: 13,
                      fontFamily: "'Fira Code', 'Cascadia Code', monospace",
                      fontLigatures: true,
                      minimap: { enabled: false },
                      wordWrap: 'on',
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      padding: { top: 16, bottom: 16 },
                      lineNumbers: 'on',
                      renderWhitespace: 'selection',
                      tabSize: 2,
                      cursorBlinking: 'smooth',
                      cursorSmoothCaretAnimation: 'on',
                      smoothScrolling: true,
                      formatOnPaste: true,
                      formatOnType: true
                    }}
                  />
                </div>
              </Panel>

              <Separator className="bg-[#3e3e42]" />

              {/* Output & Evaluation Panel */}
              <Panel defaultSize={40} minSize={20} className="bg-[#1e1e1e]" id="output-panel">
                <div className="h-full flex flex-col">
                  {/* Tabs */}
                  <div className="bg-[#252526] border-b border-[#3e3e42] px-4 flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => setActiveTab('output')}
                      className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${
                        activeTab === 'output' 
                          ? 'text-amber-500 border-b-2 border-amber-500' 
                          : 'text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      <Terminal size={14} />
                      Run Output
                    </button>
                    <button
                      onClick={() => setActiveTab('evaluation')}
                      className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${
                        activeTab === 'evaluation' 
                          ? 'text-amber-500 border-b-2 border-amber-500' 
                          : 'text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      <FileCode size={14} />
                      AI Evaluation
                      {result && (
                        <span className={`ml-1 w-2 h-2 rounded-full ${result.success ? 'bg-green-500' : 'bg-red-500'}`} />
                      )}
                    </button>
                  </div>
                  
                  {/* Tab Content */}
                  <div className="flex-1 overflow-auto">
                    {activeTab === 'output' ? (
                      <pre className="p-4 text-xs font-mono text-slate-300 whitespace-pre-wrap break-words">
                        {runningOutput || '▶️ Click "Run Code" to execute your solution'}
                      </pre>
                    ) : (
                      <div className="p-4">
                        {result ? (
                          result.success ? (
                            <div className="space-y-4">
                              {result.data.verdict && (
                                <div className={`p-4 rounded-lg border ${
                                  result.data.verdict === 'correct' ? 'bg-green-500/10 border-green-500/30' :
                                  result.data.verdict === 'partial' ? 'bg-amber-500/10 border-amber-500/30' :
                                  'bg-red-500/10 border-red-500/30'
                                }`}>
                                  <div className="flex items-center gap-2 mb-2">
                                    {result.data.verdict === 'correct' ? <CheckCircle size={20} className="text-green-500" /> :
                                     result.data.verdict === 'partial' ? <AlertCircle size={20} className="text-amber-500" /> :
                                     <AlertCircle size={20} className="text-red-500" />}
                                    <span className="font-bold text-sm uppercase">
                                      {result.data.verdict}
                                    </span>
                                    {result.data.score && (
                                      <span className="ml-auto text-sm font-mono">
                                        Score: {result.data.score}/10
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}

                              <pre className="bg-black/30 rounded-lg p-4 text-xs font-mono text-slate-300 whitespace-pre-wrap break-words border border-white/10">
                                {formatEvaluation(result.data)}
                              </pre>
                              
                              {result.data.feedback && (
                                <div>
                                  <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-2">
                                    Feedback
                                  </h4>
                                  <p className="text-sm text-slate-300 leading-relaxed">
                                    {result.data.feedback}
                                  </p>
                                </div>
                              )}
                              
                              {result.data.improvement && (
                                <div>
                                  <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-2">
                                    Improvement Suggestions
                                  </h4>
                                  <p className="text-sm text-slate-300 leading-relaxed">
                                    {result.data.improvement}
                                  </p>
                                </div>
                              )}
                              
                              {result.data.idealAnswer && (
                                <div>
                                  <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-2">
                                    Ideal Answer
                                  </h4>
                                  <pre className="bg-black/30 rounded-lg p-4 text-xs font-mono text-green-400 whitespace-pre-wrap overflow-x-auto">
                                    {result.data.idealAnswer}
                                  </pre>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <AlertCircle size={20} className="text-red-500" />
                                <span className="font-bold text-sm text-red-400">Evaluation Error</span>
                              </div>
                              <p className="text-sm text-red-300">{result.error}</p>
                            </div>
                          )
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
                            <FileCode size={48} className="mb-4 opacity-30" />
                            <p className="text-sm">No evaluation yet</p>
                            <p className="text-xs mt-2">Submit your code to get AI feedback</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Panel>
            </Group>
          </Panel>
        </Group>

        {/* Footer Actions */}
        <div className="bg-[#252526] border-t border-[#3e3e42] px-6 py-4 flex items-center gap-3 shrink-0">
          <button 
            onClick={runLocally} 
            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-xs transition transform hover:scale-105"
          >
            <Play size={14} /> Run Code
          </button>

          <button 
            onClick={resetCode} 
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold text-xs transition"
          >
            <RotateCcw size={14} /> Reset
          </button>

          <div className="flex-1" />

          <button 
            onClick={handleSubmit} 
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 text-black rounded-xl font-bold text-xs transition transform hover:scale-105 shadow-lg shadow-amber-500/20"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Evaluating...
              </>
            ) : (
              <>
                <Send size={14} />
                Submit for AI Evaluation
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorModal;