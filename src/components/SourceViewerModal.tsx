import React from 'react';
import { SourcePage } from '../types';
import { X, BookOpen, CheckCircle, FileText, Bookmark } from 'lucide-react';

interface SourceViewerModalProps {
  page: SourcePage | null;
  onClose: () => void;
}

export const SourceViewerModal: React.FC<SourceViewerModalProps> = ({ page, onClose }) => {
  if (!page) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">{page.bookTitle}</h3>
                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-semibold">
                  Page {page.printedPageNumber}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Combined PDF Page {page.pdfPageNumber} · {page.unitLesson}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Topic header */}
          <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-100">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-900 mb-1">
              <Bookmark className="w-4 h-4 text-amber-600" />
              <span>Learning Topic:</span>
            </div>
            <p className="text-sm font-medium text-slate-800">{page.topic}</p>
          </div>

          {/* Key Keywords */}
          {page.keyWords && page.keyWords.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Key Vocabulary & Skills</h4>
              <div className="flex flex-wrap gap-1.5">
                {page.keyWords.map((kw, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-medium border border-slate-200"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* OCR / Learning Material Excerpt */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Textbook Content & Lesson Material</span>
            </h4>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm leading-relaxed text-slate-700 font-mono whitespace-pre-wrap">
              {page.ocrExcerpt || 'No text content available for this page.'}
            </div>
          </div>

          {/* Verification Badge */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Teacher Confirmed Source Page</span>
            </div>
            <span>Confidence: {page.confidence}%</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
          >
            Close Page View
          </button>
        </div>
      </div>
    </div>
  );
};
