import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { AppError } from '../errors.ts';
import logger from '../logger.ts';

async function errorHandlersPlugin(fastify: FastifyInstance) {
  fastify.setErrorHandler((error: Error, request: FastifyRequest, reply: FastifyReply) => {
    // Log the error for server-side debugging
    logger.error(`Request ID: ${request.id}, Path: ${request.url}, Error: ${error.message}, Stack: ${error.stack}`);

    if (error instanceof AppError) {
      reply.status(error.statusCode).send({ message: error.message });
      return;
    }

    // Handle Fastify's built-in errors, especially validation errors
    if ('statusCode' in error && typeof error.statusCode === 'number' && error.statusCode >= 400 && error.statusCode < 500) {
      reply.status(error.statusCode).send({ message: error.message });
      return;
    }

    // Fallback for any other unhandled errors
    reply.status(500).send({ message: 'Internal Server Error' });
  });
}

export default fp(errorHandlersPlugin);
