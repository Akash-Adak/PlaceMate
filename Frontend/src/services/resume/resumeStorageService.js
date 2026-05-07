/**
 * Resume storage and persistence helpers.
 */
import { db } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { VITE_N8N_RESUME_TARGET } from "./shared";

export const uploadResume = async (file, userId, email) => {
  if (!file) return { success: false, error: "No file provided" };

  // Create a FormData object as per latest documentation (only userId and resume)
  const formData = new FormData();
  formData.append("userId", userId);
  formData.append("resume", file);

  try {
    const response = await fetch(VITE_N8N_RESUME_TARGET, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload Failed: ${response.status}`);
    }

    const rawData = await response.json();

    // Transform new detailed Firestore-style JSON to a clean object
    const cleanedData = rawData.fields
      ? {
          level: rawData.fields.level?.stringValue || "unknown",
          username: rawData.fields.username?.stringValue || "user",
          companies:
            rawData.fields.company?.arrayValue?.values?.map((v) => {
              const f = v.mapValue.fields;
              return {
                name: f.name?.stringValue || "Unknown Company",
                location: f.location?.stringValue || "Remote",
                type: f.type?.stringValue || "General",
                rank: f.rank?.integerValue || "0",
                matchScore: f.match_score?.integerValue || "0",
                matchReason: f.match_reason?.stringValue || "",
                applyReadiness: f.apply_readiness?.stringValue || "needs_prep",
                careersUrl: f.careers_url?.stringValue || "#",
                skillOverlap:
                  f.skill_overlap?.arrayValue?.values?.map(
                    (sv) => sv.stringValue,
                  ) || [],
                interviewFocus:
                  f.interview_focus?.arrayValue?.values?.map(
                    (sv) => sv.stringValue,
                  ) || [],
                weakAreaWarning: f.weak_area_warning?.stringValue || "",
              };
            }) || [],
        }
      : rawData;

    // PERSISTENCE: Save the results to Firestore immediately
    await saveUserResults(userId, cleanedData);

    return { success: true, data: cleanedData };
  } catch (error) {
    console.error("Resume Upload Error:", error);
    return { success: false, error: error.message };
  }
};

export const getUserResults = async (userId) => {
  try {
    console.log(userId);
    const docRef = doc(db, "placemate-user-company-recomendation", userId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    const data = docSnap.data();

    // Transform Firestore data back to the UI structure
    const parseFields = (d) => ({
      level: d.level || "unknown",
      username: userId || "user",
      companies:
        d.company?.map((c) => ({
          name: c.name || "Unknown Company",
          location: c.location || "Remote",
          type: c.type || "General",
          rank: c.rank || "0",
          matchScore: parseInt(c.match_score || c.matchScore || "0"),
          matchReason: c.match_reason || c.matchReason || "",
          applyReadiness: c.apply_readiness || c.applyReadiness || "needs_prep",
          careersUrl: c.careers_url || c.careersUrl || "#",
          skillOverlap: c.skill_overlap || c.skillOverlap || [],
          interviewFocus: c.interview_focus || c.interviewFocus || [],
          weakAreaWarning: c.weak_area_warning || c.weakAreaWarning || "",
        })) || [],
    });

    return parseFields(data);
  } catch (error) {
    console.error("❌ Error fetching persistent results:", error);
    return null;
  }
};

export const saveUserResults = async (userId, data) => {
  try {
    // Map the cleaned UI data to the Firestore structure
    // We nest the companies inside a 'company' array to match your n8n naming convention
    const firestoreData = {
      level: data.level,
      username: userId,
      company: data.companies.map((c) => ({
        name: c.name,
        location: c.location,
        type: c.type,
        rank: c.rank,
        match_score: c.matchScore || c.match_score || 0,
        match_reason: c.matchReason || c.match_reason || "",
        apply_readiness: c.applyReadiness || c.apply_readiness || "needs_prep",
        careers_url: c.careersUrl || c.careers_url || "#",
        skill_overlap: c.skillOverlap || c.skill_overlap || [],
        interview_focus: c.interviewFocus || c.interview_focus || [],
        weak_area_warning: c.weakAreaWarning || c.weak_area_warning || "",
      })),

      hasParsed: true,
      lastUpdated: new Date().toISOString(),
    };
    console.log("Saving to Firestore with structure:", firestoreData);
    const docRef = doc(db, "placemate-user-company-recomendation", userId);
    await setDoc(docRef, firestoreData);
    console.log("✅ Resume analysis saved to Firestore for persistent access.");
  } catch (error) {
    console.error("❌ Error saving results to Firestore:", error);
  }
};

export const saveSelectedCompany = async (userId, companyName) => {
  try {
    const firestoreData = {
      username: userId,
      level: 'beginner',
      company: [
        {
          name: companyName,
          location: 'Unknown',
          type: 'General',
          rank: 0,
          match_score: 0,
          match_reason: `User selected ${companyName} (manual)`,
          apply_readiness: 'unknown',
          careers_url: '#',
          skill_overlap: [],
          interview_focus: [],
          weak_area_warning: ''
        }
      ],
      hasParsed: false,
      selectedCompany: companyName,
      lastUpdated: new Date().toISOString(),
    };

    const docRef = doc(db, "placemate-user-company-recomendation", userId);
    // merge to avoid overwriting other fields
    await setDoc(docRef, firestoreData, { merge: true });
    console.log(`✅ Saved selected company (${companyName}) for user ${userId}`);
    return { success: true };
  } catch (error) {
    console.error("❌ Error saving selected company:", error);
    return { success: false, error: error.message };
  }
};