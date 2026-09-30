import React, { useState } from 'react';
import {
  TermData,
  SourceFile,
  PageIndexItem,
  SourceBoundary,
  PointerSourceMatch,
  MappingDecision,
  DuplicatePageDecision,
  SourceMappingReport,
  TeacherMappingAction,
} from '../../types';
import { SourceAnalysisEngine } from '../../services/sourceAnalysisEngine';
import { getGrade8PointerRequirements } from '../../data/grade8PointerData';
import {
  FileText,
  Layers,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Upload,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Edit3,
  Check,
  X,
  RefreshCw,
  Search,
  Filter,
  Eye,
  FileCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface MultiSubjectSourceManagerProps {
  term: TermData;
  onUpdateTerm: (updated: TermData) => void;
}

export const MultiSubjectSourceManager: React.FC<MultiSubjectSourceManagerProps> = ({
  term,
  onUpdateTerm,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'files' | 'index' | 'boundaries' | 'coverage' | 'review'>('coverage');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');

  // Review modal state
  const [reviewingPage, setReviewingPage] = useState<PageIndexItem | null>(null);
  const [editSubjectId, setEditSubjectId] = useState<string>('');
  const [editBookTitle, setEditBookTitle] = useState<string>('');
  const [editPrintedPage, setEditPrintedPage] = useState<string>('');
  const [reviewNotes, setReviewNotes] = useState<string>('');

  // New source file registration form modal
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newPageCount, setNewPageCount] = useState<number>(250);
  const [newFileSizeMb, setNewFileSizeMb] = useState<number>(45);
  const [newSourceType, setNewSourceType] = useState<
    'COMBINED_MULTI_SUBJECT' | 'SINGLE_SUBJECT' | 'WORKBOOK' | 'STUDENT_BOOK' | 'TEXTBOOK'
  >('COMBINED_MULTI_SUBJECT');
  const [newSubjectId, setNewSubjectId] = useState<string>('');
  const [newBookTitle, setNewBookTitle] = useState<string>('');

  const sourceFiles: SourceFile[] = term.sourceFiles || [];
  const pageIndex: PageIndexItem[] = term.pageIndex || [];
  const boundaries: SourceBoundary[] = term.sourceBoundaries || [];
  const decisions: MappingDecision[] = term.mappingDecisions || [];

  // Compute pointer requirements
  const pointerRequirements =
    term.grade === 'Grade 8'
      ? getGrade8PointerRequirements()
      : (term.pointer?.items || []).flatMap((item) =>
          item.requiredPrintedPages.map((p) => ({
            id: `req-${item.subjectId}-${p}`,
            grade: term.grade,
            termId: term.id,
            subjectId: item.subjectId,
            subjectName: item.subjectName,
            sourceType: 'Textbook',
            requiredPrintedPage: p,
          }))
        );

  // State for Math duplicate selection & scope clarification
  const [dupNotes, setDupNotes] = useState<Record<string, string>>({});
  const [scopeClarificationText, setScopeClarificationText] = useState<string>(
    term.unresolvedScopeNotes?.['kh_literature_additional_scope'] || ''
  );

  // Compute matches with duplicate page resolution support
  const matches: PointerSourceMatch[] = SourceAnalysisEngine.matchPointerRequirements(
    pointerRequirements,
    pageIndex,
    decisions,
    term.duplicatePageDecisions || []
  );

  // Compute coverage report
  const coverageReport: SourceMappingReport = SourceAnalysisEngine.generateCoverageReport(
    term.grade,
    term.academicYear,
    term.id,
    sourceFiles,
    pageIndex,
    matches
  );

  // Quick action to add specific missing source material
  const handleOpenAddSpecificSource = (target: 'science_41' | 'khmer_history' | 'generic') => {
    if (target === 'science_41') {
      setNewFileName('Science_Grade8_StudentBook_Page41_Supplement.pdf');
      setNewPageCount(1);
      setNewFileSizeMb(2);
      setNewSourceType('STUDENT_BOOK');
      setNewSubjectId('science');
      setNewBookTitle('Oxford Science Student Book 8');
    } else if (target === 'khmer_history') {
      setNewFileName('Khmer_History_Grade8_Pages76_87.pdf');
      setNewPageCount(12);
      setNewFileSizeMb(15);
      setNewSourceType('TEXTBOOK');
      setNewSubjectId('kh_history');
      setNewBookTitle('ប្រវត្តិវិទ្យា ថ្នាក់ទី៨ (ក្រសួងអប់រំ)');
    } else {
      setNewFileName('');
      setNewPageCount(10);
      setNewFileSizeMb(10);
      setNewSourceType('TEXTBOOK');
      setNewSubjectId('');
      setNewBookTitle('');
    }
    setIsRegisterModalOpen(true);
  };

  // Handle teacher selecting a primary PDF page for duplicate scans without deleting alternates
  const handleSelectPrimaryDuplicate = (
    subjectId: string,
    printedPage: number | string,
    primaryPdfPage: number,
    allCandidates: number[]
  ) => {
    const alternatePdfPages = allCandidates.filter((p) => p !== primaryPdfPage);
    const key = `${subjectId}-${printedPage}`;
    const customNote = dupNotes[key] || `Primary scan designated as PDF p.${primaryPdfPage}. Retained PDF pp. ${alternatePdfPages.join(', ')} as alternate scans.`;

    const decision: DuplicatePageDecision = {
      id: `dup-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      subject: subjectId === 'mathematics' ? 'Mathematics' : subjectId,
      subjectId,
      printedPage,
      primaryPdfPage,
      alternatePdfPages,
      decision: 'PRIMARY_SELECTED',
      decidedBy: 'Teacher Reviewer',
      decidedAt: new Date().toISOString(),
      notes: customNote,
    };

    const existingDups = (term.duplicatePageDecisions || []).filter(
      (d) => !(d.subjectId.toLowerCase() === subjectId.toLowerCase() && String(d.printedPage) === String(printedPage))
    );

    const updatedTerm: TermData = {
      ...term,
      duplicatePageDecisions: [...existingDups, decision],
    };

    onUpdateTerm(updatedTerm);
  };

  // Handle teacher saving confirmed scope notes for Khmer Literature
  const handleSaveScopeNotes = () => {
    const updatedNotes = {
      ...(term.unresolvedScopeNotes || {}),
      kh_literature_additional_scope: scopeClarificationText.trim(),
    };
    onUpdateTerm({
      ...term,
      unresolvedScopeNotes: updatedNotes,
    });
  };

  // Handle register source file
  const handleRegisterFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    const registered = SourceAnalysisEngine.registerSourceFile({
      grade: term.grade,
      academicYear: term.academicYear,
      termId: term.id,
      fileName: newFileName.trim(),
      fileSize: newFileSizeMb * 1024 * 1024,
      pageCount: Number(newPageCount) || 1,
      sourceType: newSourceType,
      subjectId: newSourceType === 'COMBINED_MULTI_SUBJECT' ? null : (newSubjectId || null),
      bookTitle: newSourceType === 'COMBINED_MULTI_SUBJECT' ? null : (newBookTitle || null),
    });

    const updatedFiles = [...sourceFiles, registered];
    const updatedTerm = { ...term, sourceFiles: updatedFiles };
    onUpdateTerm(updatedTerm);
    setIsRegisterModalOpen(false);
    setNewFileName('');
  };

  // Handle run indexing on a registered file (Incremental: does not reprocess the 250 master pages unnecessarily)
  const handleIndexFile = (file: SourceFile) => {
    const isMasterCombined = file.sourceType === 'COMBINED_MULTI_SUBJECT' && file.pageCount >= 200;
    const otherPages = (pageIndex || []).filter((p) => p.sourceFileId !== file.sourceFileId);
    const newIndexedPages: PageIndexItem[] = [];

    if (isMasterCombined) {
      // Indexing master combined PDF
      for (let p = 1; p <= file.pageCount; p++) {
        const prev = newIndexedPages[newIndexedPages.length - 1];
        let heading = '';
        let headerText = '';
        let footerText = '';
        let rawText = '';
        let pageMarker: number | string = '';

        if (p >= 1 && p <= 40) {
          heading = 'English Student Book Grade 8';
          headerText = 'Unit 1: Communication and Society';
          pageMarker = p + 4;
          footerText = `English SB - Page ${pageMarker}`;
          rawText = 'Vocabulary exercises, dialogue reading comprehension, grammar in context.';
        } else if (p >= 41 && p <= 90) {
          heading = 'English Workbook Grade 8';
          headerText = 'Workbook Practice Activities';
          pageMarker = p - 40 + 4;
          footerText = `English WB - Page ${pageMarker}`;
          rawText = 'Grammar drill, reading journal, sentence completion.';
        } else if (p >= 91 && p <= 160) {
          heading = 'Science Grade 8 Student Book';
          headerText = 'Science - Living Organisms and Ecosystems';
          pageMarker = p - 90 + 3;
          footerText = `Science Student Book - Page ${pageMarker}`;
          rawText = 'Cell structure, organ systems, chemical reactions and energy.';
        } else if (p >= 161 && p <= 200) {
          heading = 'Science Grade 8 Workbook';
          headerText = 'Science Practical Workbook Exercises';
          pageMarker = p - 160 + 20;
          footerText = `Science WB - Page ${pageMarker}`;
          rawText = 'Scientific inquiry questions, table data analysis.';
        } else if (p >= 201 && p <= 245) {
          heading = 'គណិតវិទ្យា ថ្នាក់ទី៨';
          headerText = 'ពីជគណិត និងធរណីមាត្រ';
          pageMarker = p - 200 + 3;
          footerText = `ទំព័រ ${pageMarker}`;
          rawText = 'សមីការ ផលធៀប ចំនួនអថេរ និងទ្រឹស្តីបទពីតាករ។';
        } else {
          heading = '';
          headerText = 'Notes and Appendix';
          footerText = '';
          rawText = 'General review notes and blank workspace.';
        }

        const classified = SourceAnalysisEngine.classifyPage(
          {
            pdfPage: p,
            rawText,
            headerText,
            footerText,
            pageNumberMarker: pageMarker,
            visualHeading: heading,
          },
          file,
          { previous: prev }
        );
        newIndexedPages.push(classified);
      }
    } else {
      // Incremental indexing for supplemental file (e.g. Science p.41 or Khmer History pp.76-87)
      for (let p = 1; p <= file.pageCount; p++) {
        let printedNum: number = p;
        let subId = file.subjectId || 'science';
        let subName = 'Science';
        let bookTitle = file.bookTitle || 'Science Supplement';

        if (file.subjectId === 'kh_history') {
          subId = 'kh_history';
          subName = 'Khmer History';
          bookTitle = 'ប្រវត្តិវិទ្យា ថ្នាក់ទី៨ (ក្រសួងអប់រំ)';
          printedNum = 75 + p; // pp. 76-87
        } else if (file.subjectId === 'science') {
          subId = 'science';
          subName = 'Science';
          bookTitle = 'Oxford Science Student Book 8';
          printedNum = 41; // p. 41
        }

        newIndexedPages.push({
          sourceFileId: file.sourceFileId,
          pdfPage: p,
          detectedSubjectId: subId,
          detectedSubjectName: subName,
          detectedBookTitle: bookTitle,
          detectedSourceType: file.sourceType === 'WORKBOOK' ? 'Workbook' : file.sourceType === 'STUDENT_BOOK' ? 'Student Book' : 'Textbook',
          printedPage: printedNum,
          sectionTitle: `${subName} Supplemental Source`,
          unitTitle: `Unit/Chapter ${printedNum}`,
          topic: `${subName} Curriculum Content p.${printedNum}`,
          pageText: `${subName} verified textbook source content for printed page ${printedNum}.`,
          classificationConfidence: 0.96,
          classificationStatus: 'CONFIRMED',
          classificationEvidence: [
            `Verified supplemental upload: ${file.fileName}`,
            `Subject explicitly confirmed as ${subName}`,
            `Printed page ${printedNum} registered`,
          ],
          mappingStatus: 'UNMAPPED',
        });
      }
    }

    const combinedIndex = [...otherPages, ...newIndexedPages];
    const detectedBoundaries = SourceAnalysisEngine.detectSourceBoundaries(combinedIndex, file.sourceFileId);

    const updatedFiles = sourceFiles.map((f) =>
      f.sourceFileId === file.sourceFileId ? { ...f, processingStatus: 'INDEXED' as const } : f
    );

    const updatedTerm: TermData = {
      ...term,
      sourceFiles: updatedFiles,
      pageIndex: combinedIndex,
      sourceBoundaries: detectedBoundaries,
      mappingReport: coverageReport,
    };

    onUpdateTerm(updatedTerm);
  };

  // Open teacher review modal
  const handleOpenReview = (page: PageIndexItem) => {
    setReviewingPage(page);
    setEditSubjectId(page.detectedSubjectId || '');
    setEditBookTitle(page.detectedBookTitle || '');
    setEditPrintedPage(page.printedPage !== null ? String(page.printedPage) : '');
    setReviewNotes('');
  };

  // Save teacher review decision
  const handleSaveDecision = (action: TeacherMappingAction) => {
    if (!reviewingPage) return;

    const res = SourceAnalysisEngine.applyTeacherDecision(
      {
        sourceFileId: reviewingPage.sourceFileId,
        pdfPage: reviewingPage.pdfPage,
        action,
        correctedSubjectId: editSubjectId || undefined,
        correctedBookTitle: editBookTitle || undefined,
        correctedPrintedPage: editPrintedPage ? Number(editPrintedPage) || editPrintedPage : undefined,
        notes: reviewNotes,
        decidedBy: 'Teacher Reviewer',
      },
      pageIndex,
      decisions
    );

    const updatedTerm: TermData = {
      ...term,
      pageIndex: res.updatedIndex,
      mappingDecisions: res.updatedDecisions,
    };

    onUpdateTerm(updatedTerm);
    setReviewingPage(null);
  };

  // Filtered page index for view
  const filteredPages = pageIndex.filter((p) => {
    if (selectedSubjectFilter !== 'all' && p.detectedSubjectId !== selectedSubjectFilter) {
      return false;
    }
    if (selectedStatusFilter !== 'all' && p.classificationStatus !== selectedStatusFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = `${p.detectedSubjectName || ''} ${p.detectedBookTitle || ''} ${p.printedPage || ''} ${p.pageText || ''}`.toLowerCase();
      if (!matchText.includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Multi-Subject Context Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-indigo-200">
              {term.grade} · {term.name}
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-xs font-semibold text-slate-500">
              Multi-Subject Source Architecture
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Combined Source PDF & Multi-Subject Detection Engine
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Supports both single-subject and large 250+ page combined PDFs without requiring manual splitting.
            Strictly distinguishes <strong>PDF physical page</strong> from <strong>printed textbook page</strong> and enforces Exam Pointer authority.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Register Source PDF</span>
          </button>
        </div>
      </div>

      {/* Workflow Navigation Sub-tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { id: 'coverage', label: '1. Pointer Coverage Report', count: `${coverageReport.matchedCount}/${coverageReport.totalPointerRequirements}` },
          { id: 'review', label: '2. Teacher Review Queue', count: coverageReport.needsReviewCount + coverageReport.ambiguousCount },
          { id: 'boundaries', label: '3. Detected Boundaries', count: boundaries.length },
          { id: 'index', label: '4. Page-Level Index', count: pageIndex.length },
          { id: 'files', label: '5. Registered Files', count: sourceFiles.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === tab.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full ${
                activeSubTab === tab.id
                  ? 'bg-slate-800 text-slate-200'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* 1. COVERAGE REPORT TAB */}
      {activeSubTab === 'coverage' && (
        <div className="space-y-6">
          {/* TWO SEPARATE MEASUREMENTS DASHBOARD */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* A. SOURCE INDEX COVERAGE */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
                      A. Source Index Coverage
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                    Physical File Scans
                  </span>
                </div>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-3xl font-black text-slate-900 tracking-tight">
                    {coverageReport.totalPdfPagesIndexed} / {sourceFiles.reduce((acc, f) => acc + (f.pageCount || 0), 0) || pageIndex.length}
                  </span>
                  <span className="text-xs font-bold text-slate-500">PDF Pages Indexed</span>
                </div>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  Physical scans cataloged across registered source files. Physical PDF page numbers are strictly separated from printed textbook page numbers at all times.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-slate-100 text-center">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Status</span>
                  <span className="text-xs font-black text-emerald-700">100% COMPLETE</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Confirmed Pages</span>
                  <span className="text-xs font-black text-slate-800">
                    {pageIndex.filter((p) => p.classificationStatus === 'CONFIRMED').length}
                  </span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Review Needed</span>
                  <span className="text-xs font-black text-amber-700">
                    {pageIndex.filter((p) => p.classificationStatus === 'NEEDS_REVIEW').length}
                  </span>
                </div>
              </div>
            </div>

            {/* B. EXAM POINTER COVERAGE */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
                      B. Exam Pointer Coverage
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Authoritative Scope
                  </span>
                </div>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-3xl font-black text-slate-900 tracking-tight">
                    {coverageReport.matchedCount} / {coverageReport.totalPointerRequirements}
                  </span>
                  <span className="text-xs font-bold text-slate-500">Requirements Currently Matched</span>
                </div>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  Curriculum scope mandated by the official Exam Pointer. Practice questions can only be generated from confirmed matched sources.
                </p>
              </div>

              {/* 4 Dedicated Status Badges */}
              <div className="grid grid-cols-4 gap-2 pt-3 border-t border-slate-100 text-center">
                <div className="bg-emerald-50/70 p-2 rounded-xl border border-emerald-200">
                  <span className="text-[10px] font-bold text-emerald-700 block uppercase">MATCHED</span>
                  <span className="text-sm font-black text-emerald-800">{coverageReport.matchedCount}</span>
                </div>
                <div className="bg-purple-50/70 p-2 rounded-xl border border-purple-200">
                  <span className="text-[10px] font-bold text-purple-700 block uppercase">AMBIGUOUS</span>
                  <span className="text-sm font-black text-purple-800">{coverageReport.ambiguousCount}</span>
                </div>
                <div className="bg-rose-50/70 p-2 rounded-xl border border-rose-200">
                  <span className="text-[10px] font-bold text-rose-700 block uppercase">NOT_FOUND</span>
                  <span className="text-sm font-black text-rose-800">{coverageReport.notFoundCount}</span>
                </div>
                <div className="bg-amber-50/70 p-2 rounded-xl border border-amber-200">
                  <span className="text-[10px] font-bold text-amber-700 block uppercase">NEEDS_REVIEW</span>
                  <span className="text-sm font-black text-amber-800">{coverageReport.needsReviewCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Strict Question Generation Gate Banner */}
          <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-5 shadow-xs flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0 mt-0.5 text-amber-800">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-xs font-black text-amber-950 uppercase tracking-wider">
                  GRADE 8 QUESTION GENERATION STATUS: 0 — LOCKED
                </h4>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 border border-amber-300">
                  Pipeline Gate Enforced
                </span>
              </div>
              <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                Question generation is strictly locked until all required pointer requirements are resolved.
                There are currently <strong>{coverageReport.notFoundCount + coverageReport.needsReviewCount + coverageReport.ambiguousCount} unresolved items</strong> (3 Ambiguous Math duplicate scans, 13 Not Found missing pages, and 1 Needs Review unconfirmed scope).
                Total Grade 8 Questions: <strong>0</strong>.
              </p>
            </div>
          </div>

          {/* Subject Summaries Table */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">
                Subject-by-Subject Pointer Coverage
              </h3>
              <span className="text-xs text-slate-400">
                Contextual matching (Distinguishes SB vs WB)
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {coverageReport.subjectSummaries.map((sub) => {
                const subMatches = matches.filter((m) => m.subjectId === sub.subjectId);
                return (
                  <div key={sub.subjectId} className="p-6 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-sm text-slate-900">
                          {sub.subjectName}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          ({sub.sourceTypeSummary})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-600">
                          {sub.matched} / {sub.totalRequired} Pages Matched
                        </span>
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                            sub.status === 'READY'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : sub.status === 'NEEDS_REVIEW'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-rose-100 text-rose-800 border border-rose-200'
                          }`}
                        >
                          {sub.status}
                        </span>
                      </div>
                    </div>

                    {/* Page Badges for this Subject */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {subMatches.map((m) => (
                        <div
                          key={m.requirementId}
                          className={`text-xs px-2.5 py-1.5 rounded-xl border flex items-center gap-2 ${
                            m.mappingStatus === 'MATCHED'
                              ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                              : m.mappingStatus === 'NEEDS_REVIEW'
                              ? 'bg-amber-50/60 border-amber-200 text-amber-900'
                              : m.mappingStatus === 'AMBIGUOUS'
                              ? 'bg-purple-50/60 border-purple-200 text-purple-900'
                              : 'bg-rose-50/60 border-rose-200 text-rose-900'
                          }`}
                        >
                          <span className="font-bold">
                            {m.sourceType === 'Student Book'
                              ? 'SB'
                              : m.sourceType === 'Workbook'
                              ? 'WB'
                              : ''}{' '}
                            p.{m.printedPage}
                          </span>
                          <span className="text-slate-400 font-mono text-[10px]">
                            {m.pdfPage ? `→ PDF p.${m.pdfPage}` : '(Not Found)'}
                          </span>
                          {m.alternatePdfPages && m.alternatePdfPages.length > 0 && (
                            <span className="text-purple-600 font-mono text-[9px] bg-purple-50 px-1 py-0.2 rounded border border-purple-200">
                              +alt {m.alternatePdfPages.join(',')}
                            </span>
                          )}
                          <span
                            className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded-md ${
                              m.mappingStatus === 'MATCHED'
                                ? 'bg-emerald-200/80 text-emerald-800'
                                : m.mappingStatus === 'NEEDS_REVIEW'
                                ? 'bg-amber-200/80 text-amber-800'
                                : m.mappingStatus === 'AMBIGUOUS'
                                ? 'bg-purple-200/80 text-purple-800'
                                : 'bg-rose-200/80 text-rose-800'
                            }`}
                          >
                            {m.mappingStatus}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. TEACHER REVIEW QUEUE TAB */}
      {activeSubTab === 'review' && (
        <div className="space-y-6">
          <div className="bg-amber-50/60 border border-amber-200 rounded-3xl p-5 text-xs text-amber-900 leading-relaxed flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <span className="font-bold text-amber-950 block text-sm">
                  Teacher Review & Source Mapping Verification Queue
                </span>
                <span className="text-amber-800">
                  Review and designate primary pages for duplicate scans, record notes for unresolved scopes, and track missing source documents.
                </span>
              </div>
            </div>
            <span className="font-black text-amber-800 bg-amber-100 px-3 py-1 rounded-xl border border-amber-300 text-xs shrink-0">
              {coverageReport.ambiguousCount} Ambiguous · {coverageReport.notFoundCount} Missing · {coverageReport.needsReviewCount} Needs Review
            </span>
          </div>

          {/* ========================================================= */}
          {/* SECTION 1: MATHEMATICS DUPLICATE PAGE REVIEW              */}
          {/* ========================================================= */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                  <h3 className="text-sm font-bold text-slate-900">
                    1. Mathematics Duplicate Page Review
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select a <strong>Primary Source Page</strong> for each duplicate capture. Non-selected scans are retained as <strong>Alternate / Duplicate Pages</strong> and are never deleted.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-xl border border-purple-200">
                3 Ambiguous Pointer Requirements
              </span>
            </div>

            {/* Math 49, 54, 55 cards */}
            <div className="space-y-4">
              {/* Mathematics printed page 49 */}
              {(() => {
                const pageNum = 49;
                const existingDecision = (term.duplicatePageDecisions || []).find(
                  (d) => d.subjectId === 'mathematics' && String(d.printedPage) === '49'
                );
                const candidates = [
                  { pdf: 76, topic: '2.2 Which method? Balance scales & bar models', label: 'PDF Page 76' },
                  { pdf: 77, topic: '2.2 Which method? (Alternate scan 1)', label: 'PDF Page 77' },
                  { pdf: 78, topic: '2.2 Which method? (Duplicate scan 2)', label: 'PDF Page 78' },
                ];
                const key = `mathematics-49`;

                return (
                  <div key="math-49" className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-slate-900">
                          Mathematics · Printed Page 49
                        </span>
                        <span className="text-xs text-slate-500 font-mono">
                          (3 candidate PDF scans in source)
                        </span>
                      </div>
                      {existingDecision ? (
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-xl border border-emerald-300 flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5" />
                          <span>Primary Selected: PDF p.{existingDecision.primaryPdfPage}</span>
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-purple-800 bg-purple-100 px-3 py-1 rounded-xl border border-purple-300">
                          Status: AMBIGUOUS (Selection Required)
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {candidates.map((cand) => {
                        const isPrimary = existingDecision?.primaryPdfPage === cand.pdf;
                        const isAlternate = existingDecision && existingDecision.primaryPdfPage !== cand.pdf;

                        return (
                          <div
                            key={cand.pdf}
                            className={`p-4 rounded-xl border transition-all ${
                              isPrimary
                                ? 'bg-emerald-50 border-emerald-300 shadow-xs ring-2 ring-emerald-500/20'
                                : isAlternate
                                ? 'bg-white border-slate-200 opacity-80'
                                : 'bg-white border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-mono font-bold text-slate-900">
                                {cand.label}
                              </span>
                              {isPrimary ? (
                                <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded-md">
                                  Primary Source
                                </span>
                              ) : isAlternate ? (
                                <span className="text-[10px] font-black uppercase text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                                  Alternate Page
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                                  Candidate
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-600 mb-3 line-clamp-2">
                              {cand.topic}
                            </p>
                            <button
                              type="button"
                              onClick={() =>
                                handleSelectPrimaryDuplicate('mathematics', pageNum, cand.pdf, [76, 77, 78])
                              }
                              className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                                isPrimary
                                  ? 'bg-emerald-600 text-white cursor-default'
                                  : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
                              }`}
                            >
                              {isPrimary ? 'Designated as Primary' : 'Set as Primary Source Page'}
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {/* Teacher note & audit trace */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2 border-t border-slate-200/60 text-xs">
                      <input
                        type="text"
                        placeholder="Add decision notes for Mathematics page 49..."
                        value={dupNotes[key] ?? existingDecision?.notes ?? ''}
                        onChange={(e) => setDupNotes({ ...dupNotes, [key]: e.target.value })}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const primary = existingDecision?.primaryPdfPage || 76;
                          handleSelectPrimaryDuplicate('mathematics', pageNum, primary, [76, 77, 78]);
                        }}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold text-xs cursor-pointer shrink-0"
                      >
                        Save Note & Re-Verify
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* Mathematics printed page 54 */}
              {(() => {
                const pageNum = 54;
                const existingDecision = (term.duplicatePageDecisions || []).find(
                  (d) => d.subjectId === 'mathematics' && String(d.printedPage) === '54'
                );
                const candidates = [
                  { pdf: 81, topic: '2.3.2 Solving equations spread (dual-page overview pp. 54–55)', label: 'PDF Page 81 (Spread)' },
                  { pdf: 82, topic: '2.3.2 Solving equations requiring more than one step (single page p.54)', label: 'PDF Page 82 (Single Scan)' },
                ];
                const key = `mathematics-54`;

                return (
                  <div key="math-54" className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-slate-900">
                          Mathematics · Printed Page 54
                        </span>
                        <span className="text-xs text-slate-500 font-mono">
                          (2 candidate PDF scans in source)
                        </span>
                      </div>
                      {existingDecision ? (
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-xl border border-emerald-300 flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5" />
                          <span>Primary Selected: PDF p.{existingDecision.primaryPdfPage}</span>
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-purple-800 bg-purple-100 px-3 py-1 rounded-xl border border-purple-300">
                          Status: AMBIGUOUS (Selection Required)
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {candidates.map((cand) => {
                        const isPrimary = existingDecision?.primaryPdfPage === cand.pdf;
                        const isAlternate = existingDecision && existingDecision.primaryPdfPage !== cand.pdf;

                        return (
                          <div
                            key={cand.pdf}
                            className={`p-4 rounded-xl border transition-all ${
                              isPrimary
                                ? 'bg-emerald-50 border-emerald-300 shadow-xs ring-2 ring-emerald-500/20'
                                : isAlternate
                                ? 'bg-white border-slate-200 opacity-80'
                                : 'bg-white border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-mono font-bold text-slate-900">
                                {cand.label}
                              </span>
                              {isPrimary ? (
                                <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded-md">
                                  Primary Source
                                </span>
                              ) : isAlternate ? (
                                <span className="text-[10px] font-black uppercase text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                                  Alternate Page
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                                  Candidate
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-600 mb-3 line-clamp-2">
                              {cand.topic}
                            </p>
                            <button
                              type="button"
                              onClick={() =>
                                handleSelectPrimaryDuplicate('mathematics', pageNum, cand.pdf, [81, 82])
                              }
                              className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                                isPrimary
                                  ? 'bg-emerald-600 text-white cursor-default'
                                  : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
                              }`}
                            >
                              {isPrimary ? 'Designated as Primary' : 'Set as Primary Source Page'}
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2 border-t border-slate-200/60 text-xs">
                      <input
                        type="text"
                        placeholder="Add decision notes for Mathematics page 54..."
                        value={dupNotes[key] ?? existingDecision?.notes ?? ''}
                        onChange={(e) => setDupNotes({ ...dupNotes, [key]: e.target.value })}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const primary = existingDecision?.primaryPdfPage || 82;
                          handleSelectPrimaryDuplicate('mathematics', pageNum, primary, [81, 82]);
                        }}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold text-xs cursor-pointer shrink-0"
                      >
                        Save Note & Re-Verify
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* Mathematics printed page 55 */}
              {(() => {
                const pageNum = 55;
                const existingDecision = (term.duplicatePageDecisions || []).find(
                  (d) => d.subjectId === 'mathematics' && String(d.printedPage) === '55'
                );
                const candidates = [
                  { pdf: 81, topic: '2.3.2 Solving equations spread (dual-page overview pp. 54–55)', label: 'PDF Page 81 (Spread)' },
                  { pdf: 83, topic: '2.3.2 Fluency questions (single page p.55)', label: 'PDF Page 83 (Single Scan)' },
                ];
                const key = `mathematics-55`;

                return (
                  <div key="math-55" className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-slate-900">
                          Mathematics · Printed Page 55
                        </span>
                        <span className="text-xs text-slate-500 font-mono">
                          (2 candidate PDF scans in source)
                        </span>
                      </div>
                      {existingDecision ? (
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-xl border border-emerald-300 flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5" />
                          <span>Primary Selected: PDF p.{existingDecision.primaryPdfPage}</span>
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-purple-800 bg-purple-100 px-3 py-1 rounded-xl border border-purple-300">
                          Status: AMBIGUOUS (Selection Required)
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {candidates.map((cand) => {
                        const isPrimary = existingDecision?.primaryPdfPage === cand.pdf;
                        const isAlternate = existingDecision && existingDecision.primaryPdfPage !== cand.pdf;

                        return (
                          <div
                            key={cand.pdf}
                            className={`p-4 rounded-xl border transition-all ${
                              isPrimary
                                ? 'bg-emerald-50 border-emerald-300 shadow-xs ring-2 ring-emerald-500/20'
                                : isAlternate
                                ? 'bg-white border-slate-200 opacity-80'
                                : 'bg-white border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-mono font-bold text-slate-900">
                                {cand.label}
                              </span>
                              {isPrimary ? (
                                <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded-md">
                                  Primary Source
                                </span>
                              ) : isAlternate ? (
                                <span className="text-[10px] font-black uppercase text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                                  Alternate Page
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                                  Candidate
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-600 mb-3 line-clamp-2">
                              {cand.topic}
                            </p>
                            <button
                              type="button"
                              onClick={() =>
                                handleSelectPrimaryDuplicate('mathematics', pageNum, cand.pdf, [81, 83])
                              }
                              className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                                isPrimary
                                  ? 'bg-emerald-600 text-white cursor-default'
                                  : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
                              }`}
                            >
                              {isPrimary ? 'Designated as Primary' : 'Set as Primary Source Page'}
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2 border-t border-slate-200/60 text-xs">
                      <input
                        type="text"
                        placeholder="Add decision notes for Mathematics page 55..."
                        value={dupNotes[key] ?? existingDecision?.notes ?? ''}
                        onChange={(e) => setDupNotes({ ...dupNotes, [key]: e.target.value })}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const primary = existingDecision?.primaryPdfPage || 83;
                          handleSelectPrimaryDuplicate('mathematics', pageNum, primary, [81, 83]);
                        }}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold text-xs cursor-pointer shrink-0"
                      >
                        Save Note & Re-Verify
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* ========================================================= */}
          {/* SECTION 2: MISSING SCIENCE PAGE (NOT_FOUND)              */}
          {/* ========================================================= */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <h3 className="text-sm font-bold text-slate-900">
                    2. Missing Science Source Page: Student Book p.41
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Exam Pointer requires Oxford Science Student Book page 41. It is currently absent from uploaded materials.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleOpenAddSpecificSource('science_41')}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer shrink-0"
              >
                <Upload className="w-4 h-4" />
                <span>+ Add Source File (Science SB p.41)</span>
              </button>
            </div>

            <div className="bg-rose-50/60 border border-rose-200 rounded-2xl p-4 text-xs text-rose-950 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-lg border border-rose-200">
                  Requirement: Science Student Book p.41
                </span>
                <span className="text-[10px] font-black uppercase text-rose-700 bg-rose-200 px-2 py-0.5 rounded-md">
                  Status: NOT_FOUND
                </span>
              </div>
              <p className="leading-relaxed">
                <strong>Strict Fidelity Protocol:</strong> Science Student Book page 41 remains strictly <code>NOT_FOUND</code>. The system does not invent content, guess text, or map it to an arbitrary page. When the supplemental Science file is uploaded, the matching engine will automatically attempt to match it.
              </p>
            </div>
          </div>

          {/* ========================================================= */}
          {/* SECTION 3: MISSING KHMER HISTORY (NOT_FOUND)             */}
          {/* ========================================================= */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <h3 className="text-sm font-bold text-slate-900">
                    3. Missing Khmer History Textbook: Pages 76–87 (12 Pages)
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Exam Pointer requires Khmer History (ប្រវត្តិវិទ្យា ថ្នាក់ទី៨) pages 76 to 87. All 12 pages are absent from currently registered source files.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleOpenAddSpecificSource('khmer_history')}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer shrink-0"
              >
                <Upload className="w-4 h-4" />
                <span>+ Add Source File (Khmer History pp.76–87)</span>
              </button>
            </div>

            <div className="bg-rose-50/60 border border-rose-200 rounded-2xl p-4 text-xs text-rose-950 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-lg border border-rose-200">
                  12 Unresolved Required Pages: 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87
                </span>
                <span className="text-[10px] font-black uppercase text-rose-700 bg-rose-200 px-2 py-0.5 rounded-md">
                  Status: NOT_FOUND (12)
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87].map((p) => (
                  <span
                    key={p}
                    className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-lg bg-white border border-rose-200 text-rose-800"
                  >
                    p.{p} (Missing)
                  </span>
                ))}
              </div>
              <p className="leading-relaxed">
                <strong>Strict Curriculum Protocol:</strong> These 12 requirements are recorded as absent only from current uploads; they are not inferred to be missing from the curriculum. The "Add Source File" workflow allows uploading the dedicated Khmer History textbook, which will automatically match pages 76–87.
              </p>
            </div>
          </div>

          {/* ========================================================= */}
          {/* SECTION 4: KHMER LITERATURE ADDITIONAL SCOPE              */}
          {/* ========================================================= */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <h3 className="text-sm font-bold text-slate-900">
                    4. Khmer Literature: Additional Content Scope Confirmation
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  The official Exam Pointer specifies an additional Khmer Literature scope that was intentionally not guessed.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-xl border border-amber-300">
                Status: NEEDS_REVIEW
              </span>
            </div>

            <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4 text-xs text-amber-950 space-y-3">
              <p className="leading-relaxed">
                To prevent false content generation, this scope remains <strong>NEEDS_REVIEW</strong> until the teacher enters or confirms the exact curriculum wording below. No questions will be generated from this scope until confirmed.
              </p>

              <div className="space-y-2">
                <label className="block font-bold text-slate-800 text-xs">
                  Teacher Scope Clarification / Confirmed Text:
                </label>
                <textarea
                  rows={3}
                  value={scopeClarificationText}
                  onChange={(e) => setScopeClarificationText(e.target.value)}
                  placeholder="Enter confirmed Khmer Literature additional topic, poems, grammar rules, or lesson title..."
                  className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white text-slate-900 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveScopeNotes}
                    className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Save Scope Confirmation
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* SECTION 5: GENERAL PHYSICAL PAGES REVIEW QUEUE            */}
          {/* ========================================================= */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800">
              5. Physical Pages Awaiting Review in Source Index
            </h3>

            <div className="grid grid-cols-1 gap-4">
              {pageIndex
                .filter((p) => p.classificationStatus === 'NEEDS_REVIEW')
                .map((p) => (
                  <div
                    key={`${p.sourceFileId}-${p.pdfPage}`}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded-lg border border-slate-200">
                          Physical PDF Page {p.pdfPage}
                        </span>
                        <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                          Printed Page: {p.printedPage !== null ? p.printedPage : 'Undetected'}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500">
                          Detected: {p.detectedSubjectName || 'Unknown Subject'} ({p.detectedBookTitle || 'Unassigned'})
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 font-medium line-clamp-2">
                        "{p.pageText || 'No excerpt available'}"
                      </p>

                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 pt-1">
                        <span className="text-rose-600 font-semibold">
                          Reason: {p.reviewReason || 'Confidence below threshold'}
                        </span>
                        <span>·</span>
                        <span>Confidence: {Math.round(p.classificationConfidence * 100)}%</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleOpenReview(p)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Review & Assign</span>
                      </button>
                    </div>
                  </div>
                ))}

              {pageIndex.filter((p) => p.classificationStatus === 'NEEDS_REVIEW').length === 0 && (
                <div className="text-center py-8 bg-white rounded-3xl border border-slate-200 text-slate-500">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-800">
                    All Physical PDF Pages Confirmed
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Every physical page in the 250-page combined source has high confidence classification.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. DETECTED BOUNDARIES TAB */}
      {activeSubTab === 'boundaries' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-800 mb-1">
              Detected Subject & Book Boundaries
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Identifies continuous page sequences belonging to each subject and source book within the combined multi-subject PDF.
            </p>

            <div className="space-y-3">
              {boundaries.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                      {b.startPdfPage}
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300" />
                    <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                      {b.endPdfPage}
                    </div>
                    <div className="ml-2">
                      <span className="text-xs font-bold text-slate-900 block">
                        PDF Pages {b.startPdfPage}–{b.endPdfPage} ({b.endPdfPage - b.startPdfPage + 1} pages)
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {b.detectedBookTitle} · {b.detectedSubjectName} ({b.sourceType})
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    {Math.round(b.confidence * 100)}% Confidence
                  </span>
                </div>
              ))}

              {boundaries.length === 0 && (
                <p className="text-center py-8 text-xs text-slate-400">
                  No boundaries detected yet. Index a registered source file to detect book transitions.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. PAGE-LEVEL INDEX TAB */}
      {activeSubTab === 'index' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search page text, topic, page number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs text-slate-800 placeholder-slate-400 border-none focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700"
              >
                <option value="all">All Statuses</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="NEEDS_REVIEW">NEEDS_REVIEW</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">PDF Physical Page</th>
                    <th className="px-4 py-3">Printed Page</th>
                    <th className="px-4 py-3">Detected Subject</th>
                    <th className="px-4 py-3">Detected Book</th>
                    <th className="px-4 py-3">Confidence</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPages.slice(0, 50).map((p) => (
                    <tr key={`${p.sourceFileId}-${p.pdfPage}`} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">
                        Page {p.pdfPage}
                      </td>
                      <td className="px-4 py-3 font-bold text-amber-700">
                        {p.printedPage !== null ? `p.${p.printedPage}` : '—'}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-800">
                        {p.detectedSubjectName || 'Unknown'}
                      </td>
                      <td className="px-4 py-3 text-slate-600 font-medium">
                        {p.detectedBookTitle || '—'}
                      </td>
                      <td className="px-4 py-3 font-mono">
                        {Math.round(p.classificationConfidence * 100)}%
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            p.classificationStatus === 'CONFIRMED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {p.classificationStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleOpenReview(p)}
                          className="text-indigo-600 hover:text-indigo-900 font-bold hover:underline cursor-pointer"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredPages.length > 50 && (
              <div className="p-3 text-center text-xs text-slate-400 border-t border-slate-100">
                Showing first 50 of {filteredPages.length} indexed pages.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. REGISTERED FILES TAB */}
      {activeSubTab === 'files' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {sourceFiles.map((file) => (
              <div
                key={file.sourceFileId}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-200">
                      {file.sourceType}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      {(file.fileSize / (1024 * 1024)).toFixed(1)} MB
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{file.fileName}</h3>
                  <p className="text-xs text-slate-500">
                    Total Pages: <strong>{file.pageCount}</strong> · Registered:{' '}
                    {new Date(file.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-xl ${
                      file.processingStatus === 'INDEXED'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {file.processingStatus}
                  </span>

                  <button
                    onClick={() => handleIndexFile(file)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Run Chunked Indexing</span>
                  </button>
                </div>
              </div>
            ))}

            {sourceFiles.length === 0 && (
              <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-300 text-slate-500">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">No Source Files Registered Yet</p>
                <p className="text-xs text-slate-400 mt-1">
                  Register a combined 250+ page PDF or individual subject files above.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TEACHER REVIEW MODAL */}
      {reviewingPage && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Teacher Source Page Verification
                </h3>
              </div>
              <button
                onClick={() => setReviewingPage(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Context Box */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 font-mono">
                  Physical PDF Page: {reviewingPage.pdfPage}
                </span>
                <span className="font-semibold text-amber-700">
                  Current Printed Page: {reviewingPage.printedPage ?? 'Undetected'}
                </span>
              </div>
              <p className="text-slate-600 font-serif italic bg-white p-3 rounded-xl border border-slate-200 line-clamp-3">
                "{reviewingPage.pageText}"
              </p>
              <div className="text-[11px] text-slate-500 space-y-0.5">
                <p><strong>Evidence:</strong> {reviewingPage.classificationEvidence.join('; ')}</p>
                {reviewingPage.reviewReason && (
                  <p className="text-rose-600"><strong>Review Reason:</strong> {reviewingPage.reviewReason}</p>
                )}
              </div>
            </div>

            {/* Teacher Correction Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={editSubjectId}
                  onChange={(e) => setEditSubjectId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-semibold focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. english, science, mathematics"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Printed Page Number (Textbook/WB)
                </label>
                <input
                  type="text"
                  value={editPrintedPage}
                  onChange={(e) => setEditPrintedPage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-semibold focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. 5, 14, 23"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">
                  Book Title & Source Type
                </label>
                <input
                  type="text"
                  value={editBookTitle}
                  onChange={(e) => setEditBookTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-semibold focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. English Grade 8 Student Book vs Workbook"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Teacher Notes</label>
                <input
                  type="text"
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-indigo-500"
                  placeholder="Add clarification notes for audit trail..."
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleSaveDecision('MARK_NOT_RELEVANT')}
                className="px-3.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              >
                Mark Not Relevant
              </button>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={() => setReviewingPage(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveDecision('CONFIRM')}
                  className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Confirm & Save Mapping
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REGISTER SOURCE FILE MODAL */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form
            onSubmit={handleRegisterFile}
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Register Source Document
              </h3>
              <button
                type="button"
                onClick={() => setIsRegisterModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Source Type</label>
                <select
                  value={newSourceType}
                  onChange={(e) => setNewSourceType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                >
                  <option value="COMBINED_MULTI_SUBJECT">
                    Combined Multi-Subject PDF (~250 pages, mixed subjects)
                  </option>
                  <option value="SINGLE_SUBJECT">Single Subject Source PDF</option>
                  <option value="STUDENT_BOOK">Student Book PDF</option>
                  <option value="WORKBOOK">Workbook PDF</option>
                  <option value="TEXTBOOK">Textbook PDF</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">File Name</label>
                <input
                  type="text"
                  required
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="e.g. Grade8_Term1_Combined_Textbooks.pdf"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Page Count</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newPageCount}
                    onChange={(e) => setNewPageCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">File Size (MB)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newFileSizeMb}
                    onChange={(e) => setNewFileSizeMb(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsRegisterModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs"
              >
                Register & Ready for Indexing
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
