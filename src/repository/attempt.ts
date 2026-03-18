import { collections } from '../config/db.ts';
import { ObjectId } from 'mongodb';
import type { AttemptDoc } from '../types/db.ts';

export const attemptRepository = {
  async create(attempt: Omit<AttemptDoc, '_id'>) {
    const result = await collections.attempts.insertOne(attempt);
    return { ...attempt, _id: result.insertedId };
  },
  async delete(id: string) {
    return await collections.attempts.deleteOne({ _id: new ObjectId(id) });
  },
  async deleteManyByUserId(userId: string) {
    const result = await collections.attempts.deleteMany({ userId: new ObjectId(userId) });
    return result.deletedCount;
  },
  async findById(id: string) {
    return await collections.attempts.findOne<AttemptDoc>({ _id: new ObjectId(id) });
  },
  async findByUserId(userId: string) {
    return await collections.attempts.find<AttemptDoc>({ userId: new ObjectId(userId) }).toArray();
  },
  async update(id: string, update: Partial<AttemptDoc>) {
    await collections.attempts.updateOne({ _id: new ObjectId(id) }, { $set: update });
    return await this.findById(id);
  }
};
