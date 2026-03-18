import { collections } from '../config/db.ts';
import { ObjectId } from 'mongodb';
import type { NoteDoc } from '../types/db.ts';

export const noteRepository = {
  async create(note: Omit<NoteDoc, '_id' | 'createdAt'>) {
    const result = await collections.notes.insertOne(note);
    return { ...note, _id: result.insertedId };
  },
  async deleteManyByUserId(userId: string) {
    const result = await collections.notes.deleteMany({ userId: new ObjectId(userId) });
    return result.deletedCount;
  },
  async findByUserAndQuiz(userId: string, quizId: string) {
    return await collections.notes.find({ 
      quizId: new ObjectId(quizId), 
      userId: new ObjectId(userId) 
    }).toArray();
  }
};