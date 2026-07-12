'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, ChevronDown, Calendar, Search, LogOut, Settings, User } from 'lucide-react';
import gsap from 'gsap';
import { mockUserProfile, mockDashboardStats } from '@/data/mockData';

interface HeaderProps {
  currentTab: string;
  isSidebarOpen: boolean;
  onMenuToggle: () => void;
  onLogout: () => void;
  onMyProfileClick: () => void;
  onSettingsClick: () => void;
}

export default function Header({ 
  currentTab, 
  isSidebarOpen, 
  onMenuToggle,
  onLogout,
  onMyProfileClick,
  onSettingsClick
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const bellRef = useRef<HTMLButtonElement>(null);
  const notifyDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Outside click listener to dismiss dropdowns
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

  // Tab Title mapper
  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'overview': return 'IPO Dashboard';
      case 'wizard': return 'IPO Application Wizard';
      case 'vault': return 'Document Vault';
      case 'compliance': return 'Compliance Checklist';
      case 'team': return 'Team & Access Management';
      default: return 'Dashboard';
    }
  };

  // Bell hover micro-interaction (Bounce)
  const animateBell = () => {
    const bell = bellRef.current?.querySelector('.bell-icon');
    if (bell) {
      gsap.fromTo(bell, 
        { scale: 1 }, 
        { 
          scale: 1.25, 
          duration: 0.4, 
          ease: 'elastic.out(1, 0.4)', 
          yoyo: true, 
          repeat: 1 
        }
      );
    }
  };

  // Dropdown entrance animation (Fade + scale + slide)
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

  return (
    <header className="h-20 border-b border-slate-200 bg-white sticky top-0 z-20 flex items-center justify-between px-6 md:px-8 select-none">
      {/* Page Title & Search */}
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle */}
        <button
          onClick={onMenuToggle}
          className="p-2 -ml-2 text-slate-500 hover:text-slate-800 md:hidden rounded-lg cursor-pointer hover:bg-slate-100 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
        <div>
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight">{getTabTitle(currentTab)}</h2>
          <p className="text-xs text-slate-500 hidden sm:block">Neha Fashion Private Limited • BSE SME Platform</p>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-6">


        {/* Notifications Bell */}
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

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div
              ref={notifyDropdownRef}
              className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <span className="font-semibold text-slate-800 text-sm">Notifications</span>
                <span className="text-xs text-primary font-medium hover:underline cursor-pointer">Mark all as read</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                <div className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer">
                  <p className="text-xs font-semibold text-slate-800">SEBI Reviewer commented</p>
                  <p className="text-xs text-slate-500 mt-1">Clarification needed on deferred tax liability.</p>
                  <span className="text-[10px] text-slate-400 mt-2 block">10 minutes ago</span>
                </div>
                <div className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer">
                  <p className="text-xs font-semibold text-emerald-800">Promoter KYC Approved</p>
                  <p className="text-xs text-slate-500 mt-1">All promoter KYC documents verified successfully.</p>
                  <span className="text-[10px] text-slate-400 mt-2 block">1 day ago</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
