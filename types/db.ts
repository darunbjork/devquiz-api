import { ObjectId } from 'mongodb';

export interface UserDoc {
  _id?: ObjectId;
  username: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'user';
  createdAt: Date;
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
}
