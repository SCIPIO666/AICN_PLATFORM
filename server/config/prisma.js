
const logger = require('../utils/logger');
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const dotenv=require('dotenv').config()


const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function connectDB() {
  try {
    await prisma.$connect();
    logger.info('Database connected');
    return true;
  } catch (error) {
    logger.error('Database connection failed:', error.message);
    throw error;
  }
}

module.exports = { prisma, connectDB };