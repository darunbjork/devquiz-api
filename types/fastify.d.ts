import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import { JWTPayload } from './auth'; // Import your JWTPayload
import { JWT } from '@fastify/jwt'; // <--- ADD THIS IMPORT

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    adminAuthenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>; // <--- ADD THIS FOR COMPLETENESS, it's used in routes.ts
    jwtSign: (payload: JWTPayload, options: { expiresIn: string }) => Promise<string>; // <--- ADD THIS FOR COMPLETENESS, it's used in authController
  }

  interface FastifyRequest {
    user: JWTPayload; // To make req.user typed correctly
    jwt: JWT; // <--- ADD THIS LINE TO DECLARE THE JWT PROPERTY
  }

  // FastifyReply already has jwtSign and jwtVerify from @fastify/jwt
  // No need to redeclare if already handled by @fastify/jwt's own types
}
