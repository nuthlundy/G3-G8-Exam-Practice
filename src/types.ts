/**
 * Data structures and types for Grade 3 Term Exam Practice
 * Designed to be 100% reusable across Term 1, Term 2, Term 3, and Term 4
 */

export type SubjectId =
  | 'english'
  | 'mathematics'
  | 'science'
  | 'chinese_go200'
  | 'kh_dictation'
  | 'kh_writing'
  | 'kh_calligraphy'
  | 'kh_mathematics'
  | 'kh_reading'
  | 'kh_social_studies'
  | 'kh_applied_science'
  | 'ict'
  | 'problem_solving'
  // Grade 8 subjects:
  | 'digital_arts'
  | 'kh_literature'
  | 'kh_algebra_geometry'
  | 'kh_physics'
  | 'kh_chemistry'
  | 'kh_biology'
  | 'kh_civic'
  | 'kh_history'
  | string;

import {
  SourceFile,
  PageIndexItem,
  SourceBoundary,
  MappingDecision,
  SourceMappingReport,
  DuplicatePageDecision,
  LearningPoint,
  LearningPointType,
  InstructionalStatus,
  Stage2ExtractionReport,
  QuestionAuditEntry,
  QuestionValidationReport,
  QuestionValidationDetail,
} from './types/sourceAnalysis';

export * from './types/sourceAnalysis';

export type QuestionType =
  | 'multiple_choice'
  | 'true_false'
  | 'fill_in_blank'
  | 'matching'
  | 'calculation'
  | 'ordering'
  | 'comprehension'
  | 'short_answer'
  | 'sequence'
  | 'numerical_response'
  | 'MULTIPLE_CHOICE'
  | 'TRUE_FALSE'
  | 'SHORT_ANSWER'
  | 'MATCHING'
  | 'FILL_IN_THE_BLANK'
  | 'SEQUENCE'
  | 'NUMERICAL_RESPONSE';

export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'EASY' | 'MEDIUM' | 'HARD';

export type ApprovalStatus =
  | 'approved'
  | 'pending'
  | 'rejected'
  | 'draft'
  | 'needs_review'
  | 'DRAFT'
  | 'NEEDS_REVIEW'
  | 'APPROVED'
  | 'REJECTED';

export type VerificationStatus =
  | 'confirmed'
  | 'needs_verification'
  | 'excluded'
  | 'manual_added';

export interface SubjectMetadata {
  id: SubjectId;
  name: string;
  nativeName?: string;
  language: 'en' | 'zh' | 'km';
  badgeColor: string;
  bookTitle: string;
  isProjectBased: boolean;
  isExcluded?: boolean;
  exclusionReason?: string;
  description: string;
}

export interface ExamPointerItem {
  no: number;
  subjectId: SubjectId;
  subjectName: string;
  pagesDescription: string;
  requiredPrintedPages: (number | string)[];
  isProjectBased: boolean;
  notes?: string;
}

export interface ExamPointer {
  id: string;
  academicYear: string;
  grade: string;
  term: string;
  schoolName: string;
  issuedDate: string;
  items: ExamPointerItem[];
}

export interface SourcePage {
  id: string;
  pdfPageNumber: number;
  printedPageNumber: number | string;
  bookTitle: string;
  subjectId: SubjectId;
  unitLesson: string;
  topic: string;
  lessonSummary?: string;
  language: 'en' | 'zh' | 'km';
  ocrExcerpt: string;
  keyWords: string[];
  status: VerificationStatus;
  confidence: number; // 0 - 100
  notes?: string;
  flaggedReason?: string;
}

export interface ExtractedContentItem {
  id: string;
  grade?: string;
  academicYear?: string;
  termId?: string;
  subjectId: SubjectId;
  printedPage: number | string;
  pdfPage: number;
  bookTitle: string;
  topic: string;
  subtopic: string;
  lessonSummary?: string;
  concepts: string[];
  vocabulary: Array<{
    word: string;
    pinyin?: string;
    phonics?: string;
    definition: string;
  }>;
  grammarRules: string[];
  examples: string[];
  exercises: string[];
  skills: string[];
}

export interface MatchingPair {
  left: string;
  right: string;
}

export interface Question {
  id: string;
  questionId?: string;
  termId: string;
  grade?: string;
  academicYear?: string;
  subjectId: SubjectId | string;
  subjectName?: string;

  sourceFileId?: string;
  sourceFileName?: string;
  bookTitle: string;
  sourceType?: string;

  pdfPage: number | string;
  printedPage: number | string;
  alternatePdfPages?: number[];

  unitTitle?: string;
  sectionTitle?: string;
  topic: string;

  learningPointId?: string;
  learningPoint?: string;
  lessonSummary?: string;

  questionType: QuestionType;
  difficulty: DifficultyLevel;
  question: string;
  passage?: string; // reading text, dialogue, or chant
  options?: string[]; // for multiple choice
  correctAnswer: any; // string, boolean, or array
  matchingPairs?: MatchingPair[]; // for matching
  orderingItems?: string[]; // initial scrambled items for ordering
  explanation: string;

  sourceEvidence?: string[];
  generationEvidence?: string[];

  approvalStatus: ApprovalStatus;
  reviewNotes?: string;
  createdAt: string;
  updatedAt?: string;
  aiGenerated: boolean;

  // Audit trail & engine metadata
  generatedAt?: string;
  generatedBy?: string;
  sourceLearningPointId?: string;
  generationModel?: string;
  generationVersion?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewAction?: string;
  reviewStatus?: 'READY_FOR_APPROVAL' | 'REVIEW_LATER' | 'APPROVED' | 'REJECTED' | 'DRAFT' | 'NEEDS_REVIEW' | string;
  rejectionReason?: string;
  changeLog?: string[];
  validationErrors?: string[];
  auditHistory?: QuestionAuditEntry[];
}

export type CoverageStatus =
  | 'COVERED'
  | 'NEEDS_MORE_QUESTIONS'
  | 'NEEDS_SOURCE_REVIEW'
  | 'PENDING_MAPPING';

export interface CoverageMatrixItem {
  subjectId: SubjectId;
  subjectName: string;
  printedPageNumber: number | string;
  pdfPageNumber: number | string;
  topic: string;
  learningPoint: string;
  questionCount: number;
  approvedQuestionCount?: number;
  questionIds: string[];
  status: CoverageStatus;
  bookTitle: string;
  notes?: string;
  isContentScope?: boolean;
}

export interface SubjectCoverageSummary {
  subjectId: SubjectId;
  subjectName: string;
  requiredPageCount: number;
  requiredScopeDescription: string;
  pagesAnalyzedCount: number;
  pagesCoveredCount: number;
  questionBankSize: number;
  questionsNeedingReviewCount: number;
  coveragePercentage: number;
  status: 'COMPLETE' | 'NEEDS_MORE_QUESTIONS' | 'NEEDS_SOURCE_REVIEW' | 'PENDING';
  isContentBasedScope?: boolean;
  hasPublishedTest?: boolean;
}

export interface PracticeTest {
  id: string;
  termId: string;
  subjectId: SubjectId;
  title: string;
  description: string;
  timeLimitMinutes: number;
  passingPercentage: number;
  questionIds: string[];
  isPublished: boolean;
  createdAt: string;
  allowLessonReminders?: boolean; // ON by default for practice mode, configurable for published tests
}

export interface StudentAnswerResult {
  questionId: string;
  isCorrect: boolean;
  studentAnswer: any;
  correctAnswer: any;
  explanation: string;
  subjectName: string;
  bookTitle: string;
  printedPage: number | string;
  pdfPage: number | string;
  topic: string;
  learningPoint?: string;
  lessonSummary?: string;
}

export interface TestAttempt {
  id: string;
  testId: string;
  testTitle: string;
  termId: string;
  subjectId: SubjectId;
  studentName: string;
  completedAt: string;
  score: number;
  total: number;
  percentage: number;
  timeSpentSeconds: number;
  results: StudentAnswerResult[];
}

export interface TermData {
  id: string;
  name: string;
  academicYear: string;
  grade: string;
  pointer: ExamPointer;
  sourcePages: SourcePage[];
  extractedContents: ExtractedContentItem[];
  questions: Question[];
  practiceTests: PracticeTest[];
  // Multi-subject source analysis and mapping architecture:
  sourceFiles?: SourceFile[];
  pageIndex?: PageIndexItem[];
  sourceBoundaries?: SourceBoundary[];
  mappingDecisions?: MappingDecision[];
  duplicatePageDecisions?: DuplicatePageDecision[];
  unresolvedScopeNotes?: Record<string, string>;
  mappingReport?: SourceMappingReport;
  // Stage 2 Intermediate Instructional Layer:
  learningPoints?: LearningPoint[];
  stage2Report?: Stage2ExtractionReport;
}
