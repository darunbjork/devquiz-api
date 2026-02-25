// Step 2: Define TypeScript interfaces for the MongoDB documents used in the application. These interfaces represent the structure of the data stored in the database, such as users, quizzes, and questions. Each interface includes fields that correspond to the properties of the respective documents, along with their types. The ObjectId type from MongoDB is used for fields that reference other documents or serve as unique identifiers.
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
