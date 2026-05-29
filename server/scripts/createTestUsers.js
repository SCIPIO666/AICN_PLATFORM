
const bcrypt = require('bcryptjs');
const {prisma }= require('../config/db');
const logger=require('../utils/logger')
async function createTestUsers() {
  const password = await bcrypt.hash('Test123!@#', 10);
  
  const users = [
    {
      name: 'Admin User',
      email: 'admin@aicn.africa',
      password,
      phone: '+254711111111',
      county: 'Nairobi',
      role: 'ADMIN'
    },
    {
      name: 'Trainer User',
      email: 'trainer@aicn.africa',
      password,
      phone: '+254722222222',
      county: 'Mombasa',
      role: 'TRAINER'
    },
    {
      name: 'Learner User',
      email: 'learner@aicn.africa',
      password,
      phone: '+254733333333',
      county: 'Kisumu',
      role: 'LEARNER'
    }
  ];
  
  for (const user of users) {
    const existing = await prisma.user.findUnique({
      where: { email: user.email }
    });
    
    if (!existing) {
      await prisma.user.create({ data: user });
      logger.info(` Created user: ${user.email} (${user.role})`);
    } else {
      logger.error(` User already exists: ${user.email}`);
    }
  }
  
  logger.info('\n Test User Credentials:');
  logger.info('Admin:   admin@aicn.africa / Test123!@#');
  logger.info('Trainer: trainer@aicn.africa / Test123!@#');
  logger.info('Learner: learner@aicn.africa / Test123!@#');
}

createTestUsers()
  .catch(console.error)
  .finally(() => prisma.$disconnect());