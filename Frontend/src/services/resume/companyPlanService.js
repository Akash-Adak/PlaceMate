/**
 * Company plan generation helpers.
 */
import { db } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { VITE_N8N_COMPANY_PLAN_TARGET } from "./shared";

const isPermissionDeniedError = (error) =>
  error?.code === "permission-denied" ||
  error?.message?.toLowerCase().includes("missing or insufficient permissions");

export const generateCompanyPlan = async (userId, userName, level, companyData, forceRefresh = false) => {
  try {
    const safeCompanyName = companyData.name.replace(/[^a-zA-Z0-9]/g, "_");
    const docId = `${userId}_${safeCompanyName}`;
    const docRef = doc(db, "placemate-user-plan", docId);

    // If not forcing refresh, check Firestore first
    if (!forceRefresh) {
      console.log(`🔍 Checking Firestore for existing plan: ${docId}`);
      
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const docData = docSnap.data();
          console.log(`✅ Document exists for ${companyData.name}`);
          
          // Check if data is wrapped in planData or directly at root
          let planData;
          if (docData.planData) {
            // Structure 1: { planData: { ... } }
            planData = docData.planData;
            console.log("📦 Found planData wrapper structure");
          } else if (docData.target_company || docData.days) {
            // Structure 2: Data directly at root level (your current structure)
            planData = docData;
            console.log("📦 Found direct data structure at root");
          } else {
            console.error("❌ Unknown document structure:", Object.keys(docData));
            throw new Error("Invalid plan structure in Firestore");
          }
          
          // Validate required fields
          if (!planData.days || !planData.plan_summary) {
            console.error("❌ Required fields missing:", {
              hasDays: !!planData.days,
              hasSummary: !!planData.plan_summary,
              daysLength: planData.days?.length,
              targetCompany: planData.target_company
            });
            throw new Error("Plan data is incomplete");
          }
          
          console.log(`✅ Loaded existing plan for ${companyData.name} from Firestore`);
          console.log(`📊 Plan has ${planData.days.length} days, target: ${planData.target_company}`);
          
          return { success: true, data: planData, fromCache: true };
        } else {
          console.log(`📭 No existing plan found for ${companyData.name} in Firestore`);
        }
      } catch (firestoreReadError) {
        if (!isPermissionDeniedError(firestoreReadError)) {
          console.error(
            `Firestore read error for ${companyData.name}:`,
            firestoreReadError?.message || firestoreReadError,
          );
          // Don't throw, try to generate new plan
          console.log("⚠️ Continuing to generate new plan...");
        } else {
          console.warn(`Permission denied reading from Firestore for ${companyData.name}`);
        }
      }
    } else {
      console.log(`🔄 Force refresh enabled - generating new plan for ${companyData.name}`);
    }

    // Generate new plan from n8n
    console.log(`🆕 Generating new plan for ${companyData.name} from n8n...`);
    
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

    console.log(`📤 Sending request to n8n for ${companyData.name}...`);
    
    const response = await fetch(VITE_N8N_COMPANY_PLAN_TARGET, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Plan Generation Failed: ${response.status} ${response.statusText}`);
    }

    const rawData = await response.json();
    console.log(`📥 Received response from n8n for ${companyData.name}`);

    // Handle different response formats from n8n
    let data = Array.isArray(rawData) ? rawData[0] : rawData;
    
    // If response has output field (common in n8n)
    if (data && data.output) {
      data = data.output;
      console.log("📦 Extracted output field");
    }
    
    // If response has data field
    if (data && data.data) {
      data = data.data;
      console.log("📦 Extracted data field");
    }

    // Validate the response has required fields
    if (!data) {
      console.error("No data received from n8n");
      throw new Error("No data received from n8n");
    }
    
    if (!data.days && !data.plan_summary) {
      console.error("Invalid plan data received from n8n, missing required fields");
      console.error("Received data keys:", Object.keys(data));
      throw new Error("Invalid plan data received from n8n");
    }

    // Ensure the plan has all required fields
    const completePlan = {
      // Root level fields
      username: data.username || userId,
      target_company: data.target_company || companyData.name,
      level: data.level || level,
      plan_length_days: data.plan_length_days || 12,
      plan_summary: data.plan_summary || "",
      daily_commitment: data.daily_commitment || "2-3 hours",
      overall_readiness: data.overall_readiness || "needs_prep",
      culture_tip: data.culture_tip || "",
      company_bar: data.company_bar || "",
      biggest_risk: data.biggest_risk || "",
      
      // Arrays
      strengths: data.strengths || [],
      gaps: data.gaps || [],
      missing_skills: data.missing_skills || [],
      
      // Days array
      days: data.days || [],
      
      // Verdict
      final_verdict: data.final_verdict || data.verdict || {
        score: data.score || 0,
        verdict: data.verdict || "needs_prep",
        message: data.message || "",
        apply_after: data.apply_after || "",
        careers_url: data.careers_url || "",
        focus_areas: data.focus_areas || []
      },
      
      // Preserve any additional fields
      ...data
    };

    console.log(`✅ Plan generated successfully with ${completePlan.days.length} days`);

    // Save the newly generated plan to Firestore (save directly at root, not wrapped)
    try {
      const saveData = {
        username: completePlan.username,
        target_company: completePlan.target_company,
        level: completePlan.level,
        plan_length_days: completePlan.plan_length_days,
        plan_summary: completePlan.plan_summary,
        daily_commitment: completePlan.daily_commitment,
        overall_readiness: completePlan.overall_readiness,
        culture_tip: completePlan.culture_tip,
        company_bar: completePlan.company_bar,
        biggest_risk: completePlan.biggest_risk,
        strengths: completePlan.strengths,
        gaps: completePlan.gaps,
        missing_skills: completePlan.missing_skills,
        days: completePlan.days,
        final_verdict: completePlan.final_verdict,
        selected_at: new Date().toISOString(),
        userId: userId,
        companyName: companyData.name,
        generatedAt: new Date().toISOString(),
        lastAccessed: new Date().toISOString()
      };
      
      await setDoc(docRef, saveData);
      console.log(`✅ Saved new plan for ${companyData.name} to Firestore`);
      
      // Verify the save was successful
      const verifyDoc = await getDoc(docRef);
      if (verifyDoc.exists()) {
        console.log(`✅ Verified: Plan for ${companyData.name} successfully saved`);
        const savedKeys = Object.keys(verifyDoc.data());
        console.log(`📦 Saved fields: ${savedKeys.join(", ")}`);
      } else {
        console.warn(`⚠️ Warning: Plan may not have saved correctly`);
      }
    } catch (firestoreWriteError) {
      if (!isPermissionDeniedError(firestoreWriteError)) {
        console.error(
          `Firestore write error for ${companyData.name}:`,
          firestoreWriteError?.message || firestoreWriteError,
        );
        // Continue even if save fails - we still have the plan data
      } else {
        console.warn(`Permission denied writing to Firestore for ${companyData.name}`);
      }
    }

    return { success: true, data: completePlan, fromCache: false };
  } catch (error) {
    console.error("Company Plan Generation Error:", error);
    return { success: false, error: error.message };
  }
};