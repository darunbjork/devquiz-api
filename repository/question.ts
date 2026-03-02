/* eslint-disable perfectionist/sort-objects */
import { collections } from '../db.ts';
import type { QuestionDoc } from '../types/db.ts';
import { ObjectId } from 'mongodb';

export const questionRepository = {
  async create(question: QuestionDoc) {
    const result = await collections.questions.insertOne(question);
    return { ...question, _id: result.insertedId };
  },
  async createMany(questions: QuestionDoc[]) {
    const result = await collections.questions.insertMany(questions);
    // Optionally, retrieve the inserted documents or just return the result
    return result.insertedIds;
  },
  async findByQuizId(quizId: string) {
    return await collections.questions.find<QuestionDoc>({ quizId: new ObjectId(quizId) }).toArray();
  },
  async deleteByQuizId(quizId: string) {
    return await collections.questions.deleteMany({ quizId: new ObjectId(quizId) });
  }
};
