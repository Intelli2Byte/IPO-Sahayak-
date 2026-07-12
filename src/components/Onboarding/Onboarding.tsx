'use client';

import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { 
  CheckCircle2, 
  Loader2, 
  Building2, 
  LogIn, 
  AlertCircle, 
  RefreshCw, 
  Eye,
  EyeOff
} from 'lucide-react';

/* Shared Attributes */
const NO_AUTOFILL = {
  autoComplete: 'off',
  autoCorrect: 'off',
  autoCapitalize: 'off',
  spellCheck: false,
  'data-lpignore': 'true',
  'data-1p-ignore': 'true',
};

const CIN_LENGTH = 21; 

interface McaProfile {
  corporateIdentity: string;
  authorizedPromoterPan: string;
  paidUpCapital: string;
  status: string;
}

const MCA21_MOCK_DB: Record<string, McaProfile> = {
  'U12345MH2023PTC123456': {
    corporateIdentity: 'Reliance Tech Ventures Pvt Ltd',
    authorizedPromoterPan: 'ABCDE1234F',
    paidUpCapital: '₹50,00,000',
    status: 'Active',
  },
  'U51909TG2019PLC133166': {
    corporateIdentity: 'Neha Fashion Private Limited',
    authorizedPromoterPan: 'ABJPK4921F',
    paidUpCapital: '₹2,00,00,000',
    status: 'Active',
  }
};

const generateNumericCaptcha = () => Math.floor(100000 + Math.random() * 900000).toString();

/* Ambient Background Animation */
function AmbientBackground() {
  const blueRef = useRef(null);
  const greenRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(blueRef.current, { x: 30, y: 20, duration: 9, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to(greenRef.current, { x: -25, y: -15, duration: 11, repeat: -1, yoyo: true, ease: 'sine.inOut' });
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



function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-3.5 mt-auto shrink-0 z-10">
      <p className="font-sans mx-auto max-w-7xl px-6 text-center text-xs text-slate-400 font-semibold sm:px-8">
        A unified issuer services facility under SEBI · Ministry of Corporate Affairs · GSTN
      </p>
    </footer>
  );
}

interface LandingScreenProps {
  onRegister: () => void;
  onLogin: () => void;
}

/* Screen 1 — Landing */
function LandingScreen({ onRegister, onLogin }: LandingScreenProps) {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('.landing-hero', { y: 16, opacity: 0, duration: 0.55 })
        .from('.landing-card', { y: 20, opacity: 0, duration: 0.6 }, '-=0.3');
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative isolate flex flex-1 flex-col items-center justify-center px-6 py-10 w-full">
      <AmbientBackground />
      <div className="landing-hero mb-9 max-w-md text-center">
        <p className="font-sans mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">
          SME Onboarding Portal
        </p>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Welcome to IPO-Sahayak
        </h1>
        <p className="font-sans mx-auto mt-3.5 text-sm text-slate-500 font-semibold leading-relaxed">
          Register your company or sign in to continue your public issue journey.
        </p>
      </div>

      <div className="landing-card w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40">
        <div className="grid grid-cols-1 divide-y divide-slate-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          <button
            type="button"
            onClick={onRegister}
            className="group flex flex-col items-center justify-center gap-3.5 px-8 py-14 transition-all hover:bg-blue-50/60 active:scale-[0.98] cursor-pointer"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100 border border-blue-100">
              <Building2 className="h-6 w-6" strokeWidth={1.8} />
            </span>
            <span className="font-display text-base font-bold text-slate-800 group-hover:text-blue-700">
              Register as an SME Issuer
            </span>
            <span className="font-sans text-xs text-slate-400 font-semibold">Start your company verification</span>
          </button>

          <button
            type="button"
            onClick={onLogin}
            className="group flex flex-col items-center justify-center gap-3.5 px-8 py-14 transition-all hover:bg-emerald-50/60 active:scale-[0.98] cursor-pointer"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-100 border border-emerald-100">
              <LogIn className="h-6 w-6" strokeWidth={1.8} />
            </span>
            <span className="font-display text-base font-bold text-slate-800 group-hover:text-emerald-700">
              Issuer Login
            </span>
            <span className="font-sans text-xs text-slate-400 font-semibold">Access your existing account</span>
          </button>
        </div>
      </div>
    </div>
  );
}

interface SignUpScreenProps {
  onBack: () => void;
  onComplete: () => void;
  onToggleLogin: () => void;
}

/* Screen 2 — Issuer Registration */
function SignUpScreen({ onBack, onComplete, onToggleLogin }: SignUpScreenProps) {
  const [cin, setCin] = useState('');
  const [registryEmail, setRegistryEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [captchaValue, setCaptchaValue] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [fetchStatus, setFetchStatus] = useState<'idle' | 'loading' | 'resolved' | 'error'>('idle'); 
  const [profile, setProfile] = useState<McaProfile | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const captchaInputRef = useRef<HTMLDivElement>(null); 

  useEffect(() => {
    setCaptchaValue(generateNumericCaptcha());
  }, []);

  const handleRefreshCaptcha = () => {
    setCaptchaValue(generateNumericCaptcha());
    setCaptchaInput(''); 
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.form-field', { y: 10, opacity: 0, duration: 0.4, stagger: 0.04, ease: 'power2.out' });
    }, formRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (captchaInput.length === 6 && captchaInput !== captchaValue) {
      gsap.fromTo(
        captchaInputRef.current,
        { x: -5 },
        { x: 5, duration: 0.1, yoyo: true, repeat: 3, ease: 'power1.inOut', clearProps: 'x' }
      );
    }
  }, [captchaInput, captchaValue]);

  useEffect(() => {
    const normalized = cin.trim().toUpperCase();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (normalized.length !== CIN_LENGTH) {
      setFetchStatus('idle');
      setProfile(null);
      return;
    }

    setFetchStatus('loading');
    timeoutRef.current = setTimeout(() => {
      const record = MCA21_MOCK_DB[normalized];
      if (record) {
        setProfile(record);
        setFetchStatus('resolved');
      } else {
        setFetchStatus('error');
      }
    }, 800);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [cin]);

  useEffect(() => {
    if (fetchStatus === 'resolved') {
      gsap.fromTo(panelRef.current, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: 0.4, ease: 'power2.out' });
    } else {
      gsap.to(panelRef.current, { height: 0, opacity: 0, duration: 0.25, ease: 'power2.in' });
    }
  }, [fetchStatus]);

  const isVerified = fetchStatus === 'resolved';
  const isCaptchaValid = captchaInput === captchaValue && captchaValue !== '';
  const isCaptchaError = captchaInput.length === 6 && !isCaptchaValid;
  const isPasswordValid = password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
  const canSubmit = isVerified && registryEmail.includes('@') && isPasswordValid && isCaptchaValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canSubmit) onComplete(); 
  };

  return (
    <div className="relative isolate flex flex-1 items-center justify-center px-4 py-4 sm:px-6 w-full">
      <AmbientBackground />

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="w-full max-w-[34rem] rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/50 flex flex-col z-10"
      >
        <button
          type="button"
          onClick={onBack}
          className="form-field font-display mb-4 text-xs font-bold text-slate-400 transition-colors hover:text-primary self-start cursor-pointer"
        >
          ← Back to Main
        </button>

        <div className="form-field mb-5">
          <h1 className="font-display mb-1 text-xl font-bold tracking-tight text-slate-900">
            SME Issuer Registration
          </h1>
          <p className="font-sans text-xs text-slate-500 font-semibold">
            Create your account credentials and verify your corporate identity.
          </p>
        </div>

        <div className="space-y-4 flex-1">
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
                placeholder="Enter 21-character CIN (e.g. U51909TG2019PLC133166...)"
                className={`font-sans w-full rounded-xl border bg-white px-3.5 py-2.5 pr-10 text-sm font-bold uppercase tracking-wide text-slate-800 outline-none transition-all focus:ring-4 ${
                  fetchStatus === 'resolved'
                    ? 'border-emerald-500 focus:border-emerald-600 focus:ring-emerald-500/20'
                    : fetchStatus === 'error'
                    ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20 bg-red-50/50'
                    : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500/20'
                }`}
              />
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                {fetchStatus === 'loading' && <Loader2 className="h-4 w-4 animate-spin text-blue-600" />}
                {fetchStatus === 'resolved' && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                {fetchStatus === 'error' && <AlertCircle className="h-4 w-4 text-red-500" />}
              </div>
            </div>
            
            <div className="font-sans mt-1.5 flex justify-between text-[10px] font-bold">
              <span className={fetchStatus === 'error' ? 'text-red-500' : 'text-slate-500'}>
                {fetchStatus === 'error' ? 'CIN not found in MCA21 registry.' : 'Try: U51909TG2019PLC133166'}
              </span>
              <span className={`transition-colors ${cin.length === CIN_LENGTH ? 'text-emerald-600' : 'text-slate-400'}`}>
                {cin.length} / {CIN_LENGTH}
              </span>
            </div>
          </Field>

          <div ref={panelRef} className="form-field overflow-hidden" style={{ height: 0, opacity: 0 }}>
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
              <div className="mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <p className="font-display text-[10px] font-extrabold uppercase tracking-wide text-emerald-800">
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
                placeholder="compliance@nehafashion.com"
                className="font-sans w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
              />
            </Field>

            <Field label="Create Password">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`font-sans w-full rounded-xl border px-3.5 py-2.5 pr-9 text-sm font-semibold text-slate-800 outline-none transition-all focus:ring-4 ${
                    password.length > 0 && !isPasswordValid 
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500/20'
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
              <p className={`font-sans mt-1 text-[9px] font-bold ${
                password.length > 0 && !isPasswordValid ? 'text-red-500' : 'text-slate-400'
              }`}>
                Min 8 chars, 1 uppercase, 1 number
              </p>
            </Field>
          </div>

          <Field className="form-field" label="Security Verification">
            <div className="flex gap-2.5">
              <div className="flex items-center gap-1.5">
                <div className="font-display flex h-11 w-24 shrink-0 select-none items-center justify-center rounded-xl bg-slate-800 text-base font-bold tracking-[0.2em] text-white line-through decoration-wavy decoration-slate-400">
                  {captchaValue}
                </div>
                <button
                  type="button"
                  onClick={handleRefreshCaptcha}
                  className="flex h-11 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition-colors cursor-pointer"
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
                  onChange={(e) => setCaptchaInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter numbers"
                  className={`font-sans h-11 w-full rounded-xl border px-3.5 pr-9 text-sm font-semibold text-slate-800 outline-none transition-all duration-300 focus:ring-4 ${
                    isCaptchaValid
                      ? 'border-emerald-500 focus:border-emerald-600 focus:ring-emerald-500/20 bg-emerald-50/20'
                      : isCaptchaError
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20 bg-red-50/50'
                      : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500/20'
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

        <button
          type="submit"
          disabled={!canSubmit}
          className={`mt-6 w-full rounded-xl py-3 text-sm font-bold transition-all duration-300 font-display ${
            canSubmit
              ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 active:scale-[0.98] cursor-pointer'
              : 'bg-slate-200 text-slate-500 cursor-not-allowed'
          }`}
        >
          Sign Up & Create Account
        </button>

        <p className="text-center text-xs text-slate-500 mt-4 font-semibold">
          Already have an account?{' '}
          <button 
            type="button" 
            onClick={onToggleLogin}
            className="text-primary hover:underline font-bold cursor-pointer"
          >
            Login Here
          </button>
        </p>
      </form>
    </div>
  );
}

interface LoginScreenProps {
  onBack: () => void;
  onComplete: () => void;
  onToggleRegister: () => void;
}

/* Screen 3 — Custom Issuer Login Screen */
function LoginScreen({ onBack, onComplete, onToggleRegister }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [captchaValue, setCaptchaValue] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const formRef = useRef<HTMLFormElement>(null);
  const captchaInputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCaptchaValue(generateNumericCaptcha());
  }, []);

  const handleRefreshCaptcha = () => {
    setCaptchaValue(generateNumericCaptcha());
    setCaptchaInput('');
    setErrorMsg('');
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.form-field', { y: 10, opacity: 0, duration: 0.4, stagger: 0.04, ease: 'power2.out' });
    }, formRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (captchaInput !== captchaValue) {
      setErrorMsg('Security Captcha code does not match.');
      // shake captcha field
      gsap.fromTo(
        captchaInputRef.current,
        { x: -5 },
        { x: 5, duration: 0.1, yoyo: true, repeat: 3, ease: 'power1.inOut', clearProps: 'x' }
      );
      return;
    }
    // Successful login transition
    onComplete();
  };

  const canSubmit = email.includes('@') && password.length >= 6 && captchaInput.length === 6;

  return (
    <div className="relative isolate flex flex-1 items-center justify-center px-4 py-4 sm:px-6 w-full">
      <AmbientBackground />
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="w-full max-w-[34rem] rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/50 flex flex-col z-10"
      >
        <button
          type="button"
          onClick={onBack}
          className="form-field font-display mb-4 text-xs font-bold text-slate-400 transition-colors hover:text-primary self-start cursor-pointer"
        >
          ← Back to Main
        </button>

        <div className="form-field mb-5">
          <h1 className="font-display mb-1 text-xl font-bold tracking-tight text-slate-900">
            SME Issuer Portal Login
          </h1>
          <p className="font-sans text-xs text-slate-500 font-semibold">
            Sign in to continue your DRHP filing draft and regulatory clearances.
          </p>
        </div>

        <div className="space-y-4 flex-1">
          <Field className="form-field" label="Primary Registry Email">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="compliance@nehafashion.com"
              className="font-sans w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
            />
          </Field>

          <Field className="form-field" label="Password">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="font-sans w-full rounded-xl border border-slate-300 px-3.5 py-2.5 pr-9 text-sm font-semibold text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </Field>

          <Field className="form-field" label="Security Verification">
            <div className="flex gap-2.5">
              <div className="flex items-center gap-1.5">
                <div className="font-display flex h-11 w-24 shrink-0 select-none items-center justify-center rounded-xl bg-slate-800 text-base font-bold tracking-[0.2em] text-white line-through decoration-wavy decoration-slate-400">
                  {captchaValue}
                </div>
                <button
                  type="button"
                  onClick={handleRefreshCaptcha}
                  className="flex h-11 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition-colors cursor-pointer"
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
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter numbers"
                  className="font-sans h-11 w-full rounded-xl border border-slate-300 px-3.5 pr-9 text-sm font-semibold text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-4"
                />
              </div>
            </div>
          </Field>

          {errorMsg && (
            <div className="p-3 bg-red/5 border border-red/10 rounded-lg flex items-center gap-2 text-red text-xs font-bold animate-pulse">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className={`mt-6 w-full rounded-xl py-3 text-sm font-bold transition-all duration-300 font-display ${
            canSubmit
              ? 'bg-primary text-white hover:bg-primary-light shadow-lg shadow-primary/25 active:scale-[0.98] cursor-pointer'
              : 'bg-slate-200 text-slate-500 cursor-not-allowed'
          }`}
        >
          Sign In to Portal
        </button>

        <p className="text-center text-xs text-slate-500 mt-4 font-semibold">
          Don&apos;t have an account?{' '}
          <button 
            type="button" 
            onClick={onToggleRegister}
            className="text-primary hover:underline font-bold cursor-pointer"
          >
            Register Here
          </button>
        </p>
      </form>
    </div>
  );
}

interface FieldProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

function Field({ label, children, className = '' }: FieldProps) {
  return (
    <div className={className}>
      <label className="font-display mb-1.5 block text-[11px] font-bold text-slate-700">{label}</label>
      {children}
    </div>
  );
}

interface ReadOnlyRowProps {
  label: string;
  value?: string;
}

function ReadOnlyRow({ label, value }: ReadOnlyRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-emerald-100/50 pb-1.5 last:border-0 last:pb-0">
      <span className="font-sans text-[11px] font-bold text-slate-500">{label}</span>
      <span className="font-sans text-xs font-bold text-slate-800 text-right">{value || '—'}</span>
    </div>
  );
}

/* Root Onboarding Component */
interface OnboardingProps {
  onLoginSuccess: () => void;
}

export default function Onboarding({ onLoginSuccess }: OnboardingProps) {
  const [screen, setScreen] = useState<'landing' | 'signup' | 'login'>('landing');

  return (
    <div className="flex h-full w-full flex-col bg-slate-50 text-slate-800 antialiased font-sans overflow-hidden">
      
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {screen === 'landing' && (
          <LandingScreen 
            onRegister={() => setScreen('signup')} 
            onLogin={() => setScreen('login')} 
          />
        )}
        {screen === 'signup' && (
          <SignUpScreen 
            onBack={() => setScreen('landing')} 
            onComplete={onLoginSuccess} 
            onToggleLogin={() => setScreen('login')}
          />
        )}
        {screen === 'login' && (
          <LoginScreen 
            onBack={() => setScreen('landing')} 
            onComplete={onLoginSuccess} 
            onToggleRegister={() => setScreen('signup')}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
