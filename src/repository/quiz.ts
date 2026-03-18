
import { collections } from '../config/db.ts';
import type { QuizDoc, QuestionDoc } from '../types/db.ts';
import { ObjectId } from 'mongodb';

export const quizRepository = {
  async create(quiz: QuizDoc) {
    const result = await collections.quizzes.insertOne(quiz);
    return { ...quiz, _id: result.insertedId };
  },
  
  async delete(id: string) {
    return await collections.quizzes.deleteOne({ _id: new ObjectId(id) });
  },

  async deleteManyByUserId(userId: string) {
    const result = await collections.quizzes.deleteMany({ createdBy: new ObjectId(userId) });
    return result.deletedCount;
  },

  async findAll() {
    return await collections.quizzes.find<QuizDoc>({ is_public: true }).toArray();
  },

  async findById(id: string) {
    return await collections.quizzes.findOne<QuizDoc>({ _id: new ObjectId(id) });
  },

  async findByUserId(userId: string) {
    return await collections.quizzes.find<QuizDoc>({ createdBy: new ObjectId(userId) }).toArray();
  },

  async findQuestionsByQuizId(quizId: string) {
    return await collections.questions.find<QuestionDoc>({ quizId: new ObjectId(quizId) }).toArray();
  },

  async update(id: string, update: Partial<QuizDoc>) {
    await collections.quizzes.updateOne({ _id: new ObjectId(id) }, { $set: update });
    return await this.findById(id);
  }
};
