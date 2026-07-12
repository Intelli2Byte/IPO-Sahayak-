'use client';

import { useState, useRef } from 'react';
import gsap from 'gsap';
import { User, Settings, ShieldAlert, Key, X, Lock, CheckCircle2 } from 'lucide-react';
import Sidebar from '@/components/Layout/Sidebar';
import Header from '@/components/Layout/Header';
import Overview from '@/components/Dashboard/Overview';
import StepWizard from '@/components/Wizard/StepWizard';
import VaultManager from '@/components/DocumentVault/VaultManager';
import ComplianceTracker from '@/components/Compliance/ComplianceTracker';
import TeamAccess from '@/components/Dashboard/TeamAccess';
import Onboarding from '@/components/Onboarding/Onboarding';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentTab, setCurrentTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Profile and Settings Modals States
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Settings Configuration states
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30');

  // Animate tab transitions (fade + scale + blur)
  const handleTabChange = (newTab: string) => {
    if (newTab === currentTab) return;
    const content = contentRef.current;
    if (!content) {
      setCurrentTab(newTab);
      return;
    }

    const tl = gsap.timeline();
    // Exit transition
    tl.to(content, {
      opacity: 0,
      scale: 0.95,
      filter: 'blur(4px)',
      duration: 0.25,
      ease: 'power2.inOut',
      onComplete: () => {
        setCurrentTab(newTab);
        setMobileMenuOpen(false);
      }
    });

    // Enter transition
    tl.to(content, {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      duration: 0.35,
      ease: 'power2.inOut',
      delay: 0.05
    });
  };

  const renderActiveTabContent = () => {
    switch (currentTab) {
      case 'overview':
        return <Overview setCurrentTab={handleTabChange} />;
      case 'wizard':
        return <StepWizard />;
      case 'vault':
        return <VaultManager />;
      case 'compliance':
        return <ComplianceTracker />;
      case 'team':
        return <TeamAccess />;
      default:
        return <Overview setCurrentTab={handleTabChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col select-none">
      
      {/* Global master brand header (fixed top for all pages) */}
      <header className="h-20 border-b border-slate-200 bg-white sticky top-0 z-40 flex items-center shrink-0">
        <div className="w-full mx-auto flex items-center justify-between px-6 md:px-8">
          {/* Left brand logo */}
          <div className="flex items-center gap-5 sm:gap-6">
            <img
              src="/logos/IPO-sahayak_logo-new.png"
              alt="IPO-Sahayak"
              className="h-18 w-18 shrink-0 object-contain"
            />
            <div className="h-12 w-px bg-slate-200" />
            <img
              src="/logos/sebi-logo.png"
              alt="SEBI — Securities and Exchange Board of India"
              className="h-14 w-auto object-contain"
            />
          </div>

          {/* Right Brand Logos */}
          <div className="flex items-center gap-5 sm:gap-6">
            <img src="/logos/mca.png" alt="MCA" className="h-12 w-auto object-contain" />
            <div className="hidden h-12 w-px bg-slate-200 sm:block" />
            <img src="/logos/gstn.png" alt="GSTN" className="h-10 w-auto object-contain" />
          </div>
        </div>
      </header>

      {/* Underneath content area */}
      <div className="flex-1 flex min-h-0 relative">
        {!isLoggedIn ? (
          <div className="flex-1 flex flex-col overflow-y-auto">
            <Onboarding onLoginSuccess={() => setIsLoggedIn(true)} />
          </div>
        ) : (
          <>
            {/* Sidebar - Desktop collapsible */}
            <div className="hidden md:block">
              <Sidebar
                currentTab={currentTab}
                setCurrentTab={handleTabChange}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
                onLogout={() => setIsLoggedIn(false)}
                onMyProfileClick={() => setIsProfileOpen(true)}
                onSettingsClick={() => setIsSettingsOpen(true)}
              />
            </div>

            {/* Sidebar Drawer - Mobile sliding */}
            {mobileMenuOpen && (
              <div className="fixed inset-0 z-40 md:hidden">
                {/* Backdrop overlay */}
                <div 
                  onClick={() => setMobileMenuOpen(false)}
                  className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                />
                <div className="relative w-64 h-full bg-slate-950 shadow-2xl">
                  <Sidebar
                    currentTab={currentTab}
                    setCurrentTab={handleTabChange}
                    isOpen={true}
                    setIsOpen={() => {}}
                    onLogout={() => setIsLoggedIn(false)}
                    onMyProfileClick={() => setIsProfileOpen(true)}
                    onSettingsClick={() => setIsSettingsOpen(true)}
                  />
                </div>
              </div>
            )}

            {/* Main Panel Content Area */}
            <div 
              className="flex-1 flex flex-col min-w-0 transition-all duration-350"
              style={{ paddingLeft: isSidebarOpen ? '256px' : '80px', transition: 'padding-left 0.35s ease' }}
            >
              {/* Header toolbar with dropdown handlers */}
              <Header
                currentTab={currentTab}
                isSidebarOpen={isSidebarOpen}
                onMenuToggle={() => setMobileMenuOpen(true)}
                onLogout={() => setIsLoggedIn(false)}
                onMyProfileClick={() => setIsProfileOpen(true)}
                onSettingsClick={() => setIsSettingsOpen(true)}
              />

              {/* Content Wrapper */}
              <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full relative">
                <div ref={contentRef} className="opacity-100 scale-100 filter-none">
                  {renderActiveTabContent()}
                </div>
              </main>
            </div>
          </>
        )}
      </div>

      {/* ----------------- MY PROFILE POPUP DIALOG ----------------- */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-100 rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-fade-in space-y-6">
            <button 
              onClick={() => setIsProfileOpen(false)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-650 cursor-pointer p-1 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden border border-slate-200 shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                  alt="Rajesh Kumar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">Rajesh Kumar</h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Managing Director & CEO</p>
              </div>
            </div>

            <div className="border-t border-slate-50 pt-4 space-y-3.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-450 font-bold uppercase tracking-wider">DIN Number</span>
                <span className="text-slate-800 font-bold">08492311</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-450 font-bold uppercase tracking-wider">PAN Identity</span>
                <span className="text-slate-800 font-bold uppercase">ABJPK4921F</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-450 font-bold uppercase tracking-wider">Registry Email</span>
                <span className="text-slate-800 font-bold">rajesh.kumar@nehafashion.com</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-450 font-bold uppercase tracking-wider">Authority Status</span>
                <span className="text-success bg-emerald-50 px-2 py-0.5 border border-emerald-100/50 rounded-md font-bold text-[10px] uppercase">
                  Primary Promoter
                </span>
              </div>
            </div>

            <button 
              onClick={() => setIsProfileOpen(false)}
              className="w-full py-2.5 bg-primary hover:bg-primary-light text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm text-center"
            >
              Close Profile Info
            </button>
          </div>
        </div>
      )}

      {/* ----------------- PORTAL SETTINGS POPUP DIALOG ----------------- */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-100 rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-fade-in space-y-6">
            <button 
              onClick={() => setIsSettingsOpen(false)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-650 cursor-pointer p-1 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center shrink-0 border border-slate-200">
                <Settings className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-800">Portal Security Settings</h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Control auth requirements and local vault security.</p>
              </div>
            </div>

            <div className="border-t border-slate-50 pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-700 block">Dual-Factor Authentication (MFA)</span>
                  <span className="text-[10px] text-slate-400 font-semibold block">Requires OTP for signoff validations</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={mfaEnabled} 
                    onChange={(e) => setMfaEnabled(e.target.checked)} 
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700">Auto-Logout Session Idle Limit</span>
                  <span className="text-[10px] text-slate-400 font-bold bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-lg">
                    {sessionTimeout} minutes
                  </span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="60" 
                  step="10" 
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="w-full accent-primary h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="p-3.5 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-2.5 text-xs text-primary font-semibold">
                <Lock className="w-4 h-4 shrink-0 mt-0.5" />
                <span>All modifications require e-sign DSC confirmation upon saving.</span>
              </div>
            </div>

            <button 
              onClick={() => setIsSettingsOpen(false)}
              className="w-full py-2.5 bg-primary hover:bg-primary-light text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm text-center"
            >
              Save Configuration
            </button>
          </div>
        </div>
      )}

      {/* Custom responsive mobile fixes */}
      <style jsx global>{`
        @media (max-w: 768px) {
          div[style*="padding-left"] {
            padding-left: 0px !important;
          }
        }
      `}</style>
    </div>
  );
}
