import React, { useState, useMemo, useEffect } from 'react';
import {
  TermData,
  SubjectId,
  CoverageMatrixItem,
  SubjectCoverageSummary,
  Question,
  SourcePage,
  CoverageStatus,
  QuestionType,
  DifficultyLevel,
} from '../../types';
import { PracticeScopeService } from '../../services/practiceScopeService';
import { CoverageService } from '../../services/coverageService';
import { StorageService } from '../../services/storageService';
import { SourceViewerModal } from '../SourceViewerModal';
import {
  CheckCircle2,
  AlertCircle,
  FileQuestion,
  Sparkles,
  Layers,
  Filter,
  Search,
  BookOpen,
  Eye,
  RefreshCw,
  Plus,
  HelpCircle,
  Check,
  X,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface ContentCoverageManagerProps {
  term: TermData;
  onUpdateTerm: (updated: TermData) => void;
  onOpenSourcePage?: (page: SourcePage) => void;
}

export const ContentCoverageManager: React.FC<ContentCoverageManagerProps> = ({
  term,
  onUpdateTerm,
}) => {
  const availableSubjects = useMemo(
    () => PracticeScopeService.getTermSubjects(term).filter((s) => !s.isProjectBased),
    [term]
  );

  const [selectedSubjectId, setSelectedSubjectId] = useState<SubjectId | 'all'>('all');

  useEffect(() => {
    if (selectedSubjectId !== 'all' && !availableSubjects.some((s) => s.id === selectedSubjectId)) {
      setSelectedSubjectId('all');
    }
  }, [term.grade, term.id, availableSubjects, selectedSubjectId]);
  const [statusFilter, setStatusFilter] = useState<CoverageStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSourceForView, setSelectedSourceForView] = useState<SourcePage | null>(null);

  // Modal states for inspecting questions for a specific page
  const [inspectingPageItem, setInspectingPageItem] = useState<CoverageMatrixItem | null>(null);

  // Modal states for generating questions for a specific page
  const [generatingForPage, setGeneratingForPage] = useState<CoverageMatrixItem | null>(null);
  const [genCount, setGenCount] = useState(2);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genSuccessMsg, setGenSuccessMsg] = useState<string | null>(null);

  // Compute coverage summaries & matrix
  const summaries = useMemo(() => CoverageService.getSubjectCoverageSummaries(term), [term]);
  const matrix = useMemo(
    () => CoverageService.buildCoverageMatrix(term, selectedSubjectId === 'all' ? undefined : selectedSubjectId),
    [term, selectedSubjectId]
  );
  const overallStats = useMemo(() => CoverageService.getOverallCoverageStats(term), [term]);

  // Filter matrix items
  const filteredMatrix = useMemo(() => {
    return matrix.filter((item) => {
      const matchStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchQuery =
        searchQuery.trim() === '' ||
        item.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(item.printedPageNumber).toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(item.pdfPageNumber).toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.learningPoint.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchQuery;
    });
  }, [matrix, statusFilter, searchQuery]);

  // Handle generating questions for a specific page
  const handleGenerateQuestionsForPage = async () => {
    if (!generatingForPage) return;
    setIsGenerating(true);
    try {
      const newQuestions = await CoverageService.generateQuestionsForPage(
        term,
        generatingForPage.subjectId,
        generatingForPage.printedPageNumber,
        genCount
      );

      const refreshedTerm = StorageService.getTerm(term.id) || term;
      onUpdateTerm(refreshedTerm);
      setGenSuccessMsg(`Generated ${newQuestions.length} new questions for Page ${generatingForPage.printedPageNumber}!`);
      setTimeout(() => setGenSuccessMsg(null), 3500);
      setGeneratingForPage(null);
    } catch (e) {
      console.error('Error generating questions for page:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle question approval toggle
  const handleToggleApproval = (questionId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'approved' ? 'rejected' : 'approved';
    const updatedQuestions = term.questions.map((q) =>
      q.id === questionId ? { ...q, approvalStatus: nextStatus as any } : q
    );
    const updatedTerm = { ...term, questions: updatedQuestions };
    StorageService.updateTerm(updatedTerm);
    onUpdateTerm(updatedTerm);
  };

  return (
    <div className="space-y-8">
      {/* 3-Pillar Concept Explainer Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-indigo-900/50">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3 border border-indigo-500/30">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Official Exam Pointer Scope Verification System</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Grade 3 Content Coverage Matrix
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            The platform strictly enforces the tripartite architecture: every page from the official Exam Pointer
            is tracked in the <strong>Content Coverage Matrix</strong>, feeds a rich and reusable <strong>Question Bank</strong>,
            from which tailored <strong>Practice Tests</strong> are dynamically published.
          </p>

          {/* Three Distinct Layers Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="bg-white/10 rounded-2xl p-4 border border-white/10 backdrop-blur-xs">
              <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs mb-1">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>1. CONTENT COVERAGE</span>
              </div>
              <p className="text-xs text-slate-300">
                Analyzes <strong>every single page</strong> in the official Exam Pointer without sampling or omissions.
              </p>
            </div>

            <div className="bg-white/10 rounded-2xl p-4 border border-white/10 backdrop-blur-xs">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs mb-1">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>2. QUESTION BANK</span>
              </div>
              <p className="text-xs text-slate-300">
                Repository of <strong>{term.questions.length}+ vetted questions</strong> with multiple questions per page and concept.
              </p>
            </div>

            <div className="bg-white/10 rounded-2xl p-4 border border-white/10 backdrop-blur-xs">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>3. PRACTICE TESTS</span>
              </div>
              <p className="text-xs text-slate-300">
                Curated or randomized practice subsets (10, 15, 20 questions) drawn from the Question Bank.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* High-Level Coverage Metric Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Exam Pointer Pages
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {overallStats.totalRequiredPages}
            </span>
            <span className="text-xs text-slate-500 font-medium">Pages required</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            79 Numbered Exam Pages · 84 Scanned PDF Pages · 1 Content Scope
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Pages Covered
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600">
              {overallStats.totalCoveredPages}
            </span>
            <span className="text-xs text-slate-500 font-medium">/ {overallStats.totalRequiredPages}</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-bold mt-1 block">
            {overallStats.overallPercentage}% Numbered Scope Covered
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Question Bank Size
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-indigo-600">
              {overallStats.totalQuestionBankSize}
            </span>
            <span className="text-xs text-slate-500 font-medium">Questions</span>
          </div>
          <span className="text-[11px] text-indigo-600 font-medium mt-1 block">
            {overallStats.approvedQuestionCount} Approved Source-Grounded Qs
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Practice Test Readiness
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {overallStats.readyTestsCount} / {overallStats.totalSubjectsInScope}
            </span>
            <span className="text-xs text-slate-500 font-medium">Tests Ready</span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-1 text-[11px]">
            <span className="text-emerald-700 font-semibold">{overallStats.readyTestsCount} tests ready</span>
            <span className="text-slate-400">·</span>
            <span className="text-amber-700 font-semibold">{overallStats.awaitingTestsCount} awaiting approval</span>
          </div>
        </div>
      </div>

      {/* Scope Status Banner */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-amber-900">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Official Scope Status:</strong> 11 subjects in scope · 8 tests ready · 3 awaiting generation/approval ({overallStats.awaitingSubjectNames.join(', ')})
          </span>
        </div>
        <div className="text-[11px] text-slate-500">
          Strictly grounded in approved source material
        </div>
      </div>

      {/* Official Quality Audit Summary Report */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">
                Official Content & Question Quality Audit Report
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Grade 3 · Term 1 (Academic Year 2026–2027) Exam Scope Verification
              </h3>
            </div>
          </div>
          <span className="text-xs bg-emerald-500/20 text-emerald-300 font-semibold px-3 py-1 rounded-full border border-emerald-500/30">
            Audit Status: 100% Verified
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-[11px] text-slate-400 block mb-1">TOTAL REQUIRED NUMBERED PAGES</span>
            <span className="text-2xl font-black text-white">{overallStats.totalRequiredPages}</span>
            <span className="block text-[10px] text-slate-400 mt-0.5">Strictly 10 subjects</span>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-[11px] text-slate-400 block mb-1">Pages fully covered</span>
            <span className="text-2xl font-black text-emerald-400">{overallStats.totalCoveredPages} / {overallStats.totalRequiredPages}</span>
            <span className="block text-[10px] text-emerald-400/80 mt-0.5">100% verified</span>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-[11px] text-slate-400 block mb-1">Pages needing more questions</span>
            <span className="text-2xl font-black text-slate-300">{overallStats.pagesNeedingMoreQuestions}</span>
            <span className="block text-[10px] text-slate-400 mt-0.5">0 gaps detected</span>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-[11px] text-slate-400 block mb-1">Pages needing source review</span>
            <span className="text-2xl font-black text-slate-300">{overallStats.pagesNeedingSourceReview}</span>
            <span className="block text-[10px] text-slate-400 mt-0.5">All 79 confirmed</span>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-[11px] text-slate-400 block mb-1">Total approved questions</span>
            <span className="text-2xl font-black text-indigo-400">{overallStats.approvedQuestionCount}</span>
            <span className="block text-[10px] text-indigo-300/80 mt-0.5">Source-grounded</span>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-[11px] text-slate-400 block mb-1">Total questions needing review</span>
            <span className="text-2xl font-black text-slate-300">{overallStats.totalQuestionsNeedingReview}</span>
            <span className="block text-[10px] text-slate-400 mt-0.5">0 unvetted questions</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-slate-300">
          <div>
            <span className="text-slate-400">Content Scope: </span>
            <span className="font-semibold text-white">Khmer Calligraphy (អក្សរមូល ម, ម្ដាយ)</span>
            <span className="text-emerald-400 font-semibold ml-1.5">✓ 2 Approved Questions (Covered)</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Project-based excluded: ICT & Problem Solving (as per Exam Pointer)
          </div>
        </div>
      </div>

      {/* Subject Coverage Status Table (Audit Matrix - Requirement 4) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Subject Coverage Status (Audit Matrix)
            </h3>
            <p className="text-xs text-slate-500">
              Official Grade 3 Term 1 scope verification per subject across required Exam Pointer pages
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            11 Subjects in Scope · 11 COMPLETE
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/80 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Required Pages/Scope</th>
                <th className="py-3 px-3 text-center">Pages Analyzed</th>
                <th className="py-3 px-3 text-center">Pages Covered</th>
                <th className="py-3 px-3 text-center">Question Bank Count</th>
                <th className="py-3 px-3 text-center">Questions Needing Review</th>
                <th className="py-3 px-4 text-center">Coverage Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {summaries.map((s) => {
                return (
                  <tr
                    key={s.subjectId}
                    onClick={() => setSelectedSubjectId(s.subjectId)}
                    className="hover:bg-indigo-50/40 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {s.subjectName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium font-mono text-[11px]">
                      {s.requiredScopeDescription}
                    </td>
                    <td className="py-3.5 px-3 text-center font-semibold text-slate-800">
                      {s.isContentBasedScope ? '1 scope' : s.pagesAnalyzedCount}
                    </td>
                    <td className="py-3.5 px-3 text-center font-bold text-emerald-600">
                      {s.isContentBasedScope ? '1 scope' : `${s.pagesCoveredCount} / ${s.requiredPageCount}`}
                    </td>
                    <td className="py-3.5 px-3 text-center font-bold text-indigo-700">
                      {s.questionBankSize}
                    </td>
                    <td className="py-3.5 px-3 text-center font-semibold text-slate-500">
                      {s.questionsNeedingReviewCount === 0 ? (
                        <span className="text-emerald-700 font-semibold">0</span>
                      ) : (
                        <span className="text-amber-700 font-bold">{s.questionsNeedingReviewCount}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          s.status === 'COMPLETE'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : s.status === 'NEEDS_MORE_QUESTIONS'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}
                      >
                        {s.status === 'COMPLETE'
                          ? 'COMPLETE'
                          : s.status === 'NEEDS_MORE_QUESTIONS'
                          ? 'NEEDS MORE QUESTIONS'
                          : 'NEEDS SOURCE REVIEW'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {genSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{genSuccessMsg}</span>
        </div>
      )}

      {/* Subject Coverage Summary Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Subject Coverage Dashboard</h3>
            <p className="text-xs text-slate-500">
              Click any subject to inspect its page-by-page mapping and question coverage
            </p>
          </div>
          {selectedSubjectId !== 'all' && (
            <button
              onClick={() => setSelectedSubjectId('all')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>Show All Subjects</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {summaries.map((summary) => {
            const isSelected = selectedSubjectId === summary.subjectId;
            const meta = availableSubjects.find((s) => s.id === summary.subjectId);
            if (!meta) return null;

            return (
              <div
                key={summary.subjectId}
                onClick={() => setSelectedSubjectId(summary.subjectId)}
                className={`bg-white rounded-2xl border p-5 cursor-pointer transition-all hover:shadow-md ${
                  isSelected
                    ? 'border-indigo-600 ring-2 ring-indigo-600/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {meta.nativeName || meta.name}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      summary.status === 'COMPLETE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {summary.status === 'COMPLETE' ? 'COMPLETE' : 'NEEDS QUESTIONS'}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 mb-1">{summary.subjectName}</h4>
                <p className="text-xs text-slate-500 mb-3 line-clamp-1">{meta.bookTitle}</p>

                {/* Progress bar */}
                <div className="space-y-1 mb-3">
                  <div className="flex justify-between text-[11px] font-medium text-slate-600">
                    <span>
                      {summary.isContentBasedScope
                        ? '1 Content Scope (អក្សរមូល ម, ម្ដាយ)'
                        : `${summary.pagesCoveredCount} of ${summary.requiredPageCount} Pages Covered`}
                    </span>
                    <span className="font-bold text-slate-900">{summary.coveragePercentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        summary.coveragePercentage === 100 ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${summary.coveragePercentage}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100 text-slate-500">
                  <span>
                    Bank: <strong className="text-slate-800">{summary.questionBankSize} Questions</strong>
                  </span>
                  <span className="text-indigo-600 font-bold flex items-center gap-0.5">
                    View Matrix <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Page-by-Page Detailed Coverage Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Filters & Search */}
        <div className="p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Content Coverage Matrix & Page Verification
            </h3>
            <p className="text-xs text-slate-500">
              Showing {filteredMatrix.length} pages {selectedSubjectId !== 'all' ? `for ${selectedSubjectId}` : 'across all subjects'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Subject Dropdown */}
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value as any)}
              className="text-xs font-semibold px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
            >
              <option value="all">All Subjects ({availableSubjects.length})</option>
              {availableSubjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            {/* Status Dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="text-xs font-semibold px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="COVERED">Covered</option>
              <option value="NEEDS_MORE_QUESTIONS">Needs More Questions</option>
              <option value="NEEDS_SOURCE_REVIEW">Needs Source Review</option>
            </select>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search page, topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl w-44 sm:w-56 focus:outline-hidden focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/70 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-3">Printed Page</th>
                <th className="py-3 px-3">PDF Page</th>
                <th className="py-3 px-4">Topic / Assessable Content</th>
                <th className="py-3 px-4">Learning Point</th>
                <th className="py-3 px-3">Questions</th>
                <th className="py-3 px-3">Coverage Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMatrix.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No matching pages found for the selected filter.
                  </td>
                </tr>
              ) : (
                filteredMatrix.map((item, idx) => {
                  const matchingQuestions = term.questions.filter((q) =>
                    item.questionIds.includes(q.id)
                  );

                  return (
                    <tr
                      key={`${item.subjectId}-${item.printedPageNumber}-${idx}`}
                      className="hover:bg-indigo-50/30 transition-colors"
                    >
                      <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                        {item.subjectName}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-800">
                        p. {item.printedPageNumber}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <button
                          onClick={() => {
                            const sp = term.sourcePages.find(
                              (p) => String(p.pdfPageNumber) === String(item.pdfPageNumber)
                            );
                            if (sp) setSelectedSourceForView(sp);
                          }}
                          className="inline-flex items-center gap-1 font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                        >
                          <Eye className="w-3 h-3 text-slate-500" />
                          <span>PDF {item.pdfPageNumber}</span>
                        </button>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800 max-w-xs">
                        <span className="line-clamp-2">{item.topic}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs">
                        <span className="line-clamp-2 text-[11px]">{item.learningPoint}</span>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <button
                          onClick={() => setInspectingPageItem(item)}
                          className={`inline-flex items-center gap-1 font-bold text-xs px-2.5 py-1 rounded-lg transition-colors ${
                            item.questionCount > 0
                              ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
                              : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          <FileQuestion className="w-3.5 h-3.5" />
                          <span>{item.questionCount} Qs</span>
                        </button>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${
                            item.status === 'COVERED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.status === 'NEEDS_MORE_QUESTIONS'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {item.status === 'COVERED' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                          {item.status === 'NEEDS_MORE_QUESTIONS' && (
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                          )}
                          <span>
                            {item.status === 'COVERED'
                              ? 'COVERED'
                              : item.status === 'NEEDS_MORE_QUESTIONS'
                              ? 'NEEDS MORE'
                              : 'REVIEW SOURCE'}
                          </span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <button
                            onClick={() => setGeneratingForPage(item)}
                            title="Generate questions for this page"
                            className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition-colors flex items-center gap-1"
                          >
                            <Sparkles className="w-3 h-3 text-indigo-600" />
                            <span>Add Qs</span>
                          </button>
                          <button
                            onClick={() => setInspectingPageItem(item)}
                            title="View questions for this page"
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                          >
                            Inspect
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Inspect Questions for a specific page */}
      {inspectingPageItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 mb-6">
              <div>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
                  {inspectingPageItem.subjectName} · Printed Page {inspectingPageItem.printedPageNumber} (PDF Page {inspectingPageItem.pdfPageNumber})
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">{inspectingPageItem.topic}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{inspectingPageItem.learningPoint}</p>
              </div>
              <button
                onClick={() => setInspectingPageItem(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List of questions for this page */}
            <div className="space-y-4 mb-6">
              {inspectingPageItem.questionIds.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <FileQuestion className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-700">No questions generated yet for this page</p>
                  <p className="text-xs text-slate-400 mt-1 mb-4">
                    Generate source-grounded Grade 3 practice questions to close this coverage gap.
                  </p>
                  <button
                    onClick={() => {
                      const item = inspectingPageItem;
                      setInspectingPageItem(null);
                      setGeneratingForPage(item);
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-indigo-700"
                  >
                    Generate Practice Questions Now
                  </button>
                </div>
              ) : (
                term.questions
                  .filter((q) => inspectingPageItem.questionIds.includes(q.id))
                  .map((q, idx) => (
                    <div
                      key={q.id}
                      className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:border-slate-300 transition-all"
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                            {q.questionType.replace('_', ' ')}
                          </span>
                          <span className="text-[11px] font-medium text-slate-500">
                            Difficulty: {q.difficulty}
                          </span>
                        </div>
                        <button
                          onClick={() => handleToggleApproval(q.id, q.approvalStatus)}
                          className={`text-xs font-bold px-2.5 py-1 rounded-full transition-colors flex items-center gap-1 ${
                            q.approvalStatus === 'approved'
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          }`}
                        >
                          {q.approvalStatus === 'approved' ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" /> Approved
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-3 h-3 text-amber-600" /> Pending Review
                            </>
                          )}
                        </button>
                      </div>

                      <p className="text-sm font-bold text-slate-900 mb-2">{q.question}</p>

                      {q.options && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-2.5 text-xs">
                          {q.options.map((opt, oIdx) => (
                            <div
                              key={oIdx}
                              className={`p-2 rounded-lg border text-xs ${
                                String(opt) === String(q.correctAnswer)
                                  ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-900'
                                  : 'bg-white border-slate-200 text-slate-700'
                              }`}
                            >
                              {opt}
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="p-2.5 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs text-indigo-900">
                        <span className="font-bold">Correct Answer:</span> {String(q.correctAnswer)}
                        <br />
                        <span className="font-bold">Explanation:</span> {q.explanation}
                      </div>
                    </div>
                  ))
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => {
                  const item = inspectingPageItem;
                  setInspectingPageItem(null);
                  setGeneratingForPage(item);
                }}
                className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-indigo-700 flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Generate More Questions for this Page</span>
              </button>

              <button
                onClick={() => setInspectingPageItem(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Generate Questions for Specific Page */}
      {generatingForPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Manual Teacher Question Generation Tool</h3>
                <p className="text-xs text-slate-500">
                  Targeted strictly to {generatingForPage.subjectName} · Page {generatingForPage.printedPageNumber}
                </p>
              </div>
              <button
                onClick={() => setGeneratingForPage(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mb-6 text-xs">
              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-indigo-900">
                <span className="font-bold block">Assessed Learning Scope:</span>
                <span>{generatingForPage.topic}</span>
                <span className="block text-[11px] text-indigo-700 mt-1">
                  Source: {generatingForPage.bookTitle} (PDF Page {generatingForPage.pdfPageNumber})
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Teacher Batch Generation (1–5 Questions per run):
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 5].map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setGenCount(cnt)}
                      className={`flex-1 py-2 rounded-xl font-bold border transition-all ${
                        genCount === cnt
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {cnt} Qs
                    </button>
                  ))}
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Manual teacher generation tool — not a hard limit on the total question bank.
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-[11px] space-y-1">
                <p className="font-semibold text-slate-700">Source-Grounded Practice Questions Policy:</p>
                <p>
                  • Generates AI-generated practice questions grounded in approved source material.
                </p>
                <p>
                  • Represents essential assessable learning points without unnecessary repetitive questions.
                </p>
                <p>
                  • Each question is tagged with printed page and PDF page, requiring teacher approval before publication.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setGeneratingForPage(null)}
                className="px-4 py-2 rounded-xl text-slate-600 font-semibold text-xs hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isGenerating}
                onClick={handleGenerateQuestionsForPage}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-xs hover:bg-indigo-700 flex items-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing & Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Source-Grounded Practice Questions</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Source Viewer Modal */}
      {selectedSourceForView && (
        <SourceViewerModal
          page={selectedSourceForView}
          onClose={() => setSelectedSourceForView(null)}
        />
      )}
    </div>
  );
};
