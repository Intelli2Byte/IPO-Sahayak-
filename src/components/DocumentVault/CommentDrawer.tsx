'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Send, User, ShieldAlert, MessageSquare } from 'lucide-react';
import gsap from 'gsap';
import { DocumentItem, Comment } from '@/data/mockData';

interface CommentDrawerProps {
  document: DocumentItem | null;
  onClose: () => void;
  onAddReply: (documentId: string, replyText: string) => void;
}

export default function CommentDrawer({ document, onClose, onAddReply }: CommentDrawerProps) {
  const [replyText, setReplyText] = useState('');
  const drawerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const commentsListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (document) {
      // Open Animations
      gsap.fromTo(backdropRef.current,
        { opacity: 0 },
        { opacity: 0.4, duration: 0.3 }
      );
      gsap.fromTo(drawerRef.current,
        { x: '100%' },
        { x: '0%', duration: 0.4, ease: 'power3.out' }
      );

      // Stagger animate comments list
      setTimeout(() => {
        const comments = commentsListRef.current?.querySelectorAll('.comment-item-anim');
        if (comments && comments.length > 0) {
          gsap.fromTo(comments,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, stagger: 0.08, duration: 0.4, ease: 'power2.out' }
          );
        }
      }, 100);
    }
  }, [document]);

  const handleClose = () => {
    // Close Animations
    gsap.to(backdropRef.current, { opacity: 0, duration: 0.25 });
    gsap.to(drawerRef.current, { 
      x: '100%', 
      duration: 0.3, 
      ease: 'power2.in',
      onComplete: onClose 
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !document) return;

    onAddReply(document.id, replyText);
    setReplyText('');

    // Trigger a brief success scale bounce on comments input field
    gsap.fromTo('.reply-box',
      { scale: 0.98 },
      { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.3)' }
    );
  };

  if (!document) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Backdrop */}
      <div 
        ref={backdropRef}
        onClick={handleClose}
        className="absolute inset-0 bg-slate-900 opacity-0 transition-opacity cursor-pointer"
      />

      {/* Slide-over Drawer Panel */}
      <div 
        ref={drawerRef}
        className="absolute inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col justify-between border-l border-slate-200"
        style={{ transform: 'translateX(100%)' }}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-150 flex items-center justify-between bg-slate-50">
          <div className="space-y-1.5 pr-2">
            <span className="text-[10px] text-warning bg-warning/15 border border-warning/10 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              Under Review Query
            </span>
            <h3 className="text-sm font-bold text-slate-800 line-clamp-1">{document.name}</h3>
          </div>
          <button 
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Comments Area */}
        <div ref={commentsListRef} className="flex-1 p-6 overflow-y-auto space-y-4 bg-white">
          <div className="comment-item-anim border border-slate-150 p-4 rounded-2xl bg-slate-50 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-slate-800">SEBI Review Desk</p>
              <p className="text-xs text-slate-500 mt-1">Regulatory audit status marked query for follow-up.</p>
            </div>
          </div>

          {document.comments.map((comment) => {
            const isReviewer = comment.author.includes('Reviewer');
            
            return (
              <div 
                key={comment.id}
                className={`comment-item-anim p-4 rounded-2xl border flex items-start gap-3 max-w-[85%] ${
                  isReviewer 
                    ? 'border-warning/10 bg-warning/5 text-warning ml-0' 
                    : 'border-primary/10 bg-primary-subtle/10 text-primary ml-auto flex-row-reverse'
                }`}
              >
                <div className={`p-2 rounded-lg shrink-0 ${isReviewer ? 'bg-warning/10' : 'bg-primary/10'}`}>
                  <User className="w-4 h-4" />
                </div>
                <div className="space-y-1 text-left">
                  <p className="text-xs font-bold text-slate-800">{comment.author}</p>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">{comment.text}</p>
                  <span className="text-[9px] text-slate-400 mt-1 block">
                    {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Drawer Footer Input reply form */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-slate-250 bg-slate-50">
          <div className="flex items-center gap-2 reply-box bg-white border border-slate-200 rounded-xl px-3 py-1.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
            <MessageSquare className="w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Type clarification or upload notice response..." 
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 text-xs border-0 focus:ring-0 focus:outline-none py-2 text-slate-800 bg-white font-medium placeholder-slate-400"
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
            Replying transitions the document status back to &ldquo;Pending Review&rdquo;
          </span>
        </form>

      </div>
    </div>
  );
}
