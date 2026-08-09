'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Users,
  Shield,
  Plus,
  Mail,
  FileText,
  CheckCircle2,
  UserCheck,
  Key,
  Edit2,
  Trash2,
  Check,
  X,
  ClipboardList,
} from 'lucide-react';
import gsap from 'gsap';
import {
  mockIpoApplication,
  getCurrentUserWithPermissions,
  TeamMember,
} from '@/data/mockData';
import { getSendableGeneratedDocuments } from '@/data/generatedDocuments';
import { useGeneratedDocuments } from '@/context/GeneratedDocumentsContext';
import Toast from '@/components/UI/Toast';
import { SendDocumentResponse, SentDocumentLog, ToastState } from '@/types/team-access';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ROLE_PERMISSIONS: Record<string, string[]> = {
  Editor: ['view', 'edit'],
  CFO: ['view', 'edit', 'submit'],
  Auditor: ['view'],
  'Company Secretary': ['view', 'edit'],
};

const formatLogDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

export default function TeamAccess() {
  const [team, setTeam] = useState<TeamMember[]>(mockIpoApplication.team);

  const { documents: generatedDocuments } = useGeneratedDocuments();
  const sendableDocuments = getSendableGeneratedDocuments(generatedDocuments);

  const { profile: currentUserProfile, permissions: currentUserPermissions } =
    getCurrentUserWithPermissions();
  const canSendDocument = currentUserPermissions.includes('send_document');

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Editor');
  const [selectedDocumentId, setSelectedDocumentId] = useState(
    sendableDocuments[0]?.id ?? ''
  );
  const [isSending, setIsSending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const [logs, setLogs] = useState<SentDocumentLog[]>([]);

  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState('Editor');

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = containerRef.current?.querySelectorAll('.team-card-anim');
    if (cards && cards.length > 0) {
      gsap.fromTo(
        cards,
        { opacity: 0, scale: 0.95, y: 15 },
        { opacity: 1, scale: 1, y: 0, stagger: 0.08, duration: 0.5, ease: 'power3.out' }
      );
    }
  }, []);

  // Keep the Document selection in sync with the live Generated Documents
  // source: if the selected document is deleted/no longer sendable, fall
  // back to the next available one (or clear the selection entirely).
  useEffect(() => {
    if (sendableDocuments.length === 0) {
      if (selectedDocumentId !== '') setSelectedDocumentId('');
      return;
    }
    const stillValid = sendableDocuments.some((d) => d.id === selectedDocumentId);
    if (!stillValid) {
      setSelectedDocumentId(sendableDocuments[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sendableDocuments]);

  const animateNewTeamCard = () => {
    setTimeout(() => {
      const cards = containerRef.current?.querySelectorAll('.team-card-anim');
      if (cards && cards.length > 0) {
        const lastCard = cards[cards.length - 1];
        gsap.fromTo(
          lastCard,
          { opacity: 0, scale: 0.9, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.5)' }
        );
      }
    }, 50);
  };

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!canSendDocument) {
      setFormError('You do not have permission to send documents.');
      return;
    }

    if (!inviteEmail.trim() || !EMAIL_REGEX.test(inviteEmail.trim())) {
      setFormError('Please enter a valid collaborator email.');
      return;
    }

    if (!inviteRole) {
      setFormError('Please select a role.');
      return;
    }

    if (!selectedDocumentId) {
      setFormError('Please select a document.');
      return;
    }

    const selectedDocument = sendableDocuments.find((d) => d.id === selectedDocumentId);
    if (!selectedDocument) {
      setFormError('Only finalized generated documents can be sent.');
      return;
    }

    setIsSending(true);
    try {
      const res = await fetch('/api/send-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: inviteEmail.trim(),
          role: inviteRole,
          documentId: selectedDocument.id,
        }),
      });
      const data: SendDocumentResponse = await res.json();

      if (!res.ok || !data.success) {
        setToast({
          id: `toast_${Date.now()}`,
          type: 'error',
          message: data.message || 'Unable to send document. Please try again.',
        });
        return;
      }

      // Add the invited collaborator to Authorized Team (existing behavior).
      const newMember: TeamMember = {
        userId: `usr_${Date.now()}`,
        name: inviteEmail
          .split('@')[0]
          .replace('.', ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase()),
        role: inviteRole,
        permissions: ROLE_PERMISSIONS[inviteRole] || ['view'],
      };
      setTeam((prev) => [...prev, newMember]);
      animateNewTeamCard();

      // Append log entry — only on confirmed success.
      const sentAt = data.sentAt ?? new Date().toISOString();
      const newLog: SentDocumentLog = {
        id: `log_${Date.now()}`,
        date: formatLogDate(sentAt),
        name: currentUserProfile.fullName,
        email: inviteEmail.trim(),
        document: data.documentFileName ?? selectedDocument.name,
      };
      setLogs((prev) => [newLog, ...prev]);

      setToast({
        id: `toast_${Date.now()}`,
        type: 'success',
        message: '✓ Document sent successfully.',
      });
      setInviteEmail('');
    } catch {
      setToast({
        id: `toast_${Date.now()}`,
        type: 'error',
        message: 'Unable to send document. Please try again.',
      });
    } finally {
      setIsSending(false);
    }
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
          setTeam((prev) => prev.filter((m) => m.userId !== userId));
        },
      });
    } else {
      setTeam((prev) => prev.filter((m) => m.userId !== userId));
    }
  };

  const startEditing = (member: TeamMember) => {
    setEditingUserId(member.userId);
    setEditRole(member.role);
  };

  const saveEditing = (userId: string) => {
    setTeam((prev) =>
      prev.map((m) => {
        if (m.userId === userId) {
          return {
            ...m,
            role: editRole,
            permissions: ROLE_PERMISSIONS[editRole] || ['view'],
          };
        }
        return m;
      })
    );
    setEditingUserId(null);
  };

  const cancelEditing = () => setEditingUserId(null);

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
      {toast && (
        <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Invite Collaborator Card */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm h-fit">
          <div className="mb-6">
            <h3 className="text-base font-bold text-slate-800">Invite Collaborator</h3>
            <p className="text-xs text-slate-400 mt-1 font-semibold">
              Grant access to auditors, CFOs, or legal counsel
            </p>
          </div>

          <form onSubmit={handleInviteSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 block uppercase">
                Collaborator Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  placeholder="collaborator@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  disabled={!canSendDocument}
                  className="pl-9.5 pr-4 py-2.5 w-full text-xs border border-slate-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-slate-800 bg-white font-semibold placeholder-slate-400 disabled:bg-slate-50 disabled:cursor-not-allowed"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 block uppercase">
                Role & Authority
              </label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                disabled={!canSendDocument}
                className="text-xs border border-slate-200 rounded-xl w-full px-3 py-2.5 outline-none font-bold text-slate-700 bg-white cursor-pointer disabled:bg-slate-50 disabled:cursor-not-allowed"
              >
                <option value="Editor">Editor (Edit and upload documents)</option>
                <option value="CFO">CFO (Sign off financial projections)</option>
                <option value="Auditor">Auditor (View-only audit access)</option>
                <option value="Company Secretary">
                  Company Secretary (View and edit parameters)
                </option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 block uppercase">Document</label>
              {sendableDocuments.length > 0 ? (
                <div className="relative">
                  <FileText className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <select
                    value={selectedDocumentId}
                    onChange={(e) => setSelectedDocumentId(e.target.value)}
                    disabled={!canSendDocument}
                    className="pl-9.5 pr-4 py-2.5 w-full text-xs border border-slate-200 rounded-xl outline-none font-bold text-slate-700 bg-white cursor-pointer disabled:bg-slate-50 disabled:cursor-not-allowed"
                  >
                    {sendableDocuments.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <>
                  <select
                    disabled
                    className="text-xs border border-slate-200 rounded-xl w-full px-3 py-2.5 outline-none font-bold text-slate-400 bg-slate-50 cursor-not-allowed"
                  >
                    <option>No generated documents available</option>
                  </select>
                  <p className="text-[10px] text-slate-400 font-semibold mt-1.5">
                    Generate a document first before sending it to a collaborator.
                  </p>
                </>
              )}
            </div>

            {!canSendDocument && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 font-semibold">
                Your role does not have permission to send documents.
              </div>
            )}

            {formError && (
              <div className="p-3 bg-red/5 border border-red/20 rounded-xl text-xs text-red font-semibold">
                {formError}
              </div>
            )}

            <button
              type="submit"
              disabled={!canSendDocument || isSending || sendableDocuments.length === 0}
              className="w-full py-3 bg-primary hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl cursor-pointer shadow-md transition-all active:scale-98 flex items-center justify-center gap-1.5"
            >
              {isSending ? (
                <span>Sending Document...</span>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Send Document</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Authorized Team — unchanged */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="text-base font-bold text-slate-800">Authorized Team</h3>
              <p className="text-xs text-slate-400 mt-1 font-semibold">
                Users with portal access to IPO filings
              </p>
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
                    {member.name.split(' ').map((n) => n[0]).join('')}
                  </div>

                  <div className="space-y-1.5 min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-800 truncate">{member.name}</p>

                    {editingUserId === member.userId ? (
                      <div className="space-y-2.5 pt-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                          Change Role
                        </label>
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
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Filing Authority
                    </p>
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

      {/* Log Analysis */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-1">
          <ClipboardList className="w-4 h-4 text-slate-500" />
          <h3 className="text-base font-bold text-slate-800">Log Analysis</h3>
        </div>
        <p className="text-xs text-slate-400 font-semibold mb-5">
          Track documents sent to collaborators
        </p>

        {logs.length === 0 ? (
          <div className="py-10 flex flex-col items-center justify-center text-center">
            <CheckCircle2 className="w-6 h-6 text-slate-300 mb-2" />
            <p className="text-xs text-slate-400 font-semibold">
              No documents have been sent yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="py-2.5 pr-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                    Date
                  </th>
                  <th className="py-2.5 pr-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                    Name
                  </th>
                  <th className="py-2.5 pr-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                    Email
                  </th>
                  <th className="py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                    Document Sent
                  </th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                    <td className="py-3 pr-4 text-xs text-slate-600 font-semibold whitespace-nowrap">
                      {log.date}
                    </td>
                    <td className="py-3 pr-4 text-xs text-slate-800 font-bold whitespace-nowrap">
                      {log.name}
                    </td>
                    <td className="py-3 pr-4 text-xs text-slate-600 font-semibold max-w-[220px] truncate" title={log.email}>
                      {log.email}
                    </td>
                    <td className="py-3 text-xs text-slate-600 font-semibold max-w-[260px] truncate" title={log.document}>
                      {log.document}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}