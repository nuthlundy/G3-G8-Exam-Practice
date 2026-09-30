import React, { useState } from 'react';
import { TestAttempt, SourcePage, Question } from '../types';
import {
  Trophy,
  CheckCircle,
  XCircle,
  BookOpen,
  RotateCcw,
  ArrowLeft,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { SourceViewerModal } from './SourceViewerModal';

interface TestResultViewProps {
  attempt: TestAttempt;
  sourcePages: SourcePage[];
  onRetake: () => void;
  onExit: () => void;
}

export const TestResultView: React.FC<TestResultViewProps> = ({
  attempt,
  sourcePages,
  onRetake,
  onExit,
}) => {
  const [selectedSourcePage, setSelectedSourcePage] = useState<SourcePage | null>(null);
  const [filterMode, setFilterMode] = useState<'all' | 'incorrect'>('all');

  const isPassed = attempt.percentage >= 70;
  const incorrectCount = attempt.total - attempt.score;

  const displayedResults =
    filterMode === 'incorrect'
      ? attempt.results.filter((r) => !r.isCorrect)
      : attempt.results;

  const handleOpenSourceForQuestion = (printedPage: number | string, bookTitle: string) => {
    // Find matching source page in sourcePages
    const match = sourcePages.find(
      (sp) =>
        String(sp.printedPageNumber).toLowerCase() === String(printedPage).toLowerCase() ||
        sp.bookTitle.toLowerCase().includes(bookTitle.toLowerCase().slice(0, 15))
    );
    if (match) {
      setSelectedSourcePage(match);
    } else {
      // Fallback synthetic page object
      setSelectedSourcePage({
        id: 'sp-fallback',
        pdfPageNumber: 1,
        printedPageNumber: printedPage,
        bookTitle: bookTitle,
        subjectId: attempt.subjectId,
        unitLesson: 'Curriculum Review',
        topic: 'Relevant Learning Topic',
        language: 'en',
        ocrExcerpt: `Refer directly to ${bookTitle}, printed textbook page ${printedPage} for lesson examples and exercises.`,
        keyWords: [],
        status: 'confirmed',
        confidence: 100,
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Top action bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Subjects</span>
        </button>
        <button
          onClick={onRetake}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-colors shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Practice Again</span>
        </button>
      </div>

      {/* Hero Score Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm text-center mb-8 relative overflow-hidden">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 text-amber-600 mb-4 shadow-inner">
          <Trophy className="w-10 h-10" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
          {isPassed ? 'Fantastic Job!' : 'Great Effort! Keep Practicing!'}
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          {attempt.studentName} · Completed on {new Date(attempt.completedAt).toLocaleDateString()}
        </p>

        {/* Score Stats Ring */}
        <div className="flex items-center justify-center gap-8 max-w-sm mx-auto p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <div>
            <span className="block text-3xl font-extrabold text-slate-900 font-mono">
              {attempt.score}/{attempt.total}
            </span>
            <span className="text-xs text-slate-500 font-medium">Questions Correct</span>
          </div>
          <div className="h-10 w-px bg-slate-200" />
          <div>
            <span
              className={`block text-3xl font-extrabold font-mono ${
                isPassed ? 'text-emerald-600' : 'text-amber-600'
              }`}
            >
              {attempt.percentage}%
            </span>
            <span className="text-xs text-slate-500 font-medium">Overall Score</span>
          </div>
        </div>

        {incorrectCount > 0 && (
          <p className="text-xs text-slate-600 mt-4 max-w-md mx-auto">
            Tip: Review the specific textbook pages highlighted below for your incorrect answers to master these topics!
          </p>
        )}
      </div>

      {/* Filter tab bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filterMode === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Questions ({attempt.total})
          </button>
          {incorrectCount > 0 && (
            <button
              onClick={() => setFilterMode('incorrect')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filterMode === 'incorrect'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
              }`}
            >
              Needs Review ({incorrectCount})
            </button>
          )}
        </div>
        <span className="text-xs text-slate-400">Time spent: {Math.round(attempt.timeSpentSeconds / 60)} mins</span>
      </div>

      {/* Question Review Cards */}
      <div className="space-y-4">
        {displayedResults.map((res, idx) => (
          <div
            key={idx}
            className={`bg-white rounded-2xl border p-5 sm:p-6 transition-all ${
              res.isCorrect ? 'border-slate-200' : 'border-rose-200 ring-1 ring-rose-100 bg-rose-50/20'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                {res.isCorrect ? (
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                )}
                <span className="font-bold text-sm text-slate-900">Question #{idx + 1}</span>
                <span className="text-xs text-slate-500">· {res.topic}</span>
              </div>

              {/* Exact Source Citation & View Button */}
              <button
                onClick={() => handleOpenSourceForQuestion(res.printedPage, res.bookTitle)}
                className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-lg transition-colors shrink-0"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>
                  Review Page {res.printedPage}
                </span>
                <ExternalLink className="w-3 h-3 text-amber-500" />
              </button>
            </div>

            {/* Answer Comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 text-sm">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Your Answer:
                </span>
                <span
                  className={`font-semibold ${
                    res.isCorrect ? 'text-emerald-700' : 'text-rose-600'
                  }`}
                >
                  {typeof res.studentAnswer === 'object'
                    ? JSON.stringify(res.studentAnswer)
                    : String(res.studentAnswer)}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
                <span className="block text-[11px] font-bold text-emerald-700 uppercase tracking-wider mb-1">
                  Correct Answer:
                </span>
                <span className="font-semibold text-emerald-950">
                  {typeof res.correctAnswer === 'object'
                    ? JSON.stringify(res.correctAnswer)
                    : String(res.correctAnswer)}
                </span>
              </div>
            </div>

            {/* Explanation & Textbook Page Reference */}
            <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-amber-950 leading-relaxed">
              <span className="font-bold block mb-1">Textbook Explanation:</span>
              <p>{res.explanation}</p>
              {res.lessonSummary && (
                <div className="mt-2.5 p-2.5 rounded-lg bg-amber-100/70 border border-amber-200 text-[11px] text-amber-900">
                  <span className="font-bold block mb-0.5">Lesson Reminder:</span>
                  <p>{res.lessonSummary}</p>
                </div>
              )}
              <div className="mt-2 text-[11px] font-medium text-amber-800">
                Source: {res.bookTitle} · Textbook Page {res.printedPage} (PDF Page {res.pdfPage})
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Source Viewer Modal */}
      <SourceViewerModal
        page={selectedSourcePage}
        onClose={() => setSelectedSourcePage(null)}
      />
    </div>
  );
};
