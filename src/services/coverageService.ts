import {
  TermData,
  SubjectId,
  CoverageMatrixItem,
  SubjectCoverageSummary,
  Question,
  SourcePage,
  CoverageStatus,
} from '../types';
import { PracticeScopeService } from './practiceScopeService';
import { AIService } from './aiService';
import { StorageService } from './storageService';
import { PageIdentityService } from './pageIdentityService';

export class CoverageService {
  /**
   * Builds the page-by-page Content Coverage Matrix for a term.
   * Numbered page scope strictly tracks the numbered textbook pages across the page-based subjects.
   * Khmer Calligraphy is tracked as a content-based scope (អក្សរមូល ម, ម្ដាយ) without numbered textbook pages.
   */
  static buildCoverageMatrix(term: TermData, filterSubjectId?: SubjectId): CoverageMatrixItem[] {
    const matrix: CoverageMatrixItem[] = [];
    const testableSubjects = PracticeScopeService.getTermSubjects(term).filter((s) => !s.isProjectBased);

    testableSubjects.forEach((subject) => {
      if (filterSubjectId && filterSubjectId !== subject.id) return;

      const pointerItem = term.pointer.items.find((item) => item.subjectId === subject.id);
      const requiredPages = pointerItem?.requiredPrintedPages || [];

      // 1. Numbered Page-Based Subjects (English 5, Math 8, Science 9, Chinese 24, Kh Dictation 3,
      // Kh Writing 4, Kh Math 14, Kh Reading 3, Kh Social Studies 4, Kh Applied Science 5 = 79 pages)
      if (requiredPages.length > 0) {
        requiredPages.forEach((printedPage) => {
          // Find mapped source page in term.sourcePages using universal page identity matching
          const mappedSource = term.sourcePages.find(
            (sp) =>
              sp.subjectId === subject.id &&
              PageIdentityService.matchesPageToken(printedPage, sp)
          );

          // All questions matching this page
          const allMatchingQuestions = term.questions.filter((q) => {
            if (q.subjectId !== subject.id) return false;

            // 1. Authoritative match via confirmed mappedSource PDF page
            if (
              mappedSource &&
              typeof mappedSource.pdfPageNumber === 'number' &&
              Number(q.pdfPage) === Number(mappedSource.pdfPageNumber)
            ) {
              return true;
            }

            // 2. Universal page identity token match
            if (
              PageIdentityService.matchesPageToken(printedPage, {
                printedPageNumber: q.printedPage,
                bookTitle: q.bookTitle,
                sourceType: q.sourceType,
                notes: (q as any).notes,
                unitLesson: (q as any).unitLesson,
              })
            ) {
              return true;
            }

            // 3. Fallback topic match if mappedSource topic matches
            if (mappedSource?.topic && q.topic && q.topic.toLowerCase() === mappedSource.topic.toLowerCase()) {
              return true;
            }

            return false;
          });

          // CRITICAL: Approved questions representing a meaningful learning point
          const matchingApprovedQuestions = allMatchingQuestions.filter(
            (q) => q.approvalStatus === 'approved' && q.learningPoint && q.learningPoint.trim() !== ''
          );

          // Determine topic & assessable learning point
          const topic =
            mappedSource?.topic ||
            mappedSource?.unitLesson ||
            `${subject.name} - Page ${printedPage}`;

          const learningPoint =
            mappedSource?.keyWords?.join(', ') ||
            mappedSource?.ocrExcerpt?.slice(0, 100) ||
            `Key learning point for page ${printedPage} from ${mappedSource?.bookTitle || subject.bookTitle}`;

          const pdfPage = mappedSource?.pdfPageNumber ?? 'Pending';

          // Status enforcement:
          // A page is ONLY COVERED if it has at least 1 approved question with a valid learning point.
          let status: CoverageStatus = 'NEEDS_MORE_QUESTIONS';
          if (matchingApprovedQuestions.length >= 1) {
            status = 'COVERED';
          } else if (!mappedSource || mappedSource.status !== 'confirmed') {
            status = 'NEEDS_SOURCE_REVIEW';
          } else if (pdfPage === 'Pending') {
            status = 'PENDING_MAPPING';
          }

          matrix.push({
            subjectId: subject.id,
            subjectName: subject.name,
            printedPageNumber: printedPage,
            pdfPageNumber: pdfPage,
            topic,
            learningPoint,
            questionCount: allMatchingQuestions.length,
            approvedQuestionCount: matchingApprovedQuestions.length,
            questionIds: allMatchingQuestions.map((q) => q.id),
            status,
            bookTitle: mappedSource?.bookTitle || subject.bookTitle,
            notes: mappedSource?.notes,
            isContentScope: false,
          });
        });
      } else if (subject.id === 'kh_calligraphy') {
        // 2. Content-Based Scope (Khmer Calligraphy: អក្សរមូល ម, ម្ដាយ)
        const mappedSource = term.sourcePages.find((sp) => sp.subjectId === 'kh_calligraphy');
        const allCalligraphyQuestions = term.questions.filter((q) => q.subjectId === 'kh_calligraphy');
        const approvedCalligraphyQuestions = allCalligraphyQuestions.filter(
          (q) => q.approvalStatus === 'approved' && q.learningPoint && q.learningPoint.trim() !== ''
        );

        const pdfPage = mappedSource?.pdfPageNumber ?? 82;
        const topic = mappedSource?.topic || 'ក្បួនខ្នាតអក្សរមូល រូបរាងតួអក្សរ «ម» ជើង «្ម» និងការសរសេរពាក្យ «ម្ដាយ, មិត្ត»';
        const learningPoint = mappedSource?.keyWords?.join(', ') || 'ក្បួនអក្សរមូល, តួអក្សរ ម, ជើង ្ម, ម្ដាយ';

        matrix.push({
          subjectId: subject.id,
          subjectName: subject.name,
          printedPageNumber: 'Content Scope (អក្សរមូល ម, ម្ដាយ)',
          pdfPageNumber: pdfPage,
          topic,
          learningPoint,
          questionCount: allCalligraphyQuestions.length,
          approvedQuestionCount: approvedCalligraphyQuestions.length,
          questionIds: allCalligraphyQuestions.map((q) => q.id),
          status: approvedCalligraphyQuestions.length >= 1 ? 'COVERED' : 'NEEDS_MORE_QUESTIONS',
          bookTitle: subject.bookTitle,
          notes: 'Content-based scope specified in Exam Pointer without numbered textbook pages',
          isContentScope: true,
        });
      }
    });

    return matrix;
  }

  /**
   * Generates summary statistics per subject across the entire Exam Pointer scope.
   * Enforces that every required page must be covered by approved questions with learning points.
   */
  static getSubjectCoverageSummaries(term: TermData): SubjectCoverageSummary[] {
    const matrix = this.buildCoverageMatrix(term);
    const testableSubjects = PracticeScopeService.getTermSubjects(term).filter((s) => !s.isProjectBased);

    return testableSubjects.map((sub) => {
      const pointerItem = term.pointer.items.find((item) => item.subjectId === sub.id);
      const subQuestions = term.questions.filter((q) => q.subjectId === sub.id);
      const questionsNeedingReviewCount = subQuestions.filter(
        (q) => q.approvalStatus === 'pending' || q.approvalStatus === 'rejected'
      ).length;

      // 1. Content-based scope (Khmer Calligraphy)
      if (sub.id === 'kh_calligraphy') {
        const item = matrix.find((i) => i.subjectId === sub.id);
        const approvedQuestions = subQuestions.filter(
          (q) => q.approvalStatus === 'approved' && q.learningPoint && q.learningPoint.trim() !== ''
        );
        const isCovered = approvedQuestions.length >= 1;
        const hasPublishedTest = term.practiceTests.some((t) => t.subjectId === sub.id && t.isPublished);

        return {
          subjectId: sub.id,
          subjectName: sub.name,
          requiredPageCount: 0, // Content-based scope, not numbered pages
          requiredScopeDescription: pointerItem?.pagesDescription || 'អក្សរមូល ម, ម្ដាយ',
          pagesAnalyzedCount: 1,
          pagesCoveredCount: isCovered ? 1 : 0,
          questionBankSize: subQuestions.length,
          questionsNeedingReviewCount,
          coveragePercentage: isCovered ? 100 : 0,
          status: isCovered ? 'COMPLETE' : 'NEEDS_MORE_QUESTIONS',
          isContentBasedScope: true,
          hasPublishedTest,
        };
      }

      // 2. Numbered page subjects (English, Math, Science, Chinese, Kh Dictation, Kh Writing, Kh Math, Kh Reading, Kh Social, Kh Applied Science)
      const subItems = matrix.filter((item) => item.subjectId === sub.id && !item.isContentScope);
      const requiredPageCount = subItems.length;
      const pagesCoveredCount = subItems.filter((i) => i.status === 'COVERED').length;
      const pagesAnalyzedCount = subItems.filter(
        (i) => i.pdfPageNumber !== 'Pending' && i.status !== 'PENDING_MAPPING'
      ).length;

      const questionBankSize = subQuestions.length;

      const coveragePercentage =
        requiredPageCount > 0 ? Math.round((pagesCoveredCount / requiredPageCount) * 100) : 0;

      // CRITICAL: A subject is ONLY COMPLETE if EVERY required page has at least 1 approved question with a learning point!
      // Merely having questions in the bank is NOT sufficient if any required page is missing.
      let status: 'COMPLETE' | 'NEEDS_MORE_QUESTIONS' | 'NEEDS_SOURCE_REVIEW' | 'PENDING' =
        'NEEDS_MORE_QUESTIONS';

      if (requiredPageCount > 0 && pagesCoveredCount === requiredPageCount) {
        status = 'COMPLETE';
      } else if (pagesAnalyzedCount < requiredPageCount) {
        status = 'NEEDS_SOURCE_REVIEW';
      }

      const hasPublishedTest = term.practiceTests.some((t) => t.subjectId === sub.id && t.isPublished);

      return {
        subjectId: sub.id,
        subjectName: sub.name,
        requiredPageCount,
        requiredScopeDescription: pointerItem?.pagesDescription || `${requiredPageCount} pages`,
        pagesAnalyzedCount,
        pagesCoveredCount,
        questionBankSize,
        questionsNeedingReviewCount,
        coveragePercentage,
        status,
        isContentBasedScope: false,
        hasPublishedTest,
      };
    });
  }

  /**
   * Returns aggregate coverage metrics across all subjects in the term.
   * Strictly distinguishes the 79 numbered pages from content-based scope,
   * and reports test readiness (11 in scope, 8 tests ready, 3 awaiting).
   */
  static getOverallCoverageStats(term: TermData) {
    const summaries = this.getSubjectCoverageSummaries(term);
    const numberedSummaries = summaries.filter((s) => !s.isContentBasedScope);

    // Numbered pages scope: strictly 79 pages
    const totalRequiredPages = numberedSummaries.reduce((acc, s) => acc + s.requiredPageCount, 0);
    const totalCoveredPages = numberedSummaries.reduce((acc, s) => acc + s.pagesCoveredCount, 0);
    const totalAnalyzedPages = numberedSummaries.reduce((acc, s) => acc + s.pagesAnalyzedCount, 0);
    const pagesNeedingMoreQuestions = totalRequiredPages - totalCoveredPages;
    const pagesNeedingSourceReview = totalRequiredPages - totalAnalyzedPages;

    // Content-based scopes (Khmer Calligraphy: អក្សរមូល ម, ម្ដាយ)
    const contentBasedSummaries = summaries.filter((s) => s.isContentBasedScope);
    const contentBasedScopesCount = contentBasedSummaries.length;
    const contentBasedScopesCovered = contentBasedSummaries.filter((s) => s.status === 'COMPLETE').length;

    const totalQuestionBankSize = term.questions.length;
    const approvedQuestionCount = term.questions.filter((q) => q.approvalStatus === 'approved').length;
    const totalQuestionsNeedingReview = term.questions.filter(
      (q) => q.approvalStatus === 'pending' || q.approvalStatus === 'rejected'
    ).length;

    const overallPercentage =
      totalRequiredPages > 0 ? Math.round((totalCoveredPages / totalRequiredPages) * 100) : 0;

    // Subjects in Exam Scope: 11 test subjects
    const totalSubjectsInScope = summaries.length;

    // Practice tests ready vs awaiting generation/approval
    const readyTestsCount = summaries.filter((s) => s.hasPublishedTest).length;
    const awaitingTestsCount = totalSubjectsInScope - readyTestsCount;
    const awaitingSubjectNames = summaries
      .filter((s) => !s.hasPublishedTest)
      .map((s) => s.subjectName);

    const completeSubjectsCount = summaries.filter((s) => s.status === 'COMPLETE').length;

    return {
      totalRequiredPages, // 79
      totalCoveredPages, // 79
      totalAnalyzedPages, // 79
      pagesNeedingMoreQuestions, // 0
      pagesNeedingSourceReview, // 0
      contentBasedScopesCount, // 1
      contentBasedScopesCovered, // 1
      totalQuestionBankSize,
      approvedQuestionCount,
      totalQuestionsNeedingReview, // 0
      overallPercentage,
      totalSubjectsInScope, // 11
      readyTestsCount, // 8
      awaitingTestsCount, // 3
      awaitingSubjectNames, // ["Khmer Writing", "Khmer Calligraphy", "Khmer Social Studies"]
      completeSubjectsCount,
      isFullyCovered: completeSubjectsCount === totalSubjectsInScope,
    };
  }

  /**
   * Generates targeted questions specifically for a given page to close a coverage gap.
   * Treated as a manual teacher-generation tool to represent assessable learning points without repetition.
   */
  static async generateQuestionsForPage(
    term: TermData,
    subjectId: SubjectId,
    printedPageNumber: number | string,
    count = 2
  ): Promise<Question[]> {
    const subject = PracticeScopeService.getTermSubjects(term).find((s) => s.id === subjectId);
    if (!subject) return [];

    const mappedSource = term.sourcePages.find(
      (sp) =>
        sp.subjectId === subjectId &&
        PageIdentityService.matchesPageToken(printedPageNumber, sp)
    );

    const pdfPage = mappedSource?.pdfPageNumber || '1';
    const topic = mappedSource?.topic || `${subject.name} - Page ${printedPageNumber}`;
    const excerpt = mappedSource?.ocrExcerpt || `Focus on Grade 3 learning points for page ${printedPageNumber}`;

    const newQuestions = await AIService.generateQuestions({
      termId: term.id,
      subjectId,
      subjectName: subject.name,
      topic,
      printedPages: [printedPageNumber],
      pdfPages: [pdfPage],
      extractedContentSummary: `Textbook: ${subject.bookTitle}\nPage: ${printedPageNumber} (PDF: ${pdfPage})\nTopic: ${topic}\nContent: ${excerpt}\nInstruction: Generate source-grounded Grade 3 practice questions. Represent key assessable learning points without repetitive questions.`,
      count,
      questionTypes: ['multiple_choice', 'true_false'],
      difficulty: 'medium',
      language: subject.language,
      bookTitle: subject.bookTitle,
    });

    // Tag each question with exact learning point and page
    const finalizedQuestions = newQuestions.map((q) => ({
      ...q,
      printedPage: printedPageNumber,
      pdfPage,
      learningPoint: mappedSource?.keyWords?.join(', ') || topic,
    }));

    // Save to storage
    const updatedQuestions = [...term.questions, ...finalizedQuestions];
    const updatedTerm = { ...term, questions: updatedQuestions };
    StorageService.updateTerm(updatedTerm);

    return finalizedQuestions;
  }
}
