import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import { JWTPayload } from './auth'; // Import your JWTPayload

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }

  interface FastifyRequest {
    user: JWTPayload; // To make req.user typed correctly
  }

  // FastifyReply already has jwtSign and jwtVerify from @fastify/jwt
  // No need to redeclare if already handled by @fastify/jwt's own types
}
