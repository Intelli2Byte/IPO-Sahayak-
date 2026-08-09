'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, ChevronDown, Calendar, Search, LogOut, Settings, User, Languages, Loader2, Info, X } from 'lucide-react';
import gsap from 'gsap';
import { useLanguage } from '@/context/LanguageContext';
import { mockUserProfile, mockDashboardStats } from '@/data/mockData';

interface HeaderProps {
  currentTab: string;
  isSidebarOpen: boolean;
  onMenuToggle: () => void;
  onLogout: () => void;
  onMyProfileClick: () => void;
  onSettingsClick: () => void;
  companyName?: string; // <-- ADDED PROP
}

export default function Header({ 
  currentTab, 
  isSidebarOpen, 
  onMenuToggle,
  onLogout,
  onMyProfileClick,
  onSettingsClick,
  companyName = "Loading Company Data..." // <-- DEFAULT FALLBACK
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const bellRef = useRef<HTMLButtonElement>(null);
  const notifyDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  const { language, toggleLanguage, isTranslating, t, preRegister, showBanner, bannerMessage, dismissBanner } = useLanguage();

  useEffect(() => {
    preRegister([
      'Notifications',
      'Mark all as read',
      'SEBI Reviewer commented',
      'Clarification needed on deferred tax liability.',
      '10 minutes ago',
      'Promoter KYC Approved',
      'All promoter KYC documents verified successfully.',
      '1 day ago',
      'IPO Dashboard',
      'IPO Application Wizard',
      'Document Vault',
      'Compliance Checklist',
      'Team & Access Management',
      'Generated Documents',
      'Dashboard',
    ]);
  }, [preRegister]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(target)) {
        setShowProfileMenu(false);
      }
      if (notifyDropdownRef.current && !notifyDropdownRef.current.contains(target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'overview': return 'IPO Dashboard';
      case 'wizard': return 'IPO Application Wizard';
      case 'vault': return 'Document Vault';
      case 'compliance': return 'Compliance Checklist';
      case 'generated': return 'Generated Documents';
      case 'team': return 'Team & Access Management';
      default: return 'Dashboard';
    }
  };

  const animateBell = () => {
    const bell = bellRef.current?.querySelector('.bell-icon');
    if (bell) {
      gsap.fromTo(bell, 
        { scale: 1 }, 
        { scale: 1.25, duration: 0.4, ease: 'elastic.out(1, 0.4)', yoyo: true, repeat: 1 }
      );
    }
  };

  useEffect(() => {
    if (showNotifications && notifyDropdownRef.current) {
      gsap.fromTo(notifyDropdownRef.current,
        { opacity: 0, scale: 0.95, y: -10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.25, ease: 'power2.out' }
      );
    }
  }, [showNotifications]);

  useEffect(() => {
    if (showProfileMenu && profileDropdownRef.current) {
      gsap.fromTo(profileDropdownRef.current,
        { opacity: 0, scale: 0.95, y: -10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.25, ease: 'power2.out' }
      );
    }
  }, [showProfileMenu]);

  useEffect(() => {
    if (showBanner && bannerRef.current) {
      gsap.fromTo(bannerRef.current,
        { opacity: 0, height: 0 },
        { opacity: 1, height: 'auto', duration: 0.3, ease: 'power2.out' }
      );
    }
  }, [showBanner]);

  return (
    <>
      <header className="h-20 border-b border-slate-200 bg-white sticky top-0 z-20 flex items-center justify-between px-6 md:px-8 select-none">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="p-2 -ml-2 text-slate-500 hover:text-slate-800 md:hidden rounded-lg cursor-pointer hover:bg-slate-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          <div>
            <h2 className="text-xl font-semibold text-slate-900 tracking-tight">{t(getTabTitle(currentTab))}</h2>
            {/* DYNAMIC COMPANY NAME USED HERE */}
            <p className="text-xs text-slate-500 hidden sm:block">{companyName} • BSE SME Platform</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={toggleLanguage}
            disabled={isTranslating}
            className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-xs font-black text-emerald-800 transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-70 disabled:cursor-wait"
            title="Toggle Language (English / Hindi)"
          >
            <Languages className="w-3.5 h-3.5 text-emerald-600" />
            <div className="flex items-center gap-1">
              <span className={language === 'en' ? 'text-emerald-900 font-extrabold underline' : 'text-slate-400'}>ENG</span>
              <span className="text-slate-300">|</span>
              <span className={language === 'hi' ? 'text-emerald-900 font-extrabold underline' : 'text-slate-400'}>HIN</span>
            </div>
            {isTranslating && <Loader2 className="w-3 h-3 animate-spin text-emerald-600" />}
          </button>

          <div className="relative mr-4">
            <button
              ref={bellRef}
              onClick={() => setShowNotifications(!showNotifications)}
              onMouseEnter={animateBell}
              className="p-2.5 text-slate-500 hover:text-primary hover:bg-slate-50 rounded-xl transition-all relative cursor-pointer"
            >
              <Bell className="w-5.5 h-5.5 bell-icon" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red border-2 border-white rounded-full animate-pulse" />
            </button>

            {showNotifications && (
              <div
                ref={notifyDropdownRef}
                className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden"
              >
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-semibold text-slate-800 text-sm">{t('Notifications')}</span>
                  <span className="text-xs text-primary font-medium hover:underline cursor-pointer">{t('Mark all as read')}</span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  <div className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer">
                    <p className="text-xs font-semibold text-slate-800">{t('SEBI Reviewer commented')}</p>
                    <p className="text-xs text-slate-500 mt-1">{t('Clarification needed on deferred tax liability.')}</p>
                    <span className="text-[10px] text-slate-400 mt-2 block">{t('10 minutes ago')}</span>
                  </div>
                  <div className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer">
                    <p className="text-xs font-semibold text-emerald-800">{t('Promoter KYC Approved')}</p>
                    <p className="text-xs text-slate-500 mt-1">{t('All promoter KYC documents verified successfully.')}</p>
                    <span className="text-[10px] text-slate-400 mt-2 block">{t('1 day ago')}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {showBanner && (
        <div
          ref={bannerRef}
          className="sticky top-20 z-10 bg-emerald-50 border-b border-emerald-200 px-6 md:px-8 py-2.5 flex items-center justify-between gap-4 overflow-hidden"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Info className="w-4 h-4 text-emerald-700 shrink-0" />
            <p className="text-xs font-semibold text-emerald-900 leading-snug">{bannerMessage}</p>
          </div>
          <button
            onClick={dismissBanner}
            className="p-1 rounded-lg text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100 transition-colors cursor-pointer shrink-0"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </>
  );
}