import {
  TermData,
  Question,
  PracticeTest,
  TestAttempt,
  SourcePage,
  SourceFile,
  PageIndexItem,
  SourceBoundary,
  MappingDecision,
  SourceMappingReport,
  DuplicatePageDecision,
  LearningPoint,
} from '../types';
import { INITIAL_TERM_1_DATA, SUBJECTS_METADATA } from '../data/term1Data';
import { INITIAL_GRADE_8_TERM_1_DATA, GRADE_8_SUBJECTS_METADATA } from '../data/grade8PointerData';
import { PipelineValidator } from './pipelineValidator';

const STORAGE_KEYS = {
  TERMS: 'grade3_exam_terms_v3',
  ACTIVE_TERM_ID: 'grade3_active_term_id_v3',
  ACTIVE_GRADE: 'grade3_active_grade_v3',
  TEST_ATTEMPTS: 'grade3_test_attempts_v3',
};

export class StorageService {
  private static isStorageAvailable(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  /**
   * Retrieves all terms from localStorage or initializes with Term 1.
   */
  static getTerms(): TermData[] {
    if (!this.isStorageAvailable()) {
      return [INITIAL_TERM_1_DATA, INITIAL_GRADE_8_TERM_1_DATA];
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TERMS);
      if (stored) {
        const parsed: TermData[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          let hasChange = false;
          parsed.forEach((t) => {
            if (t.academicYear === '2025-2026') {
              t.academicYear = '2026-2027';
              if (t.pointer) {
                t.pointer.academicYear = '2026-2027';
              }
              hasChange = true;
            }
            // For Term 1, ensure full coverage from authoritative materials
            if (t.id === 'term-1') {
              // Ensure all 84 source pages are present
              if (t.sourcePages.length < INITIAL_TERM_1_DATA.sourcePages.length) {
                const existingPageIds = new Set(t.sourcePages.map((p) => p.id));
                INITIAL_TERM_1_DATA.sourcePages.forEach((sp) => {
                  if (!existingPageIds.has(sp.id)) {
                    t.sourcePages.push(sp);
                  }
                });
                hasChange = true;
              }
              // Ensure full question bank across all pages is present
              if (t.questions.length < INITIAL_TERM_1_DATA.questions.length) {
                const existingQIds = new Set(t.questions.map((q) => q.id));
                INITIAL_TERM_1_DATA.questions.forEach((q) => {
                  if (!existingQIds.has(q.id)) {
                    t.questions.push(q);
                  }
                });
                hasChange = true;
              }
              // Ensure updated practice tests are available
              if (!t.practiceTests || t.practiceTests.length < INITIAL_TERM_1_DATA.practiceTests.length) {
                t.practiceTests = INITIAL_TERM_1_DATA.practiceTests;
                hasChange = true;
              }
            } else {
              // Clean up any temporary QA test artifacts from non-Term-1 containers while keeping the clean term container
              const prevQCount = t.questions.length;
              const prevPCount = t.sourcePages.length;
              t.questions = t.questions.filter((q) => !q.id.includes('test') && !q.id.includes('mock'));
              t.sourcePages = t.sourcePages.filter((p) => !p.id.includes('test') && !p.id.includes('mock'));
              if (t.questions.length !== prevQCount || t.sourcePages.length !== prevPCount) {
                hasChange = true;
              }
            }
          });
          // Ensure Grade 8 Term 1 container is available for Grade 8 source analysis
          const g8Idx = parsed.findIndex((t) => t.grade === 'Grade 8' && t.name === 'Term 1');
          if (g8Idx === -1) {
            parsed.push(INITIAL_GRADE_8_TERM_1_DATA);
            hasChange = true;
          } else {
            // Update sourceFiles, pageIndex, and boundaries if empty or incomplete
            if (
              !parsed[g8Idx].sourceFiles ||
              parsed[g8Idx].sourceFiles.length === 0 ||
              !parsed[g8Idx].pageIndex ||
              parsed[g8Idx].pageIndex.length < (INITIAL_GRADE_8_TERM_1_DATA.pageIndex?.length || 0)
            ) {
              parsed[g8Idx].sourceFiles = INITIAL_GRADE_8_TERM_1_DATA.sourceFiles;
              parsed[g8Idx].pageIndex = INITIAL_GRADE_8_TERM_1_DATA.pageIndex;
              parsed[g8Idx].sourceBoundaries = INITIAL_GRADE_8_TERM_1_DATA.sourceBoundaries;
              hasChange = true;
            }
            // Ensure Grade 8 Exam Pointer is authoritative and complete
            if (
              !parsed[g8Idx].pointer ||
              !parsed[g8Idx].pointer.items ||
              parsed[g8Idx].pointer.items.length < INITIAL_GRADE_8_TERM_1_DATA.pointer.items.length ||
              parsed[g8Idx].pointer.items.some((i) => i.subjectId === 'chinese_go200')
            ) {
              parsed[g8Idx].pointer = INITIAL_GRADE_8_TERM_1_DATA.pointer;
              hasChange = true;
            }
            // Ensure Grade 8 sourcePages are synchronized from authoritative 241 confirmed pages
            const g8Sps = parsed[g8Idx].sourcePages || [];
            const hasMissingSourcePageSubjects = ![
              'english',
              'science',
              'mathematics',
              'kh_literature',
              'kh_physics',
              'kh_chemistry',
              'kh_biology',
              'kh_algebra_geometry',
              'kh_civic',
            ].every((subId) => g8Sps.some((sp) => sp.subjectId === subId && sp.status === 'confirmed'));

            if (
              g8Sps.length < (INITIAL_GRADE_8_TERM_1_DATA.sourcePages?.length || 0) ||
              hasMissingSourcePageSubjects
            ) {
              parsed[g8Idx].sourcePages = INITIAL_GRADE_8_TERM_1_DATA.sourcePages;
              hasChange = true;
            }
            // Update Stage 2 learning points and extracted contents if missing, incomplete, or corrupted
            const g8Lps = parsed[g8Idx].learningPoints || [];
            const g8Ecs = parsed[g8Idx].extractedContents || [];
            const hasLpCorruption = g8Lps.some(
              (lp) =>
                lp.subjectId !== 'english' &&
                (lp.bookTitle?.toLowerCase().includes('oxford discover') ||
                  lp.learningPoint?.toLowerCase().includes('interpersonal communication'))
            );
            const hasMissingSubjects = ![
              'english',
              'science',
              'mathematics',
              'kh_literature',
              'kh_physics',
              'kh_chemistry',
              'kh_biology',
              'kh_algebra_geometry',
              'kh_civic',
            ].every((subId) => g8Lps.some((lp) => lp.subjectId === subId));
            if (
              g8Lps.length < (INITIAL_GRADE_8_TERM_1_DATA.learningPoints?.length || 0) ||
              g8Ecs.length < (INITIAL_GRADE_8_TERM_1_DATA.extractedContents?.length || 0) ||
              hasLpCorruption ||
              hasMissingSubjects
            ) {
              parsed[g8Idx].learningPoints = INITIAL_GRADE_8_TERM_1_DATA.learningPoints;
              parsed[g8Idx].extractedContents = INITIAL_GRADE_8_TERM_1_DATA.extractedContents;
              parsed[g8Idx].stage2Report = INITIAL_GRADE_8_TERM_1_DATA.stage2Report;
              hasChange = true;
            }
            if (!parsed[g8Idx].duplicatePageDecisions || parsed[g8Idx].duplicatePageDecisions.length === 0) {
              parsed[g8Idx].duplicatePageDecisions = INITIAL_GRADE_8_TERM_1_DATA.duplicatePageDecisions;
              hasChange = true;
            }
            // Controlled Questions: Ensure all verified Grade 8 questions are present and lessonSummary is synced
            if (!parsed[g8Idx].questions || parsed[g8Idx].questions.length === 0) {
              parsed[g8Idx].questions = INITIAL_GRADE_8_TERM_1_DATA.questions;
              hasChange = true;
            } else {
              const initialMap = new Map(INITIAL_GRADE_8_TERM_1_DATA.questions.map((q) => [q.id, q]));
              const existingQIds = new Set(parsed[g8Idx].questions.map((q) => q.id));
              INITIAL_GRADE_8_TERM_1_DATA.questions.forEach((q) => {
                if (!existingQIds.has(q.id)) {
                  parsed[g8Idx].questions.push(q);
                  hasChange = true;
                }
              });
              parsed[g8Idx].questions.forEach((q) => {
                const initQ = initialMap.get(q.id);
                if (initQ) {
                  if (initQ.lessonSummary && q.lessonSummary !== initQ.lessonSummary) {
                    q.lessonSummary = initQ.lessonSummary;
                    hasChange = true;
                  }
                  if (
                    (initQ.approvalStatus === 'APPROVED' || initQ.approvalStatus === 'approved') &&
                    q.approvalStatus !== 'APPROVED' &&
                    q.approvalStatus !== 'approved'
                  ) {
                    q.approvalStatus = initQ.approvalStatus;
                    q.reviewStatus = initQ.reviewStatus;
                    q.reviewedBy = initQ.reviewedBy;
                    q.reviewedAt = initQ.reviewedAt;
                    hasChange = true;
                  }
                }
              });
            }
            // Synchronize initial Grade 8 practice tests (such as the English pilot test)
            if (!parsed[g8Idx].practiceTests || parsed[g8Idx].practiceTests.length < (INITIAL_GRADE_8_TERM_1_DATA.practiceTests?.length || 0)) {
              const existingTestIds = new Set((parsed[g8Idx].practiceTests || []).map((t) => t.id));
              INITIAL_GRADE_8_TERM_1_DATA.practiceTests?.forEach((initTest) => {
                if (!existingTestIds.has(initTest.id)) {
                  if (!parsed[g8Idx].practiceTests) parsed[g8Idx].practiceTests = [];
                  parsed[g8Idx].practiceTests.push(initTest);
                  hasChange = true;
                }
              });
            }
          }

          // Enforce canonical scope integrity for all terms
          parsed.forEach((t) => {
            const currentGrade = t.grade || 'Grade 3';
            const currentYear = t.academicYear || '2026-2027';
            const currentTermId = t.id;

            if (t.questions) {
              t.questions.forEach((q) => {
                if (q.grade !== currentGrade) { q.grade = currentGrade; hasChange = true; }
                if (q.termId !== currentTermId) { q.termId = currentTermId; hasChange = true; }
                if (q.academicYear !== currentYear) { q.academicYear = currentYear; hasChange = true; }
              });
            }

            if (t.learningPoints) {
              t.learningPoints.forEach((lp) => {
                if (lp.grade !== currentGrade) { lp.grade = currentGrade; hasChange = true; }
                if (lp.termId !== currentTermId) { lp.termId = currentTermId; hasChange = true; }
                if (lp.academicYear !== currentYear) { lp.academicYear = currentYear; hasChange = true; }
              });
            }

            if (t.extractedContents) {
              t.extractedContents.forEach((ec) => {
                if (ec.grade !== currentGrade) { ec.grade = currentGrade; hasChange = true; }
                if (ec.termId !== currentTermId) { ec.termId = currentTermId; hasChange = true; }
                if (ec.academicYear !== currentYear) { ec.academicYear = currentYear; hasChange = true; }
              });
            }
          });

          if (hasChange) {
            this.saveTerms(parsed);
          }
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse stored terms:', e);
    }

    // Default seed with Term 1 (Grade 3) and Term 1 (Grade 8)
    const initialTerms = [INITIAL_TERM_1_DATA, INITIAL_GRADE_8_TERM_1_DATA];
    this.saveTerms(initialTerms);
    return initialTerms;
  }

  static saveTerms(terms: TermData[]): void {
    if (!this.isStorageAvailable()) return;
    try {
      localStorage.setItem(STORAGE_KEYS.TERMS, JSON.stringify(terms));
    } catch (e) {
      console.error('Failed to save terms:', e);
    }
  }

  static getActiveTermId(): string {
    if (!this.isStorageAvailable()) return 'term-1';
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_TERM_ID) || 'term-1';
  }

  static setActiveTermId(termId: string): void {
    if (!this.isStorageAvailable()) return;
    localStorage.setItem(STORAGE_KEYS.ACTIVE_TERM_ID, termId);
  }

  static getActiveGrade(): string {
    if (!this.isStorageAvailable()) return 'Grade 3';
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_GRADE) || 'Grade 3';
  }

  static setActiveGrade(grade: string): void {
    if (!this.isStorageAvailable()) return;
    localStorage.setItem(STORAGE_KEYS.ACTIVE_GRADE, grade);
  }

  static getTerm(termId: string): TermData | undefined {
    const terms = this.getTerms();
    return terms.find((t) => t.id === termId);
  }

  static updateTerm(updatedTerm: TermData): void {
    const terms = this.getTerms();
    const index = terms.findIndex((t) => t.id === updatedTerm.id);
    if (index >= 0) {
      terms[index] = updatedTerm;
    } else {
      terms.push(updatedTerm);
    }
    this.saveTerms(terms);
  }

  /**
   * Creates a new Term (e.g. Term 2, Term 3, Term 4) without changing application code.
   */
  static createNewTerm(name: string, academicYear = '2026-2027', grade = 'Grade 3'): TermData {
    const terms = this.getTerms();
    const nextNum = terms.length + 1;
    const termId = `term-${Date.now()}`;

    const newTerm: TermData = {
      id: termId,
      name: name || `Term ${nextNum}`,
      academicYear,
      grade,
      pointer: {
        id: `ptr-${termId}`,
        academicYear,
        grade,
        term: name,
        schoolName: 'True VISIONS International School of Cambodia',
        issuedDate: new Date().toLocaleDateString('en-GB'),
        items: (grade === 'Grade 8' ? GRADE_8_SUBJECTS_METADATA : SUBJECTS_METADATA).map((s, idx) => ({
          no: idx + 1,
          subjectId: s.id,
          subjectName: s.name,
          pagesDescription: s.isProjectBased ? 'Project based assessment' : 'Awaiting pointer upload',
          requiredPrintedPages: [],
          isProjectBased: s.isProjectBased,
          notes: s.isProjectBased ? s.exclusionReason : undefined,
        })),
      },
      sourcePages: [],
      extractedContents: [],
      questions: [],
      practiceTests: [],
    };

    terms.push(newTerm);
    this.saveTerms(terms);
    this.setActiveGrade(grade);
    this.setActiveTermId(termId);
    return newTerm;
  }

  // --- Source Page Mapping ---
  static updateSourcePage(termId: string, page: SourcePage): void {
    const term = this.getTerm(termId);
    if (!term) return;
    const idx = term.sourcePages.findIndex((p) => p.id === page.id);
    if (idx >= 0) {
      term.sourcePages[idx] = page;
    } else {
      term.sourcePages.push(page);
    }
    this.updateTerm(term);
  }

  static addSourcePage(termId: string, page: Omit<SourcePage, 'id'>): SourcePage {
    const term = this.getTerm(termId);
    const newPage: SourcePage = {
      ...page,
      id: `sp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    if (term) {
      term.sourcePages.push(newPage);
      this.updateTerm(term);
    }
    return newPage;
  }

  // --- Questions Management ---
  static saveQuestion(termId: string, question: Question): void {
    const term = this.getTerm(termId);
    if (!term) return;
    const idx = term.questions.findIndex((q) => q.id === question.id);
    if (idx >= 0) {
      term.questions[idx] = question;
    } else {
      term.questions.push(question);
    }
    this.updateTerm(term);
  }

  static updateQuestionApproval(
    termId: string,
    questionId: string,
    status: 'approved' | 'rejected' | 'pending'
  ): { success: boolean; errors?: string[] } {
    const term = this.getTerm(termId);
    if (!term) return { success: false, errors: ['Term not found'] };
    const question = term.questions.find((q) => q.id === questionId);
    if (question) {
      if (status === 'approved') {
        const validation = PipelineValidator.validateQuestionForApproval(
          question,
          term.pageIndex,
          term.sourceBoundaries
        );
        if (!validation.isValid) {
          return { success: false, errors: validation.errors };
        }
      }
      question.approvalStatus = status;
      this.updateTerm(term);
      return { success: true };
    }
    return { success: false, errors: ['Question not found'] };
  }

  // --- Practice Tests ---
  static savePracticeTest(termId: string, test: PracticeTest): void {
    const term = this.getTerm(termId);
    if (!term) return;
    const idx = term.practiceTests.findIndex((t) => t.id === test.id);
    if (idx >= 0) {
      term.practiceTests[idx] = test;
    } else {
      term.practiceTests.push(test);
    }
    this.updateTerm(term);
  }

  // --- Multi-Subject Source Analysis & Mapping ---
  static getSourceFiles(termId: string): SourceFile[] {
    const term = this.getTerm(termId);
    return term?.sourceFiles || [];
  }

  static saveSourceFiles(termId: string, files: SourceFile[]): void {
    const term = this.getTerm(termId);
    if (!term) return;
    term.sourceFiles = files;
    this.updateTerm(term);
  }

  static getPageIndex(termId: string): PageIndexItem[] {
    const term = this.getTerm(termId);
    return term?.pageIndex || [];
  }

  static savePageIndex(termId: string, index: PageIndexItem[]): void {
    const term = this.getTerm(termId);
    if (!term) return;
    term.pageIndex = index;
    this.updateTerm(term);
  }

  static getSourceBoundaries(termId: string): SourceBoundary[] {
    const term = this.getTerm(termId);
    return term?.sourceBoundaries || [];
  }

  static saveSourceBoundaries(termId: string, boundaries: SourceBoundary[]): void {
    const term = this.getTerm(termId);
    if (!term) return;
    term.sourceBoundaries = boundaries;
    this.updateTerm(term);
  }

  static getMappingDecisions(termId: string): MappingDecision[] {
    const term = this.getTerm(termId);
    return term?.mappingDecisions || [];
  }

  static saveMappingDecisions(termId: string, decisions: MappingDecision[]): void {
    const term = this.getTerm(termId);
    if (!term) return;
    term.mappingDecisions = decisions;
    this.updateTerm(term);
  }

  static getDuplicatePageDecisions(termId: string): DuplicatePageDecision[] {
    const term = this.getTerm(termId);
    return term?.duplicatePageDecisions || [];
  }

  static saveDuplicatePageDecisions(termId: string, decisions: DuplicatePageDecision[]): void {
    const term = this.getTerm(termId);
    if (!term) return;
    term.duplicatePageDecisions = decisions;
    this.updateTerm(term);
  }

  static getMappingReport(termId: string): SourceMappingReport | null {
    const term = this.getTerm(termId);
    return term?.mappingReport || null;
  }

  static saveMappingReport(termId: string, report: SourceMappingReport): void {
    const term = this.getTerm(termId);
    if (!term) return;
    term.mappingReport = report;
    this.updateTerm(term);
  }

  // --- Stage 2: Learning Points & Instructional Content ---
  static getLearningPoints(termId: string): LearningPoint[] {
    const term = this.getTerm(termId);
    return term?.learningPoints || [];
  }

  static saveLearningPoints(termId: string, points: LearningPoint[]): void {
    const term = this.getTerm(termId);
    if (!term) return;
    term.learningPoints = points;
    this.updateTerm(term);
  }

  static updateLearningPoint(
    termId: string,
    pointId: string,
    updates: Partial<LearningPoint>
  ): void {
    const term = this.getTerm(termId);
    if (!term || !term.learningPoints) return;
    term.learningPoints = term.learningPoints.map((lp) =>
      lp.id === pointId ? { ...lp, ...updates, updatedAt: new Date().toISOString() } : lp
    );
    this.updateTerm(term);
  }

  // --- Student Attempts ---
  static getTestAttempts(): TestAttempt[] {
    if (!this.isStorageAvailable()) return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TEST_ATTEMPTS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  static saveTestAttempt(attempt: TestAttempt): void {
    if (!this.isStorageAvailable()) return;
    const attempts = this.getTestAttempts();
    attempts.unshift(attempt); // newest first
    try {
      localStorage.setItem(STORAGE_KEYS.TEST_ATTEMPTS, JSON.stringify(attempts));
    } catch (e) {
      console.error('Failed to save test attempt:', e);
    }
  }

  // --- Data Export & Import ---
  static exportAllData(): string {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      terms: this.getTerms(),
      attempts: this.getTestAttempts(),
    };
    return JSON.stringify(data, null, 2);
  }

  static importData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data && Array.isArray(data.terms)) {
        this.saveTerms(data.terms);
        if (Array.isArray(data.attempts)) {
          localStorage.setItem(STORAGE_KEYS.TEST_ATTEMPTS, JSON.stringify(data.attempts));
        }
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to import data:', e);
      return false;
    }
  }

  static resetToDefault(): void {
    if (this.isStorageAvailable()) {
      localStorage.removeItem(STORAGE_KEYS.TERMS);
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_TERM_ID);
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_GRADE);
      localStorage.removeItem(STORAGE_KEYS.TEST_ATTEMPTS);
    }
    this.saveTerms([INITIAL_TERM_1_DATA, INITIAL_GRADE_8_TERM_1_DATA]);
    this.setActiveGrade('Grade 3');
    this.setActiveTermId('term-1');
  }
}
