import Fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { connectMongo } from './db.ts';
import authPlugin from './auth.ts';
import routes from './routes.ts';
import logger from './logger.ts';
import { AppError } from './errors.ts';

const fastify = Fastify({ logger: false });

const start = async () => {
  try {
    // 1. Connect Database
    await connectMongo();

    // 2. Register CORS
    await fastify.register(cors, { 
      origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Explicitly allow frontend origins
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
      optionsSuccessStatus: 204 // Standard for preflight success
    });

    // 3. Register Auth & Swagger
    await fastify.register(authPlugin);
    await fastify.register(swagger, {
      openapi: { info: { title: 'DevQuiz API', version: '1.0.0' } }
    });
    await fastify.register(swaggerUi, { routePrefix: '/docs' });

    // 4. Register Routes
    await fastify.register(routes);

    // 5. Global Error Handler
    fastify.setErrorHandler((error, _request, reply) => {
      if (error instanceof AppError) {
        return reply.status(error.statusCode).send({ message: error.message });
      }
      logger.error(error);
      return reply.status(500).send({ message: 'Internal Server Error' });
    });

    // 6. Start Listening
    const port = Number(process.env.PORT) || 3000;
    await fastify.listen({ host: '0.0.0.0', port });
    console.log(`🚀 Server ready at http://localhost:${port}`);
    console.log(`📖 Docs available at http://localhost:${port}/docs`);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

start();
