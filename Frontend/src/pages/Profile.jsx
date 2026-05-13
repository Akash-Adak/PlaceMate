import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getUserProfile, updateUserProfile } from "../services/resume";
import Navbar from "../components/Navbar";
import { User, Mail, FileText, Save, Briefcase, Award, Calendar, MapPin, Edit2, Sparkles, ExternalLink, Link2 } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [profile, setProfile] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [tier, setTier] = useState('Basic');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!user?.uid) return;
      console.log("from profile",user.uid);
      const p = await getUserProfile(user.uid);
      setProfile(p || {});
      setDisplayName(user.displayName || "");
      setBio((p && p.bio) || "");
      setTier((p && (p.tier || (p.subscription && p.subscription.plan))) || 'Basic');
    };
    load();
  }, [user]);

  const onSave = async () => {
    if (!user?.uid) return;
    setSaving(true);
    const updates = { displayName, bio, tier };
    const res = await updateUserProfile(user.uid, updates);
    if (res.success) {
      const refreshed = await getUserProfile(user.uid);
      setProfile(refreshed || {});
    }
    setSaving(false);
  };

  /* ── Theme tokens ────────────────────────────────────────────── */
  const T = {
    pageBg: isDark
      ? "min-h-screen bg-black text-white"
      : "min-h-screen bg-gradient-to-br from-[#F8FAFC] via-white to-[#F1F5F9] text-slate-800",
    
    mainContainer: isDark
      ? "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 lg:pt-36 pb-12 sm:pb-16 lg:pb-20"
      : "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 lg:pt-36 pb-12 sm:pb-16 lg:pb-20",
    
    header: isDark
      ? "mb-6 sm:mb-8 text-center sm:text-left"
      : "mb-6 sm:mb-8 text-center sm:text-left",
    
    title: isDark
      ? "text-3xl sm:text-4xl lg:text-5xl font-black uppercase italic tracking-tight text-white mb-2"
      : "text-3xl sm:text-4xl lg:text-5xl font-black uppercase italic tracking-tight text-slate-800 mb-2",
    
    titleAccent: isDark
      ? "text-amber-500"
      : "text-indigo-600",
    
    subtitle: isDark
      ? "text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto sm:mx-0"
      : "text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto sm:mx-0",
    
    contentCard: isDark
      ? "bg-[#0a0a0a] border border-white/5 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl"
      : "bg-white border border-indigo-100 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl",
    
    leftSection: isDark
      ? "p-5 sm:p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-white/5"
      : "p-5 sm:p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-indigo-100",
    
    rightSection: isDark
      ? "p-5 sm:p-6 lg:p-8"
      : "p-5 sm:p-6 lg:p-8",
    
    avatarContainer: isDark
      ? "flex flex-col items-center mb-5 sm:mb-6"
      : "flex flex-col items-center mb-5 sm:mb-6",

    avatarWrapper: isDark
      ? "relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-2 border-amber-500/30 flex items-center justify-center mb-3"
      : "relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 border-2 border-indigo-200 flex items-center justify-center mb-3",

    avatarText: isDark
      ? "text-3xl sm:text-4xl lg:text-5xl font-black text-amber-500"
      : "text-3xl sm:text-4xl lg:text-5xl font-black text-indigo-600",
    
    name: isDark
      ? "text-base sm:text-lg font-black text-white text-center"
      : "text-base sm:text-lg font-black text-slate-800 text-center",
    
    email: isDark
      ? "text-[10px] sm:text-xs text-slate-500 text-center break-all px-2"
      : "text-[10px] sm:text-xs text-slate-400 text-center break-all px-2",
    
    label: isDark
      ? "text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2"
      : "text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2",
    
    input: isDark
      ? "w-full bg-black/50 border border-white/10 rounded-xl p-2.5 sm:p-3 text-sm text-white focus:border-amber-500 outline-none transition-all placeholder:text-slate-700"
      : "w-full bg-white border border-indigo-200 rounded-xl p-2.5 sm:p-3 text-sm text-slate-800 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 shadow-sm",
    
    textarea: isDark
      ? "w-full bg-black/50 border border-white/10 rounded-xl p-2.5 sm:p-3 text-sm text-white focus:border-amber-500 outline-none transition-all resize-none"
      : "w-full bg-white border border-indigo-200 rounded-xl p-2.5 sm:p-3 text-sm text-slate-800 focus:border-indigo-500 outline-none transition-all resize-none shadow-sm",
    
    readonlyInput: isDark
      ? "w-full bg-white/5 border border-white/10 rounded-xl p-2.5 sm:p-3 text-sm text-slate-400 cursor-not-allowed"
      : "w-full bg-gray-50 border border-indigo-100 rounded-xl p-2.5 sm:p-3 text-sm text-slate-500 cursor-not-allowed",
    
    resumeLink: isDark
      ? "inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-400 hover:text-amber-300 transition-colors"
      : "inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors",

    resumeLinkCard: isDark
      ? "rounded-2xl border border-white/5 bg-white/[0.03] p-4"
      : "rounded-2xl border border-indigo-100 bg-indigo-50/40 p-4",
    
    resumePlaceholder: isDark
      ? "text-xs sm:text-sm text-slate-500"
      : "text-xs sm:text-sm text-slate-400",
    
    fileInput: isDark
      ? "w-full mt-2 text-xs sm:text-sm text-slate-400 file:mr-3 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4 file:rounded-xl file:border-0 file:text-[9px] sm:file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-amber-500 file:text-black file:hover:bg-amber-400 file:cursor-pointer file:transition-colors"
      : "w-full mt-2 text-xs sm:text-sm text-slate-500 file:mr-3 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4 file:rounded-xl file:border-0 file:text-[9px] sm:file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-indigo-600 file:text-white file:hover:bg-indigo-700 file:cursor-pointer file:transition-colors",
    
    button: isDark
      ? "w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest text-[9px] sm:text-[10px] rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
      : "w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black uppercase tracking-widest text-[9px] sm:text-[10px] rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md disabled:opacity-50 disabled:cursor-not-allowed",
    
    sectionDivider: isDark
      ? "my-5 sm:my-6 h-px bg-white/5"
      : "my-5 sm:my-6 h-px bg-indigo-100",
    
    infoRow: isDark
      ? "flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-400"
      : "flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-600",
    
    infoIcon: isDark
      ? "text-amber-500"
      : "text-indigo-600",
    
    headerIcon: isDark
      ? "w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mx-auto sm:mx-0 mb-3 sm:mb-0"
      : "w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-indigo-100 flex items-center justify-center mx-auto sm:mx-0 mb-3 sm:mb-0",
  };

  return (
    <div className={T.pageBg}>
      <Navbar />
      
      <main className={T.mainContainer}>
        {/* Header with spacing from navbar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={T.header}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className={T.headerIcon}>
                <Sparkles size={20} className={isDark ? "text-amber-500" : "text-indigo-600"} />
              </div>
              <div>
                <h1 className={T.title}>
                  Your <span className={T.titleAccent}>Profile</span>
                </h1>
                <p className={T.subtitle}>
                  Manage your personal details and career information
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Profile Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={T.contentCard}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
            {/* Left Column - Avatar & Basic Info */}
            <div className={T.leftSection}>
              <div className={T.avatarContainer}>
                <div className={T.avatarWrapper}>
                  <span className={T.avatarText}>
                    {displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <h2 className={T.name}>{displayName || 'Anonymous User'}</h2>
                  <p className={T.email}>{user?.email}</p>
                  {profile?.subscription?.status === 'active' && (
                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-black uppercase tracking-widest">
                      <Sparkles size={14} /> Pro Member
                    </div>
                  )}
              </div>

              <div className={T.sectionDivider} />

              <div className="space-y-3">
                <div className={T.infoRow}>
                  <Briefcase size={14} className={T.infoIcon} />
                  <span>Student / Professional</span>
                </div>
                <div className={T.infoRow}>
                  <Calendar size={14} className={T.infoIcon} />
                  <span>Joined {new Date(user?.metadata?.creationTime).toLocaleDateString()}</span>
                </div>
                <div className={T.infoRow}>
                  <MapPin size={14} className={T.infoIcon} />
                  <span>India</span>
                </div>
                <div className={T.infoRow}>
                  <Award size={14} className={T.infoIcon} />
                  <span>PlaceMate Member</span>
                </div>
              </div>
            </div>

            {/* Right Column - Edit Form */}
            <div className={T.rightSection}>
              <div className="space-y-5">
                <div>
                  <label className={T.label}>
                    <User size={12} className="inline mr-1" /> Full Name
                  </label>
                  <input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className={T.input}
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className={T.label}>
                    <Mail size={12} className="inline mr-1" /> Email Address
                  </label>
                  <input
                    value={user?.email || ""}
                    readOnly
                    className={T.readonlyInput}
                  />
                  <p className="text-[8px] sm:text-[9px] text-slate-400 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className={T.label}>
                    <Edit2 size={12} className="inline mr-1" /> Bio / About
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    className={T.textarea}
                    placeholder="Tell us about yourself, your experience, and career goals..."
                  />
                </div>

                <div className={T.sectionDivider} />

                <div>
                  <label className={T.label}>
                    <FileText size={12} className="inline mr-1" /> Resume Links
                  </label>
                  <div className="mt-2 space-y-3">
                    {profile?.resumeLinks?.length ? (
                      profile.resumeLinks.map((resume, index) => (
                        <div key={resume.id || `${resume.link}-${index}`} className={T.resumeLinkCard}>
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                                Resume {index + 1}
                              </p>
                              <p className="text-sm font-bold break-all text-slate-800 dark:text-white">
                                {resume.label}
                              </p>
                              {resume.updatedAt ? (
                                <p className="text-[10px] text-slate-500 mt-1">
                                  Updated {resume.updatedAt}
                                </p>
                              ) : null}
                            </div>
                            <a href={resume.link} target="_blank" rel="noreferrer" className={T.resumeLink}>
                              <ExternalLink size={14} /> Open
                            </a>
                          </div>
                          <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-500 break-all">
                            <Link2 size={12} />
                            <span>{resume.link}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className={T.resumePlaceholder}>No resume links found for this user yet.</p>
                    )}
                  </div>
                </div>

               

                <div className="pt-4 flex justify-center sm:justify-start">
                  <button onClick={onSave} disabled={saving} className={T.button}>
                    {saving ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={14} />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;