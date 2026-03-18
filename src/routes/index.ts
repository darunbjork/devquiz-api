import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  startAttemptSchema,
  saveAttemptSchema,
  createQuizSchema,
  updateQuizSchema,
  generateQuizSchema,
  getNotesSchema,
  getByIdSchema,
  updateRoleSchema,
  userIdParamSchema,
} from './schemas.ts';
import { authController } from '../controllers/auth.ts';
import { quizController } from '../controllers/quiz.ts';
import { attemptController } from '../controllers/attempt.ts';
import { noteController } from '../controllers/notes.ts';
import type { QuizData } from '@/services/quiz.ts';
import type { CompletedAttemptData } from '@/services/attempt.ts';
import type { FastifyInstance } from 'fastify';




export default async function routes(fastify: FastifyInstance) {

  fastify.post(
    '/api/auth/register',
    {
      config: { rateLimit: { max: 5, timeWindow: '1 min' } },
      schema: registerSchema,
    },
    authController.register
  );

  fastify.post(
    '/api/auth/login',
    {
      config: { rateLimit: { max: 5, timeWindow: '1 min' } },
      schema: loginSchema,
    },
    authController.login
  );
  
  fastify.post('/api/auth/refresh', authController.refreshToken);
  fastify.get('/api/auth/profile', { preHandler: [fastify.authenticate] }, authController.profile);
  fastify.get('/api/auth/me', { preHandler: [fastify.authenticate] }, authController.getMe);

  fastify.patch<{ Body: { username?: string; settings?: { theme: 'light' | 'dark' } } }>(
    '/api/auth/profile',
    { preHandler: [fastify.authenticate], schema: updateProfileSchema },
    authController.updateProfile
  );

  fastify.put<{ Params: { userId: string }; Body: { role: 'admin' | 'user' } }>(
    '/api/admin/users/:userId/role',
    { preHandler: [fastify.authenticate, fastify.adminAuthenticate], schema: updateRoleSchema },
    authController.updateUserRole
  );

  fastify.get('/api/admin/users', { preHandler: [fastify.authenticate, fastify.adminAuthenticate] }, authController.getAllUsers);

  fastify.delete<{ Params: { userId: string } }>(
    '/api/admin/users/:userId',
    { preHandler: [fastify.authenticate, fastify.adminAuthenticate], schema: userIdParamSchema },
    authController.deleteUser
  );

  fastify.get('/api/quizzes', quizController.getAll);
  fastify.get('/api/quizzes/my', { preHandler: [fastify.authenticate] }, quizController.getMyQuizzes);
  fastify.get<{ Params: { id: string } }>('/api/quizzes/:id', { schema: getByIdSchema }, quizController.getById);

  fastify.post<{ Body: QuizData }>(
    '/api/quizzes',
    { preHandler: [fastify.authenticate], schema: createQuizSchema },
    quizController.create
  );

  fastify.patch<{ Params: { id: string }; Body: Partial<QuizData> }>(
    '/api/quizzes/:id',
    { preHandler: [fastify.authenticate], schema: updateQuizSchema },
    quizController.update
  );

  fastify.delete<{ Params: { id: string } }>(
    '/api/quizzes/:id',
    { preHandler: [fastify.authenticate], schema: getByIdSchema },
    quizController.delete
  );

  fastify.post('/api/quizzes/generate', { preHandler: [fastify.authenticate], schema: generateQuizSchema }, quizController.generateQuiz);

  fastify.post('/api/attempts/start', { preHandler: [fastify.authenticate], schema: startAttemptSchema }, attemptController.start);

  fastify.post<{ Body: CompletedAttemptData }>(
    '/api/attempts',
    { preHandler: [fastify.authenticate], schema: saveAttemptSchema },
    attemptController.save
  );

  fastify.get('/api/attempts/my', { preHandler: [fastify.authenticate] }, attemptController.getMy);

  fastify.delete<{ Params: { id: string } }>(
    '/api/attempts/:id',
    { preHandler: [fastify.authenticate], schema: getByIdSchema },
    attemptController.delete
  );

  fastify.get('/api/notes/:quizId', { preHandler: [fastify.authenticate], schema: getNotesSchema }, noteController.getNotes);

  fastify.get('/health', async () => ({ db: 'connected', status: 'ok' }));
}