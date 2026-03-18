/* eslint-disable perfectionist/sort-objects */
import { connectMongo, collections } from '../config/db.ts';
import { hashPassword } from '../utils/password.ts';

const seed = async () => {
  try {
    await connectMongo();

    await collections.users.deleteMany({});
    await collections.quizzes.deleteMany({});

    const adminPassword = await hashPassword('admin123');
    const adminResult = await collections.users.insertOne({
      username: 'admin',
      email: 'admin@devquiz.com',
      passwordHash: adminPassword,
      role: 'admin',
      createdAt: new Date()
    });

    await collections.quizzes.insertOne({
      title: 'JavaScript Fundamentals',
      description: 'Test your knowledge of JS basics, closures, and async.',
      topic: 'JavaScript',
      difficulty: 'beginner',
      is_public: true,
      createdBy: adminResult.insertedId
    });

    console.log('✅ DevQuiz database seeded!');
    console.log('   Admin: admin@devquiz.com / admin123');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seed();
