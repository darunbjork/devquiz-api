// Step 11: Implement the attempt controller that provides methods for starting quiz attempts. The start method takes a quiz ID from the request body and retrieves the user information from the JWT payload. It then calls the attemptService to start a new quiz attempt for the user and the specified quiz. The result of starting the attempt is returned to the client, allowing them to begin their quiz session. This controller serves as the entry point for users to initiate their quiz attempts and interact with the quiz system effectively.
import type { FastifyRequest, FastifyReply } from 'fastify';
import { attemptService } from '../services/attempt.ts';
import type { JWTPayload } from '../types/auth.ts';

// Define the interface for the request body based on startAttemptSchema
interface StartAttemptRequestBody {
  quizId: string;
}

export const attemptController = {
  async start(req: FastifyRequest, _reply: FastifyReply) { // Removed { Body: StartAttemptRequestBody }
    const user = req.user as JWTPayload;
    const { quizId } = req.body as StartAttemptRequestBody; // Added type assertion
    return await attemptService.startAttempt(user.sub, quizId);
  }
};
