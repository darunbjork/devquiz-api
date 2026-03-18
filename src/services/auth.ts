/* eslint-disable perfectionist/sort-objects */
import { userRepository } from '../repository/user.ts';
import { quizRepository } from '../repository/quiz.ts';
import { attemptRepository } from '../repository/attempt.ts';
import { questionRepository } from '../repository/question.ts';
import { noteRepository } from '../repository/notes.ts';
import { hashPassword, comparePassword } from '../utils/password.ts';
import { ConflictError, UnauthorizedError, NotFoundError } from '../errors.ts';
import type { RegisterBody, LoginBody } from '../types/http.ts';
import { transformQuiz, transformAttempt, transformUser } from '../utils/transform.ts';

import type { UserDoc } from '../types/db.ts';

import type { JWT } from '@fastify/jwt';
import type { JWTPayload } from '../types/auth.ts';

export const authService = {
  async login(data: LoginBody) {
    const user = await userRepository.findByEmail(data.email);
    if (!user || !(await comparePassword(user.passwordHash, data.password))) {
      throw new UnauthorizedError('Invalid email or password');
    }
    return transformUser(user);
  },

  async refreshToken(refreshToken: string, jwt: JWT, signJwt: (payload: JWTPayload, options: { expiresIn: string }) => Promise<string>) {
    let payload: JWTPayload;
    try {
      payload = jwt.verify(refreshToken) as JWTPayload;
    } catch (_error) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    const user = await userRepository.findById(payload.sub);
    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedError('Refresh token not found or user not active');
    }

    const isMatch = await comparePassword(user.refreshTokenHash, refreshToken);
    if (!isMatch) {
      await userRepository.updateRefreshTokenHash(user._id!.toString(), null);
      throw new UnauthorizedError('Invalid refresh token');
    }

    const newAccessToken = await signJwt(
      { sub: user._id!.toString(), role: user.role, email: user.email },
      { expiresIn: '15m' }
    );
    const newRefreshToken = await signJwt(
      { sub: user._id!.toString(), role: user.role, email: user.email },
      { expiresIn: '7d' }
    );

    const hashedNewRefreshToken = await hashPassword(newRefreshToken);
    await userRepository.updateRefreshTokenHash(user._id!.toString(), hashedNewRefreshToken);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  },

  async register(data: RegisterBody) {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) throw new ConflictError('Email already registered');

    const hashedPassword = await hashPassword(data.password);
    const user = await userRepository.create({
      createdAt: new Date(),
      email: data.email,
      passwordHash: hashedPassword,
      role: 'user',
      settings: { theme: 'light' },
      username: data.username
    });
    return transformUser(user);
  },

  async getMe(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) throw new NotFoundError('User not found');

    const quizDocs = await quizRepository.findByUserId(userId);
    const createdQuizzes = await Promise.all(quizDocs.map(async (q) => {
      const questions = await questionRepository.findByQuizId(q._id!.toString());
      return transformQuiz(q, questions);
    }));

    const attemptDocs = await attemptRepository.findByUserId(userId);
    const quizzes = attemptDocs.map(a => transformAttempt(a));

    return {
      ...transformUser(user),
      createdQuizzes,
      quizzes,
      role: user.role
    };
  },

  async updateProfile(userId: string, data: { username?: string; settings?: { theme: 'light' | 'dark' } }) {
    const update: Partial<UserDoc> = {};
    if (data.username) update.username = data.username;
    if (data.settings) update.settings = data.settings;

    const user = await userRepository.update(userId, update);
    if (!user) throw new NotFoundError('User not found');
    return transformUser(user);
  },

  async updateUserRole(userId: string, newRole: 'admin' | 'user') {
    const user = await userRepository.update(userId, { role: newRole });
    if (!user) throw new NotFoundError('User not found');
    return transformUser(user);
  },

  async getAllUsers() {
    const users = await userRepository.findAll();
    return users.map(user => transformUser(user));
  },

  async deleteUser(userId: string) {
    await noteRepository.deleteManyByUserId(userId);
    await quizRepository.deleteManyByUserId(userId);
    await attemptRepository.deleteManyByUserId(userId);

    const deleted = await userRepository.delete(userId);
    if (!deleted) throw new NotFoundError('User not found');
    return deleted;
  }
};
