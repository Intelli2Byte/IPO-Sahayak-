'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Send, User, MessageSquare, AlertCircle, FileText, CheckCircle2, ShieldCheck, ZoomIn, ZoomOut, Download, Undo, Redo, Highlighter, Eraser } from 'lucide-react';
import gsap from 'gsap';
import { PDFDocument, rgb } from 'pdf-lib';
import { DocumentItem, Comment } from '@/data/mockData';

interface SplitDocumentViewerProps {
  document: DocumentItem | null;
  onClose: () => void;
  onAddReply: (documentId: string, replyText: string) => void;
}

interface HighlightRect {
  id: string;
  documentId: string;
  pageNumber: number;
  color: string;
  // Normalized coordinates (0-1 range relative to page)
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function SplitDocumentViewer({ document: docItem, onClose, onAddReply }: SplitDocumentViewerProps) {
  const [replyText, setReplyText] = useState('');
  const [zoom, setZoom] = useState<number>(1.0); // Single source of truth: 1.0 = 100%
  const [highlights, setHighlights] = useState<HighlightRect[]>([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [currentPoint, setCurrentPoint] = useState<{ x: number; y: number } | null>(null);
  const [highlighterMode, setHighlighterMode] = useState<'yellow' | 'red' | null>(null);
  const [history, setHistory] = useState<HighlightRect[][]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const highlightLayerRef = useRef<HTMLDivElement>(null);
  
  const isAnnotated = docItem ? (docItem.status === 'under_review' || docItem.comments.length > 0) : false;

  // PDF page dimensions (standard A4 at 72 DPI - PDF points)
  const PAGE_WIDTH = 595;
  const PAGE_HEIGHT = 842;

  // Load highlights from localStorage (document-specific)
  useEffect(() => {
    if (docItem) {
      const stored = localStorage.getItem(`highlights_${docItem.id}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const documentHighlights = parsed.filter((h: HighlightRect) => h.documentId === docItem.id);
          setHighlights(documentHighlights);
          setHistory([documentHighlights]);
          setHistoryIndex(0);
        } catch (e) {
          console.error('Failed to parse highlights', e);
          setHighlights([]);
          setHistory([[]]);
          setHistoryIndex(0);
        }
      } else {
        setHighlights([]);
        setHistory([[]]);
        setHistoryIndex(0);
      }
    }
  }, [docItem?.id]);

  // Save highlights to localStorage
  useEffect(() => {
    if (docItem) {
      localStorage.setItem(`highlights_${docItem.id}`, JSON.stringify(highlights));
    }
  }, [highlights, docItem?.id]);

  // Prevent body scroll when modal opens
  useEffect(() => {
    if (docItem && containerRef.current) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      gsap.fromTo(containerRef.current,
        { opacity: 0, scale: 0.98 },
        { opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out' }
      );
    }

    return () => {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    };
  }, [docItem]);

  const handleClose = () => {
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        scale: 0.98,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          const scrollY = document.body.style.top;
          document.body.style.position = '';
          document.body.style.top = '';
          document.body.style.width = '';
          document.body.style.overflow = '';
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
    setZoom(prev => Math.min(prev + 0.1, 2.0));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleZoomReset = () => {
    setZoom(1.0);
  };

  // Convert mouse event to normalized page coordinates (0-1 range)
  const getPageCoordinates = (e: React.MouseEvent): { x: number; y: number } | null => {
    if (!pageContainerRef.current) return null;

    const rect = pageContainerRef.current.getBoundingClientRect();
    
    // Get mouse position relative to page container
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Normalize to 0-1 range (independent of zoom)
    const normalizedX = mouseX / rect.width;
    const normalizedY = mouseY / rect.height;

    return { x: normalizedX, y: normalizedY };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!highlighterMode || !docItem) return;

    e.preventDefault();
    e.stopPropagation();

    const coords = getPageCoordinates(e);
    if (!coords) return;

    setIsDrawing(true);
    setStartPoint(coords);
    setCurrentPoint(coords);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !highlighterMode || !startPoint) return;

    e.preventDefault();
    e.stopPropagation();

    const coords = getPageCoordinates(e);
    if (!coords) return;

    setCurrentPoint(coords);
  };

  const handleMouseUp = () => {
    if (!isDrawing || !highlighterMode || !startPoint || !currentPoint || !docItem) {
      setIsDrawing(false);
      setStartPoint(null);
      setCurrentPoint(null);
      return;
    }

    // Calculate rectangle (handle all drag directions)
    const x = Math.min(startPoint.x, currentPoint.x);
    const y = Math.min(startPoint.y, currentPoint.y);
    const width = Math.abs(currentPoint.x - startPoint.x);
    const height = Math.abs(currentPoint.y - startPoint.y);

    // Only create highlight if it has meaningful size
    if (width > 0.01 && height > 0.01) {
      const newHighlight: HighlightRect = {
        id: `highlight_${Date.now()}`,
        documentId: docItem.id,
        pageNumber: 1,
        color: highlighterMode === 'yellow' ? '#FDE047' : '#FCA5A5',
        x,
        y,
        width,
        height
      };

      const newHighlights = [...highlights, newHighlight];
      setHighlights(newHighlights);

      // Update history
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newHighlights);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }

    setIsDrawing(false);
    setStartPoint(null);
    setCurrentPoint(null);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setHighlights(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setHighlights(history[historyIndex + 1]);
    }
  };

  const handleClearAll = () => {
    if (!docItem) return;
    
    const newHighlights = highlights.filter(h => h.documentId !== docItem.id);
    setHighlights(newHighlights);

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newHighlights);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Export PDF with highlights
  const handleDownloadWithHighlights = async () => {
    if (!docItem) return;

    setIsExporting(true);

    try {
      // Fetch original PDF
      const response = await fetch(docItem.url);
      const arrayBuffer = await response.arrayBuffer();

      // Load PDF document
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      // Get document-specific highlights
      const documentHighlights = highlights.filter(h => h.documentId === docItem.id);

      // Group highlights by page
      const highlightsByPage = documentHighlights.reduce((acc, highlight) => {
        const pageIndex = highlight.pageNumber - 1; // Convert to 0-based index
        if (!acc[pageIndex]) {
          acc[pageIndex] = [];
        }
        acc[pageIndex].push(highlight);
        return acc;
      }, {} as Record<number, HighlightRect[]>);

      // Draw highlights on each page
      Object.entries(highlightsByPage).forEach(([pageIndexStr, pageHighlights]) => {
        const pageIndex = parseInt(pageIndexStr);
        if (pageIndex >= 0 && pageIndex < pages.length) {
          const page = pages[pageIndex];
          const { width: pageWidth, height: pageHeight } = page.getSize();

          pageHighlights.forEach((highlight) => {
            // Convert normalized coordinates (0-1) to PDF points
            const x = highlight.x * pageWidth;
            const y = highlight.y * pageHeight;
            const width = highlight.width * pageWidth;
            const height = highlight.height * pageHeight;

            // PDF coordinate system: origin at bottom-left
            // Browser coordinate system: origin at top-left
            // Convert Y coordinate
            const pdfY = pageHeight - y - height;

            // Parse color
            let color = rgb(1, 1, 0); // Default yellow
            if (highlight.color === '#FDE047') {
              color = rgb(0.992, 0.878, 0.278); // Yellow
            } else if (highlight.color === '#FCA5A5') {
              color = rgb(0.988, 0.647, 0.647); // Red
            }

            // Draw semi-transparent rectangle
            page.drawRectangle({
              x,
              y: pdfY,
              width,
              height,
              color,
              opacity: 0.4,
              borderWidth: 0
            });
          });
        }
      });

      // Save modified PDF
      const pdfBytes = await pdfDoc.save();

// Create download — wrap bytes to satisfy BlobPart's ArrayBuffer typing
const blob = new Blob([new Uint8Array(pdfBytes)], {
  type: 'application/pdf'
});
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename
      const originalName = docItem.fileName.replace(/\.pdf$/i, '');
      link.download = `${originalName}-highlighted.pdf`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Show success message
      gsap.fromTo('.export-success',
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
      );

      setTimeout(() => {
        gsap.to('.export-success', {
          opacity: 0,
          y: -20,
          duration: 0.3,
          ease: 'power2.in'
        });
      }, 3000);

    } catch (error) {
      console.error('Failed to export PDF with highlights:', error);
      alert('Failed to export PDF with highlights. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  if (!docItem) return null;

  // Calculate dynamic highlight counts for THIS document only
  const documentHighlights = highlights.filter(h => h.documentId === docItem.id);
  const yellowCount = documentHighlights.filter(h => h.color === '#FDE047').length;
  const redCount = documentHighlights.filter(h => h.color === '#FCA5A5').length;

  // Calculate current drag rectangle (normalized coordinates)
  let dragRect: { x: number; y: number; width: number; height: number } | null = null;
  if (isDrawing && startPoint && currentPoint) {
    dragRect = {
      x: Math.min(startPoint.x, currentPoint.x),
      y: Math.min(startPoint.y, currentPoint.y),
      width: Math.abs(currentPoint.x - startPoint.x),
      height: Math.abs(currentPoint.y - startPoint.y)
    };
  }

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 bg-slate-900 flex flex-col md:flex-row overflow-hidden select-none"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      {/* Export Success Message */}
      <div className="export-success fixed top-20 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-2xl z-50 opacity-0 flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5" />
        <span className="font-bold text-sm">PDF with highlights downloaded successfully!</span>
      </div>

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
              Digital Highlighter • {Math.round(zoom * 100)}% View
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
                disabled={zoom <= 0.5}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-slate-700"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={handleZoomReset}
                className="text-xs font-bold text-slate-300 min-w-[60px] text-center px-2 py-1 hover:bg-slate-800 rounded cursor-pointer"
                title="Reset to 100%"
              >
                {Math.round(zoom * 100)}%
              </button>
              <button
                onClick={handleZoomIn}
                disabled={zoom >= 2.0}
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
              disabled={documentHighlights.length === 0}
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
                disabled={historyIndex >= history.length - 1}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-slate-700"
                title="Redo"
              >
                <Redo className="w-4 h-4" />
              </button>
            </div>

            {/* Download with Highlights */}
            <button
              onClick={handleDownloadWithHighlights}
              disabled={isExporting}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer transition-all border border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-xs font-bold"
              title="Download PDF with Highlights"
            >
              <Download className="w-4 h-4" />
              {isExporting ? 'Exporting...' : 'Download'}
            </button>
          </div>
        </div>

        {/* Document Canvas - PROPER COORDINATE SYSTEM */}
        <div className="flex-1 w-full relative overflow-auto bg-slate-900 flex justify-center items-start p-8">
          <div 
            ref={pageContainerRef}
            className="relative bg-white shadow-2xl"
            style={{
              width: `${PAGE_WIDTH * zoom}px`,
              height: `${PAGE_HEIGHT * zoom}px`,
              position: 'relative'
            }}
          >
            {/* PDF iframe */}
            <iframe
              ref={iframeRef}
              src={`${docItem.url}#view=FitH&zoom=${Math.round(zoom * 100)}`}
              className="absolute inset-0 w-full h-full border-0"
              title={docItem.name}
              style={{ pointerEvents: highlighterMode ? 'none' : 'auto' }}
            />

            {/* Highlight Layer - PERFECTLY ALIGNED */}
            <div
              ref={highlightLayerRef}
              className="absolute inset-0 pointer-events-none"
              style={{ overflow: 'hidden' }}
            >
              {/* Existing highlights */}
              {documentHighlights.map((highlight) => (
                <div
                  key={highlight.id}
                  className="absolute"
                  style={{
                    left: `${highlight.x * 100}%`,
                    top: `${highlight.y * 100}%`,
                    width: `${highlight.width * 100}%`,
                    height: `${highlight.height * 100}%`,
                    backgroundColor: highlight.color,
                    opacity: 0.4,
                    pointerEvents: 'none'
                  }}
                />
              ))}

              {/* Current drag preview */}
              {dragRect && (
                <div
                  className="absolute"
                  style={{
                    left: `${dragRect.x * 100}%`,
                    top: `${dragRect.y * 100}%`,
                    width: `${dragRect.width * 100}%`,
                    height: `${dragRect.height * 100}%`,
                    backgroundColor: highlighterMode === 'yellow' ? '#FDE047' : '#FCA5A5',
                    opacity: 0.4,
                    border: `2px dashed ${highlighterMode === 'yellow' ? '#FDE047' : '#FCA5A5'}`,
                    pointerEvents: 'none'
                  }}
                />
              )}
            </div>

            {/* Interaction Layer - CAPTURES MOUSE EVENTS */}
            {highlighterMode && (
              <div
                className="absolute inset-0"
                style={{
                  cursor: 'crosshair',
                  pointerEvents: 'auto',
                  zIndex: 10
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              />
            )}
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

      {/* RIGHT PANEL: Metadata (unchanged from previous version) */}
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
