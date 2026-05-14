import { GoogleGenerativeAI } from '@google/generative-ai';

// ─── ENV ──────────────────────────────────────────────────────────────────────
const GEMINI_API_KEY =
  import.meta.env.VITE_GEMINI_API_KEY ||
  import.meta.env.VITE_GOOGLE_GEMINI_API_KEY ||
  import.meta.env.VITE_GOOGLE_API_KEY;

const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-1.5-flash';

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const getGeminiModel = () => {
  if (!GEMINI_API_KEY) return null;
  const client = new GoogleGenerativeAI(GEMINI_API_KEY);
  return client.getGenerativeModel({ model: GEMINI_MODEL });
};

const getQuestionText = (question = {}) =>
  [question.title, question.topic, question.question, question.hint]
    .filter(Boolean)
    .join('\n\n');

const stripCodeFences = (text = '') =>
  text
    .replace(/^```(?:json|java|js|python|java|cpp|go|rust)?\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();

const parseJsonResponse = (text = '') => {
  const cleaned = stripCodeFences(text);
  try {
    return JSON.parse(cleaned);
  } catch {
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
    }
    throw new Error('Gemini returned an unparseable response.');
  }
};

// ─── REAL-TIME LANGUAGE DETECTION ─────────────────────────────────────────────
export const detectLanguageFromQuestion = (questionText = '', preferredLanguage = 'java') => {
  const text = questionText.toLowerCase();

  const signals = [
    { lang: 'python',     score: 0, patterns: [/\bpython\b/, /\bpip\b/, /\bdjango\b/, /\bflask\b/, /\bpandas\b/, /\bnumpy\b/, /\.py\b/, /def\s+\w+\(/, /\bprint\s*\(/] },
    { lang: 'java',       score: 0, patterns: [/\bjava\b(?!script)/, /\bspring\b/, /\bmaven\b/, /\.java\b/, /public\s+class/, /\bsystem\.out\b/] },
    { lang: 'cpp',        score: 0, patterns: [/\bc\+\+/, /\bcpp\b/, /\b#include\b/, /\bstd::\b/, /\bcout\b/, /\.cpp\b/, /\.h\b/] },
    ];

  for (const entry of signals) {
    for (const pattern of entry.patterns) {
      if (pattern.test(text)) entry.score++;
    }
  }

  const best = signals.reduce((a, b) => (b.score > a.score ? b : a), { lang: null, score: 0 });
  return best.score > 0 ? best.lang : preferredLanguage;
};

// ─── QUESTION-AWARE ANALYSIS ───────────────────────────────────────────────────
/**
 * Deep analysis of the question to infer types, params, and return hints.
 * Powers smart datatype selection per language — no more "Object" placeholders.
 */
const analyzeQuestion = (questionText = '') => {
  const text = questionText.toLowerCase();

  // ── Type Detection ──
  const isUI       = /react|component|button|form|state|hook|onclick|ui|frontend|jsx|counter|signup|login|modal|navbar|render/i.test(text);
  const isAlgorithm= /leetcode|two sum|linked list|tree|graph|matrix|recursion|dynamic programming|backtrack|bfs|dfs|sort|search|binary|heap|trie|constraints:|example\s*\d/i.test(text);
  const isAsync    = /api|fetch|axios|http|request|response|await|async|promise|endpoint|rest|graphql|websocket|database|db|query|mongo|sql/i.test(text);
  const isSystem   = /design|architecture|microservice|scale|load balancer|cache|redis|kafka/i.test(text);
  const isClass    = /class|oop|object|inherit|polymorphi|encapsulat|instantiat/i.test(text);
  const isTransform= /transform|parse|convert|map|filter|reduce|format|serialize/i.test(text);

  let type = 'general';
  if (isUI)        type = 'ui';
  else if (isAlgorithm) type = 'algorithm';
  else if (isSystem)    type = 'system';
  else if (isClass)     type = 'class';
  else if (isAsync)     type = 'async';
  else if (isTransform) type = 'transform';

  // ── Function Name Inference ──
  const verbMap = [
    [/\bfind\b|\bsearch\b|\blookup\b/, 'find'],
    [/\bcount\b|\btotal\b/, 'count'],
    [/\bsum\b|\badd\b|\baccumulat\b/, 'sum'],
    [/\bsort\b|\border\b/, 'sort'],
    [/\bfilter\b|\bremove\b|\bexclude\b/, 'filter'],
    [/\bparse\b|\bextract\b/, 'parse'],
    [/\bvalidat\b|\bcheck\b|\bverif\b/, 'validate'],
    [/\bconvert\b|\btransform\b/, 'convert'],
    [/\bgenerat\b|\bcreate\b|\bbuild\b/, 'generate'],
    [/\bcalculat\b|\bcomput\b/, 'calculate'],
    [/\bmerge\b|\bcombine\b/, 'merge'],
    [/\breverse\b/, 'reverse'],
    [/\bgroup\b/, 'groupBy'],
    [/\bfetch\b|\bget\b|\bload\b|\bretriev\b/, 'fetchData'],
    [/\bupdate\b|\bmodify\b|\bedit\b/, 'update'],
    [/\bdelete\b|\bremov\b/, 'remove'],
    [/\bsend\b|\bsubmit\b|\bpost\b/, 'submit'],
    [/\btwo sum\b/, 'twoSum'],
    [/\blongest\b/, 'longest'],
    [/\bmaximum\b|\bmax\b/, 'maxValue'],
    [/\bminimum\b|\bmin\b/, 'minValue'],
  ];

  let functionName = 'solution';
  for (const [pattern, name] of verbMap) {
    if (pattern.test(text)) { functionName = name; break; }
  }

  // Override with title-derived name if clean
  const titleMatch = questionText.match(/^([A-Z][a-zA-Z\s]+?)(?:\n|$)/);
  if (titleMatch) {
    const titleWords = titleMatch[1].trim().split(/\s+/).slice(0, 3);
    if (titleWords.length >= 1 && titleWords[0].length > 2) {
      functionName = titleWords
        .map((w, i) => i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase())
        .join('');
    }
  }

  // ── Parameter Detection ──
  // Each param carries { name, jsType, javaType, pythonType, cppType, goType, rustType }
  const rawParams = [];

  if (/\bnums\b|\bnumbers\b/.test(text))                rawParams.push({ name: 'nums',   jsType: 'number[]', javaType: 'int[]',     pyType: 'List[int]',  cppType: 'vector<int>',    goType: '[]int',  rustType: 'Vec<i32>' });
  else if (/\barray\b|\blist\b/.test(text))             rawParams.push({ name: 'nums',   jsType: 'number[]', javaType: 'int[]',     pyType: 'List[int]',  cppType: 'vector<int>',    goType: '[]int',  rustType: 'Vec<i32>' });

  if (/\bstring\b|\bword\b|\btext\b/.test(text) &&
      !rawParams.find(p => p.name === 's'))             rawParams.push({ name: 's',      jsType: 'string',   javaType: 'String',    pyType: 'str',        cppType: 'string',         goType: 'string', rustType: 'String' });

  if (/\btarget\b/.test(text))                          rawParams.push({ name: 'target', jsType: 'number',   javaType: 'int',       pyType: 'int',        cppType: 'int',            goType: 'int',    rustType: 'i32' });
  if (/\bmatrix\b|\bgrid\b/.test(text))                 rawParams.push({ name: 'matrix', jsType: 'number[][]',javaType:'int[][]',   pyType: 'List[List[int]]',cppType:'vector<vector<int>>',goType:'[][]int',rustType:'Vec<Vec<i32>>'});
  if (/\btree\b|\broot\b/.test(text))                   rawParams.push({ name: 'root',   jsType: 'TreeNode', javaType: 'TreeNode',  pyType: 'Optional[TreeNode]',cppType:'TreeNode*',goType:'*TreeNode',rustType:'Option<Box<TreeNode>>'});
  if (/\bgraph\b/.test(text))                           rawParams.push({ name: 'graph',  jsType: 'number[][]',javaType:'int[][]',   pyType: 'List[List[int]]',cppType:'vector<vector<int>>',goType:'[][]int',rustType:'Vec<Vec<i32>>'});
  if (/\bk\b|\bkth\b/.test(text))                       rawParams.push({ name: 'k',      jsType: 'number',   javaType: 'int',       pyType: 'int',        cppType: 'int',            goType: 'int',    rustType: 'i32' });

  if (rawParams.length === 0) {
    rawParams.push({ name: 'input', jsType: 'any', javaType: 'Object', pyType: 'Any', cppType: 'auto', goType: 'interface{}', rustType: '_' });
  }

  // ── Return Type ──
  let returnHint = 'any';
  let returnTypes = {
    jsType: 'any', javaType: 'Object', pyType: 'Any',
    cppType: 'auto', goType: 'interface{}', rustType: 'Option<()>'
  };

  if (/return true|return false|boolean|whether|check if|\bis\s+\w+|\bhas\s+\w+/i.test(text)) {
    returnHint = 'boolean';
    returnTypes = { jsType: 'boolean', javaType: 'boolean', pyType: 'bool', cppType: 'bool', goType: 'bool', rustType: 'bool' };
  } else if (/count|how many|number of|total|index/i.test(text)) {
    returnHint = 'number';
    returnTypes = { jsType: 'number', javaType: 'int', pyType: 'int', cppType: 'int', goType: 'int', rustType: 'i32' };
  } else if (/return.*indices|two.*index|pair.*index/i.test(text)) {
    returnHint = 'int[]';
    returnTypes = { jsType: 'number[]', javaType: 'int[]', pyType: 'List[int]', cppType: 'vector<int>', goType: '[]int', rustType: 'Vec<i32>' };
  } else if (/list|array|all \w+s|return.*array|return.*list/i.test(text)) {
    returnHint = 'array';
    returnTypes = { jsType: 'number[]', javaType: 'List<Integer>', pyType: 'List[int]', cppType: 'vector<int>', goType: '[]int', rustType: 'Vec<i32>' };
  } else if (/string|sentence|word|format|return.*string/i.test(text)) {
    returnHint = 'string';
    returnTypes = { jsType: 'string', javaType: 'String', pyType: 'str', cppType: 'string', goType: 'string', rustType: 'String' };
  } else if (/maximum|minimum|longest|shortest|largest|smallest|max.*length|min.*length/i.test(text)) {
    returnHint = 'number';
    returnTypes = { jsType: 'number', javaType: 'int', pyType: 'int', cppType: 'int', goType: 'int', rustType: 'i32' };
  }

  return { type, functionName, rawParams, returnHint, returnTypes, isAsync };
};

// ─── STARTER CODE BUILDER ─────────────────────────────────────────────────────
/**
 * Generates clean, question-aware starter code.
 * - No main() or example usage — just the class/function the user fills in.
 * - Proper language-native datatypes inferred from the question.
 * - Supports: java, python, java, cpp, go, rust
 */
export const getQuestionAwareStarterCode = (question = {}, language = 'java') => {
  if (question.starterCode) return question.starterCode;

  const questionText = getQuestionText(question);
  const { type, functionName, rawParams, returnTypes, isAsync } = analyzeQuestion(questionText);

  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

  switch (language) {

   // ── Java ──────────────────────────────────────────────────────────────────
    case 'java': {
      // Decide if we need List import
      const needsListImport = returnTypes.javaType.startsWith('List') ||
        rawParams.some(p => p.javaType.startsWith('List'));
      const importBlock = needsListImport ? 'import java.util.*;\n\n' : '';

      if (type === 'class') {
        const fields   = rawParams.map(p => `    private ${p.javaType} ${p.name};`).join('\n');
        const ctorArgs = rawParams.map(p => `${p.javaType} ${p.name}`).join(', ');
        const assigns  = rawParams.map(p => `        this.${p.name} = ${p.name};`).join('\n');
        return `${importBlock}public class ${cap(functionName)} {
${fields}

    public ${cap(functionName)}(${ctorArgs}) {
${assigns}
    }

    // TODO: implement methods described in the question
}`;
      }

      const paramSig = rawParams.map(p => `${p.javaType} ${p.name}`).join(', ');
      return `${importBlock}class Solution {
    public ${returnTypes.javaType} ${functionName}(${paramSig}) {
        // TODO: implement the solution
        
    }
}`;
    }

    // ── Python ────────────────────────────────────────────────────────────────
    case 'python': {
      // Build import hints
      const needsOptional = rawParams.some(p => p.pyType.startsWith('Optional'));
      const needsList     = rawParams.some(p => p.pyType.startsWith('List')) || returnTypes.pyType.startsWith('List');
      const needsAny      = rawParams.some(p => p.pyType === 'Any') || returnTypes.pyType === 'Any';
      const imports = [];
      if (needsList || needsOptional || needsAny) {
        const typingImports = [
          needsList     && 'List',
          needsOptional && 'Optional',
          needsAny      && 'Any',
        ].filter(Boolean);
        imports.push(`from typing import ${typingImports.join(', ')}`);
      }
      if (rawParams.some(p => p.name === 'root')) {
        imports.push(`# Definition for a binary tree node.\n# class TreeNode:\n#     def __init__(self, val=0, left=None, right=None):\n#         self.val = val\n#         self.left = left\n#         self.right = right`);
      }

      const importBlock = imports.length ? imports.join('\n') + '\n\n' : '';

      if (type === 'class') {
        const paramSig = rawParams.map(p => `${p.name}: ${p.pyType}`).join(', ');
        return `${importBlock}class ${cap(functionName)}:
    def __init__(self, ${paramSig}):
        ${rawParams.map(p => `self.${p.name} = ${p.name}`).join('\n        ')}

    # TODO: implement methods described in the question`;
      }

      if (type === 'async' || isAsync) {
        const paramSig = rawParams.map(p => `${p.name}: ${p.pyType}`).join(', ');
        return `import asyncio
import aiohttp

async def ${functionName}(${paramSig}) -> ${returnTypes.pyType}:
    """
    TODO: implement async logic.
    """
    async with aiohttp.ClientSession() as session:
        pass`;
      }

      const paramSig = rawParams.map(p => `${p.name}: ${p.pyType}`).join(', ');
      return `${importBlock}class Solution:
    def ${functionName}(self, ${paramSig}) -> ${returnTypes.pyType}:
        # TODO: implement the solution
        pass`;
    }

    // ── C++ ───────────────────────────────────────────────────────────────────
    case 'cpp': {
      // Build includes
      const includes = new Set(['#include <vector>', '#include <string>']);
      rawParams.forEach(p => {
        if (p.cppType.includes('vector'))      includes.add('#include <vector>');
        if (p.cppType === 'string')            includes.add('#include <string>');
        if (p.cppType.includes('unordered'))   includes.add('#include <unordered_map>');
      });
      if (returnTypes.cppType.includes('vector')) includes.add('#include <vector>');

      const includeBlock = [...includes].join('\n') + '\nusing namespace std;\n';

      if (type === 'class') {
        const fields   = rawParams.map(p => `    ${p.cppType} ${p.name};`).join('\n');
        const ctorArgs = rawParams.map(p => `${p.cppType} ${p.name}`).join(', ');
        const inits    = rawParams.map(p => `this->${p.name} = ${p.name};`).join(' ');
        return `${includeBlock}
class ${cap(functionName)} {
private:
${fields}

public:
    ${cap(functionName)}(${ctorArgs}) {
        ${inits}
    }

    // TODO: implement methods described in the question
};`;
      }

      const paramSig = rawParams.map(p => `${p.cppType}& ${p.name}`).join(', ');
      return `${includeBlock}
class Solution {
public:
    ${returnTypes.cppType} ${functionName}(${paramSig}) {
        // TODO: implement the solution
        
    }
};`;
    }



    default:
      return `function ${functionName}(${rawParams.map(p => p.name).join(', ')}) {\n  // TODO\n}`;
  }
};

// ─── CODE EVALUATION ─────────────────────────────────────────────────────────
export const evaluateCodeWithGemini = async ({
  question = {},
  code = '',
  language = 'java',
  runOutput = '',
  mode = 'submit',
}) => {
  const model = getGeminiModel();
  if (!model) {
    return {
      success: false,
      error: 'Gemini API key is missing. Set VITE_GEMINI_API_KEY in your .env file.',
    };
  }

  const questionText = getQuestionText(question);
  const { type, functionName, rawParams, returnTypes } = analyzeQuestion(questionText);

  const prompt = `You are a strict but helpful coding interviewer and automated judge.

Analyse the candidate's code against the question and produce a JSON verdict.
Return VALID JSON ONLY — no markdown fences, no prose outside the JSON.

JSON shape:
{
  "verdict": "correct" | "partial" | "wrong" | "compile_error" | "runtime_error" | "needs_work",
  "score": <0–100>,
  "summary": "<short plain-English summary>",
  "compileErrors": ["<error message>"],
  "runtimeErrors": ["<error message>"],
  "testCases": [
    { "input": "<repr>", "expected": "<repr>", "actual": "<repr>", "status": "pass" | "fail" }
  ],
  "feedback": ["<specific feedback point>"],
  "improvements": ["<concrete suggestion>"],
  "idealAnswer": "<reference approach or pseudocode>",
  "complexityAnalysis": { "time": "<O(?)>", "space": "<O(?)>" },
  "notes": ["<extra note>"],
  "mode": "${mode}"
}

Context:
- Question type: ${type}
- Function name: ${functionName}
- Parameters: ${rawParams.map(p => `${p.name} (${language === 'python' ? p.pyType : language === 'java' ? p.javaType : language === 'cpp' ? p.cppType : language === 'go' ? p.goType : language === 'rust' ? p.rustType : p.jsType})`).join(', ')}
- Return type: ${language === 'python' ? returnTypes.pyType : language === 'java' ? returnTypes.javaType : language === 'cpp' ? returnTypes.cppType : language === 'go' ? returnTypes.goType : language === 'rust' ? returnTypes.rustType : returnTypes.jsType}

Rules:
1. Question is the source of truth.
2. Use example inputs/outputs from the question if present.
3. Generate at least 3 test cases (happy path, edge case, worst case).
4. If code is empty or skeleton-only, verdict = "needs_work", score = 0.
5. If syntax/compile errors exist, verdict = "compile_error".
6. Be specific in feedback — reference line numbers or patterns when possible.
7. idealAnswer = short correct approach / key insight, not full code.

---
Question:
${questionText || '(none)'}

Language: ${language}

Submitted Code:
${code || '(empty)'}

Local Run Output:
${runOutput || '(none)'}`;

  try {
    const response = await model.generateContent(prompt);
    const text = response?.response?.text?.() || '';
    if (!text) return { success: false, error: 'Gemini returned an empty response.' };
    const parsed = parseJsonResponse(text);
    return { success: true, data: parsed, raw: text };
  } catch (error) {
    return { success: false, error: error.message || 'Could not parse Gemini response.' };
  }
};

// ─── HINT GENERATOR ───────────────────────────────────────────────────────────
export const getHintFromGemini = async ({
  question = {},
  code = '',
  language = 'java',
  hintLevel = 1,
}) => {
  const model = getGeminiModel();
  if (!model) return { success: false, error: 'Gemini API key missing.' };

  const questionText = getQuestionText(question);
  const levels = ['gentle nudge', 'clearer direction', 'near-explicit hint with example'];
  const levelDesc = levels[Math.min(hintLevel - 1, 2)];

  const prompt = `You are a helpful coding mentor. Give a ${levelDesc} (hint level ${hintLevel}/3).
Do NOT give the full solution. Guide the candidate to think in the right direction.
Keep the hint under 4 sentences. Plain text only, no JSON.

Question:
${questionText}

Candidate's current code (${language}):
${code || '(empty)'}`;

  try {
    const response = await model.generateContent(prompt);
    const hint = response?.response?.text?.()?.trim() || '';
    return hint ? { success: true, hint } : { success: false, error: 'Empty hint returned.' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ─── REAL-TIME CODE REVIEW ────────────────────────────────────────────────────
export const getLiveCodeFeedback = async ({ question = {}, code = '', language = 'java' }) => {
  const model = getGeminiModel();
  if (!model) return { success: false, error: 'Gemini API key missing.' };
  if (!code || code.trim().length < 20) return { success: true, suggestions: [] };

  const questionText = getQuestionText(question);

  const prompt = `You are a coding assistant giving real-time feedback while the candidate types.
Look at the code in progress and give up to 3 short, actionable suggestions.
Return VALID JSON ONLY — an array of strings: ["suggestion1", "suggestion2", ...]

Language: ${language}
Question: ${questionText || '(none)'}
Code so far:
${code}`;

  try {
    const response = await model.generateContent(prompt);
    const text = response?.response?.text?.() || '[]';
    const cleaned = stripCodeFences(text);
    const suggestions = JSON.parse(cleaned);
    return { success: true, suggestions: Array.isArray(suggestions) ? suggestions : [] };
  } catch (error) {
    return { success: false, error: error.message };
  }
};