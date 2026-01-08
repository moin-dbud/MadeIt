"use client";
import { useEffect, useRef, useState } from "react";
import { auth } from "../firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Award, Rocket, ArrowRight } from "lucide-react";
import { Github, Linkedin, Twitter, Check, PartyPopper } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfileSetup() {
  const user = auth.currentUser;
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [portfolioPublic, setPortfolioPublic] = useState(true);
  const [consentGiven, setConsentGiven] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ---- FORM DATA ----
  const [formData, setFormData] = useState({
    profile: {
      fullName: "",
      username: "",
      bio: "",
      dob: {
        day: "",
        month: "",
        year: "",
      },
      photoURL: "",
    },
    education: {
      role: "student",
      college: "",
      degree: "",
      field: "",
      graduationYear: "",
      skillLevel: "beginner",
    },
    socials: {
      github: "",
      linkedin: "",
      twitter: "",
    },
    settings: {
      publicPortfolio: true,
    },
  });

  // ---- REFS ----
  const avatarInputRef = useRef(null);
  const avatarImgRef = useRef(null);
  const avatarInitialsRef = useRef(null);

  // ---- GUARD ----
  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);


  // ---- HELPERS ----
  const updateFirestore = async (payload) => {
    if (!user) return;
    try {
      const ref = doc(db, "users", user.uid);
      await updateDoc(ref, payload);
    } catch (error) {
      console.error("Error updating Firestore:", error);
      throw error;
    }
  };

  // ---- VALIDATION ----
  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.profile.fullName.trim()) newErrors.fullName = true;
      if (!formData.profile.username.trim()) newErrors.username = true;
      if (!formData.profile.bio.trim()) newErrors.bio = true;
      if (!formData.profile.dob.day || !formData.profile.dob.month || !formData.profile.dob.year) {
        newErrors.dob = true;
      }
    }

    if (step === 2) {
      if (!formData.education.college.trim()) newErrors.college = true;
      if (!formData.education.degree.trim()) newErrors.degree = true;
      if (!formData.education.field.trim()) newErrors.field = true;
      if (!formData.education.graduationYear) newErrors.graduationYear = true;
    }

    if (step === 3) {
      if (!consentGiven) newErrors.consent = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---- STEP NAVIGATION ----
  const goToStep = async (step) => {
    // Validate current step before proceeding
    if (step > currentStep && !validateStep(currentStep)) {
      return;
    }

    setLoading(true);
    try {
      if (currentStep === 1 && step > 1) {
        await updateFirestore({
          profile: formData.profile,
          "onboarding.stepCompleted": 1,
        });
      }

      if (currentStep === 2 && step > 2) {
        await updateFirestore({
          education: formData.education,
          "onboarding.stepCompleted": 2,
        });
      }

      setCurrentStep(step);
      updateProgress(step);
      setErrors({});
    } catch (error) {
      console.error("Error saving data:", error);
    } finally {
      setLoading(false);
    }
  };

  // ---- FINAL SUBMIT ----
  const finishSetup = async () => {
    if (!validateStep(3)) return;

    setLoading(true);
    try {
      await updateFirestore({
        socials: formData.socials,
        settings: {
          publicPortfolio: portfolioPublic,
        },
        onboarding: {
          stepCompleted: 3,
          profileCompleted: true,
        },
      });

      setCurrentStep(4);
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error) {
      console.error("Error finishing setup:", error);
    } finally {
      setLoading(false);
    }
  };


  // ---- PROGRESS UI ----
  const updateProgress = (step) => {
    const setActive = (id) => {
      const el = document.getElementById(id);
      if (el) {
        el.style.background = "#FF6B35";
        el.style.boxShadow = "0 0 10px rgba(255,107,53,0.5)";
      }
    };

    ["step1-indicator", "step2-indicator", "step3-indicator"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.style.background = "rgba(255,255,255,0.08)";
        el.style.boxShadow = "none";
      }
    });

    if (step >= 1) setActive("step1-indicator");
    if (step >= 2) {
      document.getElementById("line1-fill").style.width = "100%";
      setActive("step2-indicator");
    }
    if (step >= 3) {
      document.getElementById("line2-fill").style.width = "100%";
      setActive("step3-indicator");
    }
  };

  // ---- AVATAR UPLOAD ----
  const handleAvatarChange = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      avatarImgRef.current.src = e.target.result;
      avatarImgRef.current.classList.remove("hidden");
      avatarInitialsRef.current.classList.add("hidden");
      setFormData((p) => ({
        ...p,
        profile: { ...p.profile, photoURL: e.target.result },
      }));
    };
    reader.readAsDataURL(file);
  };

  // ---- BIO COUNTER ----
  // const bioLength = formData.profile.bio.length;

  // ---- UI ----
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "#0A0A0A" }}
    >
      <div className="w-full max-w-lg">

        {/* Progress */}
        <div className="flex justify-center mb-8 gap-2">
          <div id="step1-indicator" className="w-3 h-3 rounded-full bg-[#FF6B35]" />
          <div className="w-16 h-0.5 bg-white/10">
            <div id="line1-fill" className="h-full bg-[#FF6B35] w-0" />
          </div>
          <div id="step2-indicator" className="w-3 h-3 rounded-full bg-white/10" />
          <div className="w-16 h-0.5 bg-white/10">
            <div id="line2-fill" className="h-full bg-[#FF6B35] w-0" />
          </div>
          <div id="step3-indicator" className="w-3 h-3 rounded-full bg-white/10" />
        </div>

        {/* CARD */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(20px)",
          }}
        >

          {/* STEP 1 */}
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-semibold tracking-tight mb-2">
                  Personal Details
                </h2>
                <p className="text-sm text-[#A0A0A0] mb-8">
                  Let’s make this space yours
                </p>

                {/* Avatar */}
                <div className="flex justify-center mb-8">
                  <div
                    className="relative group cursor-pointer"
                    onClick={() => avatarInputRef.current.click()}
                  >
                    <div
                      className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-medium transition-all duration-300 border-2 dashed border-[#ff6b3566]"
                      style={{
                        background: "rgba(255,107,53,0.15)",
                        border: "2px dashed rgba(255,107,53,0.4)",
                        color: "#FF6B35",
                      }}
                    >
                      <span ref={avatarInitialsRef}>
                        {formData.profile.fullName?.[0] || "U"}
                      </span>
                      <img ref={avatarImgRef} className="hidden w-full h-full rounded-full object-cover" />
                    </div>
                    <input
                      ref={avatarInputRef}
                      type="file"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      hidden
                      accept="image/*"
                      onChange={(e) => handleAvatarChange(e.target.files[0])}
                    />
                  </div>
                </div>

                {/* Inputs */}
                <div className="space-y-5">
                  <div className="animate-field animation-delay-0.1s">
                    <label className="block text-xs font-medium mb-2 text-[#A0A0A0]">Full Name *</label>
                    <input
                      className={`w-full px-4 py-3 rounded-xl text-sm font-normal outline-none transition-all duration-200 bg-[#ffffff0d] focus:bg-[rgba(255,255,255,0.1)] text-white placeholder:text-[#A0A0A0] border-1 border-solid ${errors.fullName ? 'border-red-500' : 'border-[rgba(255,255,255,0.08)]'}`}
                      placeholder="John Doe"
                      required
                      value={formData.profile.fullName}
                      onChange={(e) => {
                        setFormData((p) => ({
                          ...p,
                          profile: { ...p.profile, fullName: e.target.value },
                        }));
                        if (errors.fullName) setErrors(prev => ({ ...prev, fullName: false }));
                      }}
                    />
                  </div>

                  <div className="animate-field animation-delay-0.15s">
                    <label className="block text-xs font-medium mb-2 text-[#A0A0A0]">Username *</label>
                    <div className="relative gap-2">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: "#A0A0A0" }}>@</span>
                      <input
                        className={`w-full px-8 py-3 rounded-xl text-sm font-normal outline-none transition-all duration-200 bg-[#ffffff0d] focus:bg-[rgba(255,255,255,0.1)] text-white placeholder:text-[#A0A0A0] border-1 border-solid ${errors.username ? 'border-red-500' : 'border-[rgba(255,255,255,0.08)]'}`}
                        maxLength={160}
                        placeholder="johndoe"
                        value={formData.profile.username}
                        onChange={(e) => {
                          setFormData((p) => ({
                            ...p,
                            profile: { ...p.profile, username: e.target.value },
                          }));
                          if (errors.username) setErrors(prev => ({ ...prev, username: false }));
                        }}
                      />
                    </div>

                  </div>

                  <div className="animate-field animation-delay-0.2s">
                    <label className="block text-xs font-medium mb-2 text-[#A0A0A0]">Bio *</label>
                    <div className="relative">
                      <textarea
                        id="bio"
                        maxLength={160}
                        placeholder="Tell us a bit about yourself..."
                        rows="3"
                        className={`w-full px-4 py-3 rounded-xl text-sm font-normal outline-none transition-all duration-200 bg-[#ffffff0d] focus:bg-[rgba(255,255,255,0.1)] text-white placeholder:text-[#A0A0A0] border-1 border-solid ${errors.bio ? 'border-red-500' : 'border-[rgba(255,255,255,0.08)]'}`}
                        value={formData.profile.bio}
                        onChange={(e) => {
                          setFormData((p) => ({
                            ...p, profile: { ...p.profile, bio: e.target.value }
                          }));
                          if (errors.bio) setErrors(prev => ({ ...prev, bio: false }));
                        }}
                      ></textarea>
                    </div>
                  </div>

                  <div className="animate-field animation-delay-0.25s">
                    <label className="block text-xs font-medium mb-2 text-[#A0A0A0]">Date of Birth *</label>
                    <div className="grid grid-cols-3 gap-3">
                      <input
                        type="text"
                        id="dob-day"
                        placeholder="DD"
                        maxLength={2}
                        className={`w-full px-4 py-3 rounded-xl text-sm font-normal text-center outline-none transition-all duration-200 bg-[rgba(255,255,255,0.05)] border-1 border-solid ${errors.dob ? 'border-red-500' : 'border-[rgba(255,255,255,0.08)]'} text-[#FAFAFA]`}
                        value={formData.profile.dob.day}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          setFormData((p) => ({
                            ...p,
                            profile: {
                              ...p.profile,
                              dob: { ...p.profile.dob, day: value }
                            }
                          }));
                          if (errors.dob) setErrors(prev => ({ ...prev, dob: false }));
                        }} />
                      <input
                        type="text"
                        id="dob-month"
                        placeholder="MM"
                        maxLength={2}
                        className={`w-full px-4 py-3 rounded-xl text-sm font-normal text-center outline-none transition-all duration-200 bg-[rgba(255,255,255,0.05)] border-1 border-solid ${errors.dob ? 'border-red-500' : 'border-[rgba(255,255,255,0.08)]'} text-[#FAFAFA]`}
                        value={formData.profile.dob.month}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          setFormData((p) => ({
                            ...p,
                            profile: {
                              ...p.profile,
                              dob: { ...p.profile.dob, month: value }
                            }
                          }));
                          if (errors.dob) setErrors(prev => ({ ...prev, dob: false }));
                        }} />
                      <input
                        type="text"
                        id="dob-year"
                        placeholder="YYYY"
                        maxLength={4}
                        className={`w-full px-4 py-3 rounded-xl text-sm font-normal text-center outline-none transition-all duration-200 bg-[rgba(255,255,255,0.05)] border-1 border-solid ${errors.dob ? 'border-red-500' : 'border-[rgba(255,255,255,0.08)]'} text-[#FAFAFA]`}
                        value={formData.profile.dob.year}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          setFormData((p) => ({
                            ...p,
                            profile: {
                              ...p.profile,
                              dob: { ...p.profile.dob, year: value }
                            }
                          }));
                          if (errors.dob) setErrors(prev => ({ ...prev, dob: false }));
                        }} />
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => goToStep(2)}
                  disabled={loading}
                  className="w-full mt-8 py-3 rounded-xl bg-[#FF6B35] text-[#FAFAFA] text-sm font-medium items-center cursor-pointer justify-center flex gap-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : 'Continue →'}
                </button>
                <p className="text-center text-xs mt-4 text-[#A0A0A0]">You can edit this later in settings.</p>
              </motion.div>
            )}

            {/* STEP 2 */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-semibold tracking-tight text-[#FAFAFA] mb-2">
                  What describes you?
                </h2>
                <p className="text-sm mb-8 text-[#A0A0A0]">Help us personalize your experience</p>

                {/* Role selection card */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div
                    onClick={() =>
                      setFormData((p) => ({
                        ...p,
                        education: { ...p.education, role: "student" }
                      }))
                    }
                    className={`role-card flex flex-col cursor-pointer p-4 rounded-xl text-center transition-all duration-200 hover:scale-[1.02] ${formData.education.role === "student"
                      ? "bg-[rgba(255,107,53,0.1)] border-1 border-solid border-[#FF6B35]"
                      : "bg-[rgba(255,255,255,0.05)] border-1 border-solid border-[rgba(255,255,255,0.08)]"
                      }`}
                  >
                    <span className="iconify w-6 h-6 mx-auto mb-2">
                      <GraduationCap
                        size={24}
                        color={formData.education.role === "student" ? "#FF6B35" : "#A0A0A0"}
                        strokeWidth={1.5}
                      />
                    </span>
                    <span
                      className={`text-sm font-medium ${formData.education.role === "student" ? "text-[#FAFAFA]" : "text-[#A0A0A0]"
                        }`}
                    >
                      Student
                    </span>
                  </div>

                  <div
                    onClick={() =>
                      setFormData((p) => ({
                        ...p,
                        education: { ...p.education, role: "graduate" }
                      }))
                    }
                    className={`role-card flex flex-col cursor-pointer p-4 rounded-xl text-center transition-all duration-200 hover:scale-[1.02] ${formData.education.role === "graduate"
                      ? "bg-[rgba(255,107,53,0.1)] border-1 border-solid border-[#FF6B35]"
                      : "bg-[rgba(255,255,255,0.05)] border-1 border-solid border-[rgba(255,255,255,0.08)]"
                      }`}
                  >
                    <span className="iconify w-6 h-6 mx-auto mb-2">
                      <Award
                        size={24}
                        color={formData.education.role === "graduate" ? "#FF6B35" : "#A0A0A0"}
                        strokeWidth={1.5}
                      />
                    </span>
                    <span
                      className={`text-sm font-medium ${formData.education.role === "graduate" ? "text-[#FAFAFA]" : "text-[#A0A0A0]"
                        }`}
                    >
                      Graduate
                    </span>
                  </div>

                  <div
                    onClick={() =>
                      setFormData((p) => ({
                        ...p,
                        education: { ...p.education, role: "professional" }
                      }))
                    }
                    className={`role-card flex flex-col cursor-pointer p-4 rounded-xl text-center transition-all duration-200 hover:scale-[1.02] ${formData.education.role === "professional"
                      ? "bg-[rgba(255,107,53,0.1)] border-1 border-solid border-[#FF6B35]"
                      : "bg-[rgba(255,255,255,0.05)] border-1 border-solid border-[rgba(255,255,255,0.08)]"
                      }`}
                  >
                    <span className="iconify w-6 h-6 mx-auto mb-2">
                      <Rocket
                        size={24}
                        color={formData.education.role === "professional" ? "#FF6B35" : "#A0A0A0"}
                        strokeWidth={1.5}
                      />
                    </span>
                    <span
                      className={`text-sm font-medium ${formData.education.role === "professional" ? "text-[#FAFAFA]" : "text-[#A0A0A0]"
                        }`}
                    >
                      Professional
                    </span>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-medium mb-2 text-[#A0A0A0]">College / Institute *</label>
                    <input
                      type="text"
                      id="college"
                      placeholder="e.g., Stanford University"
                      className={`w-full px-4 py-3 rounded-xl text-sm font-normal outline-none transition-all duration-200 bg-[rgba(255,255,255,0.05)] text-[#FAFAFA] border-1 border-solid ${errors.college ? 'border-red-500' : 'border-[rgba(255,255,255,0.08)]'}`}
                      value={formData.education.college}
                      onChange={(e) => {
                        setFormData((p) => ({
                          ...p,
                          education: { ...p.education, college: e.target.value }
                        }));
                        if (errors.college) setErrors(prev => ({ ...prev, college: false }));
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-2 text-[#A0A0A0]">Degree / Program *</label>
                    <input
                      type="text"
                      id="degree"
                      placeholder="e.g., B.Tech, Bachelor of Science"
                      className={`w-full px-4 py-3 rounded-xl text-sm font-normal outline-none transition-all duration-200 bg-[rgba(255,255,255,0.05)] text-[#FAFAFA] border-1 border-solid ${errors.degree ? 'border-red-500' : 'border-[rgba(255,255,255,0.08)]'}`}
                      value={formData.education.degree}
                      onChange={(e) => {
                        setFormData((p) => ({
                          ...p,
                          education: { ...p.education, degree: e.target.value }
                        }));
                        if (errors.degree) setErrors(prev => ({ ...prev, degree: false }));
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-2 text-[#A0A0A0]">Field of Study *</label>
                    <input
                      type="text"
                      id="field"
                      placeholder="e.g., Computer Science, Design..."
                      className={`w-full px-4 py-3 rounded-xl text-sm font-normal outline-none transition-all duration-200 bg-[rgba(255,255,255,0.05)] text-[#FAFAFA] border-1 border-solid ${errors.field ? 'border-red-500' : 'border-[rgba(255,255,255,0.08)]'}`}
                      value={formData.education.field}
                      onChange={(e) => {
                        setFormData((p) => ({
                          ...p,
                          education: { ...p.education, field: e.target.value }
                        }));
                        if (errors.field) setErrors(prev => ({ ...prev, field: false }));
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-2 text-[#A0A0A0]">Graduation Year *</label>
                    <div className="relative">
                      <select
                        id="graduationYear"
                        className={`w-full px-4 py-3 rounded-xl text-sm font-normal outline-none transition-all duration-200 bg-[rgba(255,255,255,0.05)] text-[#FAFAFA] border-1 border-solid ${errors.graduationYear ? 'border-red-500' : 'border-[rgba(255,255,255,0.08)]'} appearance-none`}
                        value={formData.education.graduationYear}
                        onChange={(e) => {
                          setFormData((p) => ({
                            ...p,
                            education: { ...p.education, graduationYear: e.target.value }
                          }));
                          if (errors.graduationYear) setErrors(prev => ({ ...prev, graduationYear: false }));
                        }}
                      >
                        <option className="bg-black" value="">Select year</option>
                        <option className="bg-black" value="2024">2024</option>
                        <option className="bg-black" value="2025">2025</option>
                        <option className="bg-black" value="2026">2026</option>
                        <option className="bg-black" value="2027">2027</option>
                        <option className="bg-black" value="2028">2028</option>
                        <option className="bg-black" value="2029">2029</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-2 text-[#A0A0A0]">Skill Level</label>
                    <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-[rgba(255,255,255,0.05)]">

                      <div
                        onClick={() =>
                          setFormData((p) => ({
                            ...p,
                            education: { ...p.education, skillLevel: "beginner" }
                          }))
                        }
                        className={`role-card flex flex-col cursor-pointer p-2.5 rounded-xl text-center transition-all duration-200 hover:scale-[1.02] ${formData.education.skillLevel === "beginner"
                          ? "bg-[#FF6B35] border-1 border-solid border-[#FF6B35]"
                          : ""
                          }`}
                      >
                        <span
                          className={`text-sm font-medium ${formData.education.skillLevel === "beginner" ? "text-[#FAFAFA]" : "text-[#A0A0A0]"}
                        }`}
                        >
                          Beginner
                        </span>
                      </div>

                      <div
                        onClick={() =>
                          setFormData((p) => ({
                            ...p,
                            education: { ...p.education, skillLevel: "intermediate" }
                          }))
                        }
                        className={`role-card flex flex-col cursor-pointer p-2.5 rounded-xl text-center transition-all duration-200 hover:scale-[1.02] ${formData.education.skillLevel === "intermediate"
                          ? "bg-[#FF6B35] border-1 border-solid border-[#FF6B35]"
                          : ""
                          }`}
                      >
                        <span
                          className={`text-sm font-medium ${formData.education.skillLevel === "intermediate" ? "text-[#FAFAFA]" : "text-[#A0A0A0]"}
                        }`}
                        >
                          Intermediate
                        </span>
                      </div>

                      <div
                        onClick={() =>
                          setFormData((p) => ({
                            ...p,
                            education: { ...p.education, skillLevel: "advanced" }
                          }))
                        }
                        className={`role-card flex flex-col cursor-pointer p-2.5 rounded-xl text-center transition-all duration-200 hover:scale-[1.02] ${formData.education.skillLevel === "advanced"
                          ? "bg-[#FF6B35] border-1 border-solid border-[#FF6B35]"
                          : ""
                          }`}
                      >
                        <span
                          className={`text-sm font-medium ${formData.education.skillLevel === "advanced" ? "text-[#FAFAFA]" : "text-[#A0A0A0]"}
                        }`}
                        >
                          Advanced
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button onClick={() => goToStep(1)} disabled={loading} className="px-6 py-3.5 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200 hover-bg-white/5 text-[#A0A0A0] border-1 border-solid border-[rgba(255,255,255,0.08)] disabled:opacity-50 disabled:cursor-not-allowed">Back</button>
                  <button onClick={() => goToStep(3)} disabled={loading} className="flex-1 py-3.5 rounded-xl text-sm font-medium flex cursor-pointer items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] bg-[#FF6B35] text-[#FAFAFA] disabled:opacity-50 disabled:cursor-not-allowed">{loading ? 'Saving...' : 'Continue'} <span><ArrowRight size={24} strokeWidth={1.5} /></span> </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3 */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-semibold tracking-tight text-[#FAFAFA] mb-6">
                  Connect & Share
                </h2>
                <p className="text-sm mb-8 text-[#A0A0A0]">Optional social profiles for your portfolio</p>

                <div className="space-y-5">
                  <div>
                    <label className="flex items-center gap-2 text-xs font-medium text-[#A0A0A0] mb-2">
                      <span><Github size={18} strokeWidth={1.5} /></span> GitHub
                    </label>
                    <input
                      type="url"
                      placeholder="https://github.com/username"
                      className="w-full px-4 py-3 rounded-xl text-sm font-normal outline-none transition-all duration-200 bg-[rgba(255,255,255,0.05)] border-1 border-solid border-[rgba(255,255,255,0.08)] text-[#FAFAFA]"
                      value={formData.socials.github}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          socials: { ...p.socials, github: e.target.value }
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-xs font-medium text-[#A0A0A0] mb-2">
                      <span><Linkedin size={18} strokeWidth={1.5} /></span> LinkedIn
                    </label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/username"
                      className="w-full px-4 py-3 rounded-xl text-sm font-normal outline-none transition-all duration-200 bg-[rgba(255,255,255,0.05)] border-1 border-solid border-[rgba(255,255,255,0.08)] text-[#FAFAFA]"
                      value={formData.socials.linkedin}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          socials: { ...p.socials, linkedin: e.target.value }
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-xs font-medium text-[#A0A0A0] mb-2">
                      <span><Twitter size={18} strokeWidth={1.5} /></span> Twitter / X
                    </label>
                    <input
                      type="url"
                      placeholder="https://x.com/username"
                      className="w-full px-4 py-3 rounded-xl text-sm font-normal outline-none transition-all duration-200 bg-[rgba(255,255,255,0.05)] border-1 border-solid border-[rgba(255,255,255,0.08)] text-[#FAFAFA]"
                      value={formData.socials.twitter}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          socials: { ...p.socials, twitter: e.target.value }
                        }))
                      }
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.03)] border-1 border-solid border-[rgba(255,255,255,0.08)]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#FAFAFA]">Public Portfolio</p>
                        <p className="text-xs mt-1 text-[#A0A0A0]">Share your proof of work with others</p>
                      </div>
                      <button
                        onClick={() => setPortfolioPublic(!portfolioPublic)}
                        className={`w-12 h-7 rounded-full p-1 transition-all duration-300 ${portfolioPublic ? 'bg-[#FF6B35]' : 'bg-[rgba(255,255,255,0.2)]'}`}
                      >
                        <div className={`w-5 h-5 rounded-full transition-all duration-300 ${portfolioPublic ? 'translate-x-5' : 'translate-x-0'} bg-[#FAFAFA]`}></div>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 my-6">
                    <input
                      type="checkbox"
                      checked={consentGiven}
                      onChange={() => setConsentGiven(!consentGiven)}
                      className="appearance-none w-5 h-5 border-2 border-white/20 rounded bg-black/50 cursor-pointer relative
  checked:bg-blue-500 checked:border-blue-500
  after:content-['✓'] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:text-white after:text-sm after:font-bold after:opacity-0 checked:after:opacity-100"
                    />
                    <p className="text-sm leading-relaxed text-[#A0A0A0]" >
                      I agree to the <a href="#" className="underline text-[#FAFAFA]">Terms of Service</a> and <a href="#" className="underline text-[#FAFAFA]">Privacy Policy</a>
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 mt-8">
                  <button onClick={() => goToStep(2)} disabled={loading} className="px-6 py-3.5 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200 hover-bg-white/5 text-[#A0A0A0] border-1 border-solid border-[rgba(255,255,255,0.08)] disabled:opacity-50 disabled:cursor-not-allowed">Back</button>
                  <button
                    disabled={!consentGiven || loading}
                    onClick={finishSetup}
                    className={`w-full py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${consentGiven && !loading ? "bg-[#FF6B35]" : "bg-[#FF6B35]/50"} text-white disabled:cursor-not-allowed`}
                  >
                    {loading ? 'Saving...' : 'Finish Setup'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SUCCESS */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center py-8"
            >
              <div className="absoluter insert-0 pointer-events-none overflow-hidden"></div>

              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-[rgba(255,207,53,0.15)]">
                <span><PartyPopper strokeWidth={1.5} /></span>
              </div>

              <h2 className="text-2xl font-semibold tracking-tight mb-3 text-[#FAFAFA]">Profile Ready!</h2>
              <p className="text-sm mb-8 max-w-xs mx-auto text-[#A0A0A0]">Your portfolio will now track real work, not certificates.</p>

              <button className="px-8 py-3.5 rounded-xl text-sm font-medium inline-flex items-center gap-2 transition-all duration-300 hover:scale-[1.02] bg-[#FF6B35] text-[#FAFAFA]">Go to Dashboard</button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
