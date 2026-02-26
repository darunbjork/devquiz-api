// Step 9: Export the authentication plugin using 'fastify-plugin' to ensure it can be registered in the Fastify application. This allows the authentication logic to be modular and reusable across different parts of the application, enabling secure access control for protected routes.
import { collections } from '../db.ts';
import { ObjectId } from 'mongodb';
import type { AttemptDoc } from '../types/db.ts';

export const attemptRepository = {
  async create(attempt: Omit<AttemptDoc, '_id'>) {
    const result = await collections.attempts.insertOne(attempt);
    return { ...attempt, _id: result.insertedId };
  },
  async findById(id: string) {
    return await collections.attempts.findOne({ _id: new ObjectId(id) });
  }
};
