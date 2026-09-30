import React, { useState } from 'react';
import {
  TermData,
  Question,
  SubjectId,
  QuestionType,
  DifficultyLevel,
  ApprovalStatus,
} from '../../types';
import { SUBJECTS_METADATA } from '../../data/term1Data';
import {
  Sparkles,
  CheckCircle,
  XCircle,
  Edit2,
  Trash2,
  RefreshCw,
  Plus,
  BookOpen,
  Filter,
  Check,
  X,
  FileQuestion,
  AlertCircle,
} from 'lucide-react';
import { AIService } from '../../services/aiService';
import { StorageService } from '../../services/storageService';
import { PipelineValidator } from '../../services/pipelineValidator';
import { Grade8QuestionStudio } from './Grade8QuestionStudio';

interface QuestionBankManagerProps {
  term: TermData;
  onUpdateTerm: (updated: TermData) => void;
}

export const QuestionBankManager: React.FC<QuestionBankManagerProps> = ({
  term,
  onUpdateTerm,
}) => {
  // Grade 8: Route to Stage 3 Grounded Question Generation Engine & Review Studio
  if (term.grade === 'Grade 8') {
    return <Grade8QuestionStudio term={term} onUpdateTerm={onUpdateTerm} />;
  }

  const [selectedSubjectId, setSelectedSubjectId] = useState<SubjectId>('mathematics');
  const [statusFilter, setStatusFilter] = useState<ApprovalStatus | 'all'>('all');
  const [isGeneratorModalOpen, setIsGeneratorModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [validationError, setValidationError] = useState<{ questionId: string; errors: string[] } | null>(null);

  // Generator form parameters
  const [genCount, setGenCount] = useState<number>(3);
  const [genDifficulty, setGenDifficulty] = useState<DifficultyLevel>('medium');
  const [genTypes, setGenTypes] = useState<QuestionType[]>(['multiple_choice', 'true_false']);

  const currentSubject = SUBJECTS_METADATA.find((s) => s.id === selectedSubjectId)!;
  const availableSubjects = SUBJECTS_METADATA.filter((s) => !s.isProjectBased);

  // Confirmed source pages for this subject
  const confirmedPages = term.sourcePages.filter(
    (p) => p.subjectId === selectedSubjectId && p.status === 'confirmed'
  );

  // Filter questions
  const questions = term.questions.filter((q) => {
    const matchSubject = q.subjectId === selectedSubjectId;
    const matchStatus = statusFilter === 'all' || q.approvalStatus === statusFilter;
    return matchSubject && matchStatus;
  });

  const handleUpdateApproval = (questionId: string, status: ApprovalStatus) => {
    if (status === 'approved') {
      const targetQ = term.questions.find((q) => q.id === questionId);
      if (targetQ) {
        const validation = PipelineValidator.validateQuestionForApproval(
          targetQ,
          term.pageIndex,
          term.sourceBoundaries
        );
        if (!validation.isValid) {
          setValidationError({
            questionId,
            errors: validation.errors,
          });
          return;
        }
      }
    }

    setValidationError((prev) => (prev?.questionId === questionId ? null : prev));
    const updated = term.questions.map((q) =>
      q.id === questionId ? { ...q, approvalStatus: status } : q
    );
    const updatedTerm = { ...term, questions: updated };
    StorageService.updateTerm(updatedTerm);
    onUpdateTerm(updatedTerm);
  };

  const handleDeleteQuestion = (questionId: string) => {
    const updated = term.questions.filter((q) => q.id !== questionId);
    const updatedTerm = { ...term, questions: updated };
    StorageService.updateTerm(updatedTerm);
    onUpdateTerm(updatedTerm);
  };

  const handleSaveQuestionEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion) return;

    if (editingQuestion.approvalStatus === 'approved') {
      const validation = PipelineValidator.validateQuestionForApproval(
        editingQuestion,
        term.pageIndex,
        term.sourceBoundaries
      );
      if (!validation.isValid) {
        alert(
          `Cannot approve question under the Final Content Pipeline rules:\n\n• ${validation.errors.join('\n• ')}\n\nQuestion status will remain 'pending' until all source & lesson reminder requirements are met.`
        );
        editingQuestion.approvalStatus = 'pending';
      }
    }

    const updated = term.questions.map((q) =>
      q.id === editingQuestion.id ? editingQuestion : q
    );
    const updatedTerm = { ...term, questions: updated };
    StorageService.updateTerm(updatedTerm);
    onUpdateTerm(updatedTerm);
    setEditingQuestion(null);
  };

  const handleGenerateQuestions = async () => {
    if (term.grade === 'Grade 8') {
      alert('GRADE 8 QUESTION GENERATION STATUS: 0 — LOCKED. Source mapping review and coverage verification must be completed first.');
      return;
    }

    if (confirmedPages.length === 0) {
      alert('Please confirm at least one source page before generating questions.');
      return;
    }

    setIsGenerating(true);
    try {
      const printedPages = confirmedPages.map((p) => p.printedPageNumber);
      const pdfPages = confirmedPages.map((p) => p.pdfPageNumber);
      const topic = confirmedPages[0]?.topic || 'Curriculum Concepts';
      const extractedSummary = confirmedPages
        .map((p) => `Page ${p.printedPageNumber} (${p.topic}): ${p.ocrExcerpt}`)
        .join('\n');

      const generated = await AIService.generateQuestions({
        termId: term.id,
        subjectId: selectedSubjectId,
        subjectName: currentSubject.name,
        topic,
        printedPages,
        pdfPages,
        extractedContentSummary: extractedSummary,
        count: genCount,
        questionTypes: genTypes,
        difficulty: genDifficulty,
        language: currentSubject.language,
        bookTitle: currentSubject.bookTitle,
        grade: term.grade || 'Grade 3',
        academicYear: term.academicYear || '2026-2027',
      });

      const updatedQuestions = [...term.questions, ...generated];
      const updatedTerm = { ...term, questions: updatedQuestions };
      StorageService.updateTerm(updatedTerm);
      onUpdateTerm(updatedTerm);
      setIsGeneratorModalOpen(false);
    } catch (e) {
      console.error('Generation error:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleType = (type: QuestionType) => {
    setGenTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      {term.grade === 'Grade 8' && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-5 shadow-xs flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0 mt-0.5 text-amber-800">
            <AlertCircle className="w-5 h-5 text-amber-700" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-black text-amber-950 uppercase tracking-wider">
                GRADE 8 QUESTION GENERATION STATUS: 0 — LOCKED
              </h3>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 border border-amber-300">
                Gate Enforced
              </span>
            </div>
            <p className="text-xs text-amber-900 mt-1 leading-relaxed">
              Question generation for Grade 8 is strictly locked until all required Exam Pointer items are verified and confirmed by the teacher. Currently exactly <strong>0 Grade 8 questions</strong> exist in the system.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 inline-block mb-1">
            Stage 4 · Question Bank & Review
          </span>
          <h2 className="text-xl font-bold text-slate-900">{term.grade} Practice Questions</h2>
          <p className="text-xs text-slate-500">
            AI-Generated practice questions grounded in approved source material. Review, edit, and approve before tests are published.
          </p>
        </div>

        <button
          onClick={() => {
            if (term.grade === 'Grade 8') {
              alert('GRADE 8 QUESTION GENERATION STATUS: 0 — LOCKED. Source mapping review and coverage verification must be completed first.');
              return;
            }
            setIsGeneratorModalOpen(true);
          }}
          disabled={term.grade === 'Grade 8'}
          className={`flex items-center gap-2 px-5 py-2.5 font-bold text-xs rounded-xl shadow-xs transition-all ${
            term.grade === 'Grade 8'
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white cursor-pointer'
          }`}
          title={term.grade === 'Grade 8' ? 'Question generation locked for Grade 8' : 'Generate questions'}
        >
          <Sparkles className="w-4 h-4 text-indigo-200" />
          <span>Generate Source-Grounded Practice Questions</span>
        </button>
      </div>

      {/* Subject Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {availableSubjects.map((sub) => {
          const isSelected = selectedSubjectId === sub.id;
          const count = term.questions.filter((q) => q.subjectId === sub.id).length;
          const pendingCount = term.questions.filter(
            (q) => q.subjectId === sub.id && q.approvalStatus === 'pending'
          ).length;

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
              {pendingCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400" title="Has pending questions" />
              )}
            </button>
          );
        })}
      </div>

      {/* Status Filter & Metrics */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
          {(['all', 'approved', 'pending', 'rejected'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 font-semibold rounded-lg capitalize transition-colors ${
                statusFilter === st
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st} (
              {
                term.questions.filter(
                  (q) => q.subjectId === selectedSubjectId && (st === 'all' || q.approvalStatus === st)
                ).length
              }
              )
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-500 font-mono">
          Confirmed Source Pages Available: {confirmedPages.length}
        </span>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.length > 0 ? (
          questions.map((q, idx) => (
            <div
              key={q.id}
              className={`bg-white rounded-2xl border p-5 sm:p-6 transition-all shadow-xs ${
                q.approvalStatus === 'approved'
                  ? 'border-emerald-200 bg-white'
                  : q.approvalStatus === 'rejected'
                  ? 'border-slate-200 bg-slate-50 opacity-60'
                  : 'border-amber-300 bg-amber-50/20 ring-1 ring-amber-200'
              }`}
            >
              {/* Question Header */}
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900">#{idx + 1}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {q.topic}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 capitalize">
                    {q.questionType.replace('_', ' ')} · {q.difficulty}
                  </span>
                  {q.aiGenerated && (
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.2 rounded">
                      AI Generated
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Status Indicator */}
                  {q.approvalStatus === 'approved' ? (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                      APPROVED ✓
                    </span>
                  ) : q.approvalStatus === 'rejected' ? (
                    <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg">
                      REJECTED ✗
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-lg animate-pulse">
                      PENDING REVIEW
                    </span>
                  )}
                </div>
              </div>

              {/* Passage if applicable */}
              {q.passage && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-serif text-slate-800 mb-3">
                  {q.passage}
                </div>
              )}

              {/* Question text */}
              <h4 className="text-base font-bold text-slate-900 mb-3 leading-snug">
                {q.question}
              </h4>

              {/* Options or Answer */}
              {q.options && q.options.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                  {q.options.map((opt, optIdx) => (
                    <div
                      key={optIdx}
                      className={`text-xs p-2.5 rounded-xl border font-medium ${
                        opt === q.correctAnswer
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-950 font-bold'
                          : 'border-slate-200 bg-slate-50/70 text-slate-700'
                      }`}
                    >
                      <span className="font-mono mr-2">{String.fromCharCode(65 + optIdx)}.</span>
                      {opt}
                    </div>
                  ))}
                </div>
              )}

              {/* Matching pairs preview if applicable */}
              {q.matchingPairs && q.matchingPairs.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                  {q.matchingPairs.map((pair, pIdx) => (
                    <div key={pIdx} className="p-2 rounded-lg bg-slate-50 border text-slate-700">
                      <span className="font-bold">{pair.left}</span> → {pair.right}
                    </div>
                  ))}
                </div>
              )}

              {/* Answer & Explanation */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1.5 mb-4">
                {q.learningPoint && (
                  <div>
                    <span className="font-bold text-slate-900">Learning Point: </span>
                    <span className="text-slate-800">{q.learningPoint}</span>
                  </div>
                )}
                {q.lessonSummary && (
                  <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200/80 text-amber-950 text-xs">
                    <span className="font-bold text-amber-900 block mb-0.5">Lesson Reminder:</span>
                    <p className="text-slate-700 leading-relaxed">{q.lessonSummary}</p>
                  </div>
                )}
                <div>
                  <span className="font-bold text-slate-900">Correct Answer: </span>
                  <span className="font-semibold text-emerald-700">
                    {typeof q.correctAnswer === 'object'
                      ? JSON.stringify(q.correctAnswer)
                      : String(q.correctAnswer)}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-slate-900">Explanation: </span>
                  <span>{q.explanation}</span>
                </div>
                <div className="text-[11px] font-mono text-slate-500 pt-1 border-t border-slate-200">
                  Source: {q.bookTitle} · Printed Page {q.printedPage} (PDF Page {q.pdfPage})
                </div>
              </div>

              {/* Validation Failure Warning */}
              {validationError && validationError.questionId === q.id && (
                <div className="mb-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs">
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Cannot Approve — Content Pipeline Rules Not Met:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-rose-800 ml-1">
                    {validationError.errors.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                  <p className="mt-1.5 text-[11px] text-rose-700 italic">
                    Click "Edit" to provide the required source learning point or lesson reminder before approval.
                  </p>
                </div>
              )}

              {/* Teacher Actions: Approve, Edit, Reject, Regenerate */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateApproval(q.id, 'approved')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>

                  <button
                    onClick={() => setEditingQuestion(q)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleUpdateApproval(q.id, 'rejected')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>

                <button
                  onClick={() => handleDeleteQuestion(q.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  title="Delete Question"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
            <FileQuestion className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold text-slate-700">No questions match the current filter.</p>
            <p className="mt-1">Use "Generate with AI" above to generate questions from confirmed pages.</p>
          </div>
        )}
      </div>

      {/* AI Generator Modal */}
      {isGeneratorModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 mb-1">
              <Sparkles className="w-4 h-4" />
              <span>AI-Generated Practice Questions Grounded in Approved Source Material</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Generate Source-Grounded Questions for {currentSubject.name}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Questions represent essential assessable learning points grounded strictly in the {confirmedPages.length} confirmed textbook pages without unnecessary repetition.
            </p>

            <div className="space-y-4 mb-6">
              {/* Question Count */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Number of Questions:
                </label>
                <div className="flex gap-2">
                  {[2, 3, 5, 8].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setGenCount(n)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${
                        genCount === n
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Difficulty Level:
                </label>
                <div className="flex gap-2">
                  {(['easy', 'medium', 'hard'] as const).map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setGenDifficulty(diff)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize border transition-colors ${
                        genDifficulty === diff
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Types */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Question Formats:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'multiple_choice', label: 'Multiple Choice' },
                    { id: 'true_false', label: 'True / False' },
                    { id: 'calculation', label: 'Math Calculation' },
                    { id: 'fill_in_blank', label: 'Fill in Blank' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleToggleType(t.id as QuestionType)}
                      className={`p-2.5 rounded-xl border font-semibold text-left transition-colors flex items-center justify-between ${
                        genTypes.includes(t.id as QuestionType)
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-900'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      <span>{t.label}</span>
                      {genTypes.includes(t.id as QuestionType) && (
                        <Check className="w-3.5 h-3.5 text-indigo-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Confirmed Pages Preview */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="font-bold text-slate-700 block mb-1">
                  Confirmed Source Pages to Sample:
                </span>
                <span className="font-mono text-slate-600">
                  {confirmedPages.map((p) => `p.${p.printedPageNumber}`).join(', ') ||
                    'None confirmed yet'}
                </span>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setIsGeneratorModalOpen(false)}
                disabled={isGenerating}
                className="px-4 py-2 rounded-xl border border-slate-300 font-semibold text-xs text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateQuestions}
                disabled={isGenerating}
                className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shadow-sm flex items-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing & Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Practice Questions</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Question Modal */}
      {editingQuestion && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveQuestionEdit}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-200"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-4">Edit Question</h3>

            <div className="space-y-3 mb-6">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Topic</label>
                  <input
                    type="text"
                    value={editingQuestion.topic}
                    onChange={(e) =>
                      setEditingQuestion({ ...editingQuestion, topic: e.target.value })
                    }
                    className="w-full text-xs p-2.5 border rounded-xl focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Assessable Learning Point</label>
                  <input
                    type="text"
                    value={editingQuestion.learningPoint || ''}
                    onChange={(e) =>
                      setEditingQuestion({ ...editingQuestion, learningPoint: e.target.value })
                    }
                    className="w-full text-xs p-2.5 border rounded-xl focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Question Prompt</label>
                <textarea
                  rows={3}
                  value={editingQuestion.question}
                  onChange={(e) =>
                    setEditingQuestion({ ...editingQuestion, question: e.target.value })
                  }
                  className="w-full text-xs p-3 border rounded-xl focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Correct Answer</label>
                <input
                  type="text"
                  value={editingQuestion.correctAnswer}
                  onChange={(e) =>
                    setEditingQuestion({ ...editingQuestion, correctAnswer: e.target.value })
                  }
                  className="w-full text-xs p-2.5 border rounded-xl focus:border-indigo-500 focus:outline-none font-semibold text-emerald-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Lesson Reminder (Student Concept Guide — Never reveal the answer)
                </label>
                <textarea
                  rows={2}
                  value={editingQuestion.lessonSummary || ''}
                  onChange={(e) =>
                    setEditingQuestion({ ...editingQuestion, lessonSummary: e.target.value })
                  }
                  placeholder="e.g. -ing adjectives describe the cause of a feeling; -ed adjectives describe how a person feels."
                  className="w-full text-xs p-2.5 border rounded-xl focus:border-indigo-500 focus:outline-none bg-amber-50/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Kid-Friendly Explanation</label>
                <textarea
                  rows={2}
                  value={editingQuestion.explanation}
                  onChange={(e) =>
                    setEditingQuestion({ ...editingQuestion, explanation: e.target.value })
                  }
                  className="w-full text-xs p-2.5 border rounded-xl focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Printed Page Reference</label>
                  <input
                    type="text"
                    value={editingQuestion.printedPage}
                    onChange={(e) =>
                      setEditingQuestion({ ...editingQuestion, printedPage: e.target.value })
                    }
                    className="w-full text-xs p-2.5 border rounded-xl focus:border-indigo-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">PDF Page Reference</label>
                  <input
                    type="text"
                    value={editingQuestion.pdfPage}
                    onChange={(e) =>
                      setEditingQuestion({ ...editingQuestion, pdfPage: e.target.value })
                    }
                    className="w-full text-xs p-2.5 border rounded-xl focus:border-indigo-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Approval status selector */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-600 mb-1">Post-Edit Approval State</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-colors ${editingQuestion.approvalStatus === 'approved' ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                    <input
                      type="radio"
                      name="approvalState"
                      checked={editingQuestion.approvalStatus === 'approved'}
                      onChange={() => setEditingQuestion({ ...editingQuestion, approvalStatus: 'approved' })}
                      className="accent-emerald-600"
                    />
                    <span>Approved (Ready for Tests)</span>
                  </label>
                  <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-colors ${editingQuestion.approvalStatus === 'pending' ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                    <input
                      type="radio"
                      name="approvalState"
                      checked={editingQuestion.approvalStatus === 'pending'}
                      onChange={() => setEditingQuestion({ ...editingQuestion, approvalStatus: 'pending' })}
                      className="accent-amber-600"
                    />
                    <span>Requires Re-Approval</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setEditingQuestion(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 font-semibold text-xs text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shadow-sm"
              >
                Save & Approve Question
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
