import React, { useState, useMemo } from 'react';
import { TermData, PracticeTest, SubjectId, Question } from '../../types';
import { PracticeScopeService } from '../../services/practiceScopeService';
import {
  Plus,
  Play,
  Clock,
  CheckCircle,
  Eye,
  Trash2,
  FileCheck,
  Send,
  Sparkles,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';
import { StorageService } from '../../services/storageService';
import { CoverageService } from '../../services/coverageService';

interface TestPublisherProps {
  term: TermData;
  onUpdateTerm: (updated: TermData) => void;
}

export const TestPublisher: React.FC<TestPublisherProps> = ({
  term,
  onUpdateTerm,
}) => {
  const availableSubjects = useMemo(
    () => PracticeScopeService.getTermSubjects(term).filter((s) => !s.isProjectBased),
    [term]
  );

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<SubjectId>(() => (availableSubjects[0]?.id as SubjectId) || 'mathematics');
  const [testTitle, setTestTitle] = useState('');
  const [testDescription, setTestDescription] = useState('');
  const [timeLimit, setTimeLimit] = useState(20);
  const [questionCount, setQuestionCount] = useState(10);
  const [randomize, setRandomize] = useState(true);
  const [allowLessonReminders, setAllowLessonReminders] = useState(false); // Default OFF for formal published tests

  const currentSubject = availableSubjects.find((s) => s.id === selectedSubjectId) || availableSubjects[0];
  const stats = useMemo(() => CoverageService.getOverallCoverageStats(term), [term]);

  // Filter only APPROVED questions for this subject
  const approvedSubjectQuestions = term.questions.filter(
    (q) => q.subjectId === selectedSubjectId && (q.approvalStatus === 'approved' || q.approvalStatus === 'APPROVED')
  );

  const handleCreateTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (approvedSubjectQuestions.length === 0) {
      alert('There are no approved questions for this subject yet. Please approve questions in the Question Bank first.');
      return;
    }

    let selectedQuestions = [...approvedSubjectQuestions];
    if (randomize) {
      selectedQuestions.sort(() => 0.5 - Math.random());
    }
    const chosenIds = selectedQuestions
      .slice(0, Math.min(questionCount, selectedQuestions.length))
      .map((q) => q.id);

    const newTest: PracticeTest = {
      id: `test-${selectedSubjectId}-${Date.now()}`,
      termId: term.id,
      subjectId: selectedSubjectId,
      title: testTitle || `${currentSubject.name} Practice Exam`,
      description:
        testDescription ||
        `Comprehensive ${term.grade || 'Grade 3'} exam practice based on ${currentSubject.bookTitle}.`,
      timeLimitMinutes: timeLimit,
      passingPercentage: 70,
      questionIds: chosenIds,
      isPublished: true,
      createdAt: new Date().toISOString(),
      allowLessonReminders: allowLessonReminders,
    };

    const updatedTests = [...term.practiceTests, newTest];
    const updatedTerm = { ...term, practiceTests: updatedTests };
    StorageService.updateTerm(updatedTerm);
    onUpdateTerm(updatedTerm);

    setIsCreateModalOpen(false);
    setTestTitle('');
    setTestDescription('');
    setAllowLessonReminders(false);
  };

  const handleTogglePublish = (testId: string) => {
    const updatedTests = term.practiceTests.map((t) =>
      t.id === testId ? { ...t, isPublished: !t.isPublished } : t
    );
    const updatedTerm = { ...term, practiceTests: updatedTests };
    StorageService.updateTerm(updatedTerm);
    onUpdateTerm(updatedTerm);
  };

  const handleToggleLessonReminders = (testId: string) => {
    const updatedTests = term.practiceTests.map((t) =>
      t.id === testId ? { ...t, allowLessonReminders: !t.allowLessonReminders } : t
    );
    const updatedTerm = { ...term, practiceTests: updatedTests };
    StorageService.updateTerm(updatedTerm);
    onUpdateTerm(updatedTerm);
  };

  const handleDeleteTest = (testId: string) => {
    const updatedTests = term.practiceTests.filter((t) => t.id !== testId);
    const updatedTerm = { ...term, practiceTests: updatedTests };
    StorageService.updateTerm(updatedTerm);
    onUpdateTerm(updatedTerm);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 inline-block mb-1">
            Stage 5 · Test Publisher
          </span>
          <h2 className="text-xl font-bold text-slate-900">Publish Practice Tests for Students</h2>
          <p className="text-xs text-slate-500">
            Create customized timed practice tests composed exclusively of teacher-approved questions.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create & Publish New Test</span>
        </button>
      </div>

      {/* Scope & Readiness Status Banner */}
      <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-amber-900">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Official Scope Status:</strong> {stats.totalSubjectsInScope} subjects in scope · {stats.readyTestsCount} tests ready · {stats.awaitingTestsCount} awaiting generation/approval ({stats.awaitingSubjectNames.join(', ')})
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-semibold">
          <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
            {stats.readyTestsCount} Published & Live
          </span>
          <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
            {stats.awaitingTestsCount} Awaiting Published Test
          </span>
        </div>
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {term.practiceTests.map((test) => {
          const sub = availableSubjects.find((s) => s.id === test.subjectId);
          const questionCount = test.questionIds.length;

          return (
            <div
              key={test.id}
              className={`bg-white rounded-2xl border p-6 flex flex-col justify-between transition-all ${
                test.isPublished ? 'border-slate-200 shadow-xs' : 'border-slate-200 opacity-60 bg-slate-50'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-100">
                    {sub?.name}
                  </span>
                  <div className="flex items-center gap-2">
                    {test.isPublished ? (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                        LIVE FOR STUDENTS
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        DRAFT / HIDDEN
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1">{test.title}</h3>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">{test.description}</p>

                <div className="flex items-center gap-4 text-xs text-slate-600 font-mono mb-4 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{test.timeLimitMinutes} Mins</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileCheck className="w-3.5 h-3.5 text-slate-400" />
                    <span>{questionCount} Questions</span>
                  </div>
                  <div>
                    <span>Pass: {test.passingPercentage}%</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleLessonReminders(test.id)}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border transition-colors cursor-pointer ${
                      test.allowLessonReminders
                        ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                        : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                    }`}
                    title="Click to toggle student lesson reminders during test"
                  >
                    <Lightbulb className={`w-3 h-3 ${test.allowLessonReminders ? 'text-amber-600' : 'text-slate-400'}`} />
                    <span>Reminders: {test.allowLessonReminders ? 'ON' : 'OFF'}</span>
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => handleTogglePublish(test.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    test.isPublished
                      ? 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  {test.isPublished ? 'Unpublish Test' : 'Publish to Students'}
                </button>

                <button
                  onClick={() => handleDeleteTest(test.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete Test"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Test Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateTest}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-1">Create Practice Test</h3>
            <p className="text-xs text-slate-500 mb-4">
              Assemble approved questions into a real practice test for {term.grade || 'Grade 3'} students.
            </p>

            <div className="space-y-4 mb-6">
              {/* Subject */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value as SubjectId)}
                  className="w-full text-xs p-2.5 border rounded-xl focus:border-indigo-500 focus:outline-none"
                >
                  {availableSubjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  {approvedSubjectQuestions.length} approved questions available for this subject.
                </span>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Test Title</label>
                <input
                  type="text"
                  value={testTitle}
                  onChange={(e) => setTestTitle(e.target.value)}
                  placeholder={`e.g. ${currentSubject.name} Term Practice 1`}
                  className="w-full text-xs p-2.5 border rounded-xl focus:border-indigo-500 focus:outline-none font-semibold"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Instructions / Description</label>
                <textarea
                  rows={2}
                  value={testDescription}
                  onChange={(e) => setTestDescription(e.target.value)}
                  placeholder="Exam instructions for students..."
                  className="w-full text-xs p-2.5 border rounded-xl focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Quick Presets */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Test Size Presets (Drawn from Question Bank)
                </label>
                <div className="grid grid-cols-4 gap-1.5 text-center">
                  {[
                    { label: 'Quick 10', count: 10, time: 15 },
                    { label: 'Standard 15', count: 15, time: 20 },
                    { label: 'Full 20', count: 20, time: 30 },
                    { label: 'All Bank', count: approvedSubjectQuestions.length || 10, time: 40 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setQuestionCount(Math.min(preset.count, approvedSubjectQuestions.length || preset.count));
                        setTimeLimit(preset.time);
                      }}
                      className="py-1.5 px-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Number of questions */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Question Count
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={Math.max(1, approvedSubjectQuestions.length)}
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border rounded-xl focus:border-indigo-500 focus:outline-none font-mono"
                  />
                </div>

                {/* Time limit */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Time Limit (Minutes)
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={120}
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border rounded-xl focus:border-indigo-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Randomize checkbox */}
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={randomize}
                  onChange={(e) => setRandomize(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Randomize question order for students</span>
              </label>

              {/* Lesson Reminders setting */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3">
                <div>
                  <span className="block text-xs font-bold text-slate-800">
                    Lesson Reminders (Student Concept Guide)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Allow students to open collapsible concept reminders during this test
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setAllowLessonReminders((prev) => !prev)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors border ${
                    allowLessonReminders
                      ? 'bg-amber-500 text-white border-amber-600 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {allowLessonReminders ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 font-semibold text-xs text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shadow-sm"
              >
                Create & Publish Test
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
