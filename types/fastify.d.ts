import '@fastify/jwt'; // Import to ensure module augmentation works

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: any; // You can refine 'any' to a more specific type if known
  }
}
