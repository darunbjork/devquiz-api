import type { FastifyInstance, FastifySchema } from 'fastify';
import { authController } from './controllers/auth.ts';
import { quizController } from './controllers/quiz.ts';
import { attemptController } from './controllers/attempt.ts';
import { noteController } from './controllers/notes.ts';

// Define schemas directly in routes.ts for simplicity
const registerSchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['username', 'email', 'password'],
    properties: {
      username: { type: 'string' },
      email: { type: 'string', format: 'email' },
      password: { type: 'string' },
      role: { type: 'string', enum: ['user', 'admin'], default: 'user' },
    },
  },
};

const loginSchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string' },
    },
  },
};

const startAttemptSchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['quizId'],
    properties: {
      quizId: { type: 'string' },
    },
  },
};

const getNotesSchema: FastifySchema = {
  params: {
    type: 'object',
    required: ['quizId'],
    properties: {
      quizId: { type: 'string' },
    },
  },
};

export default async function routes(fastify: FastifyInstance) {
  // --- Auth Routes ---
  fastify.post('/api/auth/register', { schema: registerSchema }, authController.register);
  fastify.post('/api/auth/login', { schema: loginSchema }, authController.login);
  fastify.get('/api/auth/profile', { preHandler: [fastify.authenticate] }, authController.profile);

  // --- Quiz Routes ---
  fastify.get('/api/quizzes', quizController.getAll);
  fastify.get('/api/quizzes/:id', { schema: getNotesSchema }, quizController.getById); // Reusing getNotesSchema for quiz ID

  // --- Attempt Routes ---
  fastify.post('/api/attempts/start', { preHandler: [fastify.authenticate], schema: startAttemptSchema }, attemptController.start);

  // --- Notes Routes ---
  fastify.get('/api/notes/:quizId', { preHandler: [fastify.authenticate], schema: getNotesSchema }, noteController.getNotes);

  // --- Health Check ---
  fastify.get('/health', async () => ({ status: 'ok', db: 'connected' }));
}
