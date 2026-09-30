import React, { useState, useEffect } from 'react';
import { TermData, SourcePage, SubjectId, VerificationStatus } from '../../types';
import { PracticeScopeService } from '../../services/practiceScopeService';
import {
  Check,
  CheckCircle,
  AlertTriangle,
  Eye,
  Plus,
  Trash2,
  Edit3,
  BookOpen,
  Filter,
  Layers,
  HelpCircle,
  RefreshCw,
} from 'lucide-react';
import { SourceViewerModal } from '../SourceViewerModal';
import { StorageService } from '../../services/storageService';

interface PageMappingManagerProps {
  term: TermData;
  onUpdateTerm: (updated: TermData) => void;
}

export const PageMappingManager: React.FC<PageMappingManagerProps> = ({
  term,
  onUpdateTerm,
}) => {
  const isGrade8 = term.grade === 'Grade 8';
  const availableSubjects = PracticeScopeService.getTermSubjects(term).filter(
    (s) => !s.isProjectBased
  );

  const [selectedSubjectId, setSelectedSubjectId] = useState<SubjectId>(
    () => (availableSubjects[0]?.id as SubjectId) || (isGrade8 ? 'english' : 'mathematics')
  );

  // Sync / Reset selectedSubjectId when grade, term, or available subjects change
  useEffect(() => {
    if (!availableSubjects.some((s) => s.id === selectedSubjectId)) {
      setSelectedSubjectId((availableSubjects[0]?.id as SubjectId) || (isGrade8 ? 'english' : 'mathematics'));
    }
  }, [term.grade, term.id, availableSubjects, selectedSubjectId, isGrade8]);

  const [selectedPageForModal, setSelectedPageForModal] = useState<SourcePage | null>(null);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editPrintedPageNum, setEditPrintedPageNum] = useState<string>('');
  const [editPdfPageNum, setEditPdfPageNum] = useState<number>(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  // New page form state
  const [newPageData, setNewPageData] = useState({
    printedPageNumber: '',
    pdfPageNumber: 1,
    bookTitle: '',
    unitLesson: '',
    topic: '',
    ocrExcerpt: '',
    language: 'en' as 'en' | 'zh' | 'km',
  });

  // Auto-sync verified mappings if term has pageIndex and sourcePages is incomplete
  useEffect(() => {
    if (term.pageIndex && term.pageIndex.length > 0) {
      const { updatedTerm, syncedCount } = PracticeScopeService.synchronizeSourcePagesFromPointerMatches(term);
      if (syncedCount > 0) {
        StorageService.updateTerm(updatedTerm);
        onUpdateTerm(updatedTerm);
      }
    }
  }, [term.grade, term.id, term.pageIndex]);

  const handleManualSync = () => {
    const { updatedTerm, syncedCount } = PracticeScopeService.synchronizeSourcePagesFromPointerMatches(term);
    if (syncedCount > 0) {
      StorageService.updateTerm(updatedTerm);
      onUpdateTerm(updatedTerm);
      setSyncFeedback(`Synchronized ${syncedCount} verified pages from Multi-Subject Source Detection!`);
    } else {
      setSyncFeedback('All source pages are already 100% synchronized with Source Detection.');
    }
    setTimeout(() => setSyncFeedback(null), 3500);
  };

  const currentSubject =
    availableSubjects.find((s) => s.id === selectedSubjectId) || availableSubjects[0];
  const pointerItem = term.pointer.items.find((i) => i.subjectId === selectedSubjectId);

  // Filter source pages for this subject using canonical scope service
  const subjectPages = PracticeScopeService.getScopedSourcePages(term, selectedSubjectId);

  // Status updates
  const handleUpdateStatus = (pageId: string, status: VerificationStatus) => {
    const updatedPages = term.sourcePages.map((p) =>
      p.id === pageId ? { ...p, status } : p
    );
    const updatedTerm = { ...term, sourcePages: updatedPages };
    StorageService.updateTerm(updatedTerm);
    onUpdateTerm(updatedTerm);
  };

  const handleStartEdit = (page: SourcePage) => {
    setEditingPageId(page.id);
    setEditPrintedPageNum(String(page.printedPageNumber));
    setEditPdfPageNum(page.pdfPageNumber);
  };

  const handleSaveEdit = (pageId: string) => {
    const updatedPages = term.sourcePages.map((p) =>
      p.id === pageId
        ? {
            ...p,
            printedPageNumber: isNaN(Number(editPrintedPageNum))
              ? editPrintedPageNum
              : Number(editPrintedPageNum),
            pdfPageNumber: editPdfPageNum,
            status: 'confirmed' as VerificationStatus,
          }
        : p
    );
    const updatedTerm = { ...term, sourcePages: updatedPages };
    StorageService.updateTerm(updatedTerm);
    onUpdateTerm(updatedTerm);
    setEditingPageId(null);
  };

  const handleAddNewPage = () => {
    if (!newPageData.printedPageNumber || !newPageData.topic) return;

    const newPage: SourcePage = {
      id: `sp-${Date.now()}`,
      subjectId: selectedSubjectId,
      printedPageNumber: isNaN(Number(newPageData.printedPageNumber))
        ? newPageData.printedPageNumber
        : Number(newPageData.printedPageNumber),
      pdfPageNumber: Number(newPageData.pdfPageNumber),
      bookTitle: newPageData.bookTitle || currentSubject.bookTitle,
      unitLesson: newPageData.unitLesson || 'Added Lesson',
      topic: newPageData.topic,
      language: newPageData.language || currentSubject.language,
      ocrExcerpt: newPageData.ocrExcerpt,
      keyWords: [],
      status: 'confirmed',
      confidence: 100,
    };

    const updatedTerm = {
      ...term,
      sourcePages: [...term.sourcePages, newPage],
    };
    StorageService.updateTerm(updatedTerm);
    onUpdateTerm(updatedTerm);
    setIsAddModalOpen(false);
    setNewPageData({
      printedPageNumber: '',
      pdfPageNumber: 1,
      bookTitle: '',
      unitLesson: '',
      topic: '',
      ocrExcerpt: '',
      language: 'en',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 inline-block mb-1">
            Stage 2 · Source-to-Practice Verification
          </span>
          <h2 className="text-xl font-bold text-slate-900">
            Exam Pointer ↔ Combined PDF Page Mapping
          </h2>
          <p className="text-xs text-slate-500">
            Never assume PDF page number = printed textbook page number. Every page must be teacher-verified before question generation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {syncFeedback && (
            <span className="text-xs font-semibold text-emerald-600 animate-pulse bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              {syncFeedback}
            </span>
          )}

          {term.pageIndex && term.pageIndex.length > 0 && (
            <button
              onClick={handleManualSync}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl border border-slate-300 transition-colors"
              title="Synchronize confirmed mappings from Multi-Subject Source Detection"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync from Source Detection</span>
            </button>
          )}

          <button
            onClick={() => {
              setNewPageData((prev) => ({
                ...prev,
                bookTitle: currentSubject.bookTitle,
                language: currentSubject.language,
              }));
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Source Page</span>
          </button>
        </div>
      </div>

      {/* Subject Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {availableSubjects.map((sub) => {
          const count = PracticeScopeService.getScopedSourcePages(term, sub.id).filter(
            (p) => p.status === 'confirmed'
          ).length;
          const isSelected = selectedSubjectId === sub.id;

          return (
            <button
              key={sub.id}
              onClick={() => setSelectedSubjectId(sub.id)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap border transition-all flex items-center gap-2 ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              <span>{sub.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Subject Scope Overview Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-bold text-slate-900">{currentSubject.name}</h3>
            <span className="text-xs text-slate-500 font-mono">({currentSubject.bookTitle})</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="font-bold text-slate-800">Exam Pointer Required Pages:</span>
            <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 font-semibold text-indigo-700">
              {pointerItem?.pagesDescription || 'No requirement specified'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>
              {subjectPages.filter((p) => p.status === 'confirmed').length} Confirmed
            </span>
          </div>
          {subjectPages.some((p) => p.status === 'needs_verification') && (
            <div className="flex items-center gap-1.5 text-amber-700 font-medium bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>
                {subjectPages.filter((p) => p.status === 'needs_verification').length} Needs Verification
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Mappings Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-5">Printed Textbook Page</th>
                <th className="py-3 px-5">Combined PDF Page</th>
                <th className="py-3 px-6">Topic / Lesson Content</th>
                <th className="py-3 px-5 text-center">Status</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {subjectPages.length > 0 ? (
                subjectPages.map((page) => {
                  const isEditing = editingPageId === page.id;

                  return (
                    <tr key={page.id} className="hover:bg-slate-50/70">
                      <td className="py-3.5 px-5">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editPrintedPageNum}
                            onChange={(e) => setEditPrintedPageNum(e.target.value)}
                            className="w-24 px-2 py-1 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-xs">
                              Page {page.printedPageNumber}
                            </span>
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-5">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editPdfPageNum}
                            onChange={(e) => setEditPdfPageNum(Number(e.target.value))}
                            className="w-20 px-2 py-1 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                          />
                        ) : (
                          <span className="font-mono text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                            PDF p. {page.pdfPageNumber}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-6">
                        <span className="font-semibold text-slate-800 block text-xs">
                          {page.unitLesson}
                        </span>
                        <span className="text-xs text-slate-500 line-clamp-1">
                          {page.topic}
                        </span>
                      </td>

                      <td className="py-3.5 px-5 text-center">
                        {page.status === 'confirmed' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            <Check className="w-3 h-3" />
                            <span>CONFIRMED ✓</span>
                          </span>
                        ) : page.status === 'needs_verification' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                            <AlertTriangle className="w-3 h-3" />
                            <span>NEEDS VERIFICATION</span>
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Excluded</span>
                        )}
                      </td>

                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Source Button */}
                          <button
                            onClick={() => setSelectedPageForModal(page)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                            title="Inspect Page Source & OCR"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Quick Confirm Button */}
                          {page.status !== 'confirmed' && (
                            <button
                              onClick={() => handleUpdateStatus(page.id, 'confirmed')}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                            >
                              Confirm
                            </button>
                          )}

                          {/* Edit Mapping Button */}
                          {isEditing ? (
                            <button
                              onClick={() => handleSaveEdit(page.id)}
                              className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold"
                            >
                              Save
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStartEdit(page)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                              title="Change Mapping"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          )}

                          {/* Exclude / Include toggle */}
                          {page.status === 'excluded' ? (
                            <button
                              onClick={() => handleUpdateStatus(page.id, 'confirmed')}
                              className="p-1.5 text-xs text-indigo-600 hover:underline"
                            >
                              Include
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUpdateStatus(page.id, 'excluded')}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Exclude Page"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-xs text-slate-400">
                    No source pages mapped yet for this subject. Use "Add Custom Source Page" to link pages.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Page Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Add Source Page Mapping ({currentSubject.name})
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Map a required printed textbook page to the corresponding PDF scan page.
            </p>

            <div className="space-y-3 mb-6">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Printed Textbook Page #
                  </label>
                  <input
                    type="text"
                    value={newPageData.printedPageNumber}
                    onChange={(e) =>
                      setNewPageData({ ...newPageData, printedPageNumber: e.target.value })
                    }
                    placeholder="e.g. 14"
                    className="w-full text-xs p-2.5 border rounded-xl focus:border-indigo-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Combined PDF Page #
                  </label>
                  <input
                    type="number"
                    value={newPageData.pdfPageNumber}
                    onChange={(e) =>
                      setNewPageData({
                        ...newPageData,
                        pdfPageNumber: Number(e.target.value),
                      })
                    }
                    placeholder="e.g. 2"
                    className="w-full text-xs p-2.5 border rounded-xl focus:border-indigo-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Book Title</label>
                <input
                  type="text"
                  value={newPageData.bookTitle}
                  onChange={(e) =>
                    setNewPageData({ ...newPageData, bookTitle: e.target.value })
                  }
                  className="w-full text-xs p-2.5 border rounded-xl focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Unit / Lesson Title
                </label>
                <input
                  type="text"
                  value={newPageData.unitLesson}
                  onChange={(e) =>
                    setNewPageData({ ...newPageData, unitLesson: e.target.value })
                  }
                  placeholder="e.g. 1B Comparing 3-digit numbers"
                  className="w-full text-xs p-2.5 border rounded-xl focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Learning Topic</label>
                <input
                  type="text"
                  value={newPageData.topic}
                  onChange={(e) =>
                    setNewPageData({ ...newPageData, topic: e.target.value })
                  }
                  placeholder="e.g. Ordering 3-digit numbers using number lines"
                  className="w-full text-xs p-2.5 border rounded-xl focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Page Content / OCR Notes
                </label>
                <textarea
                  rows={3}
                  value={newPageData.ocrExcerpt}
                  onChange={(e) =>
                    setNewPageData({ ...newPageData, ocrExcerpt: e.target.value })
                  }
                  placeholder="Paste or type text excerpt from this page..."
                  className="w-full text-xs p-2.5 border rounded-xl focus:border-indigo-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 font-semibold text-xs text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNewPage}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shadow-sm"
              >
                Confirm & Add Mapping
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Source Viewer Modal */}
      <SourceViewerModal
        page={selectedPageForModal}
        onClose={() => setSelectedPageForModal(null)}
      />
    </div>
  );
};
