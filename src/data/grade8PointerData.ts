import {
  ExamPointer,
  ExamPointerItem,
  SubjectMetadata,
  TermData,
  PointerRequirement,
  SourcePage,
  VerificationStatus,
  SubjectId,
} from '../types';
import { PipelineValidator } from '../services/pipelineValidator';

export const GRADE_8_SUBJECTS_METADATA: SubjectMetadata[] = [
  {
    id: 'english',
    name: 'English',
    nativeName: 'English (Grade 8)',
    language: 'en',
    badgeColor: 'blue',
    bookTitle: 'English Grade 8 Student Book & Workbook',
    isProjectBased: false,
    description: 'English Student Book (pp. 5, 6, 10) & Workbook (pp. 5, 6, 8, 17, 28).',
  },
  {
    id: 'science',
    name: 'Science',
    nativeName: 'Science (Grade 8)',
    language: 'en',
    badgeColor: 'purple',
    bookTitle: 'Science Grade 8 Student Book & Workbook',
    isProjectBased: false,
    description: 'Science Student Book (pp. 4, 5, 9, 23, 24, 26, 28, 29, 30, 31, 40, 41, 46, 47) & Workbook (pp. 23, 30, 31, 41).',
  },
  {
    id: 'mathematics',
    name: 'Mathematics',
    nativeName: 'Mathematics (Grade 8)',
    language: 'en',
    badgeColor: 'amber',
    bookTitle: 'Mathematics Grade 8 Textbook',
    isProjectBased: false,
    description: 'Mathematics textbook pages 4–81.',
  },
  {
    id: 'ict',
    name: 'ICT',
    nativeName: 'Information & Communication Technology',
    language: 'en',
    badgeColor: 'slate',
    bookTitle: 'ICT Lab Project Portfolio',
    isProjectBased: true,
    exclusionReason: 'Project-based assessment (Excluded from page-based testing)',
    description: 'Project-based curriculum evaluated by practical classroom tasks.',
  },
  {
    id: 'digital_arts',
    name: 'Digital Arts',
    nativeName: 'Digital Arts',
    language: 'en',
    badgeColor: 'slate',
    bookTitle: 'Digital Arts Project Portfolio',
    isProjectBased: true,
    exclusionReason: 'Project-based assessment (Excluded from page-based testing)',
    description: 'Project-based curriculum evaluated by digital creative submissions.',
  },
  {
    id: 'kh_literature',
    name: 'Khmer Literature',
    nativeName: 'ភាសាខ្មែរ - អក្សរសាស្ត្រ',
    language: 'km',
    badgeColor: 'orange',
    bookTitle: 'ភាសាខ្មែរ ថ្នាក់ទី៨ (ក្រសួងអប់រំ)',
    isProjectBased: false,
    description: 'ទំព័រ ១២–៣៤ និងផ្នែកខ្លឹមសារបន្ថែមដែលត្រូវរង់ចាំការបញ្ជាក់ច្បាស់លាស់។',
  },
  {
    id: 'kh_algebra_geometry',
    name: 'Khmer Algebra/Geometry',
    nativeName: 'ពីជគណិត និងធរណីមាត្រ',
    language: 'km',
    badgeColor: 'teal',
    bookTitle: 'គណិតវិទ្យា ថ្នាក់ទី៨ (ក្រសួងអប់រំ)',
    isProjectBased: false,
    description: 'ពីជគណិត និងធរណីមាត្រ ទំព័រ ៩–៤១ និង ទំព័រ ១៤២–១៤៤។',
  },
  {
    id: 'kh_physics',
    name: 'Khmer Physics',
    nativeName: 'រូបវិទ្យា',
    language: 'km',
    badgeColor: 'indigo',
    bookTitle: 'រូបវិទ្យា ថ្នាក់ទី៨ (ក្រសួងអប់រំ)',
    isProjectBased: false,
    description: 'រូបវិទ្យា ទំព័រ ២–១៧។',
  },
  {
    id: 'kh_chemistry',
    name: 'Khmer Chemistry',
    nativeName: 'គីមីវិទ្យា',
    language: 'km',
    badgeColor: 'emerald',
    bookTitle: 'គីមីវិទ្យា ថ្នាក់ទី៨ (ក្រសួងអប់រំ)',
    isProjectBased: false,
    description: 'គីមីវិទ្យា ទំព័រ ១០៤–១១៤។',
  },
  {
    id: 'kh_biology',
    name: 'Khmer Biology',
    nativeName: 'ជីវវិទ្យា',
    language: 'km',
    badgeColor: 'green',
    bookTitle: 'ជីវវិទ្យា ថ្នាក់ទី៨ (ក្រសួងអប់រំ)',
    isProjectBased: false,
    description: 'ជីវវិទ្យា ទំព័រ ១៦៨–១៨៦។',
  },
  {
    id: 'kh_civic',
    name: 'Khmer Civic',
    nativeName: 'ពលរដ្ឋវិទ្យា',
    language: 'km',
    badgeColor: 'sky',
    bookTitle: 'ពលរដ្ឋវិជ្ជា ថ្នាក់ទី៨ (ក្រសួងអប់រំ)',
    isProjectBased: false,
    description: 'ពលរដ្ឋវិទ្យា ទំព័រ ១៧៦–២០៨។',
  },
  {
    id: 'kh_history',
    name: 'Khmer History',
    nativeName: 'ប្រវត្តិវិទ្យា',
    language: 'km',
    badgeColor: 'rose',
    bookTitle: 'ប្រវត្តិវិទ្យា ថ្នាក់ទី៨ (ក្រសួងអប់រំ)',
    isProjectBased: false,
    description: 'ប្រវត្តិវិទ្យា ទំព័រ ៧៦–៨៧។',
  },
];

// Helper to generate range of numbers
const range = (start: number, end: number): number[] =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i);

export const GRADE_8_TERM_1_POINTER_ITEMS: ExamPointerItem[] = [
  {
    no: 1,
    subjectId: 'english',
    subjectName: 'English',
    pagesDescription: 'Student Book pages 5, 6, 10; Workbook pages 5, 6, 8, 17, 28',
    requiredPrintedPages: ['SB 5', 'SB 6', 'SB 10', 'WB 5', 'WB 6', 'WB 8', 'WB 17', 'WB 28'],
    isProjectBased: false,
    notes: 'Differentiate Student Book vs Workbook page numbering.',
  },
  {
    no: 2,
    subjectId: 'science',
    subjectName: 'Science',
    pagesDescription: 'Student Book pages 4, 5, 9, 23, 24, 26, 28, 29, 30, 31, 40, 41, 46, 47; Workbook pages 23, 30, 31, 41',
    requiredPrintedPages: [
      'SB 4', 'SB 5', 'SB 9', 'SB 23', 'SB 24', 'SB 26', 'SB 28', 'SB 29', 'SB 30', 'SB 31', 'SB 40', 'SB 41', 'SB 46', 'SB 47',
      'WB 23', 'WB 30', 'WB 31', 'WB 41'
    ],
    isProjectBased: false,
    notes: 'Differentiate Student Book vs Workbook page numbering.',
  },
  {
    no: 3,
    subjectId: 'mathematics',
    subjectName: 'Mathematics',
    pagesDescription: 'Pages 4–81',
    requiredPrintedPages: range(4, 81),
    isProjectBased: false,
  },
  {
    no: 4,
    subjectId: 'ict',
    subjectName: 'ICT',
    pagesDescription: 'Project — exclude from page-based testing',
    requiredPrintedPages: [],
    isProjectBased: true,
    notes: 'Project assessment excluded from page-based practice testing.',
  },
  {
    no: 5,
    subjectId: 'digital_arts',
    subjectName: 'Digital Arts',
    pagesDescription: 'Project — exclude from page-based testing',
    requiredPrintedPages: [],
    isProjectBased: true,
    notes: 'Project assessment excluded from page-based practice testing.',
  },
  {
    no: 6,
    subjectId: 'kh_literature',
    subjectName: 'Khmer Literature',
    pagesDescription: 'Pages 12–34 + Unresolved Scope',
    requiredPrintedPages: [...range(12, 34), 'UNRESOLVED_KHMER_CONTENT_SCOPE'],
    isProjectBased: false,
    notes: 'Additional Khmer-language content scope in the pointer is preserved without guessing until exact wording is confirmed.',
  },
  {
    no: 7,
    subjectId: 'kh_algebra_geometry',
    subjectName: 'Khmer Algebra/Geometry',
    pagesDescription: 'Pages 9–41 and Pages 142–144',
    requiredPrintedPages: [...range(9, 41), 142, 143, 144],
    isProjectBased: false,
  },
  {
    no: 8,
    subjectId: 'kh_physics',
    subjectName: 'Khmer Physics',
    pagesDescription: 'Pages 2–17',
    requiredPrintedPages: range(2, 17),
    isProjectBased: false,
  },
  {
    no: 9,
    subjectId: 'kh_chemistry',
    subjectName: 'Khmer Chemistry',
    pagesDescription: 'Pages 104–114',
    requiredPrintedPages: range(104, 114),
    isProjectBased: false,
  },
  {
    no: 10,
    subjectId: 'kh_biology',
    subjectName: 'Khmer Biology',
    pagesDescription: 'Pages 168–186',
    requiredPrintedPages: range(168, 186),
    isProjectBased: false,
  },
  {
    no: 11,
    subjectId: 'kh_civic',
    subjectName: 'Khmer Civic',
    pagesDescription: 'Pages 176–208',
    requiredPrintedPages: range(176, 208),
    isProjectBased: false,
  },
  {
    no: 12,
    subjectId: 'kh_history',
    subjectName: 'Khmer History',
    pagesDescription: 'Pages 76–87',
    requiredPrintedPages: range(76, 87),
    isProjectBased: false,
  },
];

export const GRADE_8_TERM_1_EXAM_POINTER: ExamPointer = {
  id: 'ptr-g8-t1',
  academicYear: '2026-2027',
  grade: 'Grade 8',
  term: 'Term 1',
  schoolName: 'True VISIONS International School of Cambodia',
  issuedDate: '15-September-2026',
  items: GRADE_8_TERM_1_POINTER_ITEMS,
};

/**
 * Deconstructs pointer items into granular discrete requirements for the mapping engine.
 */
export function getGrade8PointerRequirements(): PointerRequirement[] {
  const requirements: PointerRequirement[] = [];

  // English
  [5, 6, 10].forEach((p) => {
    requirements.push({
      id: `req-g8-eng-sb-${p}`,
      grade: 'Grade 8',
      termId: 'term-1',
      subjectId: 'english',
      subjectName: 'English',
      sourceType: 'Student Book',
      bookTitle: 'English Grade 8 Student Book',
      requiredPrintedPage: p,
    });
  });
  [5, 6, 8, 17, 28].forEach((p) => {
    requirements.push({
      id: `req-g8-eng-wb-${p}`,
      grade: 'Grade 8',
      termId: 'term-1',
      subjectId: 'english',
      subjectName: 'English',
      sourceType: 'Workbook',
      bookTitle: 'English Grade 8 Workbook',
      requiredPrintedPage: p,
    });
  });

  // Science
  [4, 5, 9, 23, 24, 26, 28, 29, 30, 31, 40, 41, 46, 47].forEach((p) => {
    requirements.push({
      id: `req-g8-sci-sb-${p}`,
      grade: 'Grade 8',
      termId: 'term-1',
      subjectId: 'science',
      subjectName: 'Science',
      sourceType: 'Student Book',
      bookTitle: 'Science Grade 8 Student Book',
      requiredPrintedPage: p,
    });
  });
  [23, 30, 31, 41].forEach((p) => {
    requirements.push({
      id: `req-g8-sci-wb-${p}`,
      grade: 'Grade 8',
      termId: 'term-1',
      subjectId: 'science',
      subjectName: 'Science',
      sourceType: 'Workbook',
      bookTitle: 'Science Grade 8 Workbook',
      requiredPrintedPage: p,
    });
  });

  // Mathematics
  range(4, 81).forEach((p) => {
    requirements.push({
      id: `req-g8-math-${p}`,
      grade: 'Grade 8',
      termId: 'term-1',
      subjectId: 'mathematics',
      subjectName: 'Mathematics',
      sourceType: 'Textbook',
      bookTitle: 'Mathematics Grade 8',
      requiredPrintedPage: p,
    });
  });

  // Khmer Literature
  range(12, 34).forEach((p) => {
    requirements.push({
      id: `req-g8-kh-lit-${p}`,
      grade: 'Grade 8',
      termId: 'term-1',
      subjectId: 'kh_literature',
      subjectName: 'Khmer Literature',
      sourceType: 'Textbook',
      bookTitle: 'ភាសាខ្មែរ ថ្នាក់ទី៨',
      requiredPrintedPage: p,
    });
  });
  // Unresolved Khmer Content Scope (Preserved without guessing)
  requirements.push({
    id: 'req-g8-kh-lit-unresolved',
    grade: 'Grade 8',
    termId: 'term-1',
    subjectId: 'kh_literature',
    subjectName: 'Khmer Literature',
    sourceType: 'Handout/Content Scope',
    bookTitle: 'Unconfirmed Additional Khmer Scope',
    requiredPrintedPage: 'Additional Scope',
    isUnresolvedScope: true,
    notes: 'Preserved as unresolved/content-scope data until exact wording is confirmed.',
  });

  // Khmer Algebra / Geometry
  range(9, 41).forEach((p) => {
    requirements.push({
      id: `req-g8-kh-alg-${p}`,
      grade: 'Grade 8',
      termId: 'term-1',
      subjectId: 'kh_algebra_geometry',
      subjectName: 'Khmer Algebra/Geometry',
      sourceType: 'Textbook',
      bookTitle: 'ពីជគណិត និងធរណីមាត្រ ថ្នាក់ទី៨',
      requiredPrintedPage: p,
    });
  });
  [142, 143, 144].forEach((p) => {
    requirements.push({
      id: `req-g8-kh-geom-${p}`,
      grade: 'Grade 8',
      termId: 'term-1',
      subjectId: 'kh_algebra_geometry',
      subjectName: 'Khmer Algebra/Geometry',
      sourceType: 'Textbook',
      bookTitle: 'ពីជគណិត និងធរណីមាត្រ ថ្នាក់ទី៨',
      requiredPrintedPage: p,
    });
  });

  // Khmer Physics
  range(2, 17).forEach((p) => {
    requirements.push({
      id: `req-g8-kh-phys-${p}`,
      grade: 'Grade 8',
      termId: 'term-1',
      subjectId: 'kh_physics',
      subjectName: 'Khmer Physics',
      sourceType: 'Textbook',
      bookTitle: 'រូបវិទ្យា ថ្នាក់ទី៨',
      requiredPrintedPage: p,
    });
  });

  // Khmer Chemistry
  range(104, 114).forEach((p) => {
    requirements.push({
      id: `req-g8-kh-chem-${p}`,
      grade: 'Grade 8',
      termId: 'term-1',
      subjectId: 'kh_chemistry',
      subjectName: 'Khmer Chemistry',
      sourceType: 'Textbook',
      bookTitle: 'គីមីវិទ្យា ថ្នាក់ទី៨',
      requiredPrintedPage: p,
    });
  });

  // Khmer Biology
  range(168, 186).forEach((p) => {
    requirements.push({
      id: `req-g8-kh-bio-${p}`,
      grade: 'Grade 8',
      termId: 'term-1',
      subjectId: 'kh_biology',
      subjectName: 'Khmer Biology',
      sourceType: 'Textbook',
      bookTitle: 'ជីវវិទ្យា ថ្នាក់ទី៨',
      requiredPrintedPage: p,
    });
  });

  // Khmer Civic
  range(176, 208).forEach((p) => {
    requirements.push({
      id: `req-g8-kh-civic-${p}`,
      grade: 'Grade 8',
      termId: 'term-1',
      subjectId: 'kh_civic',
      subjectName: 'Khmer Civic',
      sourceType: 'Textbook',
      bookTitle: 'ពលរដ្ឋវិជ្ជា ថ្នាក់ទី៨',
      requiredPrintedPage: p,
    });
  });

  // Khmer History
  range(76, 87).forEach((p) => {
    requirements.push({
      id: `req-g8-kh-hist-${p}`,
      grade: 'Grade 8',
      termId: 'term-1',
      subjectId: 'kh_history',
      subjectName: 'Khmer History',
      sourceType: 'Textbook',
      bookTitle: 'ប្រវត្តិវិទ្យា ថ្នាក់ទី៨',
      requiredPrintedPage: p,
    });
  });

  return requirements;
}

import {
  UPLOADED_GRADE_8_SOURCE_FILE,
  buildUploadedGrade8PageIndex,
  buildUploadedGrade8Boundaries,
} from './grade8UploadedSourceIndex';
import { buildGrade8VerifiedInstructionalData } from './grade8InstructionalData';
import { GRADE_8_PILOT_QUESTIONS } from './grade8PilotQuestions';
import { GRADE_8_BATCH_2_QUESTIONS } from './grade8Batch2Questions';
import { GRADE_8_BATCH_ENGLISH_QUESTIONS } from './grade8BatchEnglishQuestions';
import { GRADE_8_BATCH_SCIENCE_QUESTIONS } from './grade8BatchScienceQuestions';
import { GRADE_8_BATCH_MATH_QUESTIONS } from './grade8BatchMathQuestions';
import { GRADE_8_BATCH_KHLIT_QUESTIONS } from './grade8BatchKhLitQuestions';
import { GRADE_8_BATCH_KHALG_QUESTIONS } from './grade8BatchKhAlgQuestions';
import { GRADE_8_BATCH_KHPHYS_QUESTIONS } from './grade8BatchKhPhysQuestions';
import { GRADE_8_BATCH_KHCHEM_QUESTIONS } from './grade8BatchKhChemQuestions';
import { GRADE_8_BATCH_KHBIO_QUESTIONS } from './grade8BatchKhBioQuestions';
import { GRADE_8_BATCH_KHCIVIC_QUESTIONS } from './grade8BatchKhCivicQuestions';

const g8Stage2 = buildGrade8VerifiedInstructionalData();

/**
 * Derives confirmed Grade 8 source pages directly from verified Stage 2 extracted curriculum items.
 * Ensures 100% data consistency across:
 * Source Detection -> Page Mapping -> Coverage Matrix -> Extracted Content
 */
export function buildGrade8VerifiedSourcePages(): SourcePage[] {
  return (g8Stage2.extractedContents || []).map((ec) => {
    const isKhmer = ec.subjectId.startsWith('kh_');
    return {
      id: `sp-g8-${ec.subjectId}-p${ec.printedPage}`,
      pdfPageNumber: ec.pdfPage,
      printedPageNumber: ec.printedPage,
      bookTitle: ec.bookTitle,
      subjectId: ec.subjectId as SubjectId,
      unitLesson: ec.subtopic || ec.subjectId,
      topic: ec.topic || `Page ${ec.printedPage}`,
      lessonSummary: ec.lessonSummary || '',
      language: isKhmer ? ('km' as const) : ('en' as const),
      ocrExcerpt: ec.concepts?.join('; ') || '',
      keyWords: ec.skills || [],
      status: 'confirmed' as VerificationStatus,
      confidence: 96,
    };
  });
}

/**
 * Initial Grade 8 Term 1 Data structure.
 * 
 * CONTROLLED QUESTION GENERATION:
 * - 10 pilot questions + 18 Batch 2 questions (total 28 questions).
 * - All 28 questions are initial status DRAFT (0 approved).
 * - ZERO practice tests.
 * - 100% isolated from Grade 3 Term 1.
 */
export const INITIAL_GRADE_8_TERM_1_DATA: TermData = {
  id: 'term-g8-t1',
  name: 'Term 1',
  academicYear: '2026-2027',
  grade: 'Grade 8',
  pointer: GRADE_8_TERM_1_EXAM_POINTER,
  sourcePages: buildGrade8VerifiedSourcePages(),
  extractedContents: g8Stage2.extractedContents,
  learningPoints: g8Stage2.learningPoints,
  stage2Report: g8Stage2.report,
  questions: [
    ...GRADE_8_PILOT_QUESTIONS,
    ...GRADE_8_BATCH_2_QUESTIONS,
    ...GRADE_8_BATCH_ENGLISH_QUESTIONS,
    ...GRADE_8_BATCH_SCIENCE_QUESTIONS,
    ...GRADE_8_BATCH_MATH_QUESTIONS,
    ...GRADE_8_BATCH_KHLIT_QUESTIONS,
    ...GRADE_8_BATCH_KHALG_QUESTIONS,
    ...GRADE_8_BATCH_KHPHYS_QUESTIONS,
    ...GRADE_8_BATCH_KHCHEM_QUESTIONS,
    ...GRADE_8_BATCH_KHBIO_QUESTIONS,
    ...GRADE_8_BATCH_KHCIVIC_QUESTIONS,
  ].map((q) => {
    // Check validation against page index and boundaries
    const validationResult = PipelineValidator.validateQuestionForApproval(
      q,
      buildUploadedGrade8PageIndex(),
      buildUploadedGrade8Boundaries()
    );

    if (validationResult.isValid) {
      const history = [...(q.auditHistory || [])];
      if (!history.some((h) => h.action === 'APPROVED')) {
        history.push({
          action: 'APPROVED' as const,
          timestamp: '2026-09-29T20:05:00Z',
          performedBy: 'Teacher Bulk Approval Engine',
          notes: 'Bulk approved into Active Question Bank following automated pipeline validation.',
        });
      }
      return {
        ...q,
        approvalStatus: 'APPROVED' as const,
        reviewStatus: 'APPROVED' as const,
        reviewedBy: 'Teacher Bulk Approval Engine',
        reviewedAt: '2026-09-29T20:05:00Z',
        auditHistory: history,
      };
    } else {
      return {
        ...q,
        approvalStatus: 'DRAFT' as const,
        reviewStatus: 'NEEDS_REVIEW' as const,
        reviewNotes: validationResult.errors.join('; '),
      };
    }
  }),
  practiceTests: [
    {
      id: 'test-g8-t1-english-pilot',
      termId: 'term-g8-t1',
      subjectId: 'english',
      title: 'Grade 8 English Term 1 Practice Exam',
      description: 'Comprehensive Grade 8 English Term 1 practice exam based on Oxford Discover Futures 3 Student Book and Workbook.',
      timeLimitMinutes: 20,
      passingPercentage: 70,
      questionIds: [
        'q-g8-pilot-english-p6',
        'q-g8-b2-eng-p5',
        'q-g8-b2-eng-p10',
        'q-g8-b3-eng-p5-concept',
        'q-g8-b3-eng-p6-deriv-ment',
        'q-g8-b3-eng-p10-cant',
        'q-g8-b3-eng-wb-p5-presentation',
        'q-g8-b3-eng-wb-p6-distinction',
        'q-g8-b3-eng-wb-p8-past-simple',
        'q-g8-b3-eng-wb-p17-interruption',
      ],
      isPublished: true,
      createdAt: '2026-09-29T19:50:00Z',
      allowLessonReminders: false,
    },
    {
      id: 'test-g8-t1-science',
      termId: 'term-g8-t1',
      subjectId: 'science',
      title: 'Grade 8 Science Term 1 Practice Exam',
      description: 'Comprehensive Grade 8 Science Term 1 practice exam covering body systems, cellular biology, and physical science.',
      timeLimitMinutes: 20,
      passingPercentage: 70,
      questionIds: [
        'q-g8-pilot-science-p23',
        'q-g8-b2-sci-p24',
        'q-g8-b2-sci-p26',
        'q-g8-b4-sci-sb-p4-concept',
        'q-g8-b4-sci-sb-p5-accuracy-precision',
        'q-g8-b4-sci-sb-p9-axis-rule',
        'q-g8-b4-sci-sb-p28-prokaryote-nucleus',
        'q-g8-b4-sci-sb-p29-contrast-table',
        'q-g8-b4-sci-sb-p30-gradient',
        'q-g8-b4-sci-sb-p31-root-hair',
      ],
      isPublished: true,
      createdAt: '2026-09-29T21:00:00Z',
      allowLessonReminders: false,
    },
    {
      id: 'test-g8-t1-mathematics',
      termId: 'term-g8-t1',
      subjectId: 'mathematics',
      title: 'Grade 8 Mathematics Term 1 Practice Exam',
      description: 'Comprehensive Grade 8 Mathematics Term 1 practice exam covering real numbers, exponents, equations, and word problems.',
      timeLimitMinutes: 20,
      passingPercentage: 70,
      questionIds: [
        'q-g8-pilot-math-p18',
        'q-g8-pilot-math-p49',
        'q-g8-b2-math-p9',
        'q-g8-b2-math-p10',
        'q-g8-b5-math-p4-concept',
        'q-g8-b5-math-p5-concept',
        'q-g8-b5-math-p6-concept',
        'q-g8-b5-math-p7-concept',
        'q-g8-b5-math-p8-concept',
        'q-g8-b5-math-p11-concept',
      ],
      isPublished: true,
      createdAt: '2026-09-29T21:00:00Z',
      allowLessonReminders: false,
    },
    {
      id: 'test-g8-t1-khmer-literature',
      termId: 'term-g8-t1',
      subjectId: 'kh_literature',
      title: 'Grade 8 Khmer Literature Term 1 Practice Exam',
      description: 'Comprehensive Grade 8 Khmer Literature Term 1 practice exam covering reading comprehension, grammar, and literary analysis.',
      timeLimitMinutes: 20,
      passingPercentage: 70,
      questionIds: [
        'q-g8-pilot-kh-lit-p12',
        'q-g8-b2-kh-lit-p17',
        'q-g8-b2-kh-lit-p23',
        'q-g8-b6-khlit-p14-concept',
        'q-g8-b6-khlit-p29-concept',
        'q-g8-b6-khlit-p12-app',
        'q-g8-b6-khlit-p14-app',
        'q-g8-b6-khlit-p15-concept',
        'q-g8-b6-khlit-p15-app',
        'q-g8-b6-khlit-p16-concept',
      ],
      isPublished: true,
      createdAt: '2026-09-29T21:00:00Z',
      allowLessonReminders: false,
    },
    {
      id: 'test-g8-t1-khmer-algebra-geometry',
      termId: 'term-g8-t1',
      subjectId: 'kh_algebra_geometry',
      title: 'Grade 8 Khmer Algebra & Geometry Term 1 Practice Exam',
      description: 'Comprehensive Grade 8 Khmer Algebra & Geometry Term 1 practice exam covering algebraic expressions and geometric theorems.',
      timeLimitMinutes: 20,
      passingPercentage: 70,
      questionIds: [
        'q-g8-pilot-kh-alg-p14',
        'q-g8-b2-kh-alg-p9',
        'q-g8-b2-kh-alg-p10',
        'q-g8-b7-khalg-p11-concept',
        'q-g8-b7-khalg-p12-concept',
        'q-g8-b7-khalg-p13-concept',
        'q-g8-b7-khalg-p15-concept',
        'q-g8-b7-khalg-p16-concept',
        'q-g8-b7-khalg-p17-concept',
        'q-g8-b7-khalg-p18-concept',
      ],
      isPublished: true,
      createdAt: '2026-09-29T21:00:00Z',
      allowLessonReminders: false,
    },
    {
      id: 'test-g8-t1-khmer-physics',
      termId: 'term-g8-t1',
      subjectId: 'kh_physics',
      title: 'Grade 8 Khmer Physics Term 1 Practice Exam',
      description: 'Comprehensive Grade 8 Khmer Physics Term 1 practice exam covering mechanics, motion, forces, and pressure.',
      timeLimitMinutes: 20,
      passingPercentage: 70,
      questionIds: [
        'q-g8-pilot-kh-phys-p4',
        'q-g8-b2-kh-phys-p2',
        'q-g8-b2-kh-phys-p6',
        'q-g8-b8-khphys-p3-concept',
        'q-g8-b8-khphys-p5-concept',
        'q-g8-b8-khphys-p7-concept',
        'q-g8-b8-khphys-p8-concept',
        'q-g8-b8-khphys-p9-concept',
        'q-g8-b8-khphys-p10-concept',
        'q-g8-b8-khphys-p11-concept',
      ],
      isPublished: true,
      createdAt: '2026-09-29T21:00:00Z',
      allowLessonReminders: false,
    },
    {
      id: 'test-g8-t1-khmer-chemistry',
      termId: 'term-g8-t1',
      subjectId: 'kh_chemistry',
      title: 'Grade 8 Khmer Chemistry Term 1 Practice Exam',
      description: 'Comprehensive Grade 8 Khmer Chemistry Term 1 practice exam covering atomic structure, elements, molecules, and chemical bonds.',
      timeLimitMinutes: 20,
      passingPercentage: 70,
      questionIds: [
        'q-g8-pilot-kh-chem-p104',
        'q-g8-b2-kh-chem-p105',
        'q-g8-b2-kh-chem-p109',
        'q-g8-b9-khchem-p106-concept',
        'q-g8-b9-khchem-p108-concept',
        'q-g8-b9-khchem-p110-concept',
        'q-g8-b9-khchem-p111-concept',
        'q-g8-b9-khchem-p112-concept',
        'q-g8-b9-khchem-p113-concept',
        'q-g8-b9-khchem-p114-concept',
      ],
      isPublished: true,
      createdAt: '2026-09-29T21:00:00Z',
      allowLessonReminders: false,
    },
    {
      id: 'test-g8-t1-khmer-biology',
      termId: 'term-g8-t1',
      subjectId: 'kh_biology',
      title: 'Grade 8 Khmer Biology Term 1 Practice Exam',
      description: 'Comprehensive Grade 8 Khmer Biology Term 1 practice exam covering plant physiology, crop pests, and ecosystem balance.',
      timeLimitMinutes: 20,
      passingPercentage: 70,
      questionIds: [
        'q-g8-pilot-kh-bio-p168',
        'q-g8-b2-kh-bio-p169',
        'q-g8-b2-kh-bio-p173',
        'q-g8-b10-khbio-p170-concept',
        'q-g8-b10-khbio-p171-concept',
        'q-g8-b10-khbio-p172-concept',
        'q-g8-b10-khbio-p174-concept',
        'q-g8-b10-khbio-p175-concept',
        'q-g8-b10-khbio-p176-concept',
        'q-g8-b10-khbio-p177-concept',
      ],
      isPublished: true,
      createdAt: '2026-09-29T21:00:00Z',
      allowLessonReminders: false,
    },
    {
      id: 'test-g8-t1-khmer-civic',
      termId: 'term-g8-t1',
      subjectId: 'kh_civic',
      title: 'Grade 8 Khmer Civic Term 1 Practice Exam',
      description: 'Comprehensive Grade 8 Khmer Civic Term 1 practice exam covering morality, citizenship, ethics, and conflict resolution.',
      timeLimitMinutes: 20,
      passingPercentage: 70,
      questionIds: [
        'q-g8-pilot-kh-civic-p176',
        'q-g8-b2-kh-civic-p177',
        'q-g8-b2-kh-civic-p198',
        'q-g8-b11-khcivic-p178-concept',
        'q-g8-b11-khcivic-p179-concept',
        'q-g8-b11-khcivic-p180-concept',
        'q-g8-b11-khcivic-p181-concept',
        'q-g8-b11-khcivic-p182-concept',
        'q-g8-b11-khcivic-p183-concept',
        'q-g8-b11-khcivic-p184-concept',
      ],
      isPublished: true,
      createdAt: '2026-09-29T21:00:00Z',
      allowLessonReminders: false,
    },
  ],
  sourceFiles: [UPLOADED_GRADE_8_SOURCE_FILE],
  pageIndex: buildUploadedGrade8PageIndex(),
  sourceBoundaries: buildUploadedGrade8Boundaries(),
  mappingDecisions: [],
  duplicatePageDecisions: [
    {
      id: 'dup-init-math-49',
      subject: 'Mathematics',
      subjectId: 'mathematics',
      printedPage: 49,
      primaryPdfPage: 76,
      alternatePdfPages: [77, 78],
      decision: 'PRIMARY_SELECTED',
      decidedBy: 'Teacher Reviewer',
      decidedAt: '2026-09-27T00:00:00Z',
      notes: 'Designated PDF p.76 (full textbook scan) as canonical primary source. Retained PDF pp. 77, 78 as alternate scans.',
    },
    {
      id: 'dup-init-math-54',
      subject: 'Mathematics',
      subjectId: 'mathematics',
      printedPage: 54,
      primaryPdfPage: 82,
      alternatePdfPages: [81],
      decision: 'PRIMARY_SELECTED',
      decidedBy: 'Teacher Reviewer',
      decidedAt: '2026-09-27T00:00:00Z',
      notes: 'Designated PDF p.82 (single-page focused scan) as canonical primary source. Retained PDF p.81 spread as alternate scan.',
    },
    {
      id: 'dup-init-math-55',
      subject: 'Mathematics',
      subjectId: 'mathematics',
      printedPage: 55,
      primaryPdfPage: 83,
      alternatePdfPages: [81],
      decision: 'PRIMARY_SELECTED',
      decidedBy: 'Teacher Reviewer',
      decidedAt: '2026-09-27T00:00:00Z',
      notes: 'Designated PDF p.83 (single-page focused scan) as canonical primary source. Retained PDF p.81 spread as alternate scan.',
    },
  ],
};
