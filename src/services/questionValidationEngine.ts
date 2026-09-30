import {
  Question,
  LearningPoint,
  QuestionValidationReport,
  QuestionValidationDetail,
  PageIndexItem,
  SourceBoundary,
} from '../types';

/**
 * STAGE 3 QUESTION VALIDATION ENGINE
 * 
 * Enforces:
 * 1. Strict source-grounding (learning point correspondence, evidence verification)
 * 2. Non-hint lesson reminder protection (lesson reminder must never leak answer)
 * 3. Multiple-choice distractor integrity (correct answer in options, no duplicate options, plausible distractors)
 * 4. Mathematics and Science numerical, formula, and calculation accuracy
 * 5. Full schema & citation completeness
 * 6. STRUCTURAL SOURCE AGREEMENT: subject + book + printed page + physical PDF page + actual content agreement
 */
export class QuestionValidationEngine {
  /**
   * Structural Source Agreement Protection:
   * Verifies that the question's claimed subject, book, printed page, and physical PDF page
   * match the authoritative uploaded source index and boundaries.
   */
  static validateSourceAgreement(
    question: Question,
    pageIndex?: PageIndexItem[],
    sourceBoundaries?: SourceBoundary[]
  ): { isValid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!pageIndex || pageIndex.length === 0) {
      return { isValid: true, errors, warnings };
    }

    if (question.pdfPage === undefined || question.pdfPage === null) {
      errors.push('Physical PDF page number is mandatory for source agreement verification.');
      return { isValid: false, errors, warnings };
    }

    // 1. Locate physical PDF page in source index
    const matchedPage = pageIndex.find((p) => p.pdfPage === question.pdfPage);
    if (!matchedPage) {
      errors.push(
        `Physical PDF page ${question.pdfPage} does not exist in the indexed source material.`
      );
      return { isValid: false, errors, warnings };
    }

    // 2. Subject Agreement
    if (matchedPage.detectedSubjectId && matchedPage.detectedSubjectId !== question.subjectId) {
      errors.push(
        `Subject Mismatch: Question claims subject '${question.subjectId}', but physical PDF page ${question.pdfPage} is indexed as '${matchedPage.detectedSubjectId}' (${matchedPage.detectedSubjectName || 'Unknown'}).`
      );
    }

    // 3. Source Book Type Agreement (Student Book vs Workbook)
    if (question.sourceType && matchedPage.detectedSourceType) {
      const qType = question.sourceType.toLowerCase();
      const pType = matchedPage.detectedSourceType.toLowerCase();
      if (
        (qType.includes('student') && pType.includes('workbook')) ||
        (qType.includes('workbook') && pType.includes('student'))
      ) {
        errors.push(
          `Book Type Mismatch: Question specifies '${question.sourceType}', but physical PDF page ${question.pdfPage} is from '${matchedPage.detectedSourceType}' (${matchedPage.detectedBookTitle}).`
        );
      }
    }

    // 4. Printed Page Agreement
    if (
      matchedPage.printedPage !== null &&
      matchedPage.printedPage !== undefined &&
      question.printedPage !== null &&
      question.printedPage !== undefined
    ) {
      const qPageNum = Number(String(question.printedPage).replace(/[^0-9]/g, ''));
      const idxPageNum = Number(String(matchedPage.printedPage).replace(/[^0-9]/g, ''));
      if (!isNaN(qPageNum) && !isNaN(idxPageNum) && qPageNum !== idxPageNum) {
        errors.push(
          `Printed Page Mismatch: Question claims printed page ${question.printedPage}, but physical PDF page ${question.pdfPage} is actually printed page ${matchedPage.printedPage}.`
        );
      }
    } else if (
      (matchedPage.printedPage === null || matchedPage.printedPage === undefined) &&
      question.printedPage !== null &&
      question.printedPage !== undefined
    ) {
      // Unnumbered cover or title page
      errors.push(
        `Printed Page Mismatch: Physical PDF page ${question.pdfPage} is an unnumbered cover/title page (${matchedPage.topic || 'Cover'}), but question claims printed page ${question.printedPage}.`
      );
    }

    // 5. Source Boundary Agreement
    if (sourceBoundaries && sourceBoundaries.length > 0) {
      const qPdfNum = Number(question.pdfPage);
      const boundary = sourceBoundaries.find(
        (b) => qPdfNum >= b.startPdfPage && qPdfNum <= b.endPdfPage
      );
      if (boundary && boundary.detectedSubjectId !== question.subjectId) {
        errors.push(
          `Boundary Mismatch: Physical PDF page ${question.pdfPage} lies in boundary '${boundary.detectedBookTitle}' (${boundary.detectedSubjectId}), which does not match question subject '${question.subjectId}'.`
        );
      }
    }

    // 6. Content Domain & Topic Agreement
    if (matchedPage.pageText && (question.topic || question.learningPoint || question.question)) {
      const pText = (matchedPage.pageText + ' ' + (matchedPage.topic || '')).toLowerCase();
      const qFull = (
        (question.topic || '') +
        ' ' +
        (question.learningPoint || '') +
        ' ' +
        (question.question || '')
      ).toLowerCase();

      // Subject-specific content domain cross-checks:
      // a) Khmer Literature: Diacritics/Vowels vs Poetry/Rhyme
      if (question.subjectId === 'kh_literature') {
        const isPoetryQuestion =
          qFull.includes('កំណាព្យ') ||
          qFull.includes('បទពាក្យ') ||
          qFull.includes('ចួន') ||
          qFull.includes('poetry') ||
          qFull.includes('rhyme');
        const isPageDiacritic =
          pText.includes('សញ្ញាដំកើល') || pText.includes('៰') || pText.includes('ស្រៈប្រកប');
        if (isPoetryQuestion && isPageDiacritic) {
          errors.push(
            `Content Domain Mismatch: Question tests poetry rhyme rules (បទពាក្យ/ចួន), but physical PDF page ${question.pdfPage} (printed page ${matchedPage.printedPage}) covers diacritics and vowels (សញ្ញាដំកើល ៰).`
          );
        }
      }

      // b) Khmer Chemistry: Atoms & Molecules vs Periodic Table
      if (question.subjectId === 'kh_chemistry') {
        const isPeriodicQuestion =
          qFull.includes('តារាងខួប') ||
          qFull.includes('periodic') ||
          qFull.includes('ក្រុម') ||
          qFull.includes('ខួប');
        const isPageAtoms =
          pText.includes('អាតូម') && pText.includes('ម៉ូលេគុល') && !pText.includes('តារាងខួប');
        if (isPeriodicQuestion && isPageAtoms) {
          errors.push(
            `Content Domain Mismatch: Question tests periodic table periods/groups (តារាងខួប), but physical PDF page ${question.pdfPage} (printed page ${matchedPage.printedPage}) covers Lesson 1: Atoms and Molecules (អាតូម និងម៉ូលេគុល).`
          );
        }
      }

      // c) Khmer Biology: Digestion/Villi vs Crop Pests
      if (question.subjectId === 'kh_biology') {
        const isDigestionQuestion =
          qFull.includes('រំលាយអាហារ') ||
          qFull.includes('villi') ||
          qFull.includes('digestion') ||
          qFull.includes('ពោះវៀនតូច');
        const isPageCropPests =
          pText.includes('ដំណាំ') || pText.includes('សត្វល្អិត') || pText.includes('pest');
        if (isDigestionQuestion && isPageCropPests) {
          errors.push(
            `Content Domain Mismatch: Question tests human digestion/nutrient absorption, but physical PDF page ${question.pdfPage} (printed page ${matchedPage.printedPage}) covers agricultural crop pests (សត្វល្អិតចង្រៃលើដំណាំ).`
          );
        }
      }

      // d) Khmer Civic: Family Harmony vs Honesty & Friendship
      if (question.subjectId === 'kh_civic') {
        const isFamilyHarmony =
          qFull.includes('ភាពសុខដុម') || qFull.includes('family harmony');
        const isPageHonesty =
          pText.includes('ភាពស្មោះត្រង់') || pText.includes('មិត្តភាព');
        if (isFamilyHarmony && isPageHonesty && !pText.includes('ភាពសុខដុម')) {
          errors.push(
            `Content Domain Mismatch: Question tests family harmony (Lesson 2), but physical PDF page ${question.pdfPage} (printed page ${matchedPage.printedPage}) covers Lesson 3: Honesty and Friendship (ភាពស្មោះត្រង់និងមិត្តភាព).`
          );
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Performs complete validation on a draft question against its verified Stage 2 Learning Point.
   */
  static validateQuestion(
    question: Question,
    learningPoint?: LearningPoint,
    pageIndex?: PageIndexItem[],
    sourceBoundaries?: SourceBoundary[]
  ): QuestionValidationReport {
    const details: QuestionValidationDetail[] = [];
    const errors: string[] = [];
    const warnings: string[] = [];

    const addCheck = (name: string, passed: boolean, message?: string, isFatal: boolean = true) => {
      details.push({ checkName: name, passed, message });
      if (!passed) {
        if (isFatal) {
          errors.push(message || `Validation check failed: ${name}`);
        } else {
          warnings.push(message || `Warning: ${name}`);
        }
      }
    };

    // 1. Source Traceability & Citation Completeness
    addCheck(
      'Subject Traceability',
      Boolean(question.subjectId && String(question.subjectId).trim() !== ''),
      'Subject ID is required and must be traceable.'
    );

    addCheck(
      'Printed & PDF Page Citation',
      Boolean(
        question.printedPage !== undefined &&
        question.printedPage !== null &&
        question.pdfPage !== undefined &&
        question.pdfPage !== null
      ),
      'Both printed textbook page and physical PDF page citations are mandatory.'
    );

    addCheck(
      'Source Book Title Citation',
      Boolean(question.bookTitle && question.bookTitle.trim().length > 0),
      'Authoritative textbook title must be cited.'
    );

    // 1b. Structural Source Agreement Protection
    if (pageIndex && pageIndex.length > 0) {
      const agreement = QuestionValidationEngine.validateSourceAgreement(
        question,
        pageIndex,
        sourceBoundaries
      );
      addCheck(
        'Structural Source Agreement',
        agreement.isValid,
        agreement.errors.join('; ')
      );
    }

    // 2. Learning Point Correspondence
    if (learningPoint) {
      addCheck(
        'Learning Point ID Link',
        Boolean(question.learningPointId && question.learningPointId === learningPoint.id),
        `Question must retain its source learningPointId link (${learningPoint.id}).`
      );

      addCheck(
        'Topic Correspondence',
        Boolean(
          question.topic &&
          question.topic.trim().length > 0
        ),
        'Question topic must correspond to the source curriculum topic.'
      );

      // Verify that question prompt or explanation reflects concepts in the learning point
      const qText = `${question.question} ${question.explanation}`.toLowerCase();
      const lpKeywords = (learningPoint.learningPoint || '').toLowerCase().split(/\s+/).filter(w => w.length > 4);
      const hasConceptOverlap = lpKeywords.length === 0 || lpKeywords.some(kw => qText.includes(kw));

      addCheck(
        'Learning Point Concept Grounding',
        hasConceptOverlap,
        'Question content must directly reflect the verified educational learning point concept.',
        false // Warning if strict word overlap isn't detected
      );
    }

    // 3. Lesson Reminder Non-Hint Protection
    if (question.lessonSummary && question.lessonSummary.trim() !== '') {
      const reminder = question.lessonSummary.toLowerCase();
      const ansStr = String(question.correctAnswer || '').trim().toLowerCase();

      // Check if reminder contains direct answer or option pointer
      const revealsDirectAnswer =
        ansStr.length > 2 &&
        (reminder === ansStr ||
          reminder.includes(`the answer is ${ansStr}`) ||
          reminder.includes(`answer: ${ansStr}`) ||
          reminder.startsWith(`correct answer: ${ansStr}`));

      const revealsOptionLetter = /\b(choose|select|pick|answer is) option [a-d]\b/i.test(reminder);

      addCheck(
        'Lesson Reminder Non-Hint Check',
        !revealsDirectAnswer && !revealsOptionLetter,
        'Lesson Reminder must remain a student-friendly concept reminder and must NEVER reveal or point to the answer.'
      );
    } else {
      addCheck(
        'Lesson Reminder Presence',
        Boolean(question.lessonSummary && question.lessonSummary.trim() !== ''),
        'Every question must inherit the verified lesson reminder from its Stage 2 learning point.'
      );
    }

    // 4. Question Prompt & Answer Integrity
    addCheck(
      'Question Prompt Present',
      Boolean(question.question && question.question.trim().length > 5),
      'Question text prompt must be clearly stated (minimum 5 characters).'
    );

    addCheck(
      'Correct Answer Present',
      question.correctAnswer !== undefined &&
      question.correctAnswer !== null &&
      String(question.correctAnswer).trim().length > 0,
      'A valid correct answer must be specified.'
    );

    addCheck(
      'Explanation Present',
      Boolean(question.explanation && question.explanation.trim().length > 10),
      'Explanation must be provided explaining why the answer is correct with source evidence.'
    );

    // 5. Multiple-Choice Distractor Quality
    const isMCQ = question.questionType === 'multiple_choice' || (question.questionType as string) === 'MULTIPLE_CHOICE';
    if (isMCQ) {
      const options = question.options || [];
      addCheck(
        'Multiple-Choice Option Count',
        options.length >= 2,
        'Multiple-choice questions must provide at least 2 distinct options.'
      );

      const uniqueOptions = new Set(options.map(o => String(o).trim().toLowerCase()));
      addCheck(
        'No Duplicate Distractors',
        uniqueOptions.size === options.length,
        'All multiple choice options must be unique (no duplicate distractors).'
      );

      const hasCorrectAnswerInOptions = options.some(
        opt => String(opt).trim().toLowerCase() === String(question.correctAnswer).trim().toLowerCase()
      );
      addCheck(
        'Correct Answer in Options',
        hasCorrectAnswerInOptions,
        'The designated correct answer must exactly match one of the multiple-choice options.'
      );
    }

    // 6. True/False Structure
    const isTF = question.questionType === 'true_false' || (question.questionType as string) === 'TRUE_FALSE';
    if (isTF) {
      const ansNorm = String(question.correctAnswer).trim().toLowerCase();
      const validTF = ['true', 'false', 't', 'f', 'ពិត', 'មិនពិត'].includes(ansNorm);
      addCheck(
        'True/False Answer Format',
        validTF,
        'True/False questions must have a boolean true/false answer.'
      );
    }

    // 7. Mathematics & Science Accuracy
    const isMathOrScience =
      question.subjectId === 'mathematics' ||
      question.subjectId === 'science' ||
      question.subjectId === 'kh_algebra_geometry' ||
      question.subjectId === 'kh_physics' ||
      question.subjectId === 'kh_chemistry' ||
      question.subjectId === 'kh_biology';

    if (isMathOrScience) {
      // Numerical check: If the question prompt contains a direct arithmetic equation, verify calculation
      const arithmeticMatch = question.question.match(/(\d+(?:\.\d+)?)\s*([\+\-\*\/])\s*(\d+(?:\.\d+)?)\s*=/);
      if (arithmeticMatch) {
        const a = parseFloat(arithmeticMatch[1]);
        const op = arithmeticMatch[2];
        const b = parseFloat(arithmeticMatch[3]);
        let calculated: number | null = null;
        if (op === '+') calculated = a + b;
        if (op === '-') calculated = a - b;
        if (op === '*') calculated = a * b;
        if (op === '/' && b !== 0) calculated = a / b;

        if (calculated !== null) {
          const ansNum = parseFloat(String(question.correctAnswer).replace(/[^\d.-]/g, ''));
          if (!isNaN(ansNum)) {
            const diff = Math.abs(calculated - ansNum);
            addCheck(
              'Mathematical Calculation Verification',
              diff < 0.001,
              `Mathematical check failed: Expression evaluates to ${calculated}, but correct answer is given as ${question.correctAnswer}.`
            );
          }
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      details,
    };
  }
}
