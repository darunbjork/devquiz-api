/* eslint-disable perfectionist/sort-objects */
import { quizRepository } from '../repository/quiz.ts';
import { questionRepository } from '../repository/question.ts'; 
import { NotFoundError, ForbiddenError } from '../errors.ts';
import { ObjectId } from 'mongodb'; // Import ObjectId
import type { QuizDoc, QuestionDoc } from '../types/db.ts';
import { transformQuiz } from '../utils/transform.ts';

export interface QuizQuestion {
  question?: string; 
  questionText: string;
  options: string[];
  correctAnswerIndex: number; 
}

export interface QuizData {
  title: string;
  description: string;
  questions: QuizQuestion[];
  topic: string;
  difficulty: string; 
}

export const quizService = {
  async getAllQuizzes() {
    const quizzes = await quizRepository.findAll();
    return await Promise.all(quizzes.map(async (q) => {
      const questions = await questionRepository.findByQuizId(q._id!.toString());
      return transformQuiz(q, questions);
    }));
  },

  async getMyQuizzes(userId: string) {
    const quizzes = await quizRepository.findByUserId(userId);
    return await Promise.all(quizzes.map(async (q) => {
      const questions = await questionRepository.findByQuizId(q._id!.toString());
      return transformQuiz(q, questions);
    }));
  },

  async getQuizById(id: string) {
    const quiz = await quizRepository.findById(id);
    if (!quiz) throw new NotFoundError('Quiz');

    const questions = await questionRepository.findByQuizId(id);
    return transformQuiz(quiz, questions);
  },

  async createQuiz(data: QuizData, userId: string) {
    const quizDoc: QuizDoc = {
      createdBy: new ObjectId(userId),
      description: data.description,
      difficulty: ((data.difficulty as string) || 'intermediate').toLowerCase() as 'beginner' | 'intermediate' | 'advanced',
      is_public: true,
      title: data.title,
      topic: data.topic || 'General',
    };

    const createdQuiz = await quizRepository.create(quizDoc);

    const questionDocs: QuestionDoc[] = data.questions.map((q) => {
      const correctOptionText = q.options[q.correctAnswerIndex];

      return {
        correctAnswer: correctOptionText,
        options: q.options.map((optionText, optionIndex) => ({
          isCorrect: optionIndex === q.correctAnswerIndex,
          text: optionText,
        })),
        points: 1,
        quizId: createdQuiz._id as ObjectId,
        text: q.questionText,
        type: 'multiple_choice',
      };
    });

    await questionRepository.createMany(questionDocs);
    return await this.getQuizById(createdQuiz._id!.toString());
  },

  async updateQuiz(id: string, data: Partial<QuizData>, userId: string) {
    const quiz = await quizRepository.findById(id);
    if (!quiz) throw new NotFoundError('Quiz');

    if (quiz.createdBy.toString() !== userId) {
      throw new ForbiddenError('You can only update your own quizzes');
    }

    const update: Partial<QuizDoc> = {};
    if (data.title) update.title = data.title;
    if (data.description) update.description = data.description;
    if (data.topic) update.topic = data.topic;
    if (data.difficulty) update.difficulty = (data.difficulty as string).toLowerCase() as 'beginner' | 'intermediate' | 'advanced';

    await quizRepository.update(id, update);

    if (data.questions) {
      // Replace questions
      await questionRepository.deleteByQuizId(id);
      const questionDocs: QuestionDoc[] = data.questions.map((q) => {
        const correctOptionText = q.options[q.correctAnswerIndex];

        return {
          correctAnswer: correctOptionText,
          options: q.options.map((optionText, optionIndex) => ({
            isCorrect: optionIndex === q.correctAnswerIndex,
            text: optionText,
          })),
          points: 1,
          quizId: new ObjectId(id),
          text: q.questionText,
          type: 'multiple_choice',
        };
      });
      await questionRepository.createMany(questionDocs);
    }

    return await this.getQuizById(id);
  },

  async deleteQuiz(id: string, userId: string) {
    const quiz = await quizRepository.findById(id);
    if (!quiz) throw new NotFoundError('Quiz');

    if (quiz.createdBy.toString() !== userId) {
      throw new ForbiddenError('You can only delete your own quizzes');
    }

    await questionRepository.deleteByQuizId(id);
    return await quizRepository.delete(id);
  },

  async createQuizWithQuestions(data: QuizData, userId: string) {
    return await this.createQuiz(data, userId);
  }
};
