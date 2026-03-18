import type { FastifyRequest, FastifyReply } from 'fastify';
import { quizService, type QuizData } from '../services/quiz.ts';
import { UnauthorizedError } from '../errors.ts';
import { geminiService } from '../services/gemini.ts'; 
import type { JWTPayload } from '../types/auth.ts';

interface GenerateQuizRequestBody {
  topic: string;
  difficulty: string;
  numQuestions: number;
  studyNote: string;
}

export const quizController = {
  async create(req: FastifyRequest<{ Body: QuizData }>, _reply: FastifyReply) {
    const userId = (req.user as JWTPayload).sub;
    return await quizService.createQuiz(req.body, userId);
  },

  async delete(req: FastifyRequest<{ Params: { id: string } }>, _reply: FastifyReply) {
    const userId = (req.user as JWTPayload).sub;
    await quizService.deleteQuiz(req.params.id, userId);
    return _reply.code(204).send();
  },

  async generateQuiz(req: FastifyRequest, _reply: FastifyReply) {
    const { difficulty, numQuestions, studyNote, topic } = req.body as GenerateQuizRequestBody;
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

      return {
        ...generatedQuiz,
        userId 
      };
    } catch (error) {
      console.error('Error generating quiz:', error);
      throw error;
    }
  },

  async getAll(_req: FastifyRequest, _reply: FastifyReply) {
    return await quizService.getAllQuizzes();
  },

  async getById(req: FastifyRequest<{ Params: { id: string } }>, _reply: FastifyReply) {
    return await quizService.getQuizById(req.params.id);
  },

  async getMyQuizzes(req: FastifyRequest, _reply: FastifyReply) {
    const userId = (req.user as JWTPayload).sub;
    return await quizService.getMyQuizzes(userId);
  },

  async update(req: FastifyRequest<{ Params: { id: string }; Body: Partial<QuizData> }>, _reply: FastifyReply) {
    const userId = (req.user as JWTPayload).sub;
    return await quizService.updateQuiz(req.params.id, req.body, userId);
  }
};
