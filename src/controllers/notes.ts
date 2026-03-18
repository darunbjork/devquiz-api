import type { FastifyRequest, FastifyReply } from 'fastify';
import { noteService } from '../services/notes.ts';
import type { JWTPayload } from '../types/auth.ts';

interface GetNotesRequestParams {
  quizId: string;
}

export const noteController = {
  async getNotes(req: FastifyRequest, _reply: FastifyReply) { 
    const user = req.user as JWTPayload;
    const { quizId } = req.params as GetNotesRequestParams;
    return await noteService.getNotes(user.sub, quizId);
  }
};
