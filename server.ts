import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '20mb' }));

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(apiKey),
    timestamp: new Date().toISOString(),
  });
});

// AI Question Generation endpoint
app.post('/api/ai/generate-questions', async (req, res) => {
  try {
    const {
      subject,
      topic,
      printedPages,
      pdfPages,
      extractedContent,
      count = 3,
      questionTypes = ['multiple_choice', 'true_false'],
      difficulty = 'medium',
      language = 'en',
      grade = 'Grade 3',
    } = req.body;

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API is not configured on the server. Falling back to local curriculum question engine.',
        isFallback: true,
      });
    }

    const systemInstruction = `You are an expert school educator crafting source-grounded practice exam questions for ${grade} students across school terms.
Rules:
1. Generate Source-Grounded Practice Questions strictly grounded ONLY in the confirmed source material provided.
2. DO NOT invent facts, vocabulary, or concepts outside of the provided excerpt.
3. Every question must represent an important, distinct assessable learning point on each source page. DO NOT generate unnecessary repetitive questions just to increase quantity.
4. Every question must have an accurate, unambiguous answer and an encouraging explanation citing the source.
5. LESSON REMINDER (lessonSummary):
   - Provide a short, student-friendly reminder (2-4 lines) summarizing the concept, rule, definition, or mathematical method needed to answer the question.
   - The summary MUST be grounded strictly in the source page excerpt.
   - CRITICAL ANSWER PROTECTION RULE: The lessonSummary must NEVER directly reveal the correct answer, the correct option letter, the answer position, or wording that makes the answer immediately obvious.
6. Support the target language correctly:
   - For English: natural Grade-appropriate British/International English.
   - For Mathematics: verify all arithmetic calculations and word problem logic.
   - For Science: focus on concepts, definitions, body organs, systems, and animal skeletons.
   - For Chinese (GO200): preserve Chinese characters, pinyin, and exact vocabulary (穿, 戴, 拿, 背, measure words 个, 张, 本, 支, 台).
   - For Khmer: output natural, grammatically correct Khmer script (អំណាន, សំណេរ, បដិសព្ទ, គណិតវិទ្យា, អនាម័យ, សីលធម៌).
7. Output format must be pure valid JSON array of objects conforming to this schema:
[
  {
    "question": "question text",
    "questionType": "multiple_choice" | "true_false" | "fill_in_blank" | "calculation" | "matching",
    "difficulty": "easy" | "medium" | "hard",
    "options": ["Option A", "Option B", "Option C", "Option D"] (required for multiple_choice),
    "correctAnswer": "Exact correct option or string answer",
    "explanation": "Kid-friendly explanation citing page ${printedPages}",
    "topic": "${topic || 'General'}",
    "learningPoint": "Specific assessable learning point",
    "lessonSummary": "Concise concept or rule reminder that helps the student recall how to solve the question without giving away the direct answer.",
    "printedPage": "${printedPages}",
    "pdfPage": "${pdfPages}"
  }
]`;

    const userPrompt = `Subject: ${subject}
Topic: ${topic}
Printed Textbook Pages: ${printedPages}
PDF Pages: ${pdfPages}
Target Question Count: ${count}
Requested Question Types: ${questionTypes.join(', ')}
Difficulty: ${difficulty}
Language: ${language}

Source Material Excerpt / Extracted Content:
${JSON.stringify(extractedContent || {}, null, 2)}

Generate ${count} engaging, pedagogically sound questions strictly from this source content.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.4,
      },
    });

    const text = response.text || '[]';
    let parsedQuestions = [];
    try {
      parsedQuestions = JSON.parse(text);
    } catch {
      // try to extract JSON array
      const match = text.match(/\[[\s\S]*\]/);
      if (match) {
        parsedQuestions = JSON.parse(match[0]);
      }
    }

    res.json({
      success: true,
      questions: parsedQuestions,
      source: 'gemini-3.8-flash',
    });
  } catch (err: any) {
    console.error('Error generating questions with Gemini:', err);
    res.status(500).json({
      error: err.message || 'Failed to generate questions with AI',
      isFallback: true,
    });
  }
});

// AI Source Page Analysis / Mapping endpoint
app.post('/api/ai/analyze-source', async (req, res) => {
  try {
    const { pageText, pdfPageNumber, suggestedSubject } = req.body;

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API not configured.',
        isFallback: true,
      });
    }

    const systemInstruction = `You analyze scanned textbook pages for school curriculum across grades and terms.
Identify:
1. Book Title
2. Subject (English, Mathematics, Science, Chinese - GO200, Khmer Dictation, Khmer Writing, Khmer Mathematics, Khmer Reading, Khmer Social Studies, Khmer Applied Science)
3. Printed Textbook Page Number (distinct from PDF page number)
4. Unit/Lesson title
5. Key topics covered
6. Extracted concepts, rules, and vocabulary
7. Lesson Summary (a short 2-4 sentence student-friendly concept/method reminder from this page's content; must be grounded strictly in the source text without giving away practice exercise answers)
Output valid JSON.`;

    const prompt = `PDF Page Number: ${pdfPageNumber}
Suggested Subject: ${suggestedSubject || 'Unknown'}
Page Content / OCR text:
${pageText}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    res.json({
      success: true,
      analysis: JSON.parse(response.text || '{}'),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
