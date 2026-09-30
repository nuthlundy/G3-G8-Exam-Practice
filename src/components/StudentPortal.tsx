import React, { useState } from 'react';
import { TermData, SubjectId, SubjectMetadata, PracticeTest, TestAttempt, SourcePage } from '../types';
import { PracticeScopeService } from '../services/practiceScopeService';
import { FullTermReviewService } from '../services/fullTermReviewService';
import { FullTermReviewDashboard } from './FullTermReviewDashboard';
import {
  BookOpen,
  CheckCircle,
  Play,
  Clock,
  Sparkles,
  Info,
  Calendar,
  Layers,
  ChevronRight,
  Award,
  Target,
} from 'lucide-react';
import { TestRunner } from './TestRunner';
import { TestResultView } from './TestResultView';
import { SourceViewerModal } from './SourceViewerModal';

interface StudentPortalProps {
  term: TermData;
  onOpenPointerView: () => void;
  onOpenSourcesView: () => void;
  activeNavTab: string;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  term,
  onOpenPointerView,
  onOpenSourcesView,
  activeNavTab,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<SubjectId | null>(null);
  const [activeTest, setActiveTest] = useState<PracticeTest | null>(null);
  const [activeAttempt, setActiveAttempt] = useState<TestAttempt | null>(null);
  const [selectedSourcePage, setSelectedSourcePage] = useState<SourcePage | null>(null);
  const [fullReviewSubject, setFullReviewSubject] = useState<SubjectMetadata | null>(null);

  // Canonical single source of truth for scoped practice data
  const scopedData = PracticeScopeService.getScopedPracticeData(term);
  const {
    grade,
    academicYear,
    heroBadge,
    testableSubjects,
    projectSubjects,
    subjectDataMap,
    totalTestableScopeCount,
    totalPublishedTestsCount,
    totalAwaitingApprovalCount,
    firstPublishedTest,
  } = scopedData;

  // If Full Term Review dashboard is open for a subject
  if (fullReviewSubject) {
    return (
      <FullTermReviewDashboard
        term={term}
        subject={fullReviewSubject}
        onStartSession={(mode) => {
          const session = FullTermReviewService.generateReviewSession(term, fullReviewSubject.id, mode, 20);
          if (session) {
            setActiveTest(session.test);
            setFullReviewSubject(null);
          } else {
            alert('No approved questions available for review session.');
          }
        }}
        onClose={() => setFullReviewSubject(null)}
      />
    );
  }

  // If a test is active, show the runner with strictly approved questions for this term
  if (activeTest) {
    const questionMap = new Map((term.questions || []).map((q) => [q.id, q]));
    const testQuestions = activeTest.questionIds
      .map((id) => questionMap.get(id))
      .filter((q): q is NonNullable<typeof q> => Boolean(q));
    return (
      <TestRunner
        test={activeTest}
        questions={testQuestions}
        sourcePages={term.sourcePages}
        grade={grade}
        onComplete={(attempt) => {
          if (activeTest.id.startsWith('full-review-')) {
            FullTermReviewService.recordSessionResults(term, activeTest.subjectId, attempt);
          }
          setActiveAttempt(attempt);
          setActiveTest(null);
        }}
        onExit={() => setActiveTest(null)}
      />
    );
  }

  // If an attempt was just completed, show results
  if (activeAttempt) {
    return (
      <TestResultView
        attempt={activeAttempt}
        sourcePages={term.sourcePages}
        onRetake={() => {
          const test = (term.practiceTests || []).find(
            (t) => t.id === activeAttempt.testId && t.termId === term.id
          );
          if (test) {
            setActiveAttempt(null);
            setActiveTest(test);
          }
        }}
        onExit={() => {
          setActiveAttempt(null);
        }}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 rounded-3xl p-6 sm:p-10 text-white shadow-md relative overflow-hidden mb-8">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>{heroBadge}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-2">
            Practice & Ace Your School Term Exams!
          </h1>
          <p className="text-sm sm:text-base text-amber-100 mb-6 leading-relaxed">
            All practice questions are verified directly against your school’s Exam Pointer and official textbook pages.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {firstPublishedTest ? (
              <button
                onClick={() => setActiveTest(firstPublishedTest)}
                className="px-5 py-2.5 bg-white text-slate-900 font-bold text-xs rounded-xl shadow-sm hover:bg-amber-50 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-slate-900" />
                <span>Start Quick Practice</span>
              </button>
            ) : null}
            <button
              onClick={onOpenPointerView}
              className="px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white font-semibold text-xs rounded-xl backdrop-blur-xs transition-colors cursor-pointer"
            >
              View Exam Pointer Scope
            </button>
          </div>
        </div>

        {/* Decorative Graphic Element */}
        <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
          <Award className="w-64 h-64 text-white" />
        </div>
      </div>

      {/* Main Subject Section */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Select Subject to Practice</h2>
          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-600">
            <span className="font-semibold text-slate-800">
              {totalTestableScopeCount} page-based subjects ({projectSubjects.length} project-based excluded)
            </span>
            <span className="text-slate-300">•</span>
            <span className="font-semibold text-emerald-700">
              {totalPublishedTestsCount} tests ready
            </span>
            <span className="text-slate-300">•</span>
            <span className="font-semibold text-amber-700">
              {totalAwaitingApprovalCount} awaiting test publishing
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl shadow-xs">
            {totalPublishedTestsCount} Tests Ready
          </span>
          <span className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl shadow-xs">
            {totalAwaitingApprovalCount} Awaiting Test Publishing
          </span>
        </div>
      </div>

      {/* Testable Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {testableSubjects.map((sub) => {
          const subData = subjectDataMap[sub.id] || {
            metadata: sub,
            questions: [],
            approvedQuestions: [],
            practiceTests: [],
            publishedPracticeTests: [],
            isProjectBased: false,
            canQuickPractice: false,
          };
          const { pointerItem, questions, approvedQuestions, publishedPracticeTests } = subData;
          const readyQuestions = questions.filter(
            (q) =>
              (q.approvalStatus === 'DRAFT' || !q.approvalStatus) &&
              q.reviewStatus !== 'REVIEW_LATER' &&
              q.reviewAction !== 'REVIEW_LATER' &&
              q.reviewStatus !== 'NEEDS_REVIEW'
          );
          const inReviewQuestions = questions.filter(
            (q) =>
              q.reviewStatus === 'REVIEW_LATER' ||
              q.reviewAction === 'REVIEW_LATER' ||
              q.approvalStatus === 'NEEDS_REVIEW' ||
              q.reviewStatus === 'NEEDS_REVIEW'
          );
          const rejectedQuestions = questions.filter(
            (q) => q.approvalStatus === 'REJECTED' || q.approvalStatus === 'rejected'
          );

          return (
            <div
              key={sub.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-amber-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {sub.nativeName || sub.name}
                  </span>
                  <div className="text-[11px] font-medium text-right">
                    {approvedQuestions.length > 0 ? (
                      <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {approvedQuestions.length} Approved Qs
                      </span>
                    ) : readyQuestions.length > 0 ? (
                      <span className="text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        {readyQuestions.length} {readyQuestions.length === 1 ? 'Question' : 'Questions'} Ready for Approval
                      </span>
                    ) : inReviewQuestions.length > 0 ? (
                      <span className="text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {inReviewQuestions.length} Draft {inReviewQuestions.length === 1 ? 'Q' : 'Qs'} (In Review)
                      </span>
                    ) : rejectedQuestions.length > 0 ? (
                      <span className="text-rose-700 font-medium bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        {rejectedQuestions.length} Rejected
                      </span>
                    ) : (
                      <span className="text-slate-400">0 Questions</span>
                    )}
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1">{sub.name}</h3>
                <p className="text-xs text-slate-500 mb-3 line-clamp-2">{sub.description}</p>

                {/* Exam Pointer Page Scope Tag */}
                <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-100 text-xs mb-4">
                  <span className="font-bold text-amber-900 block mb-0.5">Exam Pointer Scope:</span>
                  <span className="text-amber-800 font-mono text-[11px]">
                    {pointerItem?.pagesDescription || 'Check Exam Pointer'}
                  </span>
                </div>
              </div>

              {/* Published Tests for this subject */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                {publishedPracticeTests.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTest(t)}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-between transition-colors shadow-xs group cursor-pointer"
                  >
                    <span className="flex items-center gap-2 text-left">
                      <Play className="w-3.5 h-3.5 fill-white group-hover:scale-110 transition-transform shrink-0" />
                      <span className="line-clamp-1">{t.title}</span>
                    </span>
                    <span className="text-[11px] text-slate-300 font-normal shrink-0 ml-2">
                      {t.questionIds.length} Qs · {t.timeLimitMinutes}m
                    </span>
                  </button>
                ))}

                {/* Quick 10-Question Random Practice from Approved Bank */}
                {(() => {
                  if (approvedQuestions.length >= 5) {
                    return (
                      <button
                        onClick={() => {
                          const shuffled = [...approvedQuestions]
                            .sort(() => 0.5 - Math.random())
                            .slice(0, 10);
                          const quickTest: PracticeTest = {
                            id: `quick-rand-${sub.id}-${Date.now()}`,
                            termId: term.id,
                            subjectId: sub.id,
                            title: `${sub.name} Quick 10 Practice`,
                            description: `Randomized 10-question practice drawn from the ${sub.name} approved question bank.`,
                            timeLimitMinutes: 15,
                            passingPercentage: 70,
                            questionIds: shuffled.map((q) => q.id),
                            isPublished: true,
                            createdAt: new Date().toISOString(),
                            allowLessonReminders: true,
                          };
                          setActiveTest(quickTest);
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-amber-200/80 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>Quick 10 Random Practice</span>
                      </button>
                    );
                  }
                  return null;
                })()}

                {/* Full Term Review Coverage Mode */}
                {(() => {
                  const lps = FullTermReviewService.getSubjectLearningPoints(term, sub.id);
                  const stats = FullTermReviewService.getReviewStats(term, sub.id);
                  if (lps.length > 0) {
                    return (
                      <button
                        onClick={() => setFullReviewSubject(sub)}
                        className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs flex items-center justify-between transition-colors shadow-xs cursor-pointer"
                      >
                        <span className="flex items-center gap-2 text-left">
                          <Target className="w-3.5 h-3.5 text-amber-200 shrink-0" />
                          <span>Full Term Review</span>
                        </span>
                        <span className="text-[11px] font-normal text-amber-100 bg-black/20 px-2 py-0.5 rounded-md shrink-0 ml-2">
                          {stats.reviewedLps > 0
                            ? `${stats.coveragePercent}% (${stats.reviewedLps}/${stats.totalLps} LPs)`
                            : `${stats.totalLps} Learning Points`}
                        </span>
                      </button>
                    );
                  }
                  return null;
                })()}

                {publishedPracticeTests.length === 0 && (
                  <div className="text-[11px] font-medium text-amber-800 bg-amber-50/80 border border-amber-200/70 rounded-xl p-2.5 text-center mb-1">
                    Dedicated practice test awaiting generation/approval
                  </div>
                )}

                {(() => {
                  if (
                    publishedPracticeTests.length === 0 &&
                    approvedQuestions.length > 0 &&
                    approvedQuestions.length < 5
                  ) {
                    return (
                      <button
                        onClick={() => {
                          const mockTest: PracticeTest = {
                            id: `quick-${sub.id}-${Date.now()}`,
                            termId: term.id,
                            subjectId: sub.id,
                            title: `${sub.name} Practice Session`,
                            description: `Practice session for ${sub.name} using approved questions.`,
                            timeLimitMinutes: 15,
                            passingPercentage: 70,
                            questionIds: approvedQuestions.map((q) => q.id),
                            isPublished: true,
                            createdAt: new Date().toISOString(),
                            allowLessonReminders: true,
                          };
                          setActiveTest(mockTest);
                        }}
                        className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Play className="w-3 h-3 fill-slate-700" />
                        <span>Practice Approved Questions ({approvedQuestions.length})</span>
                      </button>
                    );
                  }
                  return null;
                })()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Excluded Project-Based Subjects Notice */}
      <div className="bg-slate-100 rounded-3xl p-6 border border-slate-200 mb-8">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-1">
              Project-Based Subjects (Excluded from page-based testing)
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              As specified in the {grade} Exam Pointer, the following subjects are evaluated through classroom project assessments rather than page-based test papers:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {projectSubjects.map((sub) => (
                <div
                  key={sub.id}
                  className="bg-white rounded-xl p-3 border border-slate-200 text-xs text-slate-700"
                >
                  <span className="font-bold block text-slate-900">{sub.name}</span>
                  <span className="text-slate-500">
                    {sub.exclusionReason || 'Project-based assessment (Excluded from page-based testing)'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Source Viewer Modal */}
      <SourceViewerModal
        page={selectedSourcePage}
        onClose={() => setSelectedSourcePage(null)}
      />
    </div>
  );
};
