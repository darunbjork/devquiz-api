// Step 9: Export the authentication plugin using 'fastify-plugin' to ensure it can be registered in the Fastify application. This allows the authentication logic to be modular and reusable across different parts of the application, enabling secure access control for protected routes.
import { collections } from '../db.ts';
import type { UserDoc } from '../types/db.ts';
import { ObjectId } from 'mongodb';

export const userRepository = {
  async create(user: UserDoc) {
    const result = await collections.users.insertOne(user);
    return { ...user, _id: result.insertedId };
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
  async findAll() {
    return await collections.users.find<UserDoc>({}).toArray();
  },
  async delete(userId: string) {
    const result = await collections.users.deleteOne({ _id: new ObjectId(userId) });
    return result.deletedCount === 1;
  }
};
