const { prisma, testConnection } = require('../config/prisma.js');
const logger=require('../utils/logger')
async function testPg(){
    try {
        await testConnection()
    } catch (error) {
        logger.error('db connection error',error.message)
    }
}

testPg()