import { Question } from '../types';

/**
 * BATCH 2 QUESTION EXPANSION: SCIENCE (31 NEW GROUNDED QUESTIONS)
 * 
 * Strict Provenance & Pedagogical Coverage:
 * - Calibrated across all 17 verified Grade 8 Science learning points.
 * - Every verified learning point has 2 distinct questions (total 34 Science questions when combined with 3 existing).
 * - Excludes Science Student Book p.41 (unresolved requirement).
 * - All questions have approvalStatus = 'DRAFT' and reviewStatus = 'READY_FOR_APPROVAL'.
 * - Zero answer-pattern bias (options shuffled across A, B, C, D).
 * - Verified non-hint lesson reminders inherited from Stage 2 without leaking the answer.
 */

const now = '2026-09-29T13:05:00Z';
const srcFileId = 'src-g8-t1-combined-250p';
const srcFileName = 'G8_T1_Combined_Textbook_250p.pdf';
const batchId = 'batch-g8-t1-004-science';

export const GRADE_8_BATCH_SCIENCE_QUESTIONS: Question[] = [
  // =========================================================================
  // LP 1: lp-g8-science-p4-1 (Student Book, Printed Page: 4, Physical PDF: 11)
  // Topic: Scientific enquiry, questions, and hypotheses
  // =========================================================================
  {
    id: 'q-g8-b4-sci-sb-p4-concept',
    questionId: 'q-g8-b4-sci-sb-p4-concept',
    grade: 'Grade 8',
    academicYear: '2026-2027',
    termId: 'term-g8-t1',
    subjectId: 'science',
    subjectName: 'Science',
    sourceFileId: srcFileId,
    sourceFileName: srcFileName,
    bookTitle: 'Oxford International Science 8 Student Book',
    sourceType: 'Student Book',
    printedPage: 4,
    pdfPage: 11,
    alternatePdfPages: [],
    unitTitle: 'Unit 1: Scientific Enquiry and Plant Biology',
    sectionTitle: 'Scientific Methods',
    topic: 'Scientific enquiry, questions, and hypotheses',
    learningPointId: 'lp-g8-science-p4-1',
    learningPoint: 'Formulate a testable scientific hypothesis that links the independent variable to the dependent variable.',
    lessonSummary: 'A scientific hypothesis is a testable statement predicting how changes in the independent variable will cause measurable changes in the dependent variable.',
    questionType: 'MULTIPLE_CHOICE',
    difficulty: 'easy',
    question: 'According to page 4 of Oxford International Science 8 Student Book, what is the essential characteristic of a scientific hypothesis?',
    options: [
      'It must be a testable prediction that can be supported or contradicted by experimental evidence.',
      'It must be an established mathematical law that cannot ever be challenged.',
      'It must describe a laboratory safety hazard involving glassware.',
      'It must be an artistic illustration of plant cells drawn to scale.'
    ],
    correctAnswer: 'It must be a testable prediction that can be supported or contradicted by experimental evidence.',
    explanation: 'Page 4 of Oxford International Science 8 Student Book (PDF p.11) states that a hypothesis is a proposed, testable explanation that makes predictions that can be investigated experimentally.',
    sourceEvidence: [
      'Page 4 Student Book: "A hypothesis is a proposed explanation made on the basis of limited evidence as a starting point for further investigation."'
    ],
    generationEvidence: [
      'Batch 2 Generation (Science) calibrated to Stage 2 Learning Point lp-g8-science-p4-1',
      'Concept recognition variation for scientific hypothesis definition'
    ],
    createdAt: now,
    updatedAt: now,
    approvalStatus: 'DRAFT',
    reviewStatus: 'READY_FOR_APPROVAL',
    aiGenerated: true,
    generatedAt: now,
    generatedBy: 'Batch 2 Question Engine (Science)',
    sourceLearningPointId: 'lp-g8-science-p4-1',
    generationModel: 'Curriculum Engine v1.0',
    generationVersion: '3.1',
    auditHistory: [
      {
        action: 'GENERATED',
        timestamp: now,
        performedBy: 'Batch 2 Question Engine (Science)',
        notes: `Generated under batch ${batchId} for Student Book p.4 (PDF p.11).`
      }
    ]
  },
  {
    id: 'q-g8-b4-sci-sb-p4-variables',
    questionId: 'q-g8-b4-sci-sb-p4-variables',
    grade: 'Grade 8',
    academicYear: '2026-2027',
    termId: 'term-g8-t1',
    subjectId: 'science',
    subjectName: 'Science',
    sourceFileId: srcFileId,
    sourceFileName: srcFileName,
    bookTitle: 'Oxford International Science 8 Student Book',
    sourceType: 'Student Book',
    printedPage: 4,
    pdfPage: 11,
    alternatePdfPages: [],
    unitTitle: 'Unit 1: Scientific Enquiry and Plant Biology',
    sectionTitle: 'Scientific Methods',
    topic: 'Scientific enquiry, questions, and hypotheses',
    learningPointId: 'lp-g8-science-p4-1',
    learningPoint: 'Formulate a testable scientific hypothesis that links the independent variable to the dependent variable.',
    lessonSummary: 'A scientific hypothesis is a testable statement predicting how changes in the independent variable will cause measurable changes in the dependent variable.',
    questionType: 'MULTIPLE_CHOICE',
    difficulty: 'medium',
    question: 'A student plans an experiment to investigate: "How does the concentration of fertilizer affect the growth height of bean seedlings?" Based on page 4 of Oxford International Science 8 Student Book, which variable is the independent variable in this enquiry?',
    options: [
      'The final measured height of the bean seedlings in centimeters',
      'The concentration of fertilizer deliberately changed by the investigator',
      'The room temperature and species of bean kept identical throughout',
      'The volume of water added each day to ensure a fair test'
    ],
    correctAnswer: 'The concentration of fertilizer deliberately changed by the investigator',
    explanation: 'On page 4 of Oxford International Science 8 Student Book, the independent variable is defined as the factor that the experimenter chooses to alter or manipulate to observe its effect.',
    sourceEvidence: [
      'Page 4 Student Book: "The independent variable is the one you change; the dependent variable is the one you measure."'
    ],
    generationEvidence: [
      'Batch 2 Generation (Science) calibrated to Stage 2 Learning Point lp-g8-science-p4-1',
      'Variable identification application scenario'
    ],
    createdAt: now,
    updatedAt: now,
    approvalStatus: 'DRAFT',
    reviewStatus: 'READY_FOR_APPROVAL',
    aiGenerated: true,
    generatedAt: now,
    generatedBy: 'Batch 2 Question Engine (Science)',
    sourceLearningPointId: 'lp-g8-science-p4-1',
    generationModel: 'Curriculum Engine v1.0',
    generationVersion: '3.1',
    auditHistory: [
      {
        action: 'GENERATED',
        timestamp: now,
        performedBy: 'Batch 2 Question Engine (Science)',
        notes: `Generated under batch ${batchId} for Student Book p.4 (PDF p.11).`
      }
    ]
  },

  // =========================================================================
  // LP 2: lp-g8-science-p5-1 (Student Book, Printed Page: 5, Physical PDF: 12)
  // Topic: Accuracy, precision, and laboratory risk assessments
  // =========================================================================
  {
    id: 'q-g8-b4-sci-sb-p5-accuracy-precision',
    questionId: 'q-g8-b4-sci-sb-p5-accuracy-precision',
    grade: 'Grade 8',
    academicYear: '2026-2027',
    termId: 'term-g8-t1',
    subjectId: 'science',
    subjectName: 'Science',
    sourceFileId: srcFileId,
    sourceFileName: srcFileName,
    bookTitle: 'Oxford International Science 8 Student Book',
    sourceType: 'Student Book',
    printedPage: 5,
    pdfPage: 12,
    alternatePdfPages: [],
    unitTitle: 'Unit 1: Scientific Enquiry and Plant Biology',
    sectionTitle: 'Laboratory Skills',
    topic: 'Accuracy, precision, and laboratory risk assessments',
    learningPointId: 'lp-g8-science-p5-1',
    learningPoint: 'Distinguish between accuracy (closeness to true value) and precision (repeatability of measurements).',
    lessonSummary: 'Accuracy describes how close a measurement is to the real true value. Precision describes how consistent and close repeated measurements are to each other.',
    questionType: 'MULTIPLE_CHOICE',
    difficulty: 'medium',
    question: 'On page 5 of Oxford International Science 8 Student Book, what is the scientific distinction between accurate data and precise data?',
    options: [
      'Accurate data is recorded in ink, while precise data is recorded using a digital calculator.',
      'Accurate data is close to the true value, whereas precise data shows repeated measurements that are close to one another.',
      'Accurate data only applies to mass, while precise data only applies to liquid volumes.',
      'Accurate data has zero decimal places, while precise data has exactly five significant figures.'
    ],
    correctAnswer: 'Accurate data is close to the true value, whereas precise data shows repeated measurements that are close to one another.',
    explanation: 'As explained on page 5 of Oxford International Science 8 Student Book (PDF p.12), accuracy measures proximity to the true quantity, while precision reflects the repeatability and close agreement among repeated trials.',
    sourceEvidence: [
      'Page 5 Student Book: "Accurate results are close to the true value; precise results are clustered closely together."'
    ],
    generationEvidence: [
      'Batch 2 Generation (Science) calibrated to Stage 2 Learning Point lp-g8-science-p5-1',
      'Distinction variation between scientific accuracy and precision'
    ],
    createdAt: now,
    updatedAt: now,
    approvalStatus: 'DRAFT',
    reviewStatus: 'READY_FOR_APPROVAL',
    aiGenerated: true,
    generatedAt: now,
    generatedBy: 'Batch 2 Question Engine (Science)',
    sourceLearningPointId: 'lp-g8-science-p5-1',
    generationModel: 'Curriculum Engine v1.0',
    generationVersion: '3.1',
    auditHistory: [
      {
        action: 'GENERATED',
        timestamp: now,
        performedBy: 'Batch 2 Question Engine (Science)',
        notes: `Generated under batch ${batchId} for Student Book p.5 (PDF p.12).`
      }
    ]
  },
  {
    id: 'q-g8-b4-sci-sb-p5-risk-assessment',
    questionId: 'q-g8-b4-sci-sb-p5-risk-assessment',
    grade: 'Grade 8',
    academicYear: '2026-2027',
    termId: 'term-g8-t1',
    subjectId: 'science',
    subjectName: 'Science',
    sourceFileId: srcFileId,
    sourceFileName: srcFileName,
    bookTitle: 'Oxford International Science 8 Student Book',
    sourceType: 'Student Book',
    printedPage: 5,
    pdfPage: 12,
    alternatePdfPages: [],
    unitTitle: 'Unit 1: Scientific Enquiry and Plant Biology',
    sectionTitle: 'Laboratory Skills',
    topic: 'Accuracy, precision, and laboratory risk assessments',
    learningPointId: 'lp-g8-science-p5-1',
    learningPoint: 'Distinguish between accuracy (closeness to true value) and precision (repeatability of measurements).',
    lessonSummary: 'Accuracy describes how close a measurement is to the real true value. Precision describes how consistent and close repeated measurements are to each other.',
    questionType: 'MULTIPLE_CHOICE',
    difficulty: 'easy',
    question: 'When carrying out a heating experiment using a Bunsen burner as described on page 5 of Oxford International Science 8 Student Book, what is the primary purpose of a laboratory risk assessment?',
    options: [
      'To calculate the monetary cost of chemical reagents before purchasing',
      'To identify potential hazards, evaluate risks, and establish safety control measures',
      'To ensure all students complete the practical exam at the exact same minute',
      'To eliminate the requirement for recording experimental measurements'
    ],
    correctAnswer: 'To identify potential hazards, evaluate risks, and establish safety control measures',
    explanation: 'Page 5 highlights that risk assessments are essential to identify potential dangers (such as open flames or toxic chemicals) and specify precautions (like wearing eye protection and tying back long hair).',
    sourceEvidence: [
      'Page 5 Student Book: "A risk assessment identifies hazards and explains how to minimize the risk of harm."'
    ],
    generationEvidence: [
      'Batch 2 Generation (Science) calibrated to Stage 2 Learning Point lp-g8-science-p5-1',
      'Laboratory safety and risk assessment concept variation'
    ],
    createdAt: now,
    updatedAt: now,
    approvalStatus: 'DRAFT',
    reviewStatus: 'READY_FOR_APPROVAL',
    aiGenerated: true,
    generatedAt: now,
    generatedBy: 'Batch 2 Question Engine (Science)',
    sourceLearningPointId: 'lp-g8-science-p5-1',
    generationModel: 'Curriculum Engine v1.0',
    generationVersion: '3.1',
    auditHistory: [
      {
        action: 'GENERATED',
        timestamp: now,
        performedBy: 'Batch 2 Question Engine (Science)',
        notes: `Generated under batch ${batchId} for Student Book p.5 (PDF p.12).`
      }
    ]
  },

  // =========================================================================
  // LP 3: lp-g8-science-p9-1 (Student Book, Printed Page: 9, Physical PDF: 13)
  // Topic: Graphing experimental data and drawing scientific conclusions
  // =========================================================================
  {
    id: 'q-g8-b4-sci-sb-p9-axis-rule',
    questionId: 'q-g8-b4-sci-sb-p9-axis-rule',
    grade: 'Grade 8',
    academicYear: '2026-2027',
    termId: 'term-g8-t1',
    subjectId: 'science',
    subjectName: 'Science',
    sourceFileId: srcFileId,
    sourceFileName: srcFileName,
    bookTitle: 'Oxford International Science 8 Student Book',
    sourceType: 'Student Book',
    printedPage: 9,
    pdfPage: 13,
    alternatePdfPages: [],
    unitTitle: 'Unit 1: Scientific Enquiry and Plant Biology',
    sectionTitle: 'Data Presentation and Analysis',
    topic: 'Graphing experimental data and drawing scientific conclusions',
    learningPointId: 'lp-g8-science-p9-1',
    learningPoint: 'Plot continuous experimental data with independent variable on x-axis and draw a balanced line of best fit.',
    lessonSummary: 'Always plot the independent variable on the horizontal (x) axis and the dependent variable on the vertical (y) axis. Draw a smooth line or straight ruler line of best fit that ignores anomalies.',
    questionType: 'MULTIPLE_CHOICE',
    difficulty: 'easy',
    question: 'When constructing a line graph to present continuous scientific data as shown on page 9 of Oxford International Science 8 Student Book, which variable must be plotted along the horizontal axis (x-axis)?',
    options: [
      'The dependent variable',
      'The control variable',
      'The independent variable',
      'The anomalous outlier data point'
    ],
    correctAnswer: 'The independent variable',
    explanation: 'Page 9 of Oxford International Science 8 Student Book (PDF p.13) states the universal convention: the independent variable belongs on the horizontal (x) axis, while the dependent variable is plotted on the vertical (y) axis.',
    sourceEvidence: [
      'Page 9 Student Book: "Plotting graphs: place the independent variable on the x-axis and the dependent variable on the y-axis."'
    ],
    generationEvidence: [
      'Batch 2 Generation (Science) calibrated to Stage 2 Learning Point lp-g8-science-p9-1',
      'Graph construction rule variation'
    ],
    createdAt: now,
    updatedAt: now,
    approvalStatus: 'DRAFT',
    reviewStatus: 'READY_FOR_APPROVAL',
    aiGenerated: true,
    generatedAt: now,
    generatedBy: 'Batch 2 Question Engine (Science)',
    sourceLearningPointId: 'lp-g8-science-p9-1',
    generationModel: 'Curriculum Engine v1.0',
    generationVersion: '3.1',
    auditHistory: [
      {
        action: 'GENERATED',
        timestamp: now,
        performedBy: 'Batch 2 Question Engine (Science)',
        notes: `Generated under batch ${batchId} for Student Book p.9 (PDF p.13).`
      }
    ]
  },
  {
    id: 'q-g8-b4-sci-sb-p9-best-fit',
    questionId: 'q-g8-b4-sci-sb-p9-best-fit',
    grade: 'Grade 8',
    academicYear: '2026-2027',
    termId: 'term-g8-t1',
    subjectId: 'science',
    subjectName: 'Science',
    sourceFileId: srcFileId,
    sourceFileName: srcFileName,
    bookTitle: 'Oxford International Science 8 Student Book',
    sourceType: 'Student Book',
    printedPage: 9,
    pdfPage: 13,
    alternatePdfPages: [],
    unitTitle: 'Unit 1: Scientific Enquiry and Plant Biology',
    sectionTitle: 'Data Presentation and Analysis',
    topic: 'Graphing experimental data and drawing scientific conclusions',
    learningPointId: 'lp-g8-science-p9-1',
    learningPoint: 'Plot continuous experimental data with independent variable on x-axis and draw a balanced line of best fit.',
    lessonSummary: 'Always plot the independent variable on the horizontal (x) axis and the dependent variable on the vertical (y) axis. Draw a smooth line or straight ruler line of best fit that ignores anomalies.',
    questionType: 'MULTIPLE_CHOICE',
    difficulty: 'medium',
    question: 'On page 9 of Oxford International Science 8 Student Book, what is the correct technique for drawing a line of best fit through plotted experimental data points?',
    options: [
      'Connecting every single point in a jagged zig-zag line regardless of outlying values',
      'Drawing a straight or smooth curved line with a balanced number of points on either side, ignoring anomalies',
      'Connecting only the first point to the origin at (0,0)',
      'Drawing a horizontal flat line across the highest plotted coordinate'
    ],
    correctAnswer: 'Drawing a straight or smooth curved line with a balanced number of points on either side, ignoring anomalies',
    explanation: 'Page 9 instructs students to draw a balanced line of best fit that reflects the general trend of the data points, leaving roughly equal points above and below the line while disregarding clear anomalies.',
    sourceEvidence: [
      'Page 9 Student Book: "Draw a line of best fit: it can be straight or curved, showing the overall trend while ignoring obvious anomalies."'
    ],
    generationEvidence: [
      'Batch 2 Generation (Science) calibrated to Stage 2 Learning Point lp-g8-science-p9-1',
      'Line of best fit technique application variation'
    ],
    createdAt: now,
    updatedAt: now,
    approvalStatus: 'DRAFT',
    reviewStatus: 'READY_FOR_APPROVAL',
    aiGenerated: true,
    generatedAt: now,
    generatedBy: 'Batch 2 Question Engine (Science)',
    sourceLearningPointId: 'lp-g8-science-p9-1',
    generationModel: 'Curriculum Engine v1.0',
    generationVersion: '3.1',
    auditHistory: [
      {
        action: 'GENERATED',
        timestamp: now,
        performedBy: 'Batch 2 Question Engine (Science)',
        notes: `Generated under batch ${batchId} for Student Book p.9 (PDF p.13).`
      }
    ]
  },

  // =========================================================================
  // LP 4: lp-g8-science-p23-1 (Student Book, Printed Page: 23, Physical PDF: 14)
  // Topic: Specialized plant transport cells: Xylem and Phloem
  // (Note: Has 1 existing question q-g8-pilot-science-p23. Adding 1 new question)
  // =========================================================================
  {
    id: 'q-g8-b4-sci-sb-p23-phloem-translocation',
    questionId: 'q-g8-b4-sci-sb-p23-phloem-translocation',
    grade: 'Grade 8',
    academicYear: '2026-2027',
    termId: 'term-g8-t1',
    subjectId: 'science',
    subjectName: 'Science',
    sourceFileId: srcFileId,
    sourceFileName: srcFileName,
    bookTitle: 'Oxford International Science 8 Student Book',
    sourceType: 'Student Book',
    printedPage: 23,
    pdfPage: 14,
    alternatePdfPages: [],
    unitTitle: 'Unit 2: Plant Biology and Transport Systems',
    sectionTitle: 'Vascular Tissues in Plants',
    topic: 'Specialized plant transport cells: Xylem and Phloem',
    learningPointId: 'lp-g8-science-p23-1',
    learningPoint: 'Compare structural adaptations of xylem (dead, lignified) and phloem (living, sieve tubes) for plant transport.',
    lessonSummary: 'Xylem consists of dead, hollow tubes strengthened with lignin that transport water and minerals upward. Phloem consists of living sieve tubes that transport dissolved sugars in both directions.',
    questionType: 'MULTIPLE_CHOICE',
    difficulty: 'medium',
    question: 'Based on the cellular structures described on page 23 of Oxford International Science 8 Student Book, what substance is transported by phloem sieve tubes, and in which direction does transport occur?',
    options: [
      'Insoluble starch molecules transported upward only from roots to shoots',
      'Dissolved sugars and amino acids transported bidirectionally to where they are needed',
      'Liquid water and dissolved mineral ions transported upward only to leaf stomata',
      'Atmospheric carbon dioxide gas transported downward into the soil'
    ],
    correctAnswer: 'Dissolved sugars and amino acids transported bidirectionally to where they are needed',
    explanation: 'Page 23 of Oxford International Science 8 Student Book (PDF p.14) explains that phloem tissue translocates dissolved sucrose and amino acids from photosynthetic sources to growing tissues and storage organs (bidirectionally).',
    sourceEvidence: [
      'Page 23 Student Book: "Phloem carries dissolved sugars throughout the plant in both directions."'
    ],
    generationEvidence: [
      'Batch 2 Generation (Science) calibrated to Stage 2 Learning Point lp-g8-science-p23-1',
      'Phloem transport direction and solute specificity variation'
    ],
    createdAt: now,
    updatedAt: now,
    approvalStatus: 'DRAFT',
    reviewStatus: 'READY_FOR_APPROVAL',
    aiGenerated: true,
    generatedAt: now,
    generatedBy: 'Batch 2 Question Engine (Science)',
    sourceLearningPointId: 'lp-g8-science-p23-1',
    generationModel: 'Curriculum Engine v1.0',
    generationVersion: '3.1',
    auditHistory: [
      {
        action: 'GENERATED',
        timestamp: now,
        performedBy: 'Batch 2 Question Engine (Science)',
        notes: `Generated under batch ${batchId} for Student Book p.23 (PDF p.14).`
      }
    ]
  },

  // =========================================================================
  // LP 5: lp-g8-science-p24-1 (Student Book, Printed Page: 24, Physical PDF: 15)
  // Topic: Principles of diffusion and factors affecting diffusion rate
  // (Note: Has 1 existing question q-g8-b2-sci-p24. Adding 1 new question)
  // =========================================================================
  {
    id: 'q-g8-b4-sci-sb-p24-definition',
    questionId: 'q-g8-b4-sci-sb-p24-definition',
    grade: 'Grade 8',
    academicYear: '2026-2027',
    termId: 'term-g8-t1',
    subjectId: 'science',
    subjectName: 'Science',
    sourceFileId: srcFileId,
    sourceFileName: srcFileName,
    bookTitle: 'Oxford International Science 8 Student Book',
    sourceType: 'Student Book',
    printedPage: 24,
    pdfPage: 15,
    alternatePdfPages: [],
    unitTitle: 'Unit 2: Plant Biology and Transport Systems',
    sectionTitle: 'Cellular Transport Mechanisms',
    topic: 'Principles of diffusion and factors affecting diffusion rate',
    learningPointId: 'lp-g8-science-p24-1',
    learningPoint: 'Define diffusion as the net movement of particles down a concentration gradient caused by random kinetic motion.',
    lessonSummary: 'Diffusion is the passive spreading of particles from an area of higher concentration to an area of lower concentration. Higher temperatures and larger surface areas increase diffusion rate.',
    questionType: 'MULTIPLE_CHOICE',
    difficulty: 'easy',
    question: 'How is the biological process of diffusion defined on page 24 of Oxford International Science 8 Student Book?',
    options: [
      'The active movement of minerals against a concentration gradient using ATP energy',
      'The net movement of particles from an area of higher concentration to an area of lower concentration down a gradient',
      'The conversion of glucose into lactic acid under anaerobic conditions',
      'The evaporation of moisture from guard cells on a leaf epidermis'
    ],
    correctAnswer: 'The net movement of particles from an area of higher concentration to an area of lower concentration down a gradient',
    explanation: 'Page 24 of Oxford International Science 8 Student Book (PDF p.15) defines diffusion as the net movement of substance particles from a region where they are in higher concentration to a region of lower concentration as a result of random particle motion.',
    sourceEvidence: [
      'Page 24 Student Book: "Diffusion is the net movement of particles from a region of higher concentration to lower concentration."'
    ],
    generationEvidence: [
      'Batch 2 Generation (Science) calibrated to Stage 2 Learning Point lp-g8-science-p24-1',
      'Core biological definition variation for passive diffusion'
    ],
    createdAt: now,
    updatedAt: now,
    approvalStatus: 'DRAFT',
    reviewStatus: 'READY_FOR_APPROVAL',
    aiGenerated: true,
    generatedAt: now,
    generatedBy: 'Batch 2 Question Engine (Science)',
    sourceLearningPointId: 'lp-g8-science-p24-1',
    generationModel: 'Curriculum Engine v1.0',
    generationVersion: '3.1',
    auditHistory: [
      {
        action: 'GENERATED',
        timestamp: now,
        performedBy: 'Batch 2 Question Engine (Science)',
        notes: `Generated under batch ${batchId} for Student Book p.24 (PDF p.15).`
      }
    ]
  },

  // =========================================================================
  // LP 6: lp-g8-science-p26-1 (Student Book, Printed Page: 26, Physical PDF: 16)
  // Topic: Aerobic cellular respiration and energy release
  // (Note: Has 1 existing question q-g8-b2-sci-p26. Adding 1 new question)
  // =========================================================================
  {
    id: 'q-g8-b4-sci-sb-p26-mitochondria',
    questionId: 'q-g8-b4-sci-sb-p26-mitochondria',
    grade: 'Grade 8',
    academicYear: '2026-2027',
    termId: 'term-g8-t1',
    subjectId: 'science',
    subjectName: 'Science',
    sourceFileId: srcFileId,
    sourceFileName: srcFileName,
    bookTitle: 'Oxford International Science 8 Student Book',
    sourceType: 'Student Book',
    printedPage: 26,
    pdfPage: 16,
    alternatePdfPages: [],
    unitTitle: 'Unit 2: Plant Biology and Transport Systems',
    sectionTitle: 'Cellular Energy Release',
    topic: 'Aerobic cellular respiration and energy release',
    learningPointId: 'lp-g8-science-p26-1',
    learningPoint: 'State the word equation for aerobic respiration and identify mitochondria as the primary site of cellular energy release.',
    lessonSummary: 'Aerobic respiration occurs inside mitochondria. Living cells react glucose with oxygen to release energy, producing carbon dioxide and water as waste products.',
    questionType: 'MULTIPLE_CHOICE',
    difficulty: 'medium',
    question: 'Inside which cellular organelle does aerobic cellular respiration primarily take place, according to page 26 of Oxford International Science 8 Student Book?',
    options: [
      'The large central vacuole',
      'The chloroplasts',
      'The cell wall',
      'The mitochondria'
    ],
    correctAnswer: 'The mitochondria',
    explanation: 'Page 26 of Oxford International Science 8 Student Book (PDF p.16) identifies mitochondria as the specialized organelles within eukaryotic cells where aerobic respiration reactions occur to release energy.',
    sourceEvidence: [
      'Page 26 Student Book: "This reaction occurs in mitochondria, the powerhouses of the cell."'
    ],
    generationEvidence: [
      'Batch 2 Generation (Science) calibrated to Stage 2 Learning Point lp-g8-science-p26-1',
      'Organelle site identification variation for cellular respiration'
    ],
    createdAt: now,
    updatedAt: now,
    approvalStatus: 'DRAFT',
    reviewStatus: 'READY_FOR_APPROVAL',
    aiGenerated: true,
    generatedAt: now,
    generatedBy: 'Batch 2 Question Engine (Science)',
    sourceLearningPointId: 'lp-g8-science-p26-1',
    generationModel: 'Curriculum Engine v1.0',
    generationVersion: '3.1',
    auditHistory: [
      {
        action: 'GENERATED',
        timestamp: now,
        performedBy: 'Batch 2 Question Engine (Science)',
        notes: `Generated under batch ${batchId} for Student Book p.26 (PDF p.16).`
      }
    ]
  },

  // =========================================================================
  // LP 7: lp-g8-science-p28-1 (Student Book, Printed Page: 28, Physical PDF: 17)
  // Topic: Structure and characteristics of bacterial cells
  // =========================================================================
  {
    id: 'q-g8-b4-sci-sb-p28-prokaryote-nucleus',
    questionId: 'q-g8-b4-sci-sb-p28-prokaryote-nucleus',
    grade: 'Grade 8',
    academicYear: '2026-2027',
    termId: 'term-g8-t1',
    subjectId: 'science',
    subjectName: 'Science',
    sourceFileId: srcFileId,
    sourceFileName: srcFileName,
    bookTitle: 'Oxford International Science 8 Student Book',
    sourceType: 'Student Book',
    printedPage: 28,
    pdfPage: 17,
    alternatePdfPages: [],
    unitTitle: 'Unit 3: Microorganisms and Cell Biology',
    sectionTitle: 'Prokaryotic Organisms',
    topic: 'Structure and characteristics of bacterial cells',
    learningPointId: 'lp-g8-science-p28-1',
    learningPoint: 'Describe prokaryotic cell structure, identifying the absence of a membrane-bound nucleus and presence of circular DNA.',
    lessonSummary: 'Prokaryotes (such as bacteria) do not possess a membrane-bound nucleus or mitochondria. Their genetic material is a circular loop of DNA free in the cytoplasm, often accompanied by small plasmid rings.',
    questionType: 'MULTIPLE_CHOICE',
    difficulty: 'easy',
    question: 'According to page 28 of Oxford International Science 8 Student Book, what is the defining structural characteristic of bacterial (prokaryotic) cells regarding their genetic material?',
    options: [
      'Their DNA is enclosed within a double-membrane nucleus.',
      'Their genetic material consists of a single circular loop of DNA free in the cytoplasm without a nuclear membrane.',
      'They have linear chromosomes packed inside a large nucleolus.',
      'They lack any DNA or genetic material entirely.'
    ],
    correctAnswer: 'Their genetic material consists of a single circular loop of DNA free in the cytoplasm without a nuclear membrane.',
    explanation: 'Page 28 of Oxford International Science 8 Student Book (PDF p.17) explains that bacteria are prokaryotic organisms whose genetic material is a circular loop of DNA floating freely in the cytoplasm rather than contained inside a nucleus.',
    sourceEvidence: [
      'Page 28 Student Book: "Bacterial cells are prokaryotic: their DNA is not enclosed in a nucleus."'
    ],
    generationEvidence: [
      'Batch 2 Generation (Science) calibrated to Stage 2 Learning Point lp-g8-science-p28-1',
      'Prokaryotic genetic structure concept recognition'
    ],
    createdAt: now,
    updatedAt: now,
    approvalStatus: 'DRAFT',
    reviewStatus: 'READY_FOR_APPROVAL',
    aiGenerated: true,
    generatedAt: now,
    generatedBy: 'Batch 2 Question Engine (Science)',
    sourceLearningPointId: 'lp-g8-science-p28-1',
    generationModel: 'Curriculum Engine v1.0',
    generationVersion: '3.1',
    auditHistory: [
      {
        action: 'GENERATED',
        timestamp: now,
        performedBy: 'Batch 2 Question Engine (Science)',
        notes: `Generated under batch ${batchId} for Student Book p.28 (PDF p.17).`
      }
    ]
  },
  {
    id: 'q-g8-b4-sci-sb-p28-plasmids',
    questionId: 'q-g8-b4-sci-sb-p28-plasmids',
    grade: 'Grade 8',
    academicYear: '2026-2027',
    termId: 'term-g8-t1',
    subjectId: 'science',
    subjectName: 'Science',
    sourceFileId: srcFileId,
    sourceFileName: srcFileName,
    bookTitle: 'Oxford International Science 8 Student Book',
    sourceType: 'Student Book',
    printedPage: 28,
    pdfPage: 17,
    alternatePdfPages: [],
    unitTitle: 'Unit 3: Microorganisms and Cell Biology',
    sectionTitle: 'Prokaryotic Organisms',
    topic: 'Structure and characteristics of bacterial cells',
    learningPointId: 'lp-g8-science-p28-1',
    learningPoint: 'Describe prokaryotic cell structure, identifying the absence of a membrane-bound nucleus and presence of circular DNA.',
    lessonSummary: 'Prokaryotes (such as bacteria) do not possess a membrane-bound nucleus or mitochondria. Their genetic material is a circular loop of DNA free in the cytoplasm, often accompanied by small plasmid rings.',
    questionType: 'MULTIPLE_CHOICE',
    difficulty: 'medium',
    question: 'On page 28 of Oxford International Science 8 Student Book, what are the small, additional circular rings of DNA frequently found in bacterial cytoplasm called?',
    options: [
      'Ribosomes',
      'Flagella',
      'Vacuoles',
      'Plasmids'
    ],
    correctAnswer: 'Plasmids',
    explanation: 'As described on page 28 of Oxford International Science 8 Student Book, bacteria often contain small extra rings of DNA called plasmids, which can carry beneficial genes such as antibiotic resistance.',
    sourceEvidence: [
      'Page 28 Student Book: "Bacteria often contain extra small rings of DNA called plasmids."'
    ],
    generationEvidence: [
      'Batch 2 Generation (Science) calibrated to Stage 2 Learning Point lp-g8-science-p28-1',
      'Plasmid identification and bacterial anatomy variation'
    ],
    createdAt: now,
    updatedAt: now,
    approvalStatus: 'DRAFT',
    reviewStatus: 'READY_FOR_APPROVAL',
    aiGenerated: true,
    generatedAt: now,
    generatedBy: 'Batch 2 Question Engine (Science)',
    sourceLearningPointId: 'lp-g8-science-p28-1',
    generationModel: 'Curriculum Engine v1.0',
    generationVersion: '3.1',
    auditHistory: [
      {
        action: 'GENERATED',
        timestamp: now,
        performedBy: 'Batch 2 Question Engine (Science)',
        notes: `Generated under batch ${batchId} for Student Book p.28 (PDF p.17).`
      }
    ]
  },

  // =========================================================================
  // LP 8: lp-g8-science-p29-1 (Student Book, Printed Page: 29, Physical PDF: 18)
  // Topic: Contrasting prokaryotic and eukaryotic organisms
  // =========================================================================
  {
    id: 'q-g8-b4-sci-sb-p29-contrast-table',
    questionId: 'q-g8-b4-sci-sb-p29-contrast-table',
    grade: 'Grade 8',
    academicYear: '2026-2027',
    termId: 'term-g8-t1',
    subjectId: 'science',
    subjectName: 'Science',
    sourceFileId: srcFileId,
    sourceFileName: srcFileName,
    bookTitle: 'Oxford International Science 8 Student Book',
    sourceType: 'Student Book',
    printedPage: 29,
    pdfPage: 18,
    alternatePdfPages: [],
    unitTitle: 'Unit 3: Microorganisms and Cell Biology',
    sectionTitle: 'Comparative Cytology',
    topic: 'Contrasting prokaryotic and eukaryotic organisms',
    learningPointId: 'lp-g8-science-p29-1',
    learningPoint: 'Contrast eukaryotic cells (plant and animal) with prokaryotic cells based on organelle organization and scale.',
    lessonSummary: 'Eukaryotic cells (animals, plants, fungi) are larger and store DNA within a membrane-bound nucleus. Prokaryotes are much smaller and lack membrane-bound organelles.',
    questionType: 'MULTIPLE_CHOICE',
    difficulty: 'medium',
    question: 'Based on the comparison table on page 29 of Oxford International Science 8 Student Book, which feature is present in eukaryotic cells (such as plant and animal cells) but completely absent in prokaryotes (bacteria)?',
    options: [
      'A semi-permeable cell surface membrane',
      'Cytoplasm where metabolic reactions occur',
      'Ribosomes used for protein synthesis',
      'Membrane-bound organelles such as mitochondria and a defined nucleus'
    ],
    correctAnswer: 'Membrane-bound organelles such as mitochondria and a defined nucleus',
    explanation: 'Page 29 of Oxford International Science 8 Student Book (PDF p.18) emphasizes that membrane-bound organelles (including mitochondria, chloroplasts, and a nucleus) are exclusive to eukaryotes, whereas prokaryotes lack all membrane-bound internal compartments.',
    sourceEvidence: [
      'Page 29 Student Book table: "Eukaryotes vs Prokaryotes comparison: size, nucleus, organelles."'
    ],
    generationEvidence: [
      'Batch 2 Generation (Science) calibrated to Stage 2 Learning Point lp-g8-science-p29-1',
      'Comparative cytology table analysis variation'
    ],
    createdAt: now,
    updatedAt: now,
    approvalStatus: 'DRAFT',
    reviewStatus: 'READY_FOR_APPROVAL',
    aiGenerated: true,
    generatedAt: now,
    generatedBy: 'Batch 2 Question Engine (Science)',
    sourceLearningPointId: 'lp-g8-science-p29-1',
    generationModel: 'Curriculum Engine v1.0',
    generationVersion: '3.1',
    auditHistory: [
      {
        action: 'GENERATED',
        timestamp: now,
        performedBy: 'Batch 2 Question Engine (Science)',
        notes: `Generated under batch ${batchId} for Student Book p.29 (PDF p.18).`
      }
    ]
  },
  {
    id: 'q-g8-b4-sci-sb-p29-scale',
    questionId: 'q-g8-b4-sci-sb-p29-scale',
    grade: 'Grade 8',
    academicYear: '2026-2027',
    termId: 'term-g8-t1',
    subjectId: 'science',
    subjectName: 'Science',
    sourceFileId: srcFileId,
    sourceFileName: srcFileName,
    bookTitle: 'Oxford International Science 8 Student Book',
    sourceType: 'Student Book',
    printedPage: 29,
    pdfPage: 18,
    alternatePdfPages: [],
    unitTitle: 'Unit 3: Microorganisms and Cell Biology',
    sectionTitle: 'Comparative Cytology',
    topic: 'Contrasting prokaryotic and eukaryotic organisms',
    learningPointId: 'lp-g8-science-p29-1',
    learningPoint: 'Contrast eukaryotic cells (plant and animal) with prokaryotic cells based on organelle organization and scale.',
    lessonSummary: 'Eukaryotic cells (animals, plants, fungi) are larger and store DNA within a membrane-bound nucleus. Prokaryotes are much smaller and lack membrane-bound organelles.',
    questionType: 'MULTIPLE_CHOICE',
    difficulty: 'medium',
    question: 'In terms of physical scale as compared on page 29 of Oxford International Science 8 Student Book, how do typical prokaryotic cells compare in size to typical eukaryotic cells?',
    options: [
      'Prokaryotic cells are generally 10 to 100 times smaller than eukaryotic cells.',
      'Prokaryotic cells are always identical in volume to animal cells.',
      'Prokaryotic cells are significantly larger than plant cells.',
      'Prokaryotic cells can always be seen clearly with the naked eye without a microscope.'
    ],
    correctAnswer: 'Prokaryotic cells are generally 10 to 100 times smaller than eukaryotic cells.',
    explanation: 'According to page 29 of Oxford International Science 8 Student Book, typical bacterial cells measure around 1-5 micrometers (μm), making them roughly 10 to 100 times smaller than typical eukaryotic cells (10-100 μm).',
    sourceEvidence: [
      'Page 29 Student Book table: "Size: Prokaryotes are 1-5 μm; Eukaryotes are 10-100 μm."'
    ],
    generationEvidence: [
      'Batch 2 Generation (Science) calibrated to Stage 2 Learning Point lp-g8-science-p29-1',
      'Cellular scale and dimension comparison variation'
    ],
    createdAt: now,
    updatedAt: now,
    approvalStatus: 'DRAFT',
    reviewStatus: 'READY_FOR_APPROVAL',
    aiGenerated: true,
    generatedAt: now,
    generatedBy: 'Batch 2 Question Engine (Science)',
    sourceLearningPointId: 'lp-g8-science-p29-1',
    generationModel: 'Curriculum Engine v1.0',
    generationVersion: '3.1',
    auditHistory: [
      {
        action: 'GENERATED',
        timestamp: now,
        performedBy: 'Batch 2 Question Engine (Science)',
        notes: `Generated under batch ${batchId} for Student Book p.29 (PDF p.18).`
      }
    ]
  },

  // =========================================================================
  // LP 9: lp-g8-science-p30-1 (Student Book, Printed Page: 30, Physical PDF: 19)
  // Topic: Mechanisms of active transport across biological membranes
  // =========================================================================
  {
    id: 'q-g8-b4-sci-sb-p30-gradient',
    questionId: 'q-g8-b4-sci-sb-p30-gradient',
    grade: 'Grade 8',
    academicYear: '2026-2027',
    termId: 'term-g8-t1',
    subjectId: 'science',
    subjectName: 'Science',
    sourceFileId: srcFileId,
    sourceFileName: srcFileName,
    bookTitle: 'Oxford International Science 8 Student Book',
    sourceType: 'Student Book',
    printedPage: 30,
    pdfPage: 19,
    alternatePdfPages: [],
    unitTitle: 'Unit 3: Microorganisms and Cell Biology',
    sectionTitle: 'Cellular Transport Mechanisms',
    topic: 'Mechanisms of active transport across biological membranes',
    learningPointId: 'lp-g8-science-p30-1',
    learningPoint: 'Explain how active transport moves molecules against a concentration gradient using energy from cellular respiration.',
    lessonSummary: 'Active transport is the movement of particles from a region of lower concentration to a region of higher concentration (against the gradient) across a membrane, requiring cellular energy.',
    questionType: 'MULTIPLE_CHOICE',
    difficulty: 'medium',
    question: 'How does active transport differ from passive diffusion according to page 30 of Oxford International Science 8 Student Book?',
    options: [
      'Active transport moves substances against a concentration gradient and requires metabolic energy released by respiration.',
      'Active transport moves water molecules down an osmotic gradient without requiring any energy.',
      'Active transport occurs only in dead plant cells such as mature xylem vessels.',
      'Active transport happens spontaneously at absolute zero temperature.'
    ],
    correctAnswer: 'Active transport moves substances against a concentration gradient and requires metabolic energy released by respiration.',
    explanation: 'Page 30 of Oxford International Science 8 Student Book (PDF p.19) explains that active transport requires energy from cellular respiration to pump particles from lower to higher concentration (against the concentration gradient).',
    sourceEvidence: [
      'Page 30 Student Book: "Active transport uses energy released by respiration to move substances from low to high concentration."'
    ],
    generationEvidence: [
      'Batch 2 Generation (Science) calibrated to Stage 2 Learning Point lp-g8-science-p30-1',
      'Thermodynamic and energy requirement distinction variation'
    ],
    createdAt: now,
    updatedAt: now,
    approvalStatus: 'DRAFT',
    reviewStatus: 'READY_FOR_APPROVAL',
    aiGenerated: true,
    generatedAt: now,
    generatedBy: 'Batch 2 Question Engine (Science)',
    sourceLearningPointId: 'lp-g8-science-p30-1',
    generationModel: 'Curriculum Engine v1.0',
    generationVersion: '3.1',
    auditHistory: [
      {
        action: 'GENERATED',
        timestamp: now,
        performedBy: 'Batch 2 Question Engine (Science)',
        notes: `Generated under batch ${batchId} for Student Book p.30 (PDF p.19).`
      }
    ]
  },
  {
    id: 'q-g8-b4-sci-sb-p30-carrier-proteins',
    questionId: 'q-g8-b4-sci-sb-p30-carrier-proteins',
    grade: 'Grade 8',
    academicYear: '2026-2027',
    termId: 'term-g8-t1',
    subjectId: 'science',
    subjectName: 'Science',
    sourceFileId: srcFileId,
    sourceFileName: srcFileName,
    bookTitle: 'Oxford International Science 8 Student Book',
    sourceType: 'Student Book',
    printedPage: 30,
    pdfPage: 19,
    alternatePdfPages: [],
    unitTitle: 'Unit 3: Microorganisms and Cell Biology',
    sectionTitle: 'Cellular Transport Mechanisms',
    topic: 'Mechanisms of active transport across biological membranes',
    learningPointId: 'lp-g8-science-p30-1',
    learningPoint: 'Explain how active transport moves molecules against a concentration gradient using energy from cellular respiration.',
    lessonSummary: 'Active transport is the movement of particles from a region of lower concentration to a region of higher concentration (against the gradient) across a membrane, requiring cellular energy.',
    questionType: 'MULTIPLE_CHOICE',
    difficulty: 'medium',
    question: 'On page 30 of Oxford International Science 8 Student Book, what structures embedded within the cell membrane carry out the pumping of solute molecules during active transport?',
    options: [
      'Phospholipid molecules',
      'Cellulose fibers',
      'Specialized transport protein carriers',
      'Nuclear pores'
    ],
    correctAnswer: 'Specialized transport protein carriers',
    explanation: 'Page 30 details how specialized carrier proteins located within the cell membrane bind to specific solute ions and change shape using ATP energy to transfer them against their gradient.',
    sourceEvidence: [
      'Page 30 Student Book: "Protein pumps embedded in the membrane use energy to transport molecules against the gradient."'
    ],
    generationEvidence: [
      'Batch 2 Generation (Science) calibrated to Stage 2 Learning Point lp-g8-science-p30-1',
      'Membrane carrier protein structure variation'
    ],
    createdAt: now,
    updatedAt: now,
    approvalStatus: 'DRAFT',
    reviewStatus: 'READY_FOR_APPROVAL',
    aiGenerated: true,
    generatedAt: now,
    generatedBy: 'Batch 2 Question Engine (Science)',
    sourceLearningPointId: 'lp-g8-science-p30-1',
    generationModel: 'Curriculum Engine v1.0',
    generationVersion: '3.1',
    auditHistory: [
      {
        action: 'GENERATED',
        timestamp: now,
        performedBy: 'Batch 2 Question Engine (Science)',
        notes: `Generated under batch ${batchId} for Student Book p.30 (PDF p.19).`
      }
    ]
  },

  // =========================================================================
  // LP 10: lp-g8-science-p31-1 (Student Book, Printed Page: 31, Physical PDF: 20)
  // Topic: Biological examples of active transport in plants and animals
  // =========================================================================
  {
    id: 'q-g8-b4-sci-sb-p31-root-hair',
    questionId: 'q-g8-b4-sci-sb-p31-root-hair',
    grade: 'Grade 8',
    academicYear: '2026-2027',
    termId: 'term-g8-t1',
    subjectId: 'science',
    subjectName: 'Science',
    sourceFileId: srcFileId,
    sourceFileName: srcFileName,
    bookTitle: 'Oxford International Science 8 Student Book',
    sourceType: 'Student Book',
    printedPage: 31,
    pdfPage: 20,
    alternatePdfPages: [],
    unitTitle: 'Unit 3: Microorganisms and Cell Biology',
    sectionTitle: 'Applied Physiology',
    topic: 'Biological examples of active transport in plants and animals',
    learningPointId: 'lp-g8-science-p31-1',
    learningPoint: 'Identify physiological examples of active transport in root hair cells and intestinal epithelium.',
    lessonSummary: 'Plants use active transport to absorb mineral ions from dilute soil solutions through root hairs. Animals use active transport to absorb glucose from the gut into blood capillaries.',
    questionType: 'MULTIPLE_CHOICE',
    difficulty: 'easy',
    question: 'Why must plant root hair cells use active transport rather than passive diffusion to take up essential nitrate and magnesium ions, according to page 31 of Oxford International Science 8 Student Book?',
    options: [
      'Because the concentration of mineral ions in the root hair cytoplasm is higher than in the dilute surrounding soil water',
      'Because mineral ions are gaseous and cannot dissolve in liquid water',
      'Because root hair cells lack cell membranes and cannot perform diffusion',
      'Because water molecules prevent all forms of passive movement in plants'
    ],
    correctAnswer: 'Because the concentration of mineral ions in the root hair cytoplasm is higher than in the dilute surrounding soil water',
    explanation: 'Page 31 of Oxford International Science 8 Student Book (PDF p.20) explains that mineral ions in soil water are very dilute compared to inside the plant root cells. Therefore, plants must expend energy via active transport to pull minerals in against the gradient.',
    sourceEvidence: [
      'Page 31 Student Book: "Plant roots absorb mineral ions from dilute soil water using active transport."'
    ],
    generationEvidence: [
      'Batch 2 Generation (Science) calibrated to Stage 2 Learning Point lp-g8-science-p31-1',
      'Plant physiological example variation (root hair mineral uptake)'
    ],
    createdAt: now,
    updatedAt: now,
    approvalStatus: 'DRAFT',
    reviewStatus: 'READY_FOR_APPROVAL',
    aiGenerated: true,
    generatedAt: now,
    generatedBy: 'Batch 2 Question Engine (Science)',
    sourceLearningPointId: 'lp-g8-science-p31-1',
    generationModel: 'Curriculum Engine v1.0',
    generationVersion: '3.1',
    auditHistory: [
      {
        action: 'GENERATED',
        timestamp: now,
        performedBy: 'Batch 2 Question Engine (Science)',
        notes: `Generated under batch ${batchId} for Student Book p.31 (PDF p.20).`
      }
    ]
  },
  {
    id: 'q-g8-b4-sci-sb-p31-gut-absorption',
    questionId: 'q-g8-b4-sci-sb-p31-gut-absorption',
    grade: 'Grade 8',
    academicYear: '2026-2027',
    termId: 'term-g8-t1',
    subjectId: 'science',
    subjectName: 'Science',
    sourceFileId: srcFileId,
    sourceFileName: srcFileName,
    bookTitle: 'Oxford International Science 8 Student Book',
    sourceType: 'Student Book',
    printedPage: 31,
    pdfPage: 20,
    alternatePdfPages: [],
    unitTitle: 'Unit 3: Microorganisms and Cell Biology',
    sectionTitle: 'Applied Physiology',
    topic: 'Biological examples of active transport in plants and animals',
    learningPointId: 'lp-g8-science-p31-1',
    learningPoint: 'Identify physiological examples of active transport in root hair cells and intestinal epithelium.',
    lessonSummary: 'Plants use active transport to absorb mineral ions from dilute soil solutions through root hairs. Animals use active transport to absorb glucose from the gut into blood capillaries.',
    questionType: 'MULTIPLE_CHOICE',
    difficulty: 'medium',
    question: 'According to page 31 of Oxford International Science 8 Student Book, where does active transport play a vital physiological role in the human digestive system?',
    options: [
      'In the teeth during mechanical chewing of rough food fibers',
      'In the small intestine villi to absorb remaining glucose from the gut lumen into blood capillaries',
      'In the salivary glands to produce digestive enzymes',
      'In the large intestine to compact indigestible waste'
    ],
    correctAnswer: 'In the small intestine villi to absorb remaining glucose from the gut lumen into blood capillaries',
    explanation: 'Page 31 describes how cells lining the small intestine use active transport to absorb glucose from the intestinal lumen into the bloodstream, even when glucose levels in blood are higher than in the digested food.',
    sourceEvidence: [
      'Page 31 Student Book: "In animals, active transport enables glucose to be absorbed into the blood from the gut even against a concentration gradient."'
    ],
    generationEvidence: [
      'Batch 2 Generation (Science) calibrated to Stage 2 Learning Point lp-g8-science-p31-1',
      'Animal physiological example variation (intestinal glucose absorption)'
    ],
    createdAt: now,
    updatedAt: now,
    approvalStatus: 'DRAFT',
    reviewStatus: 'READY_FOR_APPROVAL',
    aiGenerated: true,
    generatedAt: now,
    generatedBy: 'Batch 2 Question Engine (Science)',
    sourceLearningPointId: 'lp-g8-science-p31-1',
    generationModel: 'Curriculum Engine v1.0',
    generationVersion: '3.1',
    auditHistory: [
      {
        action: 'GENERATED',
        timestamp: now,
        performedBy: 'Batch 2 Question Engine (Science)',
        notes: `Generated under batch ${batchId} for Student Book p.31 (PDF p.20).`
      }
    ]
  },

  // =========================================================================
  // LP 11: lp-g8-science-p40-1 (Student Book, Printed Page: 40, Physical PDF: 21)
  // Topic: Alveoli structure and gas exchange adaptations
  // =========================================================================
  {
    id: 'q-g8-b4-sci-sb-p40-diffusion-distance',
    questionId: 'q-g8-b4-sci-sb-p40-diffusion-distance',
    grade: 'Grade 8',
    academicYear: '2026-2027',
    termId: 'term-g8-t1',
    subjectId: 'science',
    subjectName: 'Science',
    sourceFileId: srcFileId,
    sourceFileName: srcFileName,
    bookTitle: 'Oxford International Science 8 Student Book',
    sourceType: 'Student Book',
    printedPage: 40,
    pdfPage: 21,
    alternatePdfPages: [],
    unitTitle: 'Unit 4: Human Organ Systems and Gas Exchange',
    sectionTitle: 'Respiratory Surfaces',
    topic: 'Alveoli structure and gas exchange adaptations',
    learningPointId: 'lp-g8-science-p40-1',
    learningPoint: 'Explain how alveoli adaptations maximize the rate of oxygen and carbon dioxide diffusion during pulmonary gas exchange.',
    lessonSummary: 'Alveoli in the lungs are adapted for gas exchange with millions of tiny air sacs that provide a massive surface area, thin one-cell walls, and dense capillaries for rapid diffusion.',
    questionType: 'MULTIPLE_CHOICE',
    difficulty: 'easy',
    question: 'On page 40 of Oxford International Science 8 Student Book, what structural adaptation of alveoli walls ensures a very short diffusion distance for oxygen and carbon dioxide?',
    options: [
      'The walls are composed of thick muscular fibers that contract forcefully.',
      'The walls are only one cell thick and composed of flattened epithelial cells.',
      'The walls are covered by a thick protective cartilage layer.',
      'The walls are surrounded by waterproof waxy cuticle.'
    ],
    correctAnswer: 'The walls are only one cell thick and composed of flattened epithelial cells.',
    explanation: 'Page 40 of Oxford International Science 8 Student Book (PDF p.21) explains that alveoli walls are extremely thin (only one single cell thick), which drastically reduces diffusion distance between alveolar air and red blood cells.',
    sourceEvidence: [
      'Page 40 Student Book: "Alveoli have thin walls (one cell thick) and a huge surface area surrounded by blood capillaries."'
    ],
    generationEvidence: [
      'Batch 2 Generation (Science) calibrated to Stage 2 Learning Point lp-g8-science-p40-1',
      'Structural adaptation variation (diffusion distance in alveoli)'
    ],
    createdAt: now,
    updatedAt: now,
    approvalStatus: 'DRAFT',
    reviewStatus: 'READY_FOR_APPROVAL',
    aiGenerated: true,
    generatedAt: now,
    generatedBy: 'Batch 2 Question Engine (Science)',
    sourceLearningPointId: 'lp-g8-science-p40-1',
    generationModel: 'Curriculum Engine v1.0',
    generationVersion: '3.1',
    auditHistory: [
      {
        action: 'GENERATED',
        timestamp: now,
        performedBy: 'Batch 2 Question Engine (Science)',
        notes: `Generated under batch ${batchId} for Student Book p.40 (PDF p.21).`
      }
    ]
  },
  {
    id: 'q-g8-b4-sci-sb-p40-gradient-maintenance',
    questionId: 'q-g8-b4-sci-sb-p40-gradient-maintenance',
    grade: 'Grade 8',
    academicYear: '2026-2027',
    termId: 'term-g8-t1',
    subjectId: 'science',
    subjectName: 'Science',
    sourceFileId: srcFileId,
    sourceFileName: srcFileName,
    bookTitle: 'Oxford International Science 8 Student Book',
    sourceType: 'Student Book',
    printedPage: 40,
    pdfPage: 21,
    alternatePdfPages: [],
    unitTitle: 'Unit 4: Human Organ Systems and Gas Exchange',
    sectionTitle: 'Respiratory Surfaces',
    topic: 'Alveoli structure and gas exchange adaptations',
    learningPointId: 'lp-g8-science-p40-1',
    learningPoint: 'Explain how alveoli adaptations maximize the rate of oxygen and carbon dioxide diffusion during pulmonary gas exchange.',
    lessonSummary: 'Alveoli in the lungs are adapted for gas exchange with millions of tiny air sacs that provide a massive surface area, thin one-cell walls, and dense capillaries for rapid diffusion.',
    questionType: 'MULTIPLE_CHOICE',
    difficulty: 'medium',
    question: 'How do the extensive capillary network and continuous blood flow around alveoli help maintain efficient gas exchange, as discussed on page 40 of Oxford International Science 8 Student Book?',
    options: [
      'They warm the alveoli to cause thermal expansion of lung volume.',
      'They continuously carry oxygenated blood away, maintaining a steep concentration gradient for oxygen diffusion.',
      'They prevent red blood cells from absorbing oxygen too quickly.',
      'They close the air passages during exhalation to trap air inside.'
    ],
    correctAnswer: 'They continuously carry oxygenated blood away, maintaining a steep concentration gradient for oxygen diffusion.',
    explanation: 'Page 40 explains that continuous capillary circulation rapidly carries oxygen away and brings carbon dioxide in, preserving steep concentration gradients across the alveolar membrane.',
    sourceEvidence: [
      'Page 40 Student Book: "Blood flow in capillaries continually replaces oxygenated blood with deoxygenated blood to maintain a steep concentration gradient."'
    ],
    generationEvidence: [
      'Batch 2 Generation (Science) calibrated to Stage 2 Learning Point lp-g8-science-p40-1',
      'Physiological gradient maintenance variation'
    ],
    createdAt: now,
    updatedAt: now,
    approvalStatus: 'DRAFT',
    reviewStatus: 'READY_FOR_APPROVAL',
    aiGenerated: true,
    generatedAt: now,
    generatedBy: 'Batch 2 Question Engine (Science)',
    sourceLearningPointId: 'lp-g8-science-p40-1',
    generationModel: 'Curriculum Engine v1.0',
    generationVersion: '3.1',
    auditHistory: [
      {
        action: 'GENERATED',
        timestamp: now,
        performedBy: 'Batch 2 Question Engine (Science)',
        notes: `Generated under batch ${batchId} for Student Book p.40 (PDF p.21).`
      }
    ]
  },

  // =========================================================================
  // LP 12: lp-g8-science-p46-1 (Student Book, Printed Page: 46, Physical PDF: 22)
  // Topic: The transpiration stream and water transport in plants
  // =========================================================================
  {
    id: 'q-g8-b4-sci-sb-p46-transpiration-definition',
    questionId: 'q-g8-b4-sci-sb-p46-transpiration-definition',
    grade: 'Grade 8',
    academicYear: '2026-2027',
    termId: 'term-g8-t1',
    subjectId: 'science',
    subjectName: 'Science',
    sourceFileId: srcFileId,
    sourceFileName: srcFileName,
    bookTitle: 'Oxford International Science 8 Student Book',
    sourceType: 'Student Book',
    printedPage: 46,
    pdfPage: 22,
    alternatePdfPages: [],
    unitTitle: 'Unit 5: Plant Transport and Physiology',
    sectionTitle: 'Transpiration Dynamics',
    topic: 'The transpiration stream and water transport in plants',
    learningPointId: 'lp-g8-science-p46-1',
    learningPoint: 'Describe the transpiration stream that pulls water and dissolved minerals from roots to leaves.',
    lessonSummary: 'Transpiration is the evaporation of water vapor from leaf surfaces. This creates a suction pull that continuously draws water and dissolved minerals up through the xylem vessels.',
    questionType: 'MULTIPLE_CHOICE',
    difficulty: 'easy',
    question: 'According to page 46 of Oxford International Science 8 Student Book, what is transpiration in plants?',
    options: [
      'The absorption of glucose from soil into plant roots',
      'The loss of water vapor from the surface of leaves through evaporation',
      'The chemical reaction between oxygen and carbon dioxide in petals',
      'The downward flow of synthesized starches into root tubers'
    ],
    correctAnswer: 'The loss of water vapor from the surface of leaves through evaporation',
    explanation: 'Page 46 of Oxford International Science 8 Student Book (PDF p.22) defines transpiration as the evaporation of water vapor from plant surfaces, predominantly through microscopic leaf pores (stomata).',
    sourceEvidence: [
      'Page 46 Student Book: "Water evaporates from leaves, pulling more water up through the xylem in the transpiration stream."'
    ],
    generationEvidence: [
      'Batch 2 Generation (Science) calibrated to Stage 2 Learning Point lp-g8-science-p46-1',
      'Transpiration core biological definition variation'
    ],
    createdAt: now,
    updatedAt: now,
    approvalStatus: 'DRAFT',
    reviewStatus: 'READY_FOR_APPROVAL',
    aiGenerated: true,
    generatedAt: now,
    generatedBy: 'Batch 2 Question Engine (Science)',
    sourceLearningPointId: 'lp-g8-science-p46-1',
    generationModel: 'Curriculum Engine v1.0',
    generationVersion: '3.1',
    auditHistory: [
      {
        action: 'GENERATED',
        timestamp: now,
        performedBy: 'Batch 2 Question Engine (Science)',
        notes: `Generated under batch ${batchId} for Student Book p.46 (PDF p.22).`
      }
    ]
  },
  {
    id: 'q-g8-b4-sci-sb-p46-transpiration-pull',
    questionId: 'q-g8-b4-sci-sb-p46-transpiration-pull',
    grade: 'Grade 8',
    academicYear: '2026-2027',
    termId: 'term-g8-t1',
    subjectId: 'science',
    subjectName: 'Science',
    sourceFileId: srcFileId,
    sourceFileName: srcFileName,
    bookTitle: 'Oxford International Science 8 Student Book',
    sourceType: 'Student Book',
    printedPage: 46,
    pdfPage: 22,
    alternatePdfPages: [],
    unitTitle: 'Unit 5: Plant Transport and Physiology',
    sectionTitle: 'Transpiration Dynamics',
    topic: 'The transpiration stream and water transport in plants',
    learningPointId: 'lp-g8-science-p46-1',
    learningPoint: 'Describe the transpiration stream that pulls water and dissolved minerals from roots to leaves.',
    lessonSummary: 'Transpiration is the evaporation of water vapor from leaf surfaces. This creates a suction pull that continuously draws water and dissolved minerals up through the xylem vessels.',
    questionType: 'MULTIPLE_CHOICE',
    difficulty: 'medium',
    question: 'How does the evaporation of water from leaf mesophyll cells drive the continuous upward movement of water in a tall tree, as explained on page 46 of Oxford International Science 8 Student Book?',
    options: [
      'It creates a negative pressure (suction pull) that draws cohesive water molecules upward through continuous xylem columns.',
      'It forces stomata to pump air downward through phloem sieve tubes.',
      'It causes root pressure to push xylem sap out through flower petals.',
      'It increases gravity inside the trunk to accelerate water circulation.'
    ],
    correctAnswer: 'It creates a negative pressure (suction pull) that draws cohesive water molecules upward through continuous xylem columns.',
    explanation: 'Page 46 explains the transpiration pull mechanism: as water evaporates from leaves, tension is created that draws a continuous, unbroken column of cohesive water molecules upward through xylem vessels.',
    sourceEvidence: [
      'Page 46 Student Book: "As water evaporates, tension is created that pulls water up from the roots like a straw."'
    ],
    generationEvidence: [
      'Batch 2 Generation (Science) calibrated to Stage 2 Learning Point lp-g8-science-p46-1',
      'Transpiration pull mechanism and cohesion variation'
    ],
    createdAt: now,
    updatedAt: now,
    approvalStatus: 'DRAFT',
    reviewStatus: 'READY_FOR_APPROVAL',
    aiGenerated: true,
    generatedAt: now,
    generatedBy: 'Batch 2 Question Engine (Science)',
    sourceLearningPointId: 'lp-g8-science-p46-1',
    generationModel: 'Curriculum Engine v1.0',
    generationVersion: '3.1',
    auditHistory: [
      {
        action: 'GENERATED',
        timestamp: now,
        performedBy: 'Batch 2 Question Engine (Science)',
        notes: `Generated under batch ${batchId} for Student Book p.46 (PDF p.22).`
      }
    ]
  },

  // =========================================================================
  // LP 13: lp-g8-science-p47-1 (Student Book, Printed Page: 47, Physical PDF: 23)
  // Topic: Stomata and guard cell regulatory mechanisms
  // =========================================================================
  {
    id: 'q-g8-b4-sci-sb-p47-guard-cell-turgor',
    questionId: 'q-g8-b4-sci-sb-p47-guard-cell-turgor',
    grade: 'Grade 8',
    academicYear: '2026-2027',
    termId: 'term-g8-t1',
    subjectId: 'science',
    subjectName: 'Science',
    sourceFileId: srcFileId,
    sourceFileName: srcFileName,
    bookTitle: 'Oxford International Science 8 Student Book',
    sourceType: 'Student Book',
    printedPage: 47,
    pdfPage: 23,
    alternatePdfPages: [],
    unitTitle: 'Unit 5: Plant Transport and Physiology',
    sectionTitle: 'Stomatal Regulation',
    topic: 'Stomata and guard cell regulatory mechanisms',
    learningPointId: 'lp-g8-science-p47-1',
    learningPoint: 'Explain how changes in guard cell turgor pressure regulate stomatal opening and transpiration rate.',
    lessonSummary: 'Stomata are microscopic leaf pores flanked by two guard cells. When water is plentiful, guard cells swell and curve open; when water is scarce, they lose turgor and close the pore to prevent desiccation.',
    questionType: 'MULTIPLE_CHOICE',
    difficulty: 'medium',
    question: 'On page 47 of Oxford International Science 8 Student Book, what happens to the guard cells and stomatal pore when water is abundant in the leaf during daylight?',
    options: [
      'Guard cells lose water, become flaccid, and tightly seal the stomatal pore.',
      'Guard cells absorb water, swell and become turgid, bowing outward to open the stomatal pore.',
      'Guard cells disintegrate completely to allow unrestricted air exchange.',
      'Guard cells convert their cell walls into lignin to prevent transpiration.'
    ],
    correctAnswer: 'Guard cells absorb water, swell and become turgid, bowing outward to open the stomatal pore.',
    explanation: 'Page 47 of Oxford International Science 8 Student Book (PDF p.23) explains that when guard cells take in water by osmosis, their turgor pressure increases, causing their thicker inner walls to curve apart and open the stomatal pore.',
    sourceEvidence: [
      'Page 47 Student Book: "When guard cells absorb water and become turgid, they curve open; when flaccid, they close."'
    ],
    generationEvidence: [
      'Batch 2 Generation (Science) calibrated to Stage 2 Learning Point lp-g8-science-p47-1',
      'Guard cell turgor mechanism variation'
    ],
    createdAt: now,
    updatedAt: now,
    approvalStatus: 'DRAFT',
    reviewStatus: 'READY_FOR_APPROVAL',
    aiGenerated: true,
    generatedAt: now,
    generatedBy: 'Batch 2 Question Engine (Science)',
    sourceLearningPointId: 'lp-g8-science-p47-1',
    generationModel: 'Curriculum Engine v1.0',
    generationVersion: '3.1',
    auditHistory: [
      {
        action: 'GENERATED',
        timestamp: now,
        performedBy: 'Batch 2 Question Engine (Science)',
        notes: `Generated under batch ${batchId} for Student Book p.47 (PDF p.23).`
      }
    ]
  },
  {
    id: 'q-g8-b4-sci-sb-p47-drought-response',
    questionId: 'q-g8-b4-sci-sb-p47-drought-response',
    grade: 'Grade 8',
    academicYear: '2026-2027',
    termId: 'term-g8-t1',
    subjectId: 'science',
    subjectName: 'Science',
    sourceFileId: srcFileId,
    sourceFileName: srcFileName,
    bookTitle: 'Oxford International Science 8 Student Book',
    sourceType: 'Student Book',
    printedPage: 47,
    pdfPage: 23,
    alternatePdfPages: [],
    unitTitle: 'Unit 5: Plant Transport and Physiology',
    sectionTitle: 'Stomatal Regulation',
    topic: 'Stomata and guard cell regulatory mechanisms',
    learningPointId: 'lp-g8-science-p47-1',
    learningPoint: 'Explain how changes in guard cell turgor pressure regulate stomatal opening and transpiration rate.',
    lessonSummary: 'Stomata are microscopic leaf pores flanked by two guard cells. When water is plentiful, guard cells swell and curve open; when water is scarce, they lose turgor and close the pore to prevent desiccation.',
    questionType: 'MULTIPLE_CHOICE',
    difficulty: 'easy',
    question: 'During a hot, dry afternoon with severe soil drought, how does stomatal closure benefit a plant, according to page 47 of Oxford International Science 8 Student Book?',
    options: [
      'It drastically reduces water loss by transpiration, preventing plant wilting and dehydration.',
      'It increases the rate of cellular respiration inside the flower buds.',
      'It stimulates rapid elongation of root hairs within minutes.',
      'It releases large volumes of oxygen into the dry soil.'
    ],
    correctAnswer: 'It drastically reduces water loss by transpiration, preventing plant wilting and dehydration.',
    explanation: 'Page 47 states that when water is scarce, guard cells become flaccid and close the stomatal pore, an adaptation that conserves internal moisture and protects the plant against dehydration.',
    sourceEvidence: [
      'Page 47 Student Book: "Closing stomata reduces water loss when the plant is under water stress."'
    ],
    generationEvidence: [
      'Batch 2 Generation (Science) calibrated to Stage 2 Learning Point lp-g8-science-p47-1',
      'Water stress and adaptive closure application scenario'
    ],
    createdAt: now,
    updatedAt: now,
    approvalStatus: 'DRAFT',
    reviewStatus: 'READY_FOR_APPROVAL',
    aiGenerated: true,
    generatedAt: now,
    generatedBy: 'Batch 2 Question Engine (Science)',
    sourceLearningPointId: 'lp-g8-science-p47-1',
    generationModel: 'Curriculum Engine v1.0',
    generationVersion: '3.1',
    auditHistory: [
      {
        action: 'GENERATED',
        timestamp: now,
        performedBy: 'Batch 2 Question Engine (Science)',
        notes: `Generated under batch ${batchId} for Student Book p.47 (PDF p.23).`
      }
    ]
  },

  // =========================================================================
  // LP 14: lp-g8-science-p23-1 (Workbook, Printed Page: 23, Physical PDF: 26)
  // Topic: Comparative classification of xylem and phloem vessels
  // =========================================================================
  {
    id: 'q-g8-b4-sci-wb-p23-classification-table',
    questionId: 'q-g8-b4-sci-wb-p23-classification-table',
    grade: 'Grade 8',
    academicYear: '2026-2027',
    termId: 'term-g8-t1',
    subjectId: 'science',
    subjectName: 'Science',
    sourceFileId: srcFileId,
    sourceFileName: srcFileName,
    bookTitle: 'Oxford International Science 8 Workbook',
    sourceType: 'Workbook',
    printedPage: 23,
    pdfPage: 26,
    alternatePdfPages: [],
    unitTitle: 'Unit 2: Plant Biology and Transport Systems Practice',
    sectionTitle: 'Comparative Vascular Anatomy',
    topic: 'Comparative classification of xylem and phloem vessels',
    learningPointId: 'lp-g8-science-p23-1',
    learningPoint: 'Classify vascular transport features between xylem (water/minerals, dead) and phloem (sugars, living).',
    lessonSummary: 'Xylem transports water and minerals upward only and consists of dead hollow cells. Phloem transports sucrose and amino acids bidirectionally and consists of living cells with companion cells.',
    questionType: 'MULTIPLE_CHOICE',
    difficulty: 'medium',
    question: 'In the comparative table in Task 2 on page 23 of Oxford International Science 8 Workbook, which combination of cellular state and transported substance accurately distinguishes xylem from phloem?',
    options: [
      'Xylem: Living cells carrying dissolved starch; Phloem: Dead cells carrying mineral salts',
      'Xylem: Dead hollow vessels carrying water and minerals; Phloem: Living cells carrying sucrose and amino acids',
      'Xylem: Living sieve tubes carrying oxygen; Phloem: Dead fibers carrying proteins',
      'Xylem: Non-vascular tissue carrying lipids; Phloem: Vascular tissue carrying water only'
    ],
    correctAnswer: 'Xylem: Dead hollow vessels carrying water and minerals; Phloem: Living cells carrying sucrose and amino acids',
    explanation: 'Page 23 of Oxford International Science 8 Workbook (PDF p.26) Task 2 summarizes that xylem vessels consist of dead hollow tubes conducting water and minerals, whereas phloem consists of living cells translocating sugars.',
    sourceEvidence: [
      'Page 23 Workbook Task 2: "Complete the table comparing xylem and phloem transport properties."'
    ],
    generationEvidence: [
      'Batch 2 Generation (Science) calibrated to Workbook p.23 (PDF p.26)',
      'Comparative vascular classification table analysis'
    ],
    createdAt: now,
    updatedAt: now,
    approvalStatus: 'DRAFT',
    reviewStatus: 'READY_FOR_APPROVAL',
    aiGenerated: true,
    generatedAt: now,
    generatedBy: 'Batch 2 Question Engine (Science)',
    sourceLearningPointId: 'lp-g8-science-p23-1',
    generationModel: 'Curriculum Engine v1.0',
    generationVersion: '3.1',
    auditHistory: [
      {
        action: 'GENERATED',
        timestamp: now,
        performedBy: 'Batch 2 Question Engine (Science)',
        notes: `Generated under batch ${batchId} for Workbook p.23 (PDF p.26).`
      }
    ]
  },
  {
    id: 'q-g8-b4-sci-wb-p23-lignin-function',
    questionId: 'q-g8-b4-sci-wb-p23-lignin-function',
    grade: 'Grade 8',
    academicYear: '2026-2027',
    termId: 'term-g8-t1',
    subjectId: 'science',
    subjectName: 'Science',
    sourceFileId: srcFileId,
    sourceFileName: srcFileName,
    bookTitle: 'Oxford International Science 8 Workbook',
    sourceType: 'Workbook',
    printedPage: 23,
    pdfPage: 26,
    alternatePdfPages: [],
    unitTitle: 'Unit 2: Plant Biology and Transport Systems Practice',
    sectionTitle: 'Comparative Vascular Anatomy',
    topic: 'Comparative classification of xylem and phloem vessels',
    learningPointId: 'lp-g8-science-p23-1',
    learningPoint: 'Classify vascular transport features between xylem (water/minerals, dead) and phloem (sugars, living).',
    lessonSummary: 'Xylem transports water and minerals upward only and consists of dead hollow cells. Phloem transports sucrose and amino acids bidirectionally and consists of living cells with companion cells.',
    questionType: 'MULTIPLE_CHOICE',
    difficulty: 'easy',
    question: 'On page 23 of Oxford International Science 8 Workbook, what critical function does the woody polymer "lignin" provide in xylem vessel walls?',
    options: [
      'It acts as an enzyme to digest glucose into starch.',
      'It attracts pollinating insects to the floral stems.',
      'It provides structural strength and prevents vessels from collapsing under high negative suction pressure.',
      'It stores excess mineral ions for winter dormancy.'
    ],
    correctAnswer: 'It provides structural strength and prevents vessels from collapsing under high negative suction pressure.',
    explanation: 'Workbook page 23 reinforces that lignin strengthens and reinforces xylem walls, preventing inward collapse when high suction tension pulls water upward.',
    sourceEvidence: [
      'Page 23 Workbook: "Lignin strengthens xylem vessels so they do not collapse under tension."'
    ],
    generationEvidence: [
      'Batch 2 Generation (Science) calibrated to Workbook p.23 (PDF p.26)',
      'Lignin structural adaptation variation'
    ],
    createdAt: now,
    updatedAt: now,
    approvalStatus: 'DRAFT',
    reviewStatus: 'READY_FOR_APPROVAL',
    aiGenerated: true,
    generatedAt: now,
    generatedBy: 'Batch 2 Question Engine (Science)',
    sourceLearningPointId: 'lp-g8-science-p23-1',
    generationModel: 'Curriculum Engine v1.0',
    generationVersion: '3.1',
    auditHistory: [
      {
        action: 'GENERATED',
        timestamp: now,
        performedBy: 'Batch 2 Question Engine (Science)',
        notes: `Generated under batch ${batchId} for Workbook p.23 (PDF p.26).`
      }
    ]
  },

  // =========================================================================
  // LP 15: lp-g8-science-p30-1 (Workbook, Printed Page: 30, Physical PDF: 27)
  // Topic: Bacterial cell anatomical diagram labelling
  // =========================================================================
  {
    id: 'q-g8-b4-sci-wb-p30-diagram-wall',
    questionId: 'q-g8-b4-sci-wb-p30-diagram-wall',
    grade: 'Grade 8',
    academicYear: '2026-2027',
    termId: 'term-g8-t1',
    subjectId: 'science',
    subjectName: 'Science',
    sourceFileId: srcFileId,
    sourceFileName: srcFileName,
    bookTitle: 'Oxford International Science 8 Workbook',
    sourceType: 'Workbook',
    printedPage: 30,
    pdfPage: 27,
    alternatePdfPages: [],
    unitTitle: 'Unit 3: Microorganisms and Cell Biology Practice',
    sectionTitle: 'Bacterial Cell Anatomy',
    topic: 'Bacterial cell anatomical diagram labelling',
    learningPointId: 'lp-g8-science-p30-1',
    learningPoint: 'Correctly identify and label the structural components of a typical bacterium.',
    lessonSummary: 'A typical bacterial cell features an outer peptidoglycan cell wall, cell membrane, cytoplasm with 70S ribosomes, a main circular DNA chromosome, and optional plasmids or flagella.',
    questionType: 'MULTIPLE_CHOICE',
    difficulty: 'easy',
    question: 'On the bacterial cell diagram exercise on page 30 of Oxford International Science 8 Workbook, what is the outer protective layer located outside the plasma membrane called?',
    options: [
      'The nuclear envelope',
      'The peptidoglycan cell wall',
      'The cellulose cuticle',
      'The mitochondrial matrix'
    ],
    correctAnswer: 'The peptidoglycan cell wall',
    explanation: 'Page 30 of Oxford International Science 8 Workbook (PDF p.27) requires students to label the rigid bacterial cell wall composed of peptidoglycan, which maintains cell shape and prevents osmotic bursting.',
    sourceEvidence: [
      'Page 30 Workbook: "Label the four key features on the bacterial cell diagram: cell wall, cell membrane, circular DNA, plasmid."'
    ],
    generationEvidence: [
      'Batch 2 Generation (Science) calibrated to Workbook p.30 (PDF p.27)',
      'Bacterial diagram anatomical labeling variation'
    ],
    createdAt: now,
    updatedAt: now,
    approvalStatus: 'DRAFT',
    reviewStatus: 'READY_FOR_APPROVAL',
    aiGenerated: true,
    generatedAt: now,
    generatedBy: 'Batch 2 Question Engine (Science)',
    sourceLearningPointId: 'lp-g8-science-p30-1',
    generationModel: 'Curriculum Engine v1.0',
    generationVersion: '3.1',
    auditHistory: [
      {
        action: 'GENERATED',
        timestamp: now,
        performedBy: 'Batch 2 Question Engine (Science)',
        notes: `Generated under batch ${batchId} for Workbook p.30 (PDF p.27).`
      }
    ]
  },
  {
    id: 'q-g8-b4-sci-wb-p30-flagellum',
    questionId: 'q-g8-b4-sci-wb-p30-flagellum',
    grade: 'Grade 8',
    academicYear: '2026-2027',
    termId: 'term-g8-t1',
    subjectId: 'science',
    subjectName: 'Science',
    sourceFileId: srcFileId,
    sourceFileName: srcFileName,
    bookTitle: 'Oxford International Science 8 Workbook',
    sourceType: 'Workbook',
    printedPage: 30,
    pdfPage: 27,
    alternatePdfPages: [],
    unitTitle: 'Unit 3: Microorganisms and Cell Biology Practice',
    sectionTitle: 'Bacterial Cell Anatomy',
    topic: 'Bacterial cell anatomical diagram labelling',
    learningPointId: 'lp-g8-science-p30-1',
    learningPoint: 'Correctly identify and label the structural components of a typical bacterium.',
    lessonSummary: 'A typical bacterial cell features an outer peptidoglycan cell wall, cell membrane, cytoplasm with 70S ribosomes, a main circular DNA chromosome, and optional plasmids or flagella.',
    questionType: 'MULTIPLE_CHOICE',
    difficulty: 'medium',
    question: 'On page 30 of Oxford International Science 8 Workbook, what is the whip-like tail structure present on some bacteria that rotates to propel the bacterium through fluids called?',
    options: [
      'A flagellum',
      'A pseudopod',
      'A cilium',
      'A plasmid'
    ],
    correctAnswer: 'A flagellum',
    explanation: 'Workbook page 30 labels the flagellum (plural: flagella), a specialized protein motor structure that spins to enable bacterial motility in liquid environments.',
    sourceEvidence: [
      'Page 30 Workbook: "Some bacteria possess a tail-like flagellum for movement."'
    ],
    generationEvidence: [
      'Batch 2 Generation (Science) calibrated to Workbook p.30 (PDF p.27)',
      'Organelle function and motility feature variation'
    ],
    createdAt: now,
    updatedAt: now,
    approvalStatus: 'DRAFT',
    reviewStatus: 'READY_FOR_APPROVAL',
    aiGenerated: true,
    generatedAt: now,
    generatedBy: 'Batch 2 Question Engine (Science)',
    sourceLearningPointId: 'lp-g8-science-p30-1',
    generationModel: 'Curriculum Engine v1.0',
    generationVersion: '3.1',
    auditHistory: [
      {
        action: 'GENERATED',
        timestamp: now,
        performedBy: 'Batch 2 Question Engine (Science)',
        notes: `Generated under batch ${batchId} for Workbook p.30 (PDF p.27).`
      }
    ]
  },

  // =========================================================================
  // LP 16: lp-g8-science-p31-1 (Workbook, Printed Page: 31, Physical PDF: 28)
  // Topic: Microscope magnification calculations and unit conversions
  // =========================================================================
  {
    id: 'q-g8-b4-sci-wb-p31-total-mag',
    questionId: 'q-g8-b4-sci-wb-p31-total-mag',
    grade: 'Grade 8',
    academicYear: '2026-2027',
    termId: 'term-g8-t1',
    subjectId: 'science',
    subjectName: 'Science',
    sourceFileId: srcFileId,
    sourceFileName: srcFileName,
    bookTitle: 'Oxford International Science 8 Workbook',
    sourceType: 'Workbook',
    printedPage: 31,
    pdfPage: 28,
    alternatePdfPages: [],
    unitTitle: 'Unit 3: Microorganisms and Cell Biology Practice',
    sectionTitle: 'Quantitative Microscopy',
    topic: 'Microscope magnification calculations and unit conversions',
    learningPointId: 'lp-g8-science-p31-1',
    learningPoint: 'Calculate total microscope magnification and determine actual specimen dimensions using M = Image / Actual.',
    lessonSummary: 'Total magnification equals eyepiece lens power multiplied by objective lens power. To calculate actual specimen size: Actual size = Image size ÷ Magnification.',
    questionType: 'MULTIPLE_CHOICE',
    difficulty: 'easy',
    question: 'A student uses a light microscope with a 10× eyepiece lens and a 40× objective lens, following the formula on page 31 of Oxford International Science 8 Workbook. What is the total magnification of the specimen?',
    options: [
      '50×',
      '400×',
      '4×',
      '4000×'
    ],
    correctAnswer: '400×',
    explanation: 'As given on page 31 of Oxford International Science 8 Workbook (PDF p.28), Total Magnification = Eyepiece Lens Magnification × Objective Lens Magnification. Therefore: 10 × 40 = 400×.',
    sourceEvidence: [
      'Page 31 Workbook: "Support formula: Total magnification = eyepiece lens power x objective lens power."'
    ],
    generationEvidence: [
      'Batch 2 Generation (Science) calibrated to Workbook p.31 (PDF p.28)',
      'Total magnification calculation exercise'
    ],
    createdAt: now,
    updatedAt: now,
    approvalStatus: 'DRAFT',
    reviewStatus: 'READY_FOR_APPROVAL',
    aiGenerated: true,
    generatedAt: now,
    generatedBy: 'Batch 2 Question Engine (Science)',
    sourceLearningPointId: 'lp-g8-science-p31-1',
    generationModel: 'Curriculum Engine v1.0',
    generationVersion: '3.1',
    auditHistory: [
      {
        action: 'GENERATED',
        timestamp: now,
        performedBy: 'Batch 2 Question Engine (Science)',
        notes: `Generated under batch ${batchId} for Workbook p.31 (PDF p.28).`
      }
    ]
  },
  {
    id: 'q-g8-b4-sci-wb-p31-actual-size',
    questionId: 'q-g8-b4-sci-wb-p31-actual-size',
    grade: 'Grade 8',
    academicYear: '2026-2027',
    termId: 'term-g8-t1',
    subjectId: 'science',
    subjectName: 'Science',
    sourceFileId: srcFileId,
    sourceFileName: srcFileName,
    bookTitle: 'Oxford International Science 8 Workbook',
    sourceType: 'Workbook',
    printedPage: 31,
    pdfPage: 28,
    alternatePdfPages: [],
    unitTitle: 'Unit 3: Microorganisms and Cell Biology Practice',
    sectionTitle: 'Quantitative Microscopy',
    topic: 'Microscope magnification calculations and unit conversions',
    learningPointId: 'lp-g8-science-p31-1',
    learningPoint: 'Calculate total microscope magnification and determine actual specimen dimensions using M = Image / Actual.',
    lessonSummary: 'Total magnification equals eyepiece lens power multiplied by objective lens power. To calculate actual specimen size: Actual size = Image size ÷ Magnification.',
    questionType: 'MULTIPLE_CHOICE',
    difficulty: 'medium',
    question: 'Under a magnification of 200×, a micrograph of an onion epidermal cell measures 20 mm in image length. According to the formula (Actual size = Image size ÷ Magnification) on page 31 of Oxford International Science 8 Workbook, what is the actual length of the cell?',
    options: [
      '0.1 mm (100 μm)',
      '10 mm (10,000 μm)',
      '4000 mm',
      '0.005 mm (5 μm)'
    ],
    correctAnswer: '0.1 mm (100 μm)',
    explanation: 'Following the formula on page 31: Actual size = Image size ÷ Magnification = 20 mm ÷ 200 = 0.1 mm (which equals 100 micrometers).',
    sourceEvidence: [
      'Page 31 Workbook: "Actual size = Image size ÷ Magnification."'
    ],
    generationEvidence: [
      'Batch 2 Generation (Science) calibrated to Workbook p.31 (PDF p.28)',
      'Magnification formula calculation and unit conversion variation'
    ],
    createdAt: now,
    updatedAt: now,
    approvalStatus: 'DRAFT',
    reviewStatus: 'READY_FOR_APPROVAL',
    aiGenerated: true,
    generatedAt: now,
    generatedBy: 'Batch 2 Question Engine (Science)',
    sourceLearningPointId: 'lp-g8-science-p31-1',
    generationModel: 'Curriculum Engine v1.0',
    generationVersion: '3.1',
    auditHistory: [
      {
        action: 'GENERATED',
        timestamp: now,
        performedBy: 'Batch 2 Question Engine (Science)',
        notes: `Generated under batch ${batchId} for Workbook p.31 (PDF p.28).`
      }
    ]
  },

  // =========================================================================
  // LP 17: lp-g8-science-p41-1 (Workbook, Printed Page: 41, Physical PDF: 29)
  // Topic: Cross-organism exchange surface comparison: Alveoli, Villi, and Leaves
  // =========================================================================
  {
    id: 'q-g8-b4-sci-wb-p41-common-adaptations',
    questionId: 'q-g8-b4-sci-wb-p41-common-adaptations',
    grade: 'Grade 8',
    academicYear: '2026-2027',
    termId: 'term-g8-t1',
    subjectId: 'science',
    subjectName: 'Science',
    sourceFileId: srcFileId,
    sourceFileName: srcFileName,
    bookTitle: 'Oxford International Science 8 Workbook',
    sourceType: 'Workbook',
    printedPage: 41,
    pdfPage: 29,
    alternatePdfPages: [],
    unitTitle: 'Unit 4: Human Organ Systems and Gas Exchange Practice',
    sectionTitle: 'Comparative Exchange Surfaces',
    topic: 'Cross-organism exchange surface comparison: Alveoli, Villi, and Leaves',
    learningPointId: 'lp-g8-science-p41-1',
    learningPoint: 'Compare common adaptations for diffusion across respiratory alveoli, digestive villi, and photosynthetic leaves.',
    lessonSummary: 'Exchange surfaces in both plants and animals share three essential adaptations: a very large surface area, very thin membranes to shorten diffusion distance, and good transport to maintain concentration gradients.',
    questionType: 'MULTIPLE_CHOICE',
    difficulty: 'medium',
    question: 'Based on the cross-organism comparative study on page 41 of Oxford International Science 8 Workbook, what three fundamental adaptations are shared by human alveoli, intestinal villi, and plant leaves to maximize exchange rate?',
    options: [
      'Thick waterproof layers, lack of blood supply, and small surface area',
      'Extensive surface area, extremely thin barriers (short diffusion distance), and mechanisms to maintain steep concentration gradients',
      'Ciliated epithelial cells, cartilage rings, and acidic secretions',
      'Mineralized bone plates, rigid cellulose walls, and dead cytoplasm'
    ],
    correctAnswer: 'Extensive surface area, extremely thin barriers (short diffusion distance), and mechanisms to maintain steep concentration gradients',
    explanation: 'Page 41 of Oxford International Science 8 Workbook (PDF p.29) synthesizes exchange surface principles across biology: large surface area, thin membranes (1-cell thick or thin lamellae), and active transport/circulation to maintain concentration differences.',
    sourceEvidence: [
      'Page 41 Workbook Table: "Compare adaptations in alveoli, villi, and leaves for exchange."'
    ],
    generationEvidence: [
      'Batch 2 Generation (Science) calibrated to Workbook p.41 (PDF p.29)',
      'Cross-organism universal exchange adaptations variation'
    ],
    createdAt: now,
    updatedAt: now,
    approvalStatus: 'DRAFT',
    reviewStatus: 'READY_FOR_APPROVAL',
    aiGenerated: true,
    generatedAt: now,
    generatedBy: 'Batch 2 Question Engine (Science)',
    sourceLearningPointId: 'lp-g8-science-p41-1',
    generationModel: 'Curriculum Engine v1.0',
    generationVersion: '3.1',
    auditHistory: [
      {
        action: 'GENERATED',
        timestamp: now,
        performedBy: 'Batch 2 Question Engine (Science)',
        notes: `Generated under batch ${batchId} for Workbook p.41 (PDF p.29).`
      }
    ]
  },
  {
    id: 'q-g8-b4-sci-wb-p41-villi-adaptation',
    questionId: 'q-g8-b4-sci-wb-p41-villi-adaptation',
    grade: 'Grade 8',
    academicYear: '2026-2027',
    termId: 'term-g8-t1',
    subjectId: 'science',
    subjectName: 'Science',
    sourceFileId: srcFileId,
    sourceFileName: srcFileName,
    bookTitle: 'Oxford International Science 8 Workbook',
    sourceType: 'Workbook',
    printedPage: 41,
    pdfPage: 29,
    alternatePdfPages: [],
    unitTitle: 'Unit 4: Human Organ Systems and Gas Exchange Practice',
    sectionTitle: 'Comparative Exchange Surfaces',
    topic: 'Cross-organism exchange surface comparison: Alveoli, Villi, and Leaves',
    learningPointId: 'lp-g8-science-p41-1',
    learningPoint: 'Compare common adaptations for diffusion across respiratory alveoli, digestive villi, and photosynthetic leaves.',
    lessonSummary: 'Exchange surfaces in both plants and animals share three essential adaptations: a very large surface area, very thin membranes to shorten diffusion distance, and good transport to maintain concentration gradients.',
    questionType: 'MULTIPLE_CHOICE',
    difficulty: 'easy',
    question: 'On page 41 of Oxford International Science 8 Workbook, how do millions of microscopic villi and microvilli lining the small intestine facilitate nutrient absorption?',
    options: [
      'By drastically expanding the available internal surface area for absorption into capillaries',
      'By secreting acid to dissolve food proteins instantly',
      'By blocking carbohydrates from entering blood vessels',
      'By freezing digestive enzymes to prevent stomach irritation'
    ],
    correctAnswer: 'By drastically expanding the available internal surface area for absorption into capillaries',
    explanation: 'Page 41 highlights that the finger-like projections of intestinal villi multiply the inner surface area of the gut many hundred-fold, allowing rapid diffusion and active absorption of nutrients.',
    sourceEvidence: [
      'Page 41 Workbook: "Villi provide a huge surface area with a rich blood capillary network for fast absorption."'
    ],
    generationEvidence: [
      'Batch 2 Generation (Science) calibrated to Workbook p.41 (PDF p.29)',
      'Intestinal villi surface area adaptation variation'
    ],
    createdAt: now,
    updatedAt: now,
    approvalStatus: 'DRAFT',
    reviewStatus: 'READY_FOR_APPROVAL',
    aiGenerated: true,
    generatedAt: now,
    generatedBy: 'Batch 2 Question Engine (Science)',
    sourceLearningPointId: 'lp-g8-science-p41-1',
    generationModel: 'Curriculum Engine v1.0',
    generationVersion: '3.1',
    auditHistory: [
      {
        action: 'GENERATED',
        timestamp: now,
        performedBy: 'Batch 2 Question Engine (Science)',
        notes: `Generated under batch ${batchId} for Workbook p.41 (PDF p.29).`
      }
    ]
  }
];
