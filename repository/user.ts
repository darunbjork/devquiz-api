/* eslint-disable perfectionist/sort-objects */
// Step 9: Export the authentication plugin using 'fastify-plugin' to ensure it can be registered in the Fastify application. This allows the authentication logic to be modular and reusable across different parts of the application, enabling secure access control for protected routes.
import { collections } from '../db.ts';
import type { UserDoc } from '../types/db.ts';
import { ObjectId } from 'mongodb';

export const userRepository = {
  async create(user: UserDoc) {
    const result = await collections.users.insertOne(user);
    return { ...user, _id: result.insertedId };
  },
  async delete(userId: string) {
    const result = await collections.users.deleteOne({ _id: new ObjectId(userId) });
    return result.deletedCount === 1;
  },
  async findAll() {
    return await collections.users.find<UserDoc>({}).toArray();
  },
  async findByEmail(email: string) {
    return await collections.users.findOne<UserDoc>({ email });
  },
  async findById(id: string) {
    return await collections.users.findOne<UserDoc>({ _id: new ObjectId(id) });
  },
  async update(id: string, update: Partial<UserDoc>) {
    await collections.users.updateOne({ _id: new ObjectId(id) }, { $set: update });
    return await this.findById(id);
  },
  async updateRefreshTokenHash(userId: string, refreshTokenHash: string | null) {
    await collections.users.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { refreshTokenHash } }
    );
  },
  async findByRefreshTokenHash(refreshTokenHash: string) {
    return await collections.users.findOne<UserDoc>({ refreshTokenHash });
  }
};
