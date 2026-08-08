'use client';

import { useEffect, useRef, useState } from 'react';
import { 
  LayoutDashboard, 
  FileEdit, 
  FolderLock, 
  ShieldCheck, 
  Users, 
  ChevronLeft, 
  ChevronRight,
  User,
  Settings,
  LogOut
} from 'lucide-react';
import gsap from 'gsap';
import { mockIpoApplication, mockDocumentVault, mockComplianceTracker } from '@/data/mockData';
import { useLanguage } from '@/context/LanguageContext'; // <-- Imported Language Context

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onLogout: () => void;
  onMyProfileClick: () => void;
  onSettingsClick: () => void;
}

export default function Sidebar({ 
  currentTab, 
  setCurrentTab, 
  isOpen, 
  setIsOpen,
  onLogout,
  onMyProfileClick,
  onSettingsClick
}: SidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  const [showFooterMenu, setShowFooterMenu] = useState(false);

  // Consume language context
  const { t, preRegister } = useLanguage();

  // Footer dropdown is closed by default — pre-register its text so it's
  // already translated the first time the user toggles to Hindi.
  useEffect(() => {
    preRegister(['My Profile', 'Portal Settings', 'Logout']);
  }, [preRegister]);

  // Real counts pulled from existing data
  const wizardPending = mockIpoApplication.stepProgress.filter(s => s.status !== 'completed').length;
  const vaultPending = mockDocumentVault.summary.totalRequired - mockDocumentVault.summary.totalUploaded;
  const complianceAlerts = mockComplianceTracker.categories.reduce((count, cat) => {
    return count + cat.items.filter(item => item.priority === 'high' && item.status !== 'completed').length;
  }, 0);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, badge: null as number | null },
    { id: 'wizard', label: 'IPO Wizard', icon: FileEdit, badge: wizardPending > 0 ? wizardPending : null },
    { id: 'vault', label: 'Document Vault', icon: FolderLock, badge: vaultPending > 0 ? vaultPending : null },
    { id: 'compliance', label: 'Compliance Tracker', icon: ShieldCheck, badge: complianceAlerts > 0 ? complianceAlerts : null },
    { id: 'team', label: 'Team & Access', icon: Users, badge: null as number | null },
  ];

  useEffect(() => {
    const items = menuContainerRef.current?.querySelectorAll('.menu-item-anim');
    if (items && items.length > 0) {
      gsap.fromTo(items, 
        { opacity: 0, x: -20 },
        { 
          opacity: 1, 
          x: 0, 
          stagger: 0.08, 
          duration: 0.5, 
          delay: 0.2, 
          ease: 'power3.out' 
        }
      );
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (footerRef.current && !footerRef.current.contains(event.target as Node)) {
        setShowFooterMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    if (isOpen) {
      gsap.to(sidebar, {
        width: 256,
        duration: 0.4,
        ease: 'power3.out',
      });
      gsap.to('.logo-text', { opacity: 1, display: 'block', duration: 0.2, delay: 0.1 });
    } else {
      gsap.to(sidebar, {
        width: 80,
        duration: 0.35,
        ease: 'power2.inOut',
      });
      gsap.to('.logo-text', { opacity: 0, display: 'none', duration: 0.15 });
    }
  }, [isOpen]);

  const handleLinkClick = (id: string) => {
    setCurrentTab(id);
  };

  return (
    <aside
      ref={sidebarRef}
      className="fixed top-20 left-0 h-[calc(100vh-80px)] bg-slate-950 border-r border-slate-900 text-slate-400 z-30 flex flex-col w-64 select-none shrink-0"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-3.5 top-6 w-7 h-7 rounded-full bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white flex items-center justify-center shadow-md shadow-slate-950/50 z-50 cursor-pointer transition-all hover:scale-105"
        title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
      >
        {isOpen ? (
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
        ) : (
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
        )}
      </button>

      <nav ref={menuContainerRef} className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleLinkClick(item.id)}
              className={`menu-item-anim w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 relative group cursor-pointer ${
                isActive 
                  ? 'text-white bg-white/10 font-bold' 
                  : 'hover:text-white hover:bg-slate-900/60'
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-3.5 bottom-3.5 w-1 bg-emerald-400 rounded-r-md" />
              )}

              <Icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${
                isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'
              }`} />

              <span className={`flex-1 flex items-center justify-between transition-opacity duration-200 overflow-hidden ${
                isOpen ? 'opacity-100' : 'opacity-0 md:w-0'
              }`}>
                {/* TRUNCATE LABEL SO THE BADGE DOESN'T GET SQUISHED */}
                <span className="truncate pr-2">{t(item.label)}</span>
                
                {item.badge !== null && (
                  <span
                    className={`ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0 whitespace-nowrap ${
                      item.id === 'compliance'
                        ? 'bg-red/15 text-red'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.badge} {item.id === 'compliance' ? t('alert' + (item.badge > 1 ? 's' : '')) : t('pending')}
                  </span>
                )}
              </span>

              {!isOpen && (
                <div className="absolute left-20 bg-slate-950 text-white text-xs px-3 py-2 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:left-24 transition-all duration-300 shadow-xl border border-slate-800 z-50 whitespace-nowrap hidden md:flex items-center gap-2">
                  <span>{t(item.label)}</span>
                  {item.badge !== null && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      item.id === 'compliance' ? 'bg-red/15 text-red' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      <div className="relative" ref={footerRef}>
        {showFooterMenu && (
          <div className="absolute bottom-16 left-4 right-4 bg-slate-900 border border-slate-800 rounded-2xl py-1.5 shadow-2xl z-50 animate-fade-in space-y-0.5">
            <button 
              onClick={() => { setShowFooterMenu(false); onMyProfileClick(); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800/80 text-xs font-bold text-left cursor-pointer transition-colors"
            >
              <User className="w-4 h-4 text-slate-500" />
              <span>{t('My Profile')}</span>
            </button>
            <button 
              onClick={() => { setShowFooterMenu(false); onSettingsClick(); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800/80 text-xs font-bold text-left cursor-pointer transition-colors"
            >
              <Settings className="w-4 h-4 text-slate-500" />
              <span>{t('Portal Settings')}</span>
            </button>
            <div className="h-px bg-slate-800/85 my-1" />
            <button 
              onClick={() => { setShowFooterMenu(false); onLogout(); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-red hover:bg-red/5 text-xs font-bold text-left cursor-pointer transition-colors"
            >
              <LogOut className="w-4 h-4 text-red" />
              <span>{t('Logout')}</span>
            </button>
          </div>
        )}

        <div 
          onClick={() => setShowFooterMenu(!showFooterMenu)}
          className="p-4 border-t border-slate-900 flex items-center gap-3 cursor-pointer hover:bg-slate-900/40 transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-slate-900 overflow-hidden shrink-0 border border-slate-800">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Rajesh Kumar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className={`logo-text overflow-hidden transition-all duration-200 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
            <p className="text-xs font-semibold text-white leading-none whitespace-nowrap">Rajesh Kumar</p>
            <span className="text-[10px] text-slate-500 whitespace-nowrap">{t('Promoter / CEO')}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}