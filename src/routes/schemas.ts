import type { FastifySchema } from 'fastify';

export const registerSchema: FastifySchema = {
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

export const loginSchema: FastifySchema = {
  body: {
    properties: {
      email: { format: 'email', type: 'string' },
      password: { type: 'string' },
    },
    required: ['email', 'password'],
    type: 'object',
  },
};

export const updateProfileSchema: FastifySchema = {
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

export const startAttemptSchema: FastifySchema = {
  body: {
    properties: {
      quizId: { type: 'string' },
    },
    required: ['quizId'],
    type: 'object',
  },
};

export const saveAttemptSchema: FastifySchema = {
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

export const createQuizSchema: FastifySchema = {
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

export const updateQuizSchema: FastifySchema = {
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

export const generateQuizSchema: FastifySchema = {
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

export const getNotesSchema: FastifySchema = {
  params: {
    properties: {
      quizId: { type: 'string' },
    },
    required: ['quizId'],
    type: 'object',
  },
};

export const getByIdSchema: FastifySchema = {
  params: {
    properties: {
      id: { type: 'string' },
    },
    required: ['id'],
    type: 'object',
  },
};

export const updateRoleSchema: FastifySchema = {
  body: {
    properties: {
      role: { enum: ['admin', 'user'], type: 'string' },
    },
    required: ['role'],
    type: 'object',
  },
};

export const userIdParamSchema: FastifySchema = {
  params: {
    properties: {
      userId: { type: 'string' },
    },
    required: ['userId'],
    type: 'object',
  },
};
