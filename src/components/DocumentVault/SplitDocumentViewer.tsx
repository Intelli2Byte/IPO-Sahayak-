'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Send, User, MessageSquare, AlertCircle, FileText, CheckCircle2, ShieldCheck, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Download, Undo, Redo, Highlighter, Eraser } from 'lucide-react';
import gsap from 'gsap';
import { DocumentItem, Comment } from '@/data/mockData';

interface SplitDocumentViewerProps {
  document: DocumentItem | null;
  onClose: () => void;
  onAddReply: (documentId: string, replyText: string) => void;
}

interface DrawingStroke {
  id: string;
  documentId: string;
  pageNumber: number;
  color: string;
  points: { x: number; y: number }[];
  lineWidth: number;
}

export default function SplitDocumentViewer({ document: docItem, onClose, onAddReply }: SplitDocumentViewerProps) {
  const [replyText, setReplyText] = useState('');
  const [scale, setScale] = useState<number>(0.8); // 80% default zoom
  const [drawings, setDrawings] = useState<DrawingStroke[]>([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [currentStroke, setCurrentStroke] = useState<{ x: number; y: number }[]>([]);
  const [highlighterMode, setHighlighterMode] = useState<'yellow' | 'red' | null>(null);
  const [drawingHistory, setDrawingHistory] = useState<DrawingStroke[][]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
  const viewerScrollRef = useRef<HTMLDivElement>(null);
  
  const isAnnotated = docItem ? (docItem.status === 'under_review' || docItem.comments.length > 0) : false;

  // Load drawings from localStorage (document-specific)
  useEffect(() => {
    if (docItem) {
      const stored = localStorage.getItem(`drawings_${docItem.id}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // Filter to ensure only this document's highlights
          const documentDrawings = parsed.filter((d: DrawingStroke) => d.documentId === docItem.id);
          setDrawings(documentDrawings);
          setDrawingHistory([documentDrawings]);
          setHistoryIndex(0);
        } catch (e) {
          console.error('Failed to parse drawings', e);
          setDrawings([]);
          setDrawingHistory([[]]);
          setHistoryIndex(0);
        }
      } else {
        // No stored drawings for this document
        setDrawings([]);
        setDrawingHistory([[]]);
        setHistoryIndex(0);
      }
    }
  }, [docItem?.id]);

  // Save drawings to localStorage (document-specific)
  useEffect(() => {
    if (docItem) {
      localStorage.setItem(`drawings_${docItem.id}`, JSON.stringify(drawings));
    }
  }, [drawings, docItem?.id]);

  // Entrance animation WITHOUT scrolling to top
  useEffect(() => {
    if (docItem && containerRef.current) {
      // Prevent body scroll during modal open
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      gsap.fromTo(containerRef.current,
        { opacity: 0, scale: 0.98 },
        { opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out' }
      );
    }

    // Cleanup: restore scroll position
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    };
  }, [docItem]);

  // Redraw canvas when drawings change
  useEffect(() => {
    if (drawingCanvasRef.current) {
      const canvas = drawingCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw all strokes for this document
      const documentDrawings = drawings.filter(d => d.documentId === docItem?.id);
      documentDrawings.forEach(stroke => {
        if (stroke.points.length < 2) return;

        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalAlpha = 0.4;

        ctx.beginPath();
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
        
        for (let i = 1; i < stroke.points.length; i++) {
          ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
        }
        
        ctx.stroke();
        ctx.globalAlpha = 1.0;
      });
    }
  }, [drawings, docItem?.id]);

  const handleClose = () => {
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        scale: 0.98,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          // Restore scroll before closing
          const scrollY = document.body.style.top;
          document.body.style.position = '';
          document.body.style.top = '';
          document.body.style.width = '';
          if (scrollY) {
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
          }
          onClose();
        }
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

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 2.0));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.4));
  };

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = drawingCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / scale, // Normalize for zoom
      y: (e.clientY - rect.top) / scale
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!highlighterMode || !docItem) return;

    e.preventDefault();
    e.stopPropagation();
    
    setIsDrawing(true);
    const pos = getMousePos(e);
    setCurrentStroke([pos]);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !highlighterMode) return;

    e.preventDefault();
    e.stopPropagation();

    const pos = getMousePos(e);
    setCurrentStroke(prev => [...prev, pos]);

    // Draw current stroke in real-time
    const canvas = drawingCanvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || currentStroke.length === 0) return;

    const color = highlighterMode === 'yellow' ? '#FDE047' : '#FCA5A5';
    ctx.strokeStyle = color;
    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = 0.4;

    ctx.beginPath();
    ctx.moveTo(currentStroke[currentStroke.length - 1].x * scale, currentStroke[currentStroke.length - 1].y * scale);
    ctx.lineTo(pos.x * scale, pos.y * scale);
    ctx.stroke();
    ctx.globalAlpha = 1.0;
  };

  const handleMouseUp = () => {
    if (!isDrawing || !highlighterMode || currentStroke.length < 2 || !docItem) {
      setIsDrawing(false);
      setCurrentStroke([]);
      return;
    }

    const newStroke: DrawingStroke = {
      id: `stroke_${Date.now()}`,
      documentId: docItem.id, // Associate with current document
      pageNumber: 1, // For multi-page support, track actual page
      color: highlighterMode === 'yellow' ? '#FDE047' : '#FCA5A5',
      points: currentStroke,
      lineWidth: 20
    };

    const newDrawings = [...drawings, newStroke];
    setDrawings(newDrawings);

    // Update history
    const newHistory = drawingHistory.slice(0, historyIndex + 1);
    newHistory.push(newDrawings);
    setDrawingHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);

    setIsDrawing(false);
    setCurrentStroke([]);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setDrawings(drawingHistory[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < drawingHistory.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setDrawings(drawingHistory[historyIndex + 1]);
    }
  };

  const handleClearAll = () => {
    if (!docItem) return;
    
    const newDrawings = drawings.filter(d => d.documentId !== docItem.id);
    setDrawings(newDrawings);

    const newHistory = drawingHistory.slice(0, historyIndex + 1);
    newHistory.push(newDrawings);
    setDrawingHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleDownload = () => {
    if (docItem) {
      const link = document.createElement('a');
      link.href = docItem.url;
      link.download = docItem.fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!docItem) return null;

  // Calculate dynamic highlight counts for THIS document only
  const documentDrawings = drawings.filter(d => d.documentId === docItem.id);
  const yellowCount = documentDrawings.filter(d => d.color === '#FDE047').length;
  const redCount = documentDrawings.filter(d => d.color === '#FCA5A5').length;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 bg-slate-900 flex flex-col md:flex-row overflow-hidden select-none"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      {/* LEFT PANEL: Document Viewer */}
      <div className="flex-1 flex flex-col h-full border-r border-slate-800 bg-slate-950 relative overflow-hidden">
        
        {/* Header */}
        <div className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-bold text-slate-200 truncate max-w-md">
              {docItem.name}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-slate-400 font-bold bg-slate-800 px-3 py-1 rounded-full">
              Digital Highlighter • {Math.round(scale * 100)}% View
            </span>
            <button 
              onClick={handleClose}
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer transition-all border border-slate-700 ml-2"
              title="Close Viewer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-4">
            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleZoomOut}
                disabled={scale <= 0.4}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-slate-700"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold text-slate-300 min-w-[60px] text-center">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                disabled={scale >= 2.0}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-slate-700"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Highlighter Buttons */}
            <button
              onClick={() => setHighlighterMode(highlighterMode === 'yellow' ? null : 'yellow')}
              className={`px-3 py-2 rounded-lg cursor-pointer transition-all flex items-center gap-2 text-xs font-bold border ${
                highlighterMode === 'yellow'
                  ? 'bg-yellow-400/20 border-yellow-400 text-yellow-300'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
              title="Yellow Highlighter - Important"
            >
              <Highlighter className="w-4 h-4" />
              <span className="w-4 h-4 rounded bg-yellow-400"></span>
            </button>

            <button
              onClick={() => setHighlighterMode(highlighterMode === 'red' ? null : 'red')}
              className={`px-3 py-2 rounded-lg cursor-pointer transition-all flex items-center gap-2 text-xs font-bold border ${
                highlighterMode === 'red'
                  ? 'bg-red-400/20 border-red-400 text-red-300'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
              title="Red Highlighter - Alert"
            >
              <Highlighter className="w-4 h-4" />
              <span className="w-4 h-4 rounded bg-red-400"></span>
            </button>

            {/* Clear All */}
            <button
              onClick={handleClearAll}
              disabled={documentDrawings.length === 0}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer transition-all border border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Clear All Highlights"
            >
              <Eraser className="w-4 h-4" />
            </button>

            {/* Undo/Redo */}
            <div className="flex items-center gap-2 border-l border-slate-700 pl-3">
              <button
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-slate-700"
                title="Undo"
              >
                <Undo className="w-4 h-4" />
              </button>
              <button
                onClick={handleRedo}
                disabled={historyIndex >= drawingHistory.length - 1}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-slate-700"
                title="Redo"
              >
                <Redo className="w-4 h-4" />
              </button>
            </div>

            {/* Download */}
            <button
              onClick={handleDownload}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer transition-all border border-slate-700"
              title="Download Document"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Document Canvas - FIXED SCROLL CONTAINER */}
        <div 
          ref={viewerScrollRef}
          className="flex-1 w-full relative overflow-auto bg-slate-900 flex justify-center items-start p-8"
          style={{ 
            overflowY: 'auto',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <div 
            className="relative" 
            style={{ 
              transform: `scale(${scale})`, 
              transformOrigin: 'top center',
              transition: 'transform 0.2s ease-out'
            }}
          >
            {/* Document iframe */}
            <iframe
              ref={iframeRef}
              src={`${docItem.url}#view=FitH`}
              className="w-[800px] h-[1100px] bg-white shadow-2xl border-0"
              title={docItem.name}
              onLoad={() => {
                // Set canvas size to match iframe
                if (drawingCanvasRef.current) {
                  drawingCanvasRef.current.width = 800 * scale;
                  drawingCanvasRef.current.height = 1100 * scale;
                }
              }}
            />

            {/* Drawing Canvas Overlay - ZOOM-AWARE */}
            <canvas
              ref={drawingCanvasRef}
              width={800 * scale}
              height={1100 * scale}
              className="absolute top-0 left-0 pointer-events-auto"
              style={{
                cursor: highlighterMode ? 'crosshair' : 'default',
                touchAction: 'none',
                width: '800px',
                height: '1100px'
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
          </div>

          {/* Highlighter Mode Indicator */}
          {highlighterMode && (
            <div className="fixed top-24 left-8 bg-slate-900/90 border border-slate-700 backdrop-blur-md px-4 py-2 rounded-xl shadow-2xl z-20">
              <p className="text-xs font-bold text-slate-100 flex items-center gap-2">
                <Highlighter className="w-4 h-4" />
                <span className={`w-3 h-3 rounded-full ${highlighterMode === 'yellow' ? 'bg-yellow-400' : 'bg-red-400'}`}></span>
                {highlighterMode === 'yellow' ? 'Yellow Highlighter Active' : 'Red Highlighter Active'}
              </p>
              <p className="text-[10px] text-slate-400 mt-1">Click and drag to highlight</p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL: Comments or Metadata */}
      <div className="w-full md:w-96 bg-white flex flex-col justify-between h-full border-t md:border-t-0 border-slate-200 overflow-hidden">
        
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
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Highlights Summary</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5 text-xs text-slate-600">
                    <span className="w-4 h-4 rounded bg-yellow-400"></span>
                    <span className="font-medium">{yellowCount} Yellow highlight{yellowCount !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-600">
                    <span className="w-4 h-4 rounded bg-red-400"></span>
                    <span className="font-medium">{redCount} Red highlight{redCount !== 1 ? 's' : ''}</span>
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
