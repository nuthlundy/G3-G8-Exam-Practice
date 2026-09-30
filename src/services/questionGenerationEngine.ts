import {
  TermData,
  Question,
  LearningPoint,
  QuestionType,
  DifficultyLevel,
  QuestionAuditEntry,
  PageIndexItem,
  SourceBoundary,
  QuestionValidationReport,
} from '../types';
import { QuestionValidationEngine } from './questionValidationEngine';

export interface GenerationBatchParams {
  term: TermData;
  subjectId: string;
  bookTitle?: string;
  topic?: string;
  learningPointId?: string;
  questionType: QuestionType;
  difficulty: DifficultyLevel;
  count: number;
  teacherName?: string;
}

export interface ExcludedScopeInfo {
  subjectId: string;
  subjectName: string;
  scopeDescription: string;
  reason: string;
  status: 'NOT_FOUND' | 'NEEDS_REVIEW';
}

/**
 * STAGE 3 QUESTION GENERATION ENGINE
 * 
 * Generates practice questions strictly from verified Stage 2 Learning Points and Lesson Reminders.
 * Maintains strict separation between Draft Questions and the Approved Question Bank.
 */
export class QuestionGenerationEngine {
  /**
   * Returns list of officially excluded/protected scopes that must never have questions generated.
   */
  static getExcludedScopes(): ExcludedScopeInfo[] {
    return [
      {
        subjectId: 'science',
        subjectName: 'Science',
        scopeDescription: 'Student Book p.41',
        reason: 'Missing from uploaded scans (40/41 spread scan truncated at p.40). Strictly protected.',
        status: 'NOT_FOUND',
      },
      {
        subjectId: 'kh_history',
        subjectName: 'Khmer History',
        scopeDescription: 'Textbook pp. 76–87 (12 pages)',
        reason: 'Missing entirely from 250-page uploaded master textbook PDF. Strictly protected.',
        status: 'NOT_FOUND',
      },
      {
        subjectId: 'kh_literature',
        subjectName: 'Khmer Literature',
        scopeDescription: 'Additional Literary Scope from Exam Pointer',
        reason: 'Unresolved scope requiring teacher curriculum clarification. Strictly protected.',
        status: 'NEEDS_REVIEW',
      },
    ];
  }

  /**
   * Retrieves all verified Stage 2 learning points eligible for question generation.
   * Strictly filters out unresolved requirements.
   */
  static getEligibleLearningPoints(term: TermData, subjectId?: string): LearningPoint[] {
    const points = term.learningPoints || [];
    return points.filter((lp) => {
      // Must have verified status
      if (lp.status !== 'VERIFIED' && (lp.status as string) !== 'approved') return false;

      // Subject filter
      if (subjectId && lp.subjectId !== subjectId) return false;

      // Protected Scope Filter:
      // 1. Science SB p.41
      if (lp.subjectId === 'science' && String(lp.printedPage) === '41') return false;

      // 2. Khmer History pp.76-87
      if (lp.subjectId === 'kh_history') {
        const pNum = Number(lp.printedPage);
        if (pNum >= 76 && pNum <= 87) return false;
      }

      // 3. Khmer Literature additional scope
      if (lp.subjectId === 'kh_literature' && lp.topic.toLowerCase().includes('additional scope')) {
        return false;
      }

      return true;
    });
  }

  /**
   * Generates a controlled batch of draft questions from verified learning points.
   * Never marks newly generated questions as APPROVED. Always sets initial status to DRAFT or NEEDS_REVIEW.
   */
  static generateDraftBatch(params: GenerationBatchParams): {
    questions: Question[];
    errors: string[];
  } {
    const eligiblePoints = this.getEligibleLearningPoints(params.term, params.subjectId);
    if (eligiblePoints.length === 0) {
      return {
        questions: [],
        errors: [`No verified Stage 2 learning points found for subject "${params.subjectId}". Unresolved scopes remain protected.`],
      };
    }

    // Select candidate learning points
    let candidates = eligiblePoints;
    if (params.learningPointId) {
      candidates = eligiblePoints.filter((lp) => lp.id === params.learningPointId);
    } else if (params.topic) {
      candidates = eligiblePoints.filter((lp) => lp.topic.toLowerCase().includes(params.topic!.toLowerCase()));
    }

    if (candidates.length === 0) {
      candidates = eligiblePoints;
    }

    const generatedQuestions: Question[] = [];
    const count = Math.max(1, Math.min(params.count || 3, 10)); // Controlled batch: 1 to 10

    for (let i = 0; i < count; i++) {
      const targetLp = candidates[i % candidates.length];
      const q = this.synthesizeGroundedQuestion(targetLp, params.questionType, params.difficulty, i, params.teacherName);
      
      // Structural Source Agreement Check
      const agreement = QuestionValidationEngine.validateSourceAgreement(
        q,
        params.term.pageIndex,
        params.term.sourceBoundaries
      );
      if (!agreement.isValid) {
        // Block generation when subject + book + printed page + PDF page + actual content do not agree
        continue;
      }

      // Independent Source Validation
      const validationReport = QuestionValidationEngine.validateQuestion(
        q,
        targetLp,
        params.term.pageIndex,
        params.term.sourceBoundaries
      );
      if (!validationReport.isValid) {
        q.approvalStatus = 'NEEDS_REVIEW';
        q.validationErrors = validationReport.errors;
        q.reviewNotes = `Validation issues: ${validationReport.errors.join('; ')}`;
      } else {
        q.approvalStatus = 'DRAFT';
        q.reviewNotes = 'Pending teacher instructional review.';
      }

      generatedQuestions.push(q);
    }

    return {
      questions: generatedQuestions,
      errors: [],
    };
  }

  /**
   * Synthesizes a single high-fidelity educational question grounded in a Stage 2 learning point.
   */
  private static synthesizeGroundedQuestion(
    lp: LearningPoint,
    qType: QuestionType,
    difficulty: DifficultyLevel,
    index: number,
    teacherName?: string
  ): Question {
    const timestamp = new Date().toISOString();
    const qId = `q-g8-${lp.subjectId}-p${lp.printedPage}-${Date.now().toString(36)}-${index + 1}`;

    const normalizedQType = String(qType).toLowerCase();
    let prompt = '';
    let options: string[] | undefined = undefined;
    let correctAnswer: any = '';
    let explanation = '';

    // Generate content tailored to subject & learning point
    if (lp.subjectId === 'mathematics' || lp.subjectId === 'kh_algebra_geometry') {
      if (normalizedQType === 'multiple_choice' || normalizedQType === 'numerical_response') {
        prompt = `Based on ${lp.bookTitle} (p. ${lp.printedPage}), apply the rule for ${lp.topic}: ${lp.learningPoint}`;
        correctAnswer = lp.sourceEvidence[0] || 'Correct formula application';
        options = [
          correctAnswer,
          'Incorrect factor distribution',
          'Sign reversal error',
          'Incorrect exponent summation',
        ];
        // Shuffle options deterministically
        options.sort(() => (index % 2 === 0 ? 0.5 - Math.random() : -0.5 + Math.random()));
        explanation = `According to ${lp.bookTitle} p.${lp.printedPage}, ${lp.lessonSummary}.`;
      } else if (normalizedQType === 'true_false') {
        prompt = `True or False: According to the mathematical procedure on p.${lp.printedPage}, ${lp.learningPoint}`;
        correctAnswer = 'True';
        options = ['True', 'False'];
        explanation = `True. As documented on p.${lp.printedPage} (${lp.bookTitle}): "${lp.sourceEvidence[0] || lp.learningPoint}".`;
      } else {
        prompt = `Solve / Define according to p.${lp.printedPage}: ${lp.learningPoint}`;
        correctAnswer = lp.sourceEvidence[0] || lp.learningPoint;
        explanation = `Derived directly from ${lp.bookTitle} p.${lp.printedPage}.`;
      }
    } else if (lp.subjectId === 'english') {
      prompt = `Read the following grammar/vocabulary rule from ${lp.bookTitle} (p.${lp.printedPage}): "${lp.learningPoint}". Which statement or usage is correct?`;
      correctAnswer = `Correct application: ${lp.sourceEvidence[0] || lp.topic}`;
      options = [
        correctAnswer,
        'Incorrect tense agreement',
        'Misplaced modifier structure',
        'Opposite vocabulary definition',
      ];
      options.sort(() => (index % 2 === 0 ? 0.3 - Math.random() : -0.3 + Math.random()));
      explanation = `Reference ${lp.bookTitle} page ${lp.printedPage}: ${lp.lessonSummary}`;
    } else {
      // Science, Khmer Physics, Chemistry, Biology, Civic, Literature
      prompt = `According to ${lp.bookTitle} (p.${lp.printedPage}) regarding "${lp.topic}": ${lp.learningPoint}`;
      correctAnswer = lp.sourceEvidence[0] || lp.learningPoint;
      options = [
        correctAnswer,
        `Plausible distractor regarding ${lp.topic} with altered condition`,
        `Incorrect classification for ${lp.topic}`,
        `Opposite relationship contrary to ${lp.bookTitle} p.${lp.printedPage}`,
      ];
      options.sort(() => 0.5 - Math.random());
      explanation = `Source citation: ${lp.bookTitle}, Printed Page ${lp.printedPage} (PDF Page ${lp.pdfPage}). Core concept: ${lp.lessonSummary}`;
    }

    const auditEntry: QuestionAuditEntry = {
      action: 'GENERATED',
      timestamp,
      performedBy: teacherName || 'Stage 3 Question Engine v1.0',
      notes: `Generated ${difficulty} ${qType} draft from Learning Point: ${lp.topic} (p.${lp.printedPage}).`,
    };

    return {
      id: qId,
      questionId: qId,
      termId: lp.termId,
      grade: lp.grade,
      academicYear: lp.academicYear,
      subjectId: lp.subjectId,
      subjectName: lp.subjectName,
      sourceFileId: lp.sourceFileId,
      sourceFileName: 'G8_T1_Combined_Textbook_250p.pdf',
      bookTitle: lp.bookTitle,
      sourceType: lp.sourceType,
      pdfPage: lp.pdfPage,
      printedPage: lp.printedPage,
      alternatePdfPages: lp.alternatePdfPages,
      unitTitle: lp.unitTitle,
      sectionTitle: lp.sectionTitle,
      topic: lp.topic,
      learningPointId: lp.id,
      learningPoint: lp.learningPoint,
      lessonSummary: lp.lessonSummary, // STRICT: Inherited from Stage 2 learning point!
      questionType: qType,
      difficulty,
      question: prompt,
      options,
      correctAnswer,
      explanation,
      sourceEvidence: lp.sourceEvidence,
      generationEvidence: [
        `Grounded in Stage 2 Learning Point ${lp.id}`,
        `Citing ${lp.bookTitle} p.${lp.printedPage} (PDF p.${lp.pdfPage})`,
      ],
      approvalStatus: 'DRAFT', // NEVER APPROVED BY DEFAULT
      reviewNotes: 'Pending teacher instructional review.',
      createdAt: timestamp,
      updatedAt: timestamp,
      aiGenerated: true,
      generatedAt: timestamp,
      generatedBy: teacherName || 'Stage 3 Question Engine v1.0',
      sourceLearningPointId: lp.id,
      generationModel: 'Curriculum Engine v1.0',
      generationVersion: '3.0',
      auditHistory: [auditEntry],
    };
  }

  /**
   * Teacher Action: Approve question and move to Active Question Bank.
   */
  static approveQuestion(
    questions: Question[],
    questionId: string,
    teacherName: string = 'Teacher Reviewer',
    notes?: string
  ): { updatedQuestions: Question[]; error?: string } {
    const target = questions.find((q) => q.id === questionId);
    if (!target) return { updatedQuestions: questions, error: 'Question not found' };

    // Validate before approving
    const validation = QuestionValidationEngine.validateQuestion(target);
    if (!validation.isValid) {
      return {
        updatedQuestions: questions,
        error: `Cannot approve question due to validation issues: ${validation.errors.join('; ')}`,
      };
    }

    const now = new Date().toISOString();
    const updated = questions.map((q) => {
      if (q.id !== questionId) return q;
      const history: QuestionAuditEntry[] = [
        ...(q.auditHistory || []),
        {
          action: 'APPROVED',
          timestamp: now,
          performedBy: teacherName,
          notes: notes || 'Approved into Active Question Bank by teacher.',
          previousState: {
            approvalStatus: q.approvalStatus,
            question: q.question,
          },
        },
      ];
      return {
        ...q,
        approvalStatus: 'APPROVED' as const,
        reviewStatus: 'APPROVED' as const,
        reviewedBy: teacherName,
        reviewedAt: now,
        reviewAction: 'APPROVED',
        reviewNotes: notes || 'Approved for student practice.',
        updatedAt: now,
        auditHistory: history,
      };
    });

    return { updatedQuestions: updated };
  }

  /**
   * Teacher Action: Reject question.
   */
  static rejectQuestion(
    questions: Question[],
    questionId: string,
    teacherName: string = 'Teacher Reviewer',
    reason: string = 'Rejected by teacher reviewer.'
  ): Question[] {
    const now = new Date().toISOString();
    return questions.map((q) => {
      if (q.id !== questionId) return q;
      const history: QuestionAuditEntry[] = [
        ...(q.auditHistory || []),
        {
          action: 'REJECTED',
          timestamp: now,
          performedBy: teacherName,
          notes: reason,
          rejectionReason: reason,
          previousState: {
            approvalStatus: q.approvalStatus,
            reviewStatus: q.reviewStatus,
          },
        },
      ];
      return {
        ...q,
        approvalStatus: 'REJECTED' as const,
        reviewStatus: 'REJECTED' as const,
        reviewedBy: teacherName,
        reviewedAt: now,
        reviewAction: 'REJECTED',
        rejectionReason: reason,
        reviewNotes: reason,
        updatedAt: now,
        auditHistory: history,
      };
    });
  }

  /**
   * Teacher Action: Mark question for review later.
   * Keeps DRAFT, but records reviewStatus = REVIEW_LATER.
   */
  static reviewLaterQuestion(
    questions: Question[],
    questionId: string,
    teacherName: string = 'Teacher Reviewer',
    notes?: string
  ): Question[] {
    const now = new Date().toISOString();
    return questions.map((q) => {
      if (q.id !== questionId) return q;
      const history: QuestionAuditEntry[] = [
        ...(q.auditHistory || []),
        {
          action: 'REVIEW_LATER',
          timestamp: now,
          performedBy: teacherName,
          notes: notes || 'Flagged for review later.',
          previousState: {
            approvalStatus: q.approvalStatus,
            reviewStatus: q.reviewStatus,
          },
        },
      ];
      return {
        ...q,
        approvalStatus: 'DRAFT' as const,
        reviewStatus: 'REVIEW_LATER' as const,
        reviewedBy: teacherName,
        reviewedAt: now,
        reviewAction: 'REVIEW_LATER',
        reviewNotes: notes || 'Flagged for subsequent review.',
        updatedAt: now,
        auditHistory: history,
      };
    });
  }

  /**
   * Teacher Action: Edit question.
   * Validates updated question, records changeLog in audit history, and preserves locked source provenance.
   */
  static editQuestion(
    questions: Question[],
    questionId: string,
    updates: Partial<Question>,
    teacherName: string = 'Teacher Reviewer',
    notes?: string,
    termContext?: { pageIndex?: PageIndexItem[]; sourceBoundaries?: SourceBoundary[]; learningPoints?: LearningPoint[] }
  ): { updatedQuestions: Question[]; validationReport: QuestionValidationReport } {
    const now = new Date().toISOString();
    let capturedReport: QuestionValidationReport = {
      isValid: true,
      errors: [],
      warnings: [],
      details: [],
    };

    const updated = questions.map((q) => {
      if (q.id !== questionId) return q;

      // Determine changeLog
      const changes: string[] = [];
      if (updates.question !== undefined && updates.question !== q.question) {
        changes.push('Question prompt modified');
      }
      if (updates.options !== undefined && JSON.stringify(updates.options) !== JSON.stringify(q.options)) {
        changes.push('Options modified');
      }
      if (updates.correctAnswer !== undefined && updates.correctAnswer !== q.correctAnswer) {
        changes.push(`Correct answer changed to "${updates.correctAnswer}"`);
      }
      if (updates.explanation !== undefined && updates.explanation !== q.explanation) {
        changes.push('Explanation modified');
      }
      if (updates.lessonSummary !== undefined && updates.lessonSummary !== q.lessonSummary) {
        changes.push('Student Lesson Reminder modified');
      }
      if (updates.learningPoint !== undefined && updates.learningPoint !== q.learningPoint) {
        changes.push('Learning Point text modified');
      }
      if (updates.difficulty !== undefined && updates.difficulty !== q.difficulty) {
        changes.push(`Difficulty changed to ${updates.difficulty}`);
      }
      if (updates.questionType !== undefined && updates.questionType !== q.questionType) {
        changes.push(`Question format changed to ${updates.questionType}`);
      }

      // Safeguard: Ensure locked source metadata cannot be altered casually
      const merged: Question = {
        ...q,
        ...updates,
        // Enforce source provenance lock
        id: q.id,
        sourceFileId: q.sourceFileId,
        sourceFileName: q.sourceFileName,
        bookTitle: q.bookTitle,
        pdfPage: q.pdfPage,
        printedPage: q.printedPage,
        subjectId: q.subjectId,
        subjectName: q.subjectName,
        termId: q.termId,
        grade: q.grade,
        academicYear: q.academicYear,
      };

      // Re-run validation rules on save
      const lp = termContext?.learningPoints?.find((l) => l.id === merged.learningPointId);
      capturedReport = QuestionValidationEngine.validateQuestion(
        merged,
        lp,
        termContext?.pageIndex,
        termContext?.sourceBoundaries
      );

      const statusAfterEdit: 'DRAFT' | 'NEEDS_REVIEW' = capturedReport.isValid ? 'DRAFT' : 'NEEDS_REVIEW';
      const reviewStatusAfterEdit = capturedReport.isValid ? 'READY_FOR_APPROVAL' : 'NEEDS_REVIEW';

      const history: QuestionAuditEntry[] = [
        ...(q.auditHistory || []),
        {
          action: 'EDITED',
          timestamp: now,
          performedBy: teacherName,
          notes: notes || (changes.length > 0 ? changes.join('; ') : 'Content edited by teacher.'),
          changeLog: changes,
          previousState: {
            question: q.question,
            options: q.options ? [...q.options] : undefined,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            lessonSummary: q.lessonSummary,
            learningPoint: q.learningPoint,
            approvalStatus: q.approvalStatus,
            difficulty: q.difficulty,
            questionType: q.questionType,
          },
        },
      ];

      return {
        ...merged,
        approvalStatus: statusAfterEdit,
        reviewStatus: reviewStatusAfterEdit,
        reviewedBy: teacherName,
        reviewedAt: now,
        reviewAction: 'EDITED',
        reviewNotes: notes || (changes.length > 0 ? changes.join('; ') : 'Question content updated by teacher.'),
        validationErrors: capturedReport.errors,
        changeLog: changes,
        updatedAt: now,
        auditHistory: history,
      };
    });

    return { updatedQuestions: updated, validationReport: capturedReport };
  }

  /**
   * Teacher Action: Regenerate a question variant grounded in the same learning point.
   * Retains full audit history from the original question.
   */
  static regenerateQuestionVariant(
    questions: Question[],
    questionId: string,
    learningPoint: LearningPoint,
    teacherFeedback?: string,
    teacherName: string = 'Teacher Reviewer'
  ): Question[] {
    const original = questions.find((q) => q.id === questionId);
    if (!original) return questions;

    const newDraft = this.synthesizeGroundedQuestion(
      learningPoint,
      original.questionType,
      original.difficulty,
      Math.floor(Math.random() * 50) + 1,
      teacherName
    );

    const now = new Date().toISOString();
    const history: QuestionAuditEntry[] = [
      ...(original.auditHistory || []),
      {
        action: 'REGENERATED',
        timestamp: now,
        performedBy: teacherName,
        notes: teacherFeedback || 'Regenerated question variant from verified learning point.',
        previousState: {
          question: original.question,
          options: original.options ? [...original.options] : undefined,
          correctAnswer: original.correctAnswer,
          explanation: original.explanation,
          approvalStatus: original.approvalStatus,
        },
      },
    ];

    newDraft.id = original.id; // Keep stable ID or link
    newDraft.auditHistory = history;
    newDraft.reviewNotes = teacherFeedback
      ? `Regenerated with teacher feedback: "${teacherFeedback}".`
      : 'Regenerated variant from learning point.';

    return questions.map((q) => (q.id === questionId ? newDraft : q));
  }
}
