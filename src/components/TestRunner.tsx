import React, { useState, useEffect } from 'react';
import { Question, PracticeTest, TestAttempt, StudentAnswerResult, SourcePage } from '../types';
import {
  Clock,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Bookmark,
  BookOpen,
  ExternalLink,
} from 'lucide-react';
import { SourceViewerModal } from './SourceViewerModal';

interface TestRunnerProps {
  test: PracticeTest;
  questions: Question[];
  sourcePages: SourcePage[];
  grade?: string;
  onComplete: (attempt: TestAttempt) => void;
  onExit: () => void;
}

export const TestRunner: React.FC<TestRunnerProps> = ({
  test,
  questions,
  sourcePages,
  grade = 'Grade 3',
  onComplete,
  onExit,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(test.timeLimitMinutes * 60);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [studentName, setStudentName] = useState(`${grade} Student`);
  const [isConfirmSubmitOpen, setIsConfirmSubmitOpen] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [selectedSourceForViewer, setSelectedSourceForViewer] = useState<SourcePage | null>(null);
  const [matchingDraft, setMatchingDraft] = useState<{ leftSelected?: string; pairs: Record<string, string> }>({
    pairs: {},
  });

  const currentQ = questions[currentIndex];
  const totalQuestions = questions.length;

  if (!currentQ || totalQuestions === 0) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-3xl border border-slate-200 text-center shadow-xs">
        <h3 className="text-lg font-bold text-slate-900 mb-2">No Questions Available</h3>
        <p className="text-xs text-slate-500 mb-6">
          This practice test currently has no valid questions linked or available.
        </p>
        <button
          onClick={onExit}
          className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-slate-800 transition-colors cursor-pointer"
        >
          Return to Practice Dashboard
        </button>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).filter((k) => answers[k] !== undefined && answers[k] !== '').length;

  // Lesson reminder is enabled by default for practice mode (e.g. quick practice or when explicitly turned on)
  const isLessonReminderEnabled =
    test.allowLessonReminders !== undefined
      ? test.allowLessonReminders
      : test.id.startsWith('quick-') || !test.isPublished;

  // Support content computation for side panels
  const matchedSource = sourcePages.find(
    (sp) =>
      sp.subjectId === currentQ.subjectId &&
      (String(sp.printedPageNumber).toLowerCase() === String(currentQ.printedPage).toLowerCase() ||
        String(sp.printedPageNumber).includes(String(currentQ.printedPage)))
  );

  // 1. LEFT PANEL: "Lesson Reminder"
  let lessonReminderText = currentQ.lessonSummary?.trim() || '';
  if (!lessonReminderText && matchedSource?.ocrExcerpt) {
    const firstSentence = matchedSource.ocrExcerpt.split(/[.\n]/)[0].trim();
    if (firstSentence.length > 10) {
      lessonReminderText = `${firstSentence}.`;
    }
  }
  if (!lessonReminderText) {
    lessonReminderText = `Remember the lesson rule for "${currentQ.topic}". Refer to ${currentQ.bookTitle} page ${currentQ.printedPage}.`;
  }

  // Answer protection: strictly ensure reminder never contains direct answer
  const answerStr = String(currentQ.correctAnswer || '').trim().toLowerCase();
  if (answerStr && answerStr.length > 1) {
    if (lessonReminderText.toLowerCase() === answerStr) {
      lessonReminderText = `Apply the core concept for ${currentQ.topic} from your lesson material.`;
    } else if (lessonReminderText.toLowerCase().includes(`the answer is ${answerStr}`)) {
      lessonReminderText = lessonReminderText.replace(
        new RegExp(`the answer is ${answerStr}`, 'gi'),
        'remember the lesson method'
      );
    }
  }

  // 2. RIGHT PANEL: "Key Point"
  let keyPointText = currentQ.learningPoint?.trim() || '';
  const isKeyPointRedundant =
    !keyPointText ||
    keyPointText.toLowerCase() === lessonReminderText.toLowerCase() ||
    lessonReminderText.toLowerCase().includes(keyPointText.toLowerCase());

  if (
    isKeyPointRedundant &&
    matchedSource?.unitLesson &&
    matchedSource.unitLesson.toLowerCase() !== currentQ.topic.toLowerCase()
  ) {
    keyPointText = `Curriculum Focus: ${matchedSource.unitLesson}`;
  }

  // Adaptive logic:
  const hasLeftPanel = isLessonReminderEnabled && Boolean(lessonReminderText);
  const hasRightPanel =
    isLessonReminderEnabled &&
    Boolean(keyPointText) &&
    keyPointText.toLowerCase() !== lessonReminderText.toLowerCase();

  // Auto-collapse reminder on question change
  useEffect(() => {
    setIsReminderOpen(false);
  }, [currentIndex]);

  // Countdown timer
  useEffect(() => {
    if (isTimerPaused || timeRemainingSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimeRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerPaused, timeRemainingSeconds]);

  // Handle single answers
  const handleSelectAnswer = (ans: any) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: ans,
    }));
  };

  // Handle matching pair clicks
  const handleMatchingClick = (side: 'left' | 'right', value: string) => {
    const currentPairs = answers[currentQ.id] || {};
    if (side === 'left') {
      setMatchingDraft((prev) => ({ ...prev, leftSelected: value }));
    } else if (side === 'right' && matchingDraft.leftSelected) {
      const updatedPairs = {
        ...currentPairs,
        [matchingDraft.leftSelected]: value,
      };
      setAnswers((prev) => ({
        ...prev,
        [currentQ.id]: updatedPairs,
      }));
      setMatchingDraft({ pairs: updatedPairs, leftSelected: undefined });
    }
  };

  const handleResetMatching = () => {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: {} }));
    setMatchingDraft({ pairs: {}, leftSelected: undefined });
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  const normalizeAnswer = (val: any) => {
    let str = String(val || '').trim().toLowerCase();
    // Normalize Khmer numerals to Arabic digits for numerical comparisons (០-៩ -> 0-9)
    const khmerDigits = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
    khmerDigits.forEach((kd, idx) => {
      str = str.replaceAll(kd, String(idx));
    });
    return str;
  };

  const handleSubmitTest = () => {
    let score = 0;
    const results: StudentAnswerResult[] = [];

    questions.forEach((q) => {
      const userAns = answers[q.id];
      let isCorrect = false;

      if (q.questionType === 'multiple_choice' || q.questionType === 'true_false') {
        isCorrect = normalizeAnswer(userAns) === normalizeAnswer(q.correctAnswer);
      } else if (q.questionType === 'calculation' || q.questionType === 'fill_in_blank') {
        isCorrect = normalizeAnswer(userAns) === normalizeAnswer(q.correctAnswer);
      } else if (q.questionType === 'matching') {
        const correctDict = q.correctAnswer as Record<string, string>;
        const userDict = (userAns || {}) as Record<string, string>;
        const keys = Object.keys(correctDict);
        const matches = keys.filter((k) => userDict[k] === correctDict[k]);
        isCorrect = matches.length === keys.length;
      }

      if (isCorrect) {
        score += 1;
      }

      results.push({
        questionId: q.id,
        isCorrect,
        studentAnswer: userAns ?? 'No answer provided',
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        subjectName: test.subjectId,
        bookTitle: q.bookTitle,
        printedPage: q.printedPage,
        pdfPage: q.pdfPage,
        topic: q.topic,
        learningPoint: q.learningPoint,
        lessonSummary: q.lessonSummary,
      });
    });

    const percentage = Math.round((score / totalQuestions) * 100);
    const attempt: TestAttempt = {
      id: `attempt-${Date.now()}`,
      testId: test.id,
      testTitle: test.title,
      termId: test.termId,
      subjectId: test.subjectId,
      studentName: studentName || 'Grade 3 Student',
      completedAt: new Date().toISOString(),
      score,
      total: totalQuestions,
      percentage,
      timeSpentSeconds: test.timeLimitMinutes * 60 - timeRemainingSeconds,
      results,
    };

    onComplete(attempt);
  };

  const handleOpenSourceForQuestion = (printedPage: number | string, bookTitle: string) => {
    const match = sourcePages.find(
      (sp) =>
        String(sp.printedPageNumber).toLowerCase() === String(printedPage).toLowerCase() ||
        sp.bookTitle.toLowerCase().includes(bookTitle.toLowerCase().slice(0, 15))
    );
    if (match) {
      setSelectedSourceForViewer(match);
    } else {
      setSelectedSourceForViewer({
        id: `sp-view-${currentQ.id}`,
        pdfPageNumber: Number(currentQ.pdfPage) || 1,
        printedPageNumber: printedPage,
        bookTitle: bookTitle,
        subjectId: currentQ.subjectId,
        unitLesson: 'Curriculum Lesson',
        topic: currentQ.topic,
        language: 'en',
        ocrExcerpt:
          currentQ.lessonSummary ||
          `Source material for ${currentQ.topic}. Refer to printed textbook page ${printedPage}.`,
        keyWords: [],
        status: 'confirmed',
        confidence: 100,
      });
    }
  };

  return (
    <div
      className={`mx-auto px-4 py-6 transition-all duration-300 ${
        isLessonReminderEnabled && (hasLeftPanel || hasRightPanel)
          ? 'max-w-7xl'
          : 'max-w-4xl'
      }`}
    >
      {/* Top Banner & Timer */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <button
            onClick={onExit}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Leave Test</span>
          </button>
          <h2 className="text-base font-bold text-slate-900">{test.title}</h2>
          <p className="text-xs text-slate-500">
            Question {currentIndex + 1} of {totalQuestions} · {answeredCount} answered
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Timer Card */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-mono font-bold text-sm ${
              timeRemainingSeconds < 180
                ? 'bg-rose-50 border-rose-200 text-rose-600 animate-pulse'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <Clock className="w-4 h-4 text-slate-400" />
            <span>{formatTime(timeRemainingSeconds)}</span>
          </div>

          <button
            onClick={() => setIsConfirmSubmitOpen(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl transition-colors shadow-xs"
          >
            Finish & Submit
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-2 mb-6 overflow-hidden">
        <div
          className="bg-amber-500 h-full transition-all duration-300 rounded-full"
          style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Learning Support & Question Card Layout */}
      <div className="flex flex-col lg:flex-row items-start gap-5 mb-6">
        {/* LEFT PANEL: Lesson Reminder */}
        {hasLeftPanel && (
          <aside className="w-full lg:w-64 xl:w-72 shrink-0 order-2 lg:order-1">
            <div className="bg-amber-50/70 border border-amber-200/90 rounded-3xl p-5 shadow-2xs lg:sticky lg:top-4">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900 mb-2.5 pb-2 border-b border-amber-200/60">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="uppercase tracking-wider">Lesson Reminder</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium mb-4 whitespace-pre-line">
                {lessonReminderText}
              </p>
              <div className="pt-3 border-t border-amber-200/70 text-[11px] text-slate-600">
                <span className="block font-semibold text-slate-700 mb-1">
                  Source: {currentQ.bookTitle} · Page {currentQ.printedPage}{' '}
                  {currentQ.pdfPage ? `(PDF p.${currentQ.pdfPage})` : ''}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleOpenSourceForQuestion(currentQ.printedPage, currentQ.bookTitle)
                  }
                  className="inline-flex items-center gap-1.5 text-amber-800 hover:text-amber-950 font-bold underline underline-offset-2 transition-colors cursor-pointer mt-1"
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                  <span>View Source Page</span>
                  <ExternalLink className="w-3 h-3 text-amber-500" />
                </button>
              </div>
            </div>
          </aside>
        )}

        {/* CENTER: Main Question Card */}
        <main className="min-w-0 flex-1 order-1 lg:order-2 w-full">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            {/* Question Topic & Source Tag */}
            <div className="flex items-center justify-between gap-2 mb-4 text-xs">
              <span className="font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                {currentQ.topic}
              </span>
              <span className="text-slate-400 font-mono">
                {currentQ.bookTitle} · Page {currentQ.printedPage}
              </span>
            </div>

            {/* Reading Passage if present */}
            {currentQ.passage && (
              <div className="p-4 mb-6 bg-slate-50 rounded-2xl border border-slate-200 text-slate-800 text-sm leading-relaxed font-serif">
                {currentQ.passage}
              </div>
            )}

            {/* Question Prompt */}
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug mb-6">
              {currentQ.question}
            </h3>

            {/* Interactive Answer Input based on Question Type */}
            <div className="mt-4">
              {(() => {
                const qTypeLower = String(currentQ.questionType || '').toLowerCase();
                const isTrueFalseQ = qTypeLower === 'true_false';
                const isMatchingQ = qTypeLower === 'matching';
                const isMultipleChoiceQ =
                  (qTypeLower === 'multiple_choice' ||
                    qTypeLower === 'mcq' ||
                    (Array.isArray(currentQ.options) && currentQ.options.length > 0)) &&
                  !isTrueFalseQ &&
                  !isMatchingQ;
                const isCalculationQ =
                  qTypeLower === 'calculation' ||
                  qTypeLower === 'numerical_response' ||
                  qTypeLower === 'short_answer';
                const isFillInBlankQ =
                  qTypeLower === 'fill_in_blank' || qTypeLower === 'fill_in_the_blank';

                if (isMultipleChoiceQ && currentQ.options && currentQ.options.length > 0) {
                  return (
                    <div className="grid grid-cols-1 gap-3">
                      {currentQ.options.map((opt, idx) => {
                        const isSelected = answers[currentQ.id] === opt;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSelectAnswer(opt)}
                            className={`flex items-center text-left p-4 rounded-2xl border-2 transition-all min-h-[52px] cursor-pointer ${
                              isSelected
                                ? 'border-amber-500 bg-amber-50/60 text-amber-950 font-semibold shadow-xs'
                                : 'border-slate-200 hover:border-slate-300 text-slate-800'
                            }`}
                          >
                            <span
                              className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs mr-3.5 shrink-0 ${
                                isSelected ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span className="text-sm sm:text-base leading-snug">{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  );
                }

                if (isTrueFalseQ) {
                  return (
                    <div className="grid grid-cols-2 gap-4">
                      {['True', 'False'].map((opt) => {
                        const isSelected = answers[currentQ.id] === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleSelectAnswer(opt)}
                            className={`py-5 px-6 rounded-2xl border-2 font-bold text-base transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
                              isSelected
                                ? opt === 'True'
                                  ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm'
                                  : 'border-rose-500 bg-rose-50 text-rose-900 shadow-sm'
                                : 'border-slate-200 hover:border-slate-300 text-slate-700'
                            }`}
                          >
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  );
                }

                if (isCalculationQ) {
                  return (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row items-center gap-3">
                        <input
                          type="text"
                          value={answers[currentQ.id] || ''}
                          onChange={(e) => handleSelectAnswer(e.target.value)}
                          placeholder="Type your calculated answer here..."
                          className="w-full text-center sm:text-left text-xl font-bold font-mono px-4 py-3 bg-slate-50 border-2 border-slate-300 focus:border-amber-500 rounded-2xl focus:outline-none"
                        />
                      </div>

                      {/* Child-friendly keypad helper */}
                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 inline-block">
                        <span className="text-[11px] font-bold text-slate-400 block mb-2">QUICK NUMBER PAD</span>
                        <div className="grid grid-cols-5 gap-2 max-w-xs">
                          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((digit) => (
                            <button
                              key={digit}
                              type="button"
                              onClick={() =>
                                handleSelectAnswer(`${answers[currentQ.id] || ''}${digit}`)
                              }
                              className="h-10 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 font-bold text-slate-800 text-sm active:scale-95 transition-transform cursor-pointer"
                            >
                              {digit}
                            </button>
                          ))}
                          <button
                            type="button"
                            onClick={() =>
                              handleSelectAnswer(String(answers[currentQ.id] || '').slice(0, -1))
                            }
                            className="col-span-5 h-8 rounded-xl bg-slate-200 hover:bg-slate-300 font-semibold text-slate-600 text-xs transition-colors cursor-pointer"
                          >
                            Backspace ⌫
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }

                if (isFillInBlankQ) {
                  return (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={answers[currentQ.id] || ''}
                        onChange={(e) => handleSelectAnswer(e.target.value)}
                        placeholder="Type the missing word or answer..."
                        className="w-full text-base font-semibold px-4 py-3 bg-slate-50 border-2 border-slate-300 focus:border-amber-500 rounded-2xl focus:outline-none"
                      />
                    </div>
                  );
                }

                if (isMatchingQ && currentQ.matchingPairs) {
                  return (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                        <span>1. Select an item on the left, then select its match on the right.</span>
                        <button
                          type="button"
                          onClick={handleResetMatching}
                          className="flex items-center gap-1 text-rose-600 hover:underline cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reset Pairs</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Left column */}
                        <div className="space-y-2">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Question / Concept</span>
                          {currentQ.matchingPairs.map((p, idx) => {
                            const isDraftSelected = matchingDraft.leftSelected === p.left;
                            const isPaired = Boolean((answers[currentQ.id] || {})[p.left]);
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => handleMatchingClick('left', p.left)}
                                className={`w-full p-3 text-left rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                                  isDraftSelected
                                    ? 'border-amber-500 bg-amber-50 text-amber-900 ring-2 ring-amber-300'
                                    : isPaired
                                    ? 'border-emerald-300 bg-emerald-50/50 text-emerald-900'
                                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                                }`}
                              >
                                {p.left}
                                {isPaired && (
                                  <span className="block text-[11px] font-normal text-emerald-700 mt-1">
                                    → {(answers[currentQ.id] || {})[p.left]}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Right column */}
                        <div className="space-y-2">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Match / Answer</span>
                          {currentQ.matchingPairs.map((p, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleMatchingClick('right', p.right)}
                              className={`w-full p-3 text-left rounded-xl border text-sm font-semibold transition-all ${
                                matchingDraft.leftSelected
                                  ? 'border-amber-300 bg-amber-50/30 hover:bg-amber-100 hover:border-amber-500 cursor-pointer'
                                  : 'border-slate-200 bg-slate-50 text-slate-700'
                              }`}
                            >
                              {p.right}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }

                return null;
              })()}
            </div>
      </div>
    </main>

    {/* RIGHT PANEL: Key Point (Adaptive: shown when distinct support is useful) */}
    {hasRightPanel && (
      <aside className="w-full lg:w-64 xl:w-72 shrink-0 order-3">
        <div className="bg-indigo-50/60 border border-indigo-200/80 rounded-3xl p-5 shadow-2xs lg:sticky lg:top-4">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 mb-2.5 pb-2 border-b border-indigo-200/60">
            <Bookmark className="w-4 h-4 text-indigo-600 shrink-0" />
            <span className="uppercase tracking-wider">Key Point</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-medium mb-4 whitespace-pre-line">
            {keyPointText}
          </p>
          <div className="pt-3 border-t border-indigo-200/60 text-[11px] text-slate-600">
            <span className="block text-[11px] text-slate-500 font-medium mb-1">
              Topic: <strong className="text-slate-700">{currentQ.topic}</strong>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {currentQ.bookTitle} · Page {currentQ.printedPage}
            </span>
          </div>
        </div>
      </aside>
    )}
  </div>

      {/* Bottom Navigation Controls */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        {/* Question Bubbles Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto py-2">
          {questions.map((q, idx) => {
            const hasAns = answers[q.id] !== undefined && answers[q.id] !== '';
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
                  isCurrent
                    ? 'bg-amber-500 text-white ring-2 ring-amber-300 scale-105'
                    : hasAns
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {currentIndex < totalQuestions - 1 ? (
          <button
            onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-colors shadow-sm"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => setIsConfirmSubmitOpen(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 text-white font-bold text-sm hover:bg-amber-600 transition-colors shadow-sm"
          >
            <span>Submit Test</span>
            <CheckCircle2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Confirmation Modal */}
      {isConfirmSubmitOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Ready to Submit?</h3>
            <p className="text-sm text-slate-600 mb-4">
              You answered <span className="font-bold text-slate-900">{answeredCount}</span> out of{' '}
              <span className="font-bold text-slate-900">{totalQuestions}</span> questions.
              {answeredCount < totalQuestions && (
                <span className="block mt-1 text-amber-600 font-semibold">
                  Notice: You have {totalQuestions - answeredCount} unanswered questions!
                </span>
              )}
            </p>

            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Your Name (for score record):
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsConfirmSubmitOpen(false)}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-300 font-semibold text-xs text-slate-700 hover:bg-slate-50"
              >
                Go Back & Review
              </button>
              <button
                onClick={handleSubmitTest}
                className="flex-1 py-3 px-4 rounded-xl bg-amber-500 text-white font-bold text-xs hover:bg-amber-600 shadow-sm"
              >
                Yes, Submit Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Source Viewer Modal */}
      <SourceViewerModal
        page={selectedSourceForViewer}
        onClose={() => setSelectedSourceForViewer(null)}
      />
    </div>
  );
};
