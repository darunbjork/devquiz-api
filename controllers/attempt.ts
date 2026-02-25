import { FastifyRequest, FastifyReply } from 'fastify';
import { attemptService } from '../services/attempt.ts';
import { JWTPayload } from '../types/auth.ts';

export const attemptController = {
  async start(req: FastifyRequest<{ Body: { quizId: string } }>, reply: FastifyReply) {
    const user = req.user as JWTPayload;
    return await attemptService.startAttempt(user.sub, req.body.quizId);
  }
};
