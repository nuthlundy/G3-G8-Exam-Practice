import React, { useState } from 'react';
import { StorageService } from '../../services/storageService';
import { TermData } from '../../types';
import { Calendar, Plus, Sparkles, X } from 'lucide-react';

interface NewTermModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTermCreated: (newTerm: TermData) => void;
}

export const NewTermModal: React.FC<NewTermModalProps> = ({
  isOpen,
  onClose,
  onTermCreated,
}) => {
  const [termName, setTermName] = useState('Term 2');
  const [academicYear, setAcademicYear] = useState('2026-2027');
  const [grade, setGrade] = useState('Grade 3');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termName.trim()) return;

    const created = StorageService.createNewTerm(termName.trim(), academicYear, grade);
    onTermCreated(created);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Add Academic Term</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-500 mb-5 leading-relaxed">
          Create a fresh container for <strong>Term 2, Term 3, or Term 4</strong>. You can then import the new Exam Pointer, map source pages, and publish tests without changing code.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Term Name</label>
            <input
              type="text"
              value={termName}
              onChange={(e) => setTermName(e.target.value)}
              placeholder="e.g. Term 2, Term 3, Term 4"
              required
              className="w-full text-xs font-semibold p-2.5 bg-slate-50 border rounded-xl focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Academic Year</label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                placeholder="2026-2027"
                className="w-full text-xs p-2.5 bg-slate-50 border rounded-xl focus:border-indigo-500 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Grade</label>
              <input
                type="text"
                list="grade-options"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="e.g. Grade 3, Grade 8"
                className="w-full text-xs p-2.5 bg-slate-50 border rounded-xl focus:border-indigo-500 focus:outline-none"
              />
              <datalist id="grade-options">
                <option value="Grade 1" />
                <option value="Grade 2" />
                <option value="Grade 3" />
                <option value="Grade 4" />
                <option value="Grade 5" />
                <option value="Grade 6" />
                <option value="Grade 7" />
                <option value="Grade 8" />
                <option value="Grade 9" />
                <option value="Grade 10" />
                <option value="Grade 11" />
                <option value="Grade 12" />
              </datalist>
            </div>
          </div>

          <div className="pt-2 flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 font-semibold text-xs text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Term Workspace</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
