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

    await fastify.register(cors, {
      origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174'],
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