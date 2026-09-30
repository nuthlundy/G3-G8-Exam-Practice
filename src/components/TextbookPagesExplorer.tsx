import React, { useState } from 'react';
import { TermData, SubjectId, SourcePage } from '../types';
import { PracticeScopeService } from '../services/practiceScopeService';
import { BookOpen, Search, Eye, Filter, CheckCircle, ExternalLink } from 'lucide-react';
import { SourceViewerModal } from './SourceViewerModal';

interface TextbookPagesExplorerProps {
  term: TermData;
}

export const TextbookPagesExplorer: React.FC<TextbookPagesExplorerProps> = ({ term }) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<SubjectId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPageForModal, setSelectedPageForModal] = useState<SourcePage | null>(null);

  const availableSubjects = PracticeScopeService.getTermSubjects(term).filter((s) => !s.isProjectBased);

  const scopedPages = PracticeScopeService.getScopedSourcePages(
    term,
    selectedSubjectId === 'all' ? undefined : selectedSubjectId
  );

  const filteredPages = scopedPages.filter((page) => {
    const matchSearch =
      searchQuery === '' ||
      page.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.ocrExcerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(page.printedPageNumber).includes(searchQuery) ||
      String(page.pdfPageNumber).includes(searchQuery);
    return matchSearch;
  });

  const totalAllCount = PracticeScopeService.getScopedSourcePages(term).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 inline-block mb-1">
            Authoritative Textbook Learning Material
          </span>
          <h2 className="text-xl font-bold text-slate-900">
            Combined PDF & Textbook Pages Explorer ({term.name})
          </h2>
          <p className="text-xs text-slate-500">
            Review textbook pages mapped from the school’s photographed/scanned source PDF for {term.grade || 'Grade 3'}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topic or page..."
              className="text-xs pl-9 pr-3 py-2 border rounded-xl focus:border-amber-500 focus:outline-none w-48 sm:w-64"
            />
          </div>
        </div>
      </div>

      {/* Filter by subject */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedSubjectId('all')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap border transition-all ${
            selectedSubjectId === 'all'
              ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
          }`}
        >
          All Subjects ({totalAllCount})
        </button>

        {availableSubjects.map((sub) => {
          const isSelected = selectedSubjectId === sub.id;
          const count = PracticeScopeService.getScopedSourcePages(term, sub.id).length;

          return (
            <button
              key={sub.id}
              onClick={() => setSelectedSubjectId(sub.id)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap border transition-all flex items-center gap-1.5 ${
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

      {/* Pages Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPages.map((page) => {
          const sub = availableSubjects.find((s) => s.id === page.subjectId);

          return (
            <div
              key={page.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-amber-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    {sub?.name}
                  </span>
                  <div className="flex items-center gap-1.5 font-mono text-xs">
                    <span className="bg-amber-50 text-amber-900 font-bold px-2 py-0.5 rounded border border-amber-200">
                      Page {page.printedPageNumber}
                    </span>
                    <span className="text-slate-400 text-[11px]">PDF p.{page.pdfPageNumber}</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mb-1 line-clamp-1">{page.topic}</h3>
                <p className="text-xs text-slate-500 mb-3">{page.unitLesson}</p>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 line-clamp-3 mb-4 font-mono">
                  {page.ocrExcerpt || 'Textbook lesson excerpt available.'}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Verified Page</span>
                </span>

                <button
                  onClick={() => setSelectedPageForModal(page)}
                  className="flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Page</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <SourceViewerModal
        page={selectedPageForModal}
        onClose={() => setSelectedPageForModal(null)}
      />
    </div>
  );
};
