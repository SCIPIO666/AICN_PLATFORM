const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');
const logger = require('../src/utils/logger');

dotenv.config();

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

async function connectDB() {
  try {
    await prisma.$connect();
    logger.info('Database connected');
    return true;
  } catch (error) {
    logger.error('❌Database connection failed:', error.message);
    throw error;
  }
}
connectDB()
module.exports = { prisma, connectDB };