import React from 'react';
import { TermData, TestAttempt } from '../../types';
import { StorageService } from '../../services/storageService';
import {
  Trophy,
  CheckCircle,
  XCircle,
  BookOpen,
  Calendar,
  Users,
  Award,
  AlertTriangle,
} from 'lucide-react';

interface AnalyticsManagerProps {
  term: TermData;
}

export const AnalyticsManager: React.FC<AnalyticsManagerProps> = ({ term }) => {
  const attempts = StorageService.getTestAttempts().filter((a) => a.termId === term.id);

  const totalAttempts = attempts.length;
  const avgScore =
    totalAttempts > 0
      ? Math.round(attempts.reduce((acc, curr) => acc + curr.percentage, 0) / totalAttempts)
      : 0;

  // Aggregate missed questions by printed textbook page
  const missedPagesMap: Record<string, { page: number | string; book: string; count: number; topic: string }> = {};

  attempts.forEach((att) => {
    att.results.forEach((res) => {
      if (!res.isCorrect) {
        const key = `${res.bookTitle}-p${res.printedPage}`;
        if (!missedPagesMap[key]) {
          missedPagesMap[key] = {
            page: res.printedPage,
            book: res.bookTitle,
            count: 0,
            topic: res.topic,
          };
        }
        missedPagesMap[key].count += 1;
      }
    });
  });

  const topMissedPages = Object.values(missedPagesMap).sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 inline-block mb-1">
            Student Performance & Textbook Analytics
          </span>
          <h2 className="text-xl font-bold text-slate-900">Practice Test Results ({term.name})</h2>
          <p className="text-xs text-slate-500">
            Monitor student completion, accuracy rates, and pinpoint which textbook pages need teacher reinforcement.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Tests Completed
            </span>
            <Users className="w-5 h-5 text-indigo-600" />
          </div>
          <span className="text-3xl font-extrabold text-slate-900 font-mono">
            {totalAttempts}
          </span>
          <span className="text-xs text-slate-400 block mt-1">Student practice attempts</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Average Score
            </span>
            <Award className="w-5 h-5 text-amber-500" />
          </div>
          <span className="text-3xl font-extrabold text-slate-900 font-mono">{avgScore}%</span>
          <span className="text-xs text-slate-400 block mt-1">Classroom average</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Textbook Pages to Review
            </span>
            <AlertTriangle className="w-5 h-5 text-rose-500" />
          </div>
          <span className="text-3xl font-extrabold text-rose-600 font-mono">
            {topMissedPages.length}
          </span>
          <span className="text-xs text-slate-400 block mt-1">Pages with student mistakes</span>
        </div>
      </div>

      {/* Top Missed Textbook Pages (Targeted Reinforcement) */}
      {topMissedPages.length > 0 && (
        <div className="bg-white rounded-2xl border border-rose-200 p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-rose-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Recommended Textbook Pages for Teacher Reteaching
            </h3>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Based on student errors, the following textbook pages had the highest error rates:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {topMissedPages.slice(0, 6).map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-rose-50/50 border border-rose-200 text-xs"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-bold text-rose-900 font-mono">
                    Textbook Page {item.page}
                  </span>
                  <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded font-bold text-[11px]">
                    {item.count} mistakes
                  </span>
                </div>
                <span className="font-medium text-slate-800 block line-clamp-1">{item.topic}</span>
                <span className="text-[11px] text-slate-500 line-clamp-1">{item.book}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Student Attempts Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h3 className="text-sm font-bold text-slate-800">Student Submission Log</h3>
        </div>

        {attempts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/70 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-5">Student</th>
                  <th className="py-3 px-6">Practice Test</th>
                  <th className="py-3 px-5 text-center">Score</th>
                  <th className="py-3 px-5 text-center">Percentage</th>
                  <th className="py-3 px-5 text-right">Date Completed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {attempts.map((att) => (
                  <tr key={att.id} className="hover:bg-slate-50/60">
                    <td className="py-3.5 px-5 font-bold text-slate-900">{att.studentName}</td>
                    <td className="py-3.5 px-6 text-xs text-slate-700">{att.testTitle}</td>
                    <td className="py-3.5 px-5 text-center font-mono text-xs font-bold">
                      {att.score} / {att.total}
                    </td>
                    <td className="py-3.5 px-5 text-center">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          att.percentage >= 70
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {att.percentage}%
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right text-xs text-slate-400 font-mono">
                      {new Date(att.completedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-slate-400">
            No student practice sessions recorded yet for {term.name}.
          </div>
        )}
      </div>
    </div>
  );
};
