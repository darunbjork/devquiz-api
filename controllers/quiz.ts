import { FastifyRequest, FastifyReply } from 'fastify';
import { quizService } from '../services/quiz.ts';

export const quizController = {
  async getAll(req: FastifyRequest, reply: FastifyReply) {
    return await quizService.getAllQuizzes();
  },

  async getById(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    return await quizService.getQuizById(req.params.id);
  }
};
