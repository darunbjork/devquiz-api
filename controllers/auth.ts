import { FastifyRequest, FastifyReply } from 'fastify';
import { authService } from '../services/auth.ts';
import { RegisterBody, LoginBody } from '../types/http.ts';
import { JWTPayload } from '../types/auth.ts';

export const authController = {
  async register(req: FastifyRequest<{ Body: RegisterBody }>, reply: FastifyReply) {
    const user = await authService.register(req.body);
    return reply.code(201).send({ message: 'User registered successfully', userId: user._id });
  },

  async login(req: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply) {
    const user = await authService.login(req.body);
    
    const payload: JWTPayload = { sub: user._id!.toString(), email: user.email, role: user.role };
    
    const token = await reply.jwtSign(payload, { expiresIn: '15m' });
    const refreshToken = await reply.jwtSign(payload, { expiresIn: '7d' });

    return { token, refreshToken, user: { id: user._id, username: user.username, role: user.role } };
  },

  async profile(req: FastifyRequest, reply: FastifyReply) {
    return req.user; // Decoded from JWT by the authenticate decorator
  }
};
