const request = require('supertest');
const app = require('../../app');
const { cleanDatabase, createTestUser } = require('../helpers/dbHelper');
const { setupTestTokens } = require('../helpers/authHelper');

describe('Authentication Module', () => {
  let testUsers;
  
  beforeAll(async () => {
    await cleanDatabase();
    testUsers = setupTestTokens();
  });
  
  afterAll(async () => {
    await cleanDatabase();
  });
  
  describe('POST /api/auth/signup', () => {
    it('should register a new user with valid data', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'Test@123456',
          phone: '+254712345678',
          county: 'Nairobi'
        });
      
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user).toHaveProperty('id');
      expect(res.body.data.user.email).toBe('john@example.com');
      expect(res.body.data.user.role).toBe('LEARNER');
    });
    
    it('should reject registration with invalid email format', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'John Doe',
          email: 'invalid-email',
          password: 'Test@123456'
        });
      
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'email' })
        ])
      );
    });
    
    it('should reject registration with weak password', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'John Doe',
          email: 'john2@example.com',
          password: 'weak'
        });
      
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'password' })
        ])
      );
    });
    
    it('should reject registration with short name', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'J',
          email: 'john3@example.com',
          password: 'Test@123456'
        });
      
      expect(res.status).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ 
            field: 'name',
            message: 'Name must be at least 2 characters'
          })
        ])
      );
    });
    
    it('should reject duplicate email registration', async () => {
      // First registration
      await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Jane Doe',
          email: 'jane@example.com',
          password: 'Test@123456'
        });
      
      // Duplicate registration
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Jane Doe',
          email: 'jane@example.com',
          password: 'Test@123456'
        });
      
      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('already exists');
    });
  });
  
  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await createTestUser({
        email: 'login@test.com',
        password: '$2a$10$testhashedpassword', // In real test, use bcrypt
        name: 'Login Test'
      });
    });
    
    it('should login successfully with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@test.com',
          password: 'Test@123456'
        });
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user).toHaveProperty('email', 'login@test.com');
    });
    
    it('should reject login with invalid email format', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid-email',
          password: 'Test@123456'
        });
      
      expect(res.status).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'email' })
        ])
      );
    });
    
    it('should reject login with missing password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@test.com'
        });
      
      expect(res.status).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'password' })
        ])
      );
    });
    
    it('should reject login with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@test.com',
          password: 'WrongPassword123!'
        });
      
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
  
  describe('GET /api/auth/me', () => {
    it('should get current user profile with valid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${testUsers.learner.token}`);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user).toHaveProperty('id');
    });
    
    it('should reject without token', async () => {
      const res = await request(app)
        .get('/api/auth/me');
      
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
    
    it('should reject with invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');
      
      expect(res.status).toBe(401);
    });
  });
  
  describe('POST /api/auth/change-password', () => {
    it('should change password successfully', async () => {
      const res = await request(app)
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${testUsers.learner.token}`)
        .send({
          currentPassword: 'OldPassword123!',
          newPassword: 'NewPassword456!',
          confirmPassword: 'NewPassword456!'
        });
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Password changed successfully');
    });
    
    it('should reject when passwords do not match', async () => {
      const res = await request(app)
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${testUsers.learner.token}`)
        .send({
          currentPassword: 'OldPassword123!',
          newPassword: 'NewPassword456!',
          confirmPassword: 'DifferentPassword789!'
        });
      
      expect(res.status).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ 
            field: 'confirmPassword',
            message: "New passwords don't match"
          })
        ])
      );
    });
    
    it('should reject weak new password', async () => {
      const res = await request(app)
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${testUsers.learner.token}`)
        .send({
          currentPassword: 'OldPassword123!',
          newPassword: 'weak',
          confirmPassword: 'weak'
        });
      
      expect(res.status).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'newPassword' })
        ])
      );
    });
  });
  
  describe('POST /api/auth/forgot-password', () => {
    it('should send password reset email for existing user', async () => {
      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({
          email: 'login@test.com'
        });
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
    
    it('should return success even for non-existent email (security)', async () => {
      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({
          email: 'nonexistent@test.com'
        });
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
    
    it('should reject invalid email format', async () => {
      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({
          email: 'invalid-email'
        });
      
      expect(res.status).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'email' })
        ])
      );
    });
  });
});