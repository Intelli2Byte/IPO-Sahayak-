'use client';

import { useState } from 'react';
import { FileText, File, Eye, Edit2, Trash2, Scan, X, Download, ShieldCheck, Clock } from 'lucide-react';
import { DocumentFile } from '@/data/generatedDocuments';
import { useGeneratedDocuments } from '@/context/GeneratedDocumentsContext';

export default function GeneratedDocuments() {
  const { documents, deleteDocument } = useGeneratedDocuments();
  const [viewingDoc, setViewingDoc] = useState<DocumentFile | null>(null);

  const openViewer = (doc: DocumentFile) => {
    setViewingDoc(doc);
  };

  const closeViewer = () => {
    setViewingDoc(null);
  };

  const deleteDoc = (id: string) => {
    if (confirm('Are you sure you want to permanently delete this generated document?')) {
      deleteDocument(id);
    }
  };

  return (
    <div className="space-y-8 pb-12 select-none animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-slate-800 pb-5">
        <div>
          <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">Filing Output Hub</p>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Generated Documents</h1>
          <p className="text-xs text-slate-500 mt-2 font-semibold">Access, review, and manage officially compiled prospectus documents.</p>
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
        {documents.map((doc) => (
          <div key={doc.id} className="bg-white border border-slate-300 shadow-sm flex flex-col group transition-all hover:shadow-md hover:border-slate-400">
            
            {/* Card Body */}
            <div className="p-6 flex-1 relative">
              {/* Version & Status Badges */}
              <div className="absolute top-5 right-5 flex gap-2">
                <span className={`px-2 py-1 text-[9px] font-black uppercase tracking-wider border ${
                  doc.status === 'Final' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {doc.status}
                </span>
                <span className="px-2 py-1 text-[9px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                  {doc.version}
                </span>
              </div>

              <div className="flex items-start gap-4">
                {/* File Type Icon */}
                <div className={`w-12 h-12 flex items-center justify-center border-2 shadow-sm shrink-0 ${
                  doc.type === 'pdf' ? 'bg-red-50 border-red-200 text-red-600' : 'bg-blue-50 border-blue-200 text-blue-600'
                }`}>
                  {doc.type === 'pdf' ? <FileText className="w-6 h-6" /> : <File className="w-6 h-6" />}
                </div>

                <div className="pr-20">
                  <h3 className="text-sm font-black text-slate-800 tracking-wide">{doc.name}</h3>
                  <div className="flex items-center gap-1.5 mt-2 text-[10px] font-bold text-slate-400 uppercase">
                    <Clock className="w-3 h-3" />
                    Generated: {doc.dateGenerated}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Toolbar */}
            <div className="bg-[#2A3441] flex divide-x divide-slate-600 border-t border-[#2A3441] mt-auto rounded-b-sm">
              <button 
                onClick={() => openViewer(doc)}
                className="flex-1 py-2.5 flex items-center justify-center gap-1.5 text-[10px] font-bold text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" /> View
              </button>
              <button 
                className="flex-1 py-2.5 flex items-center justify-center gap-1.5 text-[10px] font-bold text-slate-300 hover:text-amber-400 hover:bg-slate-700 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5 text-amber-500" /> Edit
              </button>
              <button 
                onClick={() => deleteDoc(doc.id)}
                className="flex-1 py-2.5 flex items-center justify-center gap-1.5 text-[10px] font-bold text-slate-300 hover:text-red-400 hover:bg-slate-700 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-500" /> Delete
              </button>
              <button 
                className="flex-1 py-2.5 flex items-center justify-center gap-1.5 text-[10px] font-bold text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              >
                <Scan className="w-3.5 h-3.5" /> Scanner
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* =========================================================
          SECURE PDF/WORD VIEWER MODAL
      ========================================================= */}
      {viewingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 md:p-8 animate-fade-in">
          <div className="bg-slate-100 w-full max-w-6xl h-full flex flex-col shadow-2xl border border-slate-700 overflow-hidden relative">
            
            {/* Viewer Toolbar */}
            <div className="h-14 bg-[#0F172A] border-b border-slate-700 flex items-center justify-between px-4 shrink-0 shadow-md z-10">
              <div className="flex items-center gap-4">
                <div className={`p-1.5 rounded bg-white/10 ${viewingDoc.type === 'pdf' ? 'text-red-400' : 'text-blue-400'}`}>
                  {viewingDoc.type === 'pdf' ? <FileText className="w-4 h-4" /> : <File className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-xs font-black text-white tracking-wide">{viewingDoc.name}</h3>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{viewingDoc.version} · OFFICIAL COPY</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded text-[10px] font-black text-white uppercase tracking-wider transition-colors">
                  <Download className="w-3 h-3" /> Download
                </button>
                <div className="w-px h-6 bg-slate-700 mx-1" />
                <button 
                  onClick={closeViewer} 
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Viewer Canvas (Mocked secure reader) */}
            <div className="flex-1 bg-[#F1F5F9] overflow-y-auto flex justify-center p-8 relative">
              {/* Secure Watermark */}
              <div className="fixed inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] z-0">
                <span className="text-8xl font-black text-slate-900 -rotate-45 select-none">STRICTLY CONFIDENTIAL</span>
              </div>

              {/* The "Paper" Document */}
              <div className="bg-white w-full max-w-4xl shadow-xl border border-slate-300 p-12 md:p-20 relative z-10 min-h-[1056px]">
                <div className="flex justify-between items-start border-b-2 border-slate-900 pb-8 mb-10">
                  <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
                      {viewingDoc.name.includes('Abridged') ? 'Abridged Prospectus' : 'Draft Red Herring Prospectus'}
                    </h1>
                    <p className="text-sm font-bold text-slate-500 mt-2">Prepared in accordance with SEBI (ICDR) Regulations.</p>
                  </div>
                  <ShieldCheck className="w-12 h-12 text-[#1E3A8A] opacity-20" />
                </div>

                <div className="space-y-6 text-slate-700 text-sm font-medium leading-relaxed">
                  <div className="p-4 bg-slate-50 border border-slate-200 text-xs font-bold font-mono text-slate-500">
                    [SECURE DOCUMENT RENDERER] <br/>
                    File: {viewingDoc.name} <br/>
                    Encryption: AES-256 Active
                  </div>
                  <p>
                    Please read Section 32 of the Companies Act, 2013. This is a secure mock viewer illustrating how the officially generated {viewingDoc.name.includes('Abridged') ? 'Abridged Prospectus' : 'DRHP'} will render in the portal prior to submission to the lead manager and exchange.
                  </p>
                  {/* Mock paragraphs to show scrolling */}
                  {Array.from({ length: 15 }).map((_, i) => (
                    <div key={i} className="h-4 bg-slate-100 rounded w-full animate-pulse" style={{ width: `${Math.max(40, Math.random() * 100)}%` }} />
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
