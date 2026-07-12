'use client';

import { useState, useEffect, useRef } from 'react';
import { Users, Shield, Plus, Mail, CheckCircle2, UserCheck, Key, Edit2, Trash2, Check, X } from 'lucide-react';
import gsap from 'gsap';
import { mockIpoApplication, TeamMember } from '@/data/mockData';

export default function TeamAccess() {
  const [team, setTeam] = useState<TeamMember[]>(mockIpoApplication.team);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Editor');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState('Editor');

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = containerRef.current?.querySelectorAll('.team-card-anim');
    if (cards && cards.length > 0) {
      gsap.fromTo(cards,
        { opacity: 0, scale: 0.95, y: 15 },
        { opacity: 1, scale: 1, y: 0, stagger: 0.08, duration: 0.5, ease: 'power3.out' }
      );
    }
  }, []);

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    // Simulate inviting a member
    const rolePermissions: Record<string, string[]> = {
      'Editor': ['view', 'edit'],
      'CFO': ['view', 'edit', 'submit'],
      'Auditor': ['view'],
      'Company Secretary': ['view', 'edit']
    };

    const newMember: TeamMember = {
      userId: `usr_${Date.now()}`,
      name: inviteEmail.split('@')[0].replace('.', ' ').replace(/\b\w/g, c => c.toUpperCase()),
      role: inviteRole,
      permissions: rolePermissions[inviteRole] || ['view']
    };

    setTeam(prev => [...prev, newMember]);
    setInviteEmail('');
    setSuccessMsg(`Invitation sent successfully to ${inviteEmail}!`);

    // Stagger slide entry for new item
    setTimeout(() => {
      const cards = containerRef.current?.querySelectorAll('.team-card-anim');
      if (cards && cards.length > 0) {
        const lastCard = cards[cards.length - 1];
        gsap.fromTo(lastCard,
          { opacity: 0, scale: 0.9, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.5)' }
        );
      }
    }, 50);

    setTimeout(() => {
      setSuccessMsg(null);
    }, 3000);
  };

  const handleRemoveMember = (userId: string) => {
    const card = containerRef.current?.querySelector(`[data-user-id="${userId}"]`);
    if (card) {
      gsap.to(card, {
        opacity: 0,
        scale: 0.9,
        y: -15,
        duration: 0.35,
        ease: 'power2.in',
        onComplete: () => {
          setTeam(prev => prev.filter(m => m.userId !== userId));
        }
      });
    } else {
      setTeam(prev => prev.filter(m => m.userId !== userId));
    }
  };

  const startEditing = (member: TeamMember) => {
    setEditingUserId(member.userId);
    setEditRole(member.role);
  };

  const saveEditing = (userId: string) => {
    const rolePermissions: Record<string, string[]> = {
      'Editor': ['view', 'edit'],
      'CFO': ['view', 'edit', 'submit'],
      'Auditor': ['view'],
      'Company Secretary': ['view', 'edit']
    };

    setTeam(prev => prev.map(m => {
      if (m.userId === userId) {
        return {
          ...m,
          role: editRole,
          permissions: rolePermissions[editRole] || ['view']
        };
      }
      return m;
    }));
    setEditingUserId(null);
  };

  const cancelEditing = () => {
    setEditingUserId(null);
  };

  const getRoleIcon = (role: string) => {
    if (role.toLowerCase().includes('promoter') || role.toLowerCase().includes('applicant')) {
      return <Shield className="w-3.5 h-3.5 text-primary" />;
    }
    if (role.toLowerCase().includes('cfo')) {
      return <UserCheck className="w-3.5 h-3.5 text-success" />;
    }
    return <Key className="w-3.5 h-3.5 text-purple-600" />;
  };

  return (
    <div ref={containerRef} className="space-y-8 pb-12 select-none">
      
      {/* Grid: Invite and Member List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Invite Member Card */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm h-fit">
          <div className="mb-6">
            <h3 className="text-base font-bold text-slate-800">Invite Collaborator</h3>
            <p className="text-xs text-slate-400 mt-1 font-semibold">Grant access to auditors, CFOs, or legal counsel</p>
          </div>

          <form onSubmit={handleInviteSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 block uppercase">Collaborator Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input 
                  type="email" 
                  placeholder="collaborator@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="pl-9.5 pr-4 py-2.5 w-full text-xs border border-slate-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-slate-800 bg-white font-semibold placeholder-slate-400"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 block uppercase">Role & Authority</label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="text-xs border border-slate-200 rounded-xl w-full px-3 py-2.5 outline-none font-bold text-slate-700 bg-white cursor-pointer"
              >
                <option value="Editor">Editor (Edit and upload documents)</option>
                <option value="CFO">CFO (Sign off financial projections)</option>
                <option value="Auditor">Auditor (View-only audit access)</option>
                <option value="Company Secretary">Company Secretary (View and edit parameters)</option>
              </select>
            </div>

            {successMsg && (
              <div className="p-3 bg-success-subtle border border-success-light/20 rounded-xl flex items-start gap-2.5 text-xs text-success font-semibold animate-pulse">
                <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-primary hover:bg-primary-light text-white text-xs font-bold rounded-xl cursor-pointer shadow-md transition-all active:scale-98 flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Send Portal Invite</span>
            </button>
          </form>
        </div>
 
        {/* Member cards grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="text-base font-bold text-slate-800">Authorized Team</h3>
              <p className="text-xs text-slate-400 mt-1 font-semibold">Users with portal access to IPO filings</p>
            </div>
            <span className="text-xs text-slate-500 font-bold bg-slate-50 border border-slate-200 px-3 py-1 rounded-xl flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>{team.length} Members</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {team.map((member) => (
              <div
                key={member.userId}
                data-user-id={member.userId}
                className="team-card-anim group bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between relative"
              >
                
                {/* Edit / Remove Action Overlay */}
                {editingUserId !== member.userId && (
                  <div className="absolute top-4 right-4 flex gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity duration-200">
                    <button 
                      onClick={() => startEditing(member)} 
                      className="p-1 text-slate-400 hover:text-primary hover:bg-slate-50 border border-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Edit Role"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {member.role !== 'Primary Promoter' && (
                      <button 
                        onClick={() => handleRemoveMember(member.userId)} 
                        className="p-1 text-slate-400 hover:text-red hover:bg-red/5 border border-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="Remove Member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center font-black text-slate-500 shrink-0 uppercase border border-slate-100 text-xs">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-800 truncate">{member.name}</p>
                    
                    {editingUserId === member.userId ? (
                      <div className="space-y-2.5 pt-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Change Role</label>
                        <div className="flex gap-2">
                          <select
                            value={editRole}
                            onChange={(e) => setEditRole(e.target.value)}
                            className="text-[11px] border border-slate-200 rounded-lg p-1.5 w-full bg-white font-bold text-slate-700 cursor-pointer outline-none"
                          >
                            <option value="Editor">Editor</option>
                            <option value="CFO">CFO</option>
                            <option value="Auditor">Auditor</option>
                            <option value="Company Secretary">Company Secretary</option>
                          </select>
                          <button 
                            onClick={() => saveEditing(member.userId)}
                            className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center justify-center cursor-pointer shadow-sm"
                            title="Save"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={cancelEditing}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-650 rounded-lg flex items-center justify-center cursor-pointer"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-450 font-bold uppercase">
                        {getRoleIcon(member.role)}
                        <span>{member.role}</span>
                      </div>
                    )}
                  </div>
                </div>

                {editingUserId !== member.userId && (
                  <div className="mt-5 pt-3.5 border-t border-slate-100">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Filing Authority</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {member.permissions.map((perm) => (
                        <span
                          key={perm}
                          className="px-2.5 py-0.5 rounded-full bg-slate-50 text-slate-500 text-[9px] font-bold border border-slate-100 uppercase tracking-wide"
                        >
                          {perm}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
