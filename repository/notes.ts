// Step 9: Export the authentication plugin using 'fastify-plugin' to ensure it can be registered in the Fastify application. This allows the authentication logic to be modular and reusable across different parts of the application, enabling secure access control for protected routes.
import { collections } from '../db.ts';
import { ObjectId } from 'mongodb';
import type { NoteDoc } from '../types/db.ts';

// The noteRepository provides methods to interact with the 'notes' collection in the MongoDB database. It includes a method to find notes based on a specific user and quiz, and a method to create new notes. The 'findByUserAndQuiz' method retrieves all notes that match the given userId and quizId, while the 'create' method inserts a new note document into the collection and returns the created note with its generated _id.
export const noteRepository = {
  async create(note: Omit<NoteDoc, '_id' | 'createdAt'>) {
    const result = await collections.notes.insertOne(note);
    return { ...note, _id: result.insertedId };
  },
  async findByUserAndQuiz(userId: string, quizId: string) {
    return await collections.notes.find({ 
      quizId: new ObjectId(quizId), 
      userId: new ObjectId(userId) 
    }).toArray();
  },
  async deleteManyByUserId(userId: string) {
    const result = await collections.notes.deleteMany({ userId: new ObjectId(userId) });
    return result.deletedCount;
  }
};