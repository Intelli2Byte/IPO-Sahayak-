'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  FolderIcon, 
  UploadCloud, 
  CheckCircle2, 
  ChevronDown, 
  Download, 
  MessageSquare, 
  FileText,
  Clock,
  AlertCircle,
  X,
  FileCheck
} from 'lucide-react';
import gsap from 'gsap';
import { mockDocumentVault, DocumentCategory, DocumentItem, Comment } from '@/data/mockData';
import SplitDocumentViewer from './SplitDocumentViewer';

export default function VaultManager() {
  const [categories, setCategories] = useState<DocumentCategory[]>(mockDocumentVault.categories);
  const [summary, setSummary] = useState(mockDocumentVault.summary);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['cat_financial']);
  const [activeCommentDoc, setActiveCommentDoc] = useState<DocumentItem | null>(null);
  
  // Drag and Drop simulation states
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadingFileName, setUploadingFileName] = useState<string | null>(null);

  // Toast Notification states
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastRef = useRef<HTMLDivElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Re-calculate vault summaries whenever categories list updates
  useEffect(() => {
    const totalRequired = categories.reduce((acc, curr) => acc + curr.required, 0);
    const totalUploaded = categories.reduce((acc, curr) => acc + curr.uploaded, 0);
    const totalApproved = categories.reduce((acc, curr) => acc + curr.approved, 0);
    const totalPending = categories.reduce((acc, curr) => acc + curr.pending, 0);
    const totalUnderReview = categories.reduce((acc, curr) => {
      return acc + curr.documents.filter(d => d.status === 'under_review').length;
    }, 0);
    const completionPercentage = parseFloat(((totalApproved / totalRequired) * 100).toFixed(2));

    setSummary({
      totalRequired,
      totalUploaded,
      totalApproved,
      totalPending,
      totalUnderReview,
      totalRejected: 0,
      completionPercentage
    });
  }, [categories]);

  // Trigger Toast message slide-in animation
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      if (toastRef.current) {
        // Slide in from top-right
        const tl = gsap.timeline();
        tl.fromTo(toastRef.current,
          { x: 400, opacity: 0, rotation: 5 },
          { x: 0, opacity: 1, rotation: 0, duration: 0.5, ease: 'back.out(1.4)' }
        );
        
        // Progress bar timer animation
        gsap.fromTo('.toast-timer',
          { width: '100%' },
          { width: '0%', duration: 4.5, ease: 'linear' }
        );
      }
    }, 50);

    // Auto dismiss after 5s
    setTimeout(() => {
      dismissToast();
    }, 5000);
  };

  const dismissToast = () => {
    if (toastRef.current) {
      gsap.to(toastRef.current, {
        x: 450,
        opacity: 0,
        duration: 0.35,
        ease: 'power2.in',
        onComplete: () => setToastMessage(null)
      });
    } else {
      setToastMessage(null);
    }
  };

  // Expand / collapse accordions
  const toggleCategory = (catId: string) => {
    setExpandedCategories(prev => {
      const isExpanded = prev.includes(catId);
      const accordionBody = document.getElementById(`acc-body-${catId}`);
      const arrowIcon = document.getElementById(`acc-arrow-${catId}`);
      
      if (isExpanded) {
        // Collapse
        if (accordionBody) {
          gsap.to(accordionBody, { height: 0, opacity: 0, duration: 0.35, ease: 'power2.inOut' });
        }
        if (arrowIcon) {
          gsap.to(arrowIcon, { rotation: 0, duration: 0.3 });
        }
        return prev.filter(id => id !== catId);
      } else {
        // Expand
        if (accordionBody) {
          gsap.set(accordionBody, { height: 'auto' });
          const fullHeight = accordionBody.clientHeight;
          gsap.fromTo(accordionBody,
            { height: 0, opacity: 0 },
            { height: fullHeight, opacity: 1, duration: 0.4, ease: 'power2.out' }
          );
        }
        if (arrowIcon) {
          gsap.to(arrowIcon, { rotation: 180, duration: 0.3 });
        }
        
        // Stagger list elements inside
        setTimeout(() => {
          const items = accordionBody?.querySelectorAll('.doc-row-anim');
          if (items && items.length > 0) {
            gsap.fromTo(items,
              { opacity: 0, x: -10 },
              { opacity: 1, x: 0, stagger: 0.04, duration: 0.3 }
            );
          }
        }, 50);

        return [...prev, catId];
      }
    });
  };

  // Drag and Drop Action handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    // Drop physical scale bounce effect
    if (dropZoneRef.current) {
      gsap.fromTo(dropZoneRef.current,
        { scale: 0.96 },
        { scale: 1.04, duration: 0.15, yoyo: true, repeat: 1, ease: 'power2.out' }
      );
    }

    const file = e.dataTransfer.files?.[0];
    if (file) {
      simulateUpload(file.name, file.size);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      simulateUpload(file.name, file.size);
    }
  };

  const simulateUpload = (fileName: string, fileSize: number) => {
    setUploadingFileName(fileName);
    setUploadProgress(0);

    const progressObj = { value: 0 };
    gsap.to(progressObj, {
      value: 100,
      duration: 2.2,
      ease: 'power1.inOut',
      onUpdate: () => {
        setUploadProgress(Math.round(progressObj.value));
      },
      onComplete: () => {
        // Create document object
        const newDoc: DocumentItem = {
          id: `doc_${Date.now()}`,
          name: fileName.replace(/\.[^/.]+$/, "").replace(/_/g, ' '),
          fileName: fileName,
          fileSize: fileSize || 356 * 1024,
          fileType: 'application/pdf',
          uploadedAt: new Date().toISOString(),
          uploadedBy: 'Rajesh Kumar',
          status: 'pending',
          version: 1,
          comments: [],
          url: '#'
        };

        // Append to Financial category by default for prototype simulation
        setCategories(prev => {
          return prev.map(cat => {
            if (cat.id === 'cat_financial') {
              return {
                ...cat,
                uploaded: cat.uploaded + 1,
                pending: cat.pending + 1,
                documents: [newDoc, ...cat.documents]
              };
            }
            return cat;
          });
        });

        triggerToast(`File "${fileName}" uploaded to Financial Vault.`);
        
        setTimeout(() => {
          setUploadProgress(null);
          setUploadingFileName(null);
        }, 800);
      }
    });
  };

  // Real PDF download generation trick
  const triggerDownload = (fileName: string) => {
    triggerToast(`Starting download: ${fileName}`);
    try {
      // Build a simple 1-page valid PDF header structure
      const pdfString = `%PDF-1.4\n%âãÏÓ\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << >> /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 56 >>\nstream\nBT\n/F1 12 Tf\n70 700 Td\n(SME IPO Filing Document - Neha Fashion Private Limited) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000015 00000 n\n0000000068 00000 n\n0000000125 00000 n\n0000000232 00000 n\ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n341\n%%EOF`;
      const blob = new Blob([pdfString], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName.toLowerCase().endsWith('.pdf') ? fileName : `${fileName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Mock download trigger failed', err);
    }
  };

  // Reply submission from Split Viewer
  const handleAddReply = (documentId: string, replyText: string) => {
    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      author: 'Rajesh Kumar (Promoter)',
      text: replyText,
      timestamp: new Date().toISOString(),
      type: 'reply'
    };

    setCategories(prev => {
      return prev.map(cat => {
        const docExists = cat.documents.some(d => d.id === documentId);
        if (docExists) {
          const updatedDocs = cat.documents.map(d => {
            if (d.id === documentId) {
              return {
                ...d,
                status: 'pending' as const, // Change status to pending review
                comments: [...d.comments, newComment]
              };
            }
            return d;
          });

          // Adjust counts
          const prevDoc = cat.documents.find(d => d.id === documentId);
          let newApprovedCount = cat.approved;
          if (prevDoc?.status === 'approved') newApprovedCount--;

          return {
            ...cat,
            approved: newApprovedCount,
            documents: updatedDocs
          };
        }
        return cat;
      });
    });

    // Sync active document inside viewer state
    if (activeCommentDoc && activeCommentDoc.id === documentId) {
      setActiveCommentDoc(prev => {
        if (!prev) return null;
        return {
          ...prev,
          status: 'pending',
          comments: [...prev.comments, newComment]
        };
      });
    }

    triggerToast('Clarification response submitted to SEBI.');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="px-2.5 py-1 rounded-full bg-success-subtle text-success text-xs font-bold border border-success-light/20 uppercase tracking-wide">Approved</span>;
      case 'under_review':
        return <span className="px-2.5 py-1 rounded-full bg-warning/15 text-warning text-xs font-bold border border-warning/20 uppercase tracking-wide animate-pulse">Under Review</span>;
      case 'pending':
        return <span className="px-2.5 py-1 rounded-full bg-primary-subtle text-primary text-xs font-bold border border-primary/20 uppercase tracking-wide">Pending Review</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-bold border border-slate-200 uppercase tracking-wide">Draft</span>;
    }
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'DollarSign': return FileText;
      case 'Scale': return FileCheck;
      case 'Users': return FileText;
      default: return FolderIcon;
    }
  };

  return (
    <div className="space-y-10 pb-12 select-none">
      
      {/* Toast Notification Container */}
      {toastMessage && (
        <div 
          ref={toastRef}
          className="fixed top-6 right-6 bg-slate-900 border border-slate-800 text-white rounded-2xl p-4 shadow-2xl z-50 flex items-center justify-between gap-4 max-w-sm w-full overflow-hidden"
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
            <p className="text-sm font-bold text-slate-100">{toastMessage}</p>
          </div>
          <button 
            onClick={dismissToast}
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          {/* Progress timer bar */}
          <div className="absolute bottom-0 left-0 h-1 bg-primary toast-timer" style={{ width: '100%' }} />
        </div>
      )}

      {/* Summary Card and Upload Area Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Progress summary card */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-default flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800">DRHP Vault Summary</h3>
            <p className="text-xs text-slate-400 mt-1.5">Audit status of mandated IPO annexures</p>
          </div>

          <div className="my-6 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 font-bold uppercase tracking-wide">Verification Rate</span>
              <span className="font-extrabold text-slate-850">{summary.completionPercentage}%</span>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-success rounded-full transition-all duration-500 shimmer-bg"
                style={{ width: `${summary.completionPercentage}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-3 text-center pt-2">
              <div className="p-3 bg-success-subtle/20 border border-success-light/10 rounded-xl">
                <span className="text-2xl font-black text-success block leading-none">{summary.totalApproved}</span>
                <span className="text-[10px] text-slate-500 mt-2 font-bold uppercase block">Approved</span>
              </div>
              <div className="p-3 bg-warning/5 border border-warning/10 rounded-xl">
                <span className="text-2xl font-black text-warning block leading-none">{summary.totalUnderReview}</span>
                <span className="text-[10px] text-slate-500 mt-2 font-bold uppercase block">Queries</span>
              </div>
              <div className="p-3 bg-primary-subtle/10 border border-primary/10 rounded-xl">
                <span className="text-2xl font-black text-primary block leading-none">{summary.totalUploaded}</span>
                <span className="text-[10px] text-slate-500 mt-2 font-bold uppercase block">Uploaded</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-400 font-semibold border-t border-slate-100 pt-3 text-center">
            {summary.totalRequired - summary.totalUploaded} additional documents required to lock submission.
          </div>
        </div>

        {/* Upload Drop Zone Card */}
        <div className="lg:col-span-2 bg-white border border-slate-200 p-6 rounded-2xl shadow-default">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-800">Add Documents</h3>
            <p className="text-xs text-slate-400 mt-1.5">Drag and drop PDF or Image attachments here</p>
          </div>

          <div 
            ref={dropZoneRef}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`drop-zone border-2 border-dashed rounded-2xl p-10 text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
              isDragging 
                ? 'border-primary bg-primary-subtle/25 scale-[1.02]' 
                : 'border-slate-250 hover:border-primary-light/50 bg-slate-50/50 hover:bg-slate-50'
            }`}
          >
            {uploadProgress !== null ? (
              <div className="w-full max-w-xs space-y-4">
                <UploadCloud className="w-12 h-12 text-primary animate-bounce mx-auto" />
                <div>
                  <p className="text-sm font-bold text-slate-700 truncate">Uploading {uploadingFileName}</p>
                  <p className="text-xs text-slate-400 mt-1 font-semibold">{uploadProgress}% complete</p>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full" 
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <label className="cursor-pointer space-y-4 block w-full">
                <UploadCloud className="w-14 h-14 text-slate-350 mx-auto transition-transform hover:scale-110" />
                <div>
                  <p className="text-sm font-bold text-slate-700">Drag files here, or <span className="text-primary hover:underline">browse files</span></p>
                  <p className="text-xs text-slate-400 mt-1.5 font-semibold">Supports PDF, JPG, PNG up to 10MB</p>
                </div>
                <input 
                  type="file" 
                  accept="application/pdf,image/*" 
                  onChange={handleFileSelect} 
                  className="hidden" 
                />
              </label>
            )}
          </div>
        </div>

      </div>

      {/* Categories Accordions Lists */}
      <div className="space-y-6">
        {categories.map((category) => {
          const isExpanded = expandedCategories.includes(category.id);
          const CatIcon = getCategoryIcon(category.icon);

          return (
            <div 
              key={category.id} 
              className="bg-white border border-slate-200 rounded-2xl shadow-default overflow-hidden"
            >
              {/* Accordion Trigger Header */}
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-slate-100 text-slate-600 shrink-0">
                    <CatIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-800">{category.name}</h4>
                    <span className="text-xs text-slate-400 font-bold block mt-1">
                      {category.uploaded} Uploaded • {category.approved} Approved • {category.required} Required
                    </span>
                  </div>
                </div>

                <ChevronDown 
                  id={`acc-arrow-${category.id}`} 
                  className="w-6 h-6 text-slate-400 shrink-0 transform"
                  style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
              </button>

              {/* Accordion Body */}
              <div 
                id={`acc-body-${category.id}`}
                className={`overflow-hidden border-t border-slate-100 ${isExpanded ? 'h-auto opacity-100' : 'h-0 opacity-0'}`}
              >
                <div className="p-5 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="text-slate-455 font-bold border-b border-slate-200">
                        <th className="pb-4 pl-4 text-sm w-[40%]">Document Details</th>
                        <th className="pb-4 text-sm w-[20%]">Uploaded By</th>
                        <th className="pb-4 text-sm w-[15%]">File Specs</th>
                        <th className="pb-4 text-sm text-center w-[13%]">Status</th>
                        <th className="pb-4 text-sm text-right pr-4 w-[12%]">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {category.documents.map((doc) => {
                        const isUnderReview = doc.status === 'under_review';
                        
                        return (
                          <tr key={doc.id} className="doc-row-anim text-slate-700 hover:bg-slate-50/40 transition-colors">
                            <td className="py-5 pl-4 font-bold text-slate-800">
                              <p className="line-clamp-1 text-sm">{doc.name}</p>
                              <span className="text-xs text-slate-400 font-semibold block mt-1">{doc.fileName}</span>
                            </td>
                            <td className="py-5">
                              <p className="font-bold text-slate-750 text-sm">{doc.uploadedBy}</p>
                              <span className="text-xs text-slate-400 font-semibold block mt-1">
                                {new Date(doc.uploadedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                              </span>
                            </td>
                            <td className="py-5 font-semibold text-slate-500 text-sm">
                              {(doc.fileSize / 1024).toFixed(0)} KB • PDF
                            </td>
                            <td className="py-5 text-center">
                              {getStatusBadge(doc.status)}
                            </td>
                            <td className="py-5 text-right pr-4">
                              <div className="flex justify-end gap-3">
                                {isUnderReview ? (
                                  <button
                                    onClick={() => setActiveCommentDoc(doc)}
                                    className="px-3 py-1.5 text-warning hover:bg-warning/5 rounded-xl border border-warning/20 cursor-pointer transition-colors flex items-center gap-1.5 text-xs font-bold shadow-sm"
                                  >
                                    <MessageSquare className="w-4 h-4" />
                                    <span>Resolve Comments ({doc.comments.length})</span>
                                  </button>
                                ) : (
                                  // Enable inline browser for non-review documents too
                                  <button
                                    onClick={() => setActiveCommentDoc(doc)}
                                    className="px-3 py-1.5 text-slate-600 hover:text-primary hover:bg-slate-50 rounded-xl border border-slate-200 cursor-pointer transition-colors flex items-center gap-1.5 text-xs font-bold shadow-sm"
                                  >
                                    <span>Open Viewer</span>
                                  </button>
                                )}
                                <button
                                  onClick={() => triggerDownload(doc.fileName)}
                                  className="p-2 text-slate-500 hover:text-primary hover:bg-slate-50 rounded-xl cursor-pointer transition-colors border border-slate-200"
                                  title="Download Original"
                                >
                                  <Download className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Split Pane PDF Document Viewer */}
      {activeCommentDoc && (
        <SplitDocumentViewer 
          document={activeCommentDoc}
          onClose={() => setActiveCommentDoc(null)}
          onAddReply={handleAddReply}
        />
      )}

    </div>
  );
}
