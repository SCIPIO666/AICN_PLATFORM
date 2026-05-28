const request = require('supertest');
const app = require('../../app');
const { cleanDatabase, createTestSession, createTestUser, prisma } = require('../helpers/dbHelper');
const { setupTestTokens } = require('../helpers/authHelper');

describe('Certificates Module', () => {
  let testUsers;
  let testSession;
  let testCertificate;
  
  beforeAll(async () => {
    await cleanDatabase();
    testUsers = setupTestTokens();
    testSession = await createTestSession();
    
    // Create a test certificate
    testCertificate = await prisma.certificate.create({
      data: {
        userId: testUsers.learner.id,
        sessionId: testSession.id,
        certificateCode: `CERT-${Math.random().toString(36).substring(2, 18).toUpperCase()}`,
        issuedAt: new Date()
      }
    });
  });
  
  afterAll(async () => {
    await cleanDatabase();
  });
  
  describe('POST /api/certificates (Admin only)', () => {
    it('should issue certificate as admin', async () => {
      const newSession = await createTestSession();
      const newUser = await createTestUser();
      
      const res = await request(app)
        .post('/api/certificates')
        .set('Authorization', `Bearer ${testUsers.admin.token}`)
        .send({
          userId: newUser.id,
          sessionId: newSession.id
        });
      
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('certificateCode');
    });
    
    it('should reject certificate issuance as learner', async () => {
      const res = await request(app)
        .post('/api/certificates')
        .set('Authorization', `Bearer ${testUsers.learner.token}`)
        .send({
          userId: testUsers.learner.id,
          sessionId: testSession.id
        });
      
      expect(res.status).toBe(403);
    });
    
    it('should reject with invalid userId format', async () => {
      const res = await request(app)
        .post('/api/certificates')
        .set('Authorization', `Bearer ${testUsers.admin.token}`)
        .send({
          userId: 'invalid-id',
          sessionId: testSession.id
        });
      
      expect(res.status).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'userId' })
        ])
      );
    });
  });
  
  describe('GET /api/certificates/me', () => {
    it('should get user certificates', async () => {
      const res = await request(app)
        .get('/api/certificates/me')
        .set('Authorization', `Bearer ${testUsers.learner.token}`);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
    
    it('should reject without authentication', async () => {
      const res = await request(app)
        .get('/api/certificates/me');
      
      expect(res.status).toBe(401);
    });
  });
  
  describe('GET /api/certificates/verify/:certCode', () => {
    it('should verify valid certificate', async () => {
      const res = await request(app)
        .get(`/api/certificates/verify/${testCertificate.certificateCode}`);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('certificateCode');
    });
    
    it('should reject invalid certificate code format', async () => {
      const res = await request(app)
        .get('/api/certificates/verify/invalid-code');
      
      expect(res.status).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'certCode' })
        ])
      );
    });
    
    it('should return 404 for non-existent certificate', async () => {
      const res = await request(app)
        .get('/api/certificates/verify/CERT-1234567890ABCDEF');
      
      expect(res.status).toBe(404);
    });
  });
  
  describe('POST /api/certificates/batch/:sessionId (Admin only)', () => {
    it('should batch issue certificates for session', async () => {
      const newSession = await createTestSession();
      
      // Create some enrolments with ATTENDED status
      await prisma.enrolment.createMany({
        data: [
          { userId: testUsers.learner.id, sessionId: newSession.id, status: 'ATTENDED' },
          { userId: (await createTestUser()).id, sessionId: newSession.id, status: 'ATTENDED' }
        ]
      });
      
      const res = await request(app)
        .post(`/api/certificates/batch/${newSession.id}`)
        .set('Authorization', `Bearer ${testUsers.admin.token}`);
      
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('issued');
      expect(res.body.data).toHaveProperty('failed');
    });
    
    it('should reject batch issuance with invalid sessionId', async () => {
      const res = await request(app)
        .post('/api/certificates/batch/invalid-id')
        .set('Authorization', `Bearer ${testUsers.admin.token}`);
      
      expect(res.status).toBe(400);
    });
  });
  
  describe('GET /api/certificates/me/download/:id', () => {
    it('should download certificate PDF', async () => {
      const res = await request(app)
        .get(`/api/certificates/me/download/${testCertificate.id}`)
        .set('Authorization', `Bearer ${testUsers.learner.token}`);
      
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toBe('application/pdf');
    });
    
    it('should reject downloading another user\'s certificate', async () => {
      const otherUser = await createTestUser();
      const otherCert = await prisma.certificate.create({
        data: {
          userId: otherUser.id,
          sessionId: testSession.id,
          certificateCode: `CERT-${Math.random().toString(36).substring(2, 18).toUpperCase()}`,
          issuedAt: new Date()
        }
      });
      
      const res = await request(app)
        .get(`/api/certificates/me/download/${otherCert.id}`)
        .set('Authorization', `Bearer ${testUsers.learner.token}`);
      
      expect(res.status).toBe(403);
    });
  });
});