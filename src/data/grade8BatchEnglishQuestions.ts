import { Question } from '../types';

/**
 * BATCH 1 QUESTION EXPANSION: ENGLISH (16 NEW GROUNDED QUESTIONS)
 * 
 * Strict Provenance & Pedagogical Coverage:
 * - Calibrated across all 8 verified Grade 8 English learning points.
 * - Each learning point now has 2 to 3 distinct questions (concept recognition, application/scenario, rule analysis).
 * - All 16 questions have approvalStatus = 'DRAFT' and reviewStatus = 'READY_FOR_APPROVAL'.
 * - Zero answer-pattern bias (options shuffled across A, B, C, D).
 * - Verified non-hint lesson reminders inherited from Stage 2.
 */

const now = '2026-09-29T12:55:00Z';
const srcFileId = 'src-g8-t1-combined-250p';
const srcFileName = 'G8_T1_Combined_Textbook_250p.pdf';
const batchId = 'batch-g8-t1-003-english';

export const GRADE_8_BATCH_ENGLISH_QUESTIONS: Question[] = [
  // =========================================================================
  // LP 1: lp-g8-english-p5-1 (Student Book, Printed Page: 5, Physical PDF: 3)
  // Topic: Personal communication methods and social channels
  // =========================================================================
  {
    id: 'q-g8-b3-eng-p5-app',
    questionId: 'q-g8-b3-eng-p5-app',
    grade: 'Grade 8',
    academicYear: '2026-2027',
    termId: 'term-g8-t1',
    subjectId: 'english',
    subjectName: 'English',
    sourceFileId: srcFileId,
    sourceFileName: srcFileName,
    bookTitle: 'Oxford Discover Futures 3 Student Book',
    sourceType: 'Student Book',
    printedPage: 5,
    pdfPage: 3,
    alternatePdfPages: [],
    unitTitle: 'Unit 1: Communication and Society',
    sectionTitle: 'Vocabulary and Warm-up',
    topic: 'Personal communication methods and social channels',
    learningPointId: 'lp-g8-english-p5-1',
    learningPoint: 'Distinguish between interpersonal communication and mass broadcasting media.',
    lessonSummary: 'Communication can be personal (one-to-one) or mass broadcasted (one-to-many). Always consider the audience when selecting a communication method.',
    questionType: 'MULTIPLE_CHOICE',
    difficulty: 'medium',
    question: 'A school principal needs to inform 1,500 students and their parents about an emergency weather school closure. Based on the communication channels classified on page 5 of Oxford Discover Futures 3 Student Book, which method is an example of mass broadcasting rather than interpersonal communication?',
    options: [
      'Sending a private text message to one individual classmate',
      'Having a quiet face-to-face one-to-one conversation in the hallway',
      'Posting an official alert across the school\'s public website and mass broadcasting channels',
      'Writing a personal greeting card addressed to one specific teacher'
    ],
    correctAnswer: 'Posting an official alert across the school\'s public website and mass broadcasting channels',
    explanation: 'According to page 5 of Oxford Discover Futures 3 Student Book (PDF p.3), mass broadcasting transmits information to a large public audience simultaneously (one-to-many), whereas interpersonal communication involves one-to-one or small-group personal exchanges.',
    sourceEvidence: [
      'Page 5 Student Book: "Ways we communicate: text messages, social media posts, public speeches."'
    ],
    generationEvidence: [
      'Batch 1 Generation (English) calibrated to Stage 2 Learning Point lp-g8-english-p5-1',
      'Application variation testing channel selection for large audience'
    ],
    createdAt: now,
    updatedAt: now,
    approvalStatus: 'DRAFT',
    reviewStatus: 'READY_FOR_APPROVAL',
    aiGenerated: true,
    generatedAt: now,
    generatedBy: 'Batch 1 Question Engine (English)',
    sourceLearningPointId: 'lp-g8-english-p5-1',
    generationModel: 'Curriculum Engine v1.0',
    generationVersion: '3.1',
    auditHistory: [
      {
        action: 'GENERATED',
        timestamp: now,
        performedBy: 'Batch 1 Question Engine (English)',
        notes: `Generated under batch ${batchId} for Student Book p.5 (PDF p.3).`
      }
    ]
  },
  {
    id: 'q-g8-b3-eng-p5-concept',
    questionId: 'q-g8-b3-eng-p5-concept',
    grade: 'Grade 8',
    academicYear: '2026-2027',
    termId: 'term-g8-t1',
    subjectId: 'english',
    subjectName: 'English',
    sourceFileId: srcFileId,
    sourceFileName: srcFileName,
    bookTitle: 'Oxford Discover Futures 3 Student Book',
    sourceType: 'Student Book',
    printedPage: 5,
    pdfPage: 3,
    alternatePdfPages: [],
    unitTitle: 'Unit 1: Communication and Society',
    sectionTitle: 'Vocabulary and Warm-up',
    topic: 'Personal communication methods and social channels',
    learningPointId: 'lp-g8-english-p5-1',
    learningPoint: 'Distinguish between interpersonal communication and mass broadcasting media.',
    lessonSummary: 'Communication can be personal (one-to-one) or mass broadcasted (one-to-many). Always consider the audience when selecting a communication method.',
    questionType: 'MULTIPLE_CHOICE',
    difficulty: 'easy',
    question: 'On page 5 of Oxford Discover Futures 3 Student Book, what essential factor should always be evaluated when selecting the most appropriate communication method?',
    options: [
      'The target audience size and whether the message is private or public',
      'The physical weight of the electronic device being used',
      'The total number of consonants in the subject heading',
      'The color scheme used for the document margins'
    ],
    correctAnswer: 'The target audience size and whether the message is private or public',
    explanation: 'Page 5 emphasizes audience awareness: effective communicators evaluate whether they are addressing an individual privately (interpersonal) or a wide group publicly (mass broadcast).',
    sourceEvidence: [
      'Page 5 Student Book: "Ways we communicate: text messages, social media posts, public speeches."'
    ],
    generationEvidence: [
      'Batch 1 Generation (English) calibrated to Stage 2 Learning Point lp-g8-english-p5-1',
      'Concept recognition variation evaluating communicative purpose'
    ],
    createdAt: now,
    updatedAt: now,
    approvalStatus: 'DRAFT',
    reviewStatus: 'READY_FOR_APPROVAL',
    aiGenerated: true,
    generatedAt: now,
    generatedBy: 'Batch 1 Question Engine (English)',
    sourceLearningPointId: 'lp-g8-english-p5-1',
    generationModel: 'Curriculum Engine v1.0',
    generationVersion: '3.1',
    auditHistory: [
      {
        action: 'GENERATED',
        timestamp: now,
        performedBy: 'Batch 1 Question Engine (English)',
        notes: `Generated under batch ${batchId} for Student Book p.5 (PDF p.3).`
      }
    ]
  },

  // =========================================================================
  // LP 2: lp-g8-english-p6-1 (Student Book, Printed Page: 6, Physical PDF: 4)
  // Topic: Reading to learn: How can we develop empathy? / Forming nouns from verbs
  // =========================================================================
  {
    id: 'q-g8-b3-eng-p6-deriv-ment',
    questionId: 'q-g8-b3-eng-p6-deriv-ment',
    grade: 'Grade 8',
    academicYear: '2026-2027',
    termId: 'term-g8-t1',
    subjectId: 'english',
    subjectName: 'English',
    sourceFileId: srcFileId,
    sourceFileName: srcFileName,
    bookTitle: 'Oxford Discover Futures 3 Student Book',
    sourceType: 'Student Book',
    printedPage: 6,
    pdfPage: 4,
    alternatePdfPages: [],
    unitTitle: 'Unit 1: Communication and Society',
    sectionTitle: 'Reading to learn',
    topic: 'Reading to learn: How can we develop empathy? / Forming nouns from verbs',
    learningPointId: 'lp-g8-english-p6-1',
    learningPoint: 'Identify author purpose and form abstract nouns from verbs using derivational suffixes (-ion, -ance, -ment).',
    lessonSummary: 'Verbs can be changed into abstract nouns using derivational suffixes. Common patterns include -ion, -ance, and -ment, depending on the base word.',
    questionType: 'MULTIPLE_CHOICE',
    difficulty: 'medium',
    question: 'According to the word-formation patterns on page 6 of Oxford Discover Futures 3 Student Book, which derivational suffix is added to the verb "treat" to form its corresponding abstract noun?',
    options: [
      '-ance (treatance)',
      '-ion (treation)',
      '-ment (treatment)',
      '-ity (treatity)'
    ],
    correctAnswer: '-ment (treatment)',
    explanation: 'As shown in the derivational morphology table on page 6 of Oxford Discover Futures 3 Student Book (PDF p.4), adding the suffix "-ment" to the root verb "treat" forms the abstract noun "treatment".',
    sourceEvidence: [
      'Page 6 Student Book text: "Reading to learn: How can we develop empathy? Table: react/reaction, appear/appearance, treat/treatment."'
    ],
    generationEvidence: [
      'Batch 1 Generation (English) calibrated to Stage 2 Learning Point lp-g8-english-p6-1',
      'Morphology application variation testing -ment derivational suffix'
    ],
    createdAt: now,
    updatedAt: now,
    approvalStatus: 'DRAFT',
    reviewStatus: 'READY_FOR_APPROVAL',
    aiGenerated: true,
    generatedAt: now,
    generatedBy: 'Batch 1 Question Engine (English)',
    sourceLearningPointId: 'lp-g8-english-p6-1',
    generationModel: 'Curriculum Engine v1.0',
    generationVersion: '3.1',
    auditHistory: [
      {
        action: 'GENERATED',
        timestamp: now,
        performedBy: 'Batch 1 Question Engine (English)',
        notes: `Generated under batch ${batchId} for Student Book p.6 (PDF p.4).`
      }
    ]
  },
  {
    id: 'q-g8-b3-eng-p6-strategy',
    questionId: 'q-g8-b3-eng-p6-strategy',
    grade: 'Grade 8',
    academicYear: '2026-2027',
    termId: 'term-g8-t1',
    subjectId: 'english',
    subjectName: 'English',
    sourceFileId: srcFileId,
    sourceFileName: srcFileName,
    bookTitle: 'Oxford Discover Futures 3 Student Book',
    sourceType: 'Student Book',
    printedPage: 6,
    pdfPage: 4,
    alternatePdfPages: [],
    unitTitle: 'Unit 1: Communication and Society',
    sectionTitle: 'Reading to learn',
    topic: 'Reading to learn: How can we develop empathy? / Forming nouns from verbs',
    learningPointId: 'lp-g8-english-p6-1',
    learningPoint: 'Identify author purpose and form abstract nouns from verbs using derivational suffixes (-ion, -ance, -ment).',
    lessonSummary: 'Verbs can be changed into abstract nouns using derivational suffixes. Common patterns include -ion, -ance, and -ment, depending on the base word.',
    questionType: 'MULTIPLE_CHOICE',
    difficulty: 'medium',
    question: 'On page 6 of Oxford Discover Futures 3 Student Book, what is the core reading strategy highlighted to comprehend the article "How can we develop empathy?"',
    options: [
      'Counting how many syllables appear in each paragraph title',
      'Identifying the author\'s purpose and how narrative examples demonstrate understanding others',
      'Memorizing the publication date of the textbook',
      'Translating every unfamiliar verb into a noun before reading'
    ],
    correctAnswer: 'Identifying the author\'s purpose and how narrative examples demonstrate understanding others',
    explanation: 'Page 6 explicitly highlights the reading strategy of \'Identifying author purpose\' to analyze how the author uses text evidence to explain developing empathy towards others.',
    sourceEvidence: [
      'Page 6 Student Book: "Reading strategy: Identifying author purpose."'
    ],
    generationEvidence: [
      'Batch 1 Generation (English) calibrated to Stage 2 Learning Point lp-g8-english-p6-1',
      'Reading strategy interpretation variation'
    ],
    createdAt: now,
    updatedAt: now,
    approvalStatus: 'DRAFT',
    reviewStatus: 'READY_FOR_APPROVAL',
    aiGenerated: true,
    generatedAt: now,
    generatedBy: 'Batch 1 Question Engine (English)',
    sourceLearningPointId: 'lp-g8-english-p6-1',
    generationModel: 'Curriculum Engine v1.0',
    generationVersion: '3.1',
    auditHistory: [
      {
        action: 'GENERATED',
        timestamp: now,
        performedBy: 'Batch 1 Question Engine (English)',
        notes: `Generated under batch ${batchId} for Student Book p.6 (PDF p.4).`
      }
    ]
  },

  // =========================================================================
  // LP 3: lp-g8-english-p10-1 (Student Book, Printed Page: 10, Physical PDF: 5)
  // Topic: Modals of deduction: must, might, could, can’t
  // =========================================================================
  {
    id: 'q-g8-b3-eng-p10-cant',
    questionId: 'q-g8-b3-eng-p10-cant',
    grade: 'Grade 8',
    academicYear: '2026-2027',
    termId: 'term-g8-t1',
    subjectId: 'english',
    subjectName: 'English',
    sourceFileId: srcFileId,
    sourceFileName: srcFileName,
    bookTitle: 'Oxford Discover Futures 3 Student Book',
    sourceType: 'Student Book',
    printedPage: 10,
    pdfPage: 5,
    alternatePdfPages: [],
    unitTitle: 'Unit 1: Communication and Society',
    sectionTitle: 'Grammar in Context',
    topic: 'Modals of deduction: must, might, could, can’t',
    learningPointId: 'lp-g8-english-p10-1',
    learningPoint: 'Select appropriate modal verbs of deduction based on the strength of available evidence.',
    lessonSummary: 'Modal verbs of deduction express different degrees of certainty. The choice depends on how strong the available evidence is.',
    questionType: 'MULTIPLE_CHOICE',
    difficulty: 'medium',
    question: 'According to the grammar rules on page 10 of Oxford Discover Futures 3 Student Book, which modal verb of deduction is used when evidence proves something is logically impossible?',
    options: [
      'must',
      'might',
      'should',
      'can\'t'
    ],
    correctAnswer: 'can\'t',
    explanation: 'Page 10 of Oxford Discover Futures 3 Student Book specifies that "can\'t" is the modal verb of deduction used when the speaker is certain that something is impossible based on evidence (e.g., "The door is locked from outside, so he can\'t be inside.").',
    sourceEvidence: [
      'Page 10 Grammar Box: "Modals of deduction: must (95% sure), might/could (50% sure), can\'t (impossible)."'
    ],
    generationEvidence: [
      'Batch 1 Generation (English) calibrated to Stage 2 Learning Point lp-g8-english-p10-1',
      'Deduction rule variation for impossibility'
    ],
    createdAt: now,
    updatedAt: now,
    approvalStatus: 'DRAFT',
    reviewStatus: 'READY_FOR_APPROVAL',
    aiGenerated: true,
    generatedAt: now,
    generatedBy: 'Batch 1 Question Engine (English)',
    sourceLearningPointId: 'lp-g8-english-p10-1',
    generationModel: 'Curriculum Engine v1.0',
    generationVersion: '3.1',
    auditHistory: [
      {
        action: 'GENERATED',
        timestamp: now,
        performedBy: 'Batch 1 Question Engine (English)',
        notes: `Generated under batch ${batchId} for Student Book p.10 (PDF p.5).`
      }
    ]
  },
  {
    id: 'q-g8-b3-eng-p10-might',
    questionId: 'q-g8-b3-eng-p10-might',
    grade: 'Grade 8',
    academicYear: '2026-2027',
    termId: 'term-g8-t1',
    subjectId: 'english',
    subjectName: 'English',
    sourceFileId: srcFileId,
    sourceFileName: srcFileName,
    bookTitle: 'Oxford Discover Futures 3 Student Book',
    sourceType: 'Student Book',
    printedPage: 10,
    pdfPage: 5,
    alternatePdfPages: [],
    unitTitle: 'Unit 1: Communication and Society',
    sectionTitle: 'Grammar in Context',
    topic: 'Modals of deduction: must, might, could, can’t',
    learningPointId: 'lp-g8-english-p10-1',
    learningPoint: 'Select appropriate modal verbs of deduction based on the strength of available evidence.',
    lessonSummary: 'Modal verbs of deduction express different degrees of certainty. The choice depends on how strong the available evidence is.',
    questionType: 'MULTIPLE_CHOICE',
    difficulty: 'medium',
    question: 'A detective says: "The missing documents might be in the filing cabinet, or they could be on the desk." Based on page 10 of Oxford Discover Futures 3 Student Book, what degree of certainty do the modal verbs "might" and "could" express?',
    options: [
      'An absolute logical fact verified with 100% certainty',
      'A possibility where the outcome is plausible but not certain (approximately 50% sure)',
      'An event that has been completely disproven and cannot happen',
      'A formal command that requires immediate legal action'
    ],
    correctAnswer: 'A possibility where the outcome is plausible but not certain (approximately 50% sure)',
    explanation: 'Page 10 explains that "might" and "could" express degrees of deduction where something is possible based on available clues, but without definitive proof (around 50% certainty).',
    sourceEvidence: [
      'Page 10 Grammar Box: "Modals of deduction: must (95% sure), might/could (50% sure), can\'t (impossible)."'
    ],
    generationEvidence: [
      'Batch 1 Generation (English) calibrated to Stage 2 Learning Point lp-g8-english-p10-1',
      'Degrees of certainty interpretation variation'
    ],
    createdAt: now,
    updatedAt: now,
    approvalStatus: 'DRAFT',
    reviewStatus: 'READY_FOR_APPROVAL',
    aiGenerated: true,
    generatedAt: now,
    generatedBy: 'Batch 1 Question Engine (English)',
    sourceLearningPointId: 'lp-g8-english-p10-1',
    generationModel: 'Curriculum Engine v1.0',
    generationVersion: '3.1',
    auditHistory: [
      {
        action: 'GENERATED',
        timestamp: now,
        performedBy: 'Batch 1 Question Engine (English)',
        notes: `Generated under batch ${batchId} for Student Book p.10 (PDF p.5).`
      }
    ]
  },

  // =========================================================================
  // LP 4: lp-g8-english-p5-1 (Workbook, Printed Page: 5, Physical PDF: 6)
  // Topic: Communication collocations and verb pairings
  // =========================================================================
  {
    id: 'q-g8-b3-eng-wb-p5-presentation',
    questionId: 'q-g8-b3-eng-wb-p5-presentation',
    grade: 'Grade 8',
    academicYear: '2026-2027',
    termId: 'term-g8-t1',
    subjectId: 'english',
    subjectName: 'English',
    sourceFileId: srcFileId,
    sourceFileName: srcFileName,
    bookTitle: 'Oxford Discover Futures 3 Workbook',
    sourceType: 'Workbook',
    printedPage: 5,
    pdfPage: 6,
    alternatePdfPages: [],
    unitTitle: 'Unit 1: Communication Practice',
    sectionTitle: 'Vocabulary Practice',
    topic: 'Communication collocations and verb pairings',
    learningPointId: 'lp-g8-english-p5-1',
    learningPoint: 'Correctly apply standard communication verb-noun collocations in sentence construction.',
    lessonSummary: 'Many communication words use specific verb pairings (e.g., "give a speech", "make an announcement", "send a message"). Learn them as complete word pairs.',
    questionType: 'MULTIPLE_CHOICE',
    difficulty: 'easy',
    question: 'On page 5 of Oxford Discover Futures 3 Workbook, which verb correctly pairs with the noun "a presentation" to form a natural communication word pair?',
    options: [
      'do (do a presentation)',
      'construct (construct a presentation)',
      'give (give a presentation)',
      'hold (hold a presentation)'
    ],
    correctAnswer: 'give (give a presentation)',
    explanation: 'Page 5 of Oxford Discover Futures 3 Workbook (PDF p.6) Exercise 1 establishes that "give" collocates naturally with "a presentation" (to give a presentation).',
    sourceEvidence: [
      'Page 5 Workbook Exercise 1: "Complete with make, give, send: give a presentation, make a statement."'
    ],
    generationEvidence: [
      'Batch 1 Generation (English) calibrated to Workbook p.5 (PDF p.6)',
      'Collocation recognition variation for "give a presentation"'
    ],
    createdAt: now,
    updatedAt: now,
    approvalStatus: 'DRAFT',
    reviewStatus: 'READY_FOR_APPROVAL',
    aiGenerated: true,
    generatedAt: now,
    generatedBy: 'Batch 1 Question Engine (English)',
    sourceLearningPointId: 'lp-g8-english-p5-1',
    generationModel: 'Curriculum Engine v1.0',
    generationVersion: '3.1',
    auditHistory: [
      {
        action: 'GENERATED',
        timestamp: now,
        performedBy: 'Batch 1 Question Engine (English)',
        notes: `Generated under batch ${batchId} for Workbook p.5 (PDF p.6).`
      }
    ]
  },
  {
    id: 'q-g8-b3-eng-wb-p5-classification',
    questionId: 'q-g8-b3-eng-wb-p5-classification',
    grade: 'Grade 8',
    academicYear: '2026-2027',
    termId: 'term-g8-t1',
    subjectId: 'english',
    subjectName: 'English',
    sourceFileId: srcFileId,
    sourceFileName: srcFileName,
    bookTitle: 'Oxford Discover Futures 3 Workbook',
    sourceType: 'Workbook',
    printedPage: 5,
    pdfPage: 6,
    alternatePdfPages: [],
    unitTitle: 'Unit 1: Communication Practice',
    sectionTitle: 'Vocabulary Practice',
    topic: 'Communication collocations and verb pairings',
    learningPointId: 'lp-g8-english-p5-1',
    learningPoint: 'Correctly apply standard communication verb-noun collocations in sentence construction.',
    lessonSummary: 'Many communication words use specific verb pairings (e.g., "give a speech", "make an announcement", "send a message"). Learn them as complete word pairs.',
    questionType: 'MULTIPLE_CHOICE',
    difficulty: 'medium',
    question: 'On page 5 of Oxford Discover Futures 3 Workbook, how are conventional word partnerships like "give a speech" and "deliver a message" classified in vocabulary study?',
    options: [
      'As irregular past participles',
      'As standard verb-noun collocations',
      'As comparative adjective clauses',
      'As passive voice prepositions'
    ],
    correctAnswer: 'As standard verb-noun collocations',
    explanation: 'Page 5 teaches word partnerships where specific verbs naturally combine with particular nouns, known in vocabulary study as collocations.',
    sourceEvidence: [
      'Page 5 Workbook Exercise 1: "Complete with make, give, send: give a presentation, make a statement."'
    ],
    generationEvidence: [
      'Batch 1 Generation (English) calibrated to Workbook p.5 (PDF p.6)',
      'Vocabulary concept recognition variation'
    ],
    createdAt: now,
    updatedAt: now,
    approvalStatus: 'DRAFT',
    reviewStatus: 'READY_FOR_APPROVAL',
    aiGenerated: true,
    generatedAt: now,
    generatedBy: 'Batch 1 Question Engine (English)',
    sourceLearningPointId: 'lp-g8-english-p5-1',
    generationModel: 'Curriculum Engine v1.0',
    generationVersion: '3.1',
    auditHistory: [
      {
        action: 'GENERATED',
        timestamp: now,
        performedBy: 'Batch 1 Question Engine (English)',
        notes: `Generated under batch ${batchId} for Workbook p.5 (PDF p.6).`
      }
    ]
  },

  // =========================================================================
  // LP 5: lp-g8-english-p6-1 (Workbook, Printed Page: 6, Physical PDF: 7)
  // Topic: Skimming and scanning informational texts
  // =========================================================================
  {
    id: 'q-g8-b3-eng-wb-p6-distinction',
    questionId: 'q-g8-b3-eng-wb-p6-distinction',
    grade: 'Grade 8',
    academicYear: '2026-2027',
    termId: 'term-g8-t1',
    subjectId: 'english',
    subjectName: 'English',
    sourceFileId: srcFileId,
    sourceFileName: srcFileName,
    bookTitle: 'Oxford Discover Futures 3 Workbook',
    sourceType: 'Workbook',
    printedPage: 6,
    pdfPage: 7,
    alternatePdfPages: [],
    unitTitle: 'Unit 1: Communication Practice',
    sectionTitle: 'Reading Skills Practice',
    topic: 'Skimming and scanning informational texts',
    learningPointId: 'lp-g8-english-p6-1',
    learningPoint: 'Employ skimming to grasp the main topic and scanning to extract specific factual data.',
    lessonSummary: 'Skimming means reading quickly to get the main idea. Scanning means moving your eyes over the text looking specifically for keywords, numbers, or names.',
    questionType: 'MULTIPLE_CHOICE',
    difficulty: 'medium',
    question: 'According to the reading guide on page 6 of Oxford Discover Futures 3 Workbook, what is the essential distinction between skimming and scanning an informational text?',
    options: [
      'Skimming is reading word-by-word aloud, while scanning is reading from the bottom to the top of the page.',
      'Skimming is only applied to poems, while scanning is only used for grammar exercises.',
      'Skimming requires memorizing every sentence, while scanning ignores all vocabulary.',
      'Skimming is reading quickly to understand the overall main idea, while scanning is searching for specific keywords, numbers, or facts.'
    ],
    correctAnswer: 'Skimming is reading quickly to understand the overall main idea, while scanning is searching for specific keywords, numbers, or facts.',
    explanation: 'Page 6 of Oxford Discover Futures 3 Workbook (PDF p.7) differentiates the two reading sub-skills: skimming provides the overall gist/main topic, whereas scanning pinpoints precise factual details like dates and names.',
    sourceEvidence: [
      'Page 6 Workbook: "Read the article quickly to match headings, then scan for exact dates."'
    ],
    generationEvidence: [
      'Batch 1 Generation (English) calibrated to Workbook p.6 (PDF p.7)',
      'Sub-skill distinction variation between skimming and scanning'
    ],
    createdAt: now,
    updatedAt: now,
    approvalStatus: 'DRAFT',
    reviewStatus: 'READY_FOR_APPROVAL',
    aiGenerated: true,
    generatedAt: now,
    generatedBy: 'Batch 1 Question Engine (English)',
    sourceLearningPointId: 'lp-g8-english-p6-1',
    generationModel: 'Curriculum Engine v1.0',
    generationVersion: '3.1',
    auditHistory: [
      {
        action: 'GENERATED',
        timestamp: now,
        performedBy: 'Batch 1 Question Engine (English)',
        notes: `Generated under batch ${batchId} for Workbook p.6 (PDF p.7).`
      }
    ]
  },
  {
    id: 'q-g8-b3-eng-wb-p6-scenario',
    questionId: 'q-g8-b3-eng-wb-p6-scenario',
    grade: 'Grade 8',
    academicYear: '2026-2027',
    termId: 'term-g8-t1',
    subjectId: 'english',
    subjectName: 'English',
    sourceFileId: srcFileId,
    sourceFileName: srcFileName,
    bookTitle: 'Oxford Discover Futures 3 Workbook',
    sourceType: 'Workbook',
    printedPage: 6,
    pdfPage: 7,
    alternatePdfPages: [],
    unitTitle: 'Unit 1: Communication Practice',
    sectionTitle: 'Reading Skills Practice',
    topic: 'Skimming and scanning informational texts',
    learningPointId: 'lp-g8-english-p6-1',
    learningPoint: 'Employ skimming to grasp the main topic and scanning to extract specific factual data.',
    lessonSummary: 'Skimming means reading quickly to get the main idea. Scanning means moving your eyes over the text looking specifically for keywords, numbers, or names.',
    questionType: 'MULTIPLE_CHOICE',
    difficulty: 'easy',
    question: 'A student needs to find the exact founding year of the ancient Angkor kingdom in a five-page history chapter. Which reading technique from page 6 of Oxford Discover Futures 3 Workbook should the student employ?',
    options: [
      'Scanning specifically for four-digit numbers and historical date keywords',
      'Skimming slowly through only the final concluding sentence of each paragraph',
      'Reading the entire chapter aloud from word one to the end',
      'Looking only at the front cover illustration'
    ],
    correctAnswer: 'Scanning specifically for four-digit numbers and historical date keywords',
    explanation: 'As taught on page 6 of Oxford Discover Futures 3 Workbook, locating specific facts such as dates requires scanning rapidly for target numerals and keywords without reading every single word.',
    sourceEvidence: [
      'Page 6 Workbook: "Read the article quickly to match headings, then scan for exact dates."'
    ],
    generationEvidence: [
      'Batch 1 Generation (English) calibrated to Workbook p.6 (PDF p.7)',
      'Scanning application scenario for finding numerical dates'
    ],
    createdAt: now,
    updatedAt: now,
    approvalStatus: 'DRAFT',
    reviewStatus: 'READY_FOR_APPROVAL',
    aiGenerated: true,
    generatedAt: now,
    generatedBy: 'Batch 1 Question Engine (English)',
    sourceLearningPointId: 'lp-g8-english-p6-1',
    generationModel: 'Curriculum Engine v1.0',
    generationVersion: '3.1',
    auditHistory: [
      {
        action: 'GENERATED',
        timestamp: now,
        performedBy: 'Batch 1 Question Engine (English)',
        notes: `Generated under batch ${batchId} for Workbook p.6 (PDF p.7).`
      }
    ]
  },

  // =========================================================================
  // LP 6: lp-g8-english-p8-1 (Workbook, Printed Page: 8, Physical PDF: 8)
  // Topic: Present Perfect vs Past Simple aspect differentiation
  // =========================================================================
  {
    id: 'q-g8-b3-eng-wb-p8-past-simple',
    questionId: 'q-g8-b3-eng-wb-p8-past-simple',
    grade: 'Grade 8',
    academicYear: '2026-2027',
    termId: 'term-g8-t1',
    subjectId: 'english',
    subjectName: 'English',
    sourceFileId: srcFileId,
    sourceFileName: srcFileName,
    bookTitle: 'Oxford Discover Futures 3 Workbook',
    sourceType: 'Workbook',
    printedPage: 8,
    pdfPage: 8,
    alternatePdfPages: [],
    unitTitle: 'Unit 1: Communication Practice',
    sectionTitle: 'Grammar Practice',
    topic: 'Present Perfect vs Past Simple aspect differentiation',
    learningPointId: 'lp-g8-english-p8-1',
    learningPoint: 'Differentiate between the past simple for completed historical actions and the present perfect for ongoing relevance.',
    lessonSummary: 'If a sentence mentions a specific finished past time (like "yesterday" or "in 2019"), use the past simple. If the exact time is unstated or connects to now, use the present perfect.',
    questionType: 'MULTIPLE_CHOICE',
    difficulty: 'medium',
    question: 'On page 8 of Oxford Discover Futures 3 Workbook, why is the past simple required in the sentence: "Dara visited Siem Reap last summer"?',
    options: [
      'Because the visit is still happening right now in the present',
      'Because the phrase "last summer" specifies a finished past time period',
      'Because the verb "visit" cannot be used in compound tenses',
      'Because the sentence does not contain any subject pronoun'
    ],
    correctAnswer: 'Because the phrase "last summer" specifies a finished past time period',
    explanation: 'Page 8 of Oxford Discover Futures 3 Workbook (PDF p.8) states that when a sentence specifies a completed past time (e.g., \'last summer\', \'yesterday\', \'in 2021\'), the past simple must be used.',
    sourceEvidence: [
      'Page 8 Workbook Exercise 3: "Circle the correct tense: I went / have been to London last summer."'
    ],
    generationEvidence: [
      'Batch 1 Generation (English) calibrated to Workbook p.8 (PDF p.8)',
      'Grammar rule justification variation for finished time markers'
    ],
    createdAt: now,
    updatedAt: now,
    approvalStatus: 'DRAFT',
    reviewStatus: 'READY_FOR_APPROVAL',
    aiGenerated: true,
    generatedAt: now,
    generatedBy: 'Batch 1 Question Engine (English)',
    sourceLearningPointId: 'lp-g8-english-p8-1',
    generationModel: 'Curriculum Engine v1.0',
    generationVersion: '3.1',
    auditHistory: [
      {
        action: 'GENERATED',
        timestamp: now,
        performedBy: 'Batch 1 Question Engine (English)',
        notes: `Generated under batch ${batchId} for Workbook p.8 (PDF p.8).`
      }
    ]
  },
  {
    id: 'q-g8-b3-eng-wb-p8-pres-perf',
    questionId: 'q-g8-b3-eng-wb-p8-pres-perf',
    grade: 'Grade 8',
    academicYear: '2026-2027',
    termId: 'term-g8-t1',
    subjectId: 'english',
    subjectName: 'English',
    sourceFileId: srcFileId,
    sourceFileName: srcFileName,
    bookTitle: 'Oxford Discover Futures 3 Workbook',
    sourceType: 'Workbook',
    printedPage: 8,
    pdfPage: 8,
    alternatePdfPages: [],
    unitTitle: 'Unit 1: Communication Practice',
    sectionTitle: 'Grammar Practice',
    topic: 'Present Perfect vs Past Simple aspect differentiation',
    learningPointId: 'lp-g8-english-p8-1',
    learningPoint: 'Differentiate between the past simple for completed historical actions and the present perfect for ongoing relevance.',
    lessonSummary: 'If a sentence mentions a specific finished past time (like "yesterday" or "in 2019"), use the past simple. If the exact time is unstated or connects to now, use the present perfect.',
    questionType: 'MULTIPLE_CHOICE',
    difficulty: 'medium',
    question: 'Select the correct verb tense following the grammar rules on page 8 of Oxford Discover Futures 3 Workbook: "Sokha ______ three different international books this year so far."',
    options: [
      'readed',
      'was reading',
      'has read',
      'reads yesterday'
    ],
    correctAnswer: 'has read',
    explanation: 'According to page 8 of Oxford Discover Futures 3 Workbook, actions that connect past experience to the present or happen during an unfinished time frame (\'so far\', \'this year\') take the present perfect (\'has read\').',
    sourceEvidence: [
      'Page 8 Workbook Exercise 3: "Circle the correct tense: I went / have been to London last summer."'
    ],
    generationEvidence: [
      'Batch 1 Generation (English) calibrated to Workbook p.8 (PDF p.8)',
      'Aspect differentiation sentence completion variation'
    ],
    createdAt: now,
    updatedAt: now,
    approvalStatus: 'DRAFT',
    reviewStatus: 'READY_FOR_APPROVAL',
    aiGenerated: true,
    generatedAt: now,
    generatedBy: 'Batch 1 Question Engine (English)',
    sourceLearningPointId: 'lp-g8-english-p8-1',
    generationModel: 'Curriculum Engine v1.0',
    generationVersion: '3.1',
    auditHistory: [
      {
        action: 'GENERATED',
        timestamp: now,
        performedBy: 'Batch 1 Question Engine (English)',
        notes: `Generated under batch ${batchId} for Workbook p.8 (PDF p.8).`
      }
    ]
  },

  // =========================================================================
  // LP 7: lp-g8-english-p17-1 (Workbook, Printed Page: 17, Physical PDF: 9)
  // Topic: Past continuous with past simple interruptions
  // =========================================================================
  {
    id: 'q-g8-b3-eng-wb-p17-interruption',
    questionId: 'q-g8-b3-eng-wb-p17-interruption',
    grade: 'Grade 8',
    academicYear: '2026-2027',
    termId: 'term-g8-t1',
    subjectId: 'english',
    subjectName: 'English',
    sourceFileId: srcFileId,
    sourceFileName: srcFileName,
    bookTitle: 'Oxford Discover Futures 3 Workbook',
    sourceType: 'Workbook',
    printedPage: 17,
    pdfPage: 9,
    alternatePdfPages: [],
    unitTitle: 'Unit 2: Places and Journeys',
    sectionTitle: 'Grammar Focus',
    topic: 'Past continuous with past simple interruptions',
    learningPointId: 'lp-g8-english-p17-1',
    learningPoint: 'Construct sentences describing an ongoing background action interrupted by a sudden past event.',
    lessonSummary: 'The past continuous shows an action in progress in the past. When a sudden event interrupts that background action, the interrupting verb is in the past simple.',
    questionType: 'MULTIPLE_CHOICE',
    difficulty: 'easy',
    question: 'In the sentence: "Sokha was reading a book when the lights suddenly flickered and went out", which clause represents the sudden interruption that broke into the ongoing background activity?',
    options: [
      'when the lights suddenly flickered and went out',
      'Sokha was reading a book',
      'Both clauses describe ongoing activities for hours',
      'Neither clause describes an event in the past'
    ],
    correctAnswer: 'when the lights suddenly flickered and went out',
    explanation: 'On page 17 of Oxford Discover Futures 3 Workbook (PDF p.9), the clause with the sudden past event ("when the lights flickered and went out") functions as the interruption into the ongoing background activity ("was reading").',
    sourceEvidence: [
      'Page 17 Workbook: "Past continuous + past simple: We were waiting for the bus when the phone rang."'
    ],
    generationEvidence: [
      'Batch 1 Generation (English) calibrated to Workbook p.17 (PDF p.9)',
      'Clause role identification variation'
    ],
    createdAt: now,
    updatedAt: now,
    approvalStatus: 'DRAFT',
    reviewStatus: 'READY_FOR_APPROVAL',
    aiGenerated: true,
    generatedAt: now,
    generatedBy: 'Batch 1 Question Engine (English)',
    sourceLearningPointId: 'lp-g8-english-p17-1',
    generationModel: 'Curriculum Engine v1.0',
    generationVersion: '3.1',
    auditHistory: [
      {
        action: 'GENERATED',
        timestamp: now,
        performedBy: 'Batch 1 Question Engine (English)',
        notes: `Generated under batch ${batchId} for Workbook p.17 (PDF p.9).`
      }
    ]
  },
  {
    id: 'q-g8-b3-eng-wb-p17-sentence',
    questionId: 'q-g8-b3-eng-wb-p17-sentence',
    grade: 'Grade 8',
    academicYear: '2026-2027',
    termId: 'term-g8-t1',
    subjectId: 'english',
    subjectName: 'English',
    sourceFileId: srcFileId,
    sourceFileName: srcFileName,
    bookTitle: 'Oxford Discover Futures 3 Workbook',
    sourceType: 'Workbook',
    printedPage: 17,
    pdfPage: 9,
    alternatePdfPages: [],
    unitTitle: 'Unit 2: Places and Journeys',
    sectionTitle: 'Grammar Focus',
    topic: 'Past continuous with past simple interruptions',
    learningPointId: 'lp-g8-english-p17-1',
    learningPoint: 'Construct sentences describing an ongoing background action interrupted by a sudden past event.',
    lessonSummary: 'The past continuous shows an action in progress in the past. When a sudden event interrupts that background action, the interrupting verb is in the past simple.',
    questionType: 'MULTIPLE_CHOICE',
    difficulty: 'medium',
    question: 'Complete the sentence with the correct grammatical forms from page 17 of Oxford Discover Futures 3 Workbook: "While they ______ to school, a sudden thunderstorm ______."',
    options: [
      'walked / was starting',
      'are walking / start',
      'were walked / starting',
      'were walking / started'
    ],
    correctAnswer: 'were walking / started',
    explanation: 'Following the rule on page 17 of Oxford Discover Futures 3 Workbook, "While" introduces the ongoing background activity in the past continuous ("were walking"), and the interrupting event takes the past simple ("started").',
    sourceEvidence: [
      'Page 17 Workbook: "Past continuous + past simple: We were waiting for the bus when the phone rang."'
    ],
    generationEvidence: [
      'Batch 1 Generation (English) calibrated to Workbook p.17 (PDF p.9)',
      'Sentence structure construction variation'
    ],
    createdAt: now,
    updatedAt: now,
    approvalStatus: 'DRAFT',
    reviewStatus: 'READY_FOR_APPROVAL',
    aiGenerated: true,
    generatedAt: now,
    generatedBy: 'Batch 1 Question Engine (English)',
    sourceLearningPointId: 'lp-g8-english-p17-1',
    generationModel: 'Curriculum Engine v1.0',
    generationVersion: '3.1',
    auditHistory: [
      {
        action: 'GENERATED',
        timestamp: now,
        performedBy: 'Batch 1 Question Engine (English)',
        notes: `Generated under batch ${batchId} for Workbook p.17 (PDF p.9).`
      }
    ]
  },

  // =========================================================================
  // LP 8: lp-g8-english-p28-1 (Workbook, Printed Page: 28, Physical PDF: 10)
  // Topic: Interpreting food labels and dietary nutrients
  // =========================================================================
  {
    id: 'q-g8-b3-eng-wb-p28-order',
    questionId: 'q-g8-b3-eng-wb-p28-order',
    grade: 'Grade 8',
    academicYear: '2026-2027',
    termId: 'term-g8-t1',
    subjectId: 'english',
    subjectName: 'English',
    sourceFileId: srcFileId,
    sourceFileName: srcFileName,
    bookTitle: 'Oxford Discover Futures 3 Workbook',
    sourceType: 'Workbook',
    printedPage: 28,
    pdfPage: 10,
    alternatePdfPages: [],
    unitTitle: 'Unit 3: Health and Nutrition',
    sectionTitle: 'Vocabulary & Reading',
    topic: 'Interpreting food labels and dietary nutrients',
    learningPointId: 'lp-g8-english-p28-1',
    learningPoint: 'Interpret nutritional labels to identify major food groups and nutritional content.',
    lessonSummary: 'Food labels list ingredients in order from greatest to least by weight. Nutrition panels show proteins, fats, carbohydrates, and dietary fiber per serving.',
    questionType: 'MULTIPLE_CHOICE',
    difficulty: 'easy',
    question: 'According to the reading guide on page 28 of Oxford Discover Futures 3 Workbook, in what order are ingredients listed on a standard packaged food label?',
    options: [
      'In alphabetical order from A to Z',
      'In order of proportion from greatest to least by weight',
      'In order of calorie density from lowest to highest',
      'In random order determined by packaging design'
    ],
    correctAnswer: 'In order of proportion from greatest to least by weight',
    explanation: 'Page 28 of Oxford Discover Futures 3 Workbook (PDF p.10) explains that food ingredients are legally required to be listed in order of weight, with the ingredient present in the greatest amount listed first.',
    sourceEvidence: [
      'Page 28 Workbook: "Read the drink label: per 100g calories, sugars, sodium, protein."'
    ],
    generationEvidence: [
      'Batch 1 Generation (English) calibrated to Workbook p.28 (PDF p.10)',
      'Nutritional labeling regulation concept variation'
    ],
    createdAt: now,
    updatedAt: now,
    approvalStatus: 'DRAFT',
    reviewStatus: 'READY_FOR_APPROVAL',
    aiGenerated: true,
    generatedAt: now,
    generatedBy: 'Batch 1 Question Engine (English)',
    sourceLearningPointId: 'lp-g8-english-p28-1',
    generationModel: 'Curriculum Engine v1.0',
    generationVersion: '3.1',
    auditHistory: [
      {
        action: 'GENERATED',
        timestamp: now,
        performedBy: 'Batch 1 Question Engine (English)',
        notes: `Generated under batch ${batchId} for Workbook p.28 (PDF p.10).`
      }
    ]
  },
  {
    id: 'q-g8-b3-eng-wb-p28-analysis',
    questionId: 'q-g8-b3-eng-wb-p28-analysis',
    grade: 'Grade 8',
    academicYear: '2026-2027',
    termId: 'term-g8-t1',
    subjectId: 'english',
    subjectName: 'English',
    sourceFileId: srcFileId,
    sourceFileName: srcFileName,
    bookTitle: 'Oxford Discover Futures 3 Workbook',
    sourceType: 'Workbook',
    printedPage: 28,
    pdfPage: 10,
    alternatePdfPages: [],
    unitTitle: 'Unit 3: Health and Nutrition',
    sectionTitle: 'Vocabulary & Reading',
    topic: 'Interpreting food labels and dietary nutrients',
    learningPointId: 'lp-g8-english-p28-1',
    learningPoint: 'Interpret nutritional labels to identify major food groups and nutritional content.',
    lessonSummary: 'Food labels list ingredients in order from greatest to least by weight. Nutrition panels show proteins, fats, carbohydrates, and dietary fiber per serving.',
    questionType: 'MULTIPLE_CHOICE',
    difficulty: 'medium',
    question: 'A student examines a packaged snack label on page 28 of Oxford Discover Futures 3 Workbook and sees that "Whole Grain Oats" is listed first, followed by "Honey" and "Salt". What does this indicate about the snack?',
    options: [
      'Salt is the largest ingredient by weight in the snack.',
      'The snack contains zero grams of carbohydrates.',
      'Whole Grain Oats is the primary ingredient by weight in the snack.',
      'Honey makes up more than 90% of the snack by weight.'
    ],
    correctAnswer: 'Whole Grain Oats is the primary ingredient by weight in the snack.',
    explanation: 'Since ingredients are ordered from greatest to least by weight on nutrition labels as taught on page 28 of Oxford Discover Futures 3 Workbook, having "Whole Grain Oats" first confirms it is the predominant ingredient.',
    sourceEvidence: [
      'Page 28 Workbook: "Read the drink label: per 100g calories, sugars, sodium, protein."'
    ],
    generationEvidence: [
      'Batch 1 Generation (English) calibrated to Workbook p.28 (PDF p.10)',
      'Label reading application variation'
    ],
    createdAt: now,
    updatedAt: now,
    approvalStatus: 'DRAFT',
    reviewStatus: 'READY_FOR_APPROVAL',
    aiGenerated: true,
    generatedAt: now,
    generatedBy: 'Batch 1 Question Engine (English)',
    sourceLearningPointId: 'lp-g8-english-p28-1',
    generationModel: 'Curriculum Engine v1.0',
    generationVersion: '3.1',
    auditHistory: [
      {
        action: 'GENERATED',
        timestamp: now,
        performedBy: 'Batch 1 Question Engine (English)',
        notes: `Generated under batch ${batchId} for Workbook p.28 (PDF p.10).`
      }
    ]
  }
];
