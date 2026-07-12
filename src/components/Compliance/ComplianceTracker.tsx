'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  TrendingUp, 
  Scale, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Filter,
  RefreshCw,
  Search
} from 'lucide-react';
import gsap from 'gsap';
import { mockComplianceTracker, ComplianceCategory, ComplianceItem } from '@/data/mockData';

export default function ComplianceTracker() {
  const [tracker, setTracker] = useState(mockComplianceTracker);
  const [activeCategoryId, setActiveCategoryId] = useState('comp_sebi');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [overallScore, setOverallScore] = useState(mockComplianceTracker.overallScore);
  const checklistRef = useRef<HTMLDivElement>(null);

  // Recalculate scores when any checklist item status updates
  useEffect(() => {
    let totalItems = 0;
    let completedItems = 0;

    const updatedCategories = tracker.categories.map((cat) => {
      const catItems = cat.items;
      const catCompleted = catItems.filter(item => item.status === 'completed').length;
      const catProgress = Math.round((catCompleted / catItems.length) * 100);

      totalItems += catItems.length;
      completedItems += catCompleted;

      return {
        ...cat,
        completedItems: catCompleted,
        progress: catProgress
      };
    });

    const newOverallScore = Math.round((completedItems / totalItems) * 100);
    setOverallScore(newOverallScore);

    // Animate overall score radial circle or counter rollup
    const scoreVal = document.querySelector('.score-radial-val');
    if (scoreVal) {
      const countObj = { value: parseFloat(scoreVal.textContent || '0') };
      gsap.to(countObj, {
        value: newOverallScore,
        duration: 1,
        ease: 'power2.out',
        onUpdate: () => {
          if (scoreVal) scoreVal.textContent = Math.round(countObj.value).toString();
        }
      });
    }

    setTracker(prev => ({
      ...prev,
      categories: updatedCategories,
      overallScore: newOverallScore
    }));
  }, [tracker.categories]);

  // Tab switch transition animation
  const handleTabChange = (catId: string) => {
    const list = checklistRef.current;
    if (list) {
      gsap.fromTo(list,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
      );
    }
    setActiveCategoryId(catId);
  };

  // Toggle item status cycle (Not Started -> In Progress -> Completed)
  const toggleItemStatus = (itemId: string) => {
    // Stagger a slight scale-up bounce on row
    const rowEl = document.getElementById(`row-${itemId}`);
    if (rowEl) {
      gsap.fromTo(rowEl,
        { scale: 0.99, backgroundColor: 'rgba(37, 99, 235, 0.05)' },
        { scale: 1, backgroundColor: 'transparent', duration: 0.35, ease: 'power2.out' }
      );
    }

    setTracker(prev => {
      const updatedCategories = prev.categories.map(cat => {
        const itemIdx = cat.items.findIndex(item => item.id === itemId);
        if (itemIdx !== -1) {
          const updatedItems = [...cat.items];
          const currentStatus = updatedItems[itemIdx].status;
          
          let nextStatus: 'not_started' | 'in_progress' | 'completed' = 'not_started';
          let completedDate = null;
          
          if (currentStatus === 'not_started') {
            nextStatus = 'in_progress';
          } else if (currentStatus === 'in_progress') {
            nextStatus = 'completed';
            completedDate = new Date().toISOString();
          } else {
            nextStatus = 'not_started';
          }

          updatedItems[itemIdx] = {
            ...updatedItems[itemIdx],
            status: nextStatus,
            completedDate
          };

          return {
            ...cat,
            items: updatedItems
          };
        }
        return cat;
      });

      return {
        ...prev,
        categories: updatedCategories
      };
    });
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Shield': return Shield;
      case 'TrendingUp': return TrendingUp;
      case 'Scale': return Scale;
      case 'DollarSign': return DollarSign;
      default: return Shield;
    }
  };

  // Get active category details
  const activeCategory = tracker.categories.find(c => c.id === activeCategoryId) || tracker.categories[0];

  // Filter items based on search query and priority dropdown select
  const filteredItems = activeCategory.items.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || item.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const getStatusButton = (status: string, itemId: string) => {
    switch (status) {
      case 'completed':
        return (
          <button 
            onClick={() => toggleItemStatus(itemId)}
            className="px-3 py-1.5 rounded-xl bg-success-subtle text-success border border-success-light/20 flex items-center gap-1.5 text-xs font-bold cursor-pointer hover:bg-success-subtle/35 transition-colors"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Completed</span>
          </button>
        );
      case 'in_progress':
        return (
          <button 
            onClick={() => toggleItemStatus(itemId)}
            className="px-3 py-1.5 rounded-xl bg-primary-subtle text-primary border border-primary/20 flex items-center gap-1.5 text-xs font-bold cursor-pointer hover:bg-primary-subtle/30 transition-colors"
          >
            <Clock className="w-3.5 h-3.5 animate-spin-slow" />
            <span>In Progress</span>
          </button>
        );
      default:
        return (
          <button 
            onClick={() => toggleItemStatus(itemId)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-400 border border-slate-200 flex items-center gap-1.5 text-xs font-bold cursor-pointer hover:bg-slate-200/50 hover:text-slate-600 transition-colors"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Not Started</span>
          </button>
        );
    }
  };

  return (
    <div className="space-y-8 pb-12 select-none">
      
      {/* Gauge and Stats Split Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Radial gauge card */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-default flex items-center gap-6 justify-around">
          <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
            {/* SVG radial ring background */}
            <svg className="w-full h-full transform -rotate-90">
              <circle 
                cx="64" 
                cy="64" 
                r="50" 
                stroke="#f1f5f9" 
                strokeWidth="10" 
                fill="transparent" 
              />
              <circle 
                cx="64" 
                cy="64" 
                r="50" 
                stroke="#6366f1" 
                strokeWidth="10" 
                fill="transparent"
                strokeDasharray="314.15"
                strokeDashoffset={314.15 - (314.15 * overallScore) / 100}
                className="transition-all duration-700 ease-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-black text-slate-800 score-radial-val">{overallScore}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Audit Score</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
              DRHP Audit Rating
            </span>
            <h3 className="text-base font-bold text-slate-800 mt-1">Excellent Standing</h3>
            <p className="text-xs text-slate-400 max-w-[180px] leading-relaxed">
              Your company meets 82% of SEBI Annexure and Listing compliance checks automatically.
            </p>
          </div>
        </div>

        {/* Categories cards list */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {tracker.categories.map((cat) => {
            const CatIcon = getCategoryIcon(cat.icon);
            const isActive = cat.id === activeCategoryId;
            
            return (
              <button
                key={cat.id}
                onClick={() => handleTabChange(cat.id)}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  isActive 
                    ? 'border-primary bg-primary-subtle/10 text-primary shadow-sm' 
                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                }`}
              >
                <div className={`p-2.5 rounded-xl w-fit ${isActive ? 'bg-primary/10 text-primary' : 'bg-slate-50 text-slate-400'}`}>
                  <CatIcon className="w-4 h-4" />
                </div>
                <div className="mt-4">
                  <h4 className="text-xs font-bold text-slate-800 truncate">{cat.name}</h4>
                  <div className="flex items-center justify-between gap-2 mt-1.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Progress</span>
                    <span className="text-xs font-bold text-slate-700">{cat.progress}%</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

      </div>

      {/* Main checklist table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-default">
        {/* Table Filters Header */}
        <div className="p-4 border-b border-slate-150 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search compliance guidelines..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 w-full text-xs border border-slate-200 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary/10 outline-none text-slate-800 bg-white font-medium placeholder-slate-400"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs text-slate-500 font-semibold">
              <Filter className="w-3.5 h-3.5" />
              <span>Priority:</span>
            </div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="text-xs border border-slate-200 rounded-xl px-3 py-2 outline-none font-medium text-slate-700 bg-white"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Checklist List Table */}
        <div ref={checklistRef} className="overflow-x-auto">
          <table className="w-full text-left text-xs table-fixed">
            <thead>
              <tr className="text-slate-400 font-bold border-b border-slate-100 bg-slate-50/20">
                <th className="py-3 pl-6 w-[45%]">Compliance Regulation Guideline</th>
                <th className="py-3 w-[15%]">Owner</th>
                <th className="py-3 w-[12%] text-center">Priority</th>
                <th className="py-3 w-[15%] text-center">Status Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => {
                  const isHigh = item.priority === 'high';
                  const isMedium = item.priority === 'medium';
                  
                  let priorityStyles = 'bg-slate-100 text-slate-500 border-slate-200';
                  if (isHigh) priorityStyles = 'bg-red/5 text-red border-red/10';
                  if (isMedium) priorityStyles = 'bg-warning/5 text-warning border-warning/10';

                  return (
                    <tr 
                      id={`row-${item.id}`}
                      key={item.id} 
                      className="text-slate-700 hover:bg-slate-50/20 transition-all duration-300"
                    >
                      <td className="py-4.5 pl-6">
                        <p className="font-bold text-slate-800 leading-tight">{item.title}</p>
                        <p className="text-[11px] text-slate-400 mt-1 leading-normal font-medium max-w-[90%]">
                          {item.description}
                        </p>
                        {item.notes && (
                          <div className="mt-2 text-[10px] text-primary bg-primary-subtle/25 px-2.5 py-1 rounded-lg border border-primary/5 w-fit font-semibold">
                            Note: {item.notes}
                          </div>
                        )}
                      </td>
                      <td className="py-4.5 font-semibold text-slate-600">
                        {item.assignedTo}
                      </td>
                      <td className="py-4.5 text-center">
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${priorityStyles}`}>
                          {item.priority}
                        </span>
                      </td>
                      <td className="py-4.5">
                        <div className="flex justify-center">
                          {getStatusButton(item.status, item.id)}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400 font-semibold">
                    No compliance guidelines match search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
