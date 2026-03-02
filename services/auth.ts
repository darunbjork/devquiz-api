/* eslint-disable perfectionist/sort-objects */
// Step 10: Implement the authentication service that provides methods for user registration and login. The register method checks if the email is already registered, hashes the password using the hashPassword function, and creates a new user in the database. The login method retrieves the user by email, verifies the password using the comparePassword function, and returns the user if authentication is successful. If any validation fails during registration or login, appropriate errors are thrown to inform the client of the issue.
import { userRepository } from '../repository/user.ts';
import { quizRepository } from '../repository/quiz.ts';
import { attemptRepository } from '../repository/attempt.ts';
import { questionRepository } from '../repository/question.ts';
import { hashPassword, comparePassword } from '../utils/password.ts';
import { ConflictError, UnauthorizedError, NotFoundError } from '../errors.ts';
import type { RegisterBody, LoginBody } from '../types/http.ts';
import { transformQuiz, transformAttempt, transformUser } from '../utils/transform.ts';

import type { UserDoc } from '../types/db.ts';

export const authService = {
  async login(data: LoginBody) {
    const user = await userRepository.findByEmail(data.email);
    if (!user || !(await comparePassword(user.passwordHash, data.password))) {
      throw new UnauthorizedError('Invalid email or password');
    }
    return transformUser(user);
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
      quizzes
    };
  },

  async updateProfile(userId: string, data: { username?: string; settings?: { theme: 'light' | 'dark' } }) {
    const update: Partial<UserDoc> = {};
    if (data.username) update.username = data.username;
    if (data.settings) update.settings = data.settings;

    const user = await userRepository.update(userId, update);
    if (!user) throw new NotFoundError('User not found');
    return transformUser(user);
  }
};
