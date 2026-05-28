const request = require('supertest');
const app = require('../../server');
const { cleanDatabase, createTestUser, createTestSession, prisma } = require('../helpers/dbHelper');
const { setupTestTokens } = require('../helpers/authHelper');

describe('Admin Module', () => {
  let testUsers;
  let testAnnouncement;
  
  beforeAll(async () => {
    await cleanDatabase();
    testUsers = setupTestTokens();
    
    // Create test announcement
    testAnnouncement = await prisma.announcement.create({
      data: {
        title: 'Test Announcement',
        body: 'This is a test announcement',
        audience: 'all',
        createdBy: testUsers.admin.id
      }
    });
  });
  
  afterAll(async () => {
    await cleanDatabase();
  });
  
  describe('GET /api/admin/stats', () => {
    it('should get dashboard stats as admin', async () => {
      const res = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${testUsers.admin.token}`);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('totalUsers');
      expect(res.body.data).toHaveProperty('totalSessions');
      expect(res.body.data).toHaveProperty('totalCertificates');
    });
    
    it('should reject non-admin users', async () => {
      const res = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${testUsers.learner.token}`);
      
      expect(res.status).toBe(403);
    });
  });
  
  describe('GET /api/admin/users', () => {
    it('should get all users as admin', async () => {
      const res = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${testUsers.admin.token}`);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.pagination).toBeDefined();
    });
    
    it('should filter users by role', async () => {
      const res = await request(app)
        .get('/api/admin/users?role=ADMIN')
        .set('Authorization', `Bearer ${testUsers.admin.token}`);
      
      expect(res.status).toBe(200);
      expect(res.body.data.every(user => user.role === 'ADMIN')).toBe(true);
    });
    
    it('should search users by name or email', async () => {
      const res = await request(app)
        .get('/api/admin/users?search=admin')
        .set('Authorization', `Bearer ${testUsers.admin.token}`);
      
      expect(res.status).toBe(200);
    });
    
    it('should paginate users', async () => {
      const res = await request(app)
        .get('/api/admin/users?page=1&limit=5')
        .set('Authorization', `Bearer ${testUsers.admin.token}`);
      
      expect(res.status).toBe(200);
      expect(res.body.pagination.page).toBe(1);
      expect(res.body.pagination.limit).toBe(5);
    });
    
    it('should reject invalid role filter', async () => {
      const res = await request(app)
        .get('/api/admin/users?role=INVALID_ROLE')
        .set('Authorization', `Bearer ${testUsers.admin.token}`);
      
      expect(res.status).toBe(400);
    });
  });
  
  describe('PATCH /api/admin/users/:userId/role', () => {
    let testUser;
    
    beforeEach(async () => {
      testUser = await createTestUser();
    });
    
    it('should update user role as admin', async () => {
      const res = await request(app)
        .patch(`/api/admin/users/${testUser.id}/role`)
        .set('Authorization', `Bearer ${testUsers.admin.token}`)
        .send({
          newRole: 'TRAINER'
        });
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.role).toBe('TRAINER');
    });
    
    it('should reject invalid role', async () => {
      const res = await request(app)
        .patch(`/api/admin/users/${testUser.id}/role`)
        .set('Authorization', `Bearer ${testUsers.admin.token}`)
        .send({
          newRole: 'INVALID_ROLE'
        });
      
      expect(res.status).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'newRole' })
        ])
      );
    });
    
    it('should reject non-admin users', async () => {
      const res = await request(app)
        .patch(`/api/admin/users/${testUser.id}/role`)
        .set('Authorization', `Bearer ${testUsers.learner.token}`)
        .send({
          newRole: 'TRAINER'
        });
      
      expect(res.status).toBe(403);
    });
    
    it('should reject invalid userId format', async () => {
      const res = await request(app)
        .patch('/api/admin/users/invalid-id/role')
        .set('Authorization', `Bearer ${testUsers.admin.token}`)
        .send({
          newRole: 'TRAINER'
        });
      
      expect(res.status).toBe(400);
    });
  });
  
  describe('GET /api/admin/announcements', () => {
    it('should get all announcements as admin', async () => {
      const res = await request(app)
        .get('/api/admin/announcements')
        .set('Authorization', `Bearer ${testUsers.admin.token}`);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
    
    it('should filter announcements by audience', async () => {
      const res = await request(app)
        .get('/api/admin/announcements?audience=all')
        .set('Authorization', `Bearer ${testUsers.admin.token}`);
      
      expect(res.status).toBe(200);
    });
    
    it('should reject invalid audience filter', async () => {
      const res = await request(app)
        .get('/api/admin/announcements?audience=invalid')
        .set('Authorization', `Bearer ${testUsers.admin.token}`);
      
      expect(res.status).toBe(400);
    });
  });
  
  describe('POST /api/admin/announcements', () => {
    it('should create announcement as admin', async () => {
      const res = await request(app)
        .post('/api/admin/announcements')
        .set('Authorization', `Bearer ${testUsers.admin.token}`)
        .send({
          title: 'New System Update',
          body: 'We are updating the system on Friday at 10 PM',
          audience: 'learners'
        });
      
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('New System Update');
      expect(res.body.data.audience).toBe('learners');
    });
    
    it('should reject announcement with short title', async () => {
      const res = await request(app)
        .post('/api/admin/announcements')
        .set('Authorization', `Bearer ${testUsers.admin.token}`)
        .send({
          title: 'Hi',
          body: 'This is a test announcement body that is long enough'
        });
      
      expect(res.status).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'title' })
        ])
      );
    });
    
    it('should reject announcement with short body', async () => {
      const res = await request(app)
        .post('/api/admin/announcements')
        .set('Authorization', `Bearer ${testUsers.admin.token}`)
        .send({
          title: 'Valid Title',
          body: 'Too short'
        });
      
      expect(res.status).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'body' })
        ])
      );
    });
  });
  
  describe('PUT /api/admin/announcements/:id', () => {
    it('should update announcement as admin', async () => {
      const res = await request(app)
        .put(`/api/admin/announcements/${testAnnouncement.id}`)
        .set('Authorization', `Bearer ${testUsers.admin.token}`)
        .send({
          title: 'Updated Announcement Title',
          body: 'Updated body content'
        });
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Updated Announcement Title');
    });
    
    it('should reject update with invalid id', async () => {
      const res = await request(app)
        .put('/api/admin/announcements/invalid-id')
        .set('Authorization', `Bearer ${testUsers.admin.token}`)
        .send({
          title: 'Updated Title'
        });
      
      expect(res.status).toBe(400);
    });
  });
  
  describe('DELETE /api/admin/announcements/:id', () => {
    let announcementToDelete;
    
    beforeEach(async () => {
      announcementToDelete = await prisma.announcement.create({
        data: {
          title: 'To Delete',
          body: 'This announcement will be deleted',
          audience: 'all',
          createdBy: testUsers.admin.id
        }
      });
    });
    
    it('should delete announcement as admin', async () => {
      const res = await request(app)
        .delete(`/api/admin/announcements/${announcementToDelete.id}`)
        .set('Authorization', `Bearer ${testUsers.admin.token}`);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
    
    it('should reject deletion with invalid id', async () => {
      const res = await request(app)
        .delete('/api/admin/announcements/invalid-id')
        .set('Authorization', `Bearer ${testUsers.admin.token}`);
      
      expect(res.status).toBe(400);
    });
  });
});