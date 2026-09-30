import React, { useState } from 'react';
import { TermData } from '../types';
import { PointerManager } from './teacher/PointerManager';
import { PageMappingManager } from './teacher/PageMappingManager';
import { MultiSubjectSourceManager } from './teacher/MultiSubjectSourceManager';
import { ContentCoverageManager } from './teacher/ContentCoverageManager';
import { ExtractedContentManager } from './teacher/ExtractedContentManager';
import { QuestionBankManager } from './teacher/QuestionBankManager';
import { TestPublisher } from './teacher/TestPublisher';
import { AnalyticsManager } from './teacher/AnalyticsManager';
import { StorageService } from '../services/storageService';
import {
  FileText,
  Layers,
  Sparkles,
  Send,
  BarChart3,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';

interface TeacherPortalProps {
  term: TermData;
  activeNavTab: string;
  onNavTabChange: (tab: string) => void;
  onUpdateTerm: (updated: TermData) => void;
}

export const TeacherPortal: React.FC<TeacherPortalProps> = ({
  term,
  activeNavTab,
  onNavTabChange,
  onUpdateTerm,
}) => {
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const handleExportJson = () => {
    const json = StorageService.exportAllData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grade3-exam-practice-${term.id}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportNotice('Full curriculum and test database exported successfully!');
    setTimeout(() => setExportNotice(null), 3500);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = StorageService.importData(content);
      if (success) {
        const active = StorageService.getTerm(term.id) || StorageService.getTerms()[0];
        onUpdateTerm(active);
        alert('Database imported successfully!');
      } else {
        alert('Failed to parse database file.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetDefaults = () => {
    const targetTermId = term.grade === 'Grade 8' ? 'term-g8-t1' : 'term-1';
    if (confirm(`Reset to original ${term.grade || 'Grade 3'} ${term.name} authoritative materials? Any custom questions added will be refreshed.`)) {
      StorageService.resetToDefault();
      const reset = StorageService.getTerm(targetTermId) || StorageService.getTerms()[0];
      onUpdateTerm(reset);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Workflow Navigation Sub-bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 mb-8 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto">
          {[
            { id: 'pointer', label: '1. Exam Pointer', icon: FileText },
            { id: 'source_analysis', label: '2. Multi-Subject Source Detection', icon: Layers },
            { id: 'mapping', label: '3. Page Mapping', icon: Layers },
            { id: 'coverage', label: '4. Content Coverage Matrix', icon: CheckCircle2 },
            { id: 'extracted', label: '5. Extracted Content', icon: Layers },
            { id: 'questions', label: '6. Question Bank', icon: Sparkles },
            { id: 'tests', label: '7. Publish Tests', icon: Send },
            { id: 'analytics', label: 'Student Results', icon: BarChart3 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeNavTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onNavTabChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Database Utility Controls */}
        <div className="flex items-center gap-2 ml-auto">
          {exportNotice && (
            <span className="text-xs text-emerald-600 font-semibold animate-pulse flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{exportNotice}</span>
            </span>
          )}

          <button
            onClick={handleExportJson}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
            title="Export all terms and questions to JSON file"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Backup JSON</span>
          </button>

          <label
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 cursor-pointer"
            title="Import curriculum JSON backup"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Restore</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportJson}
              className="hidden"
            />
          </label>

          <button
            onClick={handleResetDefaults}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Reset to authoritative Term 1 default"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Tab Render */}
      <div>
        {activeNavTab === 'pointer' && (
          <PointerManager key={`${term.grade || 'Grade 3'}-${term.id}`} term={term} onUpdateTerm={onUpdateTerm} />
        )}

        {activeNavTab === 'source_analysis' && (
          <MultiSubjectSourceManager key={`${term.grade || 'Grade 3'}-${term.id}`} term={term} onUpdateTerm={onUpdateTerm} />
        )}

        {activeNavTab === 'mapping' && (
          <PageMappingManager key={`${term.grade || 'Grade 3'}-${term.id}`} term={term} onUpdateTerm={onUpdateTerm} />
        )}

        {activeNavTab === 'coverage' && (
          <ContentCoverageManager key={`${term.grade || 'Grade 3'}-${term.id}`} term={term} onUpdateTerm={onUpdateTerm} />
        )}

        {activeNavTab === 'extracted' && (
          <ExtractedContentManager key={`${term.grade || 'Grade 3'}-${term.id}`} term={term} onUpdateTerm={onUpdateTerm} />
        )}

        {activeNavTab === 'questions' && (
          <QuestionBankManager key={`${term.grade || 'Grade 3'}-${term.id}`} term={term} onUpdateTerm={onUpdateTerm} />
        )}

        {activeNavTab === 'tests' && (
          <TestPublisher key={`${term.grade || 'Grade 3'}-${term.id}`} term={term} onUpdateTerm={onUpdateTerm} />
        )}

        {activeNavTab === 'analytics' && (
          <AnalyticsManager key={`${term.grade || 'Grade 3'}-${term.id}`} term={term} />
        )}
      </div>
    </div>
  );
};
