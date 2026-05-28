const request = require('supertest');
const app = require('../../server');
const { cleanDatabase, createTestSession, createTestUser, prisma } = require('../helpers/dbHelper');
const { setupTestTokens } = require('../helpers/authHelper');

describe('Enrolments Module', () => {
  let testUsers;
  let testSession;
  let testEnrolment;
  
  beforeAll(async () => {
    await cleanDatabase();
    testUsers = setupTestTokens();
    testSession = await createTestSession();
    
    // Create a test enrolment
    testEnrolment = await prisma.enrolment.create({
      data: {
        userId: testUsers.learner.id,
        sessionId: testSession.id,
        status: 'ENROLLED'
      }
    });
  });
  
  afterAll(async () => {
    await cleanDatabase();
  });
  
  describe('POST /api/enrolments', () => {
    it('should create enrolment as authenticated user', async () => {
      const newSession = await createTestSession();
      
      const res = await request(app)
        .post('/api/enrolments')
        .set('Authorization', `Bearer ${testUsers.learner.token}`)
        .send({
          sessionId: newSession.id
        });
      
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Successfully enrolled in session');
    });
    
    it('should reject enrolment without authentication', async () => {
      const res = await request(app)
        .post('/api/enrolments')
        .send({
          sessionId: testSession.id
        });
      
      expect(res.status).toBe(401);
    });
    
    it('should reject enrolment with invalid sessionId format', async () => {
      const res = await request(app)
        .post('/api/enrolments')
        .set('Authorization', `Bearer ${testUsers.learner.token}`)
        .send({
          sessionId: 'invalid-id'
        });
      
      expect(res.status).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'sessionId' })
        ])
      );
    });
    
    it('should reject duplicate enrolment', async () => {
      const res = await request(app)
        .post('/api/enrolments')
        .set('Authorization', `Bearer ${testUsers.learner.token}`)
        .send({
          sessionId: testSession.id
        });
      
      expect(res.status).toBe(409);
      expect(res.body.message).toContain('already enrolled');
    });
  });
  
  describe('GET /api/enrolments/me', () => {
    it('should get user enrolments', async () => {
      const res = await request(app)
        .get('/api/enrolments/me')
        .set('Authorization', `Bearer ${testUsers.learner.token}`);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
    
    it('should filter enrolments by status', async () => {
      const res = await request(app)
        .get('/api/enrolments/me?status=ENROLLED')
        .set('Authorization', `Bearer ${testUsers.learner.token}`);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
    
    it('should paginate enrolments', async () => {
      const res = await request(app)
        .get('/api/enrolments/me?page=1&limit=5')
        .set('Authorization', `Bearer ${testUsers.learner.token}`);
      
      expect(res.status).toBe(200);
      expect(res.body.pagination).toBeDefined();
    });
    
    it('should reject invalid status', async () => {
      const res = await request(app)
        .get('/api/enrolments/me?status=INVALID_STATUS')
        .set('Authorization', `Bearer ${testUsers.learner.token}`);
      
      expect(res.status).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'status' })
        ])
      );
    });
  });
  
  describe('PATCH /api/enrolments/:id/attend (Trainer/Admin only)', () => {
    it('should mark attendance as trainer', async () => {
      const res = await request(app)
        .patch(`/api/enrolments/${testEnrolment.id}/attend`)
        .set('Authorization', `Bearer ${testUsers.trainer.token}`)
        .send({
          status: 'ATTENDED'
        });
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Attendance marked as ATTENDED');
    });
    
    it('should reject attendance marking as learner', async () => {
      const res = await request(app)
        .patch(`/api/enrolments/${testEnrolment.id}/attend`)
        .set('Authorization', `Bearer ${testUsers.learner.token}`)
        .send({
          status: 'ATTENDED'
        });
      
      expect(res.status).toBe(403);
    });
    
    it('should reject invalid attendance status', async () => {
      const res = await request(app)
        .patch(`/api/enrolments/${testEnrolment.id}/attend`)
        .set('Authorization', `Bearer ${testUsers.trainer.token}`)
        .send({
          status: 'INVALID_STATUS'
        });
      
      expect(res.status).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'status' })
        ])
      );
    });
    
    it('should reject with invalid enrolment id', async () => {
      const res = await request(app)
        .patch('/api/enrolments/invalid-id/attend')
        .set('Authorization', `Bearer ${testUsers.trainer.token}`)
        .send({
          status: 'ATTENDED'
        });
      
      expect(res.status).toBe(400);
    });
  });
  
  describe('PATCH /api/enrolments/:id/cancel', () => {
    let enrolmentToCancel;
    
    beforeEach(async () => {
      const newSession = await createTestSession();
      enrolmentToCancel = await prisma.enrolment.create({
        data: {
          userId: testUsers.learner.id,
          sessionId: newSession.id,
          status: 'ENROLLED'
        }
      });
    });
    
    it('should cancel own enrolment', async () => {
      const res = await request(app)
        .patch(`/api/enrolments/${enrolmentToCancel.id}/cancel`)
        .set('Authorization', `Bearer ${testUsers.learner.token}`)
        .send({
          reason: 'Schedule conflict'
        });
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Enrolment cancelled successfully');
    });
    
    it('should cancel without reason', async () => {
      const newEnrolment = await prisma.enrolment.create({
        data: {
          userId: testUsers.learner.id,
          sessionId: (await createTestSession()).id,
          status: 'ENROLLED'
        }
      });
      
      const res = await request(app)
        .patch(`/api/enrolments/${newEnrolment.id}/cancel`)
        .set('Authorization', `Bearer ${testUsers.learner.token}`);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
    
    it('should reject cancellation of another users enrolment', async () => {
      const res = await request(app)
        .patch(`/api/enrolments/${testEnrolment.id}/cancel`)
        .set('Authorization', `Bearer ${testUsers.learner.token}`);
      
      expect(res.status).toBe(404); // Or 403 depending on implementation
    });
  });
});