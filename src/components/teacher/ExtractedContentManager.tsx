import React, { useState, useEffect, useMemo } from 'react';
import {
  TermData,
  ExtractedContentItem,
  LearningPoint,
  InstructionalStatus,
} from '../../types';
import { PracticeScopeService } from '../../services/practiceScopeService';
import {
  Layers,
  BookOpen,
  Bookmark,
  Sparkles,
  Tag,
  CheckCircle,
  HelpCircle,
  Check,
  X,
  Edit3,
  AlertCircle,
  ShieldAlert,
  FileText,
  ArrowRight,
  Eye,
  FileCheck,
  AlertTriangle,
} from 'lucide-react';
import { StorageService } from '../../services/storageService';
import { InstructionalContentEngine } from '../../services/instructionalContentEngine';

interface ExtractedContentManagerProps {
  term: TermData;
  onUpdateTerm: (updated: TermData) => void;
}

export const ExtractedContentManager: React.FC<ExtractedContentManagerProps> = ({
  term,
  onUpdateTerm,
}) => {
  const isGrade8 = term.grade === 'Grade 8';
  const availableSubjects = useMemo(
    () => PracticeScopeService.getTermSubjects(term).filter((s) => !s.isProjectBased),
    [term.grade, term.id, term.pointer]
  );

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    () => availableSubjects[0]?.id || (isGrade8 ? 'english' : 'mathematics')
  );

  // Sync / Reset selectedSubjectId when grade, term, or available subjects change
  useEffect(() => {
    if (!availableSubjects.some((s) => s.id === selectedSubjectId)) {
      setSelectedSubjectId(availableSubjects[0]?.id || (isGrade8 ? 'english' : 'mathematics'));
    }
  }, [term.grade, term.id, availableSubjects, selectedSubjectId, isGrade8]);

  // Edit modal state
  const [editingPoint, setEditingPoint] = useState<LearningPoint | null>(null);
  const [editPointText, setEditPointText] = useState('');
  const [editSummaryText, setEditSummaryText] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const currentSubject =
    availableSubjects.find((s) => s.id === selectedSubjectId) || availableSubjects[0];

  // CANONICAL STRICT FILTERING:
  // Guaranteed: record.grade === term.grade, record.termId === term.id, record.subjectId === selectedSubjectId
  const subjectLearningPoints = useMemo(() => {
    return PracticeScopeService.getScopedLearningPoints(term, selectedSubjectId).filter(
      (lp) => lp.subjectId === selectedSubjectId
    );
  }, [term, selectedSubjectId]);

  const subjectExtractions = useMemo(() => {
    return PracticeScopeService.getScopedExtractedContents(term, selectedSubjectId).filter(
      (e) => e.subjectId === selectedSubjectId
    );
  }, [term, selectedSubjectId]);

  const learningPoints = term.learningPoints || [];

  // Stage 2 metrics
  const stage2Report = term.stage2Report;

  // Handle teacher review status updates
  const handleUpdateStatus = (pointId: string, newStatus: InstructionalStatus) => {
    const updatedPoints = InstructionalContentEngine.updateLearningPointStatus(
      learningPoints,
      pointId,
      newStatus
    );
    const updatedTerm: TermData = {
      ...term,
      learningPoints: updatedPoints,
    };
    StorageService.updateTerm(updatedTerm);
    onUpdateTerm(updatedTerm);
  };

  // Open edit modal
  const handleOpenEdit = (point: LearningPoint) => {
    setEditingPoint(point);
    setEditPointText(point.learningPoint);
    setEditSummaryText(point.lessonSummary);
    setEditNotes(point.teacherNotes || '');
  };

  // Save edit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPoint) return;

    const updatedPoints = InstructionalContentEngine.editLearningPoint(
      learningPoints,
      editingPoint.id,
      {
        learningPoint: editPointText.trim(),
        lessonSummary: editSummaryText.trim(),
        teacherNotes: editNotes.trim(),
      }
    );

    const updatedTerm: TermData = {
      ...term,
      learningPoints: updatedPoints,
    };
    StorageService.updateTerm(updatedTerm);
    onUpdateTerm(updatedTerm);
    setEditingPoint(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-200">
              Stage 2 · Instructional Content & Lesson Reminders
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-xs font-bold text-slate-500 font-mono">
              {term.grade} · {term.name}
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Mandatory Intermediate Instructional Layer
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 max-w-3xl">
            Questions must not be generated directly from raw PDF scans. Every learning point and lesson reminder is grounded in confirmed source pages, concept-focused, and reviewed by the teacher.
          </p>
        </div>
      </div>

      {/* Strict Pipeline Gate: Question Generation Locked */}
      {isGrade8 && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-5 shadow-xs flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0 mt-0.5 text-amber-800">
            <ShieldAlert className="w-5 h-5 text-amber-700" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-black text-amber-950 uppercase tracking-wider">
                STAGE 2 INSTRUCTIONAL LAYER ACTIVE — QUESTION GENERATION: 0 (LOCKED)
              </h3>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 border border-amber-300">
                Gated until Teacher Review
              </span>
            </div>
            <p className="text-xs text-amber-900 mt-1 leading-relaxed">
              Stage 2 transforms confirmed source pages into structured learning points and lesson reminders.
              Total Grade 8 Questions remain strictly at <strong>0</strong>. Question generation will only be unlocked in Stage 3 after teacher instructional review.
            </p>
          </div>
        </div>
      )}

      {/* Stage 2 Coverage Metrics Banner (for Grade 8) */}
      {isGrade8 && stage2Report && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Eligible Verified Pages</span>
            <span className="text-2xl font-black text-slate-900">{stage2Report.totalEligiblePages}</span>
            <span className="text-[10px] text-slate-500 block">Matched Pointer pages</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-2xs">
            <span className="text-[10px] font-bold uppercase text-emerald-700 block">Pages Processed</span>
            <span className="text-2xl font-black text-emerald-800">{stage2Report.totalPagesProcessed}</span>
            <span className="text-[10px] text-emerald-600 block">100% of eligible pages</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-indigo-200 bg-indigo-50/20 shadow-2xs">
            <span className="text-[10px] font-bold uppercase text-indigo-700 block">Learning Points</span>
            <span className="text-2xl font-black text-indigo-800">{stage2Report.totalLearningPoints}</span>
            <span className="text-[10px] text-indigo-600 block">Grounded in source</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-purple-200 bg-purple-50/20 shadow-2xs">
            <span className="text-[10px] font-bold uppercase text-purple-700 block">Lesson Reminders</span>
            <span className="text-2xl font-black text-purple-800">{stage2Report.totalLessonSummaries}</span>
            <span className="text-[10px] text-purple-600 block">No answers revealed</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-rose-200 bg-rose-50/20 shadow-2xs">
            <span className="text-[10px] font-bold uppercase text-rose-700 block">Unresolved Skipped</span>
            <span className="text-2xl font-black text-rose-800">{stage2Report.totalSkippedUnresolved}</span>
            <span className="text-[10px] text-rose-600 block">Missing uploads (Zero fake text)</span>
          </div>
        </div>
      )}

      {/* Architecture Flow Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600 overflow-x-auto pb-1 gap-2">
          <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-800 whitespace-nowrap">
            1. Verified Source Page
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-800 border border-indigo-200 whitespace-nowrap">
            2. Extracted Content
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="px-3 py-1 rounded-lg bg-indigo-100 text-indigo-900 border border-indigo-300 whitespace-nowrap">
            3. Learning Points
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="px-3 py-1 rounded-lg bg-purple-100 text-purple-900 border border-purple-300 whitespace-nowrap">
            4. Lesson Reminders
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300 whitespace-nowrap">
            5. Teacher Review
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="px-3 py-1 rounded-lg bg-slate-200 text-slate-700 whitespace-nowrap">
            6. Question Gen (Locked)
          </span>
        </div>
      </div>

      {/* Subject Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {availableSubjects.map((sub) => {
          const isSelected = selectedSubjectId === sub.id;
          const count = isGrade8
            ? PracticeScopeService.getScopedLearningPoints(term, sub.id).length
            : PracticeScopeService.getScopedExtractedContents(term, sub.id).length;

          return (
            <button
              key={sub.id}
              onClick={() => setSelectedSubjectId(sub.id)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap border transition-all flex items-center gap-2 cursor-pointer ${
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

      {/* Instructional Records List */}
      <div className="space-y-6">
        {isGrade8 ? (
          /* Grade 8 Intermediate Instructional Layer View */
          subjectLearningPoints.length > 0 ? (
            subjectLearningPoints.map((point) => {
              const matchedExtraction = subjectExtractions.find(
                (e) => e.subjectId === selectedSubjectId && String(e.printedPage) === String(point.printedPage)
              );

              return (
                <div
                  key={point.id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5"
                >
                  {/* Top Bar: Subject, Pages, Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-amber-50 text-amber-900 border border-amber-200">
                        Printed Page {point.printedPage}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        Physical PDF Page {point.pdfPage}
                      </span>
                      {point.alternatePdfPages && point.alternatePdfPages.length > 0 && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono text-purple-700 bg-purple-50 border border-purple-200">
                          + Alternate Scans: PDF pp. {point.alternatePdfPages.join(', ')}
                        </span>
                      )}
                      <span className="text-xs font-semibold text-slate-500">
                        {point.bookTitle}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border ${
                          point.status === 'VERIFIED'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : point.status === 'NEEDS_REVIEW'
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-rose-100 text-rose-800 border-rose-300'
                        }`}
                      >
                        {point.status}
                      </span>
                      <button
                        onClick={() => handleOpenEdit(point)}
                        className="flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>

                  {/* Flow View: 4 Distinct Blocks */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
                    {/* Block A: Extracted Content & Concepts */}
                    <div className="p-4 rounded-2xl border border-indigo-100 bg-indigo-50/30 space-y-3">
                      <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs uppercase tracking-wide">
                        <Layers className="w-4 h-4 text-indigo-600" />
                        <span>A. Extracted Curriculum Content</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">{point.topic}</h4>
                      <p className="text-slate-500 text-xs font-medium">{point.unitTitle} · {point.sectionTitle}</p>

                      {matchedExtraction && matchedExtraction.concepts.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-indigo-700 uppercase">Core Concepts:</span>
                          <ul className="list-disc list-inside space-y-0.5 text-slate-700 text-xs">
                            {matchedExtraction.concepts.map((c, i) => (
                              <li key={i}>{c}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {matchedExtraction && matchedExtraction.vocabulary && matchedExtraction.vocabulary.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-amber-700 uppercase">Key Terminology:</span>
                          <div className="space-y-1">
                            {matchedExtraction.vocabulary.map((v, i) => (
                              <div key={i} className="bg-white p-2 rounded-lg border border-amber-100 text-xs">
                                <span className="font-bold text-slate-900">{v.word}:</span>{' '}
                                <span className="text-slate-600">{v.definition}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Block B: Learning Point */}
                    <div className="p-4 rounded-2xl border border-emerald-100 bg-emerald-50/30 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wide">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span>B. Learning Point</span>
                        </div>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-emerald-200 text-emerald-900">
                          Type: {point.learningPointType}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm font-semibold text-slate-800 bg-white p-3 rounded-xl border border-emerald-200 leading-relaxed">
                        "{point.learningPoint}"
                      </p>

                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-emerald-800 uppercase">
                          Confidence & Source Traceability:
                        </span>
                        <div className="text-[11px] text-slate-500 font-mono space-y-0.5">
                          <p>Source File: {point.sourceFileId}</p>
                          <p>Grounded to PDF Page: {point.pdfPage} (Textbook p.{point.printedPage})</p>
                        </div>
                      </div>
                    </div>

                    {/* Block C: Lesson Summary / Student-Facing Reminder */}
                    <div className="p-4 rounded-2xl border border-purple-200 bg-purple-50/40 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-purple-900 font-bold text-xs uppercase tracking-wide">
                          <Sparkles className="w-4 h-4 text-purple-600" />
                          <span>C. Lesson Summary (Student Practice Reminder)</span>
                        </div>
                        <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-md bg-purple-200 text-purple-900">
                          Non-Hint Concept Reminder
                        </span>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-purple-200 text-slate-800 leading-relaxed font-medium">
                        "{point.lessonSummary}"
                      </div>

                      <p className="text-[11px] text-purple-800 leading-snug">
                        <strong>Student-Facing Role:</strong> Displays in the student test runner's left/right reminder panels beside practice questions. Contains zero answer hints.
                      </p>
                    </div>

                    {/* Block D: Source Evidence */}
                    <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                      <div className="flex items-center gap-2 text-slate-700 font-bold text-xs uppercase tracking-wide">
                        <FileText className="w-4 h-4 text-slate-500" />
                        <span>D. Direct Source Evidence</span>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-slate-200 text-slate-600 font-serif italic text-xs leading-relaxed">
                        {point.sourceEvidence.map((ev, i) => (
                          <p key={i}>"{ev}"</p>
                        ))}
                      </div>

                      {point.teacherNotes && (
                        <div className="text-[11px] text-indigo-700 bg-indigo-50 p-2 rounded-lg border border-indigo-100">
                          <strong>Teacher Notes:</strong> {point.teacherNotes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Teacher Action Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                    <span className="text-xs text-slate-500 font-medium">
                      Teacher Review Decisions for this Record:
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(point.id, 'REJECTED')}
                        className="px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      >
                        Reject
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(point.id, 'NEEDS_REVIEW')}
                        className="px-3 py-1.5 text-xs font-bold text-amber-700 hover:bg-amber-50 rounded-xl transition-colors cursor-pointer"
                      >
                        Review Later
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(point.id, 'VERIFIED')}
                        className="px-4 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve & Verify</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
              <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-800">
                No Verified Pages for {currentSubject.name}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Pages that are NOT_FOUND or unresolved are skipped from Stage 2 content extraction.
              </p>
            </div>
          )
        ) : (
          /* Grade 3 Existing View (Preserved Unchanged) */
          subjectExtractions.length > 0 ? (
            subjectExtractions.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{item.topic}</h3>
                    <p className="text-xs text-slate-500">{item.subtopic}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-lg font-mono font-bold">
                      Textbook p. {item.printedPage}
                    </span>
                    <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg font-mono">
                      PDF p. {item.pdfPage}
                    </span>
                  </div>
                </div>

                {item.concepts.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Bookmark className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Key Educational Concepts & Rules</span>
                    </h4>
                    <ul className="grid grid-cols-1 gap-2">
                      {item.concepts.map((concept, idx) => (
                        <li
                          key={idx}
                          className="text-xs sm:text-sm text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed"
                        >
                          {concept}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
              No curriculum items extracted yet for {currentSubject.name}.
            </div>
          )
        )}
      </div>

      {/* TEACHER EDIT MODAL */}
      {editingPoint && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form
            onSubmit={handleSaveEdit}
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Edit Instructional Content & Lesson Summary
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingPoint(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
              <p>
                <strong>Source:</strong> {editingPoint.bookTitle} (Textbook p.{editingPoint.printedPage} / PDF p.{editingPoint.pdfPage})
              </p>
              <p>
                <strong>Topic:</strong> {editingPoint.topic}
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Learning Point Statement:
                </label>
                <textarea
                  rows={3}
                  required
                  value={editPointText}
                  onChange={(e) => setEditPointText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Lesson Summary (Student-Facing Reminder):
                </label>
                <textarea
                  rows={3}
                  required
                  value={editSummaryText}
                  onChange={(e) => setEditSummaryText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-[11px] text-slate-400 mt-0.5 block">
                  Must be short, student-friendly, concept-focused, and never reveal specific answers.
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Teacher Notes / Audit Trail:</label>
                <input
                  type="text"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Reason for instructional edit..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingPoint(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs"
              >
                Save & Mark Needs Review
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
