/**
 * Company plan generation helpers.
 */
import { db } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { VITE_N8N_COMPANY_PLAN_TARGET } from "./shared";

export const generateCompanyPlan = async (userId, userName, level, companyData) => {
  try {
    // 1. Check if the plan already exists in Firestore
    const safeCompanyName = companyData.name.replace(/[^a-zA-Z0-9]/g, "_");
    const docId = `${userId}_${safeCompanyName}`;
    const docRef = doc(db, "placemate-user-plans", docId);

    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log(
        `✅ Loaded existing plan for ${companyData.name} from Firestore.`,
      );
      return { success: true, data: docSnap.data().planData };
    }

    // 2. If not in DB, prepare the payload to fetch from n8n
    const payload = {
      username: userId,
      level: level,
      selected_company: {
        name: companyData.name || "",
        type: companyData.type || "",
        rank: companyData.rank || 0,
        match_score: companyData.matchScore || 0,
        match_reason: companyData.matchReason || "",
        apply_readiness: companyData.applyReadiness || "",
        careers_url: companyData.careersUrl || "",
        skill_overlap: companyData.skillOverlap || [],
        interview_focus: companyData.interviewFocus || [],
        weak_area_warning: companyData.weakAreaWarning || "",
      },
    };

    const response = await fetch(VITE_N8N_COMPANY_PLAN_TARGET, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Plan Generation Failed: ${response.status}`);
    }

    const rawData = await response.json();

    // N8N often returns an array containing the output or just the object
    const data = Array.isArray(rawData) ? rawData[0] : rawData;

    // 3. Save the newly generated plan to Firestore to prevent future n8n hits
    await setDoc(docRef, {
      userId,
      companyName: companyData.name,
      planData: data,
      generatedAt: new Date().toISOString(),
    });
    console.log(`✅ Saved new plan for ${companyData.name} to Firestore.`);

    return { success: true, data };
  } catch (error) {
    console.error("Company Plan Generation Error:", error);
    return { success: false, error: error.message };
  }
};