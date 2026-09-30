import { SourcePage } from '../types';

export type SourceQualifier = 'student_book' | 'workbook' | 'textbook' | 'unspecified';

export interface NormalizedPageIdentity {
  raw: string | number;
  qualifier: SourceQualifier;
  printedPageNumber: number | string;
  isSpecialScope?: boolean;
}

export class PageIdentityService {
  /**
   * Universally parses any pointer requirement token into a normalized identity.
   * Handles:
   * - "SB 5", "SB-5", "Student Book 5", "SB p. 5" -> qualifier: 'student_book', printedPageNumber: 5
   * - "WB 5", "Workbook 5", "WB-5", "WB p. 5" -> qualifier: 'workbook', printedPageNumber: 5
   * - "TB 5", "Textbook 5" -> qualifier: 'textbook', printedPageNumber: 5
   * - 5, "5", "104", "142-144" -> qualifier: 'unspecified', printedPageNumber: 5 / "142-144"
   * - Special scopes e.g. "UNRESOLVED_KHMER_CONTENT_SCOPE", "Content Scope (...)"
   */
  static parsePageToken(token: string | number): NormalizedPageIdentity {
    const str = String(token).trim();

    if (
      str.startsWith('UNRESOLVED') ||
      str.includes('CONTENT_SCOPE') ||
      str.toLowerCase().includes('content scope')
    ) {
      return {
        raw: token,
        qualifier: 'unspecified',
        printedPageNumber: str,
        isSpecialScope: true,
      };
    }

    const match = str.match(
      /^(?:(SB|Student\s*Book)|(WB|Work\s*book)|(TB|Text\s*book))\b\s*[-.:/]?\s*(?:p\.?|page)?\s*(.+)$/i
    );

    if (match) {
      let qualifier: SourceQualifier = 'student_book';
      if (match[2]) qualifier = 'workbook';
      else if (match[3]) qualifier = 'textbook';

      const pageStr = match[4].trim();
      const num = Number(pageStr);
      return {
        raw: token,
        qualifier,
        printedPageNumber: isNaN(num) ? pageStr : num,
        isSpecialScope: false,
      };
    }

    const num = Number(str);
    return {
      raw: token,
      qualifier: 'unspecified',
      printedPageNumber: isNaN(num) ? str : num,
      isSpecialScope: false,
    };
  }

  /**
   * Detects the source book qualifier from source metadata (bookTitle, sourceType, notes, unitLesson).
   * Fully universal: works for any grade, subject, or publisher without hardcoded subject names.
   */
  static detectSourceQualifier(source: {
    bookTitle?: string;
    sourceType?: string;
    notes?: string;
    unitLesson?: string;
  }): SourceQualifier {
    const text = `${source.sourceType || ''} ${source.bookTitle || ''} ${source.notes || ''} ${source.unitLesson || ''}`.toLowerCase();

    if (text.includes('workbook') || /\bwb\b/.test(text)) {
      return 'workbook';
    }
    if (text.includes('student book') || text.includes('student') || /\bsb\b/.test(text)) {
      return 'student_book';
    }
    if (text.includes('textbook') || /\btb\b/.test(text)) {
      return 'textbook';
    }
    return 'unspecified';
  }

  /**
   * Universally determines whether a source record matches a required page token.
   * Matches both the printed page number and the source book qualifier (when specified).
   */
  static matchesPageToken(
    token: string | number,
    source: {
      printedPageNumber?: number | string;
      printedPage?: number | string;
      bookTitle?: string;
      sourceType?: string;
      notes?: string;
      unitLesson?: string;
    }
  ): boolean {
    const parsed = this.parsePageToken(token);
    if (parsed.isSpecialScope) {
      return false;
    }

    const rawSourcePage = source.printedPageNumber !== undefined ? source.printedPageNumber : source.printedPage;
    if (rawSourcePage === undefined || rawSourcePage === null) {
      return false;
    }

    const spNum = String(rawSourcePage).toLowerCase().trim();
    const reqNum = String(parsed.printedPageNumber).toLowerCase().trim();

    let pageMatches = spNum === reqNum;
    if (!pageMatches) {
      // Check multi-page spreads or comma-separated lists e.g. "50-51" or "142-144"
      const tokens = spNum.split(/[-–,\s&/]+/).map((t) => t.trim());
      if (tokens.includes(reqNum)) {
        pageMatches = true;
      }
    }

    if (!pageMatches) {
      return false;
    }

    // Qualifier validation:
    // If the token specifies a qualifier (e.g. SB vs WB), the source MUST match that qualifier.
    if (parsed.qualifier !== 'unspecified') {
      const srcQualifier = this.detectSourceQualifier(source);
      if (srcQualifier !== 'unspecified' && srcQualifier !== parsed.qualifier) {
        return false;
      }
    }

    return true;
  }
}
