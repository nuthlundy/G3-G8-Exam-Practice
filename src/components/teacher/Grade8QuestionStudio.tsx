import React, { useState } from 'react';
import {
  TermData,
  Question,
  QuestionType,
  DifficultyLevel,
  ApprovalStatus,
  LearningPoint,
} from '../../types';
import { GRADE_8_SUBJECTS_METADATA } from '../../data/grade8PointerData';
import { QuestionGenerationEngine } from '../../services/questionGenerationEngine';
import { StorageService } from '../../services/storageService';
import {
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  FileText,
  RotateCw,
  Edit3,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  History,
  BookOpen,
  Filter,
  Plus,
  Trash2,
  Lightbulb,
  Lock,
  Bookmark,
  Search,
} from 'lucide-react';

interface Grade8QuestionStudioProps {
  term: TermData;
  onUpdateTerm: (updated: TermData) => void;
}

export const Grade8QuestionStudio: React.FC<Grade8QuestionStudioProps> = ({
  term,
  onUpdateTerm,
}) => {
  const availableSubjects = GRADE_8_SUBJECTS_METADATA.filter(
    (s) => !s.isProjectBased && s.id !== 'kh_history' // Khmer history is 100% excluded/protected
  );

  // Generator form state
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('english');
  const [selectedLearningPointId, setSelectedLearningPointId] = useState<string>('');
  const [selectedQType, setSelectedQType] = useState<QuestionType>('MULTIPLE_CHOICE');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('medium');
  const [batchCount, setBatchCount] = useState<number>(3);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationFeedback, setGenerationFeedback] = useState<string | null>(null);

  // Review & filter state
  const [statusTab, setStatusTab] = useState<
    'all' | 'READY_FOR_APPROVAL' | 'REVIEW_LATER' | 'REJECTED' | 'APPROVED'
  >('all');
  const [filterSubjectId, setFilterSubjectId] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkApproveConfirmOpen, setIsBulkApproveConfirmOpen] = useState<boolean>(false);
  const [expandedAuditId, setExpandedAuditId] = useState<string | null>(null);

  // Edit modal state
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [editPrompt, setEditPrompt] = useState<string>('');
  const [editOptions, setEditOptions] = useState<string[]>([]);
  const [editCorrectAnswer, setEditCorrectAnswer] = useState<string>('');
  const [editExplanation, setEditExplanation] = useState<string>('');
  const [editLessonSummary, setEditLessonSummary] = useState<string>('');
  const [editLearningPoint, setEditLearningPoint] = useState<string>('');
  const [editDifficulty, setEditDifficulty] = useState<DifficultyLevel>('medium');
  const [editQType, setEditQType] = useState<QuestionType>('MULTIPLE_CHOICE');
  const [editTeacherNotes, setEditTeacherNotes] = useState<string>('');

  // Reject modal state
  const [rejectingQuestionId, setRejectingQuestionId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');

  // Eligible learning points for current generator subject
  const currentSubjectLPs = QuestionGenerationEngine.getEligibleLearningPoints(
    term,
    selectedSubjectId
  );

  // Excluded scopes
  const excludedScopes = QuestionGenerationEngine.getExcludedScopes();

  // Questions categorization
  const allQuestions = term.questions || [];

  const approvedQuestions = allQuestions.filter(
    (q) => q.approvalStatus === 'APPROVED' || q.approvalStatus === 'approved'
  );
  const rejectedQuestions = allQuestions.filter(
    (q) => q.approvalStatus === 'REJECTED' || q.approvalStatus === 'rejected'
  );
  const reviewLaterQuestions = allQuestions.filter(
    (q) =>
      q.approvalStatus !== 'APPROVED' &&
      q.approvalStatus !== 'approved' &&
      q.approvalStatus !== 'REJECTED' &&
      q.approvalStatus !== 'rejected' &&
      (q.reviewStatus === 'REVIEW_LATER' || q.reviewAction === 'REVIEW_LATER')
  );
  const readyForApprovalQuestions = allQuestions.filter(
    (q) =>
      q.approvalStatus !== 'APPROVED' &&
      q.approvalStatus !== 'approved' &&
      q.approvalStatus !== 'REJECTED' &&
      q.approvalStatus !== 'rejected' &&
      q.reviewStatus !== 'REVIEW_LATER' &&
      q.reviewAction !== 'REVIEW_LATER'
  );

  // Filtered list based on statusTab, filterSubjectId, and searchTerm
  const displayedQuestions = allQuestions.filter((q) => {
    // Subject filter
    if (filterSubjectId !== 'all' && q.subjectId !== filterSubjectId) return false;

    // Status filter
    if (statusTab === 'READY_FOR_APPROVAL') {
      const match =
        q.approvalStatus !== 'APPROVED' &&
        q.approvalStatus !== 'approved' &&
        q.approvalStatus !== 'REJECTED' &&
        q.approvalStatus !== 'rejected' &&
        q.reviewStatus !== 'REVIEW_LATER' &&
        q.reviewAction !== 'REVIEW_LATER';
      if (!match) return false;
    } else if (statusTab === 'REVIEW_LATER') {
      const match =
        q.approvalStatus !== 'APPROVED' &&
        q.approvalStatus !== 'approved' &&
        q.approvalStatus !== 'REJECTED' &&
        q.approvalStatus !== 'rejected' &&
        (q.reviewStatus === 'REVIEW_LATER' || q.reviewAction === 'REVIEW_LATER');
      if (!match) return false;
    } else if (statusTab === 'REJECTED') {
      if (q.approvalStatus !== 'REJECTED' && q.approvalStatus !== 'rejected') return false;
    } else if (statusTab === 'APPROVED') {
      if (q.approvalStatus !== 'APPROVED' && q.approvalStatus !== 'approved') return false;
    }

    // Search filter: Question ID, question text, learning point, subject, printed page, PDF page
    if (searchTerm.trim()) {
      const termLower = searchTerm.trim().toLowerCase();
      const qId = (q.id || '').toLowerCase();
      const qCustomId = (q.questionId || '').toLowerCase();
      const qText = (q.question || '').toLowerCase();
      const lp = (q.learningPoint || '').toLowerCase();
      const topic = (q.topic || '').toLowerCase();
      const subName = (q.subjectName || '').toLowerCase();
      const subId = (q.subjectId || '').toLowerCase();
      const printed = String(q.printedPage || '').toLowerCase();
      const pdf = String(q.pdfPage || '').toLowerCase();

      const matches =
        qId.includes(termLower) ||
        qCustomId.includes(termLower) ||
        qText.includes(termLower) ||
        lp.includes(termLower) ||
        topic.includes(termLower) ||
        subName.includes(termLower) ||
        subId.includes(termLower) ||
        printed.includes(termLower) ||
        pdf.includes(termLower);

      if (!matches) return false;
    }

    return true;
  });

  // Bulk action handlers
  const handleSelectAllVisible = () => {
    const ids = displayedQuestions.map((q) => q.id);
    setSelectedIds(ids);
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  const handleBulkReviewLater = () => {
    let currentQuestions = [...allQuestions];
    for (const id of selectedIds) {
      currentQuestions = QuestionGenerationEngine.reviewLaterQuestion(
        currentQuestions,
        id,
        'Teacher Reviewer',
        'Flagged via bulk review action.'
      );
    }
    const updatedTerm: TermData = {
      ...term,
      questions: currentQuestions,
    };
    StorageService.updateTerm(updatedTerm);
    onUpdateTerm(updatedTerm);
    setSelectedIds([]);
  };

  const [isBulkRejectModalOpen, setIsBulkRejectModalOpen] = useState(false);
  const [bulkRejectReason, setBulkRejectReason] = useState('Bulk rejected during teacher review.');

  const handleBulkReject = () => {
    let currentQuestions = [...allQuestions];
    for (const id of selectedIds) {
      currentQuestions = QuestionGenerationEngine.rejectQuestion(
        currentQuestions,
        id,
        'Teacher Reviewer',
        bulkRejectReason
      );
    }
    const updatedTerm: TermData = {
      ...term,
      questions: currentQuestions,
    };
    StorageService.updateTerm(updatedTerm);
    onUpdateTerm(updatedTerm);
    setSelectedIds([]);
    setIsBulkRejectModalOpen(false);
  };

  // Handler: Bulk Approve Selected with Safety Rules Check
  const handleBulkApprove = () => {
    // Safety check: block any question from protected unresolved sources
    const protectedViolations: string[] = [];
    const validIdsToApprove: string[] = [];

    for (const id of selectedIds) {
      const q = allQuestions.find((item) => item.id === id);
      if (q) {
        if (q.subjectId === 'kh_history') {
          protectedViolations.push(`${q.id} (Khmer History pages 76-87 are protected/unresolved)`);
        } else if (q.subjectId === 'science' && q.printedPage === 41) {
          protectedViolations.push(`${q.id} (Science Student Book page 41 is protected/unresolved)`);
        } else {
          validIdsToApprove.push(id);
        }
      }
    }

    if (protectedViolations.length > 0) {
      alert(
        `Safety Violation Blocked!\nThe following selected questions cannot be approved because they belong to protected/unresolved sources:\n• ${protectedViolations.join('\n• ')}`
      );
      if (validIdsToApprove.length === 0) {
        setIsBulkApproveConfirmOpen(false);
        return;
      }
    }

    let currentQuestions = [...allQuestions];
    for (const id of validIdsToApprove) {
      const res = QuestionGenerationEngine.approveQuestion(
        currentQuestions,
        id,
        'Teacher Reviewer',
        'Bulk approved by teacher into Active Question Bank.'
      );
      if (!res.error) {
        currentQuestions = res.updatedQuestions;
      }
    }
    const updatedTerm: TermData = {
      ...term,
      questions: currentQuestions,
    };
    StorageService.updateTerm(updatedTerm);
    onUpdateTerm(updatedTerm);
    setSelectedIds([]);
    setIsBulkApproveConfirmOpen(false);
  };

  // Handler: Generate Batch
  const handleGenerateBatch = () => {
    setIsGenerating(true);
    setGenerationFeedback(null);

    try {
      const result = QuestionGenerationEngine.generateDraftBatch({
        term,
        subjectId: selectedSubjectId,
        learningPointId: selectedLearningPointId || undefined,
        questionType: selectedQType,
        difficulty: selectedDifficulty,
        count: batchCount,
        teacherName: 'Teacher Reviewer',
      });

      if (result.errors.length > 0) {
        alert(result.errors.join('\n'));
        setIsGenerating(false);
        return;
      }

      const updatedQuestions = [...allQuestions, ...result.questions];
      const updatedTerm: TermData = {
        ...term,
        questions: updatedQuestions,
      };

      StorageService.updateTerm(updatedTerm);
      onUpdateTerm(updatedTerm);

      setGenerationFeedback(
        `Generated ${result.questions.length} draft question(s) from verified Stage 2 content. Now in Draft Review Queue.`
      );
      setStatusTab('READY_FOR_APPROVAL');
    } catch (e) {
      console.error(e);
      alert('Error generating questions: ' + String(e));
    } finally {
      setIsGenerating(false);
    }
  };

  // Handler: Approve Question
  const handleApprove = (questionId: string) => {
    const result = QuestionGenerationEngine.approveQuestion(
      allQuestions,
      questionId,
      'Teacher Reviewer',
      'Approved into Active Question Bank.'
    );

    if (result.error) {
      alert(result.error);
      return;
    }

    const updatedTerm: TermData = {
      ...term,
      questions: result.updatedQuestions,
    };
    StorageService.updateTerm(updatedTerm);
    onUpdateTerm(updatedTerm);
  };

  // Handler: Open Reject Modal
  const handleOpenReject = (questionId: string) => {
    setRejectingQuestionId(questionId);
    setRejectReason('Question does not adequately reflect learning point.');
  };

  // Handler: Confirm Reject
  const handleConfirmReject = () => {
    if (!rejectingQuestionId) return;
    const updated = QuestionGenerationEngine.rejectQuestion(
      allQuestions,
      rejectingQuestionId,
      'Teacher Reviewer',
      rejectReason
    );
    const updatedTerm: TermData = {
      ...term,
      questions: updated,
    };
    StorageService.updateTerm(updatedTerm);
    onUpdateTerm(updatedTerm);
    setRejectingQuestionId(null);
  };

  // Handler: Review Later
  const handleReviewLater = (questionId: string) => {
    const updated = QuestionGenerationEngine.reviewLaterQuestion(
      allQuestions,
      questionId,
      'Teacher Reviewer',
      'Flagged for subsequent review.'
    );
    const updatedTerm: TermData = {
      ...term,
      questions: updated,
    };
    StorageService.updateTerm(updatedTerm);
    onUpdateTerm(updatedTerm);
  };

  // Handler: Regenerate
  const handleRegenerate = (q: Question) => {
    const lp = (term.learningPoints || []).find((l) => l.id === q.learningPointId);
    if (!lp) {
      alert('Original Stage 2 learning point not found.');
      return;
    }

    const promptFeedback = prompt(
      'Enter feedback or focus for regenerated variant (optional):',
      'Vary distractors and wording'
    );
    if (promptFeedback === null) return;

    const updated = QuestionGenerationEngine.regenerateQuestionVariant(
      allQuestions,
      q.id,
      lp,
      promptFeedback,
      'Teacher Reviewer'
    );
    const updatedTerm: TermData = {
      ...term,
      questions: updated,
    };
    StorageService.updateTerm(updatedTerm);
    onUpdateTerm(updatedTerm);
    alert('Regenerated new question variant. Original audit history preserved.');
  };

  // Handler: Open Edit Modal
  const handleOpenEdit = (q: Question) => {
    setEditingQuestion(q);
    setEditPrompt(q.question);
    setEditOptions(q.options ? [...q.options] : []);
    setEditCorrectAnswer(String(q.correctAnswer || ''));
    setEditExplanation(q.explanation || '');
    setEditLessonSummary(q.lessonSummary || '');
    setEditLearningPoint(q.learningPoint || q.topic || '');
    setEditDifficulty(q.difficulty || 'medium');
    setEditQType(q.questionType || 'MULTIPLE_CHOICE');
    setEditTeacherNotes(q.reviewNotes || '');
  };

  // Handler: Save Edit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion) return;

    const result = QuestionGenerationEngine.editQuestion(
      allQuestions,
      editingQuestion.id,
      {
        question: editPrompt.trim(),
        options: editOptions.length > 0 ? editOptions : undefined,
        correctAnswer: editCorrectAnswer.trim(),
        explanation: editExplanation.trim(),
        lessonSummary: editLessonSummary.trim(),
        learningPoint: editLearningPoint.trim(),
        difficulty: editDifficulty,
        questionType: editQType,
      },
      'Teacher Reviewer',
      editTeacherNotes.trim() || 'Teacher updated question content.',
      {
        pageIndex: term.pageIndex,
        sourceBoundaries: term.sourceBoundaries,
        learningPoints: term.learningPoints,
      }
    );

    const updatedTerm: TermData = {
      ...term,
      questions: result.updatedQuestions,
    };
    StorageService.updateTerm(updatedTerm);
    onUpdateTerm(updatedTerm);
    setEditingQuestion(null);

    if (!result.validationReport.isValid) {
      alert(`Question updated with validation warnings:\n• ${result.validationReport.errors.join('\n• ')}\n\nStatus set to NEEDS_REVIEW until corrected.`);
    }
  };

  // Handler: Return to Ready Queue
  const handleMoveBackToDraft = (questionId: string) => {
    const now = new Date().toISOString();
    const updated = allQuestions.map((q) => {
      if (q.id !== questionId) return q;
      const history = [
        ...(q.auditHistory || []),
        {
          action: 'EDITED' as const,
          timestamp: now,
          performedBy: 'Teacher Reviewer',
          notes: 'Returned question to Ready for Approval queue.',
        },
      ];
      return {
        ...q,
        approvalStatus: 'DRAFT' as const,
        reviewStatus: 'READY_FOR_APPROVAL' as const,
        reviewAction: 'MOVED_TO_DRAFT',
        reviewNotes: 'Moved back to Ready for Approval queue.',
        updatedAt: now,
        auditHistory: history,
      };
    });
    const updatedTerm: TermData = {
      ...term,
      questions: updated,
    };
    StorageService.updateTerm(updatedTerm);
    onUpdateTerm(updatedTerm);
  };

  // Handler: Delete Question
  const handleDeleteQuestion = (questionId: string) => {
    if (confirm('Delete this question draft?')) {
      const updated = allQuestions.filter((q) => q.id !== questionId);
      const updatedTerm: TermData = {
        ...term,
        questions: updated,
      };
      StorageService.updateTerm(updatedTerm);
      onUpdateTerm(updatedTerm);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-200">
              Stage 3 · Question Generation Engine
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-xs font-bold text-slate-500 font-mono">
              Grade 8 · Term 1 Practice
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Grounded Question Generation & Teacher Review Studio
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 max-w-3xl">
            Questions are generated strictly from verified Stage 2 Learning Points. All newly generated questions arrive as Drafts and require explicit Teacher Approval before entering the Active Question Bank.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-mono text-xs font-bold">
            Total Questions: {allQuestions.length}
          </span>
        </div>
      </div>

      {/* 2. GRADE 8 TERM 1 — SUBJECT APPROVAL & PRACTICE TEST READINESS BOARD */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900">
                Grade 8 Term 1 — Subject Approval & Practice Test Readiness
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Practice test creation requires approved questions. Click any subject card below to filter and rapid-approve questions.
            </p>
          </div>

          {/* Aggregate Totals Summary */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold">
            <span className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-900 border border-indigo-200">
              Awaiting Approval: {readyForApprovalQuestions.length}
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200">
              Approved: {approvedQuestions.length}
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200">
              Needs Review: {reviewLaterQuestions.length}
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-900 border border-rose-200">
              Rejected: {rejectedQuestions.length}
            </span>
          </div>
        </div>

        {/* 10 Subject Status Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {[
            { id: 'english', name: 'English', target: 19 },
            { id: 'science', name: 'Science', target: 34 },
            { id: 'mathematics', name: 'Mathematics', target: 156 },
            { id: 'kh_literature', name: 'Khmer Literature', target: 46 },
            { id: 'kh_algebra_geometry', name: 'Khmer Algebra/Geom', target: 72 },
            { id: 'kh_physics', name: 'Khmer Physics', target: 32 },
            { id: 'kh_chemistry', name: 'Khmer Chemistry', target: 22 },
            { id: 'kh_biology', name: 'Khmer Biology', target: 38 },
            { id: 'kh_civic', name: 'Khmer Civic', target: 66 },
            { id: 'kh_history', name: 'Khmer History', target: 0, isProtected: true },
          ].map((sub) => {
            const subQuestions = allQuestions.filter((q) => q.subjectId === sub.id);
            const subApproved = subQuestions.filter(
              (q) => q.approvalStatus === 'approved' || q.approvalStatus === 'APPROVED'
            ).length;
            const subAwaiting = subQuestions.filter(
              (q) =>
                q.approvalStatus !== 'approved' &&
                q.approvalStatus !== 'APPROVED' &&
                q.approvalStatus !== 'rejected' &&
                q.approvalStatus !== 'REJECTED'
            ).length;

            const isTestReady = subApproved >= 10;
            const isSelected = filterSubjectId === sub.id;

            return (
              <div
                key={sub.id}
                onClick={() => {
                  if (!sub.isProtected) {
                    setFilterSubjectId(isSelected ? 'all' : sub.id);
                  }
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 relative overflow-hidden ${
                  sub.isProtected
                    ? 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed'
                    : isSelected
                    ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-400 shadow-sm'
                    : isTestReady
                    ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-400'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 truncate">{sub.name}</span>
                  {sub.isProtected ? (
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                  ) : isTestReady ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                  )}
                </div>

                {sub.isProtected ? (
                  <div className="text-[10px] text-slate-500 italic">
                    Protected / Unresolved (Pages 76–87)
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-500">Approved:</span>
                      <span className="font-bold text-emerald-700">{subApproved} / {subQuestions.length}</span>
                    </div>

                    <div className="text-[10px] font-mono text-indigo-700 font-bold">
                      {subAwaiting} awaiting approval
                    </div>

                    <div className="pt-1">
                      {isTestReady ? (
                        <span className="inline-block w-full text-center px-2 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-bold text-[9px] uppercase border border-emerald-300">
                          ✓ Ready for Test Generation
                        </span>
                      ) : (
                        <span className="inline-block w-full text-center px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 font-semibold text-[9px]">
                          Waiting for Approval ({subApproved}/10)
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div
          onClick={() => setStatusTab('all')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-2xs ${
            statusTab === 'all'
              ? 'bg-slate-900 text-white border-slate-900 ring-2 ring-slate-400'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold uppercase ${statusTab === 'all' ? 'text-slate-300' : 'text-slate-500'}`}>
              Total Questions
            </span>
            <FileText className={`w-4 h-4 ${statusTab === 'all' ? 'text-slate-300' : 'text-slate-400'}`} />
          </div>
          <span className={`text-2xl font-black block mt-1 ${statusTab === 'all' ? 'text-white' : 'text-slate-900'}`}>
            {allQuestions.length}
          </span>
          <span className={`text-[10px] ${statusTab === 'all' ? 'text-slate-300' : 'text-slate-400'}`}>
            Full Grade 8 Bank
          </span>
        </div>

        <div
          onClick={() => setStatusTab('READY_FOR_APPROVAL')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-2xs ${
            statusTab === 'READY_FOR_APPROVAL'
              ? 'bg-indigo-600 text-white border-indigo-600 ring-2 ring-indigo-400'
              : 'bg-indigo-50/50 border-indigo-200 hover:border-indigo-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold uppercase ${statusTab === 'READY_FOR_APPROVAL' ? 'text-indigo-100' : 'text-indigo-800'}`}>
              Ready for Approval
            </span>
            <Clock className={`w-4 h-4 ${statusTab === 'READY_FOR_APPROVAL' ? 'text-indigo-200' : 'text-indigo-600'}`} />
          </div>
          <span className={`text-2xl font-black block mt-1 ${statusTab === 'READY_FOR_APPROVAL' ? 'text-white' : 'text-indigo-900'}`}>
            {readyForApprovalQuestions.length}
          </span>
          <span className={`text-[10px] ${statusTab === 'READY_FOR_APPROVAL' ? 'text-indigo-100' : 'text-indigo-700'}`}>
            Awaiting explicit approval
          </span>
        </div>

        <div
          onClick={() => setStatusTab('REVIEW_LATER')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-2xs ${
            statusTab === 'REVIEW_LATER'
              ? 'bg-amber-600 text-white border-amber-600 ring-2 ring-amber-400'
              : 'bg-amber-50/50 border-amber-200 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold uppercase ${statusTab === 'REVIEW_LATER' ? 'text-amber-100' : 'text-amber-800'}`}>
              Review Later
            </span>
            <Bookmark className={`w-4 h-4 ${statusTab === 'REVIEW_LATER' ? 'text-amber-200' : 'text-amber-600'}`} />
          </div>
          <span className={`text-2xl font-black block mt-1 ${statusTab === 'REVIEW_LATER' ? 'text-white' : 'text-amber-900'}`}>
            {reviewLaterQuestions.length}
          </span>
          <span className={`text-[10px] ${statusTab === 'REVIEW_LATER' ? 'text-amber-100' : 'text-amber-700'}`}>
            Flagged for follow-up
          </span>
        </div>

        <div
          onClick={() => setStatusTab('REJECTED')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-2xs ${
            statusTab === 'REJECTED'
              ? 'bg-rose-600 text-white border-rose-600 ring-2 ring-rose-400'
              : 'bg-rose-50/50 border-rose-200 hover:border-rose-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold uppercase ${statusTab === 'REJECTED' ? 'text-rose-100' : 'text-rose-800'}`}>
              Rejected
            </span>
            <XCircle className={`w-4 h-4 ${statusTab === 'REJECTED' ? 'text-rose-200' : 'text-rose-600'}`} />
          </div>
          <span className={`text-2xl font-black block mt-1 ${statusTab === 'REJECTED' ? 'text-white' : 'text-rose-900'}`}>
            {rejectedQuestions.length}
          </span>
          <span className={`text-[10px] ${statusTab === 'REJECTED' ? 'text-rose-100' : 'text-rose-700'}`}>
            Excluded from bank
          </span>
        </div>

        <div
          onClick={() => setStatusTab('APPROVED')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-2xs ${
            statusTab === 'APPROVED'
              ? 'bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-400'
              : 'bg-emerald-50/50 border-emerald-200 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold uppercase ${statusTab === 'APPROVED' ? 'text-emerald-100' : 'text-emerald-800'}`}>
              Approved Bank
            </span>
            <CheckCircle2 className={`w-4 h-4 ${statusTab === 'APPROVED' ? 'text-emerald-200' : 'text-emerald-600'}`} />
          </div>
          <span className={`text-2xl font-black block mt-1 ${statusTab === 'APPROVED' ? 'text-white' : 'text-emerald-900'}`}>
            {approvedQuestions.length}
          </span>
          <span className={`text-[10px] ${statusTab === 'APPROVED' ? 'text-emerald-100' : 'text-emerald-700'}`}>
            Active for practice
          </span>
        </div>
      </div>

      {/* 3. Protected Scope Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 shadow-xs flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 space-y-1">
          <p className="font-bold">PROTECTED UNRESOLVED SCOPES (Question Generation Strictly Blocked):</p>
          <div className="flex flex-wrap gap-2 text-[11px]">
            {excludedScopes.map((s, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 bg-amber-100/80 border border-amber-300 rounded-lg font-mono"
              >
                {s.subjectName}: {s.scopeDescription} ({s.status})
              </span>
            ))}
          </div>
          <p className="text-[10px] text-amber-700">
            Zero synthetic or invented questions will ever be generated for missing scans.
          </p>
        </div>
      </div>

      {/* 4. CONTROLLED BATCH GENERATION STUDIO */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">
              Controlled Batch Question Generator
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Controlled batch: 1 to 10 questions per run
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Subject */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Target Subject:</label>
            <select
              value={selectedSubjectId}
              onChange={(e) => {
                setSelectedSubjectId(e.target.value);
                setSelectedLearningPointId('');
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-indigo-500"
            >
              {availableSubjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          {/* Specific Learning Point or Topic */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Stage 2 Learning Point ({currentSubjectLPs.length} available):
            </label>
            <select
              value={selectedLearningPointId}
              onChange={(e) => setSelectedLearningPointId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Learning Points (Balanced Topic Rotation)</option>
              {currentSubjectLPs.map((lp) => (
                <option key={lp.id} value={lp.id}>
                  p.{lp.printedPage} (PDF {lp.pdfPage}) — {lp.topic.slice(0, 40)}...
                </option>
              ))}
            </select>
          </div>

          {/* Question Type */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Question Format:</label>
            <select
              value={selectedQType}
              onChange={(e) => setSelectedQType(e.target.value as QuestionType)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-indigo-500"
            >
              <option value="MULTIPLE_CHOICE">Multiple Choice (4 Options)</option>
              <option value="TRUE_FALSE">True / False</option>
              <option value="SHORT_ANSWER">Short Answer / Definition</option>
              <option value="NUMERICAL_RESPONSE">Numerical / Problem Solving</option>
              <option value="FILL_IN_THE_BLANK">Fill in the Blank</option>
              <option value="MATCHING">Matching Concepts</option>
              <option value="SEQUENCE">Sequential Order</option>
            </select>
          </div>

          {/* Difficulty & Count */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Difficulty:</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value as DifficultyLevel)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Batch Count:</label>
              <select
                value={batchCount}
                onChange={(e) => setBatchCount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium"
              >
                <option value={1}>1 Question</option>
                <option value={3}>3 Questions</option>
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>
              Inherits Stage 2 non-hint lesson reminders. Automatically validates before saving.
            </span>
          </div>

          <button
            type="button"
            disabled={isGenerating || currentSubjectLPs.length === 0}
            onClick={handleGenerateBatch}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin" />
                <span>Generating Drafts...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate {batchCount} Draft Question(s)</span>
              </>
            )}
          </button>
        </div>

        {generationFeedback && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center justify-between">
            <span>{generationFeedback}</span>
            <button
              onClick={() => setGenerationFeedback(null)}
              className="text-emerald-600 hover:text-emerald-900"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* 5. TEACHER REVIEW STUDIO & QUESTION BANK */}
      <div className="space-y-4">
        {/* Navigation Tabs & Subject Filter */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto">
            <button
              onClick={() => setStatusTab('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                statusTab === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All ({allQuestions.length})
            </button>
            <button
              onClick={() => setStatusTab('READY_FOR_APPROVAL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                statusTab === 'READY_FOR_APPROVAL'
                  ? 'bg-indigo-600 text-white'
                  : 'text-indigo-700 hover:bg-indigo-50'
              }`}
            >
              <Clock className="w-3 h-3" />
              <span>Ready for Approval ({readyForApprovalQuestions.length})</span>
            </button>
            <button
              onClick={() => setStatusTab('REVIEW_LATER')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                statusTab === 'REVIEW_LATER'
                  ? 'bg-amber-600 text-white'
                  : 'text-amber-700 hover:bg-amber-50'
              }`}
            >
              <Bookmark className="w-3 h-3" />
              <span>Review Later ({reviewLaterQuestions.length})</span>
            </button>
            <button
              onClick={() => setStatusTab('REJECTED')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                statusTab === 'REJECTED'
                  ? 'bg-rose-600 text-white'
                  : 'text-rose-700 hover:bg-rose-50'
              }`}
            >
              <XCircle className="w-3 h-3" />
              <span>Rejected ({rejectedQuestions.length})</span>
            </button>
            <button
              onClick={() => setStatusTab('APPROVED')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                statusTab === 'APPROVED'
                  ? 'bg-emerald-600 text-white'
                  : 'text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Approved ({approvedQuestions.length})</span>
            </button>
          </div>

          {/* Search & Subject Filter Bar */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by ID, prompt, topic, page..."
                className="w-full pl-8 pr-7 py-1.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Subject Filter */}
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filterSubjectId}
                onChange={(e) => setFilterSubjectId(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700"
              >
                <option value="all">Filter: All Subjects ({allQuestions.length})</option>
                {availableSubjects.map((s) => {
                  const count = allQuestions.filter((q) => q.subjectId === s.id).length;
                  return (
                    <option key={s.id} value={s.id}>
                      {s.name} ({count})
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>

        {/* Rapid Selection & Bulk Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={handleSelectAllVisible}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 font-bold text-slate-700 rounded-xl transition-colors cursor-pointer shadow-2xs"
            >
              Select All Visible ({displayedQuestions.length})
            </button>
            {selectedIds.length > 0 && (
              <button
                type="button"
                onClick={handleClearSelection}
                className="px-3 py-1.5 text-slate-500 hover:text-slate-800 underline font-semibold cursor-pointer"
              >
                Clear Selection
              </button>
            )}
            <span className="text-slate-400">|</span>
            <span className="font-bold text-slate-800">
              {selectedIds.length} question(s) selected
            </span>
          </div>

          {selectedIds.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleBulkReviewLater}
                className="px-3.5 py-1.5 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <Bookmark className="w-3.5 h-3.5 text-amber-600" />
                <span>Review Later ({selectedIds.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setIsBulkRejectModalOpen(true)}
                className="px-3.5 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-300 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                <span>Reject Selected ({selectedIds.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setIsBulkApproveConfirmOpen(true)}
                className="px-4 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approve Selected ({selectedIds.length})</span>
              </button>
            </div>
          )}
        </div>

        {/* Question Cards List */}
        {displayedQuestions.length > 0 ? (
          <div className="space-y-4">
            {displayedQuestions.map((q) => {
              const isAuditExpanded = expandedAuditId === q.id;
              const isApproved = q.approvalStatus === 'APPROVED' || q.approvalStatus === 'approved';
              const isRejected = q.approvalStatus === 'REJECTED' || q.approvalStatus === 'rejected';
              const isReviewLater =
                !isApproved &&
                !isRejected &&
                (q.reviewStatus === 'REVIEW_LATER' || q.reviewAction === 'REVIEW_LATER');
              const isReadyForApproval = !isApproved && !isRejected && !isReviewLater;

              return (
                <div
                  key={q.id}
                  className={`bg-white rounded-3xl border p-6 shadow-xs space-y-4 transition-all ${
                    isApproved
                      ? 'border-emerald-200'
                      : isRejected
                      ? 'border-rose-200 bg-rose-50/10'
                      : isReviewLater
                      ? 'border-amber-200 bg-amber-50/10'
                      : 'border-slate-200'
                  }`}
                >
                  {/* Top Bar: Badges & Source Citation */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(q.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedIds((prev) => [...prev, q.id]);
                          } else {
                            setSelectedIds((prev) => prev.filter((id) => id !== q.id));
                          }
                        }}
                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        title="Select question"
                      />
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-900 text-white">
                        {q.subjectName || q.subjectId}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-amber-50 text-amber-900 border border-amber-200">
                        Printed Page {q.printedPage}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        PDF Page {q.pdfPage}
                      </span>
                      {q.alternatePdfPages && q.alternatePdfPages.length > 0 && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono text-purple-700 bg-purple-50 border border-purple-200">
                          + Alternate Scans: PDF pp. {q.alternatePdfPages.join(', ')}
                        </span>
                      )}
                      <span className="text-xs text-slate-600 font-semibold">
                        {q.bookTitle}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {q.questionType}
                      </span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {q.difficulty}
                      </span>
                      <span
                        className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border flex items-center gap-1 ${
                          isApproved
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            : isRejected
                            ? 'bg-rose-100 text-rose-900 border-rose-300'
                            : isReviewLater
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : 'bg-indigo-100 text-indigo-900 border-indigo-300'
                        }`}
                      >
                        {isApproved && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {isRejected && <XCircle className="w-3 h-3 text-rose-600" />}
                        {isReviewLater && <Bookmark className="w-3 h-3 text-amber-600" />}
                        {isReadyForApproval && <Clock className="w-3 h-3 text-indigo-600" />}
                        <span>
                          {isApproved
                            ? 'APPROVED'
                            : isRejected
                            ? 'REJECTED'
                            : isReviewLater
                            ? 'REVIEW LATER'
                            : 'READY FOR TEACHER APPROVAL'}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Question Content Block */}
                  <div className="space-y-3">
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                      {q.question}
                    </h4>

                    {/* Options list if multiple choice */}
                    {q.options && q.options.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {q.options.map((opt, oIdx) => {
                          const isCorrect =
                            String(opt).trim().toLowerCase() ===
                            String(q.correctAnswer).trim().toLowerCase();
                          return (
                            <div
                              key={oIdx}
                              className={`p-2.5 rounded-xl border flex items-center justify-between ${
                                isCorrect
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                                  : 'bg-slate-50 border-slate-200 text-slate-700'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-white border flex items-center justify-center text-[10px] font-bold text-slate-600">
                                  {String.fromCharCode(65 + oIdx)}
                                </span>
                                <span>{opt}</span>
                              </div>
                              {isCorrect && (
                                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-200 text-emerald-900">
                                  Correct Answer
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Correct answer display */}
                    <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                      <div>
                        <span className="font-bold">Designated Correct Answer:</span>{' '}
                        <span className="font-mono font-bold">{String(q.correctAnswer)}</span>
                      </div>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-200 text-emerald-800">
                        Verified Answer
                      </span>
                    </div>

                    {/* Explanation */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                      <span className="font-bold text-slate-900 block">Explanation:</span>
                      <p>{q.explanation}</p>
                    </div>
                  </div>

                  {/* Context Accordion: Learning Point, Lesson Reminder, Source Evidence */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
                    <div className="p-3 bg-indigo-50/30 rounded-xl border border-indigo-100 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-indigo-700 block">
                        STAGE 2 LEARNING POINT
                      </span>
                      <p className="text-slate-800 font-medium">{q.learningPoint || q.topic}</p>
                    </div>

                    <div className="p-3 bg-purple-50/30 rounded-xl border border-purple-100 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-purple-700 block">
                        STUDENT LESSON REMINDER (Non-Hint)
                      </span>
                      <p className="text-slate-800 italic">"{q.lessonSummary}"</p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-slate-500 block">
                        DIRECT SOURCE EVIDENCE
                      </span>
                      <p className="text-slate-600 font-serif italic text-[11px]">
                        "{q.sourceEvidence?.[0] || 'Textbook verified curriculum page'}"
                      </p>
                    </div>
                  </div>

                  {/* Status Notices */}
                  {isRejected && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block">Rejection Reason:</span>
                        <p>{q.rejectionReason || q.reviewNotes || 'Does not meet academic approval requirements.'}</p>
                      </div>
                    </div>
                  )}

                  {isReviewLater && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                      <Bookmark className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block">Flagged for Review Later:</span>
                        <p>{q.reviewNotes || 'Teacher marked this question for subsequent review.'}</p>
                      </div>
                    </div>
                  )}

                  {q.changeLog && q.changeLog.length > 0 && (
                    <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2">
                      <Edit3 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Recent Teacher Edits:</span>{' '}
                        <span>{q.changeLog.join(' • ')}</span>
                      </div>
                    </div>
                  )}

                  {/* Audit Trail Toggle */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setExpandedAuditId(isAuditExpanded ? null : q.id)}
                      className="text-[11px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                    >
                      <History className="w-3.5 h-3.5" />
                      <span>Audit Trail ({q.auditHistory?.length || 1} entries)</span>
                      {isAuditExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    {isAuditExpanded && q.auditHistory && (
                      <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                        {q.auditHistory.map((h, hIdx) => (
                          <div key={hIdx} className="border-b border-slate-200/60 pb-1.5 last:border-none">
                            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                              <span className="font-bold text-slate-800 uppercase">{h.action}</span>
                              <span>{new Date(h.timestamp).toLocaleString()}</span>
                            </div>
                            <p className="text-slate-600 text-[11px]">{h.notes}</p>
                            {h.rejectionReason && (
                              <p className="text-rose-700 text-[10px] font-semibold">Reason: {h.rejectionReason}</p>
                            )}
                            {h.changeLog && h.changeLog.length > 0 && (
                              <p className="text-blue-700 text-[10px]">Changes: {h.changeLog.join('; ')}</p>
                            )}
                            <span className="text-[10px] text-slate-400">By: {h.performedBy}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Teacher Action Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(q)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {isReadyForApproval && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleReviewLater(q.id)}
                            className="px-3.5 py-1.5 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                          >
                            <Bookmark className="w-3.5 h-3.5 text-amber-600" />
                            <span>Review Later</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenReject(q.id)}
                            className="px-3.5 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-300 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                          >
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                            <span>Reject</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleApprove(q.id)}
                            className="px-4 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-100" />
                            <span>Approve & Move to Bank</span>
                          </button>
                        </>
                      )}

                      {isReviewLater && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleMoveBackToDraft(q.id)}
                            className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl cursor-pointer"
                          >
                            <span>Return to Ready Queue</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenReject(q.id)}
                            className="px-3.5 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-300 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                          >
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                            <span>Reject</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleApprove(q.id)}
                            className="px-4 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-100" />
                            <span>Approve & Move to Bank</span>
                          </button>
                        </>
                      )}

                      {isRejected && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleReviewLater(q.id)}
                            className="px-3.5 py-1.5 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Bookmark className="w-3.5 h-3.5 text-amber-600" />
                            <span>Review Later</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveBackToDraft(q.id)}
                            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                          >
                            <span>Return to Ready Queue</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleApprove(q.id)}
                            className="px-4 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-100" />
                            <span>Approve & Move to Bank</span>
                          </button>
                        </>
                      )}

                      {isApproved && (
                        <>
                          <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>In Active Question Bank</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleReviewLater(q.id)}
                            className="px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl cursor-pointer"
                            title="Withdraw from bank to review later"
                          >
                            <span>Withdraw to Review Later</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 space-y-2">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-700">
              No questions in this view
            </h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {allQuestions.length === 0
                ? 'Question Bank is currently 0. The Question Generation Engine is READY. Use the Controlled Batch Generator above to generate practice questions from verified learning points.'
                : 'No questions match the current filter criteria.'}
            </p>
          </div>
        )}
      </div>

      {/* TEACHER EDIT QUESTION MODAL */}
      {editingQuestion && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form
            onSubmit={handleSaveEdit}
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Teacher Question Editor
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingQuestion(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Locked Source Provenance Section */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span>Source Provenance (Anchored & Locked)</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[10px]">Subject:</span>
                  <span className="font-bold text-slate-800">{editingQuestion.subjectName || editingQuestion.subjectId}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Printed Page:</span>
                  <span className="font-mono font-bold text-slate-800">Page {editingQuestion.printedPage}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Physical PDF Page:</span>
                  <span className="font-mono font-bold text-slate-800">PDF Page {editingQuestion.pdfPage}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Source Book:</span>
                  <span className="font-bold text-slate-800 truncate block">{editingQuestion.bookTitle}</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 italic">
                Source metadata is strictly anchored to the Exam Pointer and verified textbook scans to protect curriculum fidelity.
              </p>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Question Prompt */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Question Prompt:</label>
                <textarea
                  rows={3}
                  required
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Format & Difficulty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Question Format:</label>
                  <select
                    value={editQType}
                    onChange={(e) => setEditQType(e.target.value as QuestionType)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium"
                  >
                    <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                    <option value="TRUE_FALSE">True / False</option>
                    <option value="SHORT_ANSWER">Short Answer</option>
                    <option value="NUMERICAL_RESPONSE">Numerical Response</option>
                    <option value="FILL_IN_THE_BLANK">Fill in the Blank</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Difficulty Level:</label>
                  <select
                    value={editDifficulty}
                    onChange={(e) => setEditDifficulty(e.target.value as DifficultyLevel)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              {/* Options if Multiple Choice */}
              {(editQType === 'MULTIPLE_CHOICE' || editQType === 'multiple_choice') && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block font-bold text-slate-700">
                      Multiple Choice Options (Select radio to set Correct Answer):
                    </label>
                    {editOptions.length < 6 && (
                      <button
                        type="button"
                        onClick={() => setEditOptions([...editOptions, ''])}
                        className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Option</span>
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {editOptions.map((opt, idx) => {
                      const isCorrect = String(opt).trim().toLowerCase() === String(editCorrectAnswer).trim().toLowerCase();
                      return (
                        <div key={idx} className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setEditCorrectAnswer(opt)}
                            className={`w-7 h-7 rounded-lg border text-xs font-bold flex items-center justify-center transition-colors cursor-pointer ${
                              isCorrect
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-slate-50 text-slate-600 border-slate-300 hover:bg-slate-100'
                            }`}
                            title="Set as correct answer"
                          >
                            {String.fromCharCode(65 + idx)}
                          </button>
                          <input
                            type="text"
                            required
                            value={opt}
                            onChange={(e) => {
                              const copy = [...editOptions];
                              const oldVal = copy[idx];
                              copy[idx] = e.target.value;
                              setEditOptions(copy);
                              if (editCorrectAnswer === oldVal) {
                                setEditCorrectAnswer(e.target.value);
                              }
                            }}
                            className={`flex-1 px-3 py-1.5 rounded-lg border ${
                              isCorrect ? 'border-emerald-400 bg-emerald-50/30' : 'border-slate-300'
                            }`}
                          />
                          {editOptions.length > 2 && (
                            <button
                              type="button"
                              onClick={() => {
                                const copy = editOptions.filter((_, oIdx) => oIdx !== idx);
                                setEditOptions(copy);
                                if (editCorrectAnswer === opt && copy.length > 0) {
                                  setEditCorrectAnswer(copy[0]);
                                }
                              }}
                              className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                              title="Remove option"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Correct Answer */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Designated Correct Answer:</label>
                <input
                  type="text"
                  required
                  value={editCorrectAnswer}
                  onChange={(e) => setEditCorrectAnswer(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold bg-slate-50"
                />
              </div>

              {/* Explanation */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Explanation (Pedagogical Solution):</label>
                <textarea
                  rows={2}
                  required
                  value={editExplanation}
                  onChange={(e) => setEditExplanation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              {/* Student Lesson Reminder */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Student Lesson Reminder (Non-Hint Concept Reminder):
                </label>
                <textarea
                  rows={2}
                  required
                  value={editLessonSummary}
                  onChange={(e) => setEditLessonSummary(e.target.value)}
                  placeholder="Conceptual summary from textbook..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Must remain conceptual and must NEVER reveal or point directly to the answer.
                </span>
              </div>

              {/* Stage 2 Learning Point Text */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Stage 2 Learning Point Text:
                </label>
                <textarea
                  rows={2}
                  required
                  value={editLearningPoint}
                  onChange={(e) => setEditLearningPoint(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              {/* Teacher Notes / Audit Reason */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Teacher Notes / Reason for Edit:
                </label>
                <input
                  type="text"
                  value={editTeacherNotes}
                  onChange={(e) => setEditTeacherNotes(e.target.value)}
                  placeholder="e.g., Improved option clarity, refined reminder..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingQuestion(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Save & Validate Changes</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* REJECT QUESTION MODAL */}
      {rejectingQuestionId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-600" />
                <h3 className="text-base font-bold text-slate-900">Reject Question</h3>
              </div>
              <button
                type="button"
                onClick={() => setRejectingQuestionId(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target question context */}
            {(() => {
              const target = allQuestions.find((q) => q.id === rejectingQuestionId);
              if (!target) return null;
              return (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between font-mono text-[10px] text-slate-500">
                    <span className="font-bold text-slate-800">{target.subjectName || target.subjectId}</span>
                    <span>Printed Page {target.printedPage} (PDF p.{target.pdfPage})</span>
                  </div>
                  <p className="text-slate-800 font-semibold line-clamp-2">
                    "{target.question}"
                  </p>
                </div>
              );
            })()}

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Reason for Rejection:</label>
                <textarea
                  rows={3}
                  required
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="State why this question is rejected from the bank..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <span className="block font-semibold text-slate-500 text-[11px] mb-1.5">
                  Quick-Select Reason Chips:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Does not align with learning point',
                    'Distractors ambiguous or duplicate',
                    'Answer key error',
                    'Lesson reminder answer leakage',
                    'Ambiguous question wording',
                  ].map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setRejectReason(chip)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-medium transition-colors cursor-pointer"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRejectingQuestionId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-5 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                <span>Confirm Rejection</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BULK APPROVAL CONFIRMATION MODAL */}
      {isBulkApproveConfirmOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900">
                Confirm Teacher Bulk Approval
              </h3>
            </div>

            <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-2 text-xs text-emerald-950">
              <p className="font-bold">
                You are approving {selectedIds.length} questions for this subject.
              </p>
              <p>All selected questions have passed automated validation.</p>
              <p className="font-semibold text-emerald-800">
                Teacher approval is still required. Continue?
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsBulkApproveConfirmOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkApprove}
                className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Approval ({selectedIds.length})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BULK REJECT MODAL */}
      {isBulkRejectModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Bulk Reject {selectedIds.length} Question(s)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsBulkRejectModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Reason for Rejection:</label>
                <textarea
                  rows={3}
                  required
                  value={bulkRejectReason}
                  onChange={(e) => setBulkRejectReason(e.target.value)}
                  placeholder="State why these questions are rejected..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsBulkRejectModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkReject}
                className="px-5 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                <span>Confirm Bulk Rejection ({selectedIds.length})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
