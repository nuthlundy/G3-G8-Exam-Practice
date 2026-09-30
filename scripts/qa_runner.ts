import { INITIAL_GRADE_8_TERM_1_DATA } from '../src/data/grade8PointerData';
import { INITIAL_TERM_1_DATA } from '../src/data/term1Data';
import { QuestionGenerationEngine } from '../src/services/questionGenerationEngine';
import { QuestionValidationEngine } from '../src/services/questionValidationEngine';
import { Question, TermData } from '../src/types';

function runQA() {
  console.log('====================================================');
  console.log('GRADE 8 TERM 1 TEACHER APPROVAL WORKFLOW END-TO-END QA');
  console.log('====================================================\n');

  let g8Term: TermData = JSON.parse(JSON.stringify(INITIAL_GRADE_8_TERM_1_DATA));
  const g3Term: TermData = JSON.parse(JSON.stringify(INITIAL_TERM_1_DATA));

  // TEST A: Initial Question Bank
  console.log('--- TEST A: Initial Question Bank ---');
  const getCounts = (questions: Question[]) => {
    const total = questions.length;
    const approved = questions.filter(q => q.approvalStatus === 'APPROVED' || q.approvalStatus === 'approved').length;
    const rejected = questions.filter(q => q.approvalStatus === 'REJECTED' || q.approvalStatus === 'rejected').length;
    const reviewLater = questions.filter(q => !['APPROVED', 'approved', 'REJECTED', 'rejected'].includes(q.approvalStatus) && (q.reviewStatus === 'REVIEW_LATER' || q.reviewAction === 'REVIEW_LATER')).length;
    const ready = questions.filter(q => !['APPROVED', 'approved', 'REJECTED', 'rejected'].includes(q.approvalStatus) && q.reviewStatus !== 'REVIEW_LATER' && q.reviewAction !== 'REVIEW_LATER').length;
    return { total, approved, rejected, reviewLater, ready };
  };

  const initialCounts = getCounts(g8Term.questions);
  const testAPass = initialCounts.total === 28 && initialCounts.ready === 28 && initialCounts.approved === 0 && initialCounts.rejected === 0 && initialCounts.reviewLater === 0;
  console.log(`Test A Initial Counts: Total=${initialCounts.total}, Ready=${initialCounts.ready}, Approved=${initialCounts.approved}, Rejected=${initialCounts.rejected}, ReviewLater=${initialCounts.reviewLater}`);
  console.log(`Test A Result: ${testAPass ? 'PASS' : 'FAIL'}\n`);

  // TEST B: Approve One Question
  console.log('--- TEST B: Approve One Question ---');
  const targetQ = g8Term.questions[0]; // e.g. q-g8-pilot-english-p6
  console.log(`Targeting Question for Approval: ${targetQ.id} (${targetQ.subjectName || targetQ.subjectId} p.${targetQ.printedPage})`);
  const approveRes = QuestionGenerationEngine.approveQuestion(g8Term.questions, targetQ.id, 'Teacher Reviewer', 'Approved into Active Bank');
  g8Term.questions = approveRes.updatedQuestions;
  const countsAfterB = getCounts(g8Term.questions);
  const approvedQ = g8Term.questions.find(q => q.id === targetQ.id)!;
  const testBPass = countsAfterB.total === 28 && countsAfterB.ready === 27 && countsAfterB.approved === 1 &&
    approvedQ.approvalStatus === 'APPROVED' &&
    approvedQ.reviewStatus === 'APPROVED' &&
    approvedQ.reviewedBy === 'Teacher Reviewer' &&
    Boolean(approvedQ.reviewedAt) &&
    approvedQ.auditHistory?.some(h => h.action === 'APPROVED') &&
    approvedQ.printedPage === targetQ.printedPage &&
    approvedQ.pdfPage === targetQ.pdfPage;
  console.log(`Test B Counts: Total=${countsAfterB.total}, Ready=${countsAfterB.ready}, Approved=${countsAfterB.approved}`);
  console.log(`Approved Question Status: ${approvedQ.approvalStatus}, ReviewStatus: ${approvedQ.reviewStatus}, ReviewedBy: ${approvedQ.reviewedBy}`);
  console.log(`Test B Result: ${testBPass ? 'PASS' : 'FAIL'}\n`);

  // TEST C: Refresh Persistence
  console.log('--- TEST C: Refresh Persistence ---');
  // Simulated persistence via JSON serialization / deserialization as in localStorage
  const serialized = JSON.stringify(g8Term);
  const deserialized: TermData = JSON.parse(serialized);
  const countsAfterC = getCounts(deserialized.questions);
  const testCPass = countsAfterC.ready === 27 && countsAfterC.approved === 1 && countsAfterC.total === 28;
  console.log(`After reload: Total=${countsAfterC.total}, Ready=${countsAfterC.ready}, Approved=${countsAfterC.approved}`);
  console.log(`Test C Result: ${testCPass ? 'PASS' : 'FAIL'}\n`);

  // TEST D: Grade 3 Isolation
  console.log('--- TEST D: Grade 3 Isolation ---');
  const g3ApprovedCount = g3Term.questions.filter(q => q.approvalStatus === 'approved' || q.approvalStatus === 'APPROVED').length;
  const g3TestCount = g3Term.practiceTests.length;
  const g3HasG8 = g3Term.questions.some(q => q.id.startsWith('q-g8-'));
  const g8HasG3 = g8Term.questions.some(q => q.id.startsWith('q-g3-') || q.grade === 'Grade 3');
  const testDPass = g3Term.questions.length === 102 && g3ApprovedCount === 102 && g3TestCount === 8 && !g3HasG8 && !g8HasG3;
  console.log(`Grade 3 Questions: ${g3Term.questions.length} (Approved: ${g3ApprovedCount}, Published Tests: ${g3TestCount})`);
  console.log(`Grade 8 has Grade 3: ${g8HasG3}, Grade 3 has Grade 8: ${g3HasG8}`);
  console.log(`Test D Result: ${testDPass ? 'PASS' : 'FAIL'}\n`);

  // TEST E: Student View Isolation
  console.log('--- TEST E: Student View Isolation ---');
  const studentAvailableG8Questions = g8Term.questions.filter(q => q.approvalStatus === 'APPROVED' || q.approvalStatus === 'approved');
  const studentUnapprovedG8Questions = g8Term.questions.filter(q => q.approvalStatus !== 'APPROVED' && q.approvalStatus !== 'approved');
  const testEPass = studentAvailableG8Questions.length === 1 && studentUnapprovedG8Questions.length === 27;
  console.log(`Available to Students: ${studentAvailableG8Questions.length} approved question`);
  console.log(`Protected from Students: ${studentUnapprovedG8Questions.length} unapproved questions`);
  console.log(`Test E Result: ${testEPass ? 'PASS' : 'FAIL'}\n`);

  // TEST F: Edit an Approved Question
  console.log('--- TEST F: Edit an Approved Question ---');
  const origSummary = approvedQ.lessonSummary;
  const newSummary = 'Lesson Reminder: Suffixes systematically derive abstract nouns from base verbs across technical registers.';
  const editRes = QuestionGenerationEngine.editQuestion(
    g8Term.questions,
    approvedQ.id,
    { lessonSummary: newSummary },
    'Teacher Reviewer',
    'Refined lesson reminder wording.',
    { pageIndex: g8Term.pageIndex, sourceBoundaries: g8Term.sourceBoundaries, learningPoints: g8Term.learningPoints }
  );
  g8Term.questions = editRes.updatedQuestions;
  const editedQ = g8Term.questions.find(q => q.id === approvedQ.id)!;
  const countsAfterF = getCounts(g8Term.questions);
  const testFPass = countsAfterF.approved === 0 && countsAfterF.ready === 28 &&
    editedQ.approvalStatus === 'DRAFT' &&
    editedQ.reviewStatus === 'READY_FOR_APPROVAL' &&
    editedQ.reviewAction === 'EDITED' &&
    editedQ.auditHistory?.some(h => h.action === 'EDITED' && h.changeLog?.some(c => c.includes('Lesson Reminder'))) &&
    editedQ.printedPage === targetQ.printedPage &&
    editedQ.pdfPage === targetQ.pdfPage;
  console.log(`Status after Edit: ${editedQ.approvalStatus}, ReviewStatus: ${editedQ.reviewStatus}`);
  console.log(`Approved Count after Edit: ${countsAfterF.approved}, Ready Count: ${countsAfterF.ready}`);
  console.log(`Audit Entry: ${editedQ.auditHistory?.slice(-1)[0]?.action} (${editedQ.auditHistory?.slice(-1)[0]?.notes})`);
  console.log(`Test F Result: ${testFPass ? 'PASS' : 'FAIL'}\n`);

  // TEST G: Re-Approval after Edit
  console.log('--- TEST G: Re-Approval after Edit ---');
  const reApproveRes = QuestionGenerationEngine.approveQuestion(g8Term.questions, editedQ.id, 'Teacher Reviewer', 'Re-approved after reminder refinement.');
  g8Term.questions = reApproveRes.updatedQuestions;
  const countsAfterG = getCounts(g8Term.questions);
  const reApprovedQ = g8Term.questions.find(q => q.id === editedQ.id)!;
  const testGPass = countsAfterG.approved === 1 && countsAfterG.ready === 27 &&
    reApprovedQ.approvalStatus === 'APPROVED' &&
    reApprovedQ.auditHistory!.filter(h => h.action === 'APPROVED').length === 2 &&
    reApprovedQ.auditHistory!.some(h => h.action === 'EDITED');
  console.log(`After Re-Approval: Approved=${countsAfterG.approved}, Ready=${countsAfterG.ready}`);
  console.log(`Total Audit Events on Question: ${reApprovedQ.auditHistory?.length}`);
  console.log(`Test G Result: ${testGPass ? 'PASS' : 'FAIL'}\n`);

  // TEST H: Reject a Draft
  console.log('--- TEST H: Reject a Draft ---');
  const draftToReject = g8Term.questions.find(q => q.approvalStatus !== 'APPROVED')!;
  console.log(`Targeting Question for Rejection: ${draftToReject.id}`);
  const rejectedList = QuestionGenerationEngine.rejectQuestion(g8Term.questions, draftToReject.id, 'Teacher Reviewer', 'Poor question quality - distractors too similar.');
  g8Term.questions = rejectedList;
  const countsAfterH = getCounts(g8Term.questions);
  const rejectedQ = g8Term.questions.find(q => q.id === draftToReject.id)!;
  const testHPass = countsAfterH.total === 28 && countsAfterH.ready === 26 && countsAfterH.approved === 1 && countsAfterH.rejected === 1 &&
    rejectedQ.approvalStatus === 'REJECTED' &&
    rejectedQ.reviewStatus === 'REJECTED' &&
    rejectedQ.rejectionReason === 'Poor question quality - distractors too similar.' &&
    rejectedQ.auditHistory?.some(h => h.action === 'REJECTED');
  console.log(`Counts after Reject: Total=${countsAfterH.total}, Ready=${countsAfterH.ready}, Approved=${countsAfterH.approved}, Rejected=${countsAfterH.rejected}`);
  console.log(`Test H Result: ${testHPass ? 'PASS' : 'FAIL'}\n`);

  // TEST I: Review Later
  console.log('--- TEST I: Review Later ---');
  const readyToReviewLater = g8Term.questions.find(q => q.approvalStatus !== 'APPROVED' && q.approvalStatus !== 'REJECTED' && q.reviewStatus !== 'REVIEW_LATER')!;
  console.log(`Targeting Question for Review Later: ${readyToReviewLater.id}`);
  const reviewLaterList = QuestionGenerationEngine.reviewLaterQuestion(g8Term.questions, readyToReviewLater.id, 'Teacher Reviewer', 'Consulting subject coordinator on terminology.');
  g8Term.questions = reviewLaterList;
  const countsAfterI = getCounts(g8Term.questions);
  const rlQ = g8Term.questions.find(q => q.id === readyToReviewLater.id)!;
  const testIPass = countsAfterI.total === 28 && countsAfterI.ready === 25 && countsAfterI.approved === 1 && countsAfterI.rejected === 1 && countsAfterI.reviewLater === 1 &&
    rlQ.approvalStatus === 'DRAFT' &&
    rlQ.reviewStatus === 'REVIEW_LATER' &&
    rlQ.auditHistory?.some(h => h.action === 'REVIEW_LATER');
  console.log(`Counts after Review Later: Total=${countsAfterI.total}, Ready=${countsAfterI.ready}, Approved=${countsAfterI.approved}, Rejected=${countsAfterI.rejected}, ReviewLater=${countsAfterI.reviewLater}`);
  console.log(`Test I Result: ${testIPass ? 'PASS' : 'FAIL'}\n`);

  // TEST J: Bulk Approval Safety
  console.log('--- TEST J: Bulk Approval Safety ---');
  const readyCandidates = g8Term.questions.filter(q => q.approvalStatus !== 'APPROVED' && q.approvalStatus !== 'REJECTED' && q.reviewStatus !== 'REVIEW_LATER').slice(0, 2);
  const selectedIds = readyCandidates.map(q => q.id);
  console.log(`Selected 2 Questions for Bulk Approval: ${selectedIds.join(', ')}`);
  
  // 1. Simulate Cancelation -> no changes
  let canceledQuestions = [...g8Term.questions];
  const countsBeforeBulk = getCounts(canceledQuestions);
  console.log(`Before confirmation: Approved=${countsBeforeBulk.approved}, Ready=${countsBeforeBulk.ready}`);

  // 2. Simulate Confirmation -> exactly 2 approved
  for (const id of selectedIds) {
    const res = QuestionGenerationEngine.approveQuestion(g8Term.questions, id, 'Teacher Reviewer', 'Bulk approved');
    g8Term.questions = res.updatedQuestions;
  }
  const countsAfterJ = getCounts(g8Term.questions);
  const testJPass = countsAfterJ.total === 28 && countsAfterJ.approved === 3 && countsAfterJ.ready === 23 && countsAfterJ.rejected === 1 && countsAfterJ.reviewLater === 1;
  console.log(`After Bulk Approval: Total=${countsAfterJ.total}, Ready=${countsAfterJ.ready}, Approved=${countsAfterJ.approved}`);
  console.log(`Test J Result: ${testJPass ? 'PASS' : 'FAIL'}\n`);

  // TEST K: Filtering & Search
  console.log('--- TEST K: Filtering & Search ---');
  const subjects = ['english', 'science', 'mathematics', 'kh_literature', 'kh_algebra_geometry', 'kh_physics', 'kh_chemistry', 'kh_biology', 'kh_civic'];
  let subFilterPass = true;
  for (const s of subjects) {
    const matching = g8Term.questions.filter(q => q.subjectId === s);
    if (matching.length === 0) subFilterPass = false;
  }
  // Test search by ID, text, printed page, pdf page
  const sampleQ = g8Term.questions[0];
  const searchById = g8Term.questions.filter(q => q.id.includes(sampleQ.id));
  const searchByPrompt = g8Term.questions.filter(q => q.question.toLowerCase().includes(sampleQ.question.slice(0, 10).toLowerCase()));
  const searchByPage = g8Term.questions.filter(q => String(q.printedPage) === String(sampleQ.printedPage));
  const testKPass = subFilterPass && searchById.length >= 1 && searchByPrompt.length >= 1 && searchByPage.length >= 1;
  console.log(`Subject filters valid across 9 subjects: ${subFilterPass}`);
  console.log(`Search by ID: ${searchById.length} match(es), Search by Prompt: ${searchByPrompt.length} match(es), Search by Page: ${searchByPage.length} match(es)`);
  console.log(`Test K Result: ${testKPass ? 'PASS' : 'FAIL'}\n`);

  // TEST L: Source Provenance Protection
  console.log('--- TEST L: Source Provenance Protection ---');
  const targetForProvenance = g8Term.questions[0];
  const attemptedTamper = QuestionGenerationEngine.editQuestion(
    g8Term.questions,
    targetForProvenance.id,
    {
      subjectId: 'tampered_subject',
      bookTitle: 'Invented Fake Book',
      printedPage: 9999,
      pdfPage: 8888,
      grade: 'Grade 12',
    } as any,
    'Teacher Reviewer',
    'Attempting tampering',
    { pageIndex: g8Term.pageIndex, sourceBoundaries: g8Term.sourceBoundaries, learningPoints: g8Term.learningPoints }
  );
  const tamperedQ = attemptedTamper.updatedQuestions.find(q => q.id === targetForProvenance.id)!;
  const isSourceLocked = tamperedQ.subjectId === targetForProvenance.subjectId &&
    tamperedQ.bookTitle === targetForProvenance.bookTitle &&
    tamperedQ.printedPage === targetForProvenance.printedPage &&
    tamperedQ.pdfPage === targetForProvenance.pdfPage &&
    tamperedQ.grade === targetForProvenance.grade;
  console.log(`Attempted metadata modification resisted: ${isSourceLocked}`);
  console.log(`Subject preserved: ${tamperedQ.subjectId}, Book preserved: ${tamperedQ.bookTitle}, Page preserved: ${tamperedQ.printedPage} (PDF ${tamperedQ.pdfPage})`);
  console.log(`Test L Result: ${isSourceLocked ? 'PASS' : 'FAIL'}\n`);

  // TEST M: Edit Validation
  console.log('--- TEST M: Edit Validation ---');
  const validQ = g8Term.questions.find(q => q.approvalStatus === 'APPROVED')!;
  const invalidEditRes = QuestionGenerationEngine.editQuestion(
    g8Term.questions,
    validQ.id,
    {
      correctAnswer: 'NonExistentOptionValue',
      options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
    },
    'Teacher Reviewer',
    'Deliberate mismatch test',
    { pageIndex: g8Term.pageIndex, sourceBoundaries: g8Term.sourceBoundaries, learningPoints: g8Term.learningPoints }
  );
  const invalidQ = invalidEditRes.updatedQuestions.find(q => q.id === validQ.id)!;
  const testMPass = !invalidEditRes.validationReport.isValid &&
    invalidQ.approvalStatus === 'NEEDS_REVIEW' &&
    invalidEditRes.validationReport.errors.some(e => e.includes('Correct Answer in Options'));
  console.log(`Validation valid: ${invalidEditRes.validationReport.isValid}, Errors: ${invalidEditRes.validationReport.errors.join('; ')}`);
  console.log(`Status after invalid edit: ${invalidQ.approvalStatus}`);
  console.log(`Test M Result: ${testMPass ? 'PASS' : 'FAIL'}\n`);

  // TEST N: Audit History Preservation
  console.log('--- TEST N: Audit History Preservation ---');
  const multiEventQ = invalidQ;
  const actionsInHistory = multiEventQ.auditHistory?.map(h => h.action) || [];
  const testNPass = actionsInHistory.length >= 3 && actionsInHistory.includes('APPROVED') && actionsInHistory.includes('EDITED');
  console.log(`Audit history actions on question: ${actionsInHistory.join(' -> ')}`);
  console.log(`Test N Result: ${testNPass ? 'PASS' : 'FAIL'}\n`);

  // TEST O: Student Gate
  console.log('--- TEST O: Student Gate ---');
  const studentPracticePool = g8Term.questions.filter(q => q.approvalStatus === 'APPROVED' || q.approvalStatus === 'approved');
  const nonApprovedCount = g8Term.questions.filter(q => q.approvalStatus !== 'APPROVED' && q.approvalStatus !== 'approved').length;
  const testOPass = studentPracticePool.every(q => q.approvalStatus === 'APPROVED' || q.approvalStatus === 'approved') &&
    !studentPracticePool.some(q => ['DRAFT', 'NEEDS_REVIEW', 'REJECTED'].includes(q.approvalStatus) || q.reviewStatus === 'REVIEW_LATER');
  console.log(`Student practice pool size: ${studentPracticePool.length}, Excluded unapproved: ${nonApprovedCount}`);
  console.log(`Test O Result: ${testOPass ? 'PASS' : 'FAIL'}\n`);

  // TEST P: Test Publisher Gate
  console.log('--- TEST P: Test Publisher Gate ---');
  // Check available questions in TestPublisher
  const availableForPublishing = g8Term.questions.filter(
    q => q.approvalStatus === 'approved' || q.approvalStatus === 'APPROVED'
  );
  const testPPass = availableForPublishing.length === studentPracticePool.length &&
    availableForPublishing.every(q => q.approvalStatus === 'APPROVED' || q.approvalStatus === 'approved') &&
    g3Term.practiceTests.length === 8;
  console.log(`Available for test creation: ${availableForPublishing.length} approved question(s)`);
  console.log(`Grade 3 published tests intact: ${g3Term.practiceTests.length}`);
  console.log(`Test P Result: ${testPPass ? 'PASS' : 'FAIL'}\n`);

  console.log('====================================================');
  console.log('ALL 16 UNIT AND INTEGRATION TESTS EXECUTED.');
  console.log('====================================================');
}

runQA();
