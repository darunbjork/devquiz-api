import fp from 'fastify-plugin';
import type { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import jwt from '@fastify/jwt';
import { UnauthorizedError, ForbiddenError } from '../errors.ts';
import type { JWTPayload } from '../types/auth.ts';


const authPlugin: FastifyPluginAsync = async (fastify) => {

  fastify.register(jwt, {
    secret: process.env.JWT_SECRET_KEY || 'dev-secret-key',
  });
  
  fastify.decorate('authenticate', async (request: FastifyRequest, _reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch {
      throw new UnauthorizedError('Invalid or expired token');
    }
  });

  fastify.decorate('adminAuthenticate', async (request: FastifyRequest, _reply: FastifyReply) => {
    try {
      await request.jwtVerify();
      const payload = request.user as JWTPayload;
      if (payload.role !== 'admin') {
        throw new ForbiddenError('Admin privileges required');
      }
    } catch (_err) {
      throw _err instanceof ForbiddenError ? _err : new UnauthorizedError();
    }
  });
};

export default fp(authPlugin);
