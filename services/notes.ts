// Step 10: Implement the note service that provides methods for retrieving notes based on user and quiz. The getNotes method takes a userId and quizId as parameters and uses the noteRepository to find and return all notes associated with the specified user and quiz. This service allows users to access their notes for specific quizzes, enabling them to review and manage their study materials effectively.
import { noteRepository } from '../repository/notes.ts';

export const noteService = {
  async getNotes(userId: string, quizId: string) {
    return await noteRepository.findByUserAndQuiz(userId, quizId);
  }
};
