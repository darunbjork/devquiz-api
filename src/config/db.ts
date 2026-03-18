import { MongoClient, Db, type MongoClientOptions } from 'mongodb';
import logger from '../utils/logger.ts';
import { DatabaseError } from '../errors.ts';

const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';
const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
  if (isProduction) {
    logger.error('MONGODB_URL is required in production. Set it in your Docker environment.');
    process.exit(1);
  }
  logger.warn('MONGODB_URL not set — using localhost default for development.');
}

const url = MONGODB_URL || 'mongodb://localhost:27017/devquiz';

if (!url.startsWith('mongodb://') && !url.startsWith('mongodb+srv://')) {
  logger.error('Invalid MONGODB_URL format. Must start with mongodb:// or mongodb+srv://');
  process.exit(1);
}

const clientOptions: MongoClientOptions = {
  connectTimeoutMS: 5000,         
  serverSelectionTimeoutMS: 5000, 
};


const client = new MongoClient(url, clientOptions);
let db: Db;


export const connectMongo = async (): Promise<void> => {
  if (db) return; 

  try {
    await client.connect();
   
    await client.db('admin').command({ ping: 1 });
    const dbName = new URL(url.replace('mongodb://', 'http://')).pathname.slice(1) || 'devquiz';
    db = client.db(dbName);
    logger.info(`Connected to MongoDB ✅ [${NODE_ENV}]`);
  } catch (error) {
    logger.error('MongoDB connection failed on startup:', error);
    process.exit(1);
  }
};

export const getDb = (): Db => {
  if (!db) {
    throw new DatabaseError('Database not initialized. Call connectMongo first.');
  }
  return db;
};

export const closeMongo = async (): Promise<void> => {
  try {
    await client.close();
    logger.info('MongoDB connection closed.');
  } catch (error) {
    logger.error('Error closing MongoDB connection:', error);
  }
};

process.on('SIGTERM', async () => { await closeMongo(); process.exit(0); });
process.on('SIGINT',  async () => { await closeMongo(); process.exit(0); });

export const collections = {
  get attempts()  { return getDb().collection('attempts');  },
  get notes()     { return getDb().collection('notes');     },
  get questions() { return getDb().collection('questions'); },
  get quizzes()   { return getDb().collection('quizzes');   },
  get users()     { return getDb().collection('users');     },
};