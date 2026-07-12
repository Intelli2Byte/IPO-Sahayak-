'use client';

import { useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  Upload, 
  Edit, 
  MessageSquare, 
  CheckCircle, 
  Check, 
  Clock, 
  Calendar,
  AlertTriangle,
  FileCheck
} from 'lucide-react';
import gsap from 'gsap';
import { mockDashboardStats, mockCompanyDetails } from '@/data/mockData';
import QuickStats from './QuickStats';

interface OverviewProps {
  setCurrentTab: (tab: string) => void;
}

export default function Overview({ setCurrentTab }: OverviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Hero text split entry animations
    const titleLines = heroRef.current?.querySelectorAll('.animate-line');
    const heroCtas = heroRef.current?.querySelectorAll('.hero-cta');
    
    if (titleLines && titleLines.length > 0) {
      gsap.fromTo(titleLines,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' }
      );
    }
    if (heroCtas && heroCtas.length > 0) {
      gsap.fromTo(heroCtas,
        { opacity: 0, scale: 0.85 },
        { opacity: 1, scale: 1, duration: 0.5, delay: 0.4, stagger: 0.1, ease: 'back.out(1.4)' }
      );
    }

    // 2. Sections entrance animations
    const animatedSections = containerRef.current?.querySelectorAll('.section-entry');
    if (animatedSections && animatedSections.length > 0) {
      gsap.fromTo(animatedSections,
        { opacity: 0, y: 40, rotation: -1.5 },
        { 
          opacity: 1, 
          y: 0, 
          rotation: 0,
          stagger: 0.15, 
          duration: 0.75, 
          ease: 'power2.out',
          delay: 0.15
        }
      );
    }
  }, []);

  // Map Activity Icon
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'document_upload': return Upload;
      case 'form_update': return Edit;
      case 'comment': return MessageSquare;
      case 'approval': return CheckCircle;
      case 'task_complete': return Check;
      default: return Clock;
    }
  };

  // Map Activity Color Theme
  const getActivityColors = (color: string) => {
    switch (color) {
      case 'emerald': return 'bg-success-subtle text-success border-success-light/20';
      case 'blue': return 'bg-primary-subtle text-primary border-primary-light/20';
      case 'amber': return 'bg-warning/10 text-warning border-warning/20';
      default: return 'bg-slate-100 text-slate-500 border-slate-200';
    }
  };

  // Format Iso Date
  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date('2026-07-12T09:59:18+05:30'); // Reference local time
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  return (
    <div ref={containerRef} className="space-y-10 pb-12 select-none w-full">
      
      {/* Floating background gradient orbs */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-primary/5 rounded-full blur-3xl floating-orb pointer-events-none z-0" />
      <div className="absolute top-[400px] left-[200px] w-[550px] h-[550px] bg-success/5 rounded-full blur-3xl floating-orb pointer-events-none z-0" style={{ animationDelay: '-5s' }} />

      {/* Hero Section */}
      <div 
        ref={heroRef}
        className="hero-gradient border border-slate-200 rounded-3xl p-8 md:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden z-10 shadow-default"
      >
        <div className="space-y-5 max-w-2xl">
          <span className="text-xs text-primary bg-primary-subtle border border-primary/20 px-3.5 py-1.5 rounded-full font-bold uppercase tracking-wider">
            IPO Listing Campaign
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 leading-tight">
            <span className="animate-line block">Welcome Back, Rajesh.</span>
            <span className="animate-line block mt-1 text-slate-500 font-semibold text-xl md:text-2xl">
              Track and accelerate {mockCompanyDetails.legalName}&apos;s listing path.
            </span>
          </h2>
          <p className="text-slate-600 text-sm md:text-base animate-line font-medium leading-relaxed">
            Your application is <strong className="text-primary font-semibold">{mockDashboardStats.overview.applicationProgress}% complete</strong>. 
            All regulatory reviews are up-to-date. Ensure pending legal opinion is submitted on schedule.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => setCurrentTab('wizard')}
              className="hero-cta px-6 py-3 rounded-xl bg-primary hover:bg-primary-light text-white text-sm font-bold flex items-center gap-2 shadow-lg shadow-primary/25 cursor-pointer transition-all active:scale-95"
            >
              <span>Continue IPO Form</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentTab('vault')}
              className="hero-cta px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-sm font-bold cursor-pointer transition-all active:scale-95"
            >
              Upload Documents
            </button>
          </div>
        </div>
        
        {/* Hero Visual Widget */}
        <div className="bg-white/80 backdrop-blur-md border border-slate-200/50 p-6 rounded-2xl shadow-xl flex items-center gap-5 max-w-sm w-full shrink-0 relative hover:border-primary/20 transition-all group">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 shrink-0">
            <FileCheck className="w-8 h-8" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Listing Milestones</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">4 of 8 Steps Done</p>
            <span className="text-xs text-emerald-500 font-medium block mt-1">Next: Section 5 Approval</span>
          </div>
        </div>
      </div>

      {/* Stats Cards Panel */}
      <div className="relative z-10">
        <QuickStats />
      </div>

      {/* Analytics charts, updates and deadlines grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        
        {/* Compliance Progress Card (Replaced graph with large-text list) */}
        <div className="section-entry lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-8 shadow-default flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-850">Compliance Category Breakdown</h3>
            <p className="text-sm text-slate-500 mt-2 font-medium">Status of regulatory and compliance checkpoints</p>
          </div>
          <div className="mt-8 space-y-6 flex-1 flex flex-col justify-center">
            {mockDashboardStats.progressByCategory.map((item) => {
              let fillClass = 'bg-primary';
              let textClass = 'text-primary';
              if (item.color === 'emerald') { fillClass = 'bg-success'; textClass = 'text-success'; }
              else if (item.color === 'amber') { fillClass = 'bg-warning'; textClass = 'text-warning'; }
              else if (item.color === 'red') { fillClass = 'bg-error'; textClass = 'text-error'; }

              return (
                <div key={item.category} className="space-y-2">
                  <div className="flex justify-between items-center text-sm md:text-base font-bold text-slate-700">
                    <span>{item.category}</span>
                    <span className={textClass}>{item.progress}%</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden relative">
                    <div 
                      className={`h-full rounded-full ${fillClass} shimmer-bg`}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Deadlines Card */}
        <div className="section-entry bg-white rounded-2xl border border-slate-200 p-8 shadow-default">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Critical Actions</h3>
              <p className="text-xs text-slate-500 mt-1.5">Tasks requiring immediate attention</p>
            </div>
            <span className="text-xs bg-red/10 text-red border border-red/10 px-2.5 py-1 rounded-full font-bold uppercase">
              Overdue: 0
            </span>
          </div>

          <div className="space-y-4">
            {mockDashboardStats.upcomingDeadlines.map((deadline) => {
              const isHigh = deadline.priority === 'high';
              const isMedium = deadline.priority === 'medium';
              
              let priorityClasses = 'bg-slate-100 text-slate-500 border-slate-200';
              if (isHigh) priorityClasses = 'bg-red/5 text-red border-red/10';
              if (isMedium) priorityClasses = 'bg-warning/5 text-warning border-warning/10';

              return (
                <div
                  key={deadline.id}
                  className="p-4.5 border border-slate-150 rounded-xl hover:border-slate-350 hover:bg-slate-50/50 transition-all flex items-start justify-between gap-4 cursor-pointer"
                >
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-slate-800 leading-tight">{deadline.title}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400 font-semibold">By {deadline.assignedTo}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                      <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(deadline.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${priorityClasses}`}>
                      {deadline.priority}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {deadline.daysRemaining} days left
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activities feed card */}
        <div className="section-entry lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-8 shadow-default">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Recent Portal Activities</h3>
              <p className="text-xs text-slate-500 mt-1.5">Audit log of latest uploads and updates</p>
            </div>
            <button 
              onClick={() => setCurrentTab('vault')}
              className="text-sm text-primary font-bold hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <span>Vault History</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {mockDashboardStats.recentActivity.map((activity) => {
              const Icon = getActivityIcon(activity.type);
              const colorClasses = getActivityColors(activity.color);

              return (
                <div
                  key={activity.id}
                  className="py-5 first:pt-0 last:pb-0 flex items-start gap-4 transition-colors hover:bg-slate-50/20 px-1 rounded-lg"
                >
                  <div className={`p-3 rounded-xl border shrink-0 ${colorClasses}`}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800">{activity.title}</p>
                    <p className="text-sm text-slate-500 mt-1 truncate font-medium">{activity.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-slate-400 font-semibold">By {activity.user}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-350" />
                      <span className="text-xs text-slate-400 font-semibold">{formatTimeAgo(activity.timestamp)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Technology Development Framework Matrix */}
      <div className="section-entry bg-white rounded-2xl border border-slate-200 p-8 shadow-default space-y-6 relative z-10">
        <div>
          <h3 className="text-xl font-bold text-slate-850">Technology Development & Disclosure Matrix</h3>
          <p className="text-xs text-slate-500 mt-1.5 font-semibold">
            Institutional technology capabilities mapped to SEBI DRHP disclosure areas.
          </p>
        </div>

        <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold">
                <th className="p-4 pl-5">Disclosure Area</th>
                <th className="p-4 text-center">SME Equity IPO</th>
                <th className="p-4 text-center">Debt Issue (NCD/Bonds)</th>
                <th className="p-4 pr-5">Technology Opportunity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {[
                { area: 'Issuer Profile', equity: '✓', debt: '✓', tech: 'Auto-populate from MCA' },
                { area: 'Business Overview', equity: '✓', debt: '✓', tech: 'AI-assisted drafting' },
                { area: 'Risk Factors', equity: '✓', debt: '✓', tech: 'Risk library + AI suggestions from documents provided by Company' },
                { area: 'Financial Information', equity: '✓', debt: '✓', tech: 'Direct extraction from audited financials' },
                { area: 'Management & Governance', equity: '✓', debt: '✓', tech: 'Structured questionnaires' },
                { area: 'Litigation & Regulatory Matters', equity: '✓', debt: '✓', tech: 'Legal document ingestion (accept, read, translate, classify and extract relevant information)' },
                { area: 'Capital Structure', equity: '✓', debt: '✓', tech: 'Automated cap table & debt schedule generation' },
                { area: 'Objects / Use of Proceeds', equity: '✓', debt: '✓', tech: 'Guided workflow' },
                { area: 'Credit Rating', equity: 'Optional', debt: 'Mandatory', tech: 'Rating agency integration' },
                { area: 'Security / Charge Details', equity: '✓', debt: 'Mandatory (secured debt)', tech: 'Automated validation from MCA & Debenture Trustee database' },
                { area: 'Material Contracts', equity: '✓', debt: '✓', tech: 'Contract intelligence' },
                { area: 'Statutory Approvals', equity: '✓', debt: '✓', tech: 'Compliance checklist engine according to the industry in which it is operating' }
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/20">
                  <td className="p-4 pl-5 font-bold text-slate-800">{row.area}</td>
                  <td className="p-4 text-center">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                      row.equity === '✓' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {row.equity}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                      row.debt === '✓' ? 'bg-emerald-50 text-emerald-600' : 
                      row.debt.startsWith('Mandatory') ? 'bg-primary-subtle text-primary font-bold' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {row.debt}
                    </span>
                  </td>
                  <td className="p-4 pr-5 text-slate-600 font-bold">{row.tech}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
