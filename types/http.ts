// Step 3: Define TypeScript interfaces for the request bodies of various API endpoints. These interfaces specify the expected structure of the data sent by clients when making requests to the server, such as registering a new user, logging in, or creating a quiz. Each interface includes fields that correspond to the properties required for the respective operations, along with their types. This helps ensure type safety and consistency when handling incoming data in the application.

export interface RegisterBody { // What is interface,in a concise sentence? An interface in TypeScript is a way to define the structure of an object, specifying the properties and their types that an object must have. It is used for type-checking and ensuring that objects conform to a specific shape.
  username: string;
  email: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface QuizCreateBody {
  title: string;
  description: string;
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  is_public: boolean;
}
