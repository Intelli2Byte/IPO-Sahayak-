"use client";

import { useState, useEffect, useRef } from "react";
import { ShieldCheck, CheckCircle2, Loader2, ChevronRight, Building2 } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Header — shared across both screens                               */
/* ------------------------------------------------------------------ */
function Header() {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-4">
      <div className="flex items-center gap-4">
        {/* IPO-Sahayak mark */}
        <div className="relative flex h-11 w-11 items-center justify-center rounded-full border-2 border-blue-600 bg-white">
          <ShieldCheck className="h-5 w-5 text-blue-600" strokeWidth={2.2} />
          <svg
            className="absolute -bottom-0.5 -right-0.5 h-4 w-4 text-emerald-500"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path d="M3 17l6-6 4 4 8-8" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15 7h6v6" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="leading-tight">
          <p className="text-[10px] font-semibold tracking-wide text-blue-600">IPO-SAHAYAK</p>
          <p className="text-[15px] font-bold tracking-tight text-slate-800">
            <span className="text-blue-700">SEBI</span>{" "}
            <span className="font-medium text-slate-600">Securities and Exchange Board of India</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6 opacity-90">
        <div className="text-right leading-tight">
          <p className="text-[10px] font-bold text-slate-700">MINISTRY OF</p>
          <p className="text-[10px] font-bold text-slate-700">CORPORATE AFFAIRS</p>
          <p className="text-[9px] font-medium text-blue-600">GOVERNMENT OF INDIA</p>
        </div>
        <div className="text-lg font-extrabold tracking-tight text-slate-700">
          GS<span className="text-emerald-500">T</span>N
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Screen 1 — Landing (Register / Login)                             */
/* ------------------------------------------------------------------ */
function LandingScreen({ onRegister }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="flex min-h-[520px] items-center justify-center bg-slate-50 px-8 py-16">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-2 divide-x divide-slate-200">
          <button
            type="button"
            onClick={onRegister}
            onMouseEnter={() => setHovered("register")}
            onMouseLeave={() => setHovered(null)}
            className="group flex flex-col items-center justify-center gap-2 px-6 py-16 transition-colors hover:bg-blue-50"
          >
            <Building2
              className={`h-6 w-6 transition-colors ${
                hovered === "register" ? "text-blue-600" : "text-slate-400"
              }`}
            />
            <span className="text-base font-medium text-slate-700 group-hover:text-blue-700">
              Register as a new issuer
            </span>
          </button>

          <button
            type="button"
            onMouseEnter={() => setHovered("login")}
            onMouseLeave={() => setHovered(null)}
            className="group flex flex-col items-center justify-center gap-2 px-6 py-16 transition-colors hover:bg-blue-50"
          >
            <ChevronRight
              className={`h-6 w-6 transition-colors ${
                hovered === "login" ? "text-blue-600" : "text-slate-400"
              }`}
            />
            <span className="text-base font-medium text-slate-700 group-hover:text-blue-700">
              Login
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Screen 2 — Issuer sign-up                                         */
/* ------------------------------------------------------------------ */
const ROLES = ["SME", "MB", "CA"];

// Mock MCA21 registry lookup — keyed by the exact CIN the user is expected to type
const MCA21_MOCK_DB = {
  "884Y457345347": {
    corporateIdentity: "Neha Fashion Pvt Ltd",
    authorizedPromoterPan: "ABCDE1234F",
    paidUpCapital: "₹48,50,000",
  },
};

// Every CIN in the mock DB is this length — used to know when to fire the lookup
const CIN_MATCH_LENGTH = Object.keys(MCA21_MOCK_DB)[0].length;

function SignUpScreen({ onBack }) {
  const [role, setRole] = useState("SME");
  const [cin, setCin] = useState("");
  const [registryEmail, setRegistryEmail] = useState("");

  const [fetchStatus, setFetchStatus] = useState("idle"); // idle | loading | resolved | error
  const [profile, setProfile] = useState({
    corporateIdentity: "",
    authorizedPromoterPan: "",
    paidUpCapital: "",
  });
  const timeoutRef = useRef(null);

  // Auto-fetch the moment the typed CIN matches a known record — no button needed
  useEffect(() => {
    const normalized = cin.trim().toUpperCase();
    clearTimeout(timeoutRef.current);

    if (normalized.length !== CIN_MATCH_LENGTH) {
      setFetchStatus("idle");
      setProfile({ corporateIdentity: "", authorizedPromoterPan: "", paidUpCapital: "" });
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
    }, 700);

    return () => clearTimeout(timeoutRef.current);
  }, [cin]);

  const isVerified = fetchStatus === "resolved";
  const canSubmit = isVerified && registryEmail.trim().length > 0;

  return (
    <div className="flex min-h-[640px] justify-center bg-slate-50 px-8 py-12">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <button
          type="button"
          onClick={onBack}
          className="mb-6 text-xs font-medium text-slate-400 transition-colors hover:text-blue-600"
        >
          ← Back
        </button>

        <h1 className="mb-1 text-lg font-bold text-slate-800">Issuer registration</h1>
        <p className="mb-7 text-sm text-slate-500">
          Complete the fields below to verify and register your company.
        </p>

        <div className="space-y-5">
          {/* Role selector */}
          <Field label="Select role">
            <div className="flex gap-2">
              {ROLES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`rounded-xl border px-5 py-2 text-sm font-semibold transition-all ${
                    role === r
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </Field>

          {/* CIN — empty by default, auto-fetches on match */}
          <Field label="CIN">
            <div className="relative">
              <input
                id="cin"
                name="cin"
                type="text"
                required
                autoComplete="off"
                maxLength={CIN_MATCH_LENGTH}
                value={cin}
                onChange={(e) => setCin(e.target.value.toUpperCase())}
                placeholder="Enter Corporate Identity Number"
                className={`w-full rounded-xl border bg-white px-4 py-2.5 pr-11 text-sm font-medium uppercase tracking-wide text-slate-700 outline-none transition-colors focus:ring-2 ${
                  fetchStatus === "resolved"
                    ? "border-emerald-400 focus:border-emerald-500 focus:ring-emerald-100"
                    : fetchStatus === "error"
                    ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                    : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                }`}
              />
              <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2">
                {fetchStatus === "loading" && (
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                )}
                {fetchStatus === "resolved" && (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                )}
              </div>
            </div>
          </Field>

          {/* Auto-fetched block */}
          <div className="relative rounded-xl border border-slate-200 bg-slate-50/60 p-4">
            <div className="space-y-3">
              <ReadOnlyField
                label="Corporate Identity"
                value={profile.corporateIdentity}
                placeholder="—"
              />
              <ReadOnlyField
                label="Authorized Promoter PAN"
                value={profile.authorizedPromoterPan}
                placeholder="—"
              />
            </div>
            <span className="pointer-events-none absolute -right-2 top-1/2 -translate-y-1/2 translate-x-full whitespace-nowrap rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-500">
              auto fetched · mca21
            </span>
          </div>

          {/* Primary registry email */}
          <Field label="Primary Registry Email Contact">
            <input
              id="registryEmail"
              name="registryEmail"
              type="email"
              required
              autoComplete="off"
              value={registryEmail}
              onChange={(e) => setRegistryEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </Field>
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className={`mt-8 w-full rounded-xl py-3 text-sm font-semibold shadow-sm transition-all ${
            canSubmit
              ? "bg-emerald-500 text-white hover:bg-emerald-600 active:scale-[0.99]"
              : "cursor-not-allowed bg-slate-100 text-slate-400"
          }`}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-slate-500">{label}</label>
      {children}
    </div>
  );
}

function ReadOnlyField({ label, value, placeholder }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs font-medium text-slate-500">{label}</span>
      <span
        className={`rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium ${
          value ? "text-slate-700" : "italic text-slate-300"
        }`}
      >
        {value || placeholder}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Root                                                               */
/* ------------------------------------------------------------------ */
export default function IPOSahayakOnboarding() {
  const [screen, setScreen] = useState("landing"); // landing | signup

  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <Header />
        {screen === "landing" ? (
          <LandingScreen onRegister={() => setScreen("signup")} />
        ) : (
          <SignUpScreen onBack={() => setScreen("landing")} />
        )}
      </div>
    </div>
  );
}