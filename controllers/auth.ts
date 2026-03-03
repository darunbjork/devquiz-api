/* eslint-disable perfectionist/sort-objects */
// Step 11: Implement the attempt controller that provides methods for starting quiz attempts. The start method takes a quiz ID from the request body and retrieves the user information from the JWT payload. It then calls the attemptService to start a new quiz attempt for the user and the specified quiz. The result of starting the attempt is returned to the client, allowing them to begin their quiz session. This controller serves as the entry point for users to initiate their quiz attempts and interact with the quiz system effectively.
import type { FastifyRequest, FastifyReply } from 'fastify';
import { authService } from '../services/auth.ts';
import type { RegisterBody, LoginBody } from '../types/http.ts';
import type { JWTPayload } from '../types/auth.ts';

export const authController = {
  async login(req: FastifyRequest<{ Body: LoginBody }>, _reply: FastifyReply) {
    const user = await authService.login(req.body);
    
    const payload: JWTPayload = { 
      email: user?.email ?? '', 
      role: user?.role ?? 'user', 
      sub: user?.id ?? '' 
    };
    
    const token = await _reply.jwtSign(payload, { expiresIn: '15m' });
    const refreshToken = await _reply.jwtSign(payload, { expiresIn: '7d' });

    if (!user) {
      throw new Error('Authentication failed: user not found');
    }
    return {
      refreshToken,
      token,
      user: {
        id: user.id,
        role: user.role,
        settings: user.settings,
        username: user.username,
      }
    };
  },

  async profile(req: FastifyRequest, _reply: FastifyReply) {
    return req.user; // Decoded from JWT by the authenticate decorator
  },

  async getMe(req: FastifyRequest, _reply: FastifyReply) {
    const userId = (req.user as JWTPayload).sub;
    return await authService.getMe(userId);
  },

  async updateProfile(req: FastifyRequest<{ Body: { username?: string; settings?: { theme: 'light' | 'dark' } } }>, _reply: FastifyReply) {
    const userId = (req.user as JWTPayload).sub;
    return await authService.updateProfile(userId, req.body);
  },

  async register(req: FastifyRequest<{ Body: RegisterBody }>, _reply: FastifyReply) {
    const user = await authService.register(req.body);
    if (!user) {
      return _reply.code(400).send({ message: 'User registration failed' });
    }
    return _reply.code(201).send({ message: 'User registered successfully', userId: user.id });
  },

  async updateUserRole(req: FastifyRequest<{ Params: { userId: string }; Body: { role: 'admin' | 'user' } }>, _reply: FastifyReply) {
    const { userId } = req.params;
    const { role } = req.body;
    const updatedUser = await authService.updateUserRole(userId, role);
    return { message: 'User role updated successfully', user: updatedUser };
  },

  async getAllUsers(_req: FastifyRequest, _reply: FastifyReply) {
    return await authService.getAllUsers();
  },

  async deleteUser(req: FastifyRequest<{ Params: { userId: string } }>, _reply: FastifyReply) {
    await authService.deleteUser(req.params.userId);
    return { message: 'User deleted successfully' };
  }
};
