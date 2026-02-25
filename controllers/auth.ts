// Step 11: Implement the attempt controller that provides methods for starting quiz attempts. The start method takes a quiz ID from the request body and retrieves the user information from the JWT payload. It then calls the attemptService to start a new quiz attempt for the user and the specified quiz. The result of starting the attempt is returned to the client, allowing them to begin their quiz session. This controller serves as the entry point for users to initiate their quiz attempts and interact with the quiz system effectively.
import type { FastifyRequest, FastifyReply } from 'fastify';
import { authService } from '../services/auth.ts';
import type { RegisterBody, LoginBody } from '../types/http.ts';
import type { JWTPayload } from '../types/auth.ts';

export const authController = {
  async login(req: FastifyRequest<{ Body: LoginBody }>, _reply: FastifyReply) {
    const user = await authService.login(req.body);
    
    const payload: JWTPayload = { email: user.email, role: user.role, sub: user._id!.toString() };
    
    const token = await _reply.jwtSign(payload, { expiresIn: '15m' });
    const refreshToken = await _reply.jwtSign(payload, { expiresIn: '7d' });

    return { refreshToken, token, user: { id: user._id, role: user.role, username: user.username } };
  },

  async profile(req: FastifyRequest, _reply: FastifyReply) {
    return req.user; // Decoded from JWT by the authenticate decorator
  },

  async register(req: FastifyRequest<{ Body: RegisterBody }>, _reply: FastifyReply) {
    const user = await authService.register(req.body);
    return _reply.code(201).send({ message: 'User registered successfully', userId: user._id });
  }
};
