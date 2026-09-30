import {
  TermData,
  SubjectMetadata,
  ExamPointerItem,
  Question,
  PracticeTest,
  LearningPoint,
  ExtractedContentItem,
  SourcePage,
  PageIndexItem,
  SubjectId,
} from '../types';
import { SUBJECTS_METADATA } from '../data/term1Data';
import { GRADE_8_SUBJECTS_METADATA, getGrade8PointerRequirements } from '../data/grade8PointerData';
import { SourceAnalysisEngine } from './sourceAnalysisEngine';

export interface ScopedSubjectPracticeData {
  metadata: SubjectMetadata;
  pointerItem?: ExamPointerItem;
  questions: Question[];
  approvedQuestions: Question[];
  practiceTests: PracticeTest[];
  publishedPracticeTests: PracticeTest[];
  isProjectBased: boolean;
  canQuickPractice: boolean;
}

export interface ScopedPracticeData {
  grade: string;
  academicYear: string;
  termId: string;
  termName: string;
  heroBadge: string;
  allSubjects: SubjectMetadata[];
  testableSubjects: SubjectMetadata[];
  projectSubjects: SubjectMetadata[];
  subjectDataMap: Record<string, ScopedSubjectPracticeData>;
  totalTestableScopeCount: number;
  totalPublishedTestsCount: number;
  totalAwaitingApprovalCount: number;
  firstPublishedTest?: PracticeTest;
}

/**
 * Helper to assign color badges to dynamic subjects if not in registered metadata.
 */
function getFallbackBadgeColor(subjectId: string): string {
  if (subjectId.includes('math') || subjectId.includes('algebra')) return 'amber';
  if (subjectId.includes('sci') || subjectId.includes('phys') || subjectId.includes('chem') || subjectId.includes('bio')) return 'emerald';
  if (subjectId.includes('eng') || subjectId.includes('lit')) return 'blue';
  if (subjectId.includes('ict') || subjectId.includes('art')) return 'slate';
  if (subjectId.includes('civic') || subjectId.includes('soc')) return 'sky';
  if (subjectId.includes('hist')) return 'rose';
  return 'indigo';
}

/**
 * PRACTICE SCOPE SERVICE
 * 
 * Canonical source of truth for scoping all data strictly by:
 * grade === selectedGrade
 * AND
 * academicYear === selectedAcademicYear
 * AND
 * termId === selectedTermId
 * AND
 * subjectId === selectedSubjectId (when subject filtered)
 */
export class PracticeScopeService {
  /**
   * Retrieves the authoritative subject list for any grade and term.
   * Grounded in term.pointer.items and respective registered metadata.
   */
  static getTermSubjects(term: TermData): SubjectMetadata[] {
    const isGrade8 = (term.grade || '').trim() === 'Grade 8';
    const metadataPool: Record<string, SubjectMetadata> = {};

    // Populate registry based on grade
    if (isGrade8) {
      GRADE_8_SUBJECTS_METADATA.forEach((m) => {
        metadataPool[m.id] = m;
      });
    } else {
      SUBJECTS_METADATA.forEach((m) => {
        metadataPool[m.id] = m;
      });
    }

    // Single Source of Truth: term.pointer.items defines the curriculum scope and ordering
    if (term.pointer && term.pointer.items && term.pointer.items.length > 0) {
      return term.pointer.items.map((item) => {
        const existing = metadataPool[item.subjectId];
        if (existing) {
          const isExcl = Boolean(existing.isExcluded) || item.subjectId === 'kh_history';
          return {
            ...existing,
            name: existing.name || item.subjectName,
            isExcluded: isExcl,
            isProjectBased: Boolean(item.isProjectBased) || isExcl,
            exclusionReason: isExcl
              ? (existing.exclusionReason || 'Missing source pages (Excluded from student practice scope)')
              : item.isProjectBased
              ? (existing.exclusionReason || item.notes || 'Project-based assessment (Excluded from page-based testing)')
              : undefined,
            description: existing.description || item.pagesDescription,
          };
        }

        // Dynamic fallback for custom/future terms
        const isKhmer = item.subjectId.startsWith('kh_') || item.subjectId.startsWith('khmer');
        const isChinese = item.subjectId.startsWith('chinese');
        return {
          id: item.subjectId,
          name: item.subjectName,
          nativeName: item.subjectName,
          language: isKhmer ? 'km' : (isChinese ? 'zh' : 'en'),
          badgeColor: getFallbackBadgeColor(item.subjectId),
          bookTitle: item.notes || item.subjectName,
          isProjectBased: Boolean(item.isProjectBased),
          exclusionReason: item.isProjectBased
            ? (item.notes || 'Project-based assessment (Excluded from page-based testing)')
            : undefined,
          description: item.pagesDescription,
        };
      });
    }

    // Fallback if pointer items are empty
    return isGrade8 ? GRADE_8_SUBJECTS_METADATA : SUBJECTS_METADATA;
  }

  /**
   * Evaluates complete scoped practice data for the selected grade, term, and academic year.
   */
  static getScopedPracticeData(term: TermData): ScopedPracticeData {
    const grade = term.grade || 'Grade 3';
    const academicYear = term.academicYear || '2026-2027';
    const termId = term.id;
    const termName = term.name || 'Term 1';

    // 1. Authoritative subject structure
    const allSubjects = this.getTermSubjects(term);
    const testableSubjects = allSubjects.filter((s) => !s.isProjectBased);
    const projectSubjects = allSubjects.filter((s) => s.isProjectBased);

    // 2. Strict Data Isolation: Scope questions strictly by termId, grade, and academicYear
    const scopedQuestions = (term.questions || []).filter((q) => {
      const matchTerm = q.termId === termId;
      const matchGrade = !q.grade || q.grade === grade;
      const matchYear = !q.academicYear || q.academicYear === academicYear;
      return matchTerm && matchGrade && matchYear;
    });

    // 3. Strict Data Isolation: Scope practice tests strictly by termId
    const scopedPracticeTests = (term.practiceTests || []).filter((t) => t.termId === termId);
    const publishedPracticeTests = scopedPracticeTests.filter((t) => t.isPublished);

    // 4. Build per-subject data maps
    const subjectDataMap: Record<string, ScopedSubjectPracticeData> = {};

    allSubjects.forEach((sub) => {
      const pointerItem = term.pointer?.items?.find((i) => i.subjectId === sub.id);
      const subQuestions = scopedQuestions.filter((q) => q.subjectId === sub.id);
      const subApprovedQuestions = subQuestions.filter(
        (q) => q.approvalStatus === 'approved' || q.approvalStatus === 'APPROVED'
      );
      const subTests = scopedPracticeTests.filter((t) => t.subjectId === sub.id);
      const subPublishedTests = subTests.filter((t) => t.isPublished);

      subjectDataMap[sub.id] = {
        metadata: sub,
        pointerItem,
        questions: subQuestions,
        approvedQuestions: subApprovedQuestions,
        practiceTests: subTests,
        publishedPracticeTests: subPublishedTests,
        isProjectBased: sub.isProjectBased,
        canQuickPractice: subApprovedQuestions.length >= 5,
      };
    });

    const totalTestableScopeCount = testableSubjects.length;
    const totalPublishedTestsCount = publishedPracticeTests.length;
    const totalAwaitingApprovalCount = Math.max(0, totalTestableScopeCount - totalPublishedTestsCount);
    const firstPublishedTest = publishedPracticeTests[0];

    return {
      grade,
      academicYear,
      termId,
      termName,
      heroBadge: `${grade} · ${termName} Practice Hub`,
      allSubjects,
      testableSubjects,
      projectSubjects,
      subjectDataMap,
      totalTestableScopeCount,
      totalPublishedTestsCount,
      totalAwaitingApprovalCount,
      firstPublishedTest,
    };
  }

  /**
   * CANONICAL SCOPING: Retrieves learning points strictly scoped by:
   * record.grade === term.grade
   * AND
   * record.termId === term.id
   * AND
   * record.subjectId === subjectId (if specified)
   * AND
   * sourceFileId belongs to term scope (if specified)
   */
  static getScopedLearningPoints(term: TermData, subjectId?: string): LearningPoint[] {
    const grade = term.grade || 'Grade 3';
    const termId = term.id;
    const academicYear = term.academicYear || '2026-2027';
    const validSourceFileIds = new Set((term.sourceFiles || []).map((sf) => sf.sourceFileId));

    return (term.learningPoints || []).filter((lp) => {
      if (subjectId && subjectId !== 'all' && lp.subjectId !== subjectId) return false;
      if (lp.grade && lp.grade !== grade) return false;
      if (lp.termId && lp.termId !== termId) return false;
      if (lp.academicYear && lp.academicYear !== academicYear) return false;
      if (lp.sourceFileId && validSourceFileIds.size > 0 && !validSourceFileIds.has(lp.sourceFileId)) {
        return false;
      }
      return true;
    });
  }

  /**
   * CANONICAL SCOPING: Retrieves extracted content items strictly scoped by grade, termId, academicYear, and subjectId
   */
  static getScopedExtractedContents(term: TermData, subjectId?: string): ExtractedContentItem[] {
    const grade = term.grade || 'Grade 3';
    const termId = term.id;
    const academicYear = term.academicYear || '2026-2027';

    return (term.extractedContents || []).filter((e) => {
      if (subjectId && subjectId !== 'all' && e.subjectId !== subjectId) return false;
      if (e.grade && e.grade !== grade) return false;
      if (e.termId && e.termId !== termId) return false;
      if (e.academicYear && e.academicYear !== academicYear) return false;
      return true;
    });
  }

  /**
   * CANONICAL SCOPING: Retrieves questions strictly scoped by termId, grade, and subjectId
   */
  static getScopedQuestions(term: TermData, subjectId?: string): Question[] {
    const grade = term.grade || 'Grade 3';
    const termId = term.id;
    const academicYear = term.academicYear || '2026-2027';
    const validSourceFileIds = new Set((term.sourceFiles || []).map((sf) => sf.sourceFileId));

    return (term.questions || []).filter((q) => {
      if (q.termId !== termId) return false;
      if (q.grade && q.grade !== grade) return false;
      if (q.academicYear && q.academicYear !== academicYear) return false;
      if (subjectId && subjectId !== 'all' && q.subjectId !== subjectId) return false;
      if (q.sourceFileId && validSourceFileIds.size > 0 && !validSourceFileIds.has(q.sourceFileId)) {
        return false;
      }
      return true;
    });
  }

  /**
   * CANONICAL SCOPING: Retrieves practice tests strictly scoped by termId and subjectId
   */
  static getScopedPracticeTests(term: TermData, subjectId?: string): PracticeTest[] {
    return (term.practiceTests || []).filter((t) => {
      if (t.termId !== term.id) return false;
      if (subjectId && subjectId !== 'all' && t.subjectId !== subjectId) return false;
      return true;
    });
  }

  /**
   * CANONICAL SCOPING: Retrieves source pages strictly scoped by subjectId
   */
  static getScopedSourcePages(term: TermData, subjectId?: string): SourcePage[] {
    return (term.sourcePages || []).filter((sp) => {
      if (subjectId && subjectId !== 'all' && sp.subjectId !== subjectId) return false;
      return true;
    });
  }

  /**
   * CANONICAL SCOPING: Retrieves page index items strictly scoped by subjectId
   */
  static getScopedPageIndex(term: TermData, subjectId?: string): PageIndexItem[] {
    return (term.pageIndex || []).filter((pi) => {
      if (subjectId && subjectId !== 'all' && pi.detectedSubjectId !== subjectId) return false;
      return true;
    });
  }

  /**
   * SYNCHRONIZE SOURCE PAGES FROM POINTER MATCHES
   * Guarantees 100% data consistency across:
   * Source Detection -> Pointer Match -> Page Mapping -> Coverage Matrix -> Extracted Content
   */
  static synchronizeSourcePagesFromPointerMatches(term: TermData): { updatedTerm: TermData; syncedCount: number } {
    if (!term.pageIndex || term.pageIndex.length === 0) {
      return { updatedTerm: term, syncedCount: 0 };
    }

    const pointerRequirements =
      term.grade === 'Grade 8'
        ? getGrade8PointerRequirements()
        : (term.pointer?.items || []).flatMap((item) =>
            item.requiredPrintedPages.map((p) => ({
              id: `req-${item.subjectId}-${p}`,
              grade: term.grade,
              termId: term.id,
              subjectId: item.subjectId,
              subjectName: item.subjectName,
              sourceType: 'Textbook',
              requiredPrintedPage: p,
            }))
          );

    const matches = SourceAnalysisEngine.matchPointerRequirements(
      pointerRequirements,
      term.pageIndex,
      term.mappingDecisions || [],
      term.duplicatePageDecisions || []
    );

    const matchedReqs = matches.filter((m) => m.mappingStatus === 'MATCHED' && m.pdfPage !== undefined);
    const existingPages = [...(term.sourcePages || [])];
    let syncedCount = 0;

    matchedReqs.forEach((m) => {
      const idx = existingPages.findIndex(
        (sp) => sp.subjectId === m.subjectId && String(sp.printedPageNumber) === String(m.printedPage)
      );

      const matchingIndexItem = term.pageIndex?.find(
        (pi) => pi.sourceFileId === m.sourceFileId && pi.pdfPage === m.pdfPage
      );

      const matchingEc = (term.extractedContents || []).find(
        (ec) => ec.subjectId === m.subjectId && String(ec.printedPage) === String(m.printedPage)
      );

      const isKhmer = m.subjectId.startsWith('kh_');
      const isChinese = m.subjectId.includes('chinese');
      const language: 'en' | 'km' | 'zh' = isKhmer ? 'km' : (isChinese ? 'zh' : 'en');

      const canonicalSourcePage: SourcePage = {
        id: idx !== -1 ? existingPages[idx].id : `sp-${term.id}-${m.subjectId}-p${m.printedPage}`,
        subjectId: m.subjectId as SubjectId,
        printedPageNumber: m.printedPage,
        pdfPageNumber: m.pdfPage!,
        bookTitle: matchingIndexItem?.detectedBookTitle || matchingEc?.bookTitle || `${m.subject} Textbook`,
        unitLesson: matchingIndexItem?.unitTitle || matchingIndexItem?.sectionTitle || matchingEc?.subtopic || `${m.subject} Unit`,
        topic: matchingEc?.topic || matchingIndexItem?.topic || `${m.subject} - Page ${m.printedPage}`,
        lessonSummary: matchingEc?.lessonSummary || '',
        ocrExcerpt: matchingIndexItem?.pageText?.slice(0, 150) || matchingEc?.concepts?.join('; ') || '',
        keyWords: matchingEc?.skills || matchingIndexItem?.classificationEvidence || [],
        language,
        status: 'confirmed',
        confidence: m.matchedConfidence ? Math.round(m.matchedConfidence * 100) : 95,
      };

      if (idx === -1) {
        existingPages.push(canonicalSourcePage);
        syncedCount++;
      } else {
        const curr = existingPages[idx];
        if (
          curr.pdfPageNumber !== canonicalSourcePage.pdfPageNumber ||
          curr.status !== canonicalSourcePage.status
        ) {
          existingPages[idx] = { ...curr, ...canonicalSourcePage };
          syncedCount++;
        }
      }
    });

    if (syncedCount > 0) {
      const updatedTerm: TermData = {
        ...term,
        sourcePages: existingPages,
      };
      return { updatedTerm, syncedCount };
    }

    return { updatedTerm: term, syncedCount: 0 };
  }
}

