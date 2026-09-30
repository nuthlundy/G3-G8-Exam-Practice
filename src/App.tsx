import React, { useState, useEffect } from 'react';
import { StorageService } from './services/storageService';
import { TermData } from './types';
import { Navbar } from './components/Navbar';
import { StudentPortal } from './components/StudentPortal';
import { TeacherPortal } from './components/TeacherPortal';
import { PointerManager } from './components/teacher/PointerManager';
import { TextbookPagesExplorer } from './components/TextbookPagesExplorer';
import { NewTermModal } from './components/teacher/NewTermModal';

export default function App() {
  const [terms, setTerms] = useState<TermData[]>(() => StorageService.getTerms());
  const [activeGrade, setActiveGrade] = useState<string>(() => StorageService.getActiveGrade());
  const [activeTermId, setActiveTermId] = useState<string>(() => {
    const grade = StorageService.getActiveGrade();
    const storedTermId = StorageService.getActiveTermId();
    const allTerms = StorageService.getTerms();
    const matching = allTerms.filter((t) => (t.grade || 'Grade 3') === grade);
    if (matching.some((t) => t.id === storedTermId)) {
      return storedTermId;
    }
    return matching[0]?.id || storedTermId;
  });
  const [currentRole, setCurrentRole] = useState<'student' | 'teacher'>('student');
  const [activeNavTab, setActiveNavTab] = useState<string>('practice');
  const [isNewTermModalOpen, setIsNewTermModalOpen] = useState(false);

  // Available Grades in system
  const availableGrades = Array.from(new Set(terms.map((t) => t.grade || 'Grade 3')));
  if (!availableGrades.includes('Grade 3')) {
    availableGrades.unshift('Grade 3');
  }
  if (!availableGrades.includes('Grade 8')) {
    availableGrades.push('Grade 8');
  }

  // Filtered terms for the currently selected grade
  const gradeTerms = terms.filter((t) => (t.grade || 'Grade 3') === activeGrade);

  // Active term object
  const activeTerm =
    gradeTerms.find((t) => t.id === activeTermId) ||
    gradeTerms[0] ||
    terms.find((t) => t.id === activeTermId) ||
    terms[0];

  // Auto-sync activeTermId when activeGrade changes
  useEffect(() => {
    if (activeTerm && activeTerm.id !== activeTermId) {
      setActiveTermId(activeTerm.id);
      StorageService.setActiveTermId(activeTerm.id);
    }
  }, [activeGrade, activeTerm, activeTermId]);

  const handleRoleChange = (newRole: 'student' | 'teacher') => {
    setCurrentRole(newRole);
    if (newRole === 'student') {
      setActiveNavTab('practice');
    } else {
      setActiveNavTab('mapping');
    }
  };

  const handleGradeChange = (newGrade: string) => {
    const freshTerms = StorageService.getTerms();
    setTerms(freshTerms);
    setActiveGrade(newGrade);
    StorageService.setActiveGrade(newGrade);
    const matching = freshTerms.filter((t) => (t.grade || 'Grade 3') === newGrade);
    if (matching.length > 0) {
      setActiveTermId(matching[0].id);
      StorageService.setActiveTermId(matching[0].id);
    }
  };

  const handleTermChange = (termId: string) => {
    const freshTerms = StorageService.getTerms();
    setTerms(freshTerms);
    setActiveTermId(termId);
    StorageService.setActiveTermId(termId);
    const found = freshTerms.find((t) => t.id === termId);
    if (found && found.grade && found.grade !== activeGrade) {
      setActiveGrade(found.grade);
      StorageService.setActiveGrade(found.grade);
    }
  };

  const handleUpdateTerm = (updatedTerm: TermData) => {
    const updatedTerms = terms.map((t) => (t.id === updatedTerm.id ? updatedTerm : t));
    setTerms(updatedTerms);
    StorageService.saveTerms(updatedTerms);
  };

  const handleTermCreated = (newTerm: TermData) => {
    const updatedTerms = [...terms, newTerm];
    const newGrade = newTerm.grade || 'Grade 3';
    setTerms(updatedTerms);
    setActiveGrade(newGrade);
    setActiveTermId(newTerm.id);
    StorageService.saveTerms(updatedTerms);
    StorageService.setActiveGrade(newGrade);
    StorageService.setActiveTermId(newTerm.id);
    setCurrentRole('teacher');
    setActiveNavTab('pointer');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* 3-zone Header Navigation with Grade & Term Selectors */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        activeNavTab={activeNavTab}
        onNavTabChange={setActiveNavTab}
        terms={terms}
        activeGrade={activeGrade}
        onGradeChange={handleGradeChange}
        availableGrades={availableGrades}
        activeTermId={activeTermId}
        onTermChange={handleTermChange}
        onOpenNewTermModal={() => setIsNewTermModalOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1">
        {currentRole === 'student' ? (
          <>
            {activeNavTab === 'practice' && (
              <StudentPortal
                key={`${activeTerm.grade || 'Grade 3'}-${activeTerm.id}`}
                term={activeTerm}
                activeNavTab={activeNavTab}
                onOpenPointerView={() => setActiveNavTab('pointer')}
                onOpenSourcesView={() => setActiveNavTab('sources')}
              />
            )}
            {activeNavTab === 'pointer' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <PointerManager
                  key={`${activeTerm.grade || 'Grade 3'}-${activeTerm.id}`}
                  term={activeTerm}
                  onUpdateTerm={handleUpdateTerm}
                />
              </div>
            )}
            {activeNavTab === 'sources' && (
              <TextbookPagesExplorer
                key={`${activeTerm.grade || 'Grade 3'}-${activeTerm.id}`}
                term={activeTerm}
              />
            )}
          </>
        ) : (
          <TeacherPortal
            key={`${activeTerm.grade || 'Grade 3'}-${activeTerm.id}`}
            term={activeTerm}
            activeNavTab={activeNavTab}
            onNavTabChange={setActiveNavTab}
            onUpdateTerm={handleUpdateTerm}
          />
        )}
      </main>

      {/* Future Term Modal (Supports Term 2, 3, 4 without code edits) */}
      <NewTermModal
        isOpen={isNewTermModalOpen}
        onClose={() => setIsNewTermModalOpen(false)}
        onTermCreated={handleTermCreated}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            {activeTerm?.grade || 'Grade 3'} Term Exam Practice · Reusable across Grades & Terms
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Authoritative Source Mapped</span>
            <span>·</span>
            <span>Teacher Verified</span>
            <span>·</span>
            <span>Vercel Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
