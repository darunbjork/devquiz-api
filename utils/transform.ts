export const transformQuiz = (quiz: any, questions: any[] = []) => {
  return {
    ...quiz,
    id: quiz._id?.toString(),
    _id: undefined,
    createdBy: quiz.createdBy?.toString(),
    questions: questions.map(q => {
      const options = q.options?.map((opt: any) => typeof opt === 'string' ? opt : opt.text) || [];
      const correctAnswerIndex = q.options?.findIndex((opt: any) => opt.isCorrect);
      
      return {
        ...q,
        id: q._id?.toString(),
        _id: undefined,
        quizId: q.quizId?.toString(),
        questionText: q.text,
        question: q.text, // Backup for frontend
        options,
        correctAnswerIndex: correctAnswerIndex !== -1 ? correctAnswerIndex : 0
      };
    })
  };
};

export const transformAttempt = (attempt: any) => {
  return {
    ...attempt,
    id: attempt._id?.toString(),
    _id: undefined,
    quizId: attempt.quizId?.toString(),
    userId: attempt.userId?.toString(),
    answers: attempt.answers?.map((a: any) => ({
      ...a,
      questionId: a.questionId?.toString()
    }))
  };
};

export const transformUser = (user: any) => {
  if (!user) return null;
  return {
    ...user,
    id: user._id?.toString(),
    _id: undefined,
  };
};
