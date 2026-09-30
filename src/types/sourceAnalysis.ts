/**
 * Multi-Subject Combined Source Detection & Page-Level Source Index Architecture
 * 
 * Supports:
 * 1. One combined source PDF containing multiple subjects (e.g. ~250 pages, mixed subjects)
 * 2. Multiple separate source PDFs (e.g. English.pdf, Science.pdf, etc.)
 * 3. Priority-based page classification without guessing
 * 4. Contextual Exam Pointer to source page matching (distinguishes e.g. English SB p.5 vs WB p.5)
 * 5. Teacher review and decision audit trail
 */

export type SourceFileProcessingStatus =
  | 'REGISTERED'
  | 'INDEXING'
  | 'INDEXED'
  | 'MAPPING'
  | 'READY'
  | 'NEEDS_REVIEW'
  | 'ERROR';

export type SourceType =
  | 'COMBINED_MULTI_SUBJECT'
  | 'SINGLE_SUBJECT'
  | 'WORKBOOK'
  | 'STUDENT_BOOK'
  | 'TEXTBOOK'
  | 'HANDOUT';

export interface SourceFile {
  sourceFileId: string;
  grade: string;
  academicYear: string;
  termId: string;
  subjectId: string | null; // Nullable before classification for combined multi-subject PDFs
  fileName: string;
  bookTitle: string | null; // Nullable before classification
  sourceType: SourceType;
  storageProvider: 'local' | 'gcp' | 'indexeddb' | 'memory' | string;
  storageReference: string;
  pageCount: number;
  fileSize: number;
  processingStatus: SourceFileProcessingStatus;
  createdAt: string;
  updatedAt: string;
}

export type PageClassificationStatus =
  | 'CONFIRMED'
  | 'NEEDS_REVIEW'
  | 'UNCLASSIFIED'
  | 'REJECTED';

export type PageMappingStatus =
  | 'MATCHED'
  | 'NOT_FOUND'
  | 'AMBIGUOUS'
  | 'NEEDS_REVIEW'
  | 'UNMAPPED';

export interface PageIndexItem {
  sourceFileId: string;
  pdfPage: number; // Physical page number inside the PDF (1-based)
  detectedSubjectId: string | null;
  detectedSubjectName: string | null;
  detectedBookTitle: string | null;
  detectedSourceType?: 'Student Book' | 'Workbook' | 'Textbook' | 'Handout' | string | null;
  printedPage: number | string | null; // Number printed inside textbook/workbook (NEVER same as pdfPage)
  sectionTitle: string | null;
  unitTitle: string | null;
  topic: string | null;
  pageText: string;
  visualEvidence?: string[];
  classificationConfidence: number; // 0.0 to 1.0
  classificationStatus: PageClassificationStatus;
  classificationEvidence: string[];
  reviewReason?: string | null;
  previousPageSubject?: string | null;
  nextPageSubject?: string | null;
  mappingStatus: PageMappingStatus;
}

export interface SourceBoundary {
  id: string;
  sourceFileId: string;
  startPdfPage: number;
  endPdfPage: number;
  detectedSubjectId: string;
  detectedSubjectName: string;
  detectedBookTitle: string;
  sourceType: 'Student Book' | 'Workbook' | 'Textbook' | 'Handout' | string;
  unitChapter?: string;
  confidence: number;
}

export interface PointerRequirement {
  id: string;
  grade: string;
  termId: string;
  subjectId: string;
  subjectName: string;
  sourceType?: 'Student Book' | 'Workbook' | 'Textbook' | 'Handout' | string;
  bookTitle?: string;
  requiredPrintedPage: number | string;
  notes?: string;
  isProjectBased?: boolean;
  isUnresolvedScope?: boolean;
}

export interface PointerSourceMatch {
  requirementId: string;
  grade: string | number;
  termId: string;
  subject: string;
  subjectId: string;
  sourceType: string;
  printedPage: number | string;
  sourceFileId?: string;
  pdfPage?: number;
  alternatePdfPages?: number[];
  mappingStatus: 'MATCHED' | 'NOT_FOUND' | 'AMBIGUOUS' | 'NEEDS_REVIEW';
  matchedConfidence: number;
  matchedPageIndexId?: string;
  matchEvidence: string[];
  teacherApproved: boolean;
  reviewReason?: string;
}

export type TeacherMappingAction =
  | 'CONFIRM'
  | 'CHANGE_SUBJECT'
  | 'CHANGE_BOOK'
  | 'CHANGE_PRINTED_PAGE'
  | 'MARK_NOT_RELEVANT'
  | 'REVIEW_LATER'
  | 'SELECT_PRIMARY_PAGE';

export interface DuplicatePageDecision {
  id: string;
  subject: string;
  subjectId: string;
  printedPage: number | string;
  primaryPdfPage: number;
  alternatePdfPages: number[];
  decision: 'PRIMARY_SELECTED';
  decidedBy: string;
  decidedAt: string;
  notes?: string;
}

export interface MappingDecision {
  id: string;
  sourceFileId: string;
  pdfPage: number;
  action: TeacherMappingAction;
  originalSubjectId?: string | null;
  correctedSubjectId?: string | null;
  originalBookTitle?: string | null;
  correctedBookTitle?: string | null;
  originalPrintedPage?: number | string | null;
  correctedPrintedPage?: number | string | null;
  notes?: string;
  decidedBy: string;
  decidedAt: string;
}

export interface PageChunk {
  chunkId: string;
  originalSourceFileId: string;
  startOriginalPdfPage: number;
  endOriginalPdfPage: number;
  pageCount: number;
  pages: Array<{
    originalPdfPage: number;
    chunkLocalPage: number;
  }>;
  processingStatus: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'ERROR';
}

export interface SourceMappingReport {
  grade: string;
  academicYear: string;
  termId: string;
  generatedAt: string;
  totalSourceFiles: number;
  totalPdfPagesIndexed: number;
  totalPointerRequirements: number;
  matchedCount: number;
  notFoundCount: number;
  ambiguousCount: number;
  needsReviewCount: number;
  subjectSummaries: Array<{
    subjectId: string;
    subjectName: string;
    sourceTypeSummary: string;
    totalRequired: number;
    matched: number;
    unresolved: number;
    status: 'READY' | 'NEEDS_REVIEW' | 'INCOMPLETE';
  }>;
  canProceedToQuestionGeneration: boolean;
  teacherOverrideApproved: boolean;
}

export type LearningPointType =
  | 'concept'
  | 'rule'
  | 'skill'
  | 'process'
  | 'procedure'
  | 'vocabulary'
  | 'formula'
  | 'classification'
  | 'relationship'
  | 'application';

export type InstructionalStatus = 'DRAFT' | 'NEEDS_REVIEW' | 'VERIFIED' | 'REJECTED';

export interface LearningPoint {
  id: string;
  grade: string;
  academicYear: string;
  termId: string;
  subjectId: string;
  subjectName: string;
  sourceFileId: string;
  pdfPage: number;
  alternatePdfPages?: number[];
  printedPage: number | string;
  bookTitle: string;
  sourceType: string;
  unitTitle: string;
  sectionTitle: string;
  topic: string;
  learningPoint: string;
  learningPointType: LearningPointType;
  sourceEvidence: string[];
  extractionConfidence: number;
  status: InstructionalStatus;
  createdAt: string;
  updatedAt: string;
  lessonSummary: string;
  lessonSummaryStatus: InstructionalStatus;
  lessonSummarySourceEvidence: string[];
  reviewedBy?: string;
  reviewedAt?: string;
  teacherNotes?: string;
}

export interface SubjectExtractionSummary {
  subjectId: string;
  subjectName: string;
  requiredPages: number;
  pagesProcessed: number;
  learningPointsCreated: number;
  lessonSummariesCreated: number;
  needsReviewCount: number;
  skippedUnresolvedCount: number;
  unresolvedPagesList: string[];
}

export interface Stage2ExtractionReport {
  grade: string;
  academicYear: string;
  termId: string;
  generatedAt: string;
  totalEligiblePages: number;
  totalPagesProcessed: number;
  totalLearningPoints: number;
  totalLessonSummaries: number;
  totalNeedsReview: number;
  totalSkippedUnresolved: number;
  subjects: SubjectExtractionSummary[];
}

export interface QuestionAuditEntry {
  action: 'GENERATED' | 'EDITED' | 'REGENERATED' | 'APPROVED' | 'REJECTED' | 'REVIEW_LATER' | 'VALIDATION_FAILED' | 'QA_RESTORE';
  timestamp: string;
  performedBy: string;
  notes?: string;
  rejectionReason?: string;
  changeLog?: string[];
  previousState?: {
    question?: string;
    options?: string[];
    correctAnswer?: any;
    explanation?: string;
    lessonSummary?: string;
    learningPoint?: string;
    approvalStatus?: string;
    reviewStatus?: string;
    difficulty?: string;
    questionType?: string;
  };
}

export interface QuestionValidationDetail {
  checkName: string;
  passed: boolean;
  message?: string;
}

export interface QuestionValidationReport {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  details: QuestionValidationDetail[];
}

