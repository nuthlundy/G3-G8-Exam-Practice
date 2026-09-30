import {
  LearningPoint,
  ExtractedContentItem,
  Stage2ExtractionReport,
  InstructionalStatus,
} from '../types';
import { buildGrade8VerifiedInstructionalData } from '../data/grade8InstructionalData';

export class InstructionalContentEngine {
  /**
   * Builds and retrieves the canonical Stage 2 instructional content layer for Grade 8 Term 1.
   * Strictly filters only verified mapped source pages (241 eligible pages).
   * Unresolved pages (Science SB 41, Khmer History 76-87, Khmer Lit scope) are skipped.
   * No questions are generated.
   */
  static getGrade8InstructionalContent(): {
    extractedContents: ExtractedContentItem[];
    learningPoints: LearningPoint[];
    report: Stage2ExtractionReport;
  } {
    return buildGrade8VerifiedInstructionalData();
  }

  /**
   * Applies teacher review action to a learning point.
   */
  static updateLearningPointStatus(
    points: LearningPoint[],
    pointId: string,
    newStatus: InstructionalStatus,
    teacherNotes?: string
  ): LearningPoint[] {
    return points.map((p) => {
      if (p.id !== pointId) return p;
      return {
        ...p,
        status: newStatus,
        lessonSummaryStatus: newStatus,
        teacherNotes: teacherNotes !== undefined ? teacherNotes : p.teacherNotes,
        reviewedBy: 'Teacher Reviewer',
        reviewedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });
  }

  /**
   * Allows teacher to edit a learning point or lesson summary.
   */
  static editLearningPoint(
    points: LearningPoint[],
    pointId: string,
    updates: {
      learningPoint?: string;
      lessonSummary?: string;
      teacherNotes?: string;
    }
  ): LearningPoint[] {
    return points.map((p) => {
      if (p.id !== pointId) return p;
      return {
        ...p,
        learningPoint: updates.learningPoint !== undefined ? updates.learningPoint : p.learningPoint,
        lessonSummary: updates.lessonSummary !== undefined ? updates.lessonSummary : p.lessonSummary,
        teacherNotes: updates.teacherNotes !== undefined ? updates.teacherNotes : p.teacherNotes,
        status: 'NEEDS_REVIEW' as const, // Edited items require teacher verification before final publication
        updatedAt: new Date().toISOString(),
      };
    });
  }
}
