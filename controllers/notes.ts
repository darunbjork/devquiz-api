// Step 11: Implement the note controller that provides methods for retrieving notes associated with a quiz. The getNotes method takes a quiz ID from the request parameters and retrieves the user information from the JWT payload. It then calls the noteService to fetch the notes for the specified quiz and user. The retrieved notes are returned to the client, allowing users to access their notes related to specific quizzes. This controller serves as a crucial component for managing and displaying user-generated content within the quiz application, enhancing the overall user experience by providing easy access to relevant information and insights.
import type { FastifyRequest, FastifyReply } from 'fastify';
import { noteService } from '../services/notes.ts';
import type { JWTPayload } from '../types/auth.ts';

export const noteController = {
  async getNotes(req: FastifyRequest<{ Params: { quizId: string } }>, reply: FastifyReply) {
    const user = req.user as JWTPayload;
    return await noteService.getNotes(user.sub, req.params.quizId);
  }
};
