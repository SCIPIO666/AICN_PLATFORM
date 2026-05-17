const { prisma, testConnection } = require('../config/prisma.js');
const logger=require('../src/utils/logger.js')
async function testPg(){
    try {
        await testConnection()
    } catch (error) {
        logger.error('db connection error',error.message)
    }
}

testPg()