const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const cleanDatabase = async () => {
  const tables = ['blacklistedToken', 'certificate', 'enrolment', 'session', 'trainerProfile', 'announcement', 'user'];
  
  for (const table of tables) {
    try {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`);
    } catch (error) {
      // Table might not exist
    }
  }
};

const createTestUser = async (data = {}) => {
  const defaultUser = {
    id: `test-${Date.now()}`,
    name: 'Test User',
    email: `test-${Date.now()}@example.com`,
    password: '$2a$10$testhashedpassword',
    role: 'LEARNER',
    emailVerified: true,
    isActive: true
  };
  
  return await prisma.user.create({
    data: { ...defaultUser, ...data }
  });
};

const createTestSession = async (data = {}) => {
  const defaultSession = {
    id: `sess-${Date.now()}`,
    title: 'Test Session',
    skillArea: 'Testing',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    durationMins: 120,
    locationType: 'ONLINE',
    capacity: 30,
    status: 'SCHEDULED'
  };
  
  return await prisma.session.create({
    data: { ...defaultSession, ...data }
  });
};

module.exports = {
  cleanDatabase,
  createTestUser,
  createTestSession,
  prisma
};