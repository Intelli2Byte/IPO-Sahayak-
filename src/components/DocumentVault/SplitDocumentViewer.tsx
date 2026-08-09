'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Send, User, MessageSquare, AlertCircle, FileText, CheckCircle2, ShieldCheck } from 'lucide-react';
import gsap from 'gsap';
import { DocumentItem, Comment } from '@/data/mockData';

interface SplitDocumentViewerProps {
  document: DocumentItem | null;
  onClose: () => void;
  onAddReply: (documentId: string, replyText: string) => void;
}

export default function SplitDocumentViewer({ document: docItem, onClose, onAddReply }: SplitDocumentViewerProps) {
  const [replyText, setReplyText] = useState('');
  const [activeAnnotation, setActiveAnnotation] = useState<number | null>(null);
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const isAnnotated = docItem ? (docItem.status === 'under_review' || docItem.comments.length > 0) : false;

  const annotations = [
    {
      id: 1,
      page: 2,
      title: "Document Verification Required",
      description: "Please verify all financial figures match the audited statements.",
      status: "pending",
      severity: "high",
      coordinates: { top: '35%', left: '42%' }
    },
    {
      id: 2,
      page: 4,
      title: "Signature and Stamp Verification",
      description: "Ensure all authorized signatures and company seals are present.",
      status: "pending",
      severity: "medium",
      coordinates: { top: '72%', left: '65%' }
    }
  ];

  useEffect(() => {
    if (docItem && docItem.url) {
      const isAnnotatedDoc = docItem.status === 'under_review' || docItem.comments.length > 0;
      setActiveAnnotation(isAnnotatedDoc ? 0 : null);
      
      // Force PDF to open at page 1 with FitH view (top of page)
      const pageParam = isAnnotatedDoc ? '#page=2&view=FitH' : '#page=1&view=FitH';
      setIframeSrc(docItem.url + pageParam);
    } else {
      setIframeSrc(null);
    }
  }, [docItem]);

  useEffect(() => {
    if (docItem && containerRef.current) {
      gsap.fromTo(containerRef.current,
        { opacity: 0, scale: 0.98 },
        { opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out' }
      );

      setTimeout(() => {
        const items = containerRef.current?.querySelectorAll('.stagger-entry');
        if (items && items.length > 0) {
          gsap.fromTo(items,
            { opacity: 0, x: 20 },
            { opacity: 1, x: 0, stagger: 0.06, duration: 0.4, ease: 'power2.out' }
          );
        }
      }, 100);
    }
  }, [docItem]);

  const handleClose = () => {
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        scale: 0.98,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: onClose
      });
    } else {
      onClose();
    }
  };

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !docItem) return;

    onAddReply(docItem.id, replyText);
    setReplyText('');

    gsap.fromTo('.chat-send-box',
      { scale: 0.98 },
      { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.3)' }
    );
  };

  if (!docItem) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 bg-slate-900 flex flex-col md:flex-row overflow-hidden select-none"
    >
      {/* LEFT PANEL: PDF Viewer */}
      <div className="flex-1 flex flex-col h-2/3 md:h-full border-r border-slate-800 bg-slate-950 relative">
        <div className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-bold text-slate-200 truncate max-w-md">
              In-App Viewer: {docItem.name}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-slate-400 font-bold bg-slate-800 px-3 py-1 rounded-full">
              PDF Engine V2
            </span>
            <button 
              onClick={handleClose}
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer transition-all border border-slate-700 ml-2"
              title="Close PDF Viewer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 w-full relative overflow-hidden bg-slate-900 flex items-center justify-center">
          {iframeSrc ? (
            <iframe 
              src={iframeSrc} 
              className="w-full h-full border-0 select-none"
              title="PDF Document Viewer"
            />
          ) : (
            <div className="text-slate-400 text-sm font-semibold">Loading document...</div>
          )}

          {isAnnotated && activeAnnotation !== null && annotations[activeAnnotation] && (
            <div 
              className="absolute bg-yellow-400/25 border-2 border-yellow-400 rounded pointer-events-none z-10 shadow-lg shadow-yellow-400/10 animate-pulse transition-all duration-300"
              style={{
                top: annotations[activeAnnotation].coordinates.top,
                left: annotations[activeAnnotation].coordinates.left,
                width: '320px',
                height: '75px',
              }}
            />
          )}

          {isAnnotated && (
            <div className="absolute top-6 left-6 max-w-sm w-full bg-slate-900/90 border border-slate-700/80 backdrop-blur-md p-4 rounded-xl shadow-2xl z-10 space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <AlertCircle className="w-4 h-4 text-warning" />
                <span className="text-xs font-bold text-slate-100">Review Marks & Annotations</span>
              </div>
              <div className="space-y-2">
                {annotations.map((flag, idx) => (
                  <button
                    key={flag.id}
                    onClick={() => {
                      setActiveAnnotation(idx);
                      setIframeSrc(`${docItem.url}#page=${flag.page}&view=FitH`);
                    }}
                    className={`w-full p-2.5 rounded-lg border text-left transition-all flex items-start gap-2 cursor-pointer ${
                      activeAnnotation === idx 
                        ? 'bg-warning/10 border-warning text-slate-100' 
                        : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:bg-slate-800/80'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      activeAnnotation === idx ? 'bg-warning text-slate-950' : 'bg-slate-700 text-slate-300'
                    }`}>
                      {flag.page}
                    </span>
                    <div>
                      <p className="text-[11px] font-bold text-slate-200 leading-tight">{flag.title}</p>
                      {activeAnnotation === idx && (
                        <p className="text-[10px] text-slate-350 mt-1.5 leading-relaxed font-medium">
                          {flag.description}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL: Comments or Metadata */}
      <div className="w-full md:w-96 bg-white flex flex-col justify-between h-1/3 md:h-full border-t md:border-t-0 border-slate-200">
        
        {isAnnotated ? (
          <>
            <div className="p-5 border-b border-slate-150 flex items-center justify-between bg-slate-50 shrink-0">
              <div>
                <span className="text-[9px] bg-warning/15 border border-warning/10 text-warning px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Query Resolution Panel
                </span>
                <h3 className="text-xs font-bold text-slate-800 mt-1.5 line-clamp-1">{docItem.name}</h3>
              </div>
              <button 
                onClick={handleClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-white">
              <div className="stagger-entry border border-slate-150 p-4 rounded-xl bg-slate-50 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-800">SEBI Auditing Desk</p>
                  <p className="text-xs text-slate-500 mt-1 font-medium font-sans">
                    This document requires revision based on the annotations highlighted on the left.
                  </p>
                </div>
              </div>

              {docItem.comments.map((comment) => {
                const isReviewer = comment.author.includes('Reviewer') || comment.author.includes('SEBI');
                return (
                  <div 
                    key={comment.id}
                    className={`stagger-entry p-3 rounded-xl border flex items-start gap-2.5 max-w-[85%] ${
                      isReviewer 
                        ? 'border-warning/15 bg-warning/5 text-warning ml-0' 
                        : 'border-primary/15 bg-primary-subtle/25 text-primary ml-auto flex-row-reverse'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg shrink-0 ${isReviewer ? 'bg-warning/10' : 'bg-primary/10'}`}>
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <div className="space-y-1 text-left">
                      <p className="text-[11px] font-bold text-slate-800">{comment.author}</p>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">{comment.text}</p>
                      <span className="text-[9px] text-slate-400 mt-1 block">
                        {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleSubmitReply} className="p-4 border-t border-slate-200 bg-slate-50 shrink-0">
              <div className="chat-send-box flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
                <MessageSquare className="w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Clarify annotations or submit replies..." 
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 text-xs border-0 focus:ring-0 focus:outline-none py-1.5 text-slate-800 bg-white font-semibold placeholder-slate-450"
                />
                <button 
                  type="submit"
                  disabled={!replyText.trim()}
                  className={`p-2 rounded-lg text-white transition-all cursor-pointer ${
                    replyText.trim() ? 'bg-primary hover:bg-primary-light active:scale-95' : 'bg-slate-200 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-[10px] text-slate-400 text-center block mt-2 font-medium">
                Replying sets the document status to &ldquo;Pending Review&rdquo;.
              </span>
            </form>
          </>
        ) : (
          <>
            <div className="p-5 border-b border-slate-150 flex items-center justify-between bg-slate-50 shrink-0">
              <div>
                <span className="text-[9px] bg-emerald-50 border border-emerald-150 text-emerald-600 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Compliance Metadata
                </span>
                <h3 className="text-xs font-bold text-slate-850 mt-1.5 line-clamp-1">{docItem.name}</h3>
              </div>
              <button 
                onClick={handleClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-white">
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Audit History Log</h4>
                <div className="space-y-3.5">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-200">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                    </span>
                    <div>
                      <p className="font-bold text-slate-800">Uploaded By</p>
                      <p className="text-[11px] text-slate-450 mt-0.5">{docItem.uploadedBy}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-200">
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                    </span>
                    <div>
                      <p className="font-bold text-slate-800">File Signature</p>
                      <p className="text-[11px] text-slate-450 mt-0.5">SHA-256 Validated</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5 space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">SEBI Formatting Checklist</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5 text-xs text-slate-600">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                    <span className="font-medium">Digitally signed via DSC (Passed)</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-600">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                    <span className="font-medium">Standard A4 margins layout checked</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-600">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                    <span className="font-medium">Anti-virus quarantine scan (Passed)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-slate-100 bg-slate-50 shrink-0 space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold">
                <ShieldCheck className="w-4.5 h-4.5 shrink-0" />
                <span>Verified Clean Document</span>
              </div>
              <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                This document contains no unresolved reviewer comments or required adjustments.
              </p>
            </div>
          </>
        )}

      </div>
    </div>
  );
}