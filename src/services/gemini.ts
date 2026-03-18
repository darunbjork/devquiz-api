/* eslint-disable perfectionist/sort-objects */
import { UnauthorizedError, ValidationError, InternalServerError } from '../errors.ts';
import { z } from 'zod';

const QuizQuestionSchema = z.object({
  question: z.string().min(1),
  options: z.array(z.string()).length(4),
  correctAnswer: z.number().int().min(0).max(3),
});

const QuizResponseSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  questions: z.array(QuizQuestionSchema).min(1).max(10),
});

interface QuizQuestion {
  question?: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
}

interface GeneratedQuiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  topic: string;
  difficulty: string;
  userId: string;
  date: string;
  source: 'ai';
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';

const sanitizeAiResponse = (text: string): string => {
  text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  const jsonStartIndex = text.indexOf('{');
  const jsonEndIndex = text.lastIndexOf('}');
  if (jsonStartIndex !== -1 && jsonEndIndex !== -1 && jsonEndIndex > jsonStartIndex) {
    return text.substring(jsonStartIndex, jsonEndIndex + 1);
  }
  return text;
};

export const geminiService = {
  async generateQuizFromGemini(
    topic: string,
    difficulty: string,
    numQuestions: number,
    studyNote: string
  ): Promise<GeneratedQuiz> {
    if (!GEMINI_API_KEY) {
      throw new UnauthorizedError('Gemini API key is not configured.');
    }

    const prompt = `
      You are an expert quiz generator.
      Create a quiz based on the study material provided below.

      EXACT REQUIREMENTS:
      1. Create EXACTLY ${numQuestions} multiple-choice questions.
      2. Topic: "${topic}"
      3. Difficulty: "${difficulty}"
      4. For each question, provide exactly 4 options.
      5. Provide a creative and relevant title for the quiz.
      6. Provide a concise description/summary of what the quiz covers.

      FORMAT THE OUTPUT AS VALID JSON ONLY. 
      No markdown, no explanations, no code blocks, no conversational text.

      JSON STRUCTURE:
      {
        "title": "A creative title here",
        "description": "A short summary of the quiz content",
        "questions": [
          {
            "question": "The question text here",
            "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
            "correctAnswer": 0
          }
        ]
      }

      STUDY MATERIAL:
      """
      ${studyNote}
      """
    `;

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Gemini API error:', errorData);
        throw new InternalServerError(
          `Gemini API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`
        );
      }

      const data = await response.json();
      const geminiText = data.candidates[0]?.content?.parts[0]?.text;

      if (!geminiText) {
        throw new InternalServerError('No text content received from Gemini API.');
      }

      const sanitizedText = sanitizeAiResponse(geminiText);
      let parsedJson;
      try {
        parsedJson = JSON.parse(sanitizedText);
      } catch (jsonError) {
        console.error('Failed to parse AI response as JSON:', jsonError);
        throw new ValidationError('AI response was not valid JSON.');
      }

      const validationResult = QuizResponseSchema.safeParse(parsedJson);
      if (!validationResult.success) {
        console.error('Zod validation errors:', validationResult.error.issues);
        throw new ValidationError('AI response format invalid according to schema.');
      }

      const { questions: validatedQuestions, title, description } = validationResult.data;

      const questions: QuizQuestion[] = validatedQuestions.map(q => ({
        questionText: q.question,
        options: q.options,
        correctAnswerIndex: q.correctAnswer,
      }));

      const dummyId = new Date().getTime().toString();
      const currentDate = new Date().toISOString();

      return {
        id: dummyId,
        title,
        description,
        questions,
        topic: topic || 'General',
        difficulty,
        userId: 'temp_user_id',
        date: currentDate,
        source: 'ai',
      };

    } catch (error) {
      console.error('Error generating quiz from Gemini:', error);

      if (error instanceof UnauthorizedError ||
          error instanceof ValidationError ||
          error instanceof InternalServerError) {
        throw error;
      }
      throw new InternalServerError('Failed to generate quiz from AI: ' + (error as Error).message);
    }
  },
};