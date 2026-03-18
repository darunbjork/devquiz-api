import type { FastifyRequest, FastifyReply } from 'fastify';
import { attemptService, type CompletedAttemptData } from '../services/attempt.ts';
import type { JWTPayload } from '../types/auth.ts';

interface StartAttemptRequestBody {
  quizId: string;
}

export const attemptController = {
  async delete(req: FastifyRequest<{ Params: { id: string } }>, _reply: FastifyReply) {
    const userId = (req.user as JWTPayload).sub;
    await attemptService.deleteAttempt(req.params.id, userId);
    return _reply.code(204).send();
  },

  async getMy(req: FastifyRequest, _reply: FastifyReply) {
    const userId = (req.user as JWTPayload).sub;
    return await attemptService.getMyAttempts(userId);
  },

  async save(req: FastifyRequest<{ Body: CompletedAttemptData }>, _reply: FastifyReply) {
    const userId = (req.user as JWTPayload).sub;
    return await attemptService.saveAttempt(userId, req.body);
  },

  async start(req: FastifyRequest, _reply: FastifyReply) {
    const userId = (req.user as JWTPayload).sub;
    const { quizId } = req.body as StartAttemptRequestBody;
    return await attemptService.startAttempt(userId, quizId);
  }
};
