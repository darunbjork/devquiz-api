// Step 11: Implement the quiz controller that provides methods for retrieving quiz information. The getAll method retrieves a list of all available quizzes, while the getById method retrieves detailed information about a specific quiz based on its ID. This controller serves as the primary interface for clients to access quiz data, allowing them to browse available quizzes and view details about individual quizzes as needed. By providing these methods, the quiz controller plays a crucial role in facilitating user interaction with the quiz system and enabling users to explore and engage with the quizzes offered by the application.
import type { FastifyRequest, FastifyReply } from 'fastify';
import { quizService } from '../services/quiz.ts';

export const quizController = {
  async getAll(req: FastifyRequest, reply: FastifyReply) {
    return await quizService.getAllQuizzes();
  },

  async getById(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    return await quizService.getQuizById(req.params.id);
  }
};
