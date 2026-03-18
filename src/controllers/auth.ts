import type { FastifyRequest, FastifyReply } from 'fastify';
import { authService } from '../services/auth.ts';
import { userRepository } from '../repository/user.ts';
import { hashPassword } from '../utils/password.ts';
import type { RegisterBody, LoginBody } from '../types/http.ts';
import type { JWTPayload } from '../types/auth.ts';
import { UnauthorizedError } from '../errors.ts';

export const authController = {
  async deleteUser(req: FastifyRequest<{ Params: { userId: string } }>, _reply: FastifyReply) {
    await authService.deleteUser(req.params.userId);
    return { message: 'User deleted successfully' };
  },

  async getAllUsers(_req: FastifyRequest, _reply: FastifyReply) {
    return await authService.getAllUsers();
  },

  async getMe(req: FastifyRequest, _reply: FastifyReply) {
    const userId = (req.user as JWTPayload).sub;
    return await authService.getMe(userId);
  },

  async login(req: FastifyRequest<{ Body: LoginBody }>, _reply: FastifyReply) {
    const user = await authService.login(req.body);

    if (!user) {
      throw new UnauthorizedError('Authentication failed: user not found');
    }

    const payload: JWTPayload = {
      email: user.email,
      role: user.role,
      sub: user.id,
    };

    const token = await _reply.jwtSign(payload, { expiresIn: '15m' });
    const refreshToken = await _reply.jwtSign(payload, { expiresIn: '7d' });

    const hashedRefreshToken = await hashPassword(refreshToken);
    await userRepository.updateRefreshTokenHash(user.id, hashedRefreshToken);

    _reply.setCookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
    });

    return {
      token,
      user: {
        id: user.id,
        role: user.role,
        settings: user.settings,
        username: user.username,
      },
    };
  },

  async profile(req: FastifyRequest, _reply: FastifyReply) {
    return req.user;
  },

  async refreshToken(req: FastifyRequest, _reply: FastifyReply) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedError('No refresh token provided');
    }

    if (typeof refreshToken !== 'string' || refreshToken.split('.').length !== 3) {
      throw new UnauthorizedError('Malformed refresh token');
    }

    try {
      const { accessToken, refreshToken: newRefreshToken } = await authService.refreshToken(
        refreshToken,
        req.jwt,
        _reply.jwtSign
      );

      _reply.setCookie('refreshToken', newRefreshToken, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      });

      return { token: accessToken };
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        throw error;
      }
      req.log.error(error, 'Unexpected error during refresh token process');
      throw new UnauthorizedError('Failed to refresh token due to unexpected error');
    }
  },

  async register(req: FastifyRequest<{ Body: RegisterBody }>, _reply: FastifyReply) {
    const user = await authService.register(req.body);
    if (!user) {
      return _reply.code(400).send({ message: 'User registration failed' });
    }
    return _reply.code(201).send({ message: 'User registered successfully', userId: user.id });
  },

  async updateProfile(
    req: FastifyRequest<{ Body: { username?: string; settings?: { theme: 'light' | 'dark' } } }>,
    _reply: FastifyReply
  ) {
    const userId = (req.user as JWTPayload).sub;
    return await authService.updateProfile(userId, req.body);
  },

  async updateUserRole(
    req: FastifyRequest<{ Params: { userId: string }; Body: { role: 'admin' | 'user' } }>,
    _reply: FastifyReply
  ) {
    const { userId } = req.params;
    const { role } = req.body;
    const updatedUser = await authService.updateUserRole(userId, role);
    return { message: 'User role updated successfully', user: updatedUser };
  },
};