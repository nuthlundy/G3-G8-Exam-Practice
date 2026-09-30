import React from 'react';
import { TermData } from '../types';
import { GraduationCap, ShieldCheck, Plus, Sparkles, BookOpen } from 'lucide-react';

interface NavbarProps {
  currentRole: 'student' | 'teacher';
  onRoleChange: (role: 'student' | 'teacher') => void;
  activeNavTab: string;
  onNavTabChange: (tab: string) => void;
  terms: TermData[];
  activeGrade: string;
  onGradeChange: (grade: string) => void;
  availableGrades: string[];
  activeTermId: string;
  onTermChange: (termId: string) => void;
  onOpenNewTermModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  activeNavTab,
  onNavTabChange,
  terms,
  activeGrade,
  onGradeChange,
  availableGrades,
  activeTermId,
  onTermChange,
  onOpenNewTermModal,
}) => {
  const activeTerm = terms.find((t) => t.id === activeTermId) || terms[0];
  const gradeLabel = activeTerm?.grade || activeGrade || 'Grade 3';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single element brand title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavTabChange(currentRole === 'student' ? 'practice' : 'mapping')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm shadow-amber-200 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 block leading-tight">
                  {gradeLabel.toUpperCase()} EXAM PRACTICE
                </span>
                <span className="text-[11px] font-medium text-slate-500 block leading-none">
                  {activeTerm ? `${activeTerm.name} · ${activeTerm.academicYear}` : 'Term Exam System'}
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Clean 4-6 text nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            {currentRole === 'student' ? (
              <>
                <button
                  onClick={() => onNavTabChange('practice')}
                  className={`transition-colors pb-0.5 whitespace-nowrap ${
                    activeNavTab === 'practice'
                      ? 'text-amber-600 border-b-2 border-amber-600 font-semibold'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Practice Tests
                </button>
                <button
                  onClick={() => onNavTabChange('pointer')}
                  className={`transition-colors pb-0.5 whitespace-nowrap ${
                    activeNavTab === 'pointer'
                      ? 'text-amber-600 border-b-2 border-amber-600 font-semibold'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Exam Scope
                </button>
                <button
                  onClick={() => onNavTabChange('sources')}
                  className={`transition-colors pb-0.5 whitespace-nowrap ${
                    activeNavTab === 'sources'
                      ? 'text-amber-600 border-b-2 border-amber-600 font-semibold'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Textbook Pages
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onNavTabChange('pointer')}
                  className={`transition-colors pb-0.5 whitespace-nowrap ${
                    activeNavTab === 'pointer'
                      ? 'text-indigo-600 border-b-2 border-indigo-600 font-semibold'
                      : 'hover:text-slate-900'
                  }`}
                >
                  1. Exam Pointer
                </button>
                <button
                  onClick={() => onNavTabChange('source_analysis')}
                  className={`transition-colors pb-0.5 whitespace-nowrap ${
                    activeNavTab === 'source_analysis'
                      ? 'text-indigo-600 border-b-2 border-indigo-600 font-semibold'
                      : 'hover:text-slate-900'
                  }`}
                >
                  2. Source Detection
                </button>
                <button
                  onClick={() => onNavTabChange('mapping')}
                  className={`transition-colors pb-0.5 whitespace-nowrap ${
                    activeNavTab === 'mapping'
                      ? 'text-indigo-600 border-b-2 border-indigo-600 font-semibold'
                      : 'hover:text-slate-900'
                  }`}
                >
                  3. Page Mapping
                </button>
                <button
                  onClick={() => onNavTabChange('coverage')}
                  className={`transition-colors pb-0.5 whitespace-nowrap ${
                    activeNavTab === 'coverage'
                      ? 'text-indigo-600 border-b-2 border-indigo-600 font-semibold'
                      : 'hover:text-slate-900'
                  }`}
                >
                  4. Coverage Matrix
                </button>
                <button
                  onClick={() => onNavTabChange('extracted')}
                  className={`transition-colors pb-0.5 whitespace-nowrap ${
                    activeNavTab === 'extracted'
                      ? 'text-indigo-600 border-b-2 border-indigo-600 font-semibold'
                      : 'hover:text-slate-900'
                  }`}
                >
                  5. Extracted Content
                </button>
                <button
                  onClick={() => onNavTabChange('questions')}
                  className={`transition-colors pb-0.5 whitespace-nowrap ${
                    activeNavTab === 'questions'
                      ? 'text-indigo-600 border-b-2 border-indigo-600 font-semibold'
                      : 'hover:text-slate-900'
                  }`}
                >
                  6. Question Bank
                </button>
                <button
                  onClick={() => onNavTabChange('tests')}
                  className={`transition-colors pb-0.5 whitespace-nowrap ${
                    activeNavTab === 'tests'
                      ? 'text-indigo-600 border-b-2 border-indigo-600 font-semibold'
                      : 'hover:text-slate-900'
                  }`}
                >
                  7. Publish Tests
                </button>
                <button
                  onClick={() => onNavTabChange('analytics')}
                  className={`transition-colors pb-0.5 whitespace-nowrap ${
                    activeNavTab === 'analytics'
                      ? 'text-indigo-600 border-b-2 border-indigo-600 font-semibold'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Student Results
                </button>
              </>
            )}
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-3">
            {/* Grade & Term Selectors */}
            <div className="flex items-center gap-1.5 bg-slate-100/90 rounded-xl p-1 border border-slate-200">
              {/* Grade Selector */}
              <div className="flex items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase px-1.5 hidden sm:inline">
                  Grade:
                </span>
                <select
                  value={activeGrade}
                  onChange={(e) => onGradeChange(e.target.value)}
                  className="text-xs font-bold bg-white text-slate-800 pl-2 pr-5 py-1 rounded-lg border border-slate-200 focus:outline-none cursor-pointer shadow-2xs"
                  title="Select Grade"
                >
                  {availableGrades.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div className="h-4 w-px bg-slate-200" />

              {/* Term Selector */}
              <div className="flex items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase px-1.5 hidden sm:inline">
                  Term:
                </span>
                <select
                  value={activeTermId}
                  onChange={(e) => onTermChange(e.target.value)}
                  className="text-xs font-bold bg-white text-slate-800 pl-2 pr-5 py-1 rounded-lg border border-slate-200 focus:outline-none cursor-pointer shadow-2xs"
                  title="Select Academic Term"
                >
                  {terms
                    .filter((t) => (t.grade || 'Grade 3') === activeGrade)
                    .map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.academicYear})
                      </option>
                    ))}
                </select>
              </div>

              {currentRole === 'teacher' && (
                <button
                  onClick={onOpenNewTermModal}
                  className="p-1 hover:bg-white rounded-lg text-indigo-600 transition-colors ml-0.5"
                  title="Add Academic Term or Grade"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Mode Switcher */}
            <button
              onClick={() => onRoleChange(currentRole === 'student' ? 'teacher' : 'student')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                currentRole === 'teacher'
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              {currentRole === 'teacher' ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-200" />
                  <span>Teacher Portal</span>
                </>
              ) : (
                <>
                  <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                  <span>Student View</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
