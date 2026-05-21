const request = require('supertest');
const app = require('../app');
const prisma = require('../config/db');
const bcrypt = require('bcryptjs');
const { generateTestToken, mockUser } = require('../utils/testHelpers');

describe('Authentication Endpoints (Redesigned)', () => {
  describe('POST /api/auth/register (was /signup)', () => {
    it('should register a new user successfully', async () => {
      const newUser = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'Password123!',
        phone: '+254712345678',
        county: 'Nairobi'
      };

      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({
        id: 'new-user-id',
        ...newUser,
        password: await bcrypt.hash(newUser.password, 10),
        role: 'LEARNER',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const response = await request(app)
        .post('/api/auth/register')  // Changed from /signup
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.user.email).toBe(newUser.email);
    });

    it('should return 409 if email already exists', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/auth/register')
        .send({ email: 'existing@example.com', name: 'Test', password: 'Password123!' });

      expect(response.status).toBe(409);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'Password123!'
      };

      prisma.user.findUnique.mockResolvedValue({
        ...mockUser,
        password: await bcrypt.hash('Password123!', 10),
        deletedAt: null
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('id');
    });

    it('should reject login for deleted account', async () => {
      prisma.user.findUnique.mockResolvedValue({
        ...mockUser,
        deletedAt: new Date()
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'Password123!' });

      expect(response.status).toBe(401);
      expect(response.body.message).toContain('deactivated');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout successfully', async () => {
      const token = generateTestToken();
      
      prisma.blacklistedToken.create.mockResolvedValue({});
      prisma.blacklistedToken.deleteMany.mockResolvedValue({ count: 0 });

      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});