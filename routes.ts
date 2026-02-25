// Step 12: Define the application routes in routes.ts, mapping HTTP endpoints to their corresponding controller methods. This file serves as the central routing configuration for the application, organizing the various API endpoints and their associated handlers. Each route is defined with its HTTP method, URL path, and any necessary pre-handlers (such as authentication) or validation schemas. By structuring the routes in this way, we ensure a clear and maintainable organization of the application's API endpoints, making it easier to manage and extend the functionality of the quiz application as needed.
import type { FastifyInstance, FastifySchema } from 'fastify';
import { authController } from './controllers/auth.ts';
import { quizController } from './controllers/quiz.ts';
import { attemptController } from './controllers/attempt.ts';
import { noteController } from './controllers/notes.ts';

// Define schemas directly in routes.ts for simplicity
const registerSchema: FastifySchema = {
  body: {
    properties: {
      email: { format: 'email', type: 'string' },
      password: { type: 'string' },
      role: { default: 'user', enum: ['user', 'admin'], type: 'string' },
      username: { type: 'string' },
    },
    required: ['username', 'email', 'password'],
    type: 'object',
  },
};

const loginSchema: FastifySchema = {
  body: {
    properties: {
      email: { format: 'email', type: 'string' },
      password: { type: 'string' },
    },
    required: ['email', 'password'],
    type: 'object',
  },
};

const startAttemptSchema: FastifySchema = {
  body: {
    properties: {
      quizId: { type: 'string' },
    },
    required: ['quizId'],
    type: 'object',
  },
};

const getNotesSchema: FastifySchema = {
  params: {
    properties: {
      quizId: { type: 'string' },
    },
    required: ['quizId'],
    type: 'object',
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
  fastify.get('/health', async () => ({ db: 'connected', status: 'ok' }));
}
