import { Question, PageIndexItem, SourceBoundary } from '../types';
import { QuestionValidationEngine } from './questionValidationEngine';

export interface QuestionValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class PipelineValidator {
  /**
   * Checks whether a question is an existing Grade 3 Term 1 question,
   * which is protected and exempt from mandatory lessonSummary migration.
   */
  static isExistingTerm1Question(question: Question): boolean {
    return question.termId === 'term-1' && question.aiGenerated === false;
  }

  /**
   * Validates a question against the final content pipeline rules before approval.
   * Enforces:
   * 1. Source verification (printed page, PDF page, book title, subject)
   * 2. Structural Source Agreement (subject + book + printed page + PDF page + content agreement)
   * 3. Learning point verification (topic, specific assessable learning point)
   * 4. Lesson reminder verification (concise, student-friendly, concept-grounded, NEVER reveals answer)
   * 5. Question & answer verification (prompt, correct answer, valid options, explanation)
   */
  static validateQuestionForApproval(
    question: Question,
    pageIndex?: PageIndexItem[],
    sourceBoundaries?: SourceBoundary[]
  ): QuestionValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Existing Grade 3 Term 1 questions are protected from forced migration
    const isExempt = this.isExistingTerm1Question(question);

    // 1. Source Verification
    if (!question.subjectId) {
      errors.push('Subject ID is missing.');
    }
    if (
      question.printedPage === undefined ||
      question.printedPage === null ||
      String(question.printedPage).trim() === ''
    ) {
      errors.push('Printed Source Page or Content Scope is required.');
    }
    if (!question.bookTitle || question.bookTitle.trim() === '') {
      errors.push('Source Book Title is required.');
    }

    // 1b. Structural Source Agreement (if pageIndex available)
    if (pageIndex && pageIndex.length > 0) {
      const agreement = QuestionValidationEngine.validateSourceAgreement(
        question,
        pageIndex,
        sourceBoundaries
      );
      if (!agreement.isValid) {
        errors.push(...agreement.errors);
      }
    }

    // 2. Learning Point Verification
    if (!question.topic || question.topic.trim() === '') {
      errors.push('Topic is required.');
    }
    if (!question.learningPoint || question.learningPoint.trim() === '') {
      errors.push('Specific assessable Learning Point is required.');
    }

    // 3. Lesson Reminder Verification
    if (!isExempt) {
      if (!question.lessonSummary || question.lessonSummary.trim() === '') {
        errors.push(
          'Lesson Reminder (lessonSummary) is required for all newly generated questions to provide concept grounding.'
        );
      } else {
        const reminder = question.lessonSummary.trim().toLowerCase();
        const answer = String(question.correctAnswer || '').trim().toLowerCase();

        // Ensure reminder does NOT reveal the direct answer
        if (
          answer &&
          answer.length > 1 &&
          (reminder === answer ||
            reminder.includes(`the answer is ${answer}`) ||
            reminder.includes(`answer: ${answer}`) ||
            reminder.startsWith(`correct answer: ${answer}`))
        ) {
          errors.push(
            'Lesson Reminder must explain the concept, rule, or method needed — it must never reveal the direct answer.'
          );
        }

        // Ensure reminder does not state option letters directly
        if (/\b(choose|select) option [a-d]\b/i.test(question.lessonSummary)) {
          errors.push('Lesson Reminder must not directly point to an option letter.');
        }
      }
    }

    // 4. Question & Answer Verification
    if (!question.question || question.question.trim() === '') {
      errors.push('Question text prompt is required.');
    }
    if (
      question.correctAnswer === undefined ||
      question.correctAnswer === null ||
      String(question.correctAnswer).trim() === ''
    ) {
      errors.push('Correct answer is required.');
    }
    if (question.questionType === 'multiple_choice') {
      if (!question.options || question.options.length < 2) {
        errors.push('Multiple-choice questions must have at least 2 options.');
      } else if (!question.options.includes(question.correctAnswer)) {
        errors.push('Correct answer must match one of the available options.');
      }
    }
    if (!question.explanation || question.explanation.trim() === '') {
      errors.push('Kid-friendly explanation citing the textbook source page is required.');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }
}
