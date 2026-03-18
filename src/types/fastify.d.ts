import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import { JWTPayload } from './auth';
import { JWT } from '@fastify/jwt'; 

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    adminAuthenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>; 
    jwtSign: (payload: JWTPayload, options: { expiresIn: string }) => Promise<string>;
  }

  interface FastifyRequest {
    user: JWTPayload; 
    jwt: JWT;
  }
}
