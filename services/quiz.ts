// Step 10: Implement the quiz service that provides methods for retrieving quizzes. The getAllQuizzes method retrieves and returns all quizzes from the database, while the getQuizById method takes a quiz ID as a parameter, checks if the quiz exists, and returns it if found. If the quiz does not exist, a NotFoundError is thrown to inform the client that the requested quiz could not be found. This service allows users to access quiz information and details as needed.
import { quizRepository } from '../repository/quiz.ts';
import { NotFoundError } from '../errors.ts';

export const quizService = {
  async getAllQuizzes() {
    return await quizRepository.findAll();
  },

  async getQuizById(id: string) {
    const quiz = await quizRepository.findById(id);
    if (!quiz) throw new NotFoundError('Quiz');
    return quiz;
  }
};
