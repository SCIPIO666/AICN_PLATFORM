const request = require('supertest');
const app = require('../../app');
const { cleanDatabase, createTestSession, prisma } = require('../helpers/dbHelper');
const { setupTestTokens } = require('../helpers/authHelper');

describe('Sessions Module', () => {
  let testUsers;
  let testSession;
  
  beforeAll(async () => {
    await cleanDatabase();
    testUsers = setupTestTokens();
    testSession = await createTestSession();
  });
  
  afterAll(async () => {
    await cleanDatabase();
  });
  
  describe('GET /api/sessions', () => {
    it('should get all sessions without authentication', async () => {
      const res = await request(app)
        .get('/api/sessions');
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
    
    it('should filter sessions by skillArea', async () => {
      const res = await request(app)
        .get('/api/sessions?skillArea=Testing');
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
    
    it('should handle upcoming filter', async () => {
      const res = await request(app)
        .get('/api/sessions?upcoming=true');
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
    
    it('should paginate results', async () => {
      const res = await request(app)
        .get('/api/sessions?page=1&limit=5');
      
      expect(res.status).toBe(200);
      expect(res.body.pagination).toBeDefined();
      expect(res.body.pagination.page).toBe(1);
      expect(res.body.pagination.limit).toBe(5);
    });
    
    it('should reject invalid page number', async () => {
      const res = await request(app)
        .get('/api/sessions?page=-1');
      
      expect(res.status).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'page' })
        ])
      );
    });
    
    it('should reject limit exceeding maximum', async () => {
      const res = await request(app)
        .get('/api/sessions?limit=200');
      
      expect(res.status).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'limit' })
        ])
      );
    });
  });
  
  describe('GET /api/sessions/:id', () => {
    it('should get session by id', async () => {
      const res = await request(app)
        .get(`/api/sessions/${testSession.id}`);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(testSession.id);
    });
    
    it('should return 404 for non-existent session', async () => {
      const res = await request(app)
        .get('/api/sessions/non-existent-id');
      
      expect(res.status).toBe(404);
    });
    
    it('should reject invalid id format', async () => {
      const res = await request(app)
        .get('/api/sessions/invalid-id-format');
      
      expect(res.status).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'id' })
        ])
      );
    });
  });
  
  describe('POST /api/sessions (Admin only)', () => {
    it('should create session as admin', async () => {
      const res = await request(app)
        .post('/api/sessions')
        .set('Authorization', `Bearer ${testUsers.admin.token}`)
        .send({
          title: 'New Test Session',
          skillArea: 'Testing',
          date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          durationMins: 120,
          locationType: 'ONLINE',
          meetingLink: 'https://zoom.us/test',
          capacity: 50
        });
      
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('New Test Session');
    });
    
    it('should reject session creation without authentication', async () => {
      const res = await request(app)
        .post('/api/sessions')
        .send({
          title: 'Unauthorized Session',
          skillArea: 'Testing',
          date: new Date().toISOString()
        });
      
      expect(res.status).toBe(401);
    });
    
    it('should reject session creation as learner', async () => {
      const res = await request(app)
        .post('/api/sessions')
        .set('Authorization', `Bearer ${testUsers.learner.token}`)
        .send({
          title: 'Learner Session',
          skillArea: 'Testing',
          date: new Date().toISOString()
        });
      
      expect(res.status).toBe(403);
    });
    
    it('should reject session with past date', async () => {
      const res = await request(app)
        .post('/api/sessions')
        .set('Authorization', `Bearer ${testUsers.admin.token}`)
        .send({
          title: 'Past Session',
          skillArea: 'Testing',
          date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          durationMins: 120,
          locationType: 'PHYSICAL',
          venue: 'Test Venue'
        });
      
      expect(res.status).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ 
            field: 'date',
            message: 'Session date must be in the future'
          })
        ])
      );
    });
    
    it('should require venue for physical session', async () => {
      const res = await request(app)
        .post('/api/sessions')
        .set('Authorization', `Bearer ${testUsers.admin.token}`)
        .send({
          title: 'Physical Session No Venue',
          skillArea: 'Testing',
          date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          locationType: 'PHYSICAL'
        });
      
      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });
  });
  
  describe('PUT /api/sessions/:id (Admin only)', () => {
    it('should update session as admin', async () => {
      const res = await request(app)
        .put(`/api/sessions/${testSession.id}`)
        .set('Authorization', `Bearer ${testUsers.admin.token}`)
        .send({
          title: 'Updated Session Title',
          capacity: 40
        });
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Updated Session Title');
      expect(res.body.data.capacity).toBe(40);
    });
    
    it('should reject update with invalid id format', async () => {
      const res = await request(app)
        .put('/api/sessions/invalid-id')
        .set('Authorization', `Bearer ${testUsers.admin.token}`)
        .send({
          title: 'Updated Title'
        });
      
      expect(res.status).toBe(400);
    });
  });
  
  describe('DELETE /api/sessions/:id (Admin only)', () => {
    let sessionToDelete;
    
    beforeEach(async () => {
      sessionToDelete = await createTestSession();
    });
    
    it('should cancel session as admin', async () => {
      const res = await request(app)
        .delete(`/api/sessions/${sessionToDelete.id}`)
        .set('Authorization', `Bearer ${testUsers.admin.token}`);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Session cancelled successfully');
    });
    
    it('should reject cancellation without admin role', async () => {
      const res = await request(app)
        .delete(`/api/sessions/${sessionToDelete.id}`)
        .set('Authorization', `Bearer ${testUsers.learner.token}`);
      
      expect(res.status).toBe(403);
    });
  });
});