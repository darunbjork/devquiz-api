// scripts/createInitialAdmin.ts
import { MongoClient, ObjectId } from 'mongodb';
import { hashPassword } from '../utils/password.ts';
import * as dotenv from 'dotenv'; dotenv.config(); // Load environment variables from .env file

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/devquiz';
const DB_NAME = process.env.DB_NAME || 'devquiz';

async function createInitialAdmin() {
  const args = process.argv.slice(2);

  const getArg = (name: string): string | undefined => {
    const index = args.indexOf(`--${name}`);
    return index !== -1 && args[index + 1] ? args[index + 1] : undefined;
  };

  const username = getArg('username');
  const email = getArg('email');
  const password = getArg('password');

  if (!username || !email || !password) {
    console.error('Usage: bun run scripts/createInitialAdmin.ts --username <username> --email <email> --password <password>');
    process.exit(1);
  }

  let client: MongoClient | null = null;
  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    const usersCollection = db.collection('users');

    // Check if an admin user already exists with the given email
    const existingAdmin = await usersCollection.findOne({ email: email!, role: 'admin' });
    if (existingAdmin) {
      console.log(`Admin user with email ${email!} already exists.`);
      process.exit(0);
    }

    // Check if any admin user exists
    const anyAdminExists = await usersCollection.findOne({ role: 'admin' });
    if (anyAdminExists) {
      console.log('An admin user already exists in the database. Cannot create another initial admin.');
      console.log('If you need to create more admin users, please use the admin panel.');
      process.exit(0);
    }

    const hashedPassword = await hashPassword(password!);

    const newAdmin = {
      _id: new ObjectId(),
      createdAt: new Date(),
      email: email!,
      passwordHash: hashedPassword,
      role: 'admin',
      settings: {
        theme: 'light',
      },
      username: username!,
    };

    const result = await usersCollection.insertOne(newAdmin);
    if (result.acknowledged) {
      console.log(`Successfully created initial admin user: ${username!} (${email!}) with ID: ${result.insertedId}`);
    } else {
      console.error('Failed to create initial admin user.');
    }

  } catch (error) {
    console.error('Error creating initial admin user:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

createInitialAdmin();
