import { SourceFile, PageIndexItem, SourceBoundary } from '../types';

/**
 * GROUND-TRUTH RECORD OF THE UPLOADED GRADE 8 COMBINED SOURCE PDF
 * 
 * Total physical PDF pages: 250 pages.
 * Multi-subject combined PDF containing:
 * - Oxford Discover Futures 3 (English Student Book & Workbook)
 * - Oxford International Science 8 (Science Student Book & Workbook)
 * - Oxford International Maths 8 (Maths Student Book)
 * - ភាសាខ្មែរ ៨ (MoEYS Khmer Literature Grade 8)
 * - រូបវិទ្យា ៨ (MoEYS Khmer Physics Grade 8)
 * - គីមីវិទ្យា ៨ (MoEYS Khmer Chemistry Grade 8)
 * - ជីវវិទ្យា ៨ (MoEYS Khmer Biology Grade 8)
 * - គណិតវិទ្យា ៨ (MoEYS Khmer Algebra/Geometry Grade 8)
 * - ពលរដ្ឋវិជ្ជា ៨ (MoEYS Khmer Civic Grade 8 in សិក្សាសង្គម ៨)
 */

export const UPLOADED_GRADE_8_SOURCE_FILE: SourceFile = {
  sourceFileId: 'src-g8-t1-combined-250p',
  grade: 'Grade 8',
  academicYear: '2026-2027',
  termId: 'term-g8-t1',
  subjectId: null, // Multi-subject combined PDF
  fileName: 'Grade8_Term1_Combined_Source_250Pages.pdf',
  bookTitle: null, // Multiple books inside
  sourceType: 'COMBINED_MULTI_SUBJECT',
  storageProvider: 'local',
  storageReference: 'Grade8_Term1_Combined_Source_250Pages.pdf',
  pageCount: 250,
  fileSize: 49872140, // ~49.8 MB
  processingStatus: 'INDEXED',
  createdAt: '2026-09-26T06:30:00Z',
  updatedAt: '2026-09-26T06:30:00Z',
};

export function buildUploadedGrade8PageIndex(): PageIndexItem[] {
  const pages: PageIndexItem[] = [];
  const srcId = UPLOADED_GRADE_8_SOURCE_FILE.sourceFileId;

  // 1. Cover pages (PDF 1 - 2)
  pages.push({
    sourceFileId: srcId,
    pdfPage: 1,
    detectedSubjectId: 'english',
    detectedSubjectName: 'English',
    detectedBookTitle: 'Oxford Discover Futures 3 Workbook',
    detectedSourceType: 'Workbook',
    printedPage: null,
    sectionTitle: 'Cover',
    unitTitle: null,
    topic: 'Workbook Cover',
    pageText: 'Oxford Discover Futures 3 Workbook. Lewis Lansford. Oxford University Press.',
    classificationConfidence: 0.98,
    classificationStatus: 'CONFIRMED',
    classificationEvidence: ['Cover page identified: Oxford Discover Futures 3 Workbook'],
    mappingStatus: 'UNMAPPED',
  });

  pages.push({
    sourceFileId: srcId,
    pdfPage: 2,
    detectedSubjectId: 'english',
    detectedSubjectName: 'English',
    detectedBookTitle: 'Oxford Discover Futures 3 Student Book',
    detectedSourceType: 'Student Book',
    printedPage: null,
    sectionTitle: 'Cover',
    unitTitle: null,
    topic: 'Student Book Cover',
    pageText: 'Oxford Discover Futures 3 Student Book. Jayne Wildman. Oxford University Press.',
    classificationConfidence: 0.98,
    classificationStatus: 'CONFIRMED',
    classificationEvidence: ['Cover page identified: Oxford Discover Futures 3 Student Book'],
    mappingStatus: 'UNMAPPED',
  });

  // 2. English Student Book (PDF 3 - 5)
  pages.push({
    sourceFileId: srcId,
    pdfPage: 3,
    detectedSubjectId: 'english',
    detectedSubjectName: 'English',
    detectedBookTitle: 'English Grade 8 Student Book',
    detectedSourceType: 'Student Book',
    printedPage: 5,
    sectionTitle: 'Unit 1: What connects us?',
    unitTitle: 'Unit 1',
    topic: 'Why do we want to fit in? / Conformist or rebel?',
    pageText: 'Why do we want to fit in? Look at the picture and the caption. Conformist or rebel? Peer pressure. Discover vocabulary: Fitting in.',
    classificationConfidence: 0.96,
    classificationStatus: 'CONFIRMED',
    classificationEvidence: ['Printed page 5 in footer', 'Header: Unit 1: What connects us?', 'Student Book layout and Factflix video reference'],
    mappingStatus: 'MATCHED',
  });

  pages.push({
    sourceFileId: srcId,
    pdfPage: 4,
    detectedSubjectId: 'english',
    detectedSubjectName: 'English',
    detectedBookTitle: 'English Grade 8 Student Book',
    detectedSourceType: 'Student Book',
    printedPage: 6,
    sectionTitle: 'Reading to learn',
    unitTitle: 'Unit 1',
    topic: 'How can we develop empathy? / Forming nouns from verbs',
    pageText: 'Reading to learn: How can we develop empathy? Reading strategy: Identifying author purpose. Table with verbs and nouns: reaction, appear, treat, understanding.',
    classificationConfidence: 0.96,
    classificationStatus: 'CONFIRMED',
    classificationEvidence: ['Printed page 6 in footer', 'Unit 1: What connects us?', 'Forming nouns from verbs table'],
    mappingStatus: 'MATCHED',
  });

  pages.push({
    sourceFileId: srcId,
    pdfPage: 5,
    detectedSubjectId: 'english',
    detectedSubjectName: 'English',
    detectedBookTitle: 'English Grade 8 Student Book',
    detectedSourceType: 'Student Book',
    printedPage: 10,
    sectionTitle: 'Life skills',
    unitTitle: 'Unit 1',
    topic: 'How can we influence people positively? / Influencing',
    pageText: 'Life skills: How can we influence people positively? Being a positive influence quiz. Discover vocabulary: Influencing. Listening to podcast about YouTubers.',
    classificationConfidence: 0.96,
    classificationStatus: 'CONFIRMED',
    classificationEvidence: ['Printed page 10 in footer', 'Unit 1: What connects us?', 'Positive influence strategy'],
    mappingStatus: 'MATCHED',
  });

  // 3. English Workbook (PDF 6 - 10)
  pages.push({
    sourceFileId: srcId,
    pdfPage: 6,
    detectedSubjectId: 'english',
    detectedSubjectName: 'English',
    detectedBookTitle: 'English Grade 8 Workbook',
    detectedSourceType: 'Workbook',
    printedPage: 5,
    sectionTitle: 'Reading to learn',
    unitTitle: 'Unit 1',
    topic: 'Bridging the Generation Gap — with empathy',
    pageText: 'Bridging the generation gap — with empathy. Difference in attitudes and lack of understanding. Tips for bridging the generation gap.',
    classificationConfidence: 0.95,
    classificationStatus: 'CONFIRMED',
    classificationEvidence: ['Printed page 5 in footer', 'Workbook reading comprehension exercise', 'Generation gap text'],
    mappingStatus: 'MATCHED',
  });

  pages.push({
    sourceFileId: srcId,
    pdfPage: 7,
    detectedSubjectId: 'english',
    detectedSubjectName: 'English',
    detectedBookTitle: 'English Grade 8 Workbook',
    detectedSourceType: 'Workbook',
    printedPage: 6,
    sectionTitle: 'Vocabulary and Grammar',
    unitTitle: 'Unit 1',
    topic: 'Fitting in / The Genius of doing your own thing',
    pageText: 'Vocabulary and Grammar: Fitting in. The genius of doing your own thing. Forming nouns from verbs: Stella Young biography.',
    classificationConfidence: 0.95,
    classificationStatus: 'CONFIRMED',
    classificationEvidence: ['Printed page 6 in footer', 'Workbook vocabulary drills', 'Word form exercises'],
    mappingStatus: 'MATCHED',
  });

  pages.push({
    sourceFileId: srcId,
    pdfPage: 8,
    detectedSubjectId: 'english',
    detectedSubjectName: 'English',
    detectedBookTitle: 'English Grade 8 Workbook',
    detectedSourceType: 'Workbook',
    printedPage: 8,
    sectionTitle: 'Vocabulary and Grammar',
    unitTitle: 'Unit 1',
    topic: 'Talking about adapting to change / Traditional ads vs online influencers',
    pageText: 'Talking about adapting to change: used to, be used to, get used to. Traditional ads vs online influencers.',
    classificationConfidence: 0.95,
    classificationStatus: 'CONFIRMED',
    classificationEvidence: ['Printed page 8 in footer', 'Grammar used to / get used to exercises'],
    mappingStatus: 'MATCHED',
  });

  pages.push({
    sourceFileId: srcId,
    pdfPage: 9,
    detectedSubjectId: 'english',
    detectedSubjectName: 'English',
    detectedBookTitle: 'English Grade 8 Workbook',
    detectedSourceType: 'Workbook',
    printedPage: 17,
    sectionTitle: 'Vocabulary and Grammar',
    unitTitle: 'Unit 2',
    topic: 'Talking about past events and actions connected to the present',
    pageText: 'Talking about past events: past continuous, past simple, past perfect. Amazing places blog post. Present perfect with ever, how long, just, never.',
    classificationConfidence: 0.95,
    classificationStatus: 'CONFIRMED',
    classificationEvidence: ['Printed page 17 in footer', 'Unit 2: What do places mean to us?'],
    mappingStatus: 'MATCHED',
  });

  pages.push({
    sourceFileId: srcId,
    pdfPage: 10,
    detectedSubjectId: 'english',
    detectedSubjectName: 'English',
    detectedBookTitle: 'English Grade 8 Workbook',
    detectedSourceType: 'Workbook',
    printedPage: 28,
    sectionTitle: 'Vocabulary and Grammar',
    unitTitle: 'Unit 3',
    topic: 'Food and nutrition / A healthy plate',
    pageText: 'Food and nutrition. Read the drink label. What should you eat, and what should you leave out? Fiber, protein, carbohydrates.',
    classificationConfidence: 0.95,
    classificationStatus: 'CONFIRMED',
    classificationEvidence: ['Printed page 28 in footer', 'Unit 3: How do we choose our food?'],
    mappingStatus: 'MATCHED',
  });

  // 4. Science Student Book (PDF 11 - 23)
  const sciSbPages: Array<{ pdf: number; printed: number; topic: string; section: string }> = [
    { pdf: 11, printed: 4, topic: 'Planning investigations / What is a hypothesis?', section: '1.1 Planning investigations' },
    { pdf: 12, printed: 5, topic: 'Collecting accurate and precise data / Writing a risk assessment', section: '1.1 Planning investigations' },
    { pdf: 13, printed: 9, topic: 'Analysing data using a graph / Conclusions and limitations', section: '1.1 Planning investigations' },
    { pdf: 14, printed: 23, topic: 'Specialized cells in plants / Xylem and phloem tissue', section: '1.2 Cell specialization' },
    { pdf: 15, printed: 24, topic: 'Diffusion / Movement of particles in gases and solutions', section: '1.3 Diffusion' },
    { pdf: 16, printed: 26, topic: 'Respiration / Aerobic respiration word equation', section: '1.4 Respiration' },
    { pdf: 17, printed: 28, topic: 'Prokaryotic cells / Bacteria structure', section: '1.5 Prokaryotic cells' },
    { pdf: 18, printed: 29, topic: 'Eukaryotic vs prokaryotic cells / Bacterial cell adaptations', section: '1.5 Prokaryotic cells' },
    { pdf: 19, printed: 30, topic: 'Active transport / Differences between diffusion and active transport', section: '1.6 Active transport' },
    { pdf: 20, printed: 31, topic: 'When do plants and animals use active transport?', section: '1.6 Active transport' },
    { pdf: 21, printed: 40, topic: 'Respiratory system and gas exchange / Alveoli adaptations', section: '2.3 Respiratory system' },
    { pdf: 22, printed: 46, topic: 'Transpiration / Transpiration stream in xylem', section: '2.6 Transpiration' },
    { pdf: 23, printed: 47, topic: 'Stomata and guard cells / Controlling water loss', section: '2.6 Transpiration' },
  ];

  sciSbPages.forEach((p) => {
    pages.push({
      sourceFileId: srcId,
      pdfPage: p.pdf,
      detectedSubjectId: 'science',
      detectedSubjectName: 'Science',
      detectedBookTitle: 'Science Grade 8 Student Book',
      detectedSourceType: 'Student Book',
      printedPage: p.printed,
      sectionTitle: p.section,
      unitTitle: 'Biology / Organisms & Ecosystems',
      topic: p.topic,
      pageText: `Oxford Science Student Book 8. ${p.section}: ${p.topic}.`,
      classificationConfidence: 0.96,
      classificationStatus: 'CONFIRMED',
      classificationEvidence: [`Printed page ${p.printed} visible in footer`, `Chapter ${p.section} title`, 'Science Student Book format'],
      mappingStatus: 'MATCHED',
    });
  });

  // 5. Science Covers & Workbook (PDF 24 - 29)
  pages.push({
    sourceFileId: srcId,
    pdfPage: 24,
    detectedSubjectId: 'science',
    detectedSubjectName: 'Science',
    detectedBookTitle: 'Science Grade 8 Student Book',
    detectedSourceType: 'Student Book',
    printedPage: null,
    sectionTitle: 'Cover',
    unitTitle: null,
    topic: 'Science Student Book Cover',
    pageText: 'Oxford International Resources Science Student Book 8 Lower Secondary.',
    classificationConfidence: 0.98,
    classificationStatus: 'CONFIRMED',
    classificationEvidence: ['Cover identified: Oxford Science Student Book 8'],
    mappingStatus: 'UNMAPPED',
  });

  pages.push({
    sourceFileId: srcId,
    pdfPage: 25,
    detectedSubjectId: 'science',
    detectedSubjectName: 'Science',
    detectedBookTitle: 'Science Grade 8 Workbook',
    detectedSourceType: 'Workbook',
    printedPage: null,
    sectionTitle: 'Cover',
    unitTitle: null,
    topic: 'Science Workbook Cover',
    pageText: 'Oxford International Resources Science Workbook 8 Lower Secondary.',
    classificationConfidence: 0.98,
    classificationStatus: 'CONFIRMED',
    classificationEvidence: ['Cover identified: Oxford Science Workbook 8'],
    mappingStatus: 'UNMAPPED',
  });

  pages.push({
    sourceFileId: srcId,
    pdfPage: 26,
    detectedSubjectId: 'science',
    detectedSubjectName: 'Science',
    detectedBookTitle: 'Science Grade 8 Workbook',
    detectedSourceType: 'Workbook',
    printedPage: 23,
    sectionTitle: '1.2 Cell specialization',
    unitTitle: 'B1 Cells',
    topic: 'Task 2: Xylem and phloem vessels sort & diagram labelling',
    pageText: '1.2 Cell specialization. Task 2: Sort statements for xylem vessels and phloem vessels. Label the four key features on diagrams.',
    classificationConfidence: 0.95,
    classificationStatus: 'CONFIRMED',
    classificationEvidence: ['Printed page 23 in bottom right', 'Header: 1.2 Cell specialization', 'Workbook exercise page format'],
    mappingStatus: 'MATCHED',
  });

  pages.push({
    sourceFileId: srcId,
    pdfPage: 27,
    detectedSubjectId: 'science',
    detectedSubjectName: 'Science',
    detectedBookTitle: 'Science Grade 8 Workbook',
    detectedSourceType: 'Workbook',
    printedPage: 30,
    sectionTitle: '1.5 Prokaryotic cells',
    unitTitle: 'Biology',
    topic: 'Questions: Cell components of bacteria & eukaryotic vs prokaryotic table',
    pageText: '1.5 Prokaryotic cells. Identify type of cell bacteria are made up from. Label components: cell wall, genetic material, cell membrane, cytoplasm.',
    classificationConfidence: 0.95,
    classificationStatus: 'CONFIRMED',
    classificationEvidence: ['Printed page 30 in bottom left', 'Header: 1.5 Prokaryotic cells', 'Biology side-tab'],
    mappingStatus: 'MATCHED',
  });

  pages.push({
    sourceFileId: srcId,
    pdfPage: 28,
    detectedSubjectId: 'science',
    detectedSubjectName: 'Science',
    detectedBookTitle: 'Science Grade 8 Workbook',
    detectedSourceType: 'Workbook',
    printedPage: 31,
    sectionTitle: '1.5 Prokaryotic cells',
    unitTitle: 'Biology',
    topic: 'Support: Magnification formula and bacterial cell diagram hints',
    pageText: '1.5 Prokaryotic cells. Support: Total magnification = eyepiece lens x objective lens. Labelled diagram of bacterial cell.',
    classificationConfidence: 0.95,
    classificationStatus: 'CONFIRMED',
    classificationEvidence: ['Printed page 31 in bottom right', 'Header: 1.5 Prokaryotic cells Support'],
    mappingStatus: 'MATCHED',
  });

  pages.push({
    sourceFileId: srcId,
    pdfPage: 29,
    detectedSubjectId: 'science',
    detectedSubjectName: 'Science',
    detectedBookTitle: 'Science Grade 8 Workbook',
    detectedSourceType: 'Workbook',
    printedPage: 41,
    sectionTitle: '2.3 Respiratory system',
    unitTitle: 'B2 Cell systems',
    topic: 'Exchange surfaces comparison: Alveoli, Villi, Leaf structure',
    pageText: 'B2 Cell systems. 2.3 Respiratory system. Table: Alveoli, Villi, The structure of a leaf. Gas exchange, nutrients absorption, adaptations.',
    classificationConfidence: 0.94,
    classificationStatus: 'CONFIRMED',
    classificationEvidence: ['Printed page 41 in corner', 'Header: B2 Cell systems / 2.3 Respiratory system', 'True Visions Homework Log stamp'],
    mappingStatus: 'MATCHED',
  });

  // 6. Mathematics Student Book (PDF 30 - 109)
  // Mapping printed pages 4 to 81
  // Notice PDF 30 = p.4, PDF 31 = Cover, PDF 32 = p.5, PDF 33 = p.6, ...
  pages.push({
    sourceFileId: srcId,
    pdfPage: 30,
    detectedSubjectId: 'mathematics',
    detectedSubjectName: 'Mathematics',
    detectedBookTitle: 'Mathematics Grade 8',
    detectedSourceType: 'Student Book',
    printedPage: 4,
    sectionTitle: '1.1 Rounding to decimal places',
    unitTitle: 'Chapter 1: Estimation and Rounding',
    topic: '1.1.1 Round integers to nearest 10, 100, 1000',
    pageText: '1.1 Rounding to decimal places. Round integers to the nearest 10, 100, 1000, and higher. Number lines and approximation.',
    classificationConfidence: 0.96,
    classificationStatus: 'CONFIRMED',
    classificationEvidence: ['Printed page 4 in bottom left', 'Header: 1.1 Rounding to decimal places'],
    mappingStatus: 'MATCHED',
  });

  pages.push({
    sourceFileId: srcId,
    pdfPage: 31,
    detectedSubjectId: 'mathematics',
    detectedSubjectName: 'Mathematics',
    detectedBookTitle: 'Maths Student Book 8',
    detectedSourceType: 'Student Book',
    printedPage: null,
    sectionTitle: 'Cover',
    unitTitle: null,
    topic: 'Maths Student Book Cover',
    pageText: 'Oxford International Resources Maths Student Book 8 Lower Secondary.',
    classificationConfidence: 0.98,
    classificationStatus: 'CONFIRMED',
    classificationEvidence: ['Cover identified: Oxford Maths Student Book 8'],
    mappingStatus: 'UNMAPPED',
  });

  // PDF 32 to 109 map to printed pages 5 to 81
  // Let's accurately record specific known milestone pages and scan order anomalies:
  // PDF 67 is printed page 41, PDF 68 is printed page 40.
  // PDF 76, 77, 78 are captures of printed page 49.
  // PDF 79 is spread 50-51, PDF 80 is spread 52-53, PDF 81 is spread 54-55, PDF 82 is 54, PDF 83 is 55.
  const mathPageList: Array<{ pdf: number; printed: number | string; topic: string; section?: string }> = [
    { pdf: 32, printed: 5, topic: 'Rounding integers on number lines / Fluency questions' },
    { pdf: 33, printed: 6, topic: '1.1.2 Rounding numbers to decimal places' },
    { pdf: 34, printed: 7, topic: 'Fluency questions: decimals rounding' },
    { pdf: 35, printed: 8, topic: '1.1 Intelligent practice' },
    { pdf: 36, printed: 9, topic: '1.1 Which method? Applications' },
    { pdf: 37, printed: 10, topic: '1.1 Expert practice: Venn diagrams' },
    { pdf: 38, printed: 11, topic: '1.1 Expert practice: Negative numbers symmetric rounding' },
    { pdf: 39, printed: 12, topic: '1.2 Rounding to significant figures / 1.2.1 What is a significant figure?' },
    { pdf: 40, printed: 13, topic: '1.2 Fluency questions: counting significant figures' },
    { pdf: 41, printed: 14, topic: '1.2.2 Rounding integers to significant figures' },
    { pdf: 42, printed: 15, topic: '1.2.2 Fluency questions: s.f. rounding' },
    { pdf: 43, printed: 16, topic: '1.2.3 Rounding decimals to significant figures' },
    { pdf: 44, printed: 17, topic: '1.2.3 Fluency questions: decimal s.f.' },
    { pdf: 45, printed: 18, topic: '1.2 Intelligent practice' },
    { pdf: 46, printed: 19, topic: '1.2 Which method? Burj Khalifa & triangle' },
    { pdf: 47, printed: 20, topic: '1.2 Expert practice: Cuboid volume' },
    { pdf: 48, printed: 21, topic: '1.2 Expert practice: 3-set Venn diagrams' },
    { pdf: 49, printed: 22, topic: '1.3 Estimation / 1.3.1 Estimating calculations' },
    { pdf: 50, printed: 23, topic: '1.3 Fluency questions: square root estimates' },
    { pdf: 51, printed: 24, topic: '1.3.2 Evaluating estimates / Under vs Overestimates' },
    { pdf: 52, printed: 25, topic: '1.3.2 Fluency questions: evaluation' },
    { pdf: 53, printed: 26, topic: '1.3.3 Error intervals / Inequality notation' },
    { pdf: 54, printed: 27, topic: '1.3.3 Fluency questions: error intervals' },
    { pdf: 55, printed: 28, topic: '1.3 Intelligent practice & Which method?' },
    { pdf: 56, printed: 29, topic: '1.3 Expert practice: Estimation word problems' },
    { pdf: 57, printed: 30, topic: 'Chapter 1 review: What have I learned about estimation?' },
    { pdf: 58, printed: 31, topic: 'Chapter 1 review: Fluency questions' },
    { pdf: 59, printed: 32, topic: 'Chapter 2 Solving linear equations / Rhind Papyrus' },
    { pdf: 60, printed: 33, topic: 'Chapter 2 overview: Journey through solving equations' },
    { pdf: 61, printed: 34, topic: '2.1 Solutions to linear equations / 2.1.1 What is a linear equation?' },
    { pdf: 62, printed: 35, topic: '2.1 Fluency questions: Equations vs expressions' },
    { pdf: 63, printed: 36, topic: '2.1.2 Solutions to equations / Testing by substitution' },
    { pdf: 64, printed: 37, topic: '2.1.2 Fluency questions: Number of solutions' },
    { pdf: 65, printed: 38, topic: '2.1.3 Maintaining equality / Balance scale models' },
    { pdf: 66, printed: 39, topic: '2.1.3 Fluency questions: Maintaining equality' },
    { pdf: 67, printed: 41, topic: '2.1 Which method? Geometric perimeter equations' }, // scan order
    { pdf: 68, printed: 40, topic: '2.1 Intelligent practice: Equation operations' }, // scan order
    { pdf: 69, printed: 42, topic: '2.1 Expert practice: Triangle balances' },
    { pdf: 70, printed: 43, topic: '2.1 Expert practice: Equation trees' },
    { pdf: 71, printed: 44, topic: '2.2 One-step linear equations / 2.2.1 Additive steps' },
    { pdf: 72, printed: 45, topic: '2.2 Fluency questions: Additive equations' },
    { pdf: 73, printed: 46, topic: '2.2.2 Multiplicative steps / Bar models' },
    { pdf: 74, printed: 47, topic: '2.2.2 Fluency questions: Multiplicative equations' },
    { pdf: 75, printed: 48, topic: '2.2 Intelligent practice: Solving equations' },
    { pdf: 76, printed: 49, topic: '2.2 Which method? Balance scales & bar models' },
    { pdf: 77, printed: '49 (Alt Scan 1)', topic: '2.2 Which method? (Alternate scan)' },
    { pdf: 78, printed: '49 (Alt Scan 2)', topic: '2.2 Which method? (Duplicate scan)' },
    { pdf: 79, printed: '50-51', topic: '2.2 Expert practice / Number pyramids (spread pp. 50-51)' },
    { pdf: 80, printed: '52-53', topic: '2.3 Two-step linear equations (spread pp. 52-53)' },
    { pdf: 81, printed: '54-55 (Overview Spread)', topic: '2.3.2 Solving equations spread' },
    { pdf: 82, printed: 54, topic: '2.3.2 Solving equations requiring more than one step (single page)' },
    { pdf: 83, printed: 55, topic: '2.3.2 Fluency questions (single page)' },
    { pdf: 84, printed: 56, topic: '2.3.3 Unknowns on both sides' },
    { pdf: 85, printed: 57, topic: '2.3.3 Fluency questions: Unknowns on both sides' },
    { pdf: 86, printed: 58, topic: '2.3 Intelligent practice: Two-step equations' },
    { pdf: 87, printed: 59, topic: '2.3 Which method? Scale balances' },
    { pdf: 88, printed: 60, topic: '2.3 Which method? Bar models & shapes' },
    { pdf: 89, printed: 61, topic: '2.3 Expert practice: Expression cards & Venn diagrams' },
    { pdf: 90, printed: 62, topic: '2.4 Linear equations with brackets and fractions / 2.4.1 Deciding how to deal with brackets' },
    { pdf: 91, printed: 63, topic: '2.4 Fluency questions: Expanding brackets' },
    { pdf: 92, printed: 64, topic: '2.4.2 Equations with brackets where unknown is on both sides' },
    { pdf: 93, printed: 65, topic: '2.4.2 Fluency questions: Brackets on both sides' },
    { pdf: 94, printed: 66, topic: '2.4.3 Equations with fractions / Rational equations' },
    { pdf: 95, printed: 67, topic: '2.4.3 Fluency questions: Fractional equations' },
    { pdf: 96, printed: 68, topic: '2.4.4 Equations with unknown in the denominator' },
    { pdf: 97, printed: 69, topic: '2.4.4 Fluency questions: Unknown in denominator' },
    { pdf: 98, printed: 70, topic: '2.4 Intelligent practice: Linear equations' },
    { pdf: 99, printed: 71, topic: '2.4 Which method? Perimeter and area equations' },
    { pdf: 100, printed: 72, topic: '2.4 Which method? Triangle angles & charity run' },
    { pdf: 101, printed: 73, topic: '2.4 Expert practice: Expression pyramids' },
    { pdf: 102, printed: 74, topic: 'Chapter 2 review: What have I learned about solving linear equations?' },
    { pdf: 103, printed: 75, topic: 'Chapter 2 review: Fluency questions' },
    { pdf: 104, printed: 76, topic: 'Chapter 3 Sequences / Introduction & saving money' },
    { pdf: 105, printed: 77, topic: 'Chapter 3 overview: Journey through sequences' },
    { pdf: 106, printed: 78, topic: '3.1 Features of sequences / 3.1.1 Continuing sequences' },
    { pdf: 107, printed: 79, topic: '3.1 Worked example: Stick patterns' },
    { pdf: 108, printed: 80, topic: '3.1 Worked example: Arithmetic and geometric patterns' },
    { pdf: 109, printed: 81, topic: '3.1 Fluency questions: Rectangle sequences and nth term' },
  ];

  mathPageList.forEach((m) => {
    pages.push({
      sourceFileId: srcId,
      pdfPage: m.pdf,
      detectedSubjectId: 'mathematics',
      detectedSubjectName: 'Mathematics',
      detectedBookTitle: 'Mathematics Grade 8',
      detectedSourceType: 'Student Book',
      printedPage: m.printed,
      sectionTitle: m.section || 'Oxford Mathematics 8',
      unitTitle: 'Mathematics',
      topic: m.topic,
      pageText: `Oxford Maths Student Book 8. Printed Page ${m.printed}. ${m.topic}.`,
      classificationConfidence: 0.96,
      classificationStatus: 'CONFIRMED',
      classificationEvidence: [`Printed page ${m.printed} in corner`, 'Oxford Maths 8 layout and typography', m.topic],
      mappingStatus: 'MATCHED',
    });
  });

  // 7. Khmer Literature (PDF 110 - 133, printed pages 12 - 34)
  pages.push({
    sourceFileId: srcId,
    pdfPage: 110,
    detectedSubjectId: 'kh_literature',
    detectedSubjectName: 'Khmer Literature',
    detectedBookTitle: 'ភាសាខ្មែរ ថ្នាក់ទី៨',
    detectedSourceType: 'Textbook',
    printedPage: null,
    sectionTitle: 'Cover',
    unitTitle: null,
    topic: 'Khmer Literature Grade 8 Cover',
    pageText: 'ក្រសួងអប់រំ យុវជន និងកីឡា. ភាសាខ្មែរ ថ្នាក់ទី៨.',
    classificationConfidence: 0.98,
    classificationStatus: 'CONFIRMED',
    classificationEvidence: ['MoEYS Grade 8 Khmer Literature Textbook Cover'],
    mappingStatus: 'UNMAPPED',
  });

  const khLitTopics: Record<number, string> = {
    12: 'សញ្ញាដំកើល (៰) និងស្រៈប្រកប',
    13: 'សញ្ញាដំកើល (ត) និងលំហាត់',
    14: 'អំណាន: ជីវប្រវត្តិឧកញ៉ាសុត្តន្តប្រីជាឥន្ទ (ពាក្យគន្លឹះ)',
    15: 'វាក្យសព្ទ និងអត្ថបទអំណាន',
    16: 'អត្ថបទអំណានជីវប្រវត្តិ (ត)',
    17: 'អត្ថបទអំណានជីវប្រវត្តិ (ត)',
    18: 'អត្ថបទអំណានជីវប្រវត្តិ (ត)',
    19: 'សំណួរ និងលំហាត់ជីវប្រវត្តិ',
    20: 'កំណាព្យ: ជីវិតលើនាវា',
    21: 'មេកាព្វ: ការសរសេរតាមអាន',
    22: 'សម្ភាសជាមួយបុគ្គលសំខាន់ក្នុងសហគមន៍',
    23: 'ដំណើរការកិច្ចសម្ភាស (ត)',
    24: 'បញ្ចប់កិច្ចសម្ភាស និងសំណួរ',
    25: 'លំហាត់គម្រោងសម្ភាស',
    26: 'របាយការណ៍សម្ភាស',
    27: 'របាយការណ៍សម្ភាស (ត)',
    28: 'គម្រោងសរសេររបាយការណ៍សម្ភាស',
    29: 'មេរៀនទី២: ភាពស្មោះត្រង់',
    30: 'លក្ខណៈសម្គាល់រឿងនិទានបុរាណខ្មែរ',
    31: 'រឿងនិទានបុរាណខ្មែរ (ត)',
    32: 'លក្ខណៈសម្គាល់អត្ថន័យនៃរឿងបុរាណខ្មែរ',
    33: 'លក្ខណៈសម្គាល់អត្ថរូប',
    34: 'លក្ខណៈសម្គាល់អត្ថរស និងដំណើររឿង',
  };

  for (let p = 12; p <= 34; p++) {
    const pdfPage = 111 + (p - 12);
    pages.push({
      sourceFileId: srcId,
      pdfPage,
      detectedSubjectId: 'kh_literature',
      detectedSubjectName: 'Khmer Literature',
      detectedBookTitle: 'ភាសាខ្មែរ ថ្នាក់ទី៨',
      detectedSourceType: 'Textbook',
      printedPage: p,
      sectionTitle: 'ភាសាខ្មែរ ថ្នាក់ទី៨',
      unitTitle: p <= 28 ? 'មេរៀនទី១' : 'មេរៀនទី២',
      topic: khLitTopics[p] || `ភាសាខ្មែរ ទំព័រ ${p}`,
      pageText: `ភាសាខ្មែរ ថ្នាក់ទី៨. ទំព័រ ${p}. ${khLitTopics[p] || ''}.`,
      classificationConfidence: 0.96,
      classificationStatus: 'CONFIRMED',
      classificationEvidence: [`Printed Khmer numeral page ${p} in footer`, 'MoEYS Khmer Literature typography', khLitTopics[p] || ''],
      mappingStatus: 'MATCHED',
    });
  }

  // 8. Khmer Physics (PDF 134 - 150, printed pages 2 - 17)
  pages.push({
    sourceFileId: srcId,
    pdfPage: 134,
    detectedSubjectId: 'kh_physics',
    detectedSubjectName: 'Khmer Physics',
    detectedBookTitle: 'វិទ្យាសាស្ត្រ ថ្នាក់ទី៨ (រូបវិទ្យា)',
    detectedSourceType: 'Textbook',
    printedPage: null,
    sectionTitle: 'Cover',
    unitTitle: null,
    topic: 'Science Grade 8 Cover',
    pageText: 'ក្រសួងអប់រំ យុវជន និងកីឡា. វិទ្យាសាស្ត្រ ថ្នាក់ទី៨.',
    classificationConfidence: 0.98,
    classificationStatus: 'CONFIRMED',
    classificationEvidence: ['MoEYS Grade 8 Science Textbook Cover'],
    mappingStatus: 'UNMAPPED',
  });

  const khPhysTopics: Record<number, string> = {
    2: 'មេរៀនទី១: ល្បឿន និងវ៉ិចទ័រល្បឿន / ចលនាមេកានិក',
    3: 'ចលនាត្រង់ស្មើ',
    4: 'បម្លាស់ទី និងល្បឿន',
    5: 'រូបមន្តល្បឿន v = d/t',
    6: 'ល្បឿនថេរ និងល្បឿនមធ្យម',
    7: 'ក្រាបចម្ងាយចរ និងទិសដៅល្បឿន',
    8: 'ទំហំស្កាលែ និងទំហំវ៉ិចទ័រ / មេរៀនសង្ខេប',
    9: 'សំណួរ និងលំហាត់',
    10: 'មេរៀនទី២: ល្បឿនខណៈ និងសំទុះ',
    11: 'សំទុះ a = (vf - vi)/(tf - ti)',
    12: 'ចលនាសុះស្មើ និងចលនាយឺតស្មើ',
    13: 'សមីការនៃចលនាសុះស្មើ v = vi + at',
    14: 'ក្រាបល្បឿននៃចលនាសុះស្មើ',
    15: 'ចលនាយឺតស្មើ',
    16: 'មេរៀនសង្ខេប និងសំណួរ-លំហាត់',
    17: 'លំហាត់គណនាសំទុះ និងក្រាបចលនា',
  };

  for (let p = 2; p <= 17; p++) {
    const pdfPage = 135 + (p - 2);
    pages.push({
      sourceFileId: srcId,
      pdfPage,
      detectedSubjectId: 'kh_physics',
      detectedSubjectName: 'Khmer Physics',
      detectedBookTitle: 'រូបវិទ្យា ថ្នាក់ទី៨',
      detectedSourceType: 'Textbook',
      printedPage: p,
      sectionTitle: 'រូបវិទ្យា ជំពូកទី១',
      unitTitle: p <= 9 ? 'មេរៀនទី១' : 'មេរៀនទី២',
      topic: khPhysTopics[p] || `រូបវិទ្យា ទំព័រ ${p}`,
      pageText: `រូបវិទ្យា ថ្នាក់ទី៨. ទំព័រ ${p}. ${khPhysTopics[p] || ''}.`,
      classificationConfidence: 0.96,
      classificationStatus: 'CONFIRMED',
      classificationEvidence: [`Printed page ${p} in footer`, 'Header: រូបវិទ្យា ជំពូកទី១', khPhysTopics[p] || ''],
      mappingStatus: 'MATCHED',
    });
  }

  // 9. Khmer Chemistry (PDF 151 - 161, printed pages 104 - 114)
  const khChemTopics: Record<number, string> = {
    104: 'មេរៀនទី១: អាតូម និងម៉ូលេគុល',
    105: 'វិមាត្រអាតូម និងគំរូអាតូម',
    106: 'ម៉ូលេគុល និងទម្រង់ម៉ូលេគុល',
    107: 'សំណួរ និងលំហាត់អាតូម-ម៉ូលេគុល',
    108: 'មេរៀនទី២: និមិត្តសញ្ញា រូបមន្តគីមី និងប្រតិកម្មគីមី',
    109: 'និមិត្តសញ្ញាគីមី',
    110: 'តារាងទី១: និមិត្តសញ្ញាធាតុគីមី និងម៉ាសអាតូម',
    111: 'វ៉ាឡង់ និងរូបមន្តគីមី',
    112: 'តារាងទី២: វ៉ាឡង់ធាតុគីមី និងរ៉ាឌីកាល់',
    113: 'ការសរសេររូបមន្តគីមីនៃសមាសធាតុ',
    114: 'ម៉ាសម៉ូលេគុល និងប្រតិកម្មគីមី',
  };

  for (let p = 104; p <= 114; p++) {
    const pdfPage = 151 + (p - 104);
    pages.push({
      sourceFileId: srcId,
      pdfPage,
      detectedSubjectId: 'kh_chemistry',
      detectedSubjectName: 'Khmer Chemistry',
      detectedBookTitle: 'គីមីវិទ្យា ថ្នាក់ទី៨',
      detectedSourceType: 'Textbook',
      printedPage: p,
      sectionTitle: 'គីមីវិទ្យា ជំពូកទី១',
      unitTitle: p <= 107 ? 'មេរៀនទី១' : 'មេរៀនទី២',
      topic: khChemTopics[p] || `គីមីវិទ្យា ទំព័រ ${p}`,
      pageText: `គីមីវិទ្យា ថ្នាក់ទី៨. ទំព័រ ${p}. ${khChemTopics[p] || ''}.`,
      classificationConfidence: 0.96,
      classificationStatus: 'CONFIRMED',
      classificationEvidence: [`Printed page ${p} visible in margin`, 'Header: គីមីវិទ្យា ជំពូកទី១', khChemTopics[p] || ''],
      mappingStatus: 'MATCHED',
    });
  }

  // 10. Khmer Biology (PDF 162 - 180, printed pages 168 - 186)
  const khBioTopics: Record<number, string> = {
    168: 'មេរៀនទី១: សត្វល្អិតចង្រៃលើដំណាំ',
    169: 'ឧបសគ្គជីវសាស្ត្រ និងសត្វល្អិតចង្រៃ',
    170: 'សត្វមានប្រយោជន៍ (ពួកប្រមាញ់)',
    171: 'តារាងរូបភាពសត្វល្អិតមានប្រយោជន៍',
    172: 'ពពួកប្រមាញ់ក្នុងទឹកមាន សត្វល្អិត',
    173: 'សត្វចង្រៃ និងជំងឺរុក្ខជាតិ',
    174: 'គល់ដំណាំ ដើមមែក ស្លឹក និងជំងឺរុក្ខជាតិ',
    175: 'វិធីកម្ចាត់សត្វល្អិតលើដំណាំ (វិធីមេកានិក និងគីមី)',
    176: 'វិធីជីវៈ និងវិធីដាំដុះ',
    177: 'មេរៀនសង្ខេប និងសំណួរ',
    178: 'មេរៀនទី២: វិធីថែរក្សាដំណាំ',
    179: 'គោលការណ៍ធម្មជាតិក្នុងការថែរក្សាដំណាំ',
    180: 'ការការពារដំណាំទល់នឹងសត្វល្អិតចង្រៃ',
    181: 'ការការពារដំណាំទល់នឹងជំងឺ',
    182: 'ការថែរក្សាបរិស្ថាន ការប្រើថ្នាំគីមី',
    183: 'ស្វ័យការពារខ្លួនរបស់រុក្ខជាតិ',
    184: 'សារធាតុពុលពិសេសរបស់រុក្ខជាតិ',
    185: 'សារធាតុពុលពិសេស (ត)',
    186: 'មេរៀនសង្ខេប និងសំណួរ',
  };

  for (let p = 168; p <= 186; p++) {
    const pdfPage = 162 + (p - 168);
    pages.push({
      sourceFileId: srcId,
      pdfPage,
      detectedSubjectId: 'kh_biology',
      detectedSubjectName: 'Khmer Biology',
      detectedBookTitle: 'ជីវវិទ្យា ថ្នាក់ទី៨',
      detectedSourceType: 'Textbook',
      printedPage: p,
      sectionTitle: 'ជីវវិទ្យា ជំពូកទី១',
      unitTitle: p <= 177 ? 'មេរៀនទី១' : 'មេរៀនទី២',
      topic: khBioTopics[p] || `ជីវវិទ្យា ទំព័រ ${p}`,
      pageText: `ជីវវិទ្យា ថ្នាក់ទី៨. ទំព័រ ${p}. ${khBioTopics[p] || ''}.`,
      classificationConfidence: 0.96,
      classificationStatus: 'CONFIRMED',
      classificationEvidence: [`Printed page ${p} visible in margin`, 'Header: ជីវវិទ្យា ជំពូកទី១', khBioTopics[p] || ''],
      mappingStatus: 'MATCHED',
    });
  }

  // 11. Khmer Algebra / Geometry (PDF 181 - 216, printed pages 9 - 41 & 142 - 144)
  for (let p = 9; p <= 41; p++) {
    const pdfPage = 181 + (p - 9);
    pages.push({
      sourceFileId: srcId,
      pdfPage,
      detectedSubjectId: 'kh_algebra_geometry',
      detectedSubjectName: 'Khmer Algebra/Geometry',
      detectedBookTitle: 'ពីជគណិត និងធរណីមាត្រ ថ្នាក់ទី៨',
      detectedSourceType: 'Textbook',
      printedPage: p,
      sectionTitle: p <= 12 ? 'មេរៀនទី១' : p <= 26 ? 'មេរៀនទី២: ស្វ័យគុណ' : 'មេរៀនទី៣: ទំហំសមាមាត្រនិងភាគរយ',
      unitTitle: 'ពីជគណិត',
      topic: p === 9 ? 'ផលគុណ និងផលចែកនៃចំនួនសនិទាន' : p === 13 ? 'ស្វ័យគុណ' : p === 27 ? 'ទំហំសមាមាត្រនិងភាគរយ' : `ពីជគណិត ទំព័រ ${p}`,
      pageText: `គណិតវិទ្យា ថ្នាក់ទី៨. ពីជគណិត ទំព័រ ${p}.`,
      classificationConfidence: 0.96,
      classificationStatus: 'CONFIRMED',
      classificationEvidence: [`Printed page ${p} in footer`, 'Khmer Mathematics Grade 8 textbook', 'Algebra formulas and problems'],
      mappingStatus: 'MATCHED',
    });
  }

  // Geometry pages 142 - 144 (PDF 214 - 216)
  const geomTopics: Record<number, string> = {
    142: 'លក្ខខណ្ឌនៃត្រីកោណប៉ុនគ្នា (ម.ជ.ម)',
    143: 'ទ្រឹស្តីបទត្រីកោណប៉ុនគ្នា',
    144: 'លក្ខខណ្ឌ (ជ.ម.ជ)',
  };
  [142, 143, 144].forEach((p, idx) => {
    const pdfPage = 214 + idx;
    pages.push({
      sourceFileId: srcId,
      pdfPage,
      detectedSubjectId: 'kh_algebra_geometry',
      detectedSubjectName: 'Khmer Algebra/Geometry',
      detectedBookTitle: 'ពីជគណិត និងធរណីមាត្រ ថ្នាក់ទី៨',
      detectedSourceType: 'Textbook',
      printedPage: p,
      sectionTitle: 'ធរណីមាត្រ ជំពូកទី២',
      unitTitle: 'ធរណីមាត្រ',
      topic: geomTopics[p],
      pageText: `គណិតវិទ្យា ថ្នាក់ទី៨. ធរណីមាត្រ ទំព័រ ${p}. ${geomTopics[p]}.`,
      classificationConfidence: 0.96,
      classificationStatus: 'CONFIRMED',
      classificationEvidence: [`Printed page ${p} in footer`, 'Triangle congruence theorem diagrams', 'Geometry textbook section'],
      mappingStatus: 'MATCHED',
    });
  });

  // 12. Khmer Civic in Social Studies (PDF 217 - 250, printed pages 176 - 208)
  pages.push({
    sourceFileId: srcId,
    pdfPage: 217,
    detectedSubjectId: 'kh_civic',
    detectedSubjectName: 'Khmer Civic',
    detectedBookTitle: 'សិក្សាសង្គម ថ្នាក់ទី៨',
    detectedSourceType: 'Textbook',
    printedPage: null,
    sectionTitle: 'Cover',
    unitTitle: null,
    topic: 'Social Studies Grade 8 Cover',
    pageText: 'ក្រសួងអប់រំ យុវជន និងកីឡា. សិក្សាសង្គម ថ្នាក់ទី៨.',
    classificationConfidence: 0.98,
    classificationStatus: 'CONFIRMED',
    classificationEvidence: ['MoEYS Grade 8 Social Studies Textbook Cover'],
    mappingStatus: 'UNMAPPED',
  });

  const civicTopics: Record<number, string> = {
    176: 'មេរៀនទី៣: ភាពស្មោះត្រង់និងមិត្តភាព',
    177: 'និយមន័យភាពស្មោះត្រង់ និងផលប្រយោជន៍',
    178: 'ភាពមិនស្មោះត្រង់ និងផលអាក្រក់',
    179: 'ការសេពគប់មិត្តភក្តិ',
    180: 'បាបមិត្ត (មិត្តអាក្រក់)',
    181: 'សំណួរពិចារណាលើមិត្តភាព',
    182: 'មេរៀនទី៤: ភាពស្មើគ្នានៃមិត្តភាព',
    183: 'មូលហេតុនៃទំនាស់',
    184: 'ផលវិបាកនៃទំនាស់ និងការកាត់បន្ថយទំនាស់',
    185: 'ទំនាក់ទំនងមិត្តភាព (ការគោរពសិទ្ធិ)',
    186: 'ទំនួលខុសត្រូវក្នុងសង្គម',
    187: 'សារៈសំខាន់នៃចំណងមិត្តភាព',
    188: 'សំណួរបញ្ចប់ជំពូកទី១',
    189: 'សំណួរពហុជ្រើសរើស (MCQ)',
    190: 'សំណួរពិភាក្សា',
    191: 'ជំពូកទី២: ចំណងទាក់ទងក្នុងគ្រួសារ',
    192: 'មេរៀនទី១: ឯកភាពក្នុងគ្រួសារ',
    193: 'ធនធាននិងទំហំនៃគ្រួសារ',
    194: 'គ្រួសារតូច និងគ្រួសារធំ',
    195: 'ក្រមសីលធម៌ក្នុងគ្រួសារ',
    196: 'តម្លៃនៃគ្រួសារ',
    197: 'សំណួរពិចារណាលើគ្រួសារ',
    198: 'មេរៀនទី២: ភាពសុខដុមក្នុងគ្រួសារ',
    199: 'សុខដុម និងការរួមរស់ជាមួយគ្នាក្នុងគ្រួសារ',
    200: 'ដំណោះស្រាយទំនាស់ក្នុងគ្រួសារ',
    201: 'វិធីសម្រាកចិត្តកាយ',
    202: 'សេចក្តីសុខក្នុងគ្រួសារ',
    203: 'សំណួរបញ្ចប់ជំពូកទី២',
    204: 'សំណួរត្រិះរិះ និងផ្គូផ្គង',
    205: 'ជំពូកទី៣: ការរស់នៅក្នុងសហគមន៍',
    206: 'មេរៀនទី១: សុវត្ថិភាពក្នុងសហគមន៍',
    207: 'ប្រភេទនៃអាវុធជាតិផ្ទុះ',
    208: 'ផលប៉ះពាល់ និងការចៀសវាងគ្រោះថ្នាក់ដោយសារគ្រាប់មីន',
  };

  for (let p = 176; p <= 208; p++) {
    const pdfPage = 218 + (p - 176);
    pages.push({
      sourceFileId: srcId,
      pdfPage,
      detectedSubjectId: 'kh_civic',
      detectedSubjectName: 'Khmer Civic',
      detectedBookTitle: 'ពលរដ្ឋវិជ្ជា ថ្នាក់ទី៨',
      detectedSourceType: 'Textbook',
      printedPage: p,
      sectionTitle: 'ពលរដ្ឋវិជ្ជា ថ្នាក់ទី៨',
      unitTitle: p <= 190 ? 'ជំពូកទី១' : p <= 204 ? 'ជំពូកទី២' : 'ជំពូកទី៣',
      topic: civicTopics[p] || `ពលរដ្ឋវិទ្យា ទំព័រ ${p}`,
      pageText: `ពលរដ្ឋវិជ្ជា ថ្នាក់ទី៨ (សិក្សាសង្គម). ទំព័រ ${p}. ${civicTopics[p] || ''}.`,
      classificationConfidence: 0.96,
      classificationStatus: 'CONFIRMED',
      classificationEvidence: [`Printed Khmer page ${p} in footer`, 'MoEYS Civic Education (Social Studies) curriculum', civicTopics[p] || ''],
      mappingStatus: 'MATCHED',
    });
  }

  return pages;
}

export function buildUploadedGrade8Boundaries(): SourceBoundary[] {
  const srcId = UPLOADED_GRADE_8_SOURCE_FILE.sourceFileId;
  return [
    {
      id: `bnd-1`,
      sourceFileId: srcId,
      startPdfPage: 1,
      endPdfPage: 1,
      detectedSubjectId: 'english',
      detectedSubjectName: 'English',
      detectedBookTitle: 'Oxford Discover Futures 3 Workbook (Cover)',
      sourceType: 'Workbook',
      unitChapter: 'Cover',
      confidence: 0.98,
    },
    {
      id: `bnd-2`,
      sourceFileId: srcId,
      startPdfPage: 2,
      endPdfPage: 5,
      detectedSubjectId: 'english',
      detectedSubjectName: 'English',
      detectedBookTitle: 'Oxford Discover Futures 3 Student Book',
      sourceType: 'Student Book',
      unitChapter: 'Unit 1: What connects us?',
      confidence: 0.96,
    },
    {
      id: `bnd-3`,
      sourceFileId: srcId,
      startPdfPage: 6,
      endPdfPage: 10,
      detectedSubjectId: 'english',
      detectedSubjectName: 'English',
      detectedBookTitle: 'Oxford Discover Futures 3 Workbook',
      sourceType: 'Workbook',
      unitChapter: 'Units 1-3 Practice',
      confidence: 0.95,
    },
    {
      id: `bnd-4`,
      sourceFileId: srcId,
      startPdfPage: 11,
      endPdfPage: 23,
      detectedSubjectId: 'science',
      detectedSubjectName: 'Science',
      detectedBookTitle: 'Oxford Science Student Book 8',
      sourceType: 'Student Book',
      unitChapter: 'Chapters 1-2 Biology',
      confidence: 0.96,
    },
    {
      id: `bnd-5`,
      sourceFileId: srcId,
      startPdfPage: 24,
      endPdfPage: 29,
      detectedSubjectId: 'science',
      detectedSubjectName: 'Science',
      detectedBookTitle: 'Oxford Science Workbook 8',
      sourceType: 'Workbook',
      unitChapter: 'Workbook Practical Exercises',
      confidence: 0.95,
    },
    {
      id: `bnd-6`,
      sourceFileId: srcId,
      startPdfPage: 30,
      endPdfPage: 109,
      detectedSubjectId: 'mathematics',
      detectedSubjectName: 'Mathematics',
      detectedBookTitle: 'Oxford Mathematics Student Book 8',
      sourceType: 'Student Book',
      unitChapter: 'Chapters 1-3 (Estimation, Equations, Sequences)',
      confidence: 0.96,
    },
    {
      id: `bnd-7`,
      sourceFileId: srcId,
      startPdfPage: 110,
      endPdfPage: 133,
      detectedSubjectId: 'kh_literature',
      detectedSubjectName: 'Khmer Literature',
      detectedBookTitle: 'ភាសាខ្មែរ ថ្នាក់ទី៨ (ក្រសួងអប់រំ)',
      sourceType: 'Textbook',
      unitChapter: 'មេរៀនទី១ & មេរៀនទី២',
      confidence: 0.96,
    },
    {
      id: `bnd-8`,
      sourceFileId: srcId,
      startPdfPage: 134,
      endPdfPage: 150,
      detectedSubjectId: 'kh_physics',
      detectedSubjectName: 'Khmer Physics',
      detectedBookTitle: 'រូបវិទ្យា ថ្នាក់ទី៨ (ក្រសួងអប់រំ)',
      sourceType: 'Textbook',
      unitChapter: 'រូបវិទ្យា ជំពូកទី១: ល្បឿន និងសំទុះ',
      confidence: 0.96,
    },
    {
      id: `bnd-9`,
      sourceFileId: srcId,
      startPdfPage: 151,
      endPdfPage: 161,
      detectedSubjectId: 'kh_chemistry',
      detectedSubjectName: 'Khmer Chemistry',
      detectedBookTitle: 'គីមីវិទ្យា ថ្នាក់ទី៨ (ក្រសួងអប់រំ)',
      sourceType: 'Textbook',
      unitChapter: 'គីមីវិទ្យា ជំពូកទី១: អាតូម និងរូបមន្តគីមី',
      confidence: 0.96,
    },
    {
      id: `bnd-10`,
      sourceFileId: srcId,
      startPdfPage: 162,
      endPdfPage: 180,
      detectedSubjectId: 'kh_biology',
      detectedSubjectName: 'Khmer Biology',
      detectedBookTitle: 'ជីវវិទ្យា ថ្នាក់ទី៨ (ក្រសួងអប់រំ)',
      sourceType: 'Textbook',
      unitChapter: 'ជីវវិទ្យា ជំពូកទី១: សត្វល្អិតចង្រៃ និងការថែរក្សាដំណាំ',
      confidence: 0.96,
    },
    {
      id: `bnd-11`,
      sourceFileId: srcId,
      startPdfPage: 181,
      endPdfPage: 216,
      detectedSubjectId: 'kh_algebra_geometry',
      detectedSubjectName: 'Khmer Algebra/Geometry',
      detectedBookTitle: 'ពីជគណិត និងធរណីមាត្រ ថ្នាក់ទី៨ (ក្រសួងអប់រំ)',
      sourceType: 'Textbook',
      unitChapter: 'ពីជគណិត (pp. 9-41) & ធរណីមាត្រ (pp. 142-144)',
      confidence: 0.96,
    },
    {
      id: `bnd-12`,
      sourceFileId: srcId,
      startPdfPage: 217,
      endPdfPage: 250,
      detectedSubjectId: 'kh_civic',
      detectedSubjectName: 'Khmer Civic',
      detectedBookTitle: 'ពលរដ្ឋវិជ្ជា ថ្នាក់ទី៨ ក្នុងសិក្សាសង្គម (ក្រសួងអប់រំ)',
      sourceType: 'Textbook',
      unitChapter: 'ពលរដ្ឋវិជ្ជា ជំពូកទី១, ២, ៣ (pp. 176-208)',
      confidence: 0.96,
    },
  ];
}
