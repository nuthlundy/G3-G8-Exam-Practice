import React, { useState } from 'react';
import { ExamPointer, ExamPointerItem, SubjectId, TermData } from '../../types';
import { FileText, Plus, Check, Edit2, ShieldAlert, Sparkles, Upload } from 'lucide-react';
import { StorageService } from '../../services/storageService';

interface PointerManagerProps {
  term: TermData;
  onUpdateTerm: (updated: TermData) => void;
}

export const PointerManager: React.FC<PointerManagerProps> = ({ term, onUpdateTerm }) => {
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [editPagesText, setEditPagesText] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [rawPointerText, setRawPointerText] = useState('');

  const pointer = term.pointer;
  const items = pointer.items || [];
  const totalSubjects = items.length;
  const projectBasedItems = items.filter((item) => item.isProjectBased);
  const pageBasedItems = items.filter((item) => !item.isProjectBased);
  const projectCount = projectBasedItems.length;
  const pageBasedCount = pageBasedItems.length;

  // Detect any additional content-based scope attached to page-based subjects
  const contentScopeCount = pageBasedItems.filter((item) =>
    item.requiredPrintedPages.some(
      (p) =>
        typeof p === 'string' &&
        (p.includes('SCOPE') || p.includes('CONTENT') || p.includes('UNRESOLVED'))
    )
  ).length;

  const scopeSummaryText =
    contentScopeCount > 0
      ? `${totalSubjects} Total Subjects (${pageBasedCount} page-based/testable + ${contentScopeCount} content-based scope; ${projectCount} project-based excluded)`
      : `${totalSubjects} Total Subjects (${pageBasedCount} page-based/testable; ${projectCount} project-based excluded)`;

  const handleStartEdit = (index: number) => {
    setEditingItemIndex(index);
    setEditPagesText(pointer.items[index].pagesDescription);
  };

  const handleSaveEdit = (index: number) => {
    const updatedItems = [...pointer.items];
    const target = updatedItems[index];

    // Parse numbers from the text
    const extractedNums = (editPagesText.match(/\d+/g) || []).map(Number);

    target.pagesDescription = editPagesText;
    if (!target.isProjectBased) {
      target.requiredPrintedPages = extractedNums;
    }

    const updatedTerm: TermData = {
      ...term,
      pointer: {
        ...pointer,
        items: updatedItems,
      },
    };

    StorageService.updateTerm(updatedTerm);
    onUpdateTerm(updatedTerm);
    setEditingItemIndex(null);
  };

  const handleImportTextPointer = () => {
    if (!rawPointerText.trim()) return;

    // Parse lines from raw pointer
    const lines = rawPointerText.split('\n');
    const updatedItems = [...pointer.items];

    lines.forEach((line) => {
      const lower = line.toLowerCase();
      updatedItems.forEach((item) => {
        if (lower.includes(item.subjectName.toLowerCase()) || lower.includes(item.subjectId)) {
          const numbers = (line.match(/\d+/g) || []).map(Number);
          if (numbers.length > 0 && !item.isProjectBased) {
            item.requiredPrintedPages = numbers;
            item.pagesDescription = line.trim();
          }
        }
      });
    });

    const updatedTerm: TermData = {
      ...term,
      pointer: {
        ...pointer,
        items: updatedItems,
      },
    };

    StorageService.updateTerm(updatedTerm);
    onUpdateTerm(updatedTerm);
    setIsUploadModalOpen(false);
    setRawPointerText('');
  };

  return (
    <div className="space-y-6">
      {/* Scope banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <span className="font-bold text-slate-900">{pointer.schoolName}</span>
            <span>·</span>
            <span>Issued Date: {pointer.issuedDate}</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            {pointer.term} Exam Pointer ({term.academicYear})
          </h2>
          <p className="text-xs text-slate-500">
            The Exam Pointer is the authoritative source defining the required curriculum pages for each subject.
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs rounded-xl border border-indigo-200 transition-colors"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Import / Update Pointer Text</span>
        </button>
      </div>

      {/* Pointer Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h3 className="text-sm font-bold text-slate-800">Authoritative Subject Exam Scope</h3>
          <span className="text-xs text-slate-500 font-medium">
            {scopeSummaryText}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/70 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-12 text-center">No.</th>
                <th className="py-3 px-6">Subject</th>
                <th className="py-3 px-6">Authoritative Exam Pages</th>
                <th className="py-3 px-6">Parsed Printed Pages</th>
                <th className="py-3 px-6 text-center">Assessment Mode</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {pointer.items.map((item, idx) => (
                <tr
                  key={item.subjectId}
                  className={item.isProjectBased ? 'bg-slate-50/40 text-slate-400' : 'hover:bg-slate-50/60'}
                >
                  <td className="py-3.5 px-4 text-center font-mono text-xs font-bold text-slate-500">
                    {item.no}
                  </td>
                  <td className="py-3.5 px-6 font-semibold text-slate-900">
                    {item.subjectName}
                  </td>
                  <td className="py-3.5 px-6">
                    {editingItemIndex === idx ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editPagesText}
                          onChange={(e) => setEditPagesText(e.target.value)}
                          className="px-2.5 py-1 text-xs border border-indigo-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full"
                        />
                        <button
                          onClick={() => handleSaveEdit(idx)}
                          className="p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className={item.isProjectBased ? 'text-slate-400 italic' : 'text-slate-800'}>
                        {item.pagesDescription}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-6 font-mono text-xs">
                    {item.isProjectBased ? (
                       <span className="text-slate-400">None (Project)</span>
                    ) : item.requiredPrintedPages.length > 0 ? (
                       <span className="text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-semibold">
                         {item.requiredPrintedPages.join(', ')}
                       </span>
                    ) : item.subjectId === 'kh_calligraphy' ? (
                       <span className="text-purple-700 bg-purple-50 px-2 py-0.5 rounded font-semibold">
                         Content Scope (អក្សរមូល ម, ម្ដាយ)
                       </span>
                    ) : (
                       <span className="text-amber-600">Pending setup</span>
                    )}
                  </td>
                  <td className="py-3.5 px-6 text-center">
                    {item.isProjectBased ? (
                       <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded-full">
                         <ShieldAlert className="w-3 h-3 text-slate-400" />
                         <span>Project-Based (Excluded)</span>
                       </span>
                    ) : item.subjectId === 'kh_calligraphy' ? (
                       <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                         <span>Content Scope</span>
                       </span>
                    ) : (
                       <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                         <span>Page-Based Test</span>
                       </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleStartEdit(idx)}
                      className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900 transition-colors"
                      title="Edit Pointer Pages"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload / Paste Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Import / Update Exam Pointer</h3>
            <p className="text-xs text-slate-500 mb-4">
              Paste the text from your school Exam Pointer notice or OCR scan. The system will automatically map the subjects to their required printed pages.
            </p>

            <textarea
              rows={8}
              value={rawPointerText}
              onChange={(e) => setRawPointerText(e.target.value)}
              placeholder="e.g.&#10;English: WB Pages 3, 6, 14, 23 and 35&#10;Mathematics: Pages 14, 15, 16, 41, 44, 52, 54, 56&#10;Science: Pages 8, 24, 26, 27, 28, 29, 30, 31, 32&#10;Chinese - GO200: Page 1-24"
              className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-500 mb-4"
            />

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 font-semibold text-xs text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleImportTextPointer}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shadow-sm"
              >
                Parse & Update Pointer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
