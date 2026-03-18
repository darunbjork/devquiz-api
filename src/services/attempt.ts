/* eslint-disable perfectionist/sort-objects */
import { attemptRepository } from '../repository/attempt.ts';
import { quizRepository } from '../repository/quiz.ts';
import { questionRepository } from '../repository/question.ts';
import { NotFoundError, ForbiddenError, BadRequestError } from '../errors.ts';
import { ObjectId } from 'mongodb';
import type { AttemptDoc } from '../types/db.ts';
import { transformAttempt } from '../utils/transform.ts';

export interface CompletedAttemptData {
  attemptId?: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  answers: Array<{
    questionId: string;
    selectedOption?: string;
    userAnswer?: boolean;
    isCorrect: boolean;
  }>;
}

const toObjectId = (id: string | undefined) => {
  if (!id || !ObjectId.isValid(id)) return undefined;
  return new ObjectId(id);
};

export const attemptService = {
  async startAttempt(userId: string, quizId: string) {
    const qId = toObjectId(quizId);
    if (!qId) throw new BadRequestError('Invalid Quiz ID'); 

    const quiz = await quizRepository.findById(quizId);
    if (!quiz) throw new NotFoundError('Quiz');

    const questions = await questionRepository.findByQuizId(quizId);

    const attempt = await attemptRepository.create({
      quizId: qId,
      startTime: new Date(),
      status: 'in_progress',
      totalQuestions: questions.length,
      userId: new ObjectId(userId),
    });

    return transformAttempt(attempt);
  },

  async getMyAttempts(userId: string) {
    const attempts = await attemptRepository.findByUserId(userId);
    return attempts.map(a => transformAttempt(a));
  },

  async saveAttempt(userId: string, data: CompletedAttemptData) {
    try {
      const qId = toObjectId(data.quizId);
      if (!qId) throw new BadRequestError(`Invalid Quiz ID: ${data.quizId}`); 

      const attemptData: Partial<AttemptDoc> = {
        answers: data.answers.map(a => ({
          isCorrect: a.isCorrect,
          questionId: toObjectId(a.questionId) || new ObjectId(),
          selectedOption: a.selectedOption,
          userAnswer: a.userAnswer,
        })),
        endTime: new Date(),
        score: data.score,
        status: 'completed',
        totalQuestions: data.totalQuestions,
      };

      let result;
      if (data.attemptId && ObjectId.isValid(data.attemptId)) {
        const existing = await attemptRepository.findById(data.attemptId);
        if (existing && existing.userId.toString() === userId) {
          result = await attemptRepository.update(data.attemptId, attemptData);
        }
      }

      if (!result) {
        result = await attemptRepository.create({
          ...attemptData,
          quizId: qId,
          startTime: new Date(),
          userId: new ObjectId(userId),
        } as AttemptDoc);
      }

      return transformAttempt(result);
    } catch (error) {
      console.error('Error saving attempt:', error);
      throw error;
    }
  },

  async deleteAttempt(id: string, userId: string) {
    const attempt = await attemptRepository.findById(id);
    if (!attempt) throw new NotFoundError('Attempt');

    if (attempt.userId.toString() !== userId) {
      throw new ForbiddenError('You can only delete your own attempts');
    }

    return await attemptRepository.delete(id);
  },
};