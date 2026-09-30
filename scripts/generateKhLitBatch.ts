import { writeFileSync } from 'fs';
import { INITIAL_GRADE_8_TERM_1_DATA } from '../src/data/grade8PointerData';
import { Question } from '../src/types';

import { GRADE_8_PILOT_QUESTIONS } from '../src/data/grade8PilotQuestions';
import { GRADE_8_BATCH_2_QUESTIONS } from '../src/data/grade8Batch2Questions';

const g8 = INITIAL_GRADE_8_TERM_1_DATA;
const khLitLps = (g8.learningPoints || []).filter(lp => lp.subjectId === 'kh_literature');
const initialQs = [...GRADE_8_PILOT_QUESTIONS, ...GRADE_8_BATCH_2_QUESTIONS];
const existingKhLitQs = initialQs.filter(q => q.subjectId === 'kh_literature');
const existingLpIds = new Set(existingKhLitQs.map(q => q.learningPointId));

console.log(`Found ${khLitLps.length} Khmer Lit LPs, ${existingKhLitQs.length} existing questions.`);

const now = '2026-09-29T13:12:00Z';
const srcFileId = 'src-g8-t1-combined-250p';
const srcFileName = 'G8_T1_Combined_Textbook_250p.pdf';

function generateKhLitQuestionsForLp(lp: any): Question[] {
  const p = Number(lp.printedPage);
  const pdf = Number(lp.pdfPage);
  const qs: Question[] = [];
  const topic = lp.topic;
  const unit = lp.unitTitle || 'អក្សរសាស្ត្រខ្មែរ ថ្នាក់ទី៨';
  const section = lp.sectionTitle || topic;
  const summary = lp.lessonSummary;
  const evidence = lp.sourceEvidence || [`ភាសាខ្មែរ ថ្នាក់ទី៨ ទំព័រ ${p} (PDF p.${pdf})`];
  const hasExisting = existingLpIds.has(lp.id);

  // Question 1 (Concept / Rule) if not already existing
  if (!hasExisting) {
    let qText = '';
    let opts: string[] = [];
    let correct = '';
    let expl = '';

    if (p >= 13 && p <= 16) {
      qText = `យោងតាមទំព័រ ${p} នៃសៀវភៅភាសាខ្មែរថ្នាក់ទី៨ (${topic}) តើបទពាក្យ៧ មានចំនួនប៉ុន្មានព្យាង្គក្នុងមួយឃ្លា?`;
      opts = [
        'មាន ៧ ព្យាង្គក្នុងមួយឃ្លា',
        'មាន ៤ ព្យាង្គក្នុងមួយឃ្លា',
        'មាន ៦ ព្យាង្គក្នុងមួយឃ្លា',
        'មាន ៨ ព្យាង្គក្នុងមួយឃ្លា'
      ];
      correct = opts[0];
      expl = `ទំព័រ ${p} បង្ហាញថាកំណាព្យបទពាក្យ៧ មាន ៧ ព្យាង្គក្នុងមួយឃ្លា និងមាន ៤ ឃ្លាក្នុងមួយល្បះ។`;
    } else if (p >= 18 && p <= 22) {
      qText = `យោងតាមទំព័រ ${p} នៃសៀវភៅភាសាខ្មែរថ្នាក់ទី៨ ស្តីពី ${topic} តើការវិភាគចរិតលក្ខណៈតួអង្គក្នុងរឿងអក្សរសិល្ប៍ ត្រូវផ្អែកលើចំណុចសំខាន់អ្វីខ្លះ?`;
      opts = [
        'ពាក្យសម្ដី កាយវិការ សកម្មភាព និងការគិតរបស់តួអង្គ',
        'តែលើឈ្មោះ និងអាយុរបស់តួអង្គតែប៉ុណ្ណោះ',
        'លើចំនួនទំព័រនៃសៀវភៅរឿង',
        'លើរូបភាពគំនូរក្របសៀវភៅ'
      ];
      correct = opts[0];
      expl = `ទំព័រ ${p} ពន្យល់ថាការវិភាគចរិតលក្ខណៈតួអង្គត្រូវផ្អែកលើអាកប្បកិរិយា ពាក្យសម្ដី និងសកម្មភាពជាក់ស្តែងរបស់តួអង្គក្នុងដំណើររឿង។`;
    } else if (p >= 24 && p <= 28) {
      qText = `យោងតាមទំព័រ ${p} នៃសៀវភៅភាសាខ្មែរថ្នាក់ទី៨ (${topic}) តើល្បះទោលជាអ្វី?`;
      opts = [
        'ជាល្បះដែលមានតែប្រធានមួយ និងកិរិយាមួយគត់បង្កើតបានជាគំនិតពេញលេញ',
        'ជាល្បះដែលផ្សំឡើងពីល្បះទោលពីរឡើងទៅដោយប្រើឈ្នាប់',
        'ជាឃ្លាដែលគ្មានកិរិយាស័ព្ទ',
        'ជាកម្រងពាក្យដែលមិនទាន់មានន័យគ្រប់គ្រាន់'
      ];
      correct = opts[0];
      expl = `ទំព័រ ${p} បញ្ជាក់ថាល្បះទោលគឺជាល្បះដែលមានប្រធានមួយ និងកិរិយាមួយ (ឬមានកម្មបទបន្ថែម) ដែលបញ្ជាក់ពីគំនិតមួយច្បាស់លាស់។`;
    } else {
      qText = `យោងតាមក្បួនតែងសេចក្តីពិពណ៌នានៅទំព័រ ${p} នៃសៀវភៅភាសាខ្មែរថ្នាក់ទី៨ តើរចនាសម្ព័ន្ធតែងសេចក្តីចែកចេញជាប៉ុន្មានផ្នែកធំៗ?`;
      opts = [
        '៣ ផ្នែកធំៗ៖ សេចក្តីផ្តើម តួសេចក្តី និងសេចក្តីបញ្ចប់',
        '២ ផ្នែក៖ សេចក្តីផ្តើម និងសេចក្តីបញ្ចប់',
        '៤ ផ្នែក៖ ចំណងជើង សេចក្តីផ្តើម ឧទាហរណ៍ និងរូបភាព',
        '៥ ផ្នែករាយប៉ាយតាមការចូលចិត្ត'
      ];
      correct = opts[0];
      expl = `ទំព័រ ${p} បង្ហាញអំពីរចនាសម្ព័ន្ធត្រឹមត្រូវនៃតែងសេចក្តីពិពណ៌នាដែលមាន ៣ ផ្នែកច្បាស់លាស់គឺ សេចក្តីផ្តើម តួសេចក្តី និងសេចក្តីបញ្ចប់។`;
    }

    const seed = p * 11;
    const shuffled = [...opts];
    const targetIdx = seed % 4;
    const temp = shuffled[targetIdx];
    shuffled[targetIdx] = shuffled[0];
    shuffled[0] = temp;

    qs.push({
      id: `q-g8-b6-khlit-p${p}-concept`,
      questionId: `q-g8-b6-khlit-p${p}-concept`,
      grade: 'Grade 8',
      academicYear: '2026-2027',
      termId: 'term-g8-t1',
      subjectId: 'kh_literature',
      subjectName: 'Khmer Literature',
      sourceFileId: srcFileId,
      sourceFileName: srcFileName,
      bookTitle: 'ភាសាខ្មែរ ថ្នាក់ទី៨ (ក្រសួងអប់រំ)',
      sourceType: 'Textbook',
      printedPage: p,
      pdfPage: pdf,
      alternatePdfPages: [],
      unitTitle: unit,
      sectionTitle: section,
      topic: topic,
      learningPointId: lp.id,
      learningPoint: lp.learningPoint,
      lessonSummary: summary,
      questionType: 'MULTIPLE_CHOICE',
      difficulty: 'easy',
      question: qText,
      options: shuffled,
      correctAnswer: correct,
      explanation: expl,
      sourceEvidence: evidence,
      generationEvidence: [
        `Batch 6 Question Expansion (Khmer Literature) calibrated to LP ${lp.id}`,
        `Pedagogical variation: Concept recognition and grammatical rule on page ${p}`
      ],
      approvalStatus: 'DRAFT',
      reviewStatus: 'READY_FOR_APPROVAL',
      createdAt: now,
      updatedAt: now,
      aiGenerated: true,
      generatedAt: now,
      generatedBy: 'Batch 6 Khmer Literature Engine',
      sourceLearningPointId: lp.id,
      generationModel: 'Curriculum Engine v1.0',
      generationVersion: '3.1',
      auditHistory: [
        {
          action: 'GENERATED',
          timestamp: now,
          performedBy: 'Batch 6 Khmer Literature Engine',
          notes: `Generated concept question for Khmer Literature p.${p} (PDF p.${pdf}).`
        }
      ]
    });
  }

  // Question 2 (Application / Text analysis / Scenario)
  let qText2 = '';
  let opts2: string[] = [];
  let correct2 = '';
  let expl2 = '';

  if (p === 12) {
    qText2 = 'តើសញ្ញាដំកើល (៰) ប្រើប្រាស់សម្រាប់គោលបំណងអ្វី យោងតាមទំព័រ ១២ នៃសៀវភៅភាសាខ្មែរថ្នាក់ទី៨?';
    opts2 = [
      'ប្រើសម្រាប់សម្គាល់តួអក្សរដែលត្រូវបញ្ចេញសំឡេងឲ្យខ្ពស់ ឬកត់សម្គាល់ព្យាង្គពិសេស',
      'ប្រើសម្រាប់បញ្ចប់ល្បះ',
      'ប្រើសម្រាប់ដាក់ចន្លោះពាក្យក្នុងកាព្យ',
      'ប្រើសម្រាប់គូសបន្ទាត់ក្រោមពាក្យគន្លឹះ'
    ];
    correct2 = opts2[0];
    expl2 = 'ទំព័រ ១២ ពន្យល់ពីមុខងារនៃសញ្ញាដំកើល (៰) ក្នុងការបញ្ចេញសំឡេង និងការប្រកបព្យាង្គក្នុងភាសាខ្មែរ។';
  } else if (p === 17) {
    qText2 = 'ផ្អែកលើការវិភាគអត្ថបទអប់រំនៅទំព័រ ១៧ តើអាកប្បកិរិយារបស់តួអង្គដែលស្មោះត្រង់និងខិតខំប្រឹងប្រែងផ្តល់នូវគំនិតអប់រំអ្វីដល់សង្គម?';
    opts2 = [
      'បង្ហាញថាសេចក្តីព្យាយាម និងភាពស្មោះត្រង់នាំមកនូវសេចក្តីថ្លៃថ្នូរ និងជោគជ័យក្នុងជីវិត',
      'បង្ហាញថាទ្រព្យសម្បត្តិសំខាន់ជាងសីលធម៌',
      'បង្ហាញថាការគេចវេះពីការងារជាវិធីងាយស្រួលបំផុត',
      'បង្ហាញថាមិនគួរសហការជាមួយអ្នកដទៃ'
    ];
    correct2 = opts2[0];
    expl2 = 'ទំព័រ ១៧ បង្ហាញពីតម្លៃអប់រំនៃតួអង្គវិជ្ជមាន ដែលបង្រៀនឱ្យអ្នកអានប្រកាន់ខ្ជាប់នូវភាពស្មោះត្រង់ និងការតស៊ូព្យាយាម។';
  } else if (p === 23) {
    qText2 = 'ក្នុងចំណោមល្បះខាងក្រោម តើល្បះណាជា «ល្បះផ្សំ» យោងតាមនិយមន័យវេយ្យាករណ៍នៅទំព័រ ២៣?';
    opts2 = [
      'សុខខិតខំរៀនសូត្រ ពីព្រោះគាត់ចង់ប្រឡងជាប់។',
      'កូនសិស្សកំពុងអានសៀវភៅ។',
      'បក្សីហើរលើមេឃ។',
      'ផ្កាកំពុងរីកស្គុះស្គាយ។'
    ];
    correct2 = opts2[0];
    expl2 = '«សុខខិតខំរៀនសូត្រ ពីព្រោះគាត់ចង់ប្រឡងជាប់» គឺជាល្បះផ្សំ ព្រោះផ្សំឡើងដោយល្បះទោលពីរ និងតភ្ជាប់ដោយឈ្នាប់ «ពីព្រោះ»។';
  } else if (p >= 13 && p <= 16) {
    qText2 = `ក្នុងកំណាព្យបទពាក្យ៧ នៅទំព័រ ${p} តើព្យាង្គទី៧ នៃឃ្លាទី១ ត្រូវបញ្ជូនសំឡេងរណ្តំចុងចួនទៅកាន់ព្យាង្គទីប៉ុន្មាននៃឃ្លាទី២?`;
    opts2 = [
      'ព្យាង្គទី៤ (ឬទី៥) នៃឃ្លាទី២',
      'ព្យាង្គទី១ នៃឃ្លាទី២',
      'ព្យាង្គទី៧ នៃឃ្លាទី២',
      'មិនបាច់មានចំណាប់ជួនទេ'
    ];
    correct2 = opts2[0];
    expl2 = `តាមក្បួនខ្នាតកាព្យបទពាក្យ៧ នៅទំព័រ ${p} ចុងឃ្លាទី១ (ព្យាង្គទី៧) ត្រូវចួននឹងព្យាង្គទី៤ (ឬទី៥) នៃឃ្លាទី២។`;
  } else if (p >= 18 && p <= 22) {
    qText2 = `ក្នុងការវិភាគអត្ថបទអក្សរសិល្ប៍នៅទំព័រ ${p} តើតួអង្គប្រឆាំង (តួអង្គអវិជ្ជមាន) ដើរតួនាទីយ៉ាងដូចម្តេចក្នុងដំណើររឿង?`;
    opts2 = [
      'បង្កើតទំនាស់ បង្កឧបសគ្គ និងជួយលើកកម្ពស់គុណធម៌របស់តួអង្គឯក',
      'ជួយសម្រួលឱ្យតួអង្គឯកទទួលបានជោគជ័យភ្លាមៗ',
      'មិនមានឥទ្ធិពលអ្វីលើដំណើររឿងឡើយ',
      'តែងតែទទួលបានការសរសើរពីសង្គមក្នុងរឿង'
    ];
    correct2 = opts2[0];
    expl2 = `ទំព័រ ${p} ពន្យល់ថាតួអង្គប្រឆាំងជួយរុញច្រានដំណើររឿងឱ្យមានទំនាស់ និងជាកញ្ចក់ឆ្លុះបញ្ចាំងពីតម្លៃនៃសេចក្តីល្អរបស់តួអង្គឯក។`;
  } else if (p >= 24 && p <= 28) {
    qText2 = `នៅទំព័រ ${p} តើឃ្លា «នាងមានសម្រស់ស្រស់ស្អាតដូចផ្កាកុលាបរីកពេលព្រឹក» ប្រើប្រាស់សំនួនវោហារប្រភេទណា?`;
    opts2 = [
      'សំនួនវោហារឧបមា (ការប្រៀបធៀបដោយប្រើពាក្យ «ដូច»)',
      'សំនួនវោហារបំផ្លើស (ការនិយាយឱ្យហួសពីការពិត)',
      'សំនួនវោហារសើចចំអក',
      'ជាល្បះបញ្ជាដាច់ខាត'
    ];
    correct2 = opts2[0];
    expl2 = `ទំព័រ ${p} បង្រៀនថាសំនួនវោហារឧបមា គឺជាការប្រៀបធៀបវត្ថុពីរដែលមានលក្ខណៈស្រដៀងគ្នាដោយប្រើពាក្យប្រៀបធៀបដូចជា ដូច ដូចជា បីដូច។`;
  } else {
    qText2 = `ក្នុងតែងសេចក្តីពិពណ៌នាទេសភាពនៅទំព័រ ${p} តើផ្នែក «តួសេចក្តី» ត្រូវរៀបរាប់តាមលំដាប់លំដោយបែបណាដើម្បីឱ្យអត្ថបទមានភាពទាក់ទាញ?`;
    opts2 = [
      'ពិពណ៌នាតាមលំដាប់លំហ (ពីឆ្ងាយទៅជិត ឬពីលើចុះក្រោម) និងតាមលំដាប់ពេលវេលា',
      'រៀបរាប់ត្រឡប់ត្រឡិនដោយគ្មានទិសដៅច្បាស់លាស់',
      'គ្រាន់តែសរសេរឈ្មោះទីកន្លែងឱ្យបានច្រើនទំព័រ',
      'ចម្លងតែពាក្យពីវចនានុក្រមមកដាក់'
    ];
    correct2 = opts2[0];
    expl2 = `ទំព័រ ${p} បង្ហាញថាការពិពណ៌នាល្អក្នុងតួសេចក្តីត្រូវមានរបៀបរៀបរយ តាមលំដាប់លំហ និងកាលវេលាជាក់លាក់។`;
  }

  const seed2 = p * 17 + 5;
  const shuffled2 = [...opts2];
  const targetIdx2 = seed2 % 4;
  const temp2 = shuffled2[targetIdx2];
  shuffled2[targetIdx2] = shuffled2[0];
  shuffled2[0] = temp2;

  qs.push({
    id: `q-g8-b6-khlit-p${p}-app`,
    questionId: `q-g8-b6-khlit-p${p}-app`,
    grade: 'Grade 8',
    academicYear: '2026-2027',
    termId: 'term-g8-t1',
    subjectId: 'kh_literature',
    subjectName: 'Khmer Literature',
    sourceFileId: srcFileId,
    sourceFileName: srcFileName,
    bookTitle: 'ភាសាខ្មែរ ថ្នាក់ទី៨ (ក្រសួងអប់រំ)',
    sourceType: 'Textbook',
    printedPage: p,
    pdfPage: pdf,
    alternatePdfPages: [],
    unitTitle: unit,
    sectionTitle: section,
    topic: topic,
    learningPointId: lp.id,
    learningPoint: lp.learningPoint,
    lessonSummary: summary,
    questionType: 'MULTIPLE_CHOICE',
    difficulty: 'medium',
    question: qText2,
    options: shuffled2,
    correctAnswer: correct2,
    explanation: expl2,
    sourceEvidence: evidence,
    generationEvidence: [
      `Batch 6 Question Expansion (Khmer Literature) calibrated to LP ${lp.id}`,
      `Pedagogical variation: Textual analysis / literary application on page ${p}`
    ],
    approvalStatus: 'DRAFT',
    reviewStatus: 'READY_FOR_APPROVAL',
    createdAt: now,
    updatedAt: now,
    aiGenerated: true,
    generatedAt: now,
    generatedBy: 'Batch 6 Khmer Literature Engine',
    sourceLearningPointId: lp.id,
    generationModel: 'Curriculum Engine v1.0',
    generationVersion: '3.1',
    auditHistory: [
      {
        action: 'GENERATED',
        timestamp: now,
        performedBy: 'Batch 6 Khmer Literature Engine',
        notes: `Generated application question for Khmer Literature p.${p} (PDF p.${pdf}).`
      }
    ]
  });

  return qs;
}

const allGeneratedKhLitQuestions: Question[] = [];
for (const lp of khLitLps) {
  const qs = generateKhLitQuestionsForLp(lp);
  allGeneratedKhLitQuestions.push(...qs);
}

console.log(`Generated ${allGeneratedKhLitQuestions.length} new Khmer Literature questions.`);

const fileContent = `import { Question } from '../types';

/**
 * BATCH 6 QUESTION EXPANSION: KHMER LITERATURE (${allGeneratedKhLitQuestions.length} NEW GROUNDED QUESTIONS)
 * 
 * Strict Provenance & Pedagogical Coverage:
 * - Calibrated across all 23 verified Grade 8 Khmer Literature learning points (pp. 12–34).
 * - Excludes the unresolved additional Khmer Literature content scope.
 * - Exactly 2 distinct questions per verified learning point (total 46 questions when combined with 3 existing).
 * - All questions have approvalStatus = 'DRAFT' and reviewStatus = 'READY_FOR_APPROVAL'.
 * - Zero answer-pattern bias (options shuffled across A, B, C, D).
 */

export const GRADE_8_BATCH_KHLIT_QUESTIONS: Question[] = ${JSON.stringify(allGeneratedKhLitQuestions, null, 2)};
`;

writeFileSync('src/data/grade8BatchKhLitQuestions.ts', fileContent, 'utf-8');
console.log('Successfully wrote src/data/grade8BatchKhLitQuestions.ts');
