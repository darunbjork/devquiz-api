import type { FastifyRequest, FastifyReply } from 'fastify';
import { noteService } from '../services/notes.ts';
import type { JWTPayload } from '../types/auth.ts';

export const noteController = {
  async getNotes(req: FastifyRequest<{ Params: { quizId: string } }>, reply: FastifyReply) {
    const user = req.user as JWTPayload;
    return await noteService.getNotes(user.sub, req.params.quizId);
  }
};
