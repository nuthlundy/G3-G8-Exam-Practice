import { TermData, Question, PracticeTest, TestAttempt, LearningPoint } from '../types';

export type LearningPointStatus = 'NOT_REVIEWED' | 'REVIEWED' | 'NEEDS_MORE_PRACTICE';

export interface LearningPointProgressItem {
  learningPoint: string;
  printedPage?: string | number;
  status: LearningPointStatus;
  lastAttemptedAt?: string;
  attemptsCount: number;
  correctCount: number;
}

export interface SubjectFullTermProgress {
  grade: string;
  academicYear: string;
  termId: string;
  subjectId: string;
  learningPoints: Record<string, LearningPointProgressItem>; // key: LP name or page key
  questionsCompletedCount: number;
  questionsCorrectCount: number;
  updatedAt: string;
}

export interface FullTermReviewStats {
  totalLps: number;
  reviewedLps: number;
  needsPracticeLps: number;
  unreviewedLps: number;
  coveragePercent: number;
  questionsCompleted: number;
  questionsCorrect: number;
  accuracyPercent: number;
  isComplete: boolean;
}

const STORAGE_PREFIX = 'full_term_review_progress_v1';
const inMemoryStore: Record<string, string> = {};

function getItem(key: string): string | null {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    try { return localStorage.getItem(key); } catch { /* fallback */ }
  }
  return inMemoryStore[key] || null;
}

function setItem(key: string, value: string): void {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    try { localStorage.setItem(key, value); } catch { /* fallback */ }
  }
  inMemoryStore[key] = value;
}

function removeItem(key: string): void {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    try { localStorage.removeItem(key); } catch { /* fallback */ }
  }
  delete inMemoryStore[key];
}

function getStorageKey(grade: string, academicYear: string, termId: string, subjectId: string): string {
  const cleanGrade = (grade || 'Grade 3').replace(/\s+/g, '_').toLowerCase();
  const cleanYear = (academicYear || '2026-2027').replace(/\s+/g, '_');
  return `${STORAGE_PREFIX}_${cleanGrade}_${cleanYear}_${termId}_${subjectId}`;
}

export class FullTermReviewService {
  /**
   * Helper to compute a canonical key for a verified learning point.
   */
  static getLpKey(lp: LearningPoint): string {
    return lp.id || `${lp.printedPage || ''}_${lp.learningPoint.trim()}`;
  }

  /**
   * Resolves a question to its canonical verified learning point key in term.learningPoints.
   */
  static resolveCanonicalLpKey(term: TermData, subjectId: string, q: Question): string {
    const verifiedLps = this.getSubjectLearningPoints(term, subjectId);
    const qLp = (q.learningPoint || '').trim().toLowerCase();
    const qPage = String(q.printedPage || '').trim();

    // 1. Direct LP ID match
    if (q.learningPointId) {
      const idMatch = verifiedLps.find((lp) => lp.id === q.learningPointId);
      if (idMatch) return this.getLpKey(idMatch);
    }

    // 2. Page + LP text match
    if (qPage && qLp) {
      const pageLpMatch = verifiedLps.find(
        (lp) => String(lp.printedPage || '').trim() === qPage && lp.learningPoint.trim().toLowerCase() === qLp
      );
      if (pageLpMatch) return this.getLpKey(pageLpMatch);
    }

    // 3. Page number match
    if (qPage) {
      const pageMatch = verifiedLps.find((lp) => String(lp.printedPage || '').trim() === qPage);
      if (pageMatch) return this.getLpKey(pageMatch);
    }

    // 4. Substring / text match
    if (qLp) {
      const textMatch = verifiedLps.find((lp) => {
        const lpText = lp.learningPoint.toLowerCase();
        return lpText === qLp || lpText.includes(qLp.slice(0, 15)) || qLp.includes(lpText.slice(0, 15));
      });
      if (textMatch) return this.getLpKey(textMatch);
    }

    return (q.learningPoint || q.topic || 'General Learning Point').trim();
  }

  /**
   * Retrieves all verified learning points for a specific subject in a term.
   */
  static getSubjectLearningPoints(term: TermData, subjectId: string): LearningPoint[] {
    const allLps = term.learningPoints || [];
    return allLps.filter((lp) => lp.subjectId === subjectId);
  }

  /**
   * Retrieves student progress for a given subject in a grade/term.
   */
  static getStudentProgress(term: TermData, subjectId: string): SubjectFullTermProgress {
    const grade = term.grade || 'Grade 3';
    const academicYear = term.academicYear || '2026-2027';
    const termId = term.id;
    const key = getStorageKey(grade, academicYear, termId, subjectId);

    const defaultProgress: SubjectFullTermProgress = {
      grade,
      academicYear,
      termId,
      subjectId,
      learningPoints: {},
      questionsCompletedCount: 0,
      questionsCorrectCount: 0,
      updatedAt: new Date().toISOString(),
    };

    try {
      const stored = getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...defaultProgress,
          ...parsed,
          learningPoints: parsed.learningPoints || {},
        };
      }
    } catch {
      // Fallback on corrupt JSON
    }

    return defaultProgress;
  }

  /**
   * Saves student progress for a given subject.
   */
  static saveStudentProgress(progress: SubjectFullTermProgress): void {
    try {
      const key = getStorageKey(progress.grade, progress.academicYear, progress.termId, progress.subjectId);
      progress.updatedAt = new Date().toISOString();
      setItem(key, JSON.stringify(progress));
    } catch (err) {
      console.error('Failed to save Full Term Review progress:', err);
    }
  }

  /**
   * Evaluates dynamic coverage statistics for a subject.
   */
  static getReviewStats(term: TermData, subjectId: string): FullTermReviewStats {
    const verifiedLps = this.getSubjectLearningPoints(term, subjectId);
    const progress = this.getStudentProgress(term, subjectId);

    const totalLps = verifiedLps.length;
    let reviewedLps = 0;
    let needsPracticeLps = 0;

    verifiedLps.forEach((lp) => {
      const lpKey = this.getLpKey(lp);
      const pItem = progress.learningPoints[lpKey];
      if (pItem) {
        if (pItem.status === 'REVIEWED') {
          reviewedLps++;
        } else if (pItem.status === 'NEEDS_MORE_PRACTICE') {
          needsPracticeLps++;
        }
      }
    });

    const unreviewedLps = Math.max(0, totalLps - reviewedLps);
    const coveragePercent = totalLps > 0 ? Math.round((reviewedLps / totalLps) * 100) : 0;
    const questionsCompleted = progress.questionsCompletedCount || 0;
    const questionsCorrect = progress.questionsCorrectCount || 0;
    const accuracyPercent = questionsCompleted > 0 ? Math.round((questionsCorrect / questionsCompleted) * 100) : 0;

    return {
      totalLps,
      reviewedLps,
      needsPracticeLps,
      unreviewedLps,
      coveragePercent,
      questionsCompleted,
      questionsCorrect,
      accuracyPercent,
      isComplete: totalLps > 0 && reviewedLps === totalLps,
    };
  }

  /**
   * Generates a coverage-driven Full Term Review practice session.
   */
  static generateReviewSession(
    term: TermData,
    subjectId: string,
    mode: 'full' | 'weak_points' = 'full',
    maxSessionQuestions = 20
  ): { test: PracticeTest; questions: Question[]; targetLpsCount: number } | null {
    const verifiedLps = this.getSubjectLearningPoints(term, subjectId);
    const progress = this.getStudentProgress(term, subjectId);

    // Get all approved questions for this subject (excluding protected sources)
    const approvedQuestions = (term.questions || []).filter((q) => {
      if (q.subjectId !== subjectId) return false;
      const isApproved = q.approvalStatus === 'APPROVED' || q.approvalStatus === 'approved';
      if (!isApproved) return false;
      // Protected unresolved sources guard
      if (q.subjectId === 'kh_history') return false;
      if (q.subjectId === 'science' && String(q.printedPage).includes('41')) return false;
      return true;
    });

    if (approvedQuestions.length === 0) return null;

    // Determine target learning points
    let targetLps: LearningPoint[] = [];

    if (mode === 'weak_points') {
      targetLps = verifiedLps.filter((lp) => {
        const lpKey = this.getLpKey(lp);
        const pItem = progress.learningPoints[lpKey];
        return pItem && pItem.status === 'NEEDS_MORE_PRACTICE';
      });
      // Fallback if no LPs explicitly marked weak
      if (targetLps.length === 0) {
        targetLps = verifiedLps;
      }
    } else {
      // Prioritize NOT_REVIEWED, then NEEDS_MORE_PRACTICE, then REVIEWED
      const unreviewed = verifiedLps.filter((lp) => {
        const lpKey = this.getLpKey(lp);
        const pItem = progress.learningPoints[lpKey];
        return !pItem || pItem.status === 'NOT_REVIEWED';
      });
      const weak = verifiedLps.filter((lp) => {
        const lpKey = this.getLpKey(lp);
        const pItem = progress.learningPoints[lpKey];
        return pItem && pItem.status === 'NEEDS_MORE_PRACTICE';
      });
      const reviewed = verifiedLps.filter((lp) => {
        const lpKey = this.getLpKey(lp);
        const pItem = progress.learningPoints[lpKey];
        return pItem && pItem.status === 'REVIEWED';
      });

      targetLps = [...unreviewed, ...weak, ...reviewed];
    }

    const selectedQuestions: Question[] = [];
    const selectedQIds = new Set<string>();

    // For each targeted LP, select a matching approved question
    for (const lp of targetLps) {
      if (selectedQuestions.length >= maxSessionQuestions) break;

      const lpNameLower = lp.learningPoint.trim().toLowerCase();
      const lpPageStr = String(lp.printedPage || '').trim();

      // Find matching approved questions for this LP
      const matchingQs = approvedQuestions.filter((q) => {
        if (selectedQIds.has(q.id)) return false;
        const qLp = (q.learningPoint || '').trim().toLowerCase();
        const qPage = String(q.printedPage || '').trim();
        return qLp === lpNameLower || (lpPageStr && qPage === lpPageStr);
      });

      if (matchingQs.length > 0) {
        // Pick first unselected question
        const chosen = matchingQs[0];
        selectedQuestions.push(chosen);
        selectedQIds.add(chosen.id);
      }
    }

    // Fill up to maxSessionQuestions if needed using remaining approved questions
    if (selectedQuestions.length < maxSessionQuestions) {
      for (const q of approvedQuestions) {
        if (!selectedQIds.has(q.id)) {
          selectedQuestions.push(q);
          selectedQIds.add(q.id);
        }
        if (selectedQuestions.length >= maxSessionQuestions) break;
      }
    }

    if (selectedQuestions.length === 0) return null;

    const sessionTest: PracticeTest = {
      id: `full-review-${subjectId}-${Date.now()}`,
      termId: term.id,
      subjectId,
      title: `${term.grade || 'Grade 8'} ${subjectId} Full Term Review`,
      description: `Coverage-driven revision session for ${subjectId} across ${verifiedLps.length} verified learning points.`,
      timeLimitMinutes: Math.max(15, Math.ceil(selectedQuestions.length * 2)),
      passingPercentage: 70,
      questionIds: selectedQuestions.map((q) => q.id),
      isPublished: true,
      createdAt: new Date().toISOString(),
      allowLessonReminders: true, // ON by default for revision
    };

    return {
      test: sessionTest,
      questions: selectedQuestions,
      targetLpsCount: targetLps.length,
    };
  }

  /**
   * Records completed session results and updates learning point coverage progress.
   */
  static recordSessionResults(term: TermData, subjectId: string, attempt: TestAttempt): void {
    const progress = this.getStudentProgress(term, subjectId);

    attempt.results.forEach((res) => {
      const q = (term.questions || []).find((item) => item.id === res.questionId);
      if (!q) return;

      const lpName = this.resolveCanonicalLpKey(term, subjectId, q);

      if (lpName) {
        const existing = progress.learningPoints[lpName] || {
          learningPoint: lpName,
          printedPage: res.printedPage || q?.printedPage,
          status: 'NOT_REVIEWED',
          attemptsCount: 0,
          correctCount: 0,
        };

        existing.attemptsCount += 1;
        existing.lastAttemptedAt = new Date().toISOString();

        if (res.isCorrect) {
          existing.correctCount += 1;
          existing.status = 'REVIEWED';
        } else {
          existing.status = 'NEEDS_MORE_PRACTICE';
        }

        progress.learningPoints[lpName] = existing;
      }

      progress.questionsCompletedCount += 1;
      if (res.isCorrect) {
        progress.questionsCorrectCount += 1;
      }
    });

    this.saveStudentProgress(progress);
  }

  /**
   * Resets review progress for a subject if student wants to practice from scratch.
   */
  static resetSubjectProgress(term: TermData, subjectId: string): void {
    const grade = term.grade || 'Grade 3';
    const academicYear = term.academicYear || '2026-2027';
    const termId = term.id;
    const key = getStorageKey(grade, academicYear, termId, subjectId);

    try {
      removeItem(key);
    } catch (e) {
      console.error('Failed to reset progress:', e);
    }
  }
}
