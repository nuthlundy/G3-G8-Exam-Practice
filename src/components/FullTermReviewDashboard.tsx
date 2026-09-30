import React, { useState } from 'react';
import { TermData, SubjectMetadata } from '../types';
import { FullTermReviewService, FullTermReviewStats } from '../services/fullTermReviewService';
import {
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Play,
  RotateCcw,
  ArrowLeft,
  Target,
  Award,
  HelpCircle,
} from 'lucide-react';

interface FullTermReviewDashboardProps {
  term: TermData;
  subject: SubjectMetadata;
  onStartSession: (mode: 'full' | 'weak_points') => void;
  onClose: () => void;
}

export const FullTermReviewDashboard: React.FC<FullTermReviewDashboardProps> = ({
  term,
  subject,
  onStartSession,
  onClose,
}) => {
  const [stats, setStats] = useState<FullTermReviewStats>(() =>
    FullTermReviewService.getReviewStats(term, subject.id)
  );
  const [progress, setProgress] = useState(() =>
    FullTermReviewService.getStudentProgress(term, subject.id)
  );

  const verifiedLps = FullTermReviewService.getSubjectLearningPoints(term, subject.id);

  // Compute LPs that actually have approved questions available
  const availableLpKeySet = React.useMemo(() => {
    const approvedQuestions = (term.questions || []).filter((q) => {
      if (q.subjectId !== subject.id) return false;
      const isApproved = q.approvalStatus === 'APPROVED' || q.approvalStatus === 'approved';
      if (!isApproved) return false;
      if (q.subjectId === 'kh_history') return false;
      if (q.subjectId === 'science' && String(q.printedPage).includes('41')) return false;
      return true;
    });

    const set = new Set<string>();
    approvedQuestions.forEach((q) => {
      const canonicalKey = FullTermReviewService.resolveCanonicalLpKey(term, subject.id, q);
      if (canonicalKey) {
        set.add(canonicalKey);
      }
    });
    return set;
  }, [term, subject.id]);

  const availableLpsCount = availableLpKeySet.size;

  const handleReset = () => {
    if (confirm(`Reset your Full Term Review progress for ${subject.name}? This will clear your current coverage metrics.`)) {
      FullTermReviewService.resetSubjectProgress(term, subject.id);
      setStats(FullTermReviewService.getReviewStats(term, subject.id));
      setProgress(FullTermReviewService.getStudentProgress(term, subject.id));
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Top Header & Back Button */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Practice Scope</span>
        </button>
        <span className="text-xs font-bold text-amber-900 bg-amber-100 border border-amber-200/80 px-3 py-1 rounded-full">
          Coverage-Driven Learning Mode
        </span>
      </div>

      {/* Main Review Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg mb-8 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-3 border border-amber-500/30">
            <Target className="w-3.5 h-3.5 text-amber-400" />
            <span>FULL TERM REVIEW</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            {term.grade || 'Grade 8'} {subject.name} — Exam Scope Review
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
            Systematically review all available verified learning points in your {subject.name} exam scope. Unlike a 10-question quick test, Full Term Review targets comprehensive learning-point coverage across all verified syllabus items.
          </p>

          {/* Progress Bar */}
          <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md border border-white/15 mb-6">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className="text-amber-200">Your Term Coverage</span>
              <span className="text-white font-mono text-sm">{stats.coveragePercent}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-white/10">
              <div
                className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${stats.coveragePercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-medium">
              <span>Your Coverage: {stats.reviewedLps} / {stats.totalLps} LPs Reviewed</span>
              <span className="text-emerald-300 font-semibold">
                Content Available: {availableLpsCount} / {stats.totalLps} LPs
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onStartSession('full')}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-transform active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>
                {stats.reviewedLps === 0
                  ? 'Start Review Session (20 Qs)'
                  : stats.isComplete
                  ? 'Review Syllabus Again'
                  : 'Continue Review Session'}
              </span>
            </button>

            {stats.needsPracticeLps > 0 && (
              <button
                onClick={() => onStartSession('weak_points')}
                className="px-5 py-3 bg-rose-500/80 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm rounded-xl backdrop-blur-xs transition-colors flex items-center gap-2 cursor-pointer border border-rose-400/40"
              >
                <AlertCircle className="w-4 h-4 text-rose-200" />
                <span>Practice Weak Points ({stats.needsPracticeLps})</span>
              </button>
            )}

            {stats.reviewedLps > 0 && (
              <button
                onClick={handleReset}
                className="px-4 py-3 bg-white/10 hover:bg-white/20 text-slate-300 font-semibold text-xs rounded-xl backdrop-blur-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>Reset Coverage</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Total Syllabus LPs
          </span>
          <span className="text-xl font-extrabold text-slate-900 font-mono">{stats.totalLps}</span>
        </div>

        <div className="bg-blue-50/70 rounded-2xl p-4 border border-blue-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block mb-1">
            Content Available
          </span>
          <span className="text-xl font-extrabold text-blue-700 font-mono">
            {availableLpsCount} <span className="text-xs text-blue-500 font-normal">/ {stats.totalLps}</span>
          </span>
        </div>

        <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
            Your Coverage
          </span>
          <span className="text-xl font-extrabold text-emerald-700 font-mono">
            {stats.reviewedLps} <span className="text-xs text-emerald-500 font-normal">/ {stats.totalLps}</span>
          </span>
        </div>

        <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
            Needs Practice
          </span>
          <span className="text-xl font-extrabold text-amber-700 font-mono">{stats.needsPracticeLps}</span>
        </div>
      </div>

      {/* Syllabus Learning Points Breakdown Checklist */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Verified Learning Points Breakdown</h3>
            <p className="text-xs text-slate-500">
              Individual curriculum points required by official Exam Pointer.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-xl">
            {verifiedLps.length} Items ({availableLpsCount} Practice Ready)
          </span>
        </div>

        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {verifiedLps.map((lp, idx) => {
            const lpKey = FullTermReviewService.getLpKey(lp);
            const isAvailable = availableLpKeySet.has(lpKey);
            const pItem = progress.learningPoints[lpKey];
            const status = pItem?.status || 'NOT_REVIEWED';

            return (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 text-xs ${
                  status === 'REVIEWED'
                    ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                    : status === 'NEEDS_MORE_PRACTICE'
                    ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                    : !isAvailable
                    ? 'bg-slate-100/70 border-slate-200/90 text-slate-600'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 shrink-0">
                    {status === 'REVIEWED' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : status === 'NEEDS_MORE_PRACTICE' ? (
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                    ) : !isAvailable ? (
                      <HelpCircle className="w-4 h-4 text-slate-400" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                    )}
                  </div>
                  <div>
                    <span className="font-bold block text-slate-900 leading-snug mb-0.5">
                      {lp.learningPoint}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {lp.bookTitle || subject.name} · Page {lp.printedPage}{' '}
                      {lp.pdfPage ? `(PDF p.${lp.pdfPage})` : ''}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  {status === 'REVIEWED' && (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/90 px-2.5 py-1 rounded-lg">
                      Reviewed
                    </span>
                  )}
                  {status === 'NEEDS_MORE_PRACTICE' && (
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100/90 px-2.5 py-1 rounded-lg">
                      Needs Practice
                    </span>
                  )}
                  {status === 'NOT_REVIEWED' && isAvailable && (
                    <span className="text-[10px] font-medium text-slate-500 bg-slate-200/70 px-2.5 py-1 rounded-lg">
                      Not Reviewed
                    </span>
                  )}
                  {!isAvailable && (
                    <span className="text-[10px] font-medium text-slate-600 bg-slate-200/90 px-2.5 py-1 rounded-lg">
                      Scope Pending
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
