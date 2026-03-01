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

const updateProfileSchema: FastifySchema = {
  body: {
    properties: {
      settings: {
        properties: {
          theme: { enum: ['light', 'dark'], type: 'string' },
        },
        type: 'object',
      },
      username: { type: 'string' },
    },
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

const saveAttemptSchema: FastifySchema = {
  body: {
    properties: {
      answers: {
        items: {
          properties: {
            isCorrect: { type: 'boolean' },
            questionId: { type: 'string' },
            selectedOption: { type: 'string' },
            userAnswer: { type: 'boolean' },
          },
          required: ['questionId', 'isCorrect'],
          type: 'object',
        },
        type: 'array',
      },
      attemptId: { type: 'string' },
      quizId: { type: 'string' },
      score: { type: 'number' },
      totalQuestions: { type: 'number' },
    },
    required: ['quizId', 'score', 'totalQuestions', 'answers'],
    type: 'object',
  },
};

const createQuizSchema: FastifySchema = {
  body: {
    properties: {
      description: { type: 'string' },
      difficulty: { enum: ['beginner', 'intermediate', 'advanced', 'Beginner', 'Intermediate', 'Advanced'], type: 'string' },
      questions: {
        items: {
          properties: {
            correctAnswerIndex: { type: 'number' },
            options: { items: { type: 'string' }, type: 'array' },
            questionText: { type: 'string' },
          },
          required: ['questionText', 'options', 'correctAnswerIndex'],
          type: 'object',
        },
        type: 'array',
      },
      title: { type: 'string' },
      topic: { type: 'string' },
    },
    required: ['title', 'description', 'topic', 'difficulty', 'questions'],
    type: 'object',
  },
};

const updateQuizSchema: FastifySchema = {
  body: {
    properties: {
      description: { type: 'string' },
      difficulty: { enum: ['beginner', 'intermediate', 'advanced', 'Beginner', 'Intermediate', 'Advanced'], type: 'string' },
      questions: {
        items: {
          properties: {
            correctAnswerIndex: { type: 'number' },
            options: { items: { type: 'string' }, type: 'array' },
            questionText: { type: 'string' },
          },
          required: ['questionText', 'options', 'correctAnswerIndex'],
          type: 'object',
        },
        type: 'array',
      },
      title: { type: 'string' },
      topic: { type: 'string' },
    },
    type: 'object',
  },
};

const generateQuizSchema: FastifySchema = {
  body: {
    properties: {
      difficulty: { type: 'string' },
      numQuestions: { type: 'number' },
      studyNote: { type: 'string' },
      topic: { type: 'string' },
    },
    required: ['topic', 'difficulty', 'numQuestions', 'studyNote'],
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

const getByIdSchema: FastifySchema = {
  params: {
    properties: {
      id: { type: 'string' },
    },
    required: ['id'],
    type: 'object',
  },
};

export default async function routes(fastify: FastifyInstance) {
  // --- Auth Routes ---
  fastify.post('/api/auth/register', { schema: registerSchema }, authController.register);
  fastify.post('/api/auth/login', { schema: loginSchema }, authController.login);
  fastify.get('/api/auth/profile', { preHandler: [fastify.authenticate] }, authController.profile);
  fastify.get('/api/auth/me', { preHandler: [fastify.authenticate] }, authController.getMe);
  fastify.patch('/api/auth/profile', { preHandler: [fastify.authenticate], schema: updateProfileSchema }, authController.updateProfile);

  // --- Quiz Routes ---
  fastify.get('/api/quizzes', quizController.getAll);
  fastify.get('/api/quizzes/my', { preHandler: [fastify.authenticate] }, quizController.getMyQuizzes);
  fastify.get('/api/quizzes/:id', { schema: getByIdSchema }, quizController.getById);
  fastify.post('/api/quizzes', { preHandler: [fastify.authenticate], schema: createQuizSchema }, quizController.create);
  fastify.patch('/api/quizzes/:id', { preHandler: [fastify.authenticate], schema: updateQuizSchema }, quizController.update);
  fastify.delete('/api/quizzes/:id', { preHandler: [fastify.authenticate], schema: getByIdSchema }, quizController.delete);
  fastify.post('/api/quizzes/generate', { preHandler: [fastify.authenticate], schema: generateQuizSchema }, quizController.generateQuiz);

  // --- Attempt Routes ---
  fastify.post('/api/attempts/start', { preHandler: [fastify.authenticate], schema: startAttemptSchema }, attemptController.start);
  fastify.post('/api/attempts', { preHandler: [fastify.authenticate], schema: saveAttemptSchema }, attemptController.save);
  fastify.get('/api/attempts/my', { preHandler: [fastify.authenticate] }, attemptController.getMy);
  fastify.delete('/api/attempts/:id', { preHandler: [fastify.authenticate], schema: getByIdSchema }, attemptController.delete);

  // --- Notes Routes ---
  fastify.get('/api/notes/:quizId', { preHandler: [fastify.authenticate], schema: getNotesSchema }, noteController.getNotes);

  // --- Health Check ---
  fastify.get('/health', async () => ({ db: 'connected', status: 'ok' }));
}
