// Step 6: This file is responsible for setting up the connection to the MongoDB database using the MongoClient from the 'mongodb' library. It defines functions to connect to the database and retrieve the database instance, as well as an object that provides access to specific collections (users, quizzes, questions, attempts, notes) in the database. The connection URL is read from an environment variable (MONGODB_URL), and if it is not set, a default URL is used. The file also includes error handling for connection issues and logs relevant messages using a logger.
import { MongoClient, Db } from 'mongodb';
import logger from './logger.ts';

const url = process.env.MONGODB_URL || 'mongodb://localhost:27017/devquiz'; // This read and use the MONGODB_URL environment variable, if not set it will default 
// to 'mongodb://localhost:27017/devquiz'
if (!process.env.MONGODB_URL) {
  logger.warn('MONGODB_URL environment variable not set, using default: mongodb://localhost:27017/devquiz');
}
const client = new MongoClient(url); // This creates a new MongoClient instance using the provided URL to connect to the MongoDB database
if (!url) {
  logger.error('MONGODB_URL environment variable is not set. Please set it to connect to MongoDB.');
  process.exit(1);
}

let db: Db;

export const connectMongo = async () => { // This function connects to the MongoDB database using the MongoClient instance. It logs a success message if the connection is successful, or an error message and exits the process if there is a connection error.
  try {
    await client.connect();
    db = client.db();
    logger.info('Connected to MongoDB ✅');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1); //What is process exit(1) ? It is a method that terminates the Node.js process with a non-zero exit code, indicating that an error occurred. In this case, it is used to stop the application if there is a problem connecting to the MongoDB database.
  }
};

export const getDb = () => { // This function returns the connected database instance. If the database is not initialized (i.e., if connectMongo has not been called), it throws an error.
  if (!db) {
    throw new Error('Database not initialized. Call connectMongo first.');
  }
  return db; // This returns the connected database instance, allowing other parts of the application to interact with the database collections.
};

export const collections = {
  get attempts() { return getDb().collection('attempts'); }, // This creates an attempts collection in the database
  get notes() { return getDb().collection('notes'); }, // This creates a notes collection in the database
  get questions() { return getDb().collection('questions'); }, // This creates a questions collection in the database
  get quizzes() { return getDb().collection('quizzes'); }, // This creates a quizzes collection in the database
  get users() { return getDb().collection('users'); }, // This creates a users collection in the database
};
