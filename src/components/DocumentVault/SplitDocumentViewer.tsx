'use client';

import { useState, useEffect, useRef, useReducer, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, Send, User, MessageSquare, AlertCircle, FileText, CheckCircle2, ShieldCheck, ZoomIn, ZoomOut, Download, Undo, Redo, Highlighter, Eraser } from 'lucide-react';
import gsap from 'gsap';
import { PDFDocument, PDFPage, rgb } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import type { PDFDocumentProxy, RenderTask } from 'pdfjs-dist';
import { DocumentItem, Comment } from '@/data/mockData';

// pdf.js needs a worker script. Resolving it through `import.meta.url` lets
// Next.js's bundler (webpack or Turbopack) pull the worker file straight out
// of the installed pdfjs-dist package and serve it locally — no CDN request,
// and no risk of the CDN's file naming (which changed between pdfjs-dist
// major versions, e.g. .mjs only appeared in v4+) mismatching the version
// actually installed.
if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url
  ).toString();
}

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
  x: number;
  y: number;
  width: number;
  height: number;
}

// ============================================================
// HIGHLIGHTS REDUCER — past/present/future pattern.
// This replaces the old dual `highlights` + `history[]` state,
// which could desync between the two under React's automatic
// batching (the concrete cause of Undo/Eraser silently failing).
// A reducer guarantees every transition is a single atomic step.
// ============================================================
interface HighlightsState {
  past: HighlightRect[][];
  present: HighlightRect[];
  future: HighlightRect[][];
}

type HighlightsAction =
  | { type: 'LOAD'; highlights: HighlightRect[] }
  | { type: 'ADD'; highlight: HighlightRect }
  | { type: 'CLEAR' }
  | { type: 'UNDO' }
  | { type: 'REDO' };

const initialHighlightsState: HighlightsState = { past: [], present: [], future: [] };

function highlightsReducer(state: HighlightsState, action: HighlightsAction): HighlightsState {
  switch (action.type) {
    case 'LOAD':
      // Switching documents: reset undo/redo stacks entirely for the new doc.
      return { past: [], present: action.highlights, future: [] };

    case 'ADD':
      return {
        past: [...state.past, state.present],
        present: [...state.present, action.highlight],
        future: [] // any new action invalidates the redo stack
      };

    case 'CLEAR':
      if (state.present.length === 0) return state;
      return {
        past: [...state.past, state.present],
        present: [],
        future: []
      };

    case 'UNDO': {
      if (state.past.length === 0) return state;
      const previous = state.past[state.past.length - 1];
      return {
        past: state.past.slice(0, -1),
        present: previous,
        future: [state.present, ...state.future]
      };
    }

    case 'REDO': {
      if (state.future.length === 0) return state;
      const next = state.future[0];
      return {
        past: [...state.past, state.present],
        present: next,
        future: state.future.slice(1)
      };
    }

    default:
      return state;
  }
}

// ============================================================
// PDF EXPORT COORDINATE HELPERS
// ------------------------------------------------------------
// pdf-lib's page.getSize() reports the page's MediaBox, but PDF
// viewers (including pdf.js, which now drives the on-screen
// canvas below) render the CropBox — which many report/export
// pipelines set smaller than, or offset from, the MediaBox.
// These helpers resolve the box that was actually *displayed*
// (CropBox, falling back to MediaBox) plus rotation, so the
// rectangle we draw at export time lands exactly where the user
// saw it on screen, regardless of how the source PDF's boxes are
// set up.
// ============================================================

function getPageContentBox(page: PDFPage): { x: number; y: number; width: number; height: number } {
  let box: { x: number; y: number; width: number; height: number } | undefined;
  try {
    box = page.getCropBox();
  } catch {
    box = undefined;
  }
  if (!box || box.width <= 0 || box.height <= 0) {
    box = page.getMediaBox();
  }
  return box;
}

function getPageDisplayInfo(page: PDFPage) {
  const box = getPageContentBox(page);
  const rotation = ((page.getRotation().angle % 360) + 360) % 360;
  const swapped = rotation === 90 || rotation === 270;
  return {
    box,
    rotation,
    displayWidth: swapped ? box.height : box.width,
    displayHeight: swapped ? box.width : box.height,
  };
}

// Maps a highlight rect expressed in normalized (0-1) display coordinates
// (top-left origin, y-down — matching the on-screen overlay) into the raw
// PDF coordinate space `drawRectangle` expects (bottom-left origin, y-up,
// relative to the page's absolute MediaBox origin).
function normalizedRectToPdfRect(
  norm: { x: number; y: number; width: number; height: number },
  page: PDFPage
) {
  const { box, rotation, displayWidth, displayHeight } = getPageDisplayInfo(page);

  const dispX = norm.x * displayWidth;
  const dispY = norm.y * displayHeight;
  const dispW = norm.width * displayWidth;
  const dispH = norm.height * displayHeight;

  const toLocal = (X: number, Y: number): [number, number] => {
    switch (rotation) {
      case 90:
        return [Y, box.height - X];
      case 180:
        return [box.width - X, box.height - Y];
      case 270:
        return [box.width - Y, X];
      default:
        return [X, Y];
    }
  };

  const [u0, v0] = toLocal(dispX, dispY);
  const [u1, v1] = toLocal(dispX + dispW, dispY + dispH);

  const uMin = Math.min(u0, u1);
  const uMax = Math.max(u0, u1);
  const vMin = Math.min(v0, v1);
  const vMax = Math.max(v0, v1);

  return {
    x: box.x + uMin,
    y: box.y + (box.height - vMax),
    width: uMax - uMin,
    height: vMax - vMin,
  };
}

export default function SplitDocumentViewer({ document: docItem, onClose, onAddReply }: SplitDocumentViewerProps) {
  const [replyText, setReplyText] = useState('');
  const [zoom, setZoom] = useState<number>(1.0);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [currentPoint, setCurrentPoint] = useState<{ x: number; y: number } | null>(null);
  const [highlighterMode, setHighlighterMode] = useState<'yellow' | 'red' | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  // Single source of truth for highlights + undo/redo stacks.
  const [highlightsState, dispatch] = useReducer(highlightsReducer, initialHighlightsState);

  // Real PDF page size at scale=1 (CSS px == PDF points), read via pdf.js.
  // This is the SAME box pdf.js will paint onto the canvas below, so the
  // container div, the highlight overlay, and the exported PDF are all
  // guaranteed to agree — no more guessing at what a native viewer's
  // "zoom=100%" actually renders at.
  const [pageSize, setPageSize] = useState<{ width: number; height: number }>({ width: 595, height: 842 });

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const highlightLayerRef = useRef<HTMLDivElement>(null);

  const pdfDocRef = useRef<PDFDocumentProxy | null>(null);
  const renderTaskRef = useRef<RenderTask | null>(null);

  const isAnnotated = docItem ? (docItem.status === 'under_review' || docItem.comments.length > 0) : false;

  // Portal mount guard - required for Next.js SSR
  useEffect(() => {
    setMounted(true);
  }, []);

  // Renders the first page onto the canvas at the given CSS-pixel scale.
  // Because we own the render call end-to-end, the canvas's on-screen size
  // is EXACTLY `pageSize.width * scale` x `pageSize.height * scale` — no
  // native-plugin DPI guesswork, so normalized click coordinates always
  // correspond to the same fraction of the real page.
  const renderPage = useCallback(async (scale: number) => {
    const pdfDoc = pdfDocRef.current;
    const canvas = canvasRef.current;
    if (!pdfDoc || !canvas) return;

    const page = await pdfDoc.getPage(1);
    const viewport = page.getViewport({ scale });
    const context = canvas.getContext('2d');
    if (!context) return;

    const outputScale = window.devicePixelRatio || 1;
    canvas.width = Math.floor(viewport.width * outputScale);
    canvas.height = Math.floor(viewport.height * outputScale);

    if (renderTaskRef.current) {
      renderTaskRef.current.cancel();
    }

    const task = page.render({
      canvasContext: context,
      viewport,
      transform: outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : undefined,
    });
    renderTaskRef.current = task;

    try {
      await task.promise;
    } catch (e) {
      if ((e as { name?: string })?.name !== 'RenderingCancelledException') {
        console.error('PDF render failed', e);
      }
    }
  }, []);

  // Load the document into pdf.js whenever it changes, and capture its true
  // page size (at scale=1, so pageSize.width/height are literally CSS px
  // per PDF point — this already accounts for CropBox and rotation).
  useEffect(() => {
    if (!docItem) return;

    let cancelled = false;

    (async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(docItem.url);
        const pdfDoc = await loadingTask.promise;
        if (cancelled) {
          pdfDoc.destroy();
          return;
        }

        pdfDocRef.current?.destroy();
        pdfDocRef.current = pdfDoc;

        const page = await pdfDoc.getPage(1);
        const baseViewport = page.getViewport({ scale: 1 });
        if (!cancelled) {
          setPageSize({ width: baseViewport.width, height: baseViewport.height });
          await renderPage(zoom);
        }
      } catch (e) {
        console.error('Failed to load PDF, falling back to A4', e);
        if (!cancelled) {
          setPageSize({ width: 595, height: 842 });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docItem?.id]);

  // Re-render whenever zoom changes (document load above handles the first render).
  useEffect(() => {
    if (!docItem) return;
    renderPage(zoom);
  }, [zoom, docItem?.id, renderPage]);

  // Clean up the pdf.js document when the viewer unmounts.
  useEffect(() => {
    return () => {
      renderTaskRef.current?.cancel();
      pdfDocRef.current?.destroy();
      pdfDocRef.current = null;
    };
  }, []);

  // Load highlights from localStorage (document-specific) into the reducer
  useEffect(() => {
    if (!docItem) return;

    const stored = localStorage.getItem(`highlights_${docItem.id}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const documentHighlights = parsed.filter((h: HighlightRect) => h.documentId === docItem.id);
        dispatch({ type: 'LOAD', highlights: documentHighlights });
      } catch (e) {
        console.error('Failed to parse highlights', e);
        dispatch({ type: 'LOAD', highlights: [] });
      }
    } else {
      dispatch({ type: 'LOAD', highlights: [] });
    }
  }, [docItem?.id]);

  // Persist current highlights to localStorage whenever they change
  useEffect(() => {
    if (docItem) {
      localStorage.setItem(`highlights_${docItem.id}`, JSON.stringify(highlightsState.present));
    }
  }, [highlightsState.present, docItem?.id]);

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

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

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

    const x = Math.min(startPoint.x, currentPoint.x);
    const y = Math.min(startPoint.y, currentPoint.y);
    const width = Math.abs(currentPoint.x - startPoint.x);
    const height = Math.abs(currentPoint.y - startPoint.y);

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

      dispatch({ type: 'ADD', highlight: newHighlight });
    }

    setIsDrawing(false);
    setStartPoint(null);
    setCurrentPoint(null);
  };

  const handleUndo = () => {
    dispatch({ type: 'UNDO' });
  };

  const handleRedo = () => {
    dispatch({ type: 'REDO' });
  };

  const handleClearAll = () => {
    dispatch({ type: 'CLEAR' });
  };

  const handleDownloadWithHighlights = async () => {
    if (!docItem) return;

    setIsExporting(true);

    try {
      const response = await fetch(docItem.url);
      const arrayBuffer = await response.arrayBuffer();

      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      const documentHighlights = highlightsState.present.filter(h => h.documentId === docItem.id);

      const highlightsByPage = documentHighlights.reduce((acc, highlight) => {
        const pageIndex = highlight.pageNumber - 1;
        if (!acc[pageIndex]) {
          acc[pageIndex] = [];
        }
        acc[pageIndex].push(highlight);
        return acc;
      }, {} as Record<number, HighlightRect[]>);

      Object.entries(highlightsByPage).forEach(([pageIndexStr, pageHighlights]) => {
        const pageIndex = parseInt(pageIndexStr);
        if (pageIndex >= 0 && pageIndex < pages.length) {
          const page = pages[pageIndex];

          pageHighlights.forEach((highlight) => {
            // Map the normalized on-screen rect (captured against the
            // pdf.js-rendered canvas, so it's pixel-accurate to the real
            // page) into real PDF coordinates, CropBox + rotation aware.
            const rect = normalizedRectToPdfRect(
              { x: highlight.x, y: highlight.y, width: highlight.width, height: highlight.height },
              page
            );

            let color = rgb(1, 1, 0);
            if (highlight.color === '#FDE047') {
              color = rgb(0.992, 0.878, 0.278);
            } else if (highlight.color === '#FCA5A5') {
              color = rgb(0.988, 0.647, 0.647);
            }

            page.drawRectangle({
              x: rect.x,
              y: rect.y,
              width: rect.width,
              height: rect.height,
              color,
              opacity: 0.4,
              borderWidth: 0
            });
          });
        }
      });

      const pdfBytes = await pdfDoc.save();

      const blob = new Blob([new Uint8Array(pdfBytes)], {
        type: 'application/pdf'
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      const originalName = docItem.fileName.replace(/\.pdf$/i, '');
      link.download = `${originalName}-highlighted.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

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

  if (!docItem || !mounted) return null;

  const currentHighlights = highlightsState.present.filter(h => h.documentId === docItem.id);
  const yellowCount = currentHighlights.filter(h => h.color === '#FDE047').length;
  const redCount = currentHighlights.filter(h => h.color === '#FCA5A5').length;
  const canUndo = highlightsState.past.length > 0;
  const canRedo = highlightsState.future.length > 0;

  let dragRect: { x: number; y: number; width: number; height: number } | null = null;
  if (isDrawing && startPoint && currentPoint) {
    dragRect = {
      x: Math.min(startPoint.x, currentPoint.x),
      y: Math.min(startPoint.y, currentPoint.y),
      width: Math.abs(currentPoint.x - startPoint.x),
      height: Math.abs(currentPoint.y - startPoint.y)
    };
  }

  return createPortal(
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
      <div className="flex-1 flex flex-col h-full min-w-0 min-h-0 border-r border-slate-800 bg-slate-950 relative overflow-hidden">

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

            <button
              onClick={handleClearAll}
              disabled={currentHighlights.length === 0}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer transition-all border border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Clear All Highlights"
            >
              <Eraser className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 border-l border-slate-700 pl-3">
              <button
                onClick={handleUndo}
                disabled={!canUndo}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-slate-700"
                title="Undo"
              >
                <Undo className="w-4 h-4" />
              </button>
              <button
                onClick={handleRedo}
                disabled={!canRedo}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-slate-700"
                title="Redo"
              >
                <Redo className="w-4 h-4" />
              </button>
            </div>

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

        {/* SINGLE DEDICATED SCROLL CANVAS */}
        <div className="flex-1 min-w-0 min-h-0 w-full overflow-auto bg-slate-900 p-8">
          <div
            ref={pageContainerRef}
            className="relative bg-white shadow-2xl"
            style={{
              width: `${pageSize.width * zoom}px`,
              height: `${pageSize.height * zoom}px`,
              margin: '0 auto',
            }}
          >
            {/*
              Rendered by pdf.js directly onto this canvas at scale=zoom.
              Because WE control the render call, the canvas's CSS box is
              guaranteed to be exactly pageSize.width*zoom x pageSize.height*zoom
              — the same box normalized highlight coordinates are captured
              against. This is what the old native-viewer iframe (with a
              `#zoom=` fragment) could never guarantee: that plugin's
              "100%" renders at ~1.33 CSS px per PDF point (96/72 DPI),
              not 1:1, so the visible page was always larger than our box
              and every highlight silently drifted on export.
            */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
              style={{ pointerEvents: highlighterMode ? 'none' : 'auto' }}
            />

            <div
              ref={highlightLayerRef}
              className="absolute inset-0 pointer-events-none"
              style={{ overflow: 'hidden' }}
            >
              {currentHighlights.map((highlight) => (
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

      {/* RIGHT PANEL: Metadata (unchanged) */}
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
    </div>,
    document.body
  );
}