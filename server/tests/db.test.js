const { prisma } = require('../config/db');

describe('Database Connection', () => {
  test('should connect to database', async () => {
    const result = await prisma.$queryRaw`SELECT 1`;

    expect(result).toBeTruthy();
  });
});