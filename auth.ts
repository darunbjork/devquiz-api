// Step 8: Implement the authentication plugin for Fastify using the '@fastify/jwt' plugin. This plugin will provide decorators for authenticating users based on JWTs. The 'authenticate' decorator will verify the presence and validity of a JWT in incoming requests, while the 'adminAuthenticate' decorator will additionally check if the authenticated user has an 'admin' role. If authentication or authorization fails, appropriate errors (UnauthorizedError or ForbiddenError) will be thrown to prevent access to protected routes. This plugin can be registered in the Fastify application to secure endpoints that require authentication and role-based access control.
import fp from 'fastify-plugin';
import type { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import jwt from '@fastify/jwt';
import { UnauthorizedError, ForbiddenError } from './errors.ts';
import type { JWTPayload } from './types/auth.ts';

// FastifyPluginAsync is a type from the Fastify framework that represents an asynchronous plugin function.
// It defines the signature for functions that extend Fastify's capabilities, allowing for asynchronous
// operations during plugin registration. This ensures that the plugin is properly typed and can
// perform setup tasks (like registering other plugins or decorators) asynchronously.
const authPlugin: FastifyPluginAsync = async (fastify) => {
  // fastify.register is used to extend Fastify's functionality with plugins.
  // Here, we're registering the '@fastify/jwt' plugin, which provides utilities
  // for working with JSON Web Tokens (JWTs). The 'secret' option is crucial
  // for signing and verifying JWTs; it should be a strong, environment-variable-driven key.
  // Once registered, JWT-related methods like `request.jwtVerify()` become available.
  fastify.register(jwt, {
    secret: process.env.JWT_SECRET_KEY || 'dev-secret-key',
  });

  // fastify.decorate is a powerful feature to add custom properties or methods
  // to the Fastify instance or to request/reply objects.
  // Here, we're adding an 'authenticate' method directly to the Fastify instance.
  // This method acts as a 'preHandler' for routes, meaning it runs before the
  // main route handler. It verifies the incoming request's JWT.
  // If the token is invalid or expired, it throws an UnauthorizedError,
  // preventing the route handler from executing.
  
  fastify.decorate('authenticate', async (request: FastifyRequest, _reply: FastifyReply) => {
    try {
      // request.jwtVerify() is provided by the '@fastify/jwt' plugin.
      // It attempts to verify the JWT present in the request headers (e.g., Authorization: Bearer <token>).
      await request.jwtVerify();
    } catch {
      // If jwtVerify fails, an error is caught, and an UnauthorizedError is thrown.
      // This immediately stops further processing and sends a 401 Unauthorized response.
      throw new UnauthorizedError('Invalid or expired token');
    }
  });

  // This is another decorator, similar to 'authenticate', but with an added
  // layer of authorization check for 'admin' roles.
  // It ensures not only that a valid token is present, but also that the
  // authenticated user has an 'admin' role within their JWT payload.
  
  fastify.decorate('adminAuthenticate', async (request: FastifyRequest, _reply: FastifyReply) => {
    try {
      // First, verify the JWT token like the 'authenticate' decorator.
      await request.jwtVerify();
      // After successful verification, the decoded JWT payload is attached to 'request.user'.
      // We cast it to our custom JWTPayload type for type safety.
      const payload = request.user as JWTPayload;
      // Check if the user's role is 'admin'. If not, throw a ForbiddenError.
      if (payload.role !== 'admin') {
        throw new ForbiddenError('Admin privileges required');
      }
    } catch (_err) {
      // If an error occurs, check if it's already a ForbiddenError (from our role check).
      // Otherwise, assume it's an authentication error (e.g., invalid token) and throw UnauthorizedError.
      throw _err instanceof ForbiddenError ? _err : new UnauthorizedError();
    }
  });
};

// fp (fastify-plugin) wraps our plugin to ensure it's loaded once and its
// decorators/enhancements are available across the entire Fastify application,
// even for plugins registered after this one.
export default fp(authPlugin);
