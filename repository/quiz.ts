// Step 9: Export the authentication plugin using 'fastify-plugin' to ensure it can be registered in the Fastify application. This allows the authentication logic to be modular and reusable across different parts of the application, enabling secure access control for protected routes.
import { collections } from '../db.ts';
import type { QuizDoc, QuestionDoc } from '../types/db.ts';
import { ObjectId } from 'mongodb';

export const quizRepository = {
  async create(quiz: QuizDoc) {
    const result = await collections.quizzes.insertOne(quiz);
    return { ...quiz, _id: result.insertedId };
  },
  async findAll() {
    return await collections.quizzes.find<QuizDoc>({ is_public: true }).toArray();
  },
  async findById(id: string) {
    return await collections.quizzes.findOne<QuizDoc>({ _id: new ObjectId(id) });
  },
  async findQuestionsByQuizId(quizId: string) {
    return await collections.questions.find<QuestionDoc>({ quizId: new ObjectId(quizId) }).toArray();
  },
  async findByUserId(userId: string) {
    return await collections.quizzes.find<QuizDoc>({ createdBy: new ObjectId(userId) }).toArray();
  },
  async update(id: string, update: Partial<QuizDoc>) {
    await collections.quizzes.updateOne({ _id: new ObjectId(id) }, { $set: update });
    return await this.findById(id);
  },
  async delete(id: string) {
    return await collections.quizzes.deleteOne({ _id: new ObjectId(id) });
  }
};
