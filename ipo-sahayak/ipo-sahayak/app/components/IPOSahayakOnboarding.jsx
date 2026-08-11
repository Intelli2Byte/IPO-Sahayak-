"use client";

import { useState, useEffect, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { 
  CheckCircle2, 
  Loader2, 
  Building2, 
  LogIn, 
  AlertCircle, 
  RefreshCw, 
  LayoutDashboard,
  Eye,
  EyeOff
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Shared Attributes                                                 */
/* ------------------------------------------------------------------ */
const NO_AUTOFILL = {
  autoComplete: "off",
  autoCorrect: "off",
  autoCapitalize: "off",
  spellCheck: false,
  "data-lpignore": "true",
  "data-1p-ignore": "true",
};

/* ------------------------------------------------------------------ */
/* Header & Footer                                                   */
/* ------------------------------------------------------------------ */
function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 py-2.5 backdrop-blur-md shadow-sm shrink-0">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 sm:px-8">
        <div className="flex items-center gap-5 sm:gap-6">
          <img
            src="/logos/IPO-sahayak_logo-new.png"
            alt="IPO-Sahayak"
            className="h-16 w-16 shrink-0 object-contain"
          />
          <div className="h-12 w-px bg-slate-300" />
          <img
            src="/logos/sebi-logo.png"
            alt="SEBI — Securities and Exchange Board of India"
            className="h-14 w-auto object-contain"
          />
        </div>

        <div className="flex items-center gap-5 sm:gap-6">
          <img src="/logos/mse.png" alt="MSE" className="h-12 w-auto object-contain" />
          <div className="hidden h-12 w-px bg-slate-300 sm:block" />
          <img src="/logos/gstn.png" alt="GSTN" className="h-10 w-auto object-contain" />
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-3 mt-auto shrink-0">
      <p className="font-noto mx-auto max-w-7xl px-6 text-center text-xs text-slate-400 sm:px-8">
        A unified issuer services facility under SEBI · Ministry of Corporate Affairs · GSTN
      </p>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Ambient Background Animation                                      */
/* ------------------------------------------------------------------ */
function AmbientBackground() {
  const blueRef = useRef(null);
  const greenRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(blueRef.current, { x: 30, y: 20, duration: 9, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(greenRef.current, { x: -25, y: -15, duration: 11, repeat: -1, yoyo: true, ease: "sine.inOut" });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div ref={blueRef} className="absolute top-10 left-10 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl" />
      <div ref={greenRef} className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Screen 1 — Landing                                                */
/* ------------------------------------------------------------------ */
function LandingScreen({ onRegister }) {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".landing-hero", { y: 16, opacity: 0, duration: 0.55 })
        .from(".landing-card", { y: 20, opacity: 0, duration: 0.6 }, "-=0.3");
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative isolate flex flex-1 flex-col items-center justify-center px-6 py-10">
      <AmbientBackground />
      <div className="landing-hero mb-9 max-w-md text-center">
        <p className="font-karla mb-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
          SME Onboarding Portal
        </p>
        <h1 className="font-montserrat text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Welcome to IPO-Sahayak
        </h1>
        <p className="font-noto mx-auto mt-3 text-sm text-slate-500 sm:text-base">
          Register your company or sign in to continue your public issue journey.
        </p>
      </div>

      <div className="landing-card w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40">
        <div className="grid grid-cols-1 divide-y divide-slate-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          <button
            type="button"
            onClick={onRegister}
            className="group flex flex-col items-center justify-center gap-2.5 px-8 py-12 transition-all hover:bg-blue-50/60 active:scale-[0.98]"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100 border border-blue-100">
              <Building2 className="h-5 w-5" strokeWidth={1.8} />
            </span>
            <span className="font-karla text-base font-semibold text-slate-800 group-hover:text-blue-700">
              Register as an SME Issuer
            </span>
            <span className="font-noto text-xs text-slate-400">Start your company verification</span>
          </button>

          <button
            type="button"
            className="group flex flex-col items-center justify-center gap-2.5 px-8 py-12 transition-all hover:bg-slate-50 active:scale-[0.98]"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 transition-colors group-hover:bg-slate-200 border border-slate-200">
              <LogIn className="h-5 w-5" strokeWidth={1.8} />
            </span>
            <span className="font-karla text-base font-semibold text-slate-800">Login</span>
            <span className="font-noto text-xs text-slate-400">Access your existing account</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Screen 2 — Issuer registration                                    */
/* ------------------------------------------------------------------ */
const CIN_LENGTH = 21; 

const MCA21_MOCK_DB = {
  "U12345MH2023PTC123456": {
    corporateIdentity: "Reliance Tech Ventures Pvt Ltd",
    authorizedPromoterPan: "ABCDE1234F",
    paidUpCapital: "₹50,00,000",
    status: "Active",
  },
};

const generateNumericCaptcha = () => Math.floor(100000 + Math.random() * 900000).toString();

function SignUpScreen({ onBack, onComplete }) {
  const [cin, setCin] = useState("");
  const [registryEmail, setRegistryEmail] = useState("");
  
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [captchaValue, setCaptchaValue] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  
  const [fetchStatus, setFetchStatus] = useState("idle"); 
  const [profile, setProfile] = useState(null);

  const timeoutRef = useRef(null);
  const formRef = useRef(null);
  const panelRef = useRef(null);
  const captchaInputRef = useRef(null); 

  useEffect(() => {
    setCaptchaValue(generateNumericCaptcha());
  }, []);

  const handleRefreshCaptcha = () => {
    setCaptchaValue(generateNumericCaptcha());
    setCaptchaInput(""); 
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".form-field", { y: 10, opacity: 0, duration: 0.4, stagger: 0.04, ease: "power2.out" });
    }, formRef);
    return () => ctx.revert();
  }, []);

  // Shake animation for incorrect captcha
  useEffect(() => {
    if (captchaInput.length === 6 && captchaInput !== captchaValue) {
      gsap.fromTo(
        captchaInputRef.current,
        { x: -5 },
        { x: 5, duration: 0.1, yoyo: true, repeat: 3, ease: "power1.inOut", clearProps: "x" }
      );
    }
  }, [captchaInput, captchaValue]);

  useEffect(() => {
    const normalized = cin.trim().toUpperCase();
    clearTimeout(timeoutRef.current);

    if (normalized.length !== CIN_LENGTH) {
      setFetchStatus("idle");
      setProfile(null);
      return;
    }

    setFetchStatus("loading");
    timeoutRef.current = setTimeout(() => {
      const record = MCA21_MOCK_DB[normalized];
      if (record) {
        setProfile(record);
        setFetchStatus("resolved");
      } else {
        setFetchStatus("error");
      }
    }, 800);

    return () => clearTimeout(timeoutRef.current);
  }, [cin]);

  useEffect(() => {
    if (fetchStatus === "resolved") {
      gsap.fromTo(panelRef.current, { height: 0, opacity: 0 }, { height: "auto", opacity: 1, duration: 0.4, ease: "power2.out" });
    } else {
      gsap.to(panelRef.current, { height: 0, opacity: 0, duration: 0.25, ease: "power2.in" });
    }
  }, [fetchStatus]);

  // Validation Logic
  const isVerified = fetchStatus === "resolved";
  const isCaptchaValid = captchaInput === captchaValue && captchaValue !== "";
  const isCaptchaError = captchaInput.length === 6 && !isCaptchaValid;
  
  const isPasswordValid = 
    password.length >= 8 && 
    /[A-Z]/.test(password) && 
    /[0-9]/.test(password);

  const canSubmit = isVerified && registryEmail.includes("@") && isPasswordValid && isCaptchaValid;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (canSubmit) onComplete(); 
  };

  return (
    <div className="relative isolate flex flex-1 items-center justify-center px-4 py-4 sm:px-6">
      <AmbientBackground />

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="w-full max-w-[34rem] rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/50 flex flex-col z-10"
      >
        <button
          type="button"
          onClick={onBack}
          className="form-field font-karla mb-4 text-xs font-medium text-slate-400 transition-colors hover:text-blue-600 self-start"
        >
          ← Back
        </button>

        <div className="form-field mb-5">
          <h1 className="font-montserrat mb-1 text-xl font-bold tracking-tight text-slate-900">
            SME Issuer Registration
          </h1>
          <p className="font-noto text-xs text-slate-500">
            Create your account credentials and verify your corporate identity.
          </p>
        </div>

        <div className="space-y-4 flex-1">
          {/* CIN INPUT FIELD */}
          <Field className="form-field" label="Corporate Identification Number (CIN)">
            <div className="relative">
              <input
                id="cin"
                type="text"
                required
                {...NO_AUTOFILL}
                maxLength={CIN_LENGTH}
                value={cin}
                onChange={(e) => setCin(e.target.value.toUpperCase())}
                placeholder="Enter 21-character CIN (e.g. U12345MH2023PTC...)"
                className={`font-noto w-full rounded-xl border bg-white px-3.5 py-2.5 pr-10 text-sm font-medium uppercase tracking-wide text-slate-800 outline-none transition-all focus:ring-4 ${
                  fetchStatus === "resolved"
                    ? "border-emerald-500 focus:border-emerald-600 focus:ring-emerald-500/20"
                    : fetchStatus === "error"
                    ? "border-red-400 focus:border-red-500 focus:ring-red-500/20 bg-red-50/50"
                    : "border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
                }`}
              />
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                {fetchStatus === "loading" && <Loader2 className="h-4 w-4 animate-spin text-blue-600" />}
                {fetchStatus === "resolved" && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                {fetchStatus === "error" && <AlertCircle className="h-4 w-4 text-red-500" />}
              </div>
            </div>
            
            <div className="font-noto mt-1.5 flex justify-between text-[10px] font-medium">
              <span className={fetchStatus === "error" ? "text-red-500" : "text-slate-500"}>
                {fetchStatus === "error" ? "CIN not found in registry." : "Requires 21 alphanumeric characters"}
              </span>
              <span className={`transition-colors ${cin.length === CIN_LENGTH ? "text-emerald-600" : "text-slate-400"}`}>
                {cin.length} / {CIN_LENGTH}
              </span>
            </div>
          </Field>

          {/* BACKGROUND FETCHED DATA PANEL */}
          <div ref={panelRef} className="form-field overflow-hidden" style={{ height: 0, opacity: 0 }}>
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
              <div className="mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <p className="font-karla text-[10px] font-bold uppercase tracking-wide text-emerald-800">
                  Verified via MCA21
                </p>
              </div>
              <div className="space-y-2">
                <ReadOnlyRow label="Company Name" value={profile?.corporateIdentity} />
                <ReadOnlyRow label="Authorized PAN" value={profile?.authorizedPromoterPan} />
                <ReadOnlyRow label="Status" value={profile?.status} />
              </div>
            </div>
          </div>

          <div className="form-field grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Primary Registry Email">
              <input
                type="email"
                required
                {...NO_AUTOFILL}
                value={registryEmail}
                onChange={(e) => setRegistryEmail(e.target.value)}
                placeholder="admin@company.com"
                className="font-noto w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
              />
            </Field>

            <Field label="Create Password">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`font-noto w-full rounded-xl border px-3.5 py-2.5 pr-9 text-sm font-medium text-slate-800 outline-none transition-all focus:ring-4 ${
                    password.length > 0 && !isPasswordValid 
                      ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" 
                      : "border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className={`font-noto mt-1 text-[9px] ${
                password.length > 0 && !isPasswordValid ? "text-red-500" : "text-slate-500"
              }`}>
                Min 8 chars, 1 uppercase, 1 number
              </p>
            </Field>
          </div>

          {/* CAPTCHA SECTION */}
          <Field className="form-field" label="Security Verification">
            <div className="flex gap-2.5">
              <div className="flex items-center gap-1.5">
                <div className="font-karla flex h-11 w-24 shrink-0 select-none items-center justify-center rounded-xl bg-slate-800 text-base font-bold tracking-[0.2em] text-white decoration-wavy line-through decoration-slate-400">
                  {captchaValue}
                </div>
                <button
                  type="button"
                  onClick={handleRefreshCaptcha}
                  className="flex h-11 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition-colors"
                  title="Refresh Captcha"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
              <div className="relative w-full" ref={captchaInputRef}>
                <input
                  type="text"
                  required
                  maxLength={6}
                  {...NO_AUTOFILL}
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter numbers"
                  className={`font-noto h-11 w-full rounded-xl border px-3.5 pr-9 text-sm font-medium text-slate-800 outline-none transition-all duration-300 focus:ring-4 ${
                    isCaptchaValid
                      ? "border-emerald-500 focus:border-emerald-600 focus:ring-emerald-500/20 bg-emerald-50/20"
                      : isCaptchaError
                      ? "border-red-400 focus:border-red-500 focus:ring-red-500/20 bg-red-50/50"
                      : "border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                />
                {isCaptchaValid && (
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  </div>
                )}
                {isCaptchaError && (
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  </div>
                )}
              </div>
            </div>
          </Field>
        </div>

        {/* GREY -> GREEN SIGN UP BUTTON */}
        <button
          type="submit"
          disabled={!canSubmit}
          className={`mt-6 w-full rounded-xl py-3 text-sm font-bold transition-all duration-300 font-karla ${
            canSubmit
              ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 active:scale-[0.98] cursor-pointer"
              : "bg-slate-200 text-slate-500 cursor-not-allowed"
          }`}
        >
          Sign Up & Create Account
        </button>
      </form>
    </div>
  );
}

function Field({ label, children, className = "" }) {
  return (
    <div className={className}>
      <label className="font-karla mb-1.5 block text-[11px] font-bold text-slate-700">{label}</label>
      {children}
    </div>
  );
}

function ReadOnlyRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-emerald-100/50 pb-1.5 last:border-0 last:pb-0">
      <span className="font-noto text-[11px] font-medium text-slate-500">{label}</span>
      <span className="font-noto text-xs font-bold text-slate-800 text-right">{value || "—"}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Screen 3 — Dashboard (Mockup)                                     */
/* ------------------------------------------------------------------ */
function DashboardScreen() {
  const dashRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".dash-element", { y: 20, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" });
    }, dashRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={dashRef} className="mx-auto max-w-7xl px-6 py-10 sm:px-8 flex-1">
      <div className="dash-element mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-montserrat text-3xl font-bold tracking-tight text-slate-900">Issuer Dashboard</h1>
          <p className="font-noto text-sm text-slate-500 mt-1">Welcome back, Reliance Tech Ventures Pvt Ltd</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700">
          <LayoutDashboard className="h-6 w-6" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="dash-element rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-karla text-sm font-bold text-slate-500">Draft Offer Documents</h3>
          <p className="font-montserrat text-4xl font-black text-slate-800 mt-2">0</p>
          <button className="font-karla mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700">+ Create New</button>
        </div>
        <div className="dash-element rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-karla text-sm font-bold text-slate-500">Active Issues</h3>
          <p className="font-montserrat text-4xl font-black text-slate-800 mt-2">0</p>
          <button className="font-karla mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700">View History</button>
        </div>
        <div className="dash-element rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <h3 className="font-karla text-sm font-bold text-emerald-800">Profile Status</h3>
          </div>
          <p className="font-montserrat text-lg font-black text-emerald-900 mt-2">Fully Verified</p>
          <p className="font-noto mt-4 text-xs font-medium text-emerald-700">MCA21 sync complete</p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Root - h-screen layout with flex-1 to prevent body scrolling      */
/* ------------------------------------------------------------------ */
export default function IPOSahayakOnboarding() {
  const [screen, setScreen] = useState("landing"); // landing | signup | dashboard

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Karla:ital,wght@0,200..800;1,200..800&family=Montserrat:ital,wght@0,500;1,500&family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap');
        
        .font-montserrat { font-family: "Montserrat", sans-serif; }
        .font-karla { font-family: "Karla", sans-serif; }
        .font-noto { font-family: "Noto Sans", sans-serif; }
      `}} />

      {/* h-screen and overflow-hidden prevent main page scrolling */}
      <div className="flex h-screen w-full flex-col bg-slate-50 text-slate-800 antialiased font-noto overflow-hidden">
        <Header />
        
        {/* The main content area takes remaining space and centers the form perfectly */}
        <main className="flex-1 flex flex-col relative overflow-hidden">
          {screen === "landing" && (
            <LandingScreen onRegister={() => setScreen("signup")} />
          )}
          {screen === "signup" && (
            <SignUpScreen 
              onBack={() => setScreen("landing")} 
              onComplete={() => setScreen("dashboard")} 
            />
          )}
          {screen === "dashboard" && (
            <DashboardScreen />
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}