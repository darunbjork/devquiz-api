// Step 10: Implement the attempt service that provides methods for starting a quiz attempt. The startAttempt method checks if the specified quiz exists, and if it does, it creates a new attempt record in the database with the userId, quizId, startTime, and status set to 'in_progress'. If the quiz does not exist, a NotFoundError is thrown to inform the client that the requested quiz could not be found. This service allows users to initiate attempts for quizzes and track their progress.
import { attemptRepository } from '../repository/attempt.ts';
import { quizRepository } from '../repository/quiz.ts';
import { NotFoundError } from '../errors.ts';
import { ObjectId } from 'mongodb';

export const attemptService = {
  async startAttempt(userId: string, quizId: string) {
    const quiz = await quizRepository.findById(quizId);
    if (!quiz) throw new NotFoundError('Quiz');

    return await attemptRepository.create({
      userId: new ObjectId(userId),
      quizId: new ObjectId(quizId),
      startTime: new Date(),
      status: 'in_progress'
    });
  }
};
