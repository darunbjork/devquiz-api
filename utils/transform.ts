import { ObjectId } from 'mongodb';
import type { QuizDoc, QuestionDoc, AttemptDoc, UserDoc } from '../types/db';
export const transformQuiz = (quiz: QuizDoc, questions: QuestionDoc[] = []) => {
  return {
    ...quiz,
    _id: undefined,
    createdBy: quiz.createdBy?.toString(),
    id: quiz._id?.toString(),
    questions: questions.map(q => {
      const options = q.options?.map((opt: { text: string; isCorrect: boolean }) => typeof opt === 'string' ? opt : opt.text) || [];
      const correctAnswerIndex = q.options?.findIndex((opt: { text: string; isCorrect: boolean }) => opt.isCorrect);
      
      return {
        ...q,
        _id: undefined,
        correctAnswerIndex: correctAnswerIndex !== -1 ? correctAnswerIndex : 0,
        id: q._id?.toString(),
        options,
        question: q.text, // Backup for frontend
        questionText: q.text,
        quizId: q.quizId?.toString()
      };
    })
  };
};

export const transformAttempt = (attempt: AttemptDoc) => {
  return {
    ...attempt,
    _id: undefined,
    answers: attempt.answers?.map((a: { questionId: ObjectId; selectedOption?: string; userAnswer?: boolean; isCorrect: boolean }) => ({
      ...a,
      questionId: a.questionId?.toString()
    })),
    id: attempt._id?.toString(),
    quizId: attempt.quizId?.toString(),
    userId: attempt.userId?.toString()
  };
};

export const transformUser = (user: UserDoc) => {
  if (!user) return null;
  return {
    ...user,
    _id: undefined,
    id: user._id?.toString(),
  };
};
