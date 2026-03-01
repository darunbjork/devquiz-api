/* eslint-disable perfectionist/sort-objects */
// Step 11: Implement the quiz controller that provides methods for retrieving quiz information. The getAll method retrieves a list of all available quizzes, while the getById method retrieves detailed information about a specific quiz based on its ID. This controller serves as the primary interface for clients to access quiz data, allowing them to browse available quizzes and view details about individual quizzes as needed. By providing these methods, the quiz controller plays a crucial role in facilitating user interaction with the quiz system and enabling users to explore and engage with the quizzes offered by the application.
import type { FastifyRequest, FastifyReply } from 'fastify';
import { quizService, type QuizData } from '../services/quiz.ts';
import { UnauthorizedError } from '../errors.ts';
import { geminiService } from '../services/gemini.ts'; // Import geminiService
import type { JWTPayload } from '../types/auth.ts';

interface GenerateQuizRequestBody {
  topic: string;
  difficulty: string;
  numQuestions: number;
  studyNote: string;
}

export const quizController = {
  async getAll(_req: FastifyRequest, _reply: FastifyReply) {
    return await quizService.getAllQuizzes();
  },

  async getMyQuizzes(req: FastifyRequest, _reply: FastifyReply) {
    const userId = (req.user as JWTPayload).sub;
    return await quizService.getMyQuizzes(userId);
  },

  async getById(req: FastifyRequest<{ Params: { id: string } }>, _reply: FastifyReply) {
    return await quizService.getQuizById(req.params.id);
  },

  async create(req: FastifyRequest<{ Body: QuizData }>, _reply: FastifyReply) {
    const userId = (req.user as JWTPayload).sub;
    return await quizService.createQuiz(req.body, userId);
  },

  async update(req: FastifyRequest<{ Params: { id: string }; Body: Partial<QuizData> }>, _reply: FastifyReply) {
    const userId = (req.user as JWTPayload).sub;
    return await quizService.updateQuiz(req.params.id, req.body, userId);
  },

  async delete(req: FastifyRequest<{ Params: { id: string } }>, _reply: FastifyReply) {
    const userId = (req.user as JWTPayload).sub;
    await quizService.deleteQuiz(req.params.id, userId);
    return _reply.code(204).send();
  },

  async generateQuiz(req: FastifyRequest, _reply: FastifyReply) {
    const { topic, difficulty, numQuestions, studyNote } = req.body as GenerateQuizRequestBody;
    const userId = (req.user as JWTPayload).sub;

    if (!userId) {
      throw new UnauthorizedError('User not authenticated');
    }

    try {
      const generatedQuiz = await geminiService.generateQuizFromGemini(
        topic,
        difficulty,
        numQuestions,
        studyNote
      );

      // We no longer save to DB here. The frontend will call /api/quizzes to save it if the user clicks "Save".
      return {
        ...generatedQuiz,
        userId // Ensure the ID is passed back
      };
    } catch (error) {
      console.error('Error generating quiz:', error);
      throw error;
    }
  }
};
