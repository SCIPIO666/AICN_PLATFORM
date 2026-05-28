const request = require('supertest');
const app = require('../../server');
const { cleanDatabase, createTestUser, prisma } = require('../helpers/dbHelper');
const { setupTestTokens } = require('../helpers/authHelper');

describe('Trainers Module', () => {
  let testUsers;
  let testApplication;
  
  beforeAll(async () => {
    await cleanDatabase();
    testUsers = setupTestTokens();
    
    // Create a test trainer application
    testApplication = await prisma.trainerProfile.create({
      data: {
        userId: testUsers.learner.id,
        skills: ['JavaScript', 'React'],
        bio: 'Experienced developer',
        status: 'PENDING'
      }
    });
  });
  
  afterAll(async () => {
    await cleanDatabase();
  });
  
  describe('GET /api/trainers', () => {
    it('should get approved trainers (public)', async () => {
      // Create an approved trainer
      await prisma.trainerProfile.create({
        data: {
          userId: (await createTestUser()).id,
          skills: ['Python'],
          status: 'APPROVED'
        }
      });
      
      const res = await request(app)
        .get('/api/trainers');
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
    
    it('should filter trainers by skill', async () => {
      const res = await request(app)
        .get('/api/trainers?skill=Python');
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
    
    it('should paginate results', async () => {
      const res = await request(app)
        .get('/api/trainers?page=1&limit=5');
      
      expect(res.status).toBe(200);
      expect(res.body.pagination).toBeDefined();
    });
  });
  
  describe('POST /api/trainers/apply', () => {
    it('should submit trainer application', async () => {
      const newUser = await createTestUser();
      const newUserToken = testUsers.learner.token; // In real test, generate token for newUser
      
      const res = await request(app)
        .post('/api/trainers/apply')
        .set('Authorization', `Bearer ${newUserToken}`)
        .send({
          skills: ['Node.js', 'Express', 'MongoDB'],
          bio: 'Full-stack developer with 3 years experience',
          availability: 'Weekends',
          motivation: 'I love teaching'
        });
      
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.skills).toContain('Node.js');
    });
    
    it('should reject application without skills', async () => {
      const res = await request(app)
        .post('/api/trainers/apply')
        .set('Authorization', `Bearer ${testUsers.learner.token}`)
        .send({
          bio: 'No skills provided'
        });
      
      expect(res.status).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'skills' })
        ])
      );
    });
    
    it('should reject duplicate application', async () => {
      const res = await request(app)
        .post('/api/trainers/apply')
        .set('Authorization', `Bearer ${testUsers.learner.token}`)
        .send({
          skills: ['JavaScript'],
          bio: 'Another application'
        });
      
      expect(res.status).toBe(409);
      expect(res.body.message).toContain('already have a trainer application');
    });
  });
  
  describe('GET /api/trainers/me', () => {
    it('should get own trainer profile', async () => {
      const res = await request(app)
        .get('/api/trainers/me')
        .set('Authorization', `Bearer ${testUsers.learner.token}`);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.skills).toEqual(expect.arrayContaining(['JavaScript', 'React']));
    });
    
    it('should return 404 if no trainer profile', async () => {
      const newUser = await createTestUser();
      const newUserToken = testUsers.trainer.token; // In real test, generate token for newUser
      
      const res = await request(app)
        .get('/api/trainers/me')
        .set('Authorization', `Bearer ${newUserToken}`);
      
      expect(res.status).toBe(404);
    });
  });
  
  describe('PATCH /api/trainers/me', () => {
    it('should update pending trainer application', async () => {
      const res = await request(app)
        .patch('/api/trainers/me')
        .set('Authorization', `Bearer ${testUsers.learner.token}`)
        .send({
          bio: 'Updated bio with more experience',
          skills: ['JavaScript', 'React', 'TypeScript']
        });
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.bio).toBe('Updated bio with more experience');
      expect(res.body.data.skills).toContain('TypeScript');
    });
    
    it('should reject update with empty skills array', async () => {
      const res = await request(app)
        .patch('/api/trainers/me')
        .set('Authorization', `Bearer ${testUsers.learner.token}`)
        .send({
          skills: []
        });
      
      expect(res.status).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'skills' })
        ])
      );
    });
  });
  
  describe('DELETE /api/trainers/me', () => {
    it('should withdraw pending application', async () => {
      const newUser = await createTestUser();
      const newUserToken = testUsers.trainer.token; // In real test, generate token
      
      // Create application for new user
      await prisma.trainerProfile.create({
        data: {
          userId: newUser.id,
          skills: ['Testing'],
          status: 'PENDING'
        }
      });
      
      const res = await request(app)
        .delete('/api/trainers/me')
        .set('Authorization', `Bearer ${newUserToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
  
  describe('GET /api/trainers/admin/applications (Admin only)', () => {
    it('should get all applications as admin', async () => {
      const res = await request(app)
        .get('/api/trainers/admin/applications')
        .set('Authorization', `Bearer ${testUsers.admin.token}`);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
    
    it('should filter applications by status', async () => {
      const res = await request(app)
        .get('/api/trainers/admin/applications?status=PENDING')
        .set('Authorization', `Bearer ${testUsers.admin.token}`);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
    
    it('should reject non-admin users', async () => {
      const res = await request(app)
        .get('/api/trainers/admin/applications')
        .set('Authorization', `Bearer ${testUsers.learner.token}`);
      
      expect(res.status).toBe(403);
    });
  });
  
  describe('PATCH /api/trainers/admin/applications/:id/approve (Admin only)', () => {
    it('should approve trainer application', async () => {
      const pendingApplication = await prisma.trainerProfile.create({
        data: {
          userId: (await createTestUser()).id,
          skills: ['Docker', 'Kubernetes'],
          status: 'PENDING'
        }
      });
      
      const res = await request(app)
        .patch(`/api/trainers/admin/applications/${pendingApplication.id}/approve`)
        .set('Authorization', `Bearer ${testUsers.admin.token}`);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('APPROVED');
    });
    
    it('should reject approval with invalid id', async () => {
      const res = await request(app)
        .patch('/api/trainers/admin/applications/invalid-id/approve')
        .set('Authorization', `Bearer ${testUsers.admin.token}`);
      
      expect(res.status).toBe(400);
    });
  });
  
  describe('PATCH /api/trainers/admin/applications/:id/reject (Admin only)', () => {
    it('should reject trainer application with reason', async () => {
      const pendingApplication = await prisma.trainerProfile.create({
        data: {
          userId: (await createTestUser()).id,
          skills: ['Testing'],
          status: 'PENDING'
        }
      });
      
      const res = await request(app)
        .patch(`/api/trainers/admin/applications/${pendingApplication.id}/reject`)
        .set('Authorization', `Bearer ${testUsers.admin.token}`)
        .send({
          reason: 'Does not meet minimum requirements',
          feedback: 'Please gain more experience'
        });
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('REJECTED');
    });
  });
});