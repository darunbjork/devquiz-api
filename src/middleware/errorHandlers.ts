import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { AppError, InternalServerError } from '../errors.ts';
import logger from '../utils/logger.ts';

async function errorHandlersPlugin(fastify: FastifyInstance) {
  fastify.setErrorHandler((error: Error, request: FastifyRequest, reply: FastifyReply) => {
    logger.error(`Request ID: ${request.id}, Path: ${request.url}, Error: ${error.message}, Stack: ${error.stack}`);

    if (error instanceof AppError) {
      reply.status(error.statusCode).send({ message: error.message });
      return;
    }

    if ('statusCode' in error && typeof error.statusCode === 'number' && error.statusCode >= 400 && error.statusCode < 500) {
      reply.status(error.statusCode).send({ message: error.message });
      return;
    }

    
    const serverError = new InternalServerError();
    reply.status(serverError.statusCode).send({ message: serverError.message });
  });
}

export default fp(errorHandlersPlugin);