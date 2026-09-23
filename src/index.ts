/* eslint-disable perfectionist/sort-objects */
import Fastify from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { connectMongo } from './config/db.ts';
import authPlugin from './middleware/auth.ts';
import routes from './routes/index.ts';
import logger from './utils/logger.ts';
import errorHandlersPlugin from './middleware/errorHandlers.ts';

const fastify = Fastify({ logger: false });

const start = async () => {
  try {
    await connectMongo();

    // CORS_ORIGINS: comma-separated exact origins (authoritative when set).
    // Fallback allows local dev, both production frontends, and Vercel previews.
    const envOrigins = process.env.CORS_ORIGINS
      ?.split(',')
      .map((origin) => origin.trim())
      .filter(Boolean);

    const exactOrigins = envOrigins ?? [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:5174',
      'https://dev-quiz-2stl.vercel.app',
      'https://dev-quiz-silk.vercel.app',
    ];

    // Match any Vercel preview for this project (dev-quiz-<slug>.vercel.app).
    // Set CORS_ALLOW_VERCEL_PREVIEWS=false to disable.
    const allowVercelPreviews = process.env.CORS_ALLOW_VERCEL_PREVIEWS !== 'false';
    const vercelPreviewPattern = /^https:\/\/dev-quiz-[a-z0-9-]+\.vercel\.app$/;

    await fastify.register(cors, {
      origin: (origin, callback) => {
        // Allow non-browser / same-origin requests (curl, server-to-server)
        if (!origin) {
          callback(null, true);
          return;
        }

        const allowed =
          exactOrigins.includes(origin) ||
          (allowVercelPreviews && vercelPreviewPattern.test(origin));

        callback(null, allowed);
      },
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
      optionsSuccessStatus: 204,
    });

    await fastify.register(cookie);

    await fastify.register(helmet);
    await fastify.register(rateLimit, {
      max: 100,
      timeWindow: '1 min',
      errorResponseBuilder: () => ({
        statusCode: 429,
        error: 'Too Many Requests',
        message: 'Too many requests. Please slow down.',
      }),
    });

    await fastify.register(authPlugin);
    await fastify.register(swagger, {
      openapi: { info: { title: 'DevQuiz API', version: '1.0.0' } },
    });
    await fastify.register(swaggerUi, { routePrefix: '/docs' });

    await fastify.register(routes);

    // Redirect root to docs
    fastify.get('/', async (_request, reply) => {
      return reply.redirect('/docs');
    });

    await fastify.register(errorHandlersPlugin);

    const port = Number(process.env.PORT) || 3001;
    await fastify.listen({ host: '0.0.0.0', port });
    console.log(`🚀 Server ready at http://localhost:${port}`);
    console.log(`📖 Docs available at http://localhost:${port}/docs`);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

start();