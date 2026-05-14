/**
 * Question generation and answer submission helpers.
 */
import { db } from "../../firebase";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { VITE_N8N_ANSWER_TARGET, VITE_N8N_QUESTION_TARGET, getN8nProxyUrl } from "./shared";

export const generateQuestions = async (userId, companyName, dayNumber, questionType = 'all', options = {}) => {
  try {
    // 1. Check if questions already exist in Firestore
    // Use questionType and options as part of the cache key so different
    // generation requests (normal vs coding or different options) are stored separately.
    const optionsSerialized = JSON.stringify(options || {});
    const q = query(
      collection(db, "placemate-user-questions"),
      where("username", "==", userId),
      where("target_company", "==", companyName),
      where("day", "==", parseInt(dayNumber)),
      where("request_type", "==", questionType),
      where("request_options", "==", optionsSerialized),
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      console.log(
        `✅ Loaded ${querySnapshot.size} questions from Firestore cache.`,
      );
      const questions = [];
      querySnapshot.forEach((doc) => {
        questions.push({ docId: doc.id, ...doc.data() });
      });
      return { success: true, data: questions };
    }

    // Fallback: if no exact-match cache found (type/options), try a generic cache
    // for the same user/company/day and filter it locally so older cached
    // entries (created before request metadata existed) can still be reused.
    const genericQ = query(
      collection(db, "placemate-user-questions"),
      where("username", "==", userId),
      where("target_company", "==", companyName),
      where("day", "==", parseInt(dayNumber)),
    );
    const genericSnapshot = await getDocs(genericQ);
    if (!genericSnapshot.empty) {
      console.log(`ℹ️ Using generic cached questions (no type match).`);
      const allCached = [];
      genericSnapshot.forEach((doc) => allCached.push({ docId: doc.id, ...doc.data() }));

      // Apply same filtering rules as generation to satisfy the requested type
      let filtered = allCached;
      if (questionType === 'normal') {
        filtered = allCached.filter(q => q.type === 'concept' || q.type === 'applied' || q.type === 'hands_on');
      } else if (questionType === 'coding') {
        filtered = allCached.filter(q => q.type === 'dsa' || q.type === 'hands_on');
      }

      if (filtered.length > 0) {
        return { success: true, data: filtered };
      }
      // else continue to n8n generation below
    }

    // 2. Not found, fetch from n8n
    const baseUrl = getN8nProxyUrl(VITE_N8N_QUESTION_TARGET);
    // Attach options as an encoded JSON query param so n8n can read it easily
    const encodedOptions = encodeURIComponent(JSON.stringify(options || {}));
    const url = `${baseUrl}?userId=${userId}&companyName=${encodeURIComponent(companyName)}&dayNumber=${dayNumber}&questionType=${questionType}&questionOptions=${encodedOptions}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, companyName, dayNumber, questionType, questionOptions: options }),
    });

    if (!response.ok) {
      throw new Error(`Question Generation Failed: ${response.status}`);
    }

    const rawData = await response.json();

    if (!rawData || !rawData.data) {
      throw new Error("Invalid response format from question generation.");
    }

    // 3. Clean the REST API format to a normal JS object structure
    const cleanedQuestions = rawData.data.map((doc) => {
      const f = doc.fields;
      return {
        question: f.question?.stringValue || "",
        level: f.level?.stringValue || "",
        id: f.id?.stringValue || "",
      
        topic: f.topic?.stringValue || "",
        session_tip: f.session_tip?.stringValue || "",
        resource_url: f.resource_url?.stringValue || "",
        difficulty: f.difficulty?.stringValue || "",
        why_this_matters: f.why_this_matters?.stringValue || "",
        type: f.type?.stringValue || "",
        username: f.username?.stringValue || "",
        task_id: f.task_id?.stringValue || "",
        target_company: f.target_company?.stringValue || "",
        resource_label: f.resource_label?.stringValue || "",
        session: parseInt(f.session?.integerValue || "0"),
        title: f.title?.stringValue || "",
        day_title: f.day_title?.stringValue || "",
        estimated_total_time: f.estimated_total_time?.stringValue || "",
        platform: f.platform?.stringValue || "",
        link: f.link?.stringValue || "",
        expected_time: f.expected_time?.stringValue || "",
        hint: f.hint?.stringValue || "",
        day: parseInt(f.day?.integerValue || "0"),
      };
    });

    // 4. Re-order questions so they are grouped by type (concept vs coding)
    // Priority: concept -> applied -> hands_on -> dsa -> (others)
    const typePriority = {
      concept: 0,
      applied: 1,
      hands_on: 2,
      dsa: 3,
    };

    cleanedQuestions.sort((a, b) => {
      const ta = typePriority[a.type] ?? 99;
      const tb = typePriority[b.type] ?? 99;
      if (ta !== tb) return ta - tb;
      // Keep session ordering if provided
      const sa = a.session || 0;
      const sb = b.session || 0;
      if (sa !== sb) return sa - sb;
      // Fallback to stable string compare of id/title
      const ka = a.id || a.title || "";
      const kb = b.id || b.title || "";
      return ka.localeCompare(kb);
    });

    // 5. Save the generated questions to Firestore to cache them for future visits
    const questionsCollection = collection(db, "placemate-user-questions");
    await Promise.all(
      cleanedQuestions.map(async (q) => {
        // Attach request metadata so cached queries can be exact matches later
        q.request_type = questionType;
        q.request_options = optionsSerialized;

        // Auto-generate a document ID for each question
        const newDocRef = doc(questionsCollection);
        q.docId = newDocRef.id; // Assign ID to the local object so the UI can use it
        await setDoc(newDocRef, q);
      }),
    );
    console.log(`✅ Saved ${cleanedQuestions.length} AI generated questions to Firestore cache.`);

    // Filter by question type if specified
    let filteredQuestions = cleanedQuestions;
    if (questionType === 'normal') {
      // Normal questions: concept and applied
      filteredQuestions = cleanedQuestions.filter(q => 
        q.type === 'concept' || q.type === 'applied' || q.type === 'hands_on'
      );
    } else if (questionType === 'coding') {
      // Coding questions: dsa and hands_on
      filteredQuestions = cleanedQuestions.filter(q => 
        q.type === 'dsa' || q.type === 'hands_on'
      );
    }

    return { success: true, data: filteredQuestions };
  } catch (error) {
    console.error("Question Generation Error:", error);
    return { success: false, error: error.message };
  }
};

export const submitAnswer = async (userId, questionDocId, questionId, userAnswer) => {
  try {
    const baseUrl = getN8nProxyUrl(VITE_N8N_ANSWER_TARGET);

    const url = `${baseUrl}?userId=${userId}&questionId=${questionId}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, questionId, userAnswer }),
    });

    if (!response.ok) {
      throw new Error(`Answer Submission Failed: ${response.status}`);
    }

    const rawData = await response.json();

    // N8N often returns an array or wrapped object
    const resultData = Array.isArray(rawData) ? rawData[0] : (rawData.data ? rawData.data[0] : rawData);

    const evaluation = {
      score: resultData.score || 0,
      verdict: resultData.verdict || "unknown",
      feedback: resultData.feedback || "",
      improvement: resultData.improvement || "",
      idealAnswer: resultData.idealAnswer || "",
      userAnswer: userAnswer,
    };

    const savedCode = typeof userAnswer === 'string'
      ? userAnswer
      : userAnswer?.code || userAnswer?.userAnswer || '';
    const savedLanguage = typeof userAnswer === 'object' && userAnswer !== null
      ? userAnswer.language || ''
      : '';

    // Save the evaluation and the submitted code back to the specific question document in Firestore
    if (questionDocId) {
      const docRef = doc(db, "placemate-user-questions", questionDocId);
      await setDoc(
        docRef,
        {
          evaluation: evaluation,
          savedCode,
          savedLanguage,
          lastSubmittedAt: new Date().toISOString(),
        },
        { merge: true },
      );
      console.log(`✅ Saved AI Evaluation to Firestore for question ${questionId}`);
    }

    return { success: true, data: evaluation };
  } catch (error) {
    console.error("Answer Submission Error:", error);
    return { success: false, error: error.message };
  }
};