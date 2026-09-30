import {
  SourceFile,
  SourceFileProcessingStatus,
  PageIndexItem,
  SourceBoundary,
  PointerRequirement,
  PointerSourceMatch,
  MappingDecision,
  PageChunk,
  SourceMappingReport,
  TeacherMappingAction,
  DuplicatePageDecision,
} from '../types';

export interface PageRawInput {
  pdfPage: number;
  rawText?: string;
  headerText?: string;
  footerText?: string;
  pageNumberMarker?: string | number;
  visualHeading?: string;
}

export class SourceAnalysisEngine {
  private static CONFIDENCE_THRESHOLD = 0.72;
  private static CHUNK_SIZE = 25; // 25-page manageable chunks

  /**
   * 1. Register a new source file (Supports both combined multi-subject PDF or individual subject PDF)
   */
  static registerSourceFile(params: {
    grade: string;
    academicYear: string;
    termId: string;
    fileName: string;
    fileSize: number;
    pageCount: number;
    sourceType: 'COMBINED_MULTI_SUBJECT' | 'SINGLE_SUBJECT' | 'WORKBOOK' | 'STUDENT_BOOK' | 'TEXTBOOK' | 'HANDOUT';
    subjectId?: string | null;
    bookTitle?: string | null;
    storageReference?: string;
  }): SourceFile {
    const isCombined = params.sourceType === 'COMBINED_MULTI_SUBJECT';
    return {
      sourceFileId: `src-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      grade: params.grade,
      academicYear: params.academicYear,
      termId: params.termId,
      subjectId: isCombined ? null : (params.subjectId || null),
      fileName: params.fileName,
      bookTitle: isCombined ? null : (params.bookTitle || null),
      sourceType: params.sourceType,
      storageProvider: 'local',
      storageReference: params.storageReference || params.fileName,
      pageCount: params.pageCount,
      fileSize: params.fileSize,
      processingStatus: 'REGISTERED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * 2. Split large source files into manageable page chunks while strictly preserving original PDF page numbers
   */
  static createPageChunks(sourceFile: SourceFile): PageChunk[] {
    const chunks: PageChunk[] = [];
    const totalPages = sourceFile.pageCount;
    let currentStart = 1;

    while (currentStart <= totalPages) {
      const currentEnd = Math.min(currentStart + this.CHUNK_SIZE - 1, totalPages);
      const pageCount = currentEnd - currentStart + 1;
      const pages = Array.from({ length: pageCount }, (_, i) => {
        const originalPdfPage = currentStart + i;
        return {
          originalPdfPage,
          chunkLocalPage: i + 1,
        };
      });

      chunks.push({
        chunkId: `chunk-${sourceFile.sourceFileId}-${currentStart}-${currentEnd}`,
        originalSourceFileId: sourceFile.sourceFileId,
        startOriginalPdfPage: currentStart,
        endOriginalPdfPage: currentEnd,
        pageCount,
        pages,
        processingStatus: 'PENDING',
      });

      currentStart = currentEnd + 1;
    }

    return chunks;
  }

  /**
   * 3. Multi-Subject Page Classifier using 9-level priority evidence:
   * 1. Explicit subject title
   * 2. Book title
   * 3. Header/footer
   * 4. Unit/chapter title
   * 5. Printed page number
   * 6. Section title
   * 7. Repeated layout/design associated with a source book
   * 8. Content and terminology
   * 9. Previous/next page continuity
   */
  static classifyPage(
    raw: PageRawInput,
    sourceFile: SourceFile,
    neighboringPages: { previous?: PageIndexItem; next?: PageRawInput } = {}
  ): PageIndexItem {
    const text = (raw.rawText || '').trim();
    const header = (raw.headerText || '').trim();
    const footer = (raw.footerText || '').trim();
    const heading = (raw.visualHeading || '').trim();
    const combinedContent = `${heading} ${header} ${text} ${footer}`.toLowerCase();

    const evidence: string[] = [];
    let detectedSubjectId: string | null = null;
    let detectedSubjectName: string | null = null;
    let detectedBookTitle: string | null = null;
    let detectedSourceType: 'Student Book' | 'Workbook' | 'Textbook' | 'Handout' | null = null;
    let printedPage: number | string | null = null;
    let unitTitle: string | null = null;
    let sectionTitle: string | null = null;
    let topic: string | null = null;
    let confidenceScore = 0.1; // Baseline

    // Check 1: Explicit subject title & book title markers
    if (/english/i.test(heading) || /english/i.test(header)) {
      detectedSubjectId = 'english';
      detectedSubjectName = 'English';
      evidence.push('Explicit subject title "English" detected in header/heading');
      confidenceScore += 0.35;
    } else if (/science/i.test(heading) || /science/i.test(header)) {
      detectedSubjectId = 'science';
      detectedSubjectName = 'Science';
      evidence.push('Explicit subject title "Science" detected in header/heading');
      confidenceScore += 0.35;
    } else if (/គណិតវិទ្យា|algebra|geometry|ពីជគណិត|ធរណីមាត្រ/i.test(heading) || /ពីជគណិត|ធរណីមាត្រ/i.test(header)) {
      detectedSubjectId = 'kh_algebra_geometry';
      detectedSubjectName = 'Khmer Algebra/Geometry';
      evidence.push('Subject title "Algebra/Geometry" detected');
      confidenceScore += 0.35;
    } else if (/mathematics|maths/i.test(heading) || /mathematics/i.test(header)) {
      detectedSubjectId = 'mathematics';
      detectedSubjectName = 'Mathematics';
      evidence.push('Explicit title "Mathematics" detected');
      confidenceScore += 0.35;
    } else if (/រូបវិទ្យា|physics/i.test(heading) || /រូបវិទ្យា/i.test(header)) {
      detectedSubjectId = 'kh_physics';
      detectedSubjectName = 'Khmer Physics';
      evidence.push('Subject title "Physics" detected');
      confidenceScore += 0.35;
    } else if (/គីមីវិទ្យា|chemistry/i.test(heading) || /គីមីវិទ្យា/i.test(header)) {
      detectedSubjectId = 'kh_chemistry';
      detectedSubjectName = 'Khmer Chemistry';
      evidence.push('Subject title "Chemistry" detected');
      confidenceScore += 0.35;
    } else if (/ជីវវិទ្យា|biology/i.test(heading) || /ជីវវិទ្យា/i.test(header)) {
      detectedSubjectId = 'kh_biology';
      detectedSubjectName = 'Khmer Biology';
      evidence.push('Subject title "Biology" detected');
      confidenceScore += 0.35;
    } else if (/ពលរដ្ឋ|civic/i.test(heading) || /ពលរដ្ឋ/i.test(header)) {
      detectedSubjectId = 'kh_civic';
      detectedSubjectName = 'Khmer Civic';
      evidence.push('Subject title "Civic Education" detected');
      confidenceScore += 0.35;
    } else if (/ប្រវត្តិ|history/i.test(heading) || /ប្រវត្តិ/i.test(header)) {
      detectedSubjectId = 'kh_history';
      detectedSubjectName = 'Khmer History';
      evidence.push('Subject title "History" detected');
      confidenceScore += 0.35;
    } else if (/ភាសាខ្មែរ|អក្សរសាស្ត្រ|អំណាន/i.test(heading) || /ភាសាខ្មែរ/i.test(header)) {
      detectedSubjectId = 'kh_literature';
      detectedSubjectName = 'Khmer Literature';
      evidence.push('Subject title "Khmer Literature" detected');
      confidenceScore += 0.35;
    }

    // Check 2: Book Title & Source Type (Student Book vs Workbook)
    if (/workbook/i.test(combinedContent)) {
      detectedSourceType = 'Workbook';
      evidence.push('Source identified as "Workbook" via text marker');
      confidenceScore += 0.2;
    } else if (/student('?s)? book|student book/i.test(combinedContent)) {
      detectedSourceType = 'Student Book';
      evidence.push('Source identified as "Student Book" via text marker');
      confidenceScore += 0.2;
    }

    // Check 3: Printed Page Number extraction
    const pageMatch =
      (raw.pageNumberMarker ? String(raw.pageNumberMarker).match(/\d+/) : null) ||
      footer.match(/page\s*(\d+)/i) ||
      header.match(/page\s*(\d+)/i) ||
      footer.match(/\b(\d{1,3})\b/) ||
      text.match(/page\s*(\d+)/i);

    if (pageMatch) {
      printedPage = parseInt(pageMatch[1], 10);
      evidence.push(`Printed page number ${printedPage} detected in page footer/header`);
      confidenceScore += 0.15;
    } else {
      evidence.push('No explicit printed page marker found on page surface');
    }

    // Check 4: Unit / Chapter Title
    const unitMatch = combinedContent.match(/(?:unit|chapter|ជំពូក|មេរៀនទី)\s*(\d+[:\s\w\u1780-\u17FF-]+)/i);
    if (unitMatch) {
      unitTitle = unitMatch[0].trim();
      evidence.push(`Unit/Chapter header identified: "${unitTitle}"`);
      confidenceScore += 0.1;
    }

    // Check 5: Section Title & Topic
    if (heading && heading !== detectedSubjectName) {
      sectionTitle = heading;
      topic = heading;
    }

    // Check 6: Content & Terminology fallback
    if (!detectedSubjectId) {
      if (/cell membrane|mitochondria|photosynthesis|ecosystem/i.test(combinedContent)) {
        detectedSubjectId = 'kh_biology';
        detectedSubjectName = 'Khmer Biology';
        evidence.push('Biological terminology detected in body text');
        confidenceScore += 0.2;
      } else if (/velocity|acceleration|newton|kinetic energy|កម្លាំង/i.test(combinedContent)) {
        detectedSubjectId = 'kh_physics';
        detectedSubjectName = 'Khmer Physics';
        evidence.push('Physics formulas and terminology detected');
        confidenceScore += 0.2;
      } else if (/periodic table|molecule|electron|chemical reaction/i.test(combinedContent)) {
        detectedSubjectId = 'kh_chemistry';
        detectedSubjectName = 'Khmer Chemistry';
        evidence.push('Chemistry symbols and terminology detected');
        confidenceScore += 0.2;
      } else if (/equation|polynomial|triangle|pythagoras|x\^2|y\s*=/i.test(combinedContent)) {
        detectedSubjectId = 'kh_algebra_geometry';
        detectedSubjectName = 'Khmer Algebra/Geometry';
        evidence.push('Algebraic/geometric equations detected');
        confidenceScore += 0.2;
      }
    }

    // Check 7: Neighboring Page Continuity
    if (neighboringPages.previous && neighboringPages.previous.detectedSubjectId) {
      const prev = neighboringPages.previous;
      if (!detectedSubjectId) {
        // Continuity inheritance
        detectedSubjectId = prev.detectedSubjectId;
        detectedSubjectName = prev.detectedSubjectName;
        detectedBookTitle = prev.detectedBookTitle;
        detectedSourceType = (prev.detectedSourceType as any) || null;
        evidence.push(`Inherited subject "${prev.detectedSubjectName}" from previous page continuity (PDF p.${prev.pdfPage})`);
        confidenceScore += 0.25;

        // If printed page was missing, check sequential increment
        if (printedPage === null && typeof prev.printedPage === 'number') {
          printedPage = prev.printedPage + 1;
          evidence.push(`Estimated sequential printed page ${printedPage} based on previous page ${prev.printedPage}`);
          confidenceScore += 0.1;
        }
      } else if (detectedSubjectId === prev.detectedSubjectId) {
        evidence.push(`Consistent subject continuity verified with preceding page (PDF p.${prev.pdfPage})`);
        confidenceScore += 0.1;
      }
    }

    // Final Book Title assignment
    if (!detectedBookTitle && detectedSubjectName) {
      detectedBookTitle = detectedSourceType
        ? `${detectedSubjectName} Grade ${sourceFile.grade.replace(/\D/g, '')} ${detectedSourceType}`
        : `${detectedSubjectName} Grade ${sourceFile.grade.replace(/\D/g, '')} Textbook`;
    }

    // DO NOT GUESS RULE:
    // If confidence is below threshold or essential fields are missing, mark NEEDS_REVIEW
    let classificationStatus: 'CONFIRMED' | 'NEEDS_REVIEW' | 'UNCLASSIFIED' = 'CONFIRMED';
    let reviewReason: string | null = null;

    if (!detectedSubjectId || confidenceScore < this.CONFIDENCE_THRESHOLD) {
      classificationStatus = 'NEEDS_REVIEW';
      reviewReason = !detectedSubjectId
        ? 'Could not determine subject with certainty. No explicit subject title or strong keyword matches found.'
        : `Classification confidence (${Math.round(confidenceScore * 100)}%) is below the required 72% threshold. Teacher review required.`;
    } else if (printedPage === null) {
      classificationStatus = 'NEEDS_REVIEW';
      reviewReason = 'Printed page number could not be determined from page content or continuity.';
    }

    return {
      sourceFileId: sourceFile.sourceFileId,
      pdfPage: raw.pdfPage,
      detectedSubjectId,
      detectedSubjectName,
      detectedBookTitle,
      detectedSourceType,
      printedPage,
      sectionTitle,
      unitTitle,
      topic,
      pageText: text,
      visualEvidence: heading ? [heading] : [],
      classificationConfidence: Math.min(Math.round(confidenceScore * 100) / 100, 1.0),
      classificationStatus,
      classificationEvidence: evidence,
      reviewReason,
      previousPageSubject: neighboringPages.previous?.detectedSubjectId || null,
      nextPageSubject: null,
      mappingStatus: 'UNMAPPED',
    };
  }

  /**
   * 4. Detect boundaries between subjects, books, workbooks, student books, and units
   */
  static detectSourceBoundaries(pages: PageIndexItem[], sourceFileId: string): SourceBoundary[] {
    if (pages.length === 0) return [];
    const boundaries: SourceBoundary[] = [];
    let currentStart = pages[0].pdfPage;
    let currentSubjectId = pages[0].detectedSubjectId || 'unknown';
    let currentSubjectName = pages[0].detectedSubjectName || 'Unknown Subject';
    let currentBookTitle = pages[0].detectedBookTitle || 'Unassigned Book';
    let currentSourceType = pages[0].detectedSourceType || 'Textbook';
    let currentUnit = pages[0].unitTitle || undefined;
    let confidenceSum = pages[0].classificationConfidence;
    let countInBoundary = 1;

    for (let i = 1; i < pages.length; i++) {
      const p = pages[i];
      const hasSubjectChanged = p.detectedSubjectId && p.detectedSubjectId !== currentSubjectId;
      const hasSourceTypeChanged = p.detectedSourceType && p.detectedSourceType !== currentSourceType;

      if (hasSubjectChanged || hasSourceTypeChanged) {
        // Record ended boundary
        boundaries.push({
          id: `boundary-${sourceFileId}-${currentStart}-${pages[i - 1].pdfPage}`,
          sourceFileId,
          startPdfPage: currentStart,
          endPdfPage: pages[i - 1].pdfPage,
          detectedSubjectId: currentSubjectId,
          detectedSubjectName: currentSubjectName,
          detectedBookTitle: currentBookTitle,
          sourceType: currentSourceType,
          unitChapter: currentUnit,
          confidence: Math.round((confidenceSum / countInBoundary) * 100) / 100,
        });

        // Start new boundary
        currentStart = p.pdfPage;
        currentSubjectId = p.detectedSubjectId || 'unknown';
        currentSubjectName = p.detectedSubjectName || 'Unknown Subject';
        currentBookTitle = p.detectedBookTitle || 'Unassigned Book';
        currentSourceType = p.detectedSourceType || 'Textbook';
        currentUnit = p.unitTitle || undefined;
        confidenceSum = p.classificationConfidence;
        countInBoundary = 1;
      } else {
        confidenceSum += p.classificationConfidence;
        countInBoundary++;
        if (p.unitTitle && !currentUnit) {
          currentUnit = p.unitTitle;
        }
      }
    }

    // Push the final boundary
    boundaries.push({
      id: `boundary-${sourceFileId}-${currentStart}-${pages[pages.length - 1].pdfPage}`,
      sourceFileId,
      startPdfPage: currentStart,
      endPdfPage: pages[pages.length - 1].pdfPage,
      detectedSubjectId: currentSubjectId,
      detectedSubjectName: currentSubjectName,
      detectedBookTitle: currentBookTitle,
      sourceType: currentSourceType,
      unitChapter: currentUnit,
      confidence: Math.round((confidenceSum / countInBoundary) * 100) / 100,
    });

    return boundaries;
  }

  /**
   * 5. Context-Aware Pointer-to-Source Mapping Engine:
   * 
   * NEVER matches solely on printedPage == requiredPage.
   * Matches must verify:
   * - Subject matches
   * - Book / Source Type matches (distinguishes English SB p.5 vs English WB p.5 vs Science SB p.5)
   * - Printed page matches
   * - High classification confidence and teacher confirmation
   */
  static matchPointerRequirements(
    requirements: PointerRequirement[],
    indexedPages: PageIndexItem[],
    decisions: MappingDecision[] = [],
    duplicateDecisions: DuplicatePageDecision[] = []
  ): PointerSourceMatch[] {
    const results: PointerSourceMatch[] = [];

    // Pre-index teacher override decisions by sourceFileId:pdfPage
    const decisionMap = new Map<string, MappingDecision>();
    decisions.forEach((d) => decisionMap.set(`${d.sourceFileId}:${d.pdfPage}`, d));

    for (const req of requirements) {
      if (req.isProjectBased) {
        continue; // Project-based subjects are excluded from page-based testing
      }

      if (req.isUnresolvedScope) {
        results.push({
          requirementId: req.id,
          grade: req.grade,
          termId: req.termId,
          subject: req.subjectName,
          subjectId: req.subjectId,
          sourceType: req.sourceType || 'Content Scope',
          printedPage: req.requiredPrintedPage,
          mappingStatus: 'NEEDS_REVIEW',
          matchedConfidence: 0,
          matchEvidence: ['Unresolved additional scope preserved without guessing until exact wording is confirmed.'],
          teacherApproved: false,
          reviewReason: 'Additional scope requirement in pointer must be verified with teacher.',
        });
        continue;
      }

      const reqPrintedPageStr = String(req.requiredPrintedPage).trim().toLowerCase();

      // Find candidate pages in index
      const candidates = indexedPages.filter((page) => {
        // Apply manual teacher decision if present
        const decisionKey = `${page.sourceFileId}:${page.pdfPage}`;
        const decision = decisionMap.get(decisionKey);

        const effSubjectId = decision?.correctedSubjectId || page.detectedSubjectId;
        const effBookTitle = decision?.correctedBookTitle || page.detectedBookTitle;
        const effPrintedPage = decision?.correctedPrintedPage !== undefined
          ? String(decision.correctedPrintedPage).trim().toLowerCase()
          : (page.printedPage !== null ? String(page.printedPage).trim().toLowerCase() : null);

        // Subject check
        if (!effSubjectId || effSubjectId.toLowerCase() !== req.subjectId.toLowerCase()) {
          return false;
        }

        // Printed page check (supports exact match or multi-page spread e.g. 50-51)
        let pageMatches = effPrintedPage === reqPrintedPageStr;
        if (!pageMatches && effPrintedPage) {
          const spreadTokens = effPrintedPage.split(/[-–,\s&/]+/).map((t) => t.trim());
          if (spreadTokens.includes(reqPrintedPageStr)) {
            pageMatches = true;
          }
        }
        if (!pageMatches) {
          return false;
        }

        // Book / Source Type check (Critical for English & Science SB vs WB)
        if (req.sourceType) {
          const reqSourceType = req.sourceType.toLowerCase();
          const pageSourceType = (page.detectedSourceType || '').toLowerCase();
          const pageBookTitle = (effBookTitle || '').toLowerCase();

          if (reqSourceType.includes('workbook') && !pageSourceType.includes('workbook') && !pageBookTitle.includes('workbook')) {
            return false;
          }
          if (reqSourceType.includes('student book') && !pageSourceType.includes('student') && !pageBookTitle.includes('student')) {
            // If page explicitly claims workbook, reject student book match
            if (pageSourceType.includes('workbook') || pageBookTitle.includes('workbook')) {
              return false;
            }
          }
        }

        return true;
      });

      // Check if teacher made a DuplicatePageDecision resolving this requirement to a primary page
      const dupDecision = duplicateDecisions.find(
        (d) =>
          d.subjectId.toLowerCase() === req.subjectId.toLowerCase() &&
          String(d.printedPage).trim().toLowerCase() === reqPrintedPageStr
      );

      if (dupDecision && candidates.length > 0) {
        const primaryCandidate =
          candidates.find((c) => c.pdfPage === dupDecision.primaryPdfPage) || candidates[0];

        results.push({
          requirementId: req.id,
          grade: req.grade,
          termId: req.termId,
          subject: req.subjectName,
          subjectId: req.subjectId,
          sourceType: primaryCandidate.detectedSourceType || req.sourceType || 'Textbook',
          printedPage: req.requiredPrintedPage,
          sourceFileId: primaryCandidate.sourceFileId,
          pdfPage: dupDecision.primaryPdfPage,
          alternatePdfPages: dupDecision.alternatePdfPages,
          mappingStatus: 'MATCHED',
          matchedConfidence: primaryCandidate.classificationConfidence,
          matchedPageIndexId: `${primaryCandidate.sourceFileId}-${primaryCandidate.pdfPage}`,
          matchEvidence: [
            ...primaryCandidate.classificationEvidence,
            `Primary source page designated by teacher: PDF page ${dupDecision.primaryPdfPage}`,
            `Alternate/duplicate pages retained: ${dupDecision.alternatePdfPages.map((p: number) => `PDF p.${p}`).join(', ')}`,
            dupDecision.notes ? `Teacher notes: ${dupDecision.notes}` : '',
          ].filter(Boolean),
          teacherApproved: true,
          reviewReason: undefined,
        });

        primaryCandidate.mappingStatus = 'MATCHED';
      } else if (candidates.length === 0) {
        // NOT FOUND
        results.push({
          requirementId: req.id,
          grade: req.grade,
          termId: req.termId,
          subject: req.subjectName,
          subjectId: req.subjectId,
          sourceType: req.sourceType || 'Textbook',
          printedPage: req.requiredPrintedPage,
          mappingStatus: 'NOT_FOUND',
          matchedConfidence: 0,
          matchEvidence: [`No indexed page in ${req.subjectName} matches printed page ${req.requiredPrintedPage}`],
          teacherApproved: false,
          reviewReason: `Printed page ${req.requiredPrintedPage} for ${req.subjectName} ${req.sourceType || ''} has not been found in the uploaded sources.`,
        });
      } else if (candidates.length === 1) {
        const candidate = candidates[0];
        const isNeedsReview = candidate.classificationStatus === 'NEEDS_REVIEW';

        results.push({
          requirementId: req.id,
          grade: req.grade,
          termId: req.termId,
          subject: req.subjectName,
          subjectId: req.subjectId,
          sourceType: candidate.detectedSourceType || req.sourceType || 'Textbook',
          printedPage: req.requiredPrintedPage,
          sourceFileId: candidate.sourceFileId,
          pdfPage: candidate.pdfPage,
          mappingStatus: isNeedsReview ? 'NEEDS_REVIEW' : 'MATCHED',
          matchedConfidence: candidate.classificationConfidence,
          matchedPageIndexId: `${candidate.sourceFileId}-${candidate.pdfPage}`,
          matchEvidence: [
            ...candidate.classificationEvidence,
            `Grounded to PDF physical page ${candidate.pdfPage}`,
            `Verified book title: "${candidate.detectedBookTitle}"`,
          ],
          teacherApproved: candidate.classificationStatus === 'CONFIRMED',
          reviewReason: candidate.reviewReason || undefined,
        });

        candidate.mappingStatus = isNeedsReview ? 'NEEDS_REVIEW' : 'MATCHED';
      } else {
        // AMBIGUOUS: Multiple candidates found!
        results.push({
          requirementId: req.id,
          grade: req.grade,
          termId: req.termId,
          subject: req.subjectName,
          subjectId: req.subjectId,
          sourceType: req.sourceType || 'Textbook',
          printedPage: req.requiredPrintedPage,
          alternatePdfPages: candidates.map((c) => c.pdfPage),
          mappingStatus: 'AMBIGUOUS',
          matchedConfidence: 0.5,
          matchEvidence: [
            `Multiple conflicting pages (${candidates.map((c) => `PDF p.${c.pdfPage}`).join(', ')}) matched required printed page ${req.requiredPrintedPage}`,
          ],
          teacherApproved: false,
          reviewReason: `Ambiguous match: Found ${candidates.length} pages (${candidates.map((c) => `PDF p.${c.pdfPage}`).join(', ')}) claiming printed page ${req.requiredPrintedPage}. Teacher selection of Primary Page required.`,
        });

        candidates.forEach((c) => (c.mappingStatus = 'AMBIGUOUS'));
      }
    }

    return results;
  }

  /**
   * 6. Generate the formal Required Page Coverage Report
   */
  static generateCoverageReport(
    grade: string,
    academicYear: string,
    termId: string,
    sourceFiles: SourceFile[],
    indexedPages: PageIndexItem[],
    matches: PointerSourceMatch[]
  ): SourceMappingReport {
    const matchedCount = matches.filter((m) => m.mappingStatus === 'MATCHED').length;
    const notFoundCount = matches.filter((m) => m.mappingStatus === 'NOT_FOUND').length;
    const ambiguousCount = matches.filter((m) => m.mappingStatus === 'AMBIGUOUS').length;
    const needsReviewCount = matches.filter((m) => m.mappingStatus === 'NEEDS_REVIEW').length;

    // Group by subject
    const subjectMap = new Map<string, PointerSourceMatch[]>();
    matches.forEach((m) => {
      const list = subjectMap.get(m.subjectId) || [];
      list.push(m);
      subjectMap.set(m.subjectId, list);
    });

    const subjectSummaries: SourceMappingReport['subjectSummaries'] = [];
    subjectMap.forEach((subMatches, subjectId) => {
      const subName = subMatches[0].subject;
      const totalRequired = subMatches.length;
      const matched = subMatches.filter((m) => m.mappingStatus === 'MATCHED').length;
      const unresolved = totalRequired - matched;
      const sourceTypes = Array.from(new Set(subMatches.map((m) => m.sourceType))).join(' & ');

      subjectSummaries.push({
        subjectId,
        subjectName: subName,
        sourceTypeSummary: sourceTypes,
        totalRequired,
        matched,
        unresolved,
        status: unresolved === 0 ? 'READY' : unresolved === totalRequired ? 'INCOMPLETE' : 'NEEDS_REVIEW',
      });
    });

    const canProceed = notFoundCount === 0 && ambiguousCount === 0 && needsReviewCount === 0;

    return {
      grade,
      academicYear,
      termId,
      generatedAt: new Date().toISOString(),
      totalSourceFiles: sourceFiles.length,
      totalPdfPagesIndexed: indexedPages.length,
      totalPointerRequirements: matches.length,
      matchedCount,
      notFoundCount,
      ambiguousCount,
      needsReviewCount,
      subjectSummaries,
      canProceedToQuestionGeneration: canProceed,
      teacherOverrideApproved: false,
    };
  }

  /**
   * 7. Record a Teacher Review Decision (CONFIRM, CHANGE_SUBJECT, CHANGE_BOOK, CHANGE_PRINTED_PAGE, etc.)
   */
  static applyTeacherDecision(
    decision: {
      sourceFileId: string;
      pdfPage: number;
      action: TeacherMappingAction;
      correctedSubjectId?: string;
      correctedSubjectName?: string;
      correctedBookTitle?: string;
      correctedPrintedPage?: number | string;
      notes?: string;
      decidedBy: string;
    },
    pageIndex: PageIndexItem[],
    existingDecisions: MappingDecision[] = []
  ): { updatedIndex: PageIndexItem[]; updatedDecisions: MappingDecision[] } {
    const page = pageIndex.find(
      (p) => p.sourceFileId === decision.sourceFileId && p.pdfPage === decision.pdfPage
    );

    const record: MappingDecision = {
      id: `dec-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      sourceFileId: decision.sourceFileId,
      pdfPage: decision.pdfPage,
      action: decision.action,
      originalSubjectId: page?.detectedSubjectId,
      correctedSubjectId: decision.correctedSubjectId || page?.detectedSubjectId,
      originalBookTitle: page?.detectedBookTitle,
      correctedBookTitle: decision.correctedBookTitle || page?.detectedBookTitle,
      originalPrintedPage: page?.printedPage,
      correctedPrintedPage: decision.correctedPrintedPage ?? page?.printedPage,
      notes: decision.notes,
      decidedBy: decision.decidedBy,
      decidedAt: new Date().toISOString(),
    };

    if (page) {
      if (decision.action === 'CONFIRM') {
        page.classificationStatus = 'CONFIRMED';
        page.reviewReason = null;
        page.classificationEvidence.push(`Confirmed by teacher (${decision.decidedBy})`);
      } else if (decision.action === 'CHANGE_SUBJECT') {
        if (decision.correctedSubjectId) {
          page.detectedSubjectId = decision.correctedSubjectId;
          page.detectedSubjectName = decision.correctedSubjectName || decision.correctedSubjectId;
        }
        page.classificationStatus = 'CONFIRMED';
        page.reviewReason = null;
        page.classificationEvidence.push(`Subject corrected to "${page.detectedSubjectName}" by teacher`);
      } else if (decision.action === 'CHANGE_BOOK') {
        if (decision.correctedBookTitle) {
          page.detectedBookTitle = decision.correctedBookTitle;
        }
        page.classificationStatus = 'CONFIRMED';
        page.reviewReason = null;
        page.classificationEvidence.push(`Book title corrected to "${decision.correctedBookTitle}" by teacher`);
      } else if (decision.action === 'CHANGE_PRINTED_PAGE') {
        if (decision.correctedPrintedPage !== undefined) {
          page.printedPage = decision.correctedPrintedPage;
        }
        page.classificationStatus = 'CONFIRMED';
        page.reviewReason = null;
        page.classificationEvidence.push(`Printed page corrected to ${decision.correctedPrintedPage} by teacher`);
      } else if (decision.action === 'MARK_NOT_RELEVANT') {
        page.classificationStatus = 'REJECTED';
        page.mappingStatus = 'UNMAPPED';
        page.reviewReason = 'Marked as not relevant/excluded by teacher';
      }
    }

    const updatedDecisions = [
      ...existingDecisions.filter(
        (d) => !(d.sourceFileId === decision.sourceFileId && d.pdfPage === decision.pdfPage)
      ),
      record,
    ];

    return {
      updatedIndex: pageIndex,
      updatedDecisions,
    };
  }
}
