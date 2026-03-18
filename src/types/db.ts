import { ObjectId } from 'mongodb';

export interface UserDoc {
  _id?: ObjectId;
  username: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'user';
  createdAt: Date;
  settings: {
    theme: 'light' | 'dark';
  };
  refreshTokenHash?: string; 
}

export interface QuizDoc {
  _id?: ObjectId;
  title: string;
  description: string;
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  is_public: boolean;
  createdBy: ObjectId;
}

export interface QuestionDoc {
  _id?: ObjectId;
  quizId: ObjectId;
  text: string;
  type: 'multiple_choice' | 'boolean';
  points: number;
  options?: Array<{ text: string; isCorrect: boolean }>; 
  correctAnswer?: string; 
}

export interface AttemptDoc {
  _id?: ObjectId;
  quizId: ObjectId;
  userId: ObjectId;
  score?: number;
  totalQuestions?: number;
  startTime: Date;
  endTime?: Date;
  status: 'in_progress' | 'completed';
  answers?: Array<{
    questionId: ObjectId;
    selectedOption?: string; 
    userAnswer?: boolean; 
    isCorrect: boolean;
  }>;
}

export interface NoteDoc {
  _id?: ObjectId;
  quizId: ObjectId;
  userId: ObjectId;
  content: string;
  createdAt: Date;
}

