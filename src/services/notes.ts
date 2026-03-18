import { noteRepository } from '../repository/notes.ts';

export const noteService = {
  async getNotes(userId: string, quizId: string) {
    return await noteRepository.findByUserAndQuiz(userId, quizId);
  }
};
