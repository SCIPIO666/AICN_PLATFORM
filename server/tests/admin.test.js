const request = require('supertest');
const app = require('../app');
const prisma = require('../config/db');
const { generateTestToken, mockUser, mockAnnouncement } = require('../utils/testHelpers');

describe('Admin Endpoints (New Module)', () => {
  let adminToken;
  let learnerToken;

  beforeAll(() => {
    adminToken = generateTestToken('admin-123', 'ADMIN');
    learnerToken = generateTestToken('learner-123', 'LEARNER');
  });

  describe('GET /api/admin/stats - Dashboard stats', () => {
    it('should return stats for ADMIN', async () => {
      const mockStats = {
        learners: 150,
        trainers: 25,
        sessions: 45,
        certificates: 120,
        pendingTrainerApplications: 8
      };

      prisma.user.count
        .mockResolvedValueOnce(mockStats.learners)
        .mockResolvedValueOnce(mockStats.trainers);
      prisma.session.count.mockResolvedValue(mockStats.sessions);
      prisma.certificate.count.mockResolvedValue(mockStats.certificates);
      prisma.trainerProfile.count.mockResolvedValue(mockStats.pendingTrainerApplications);

      const response = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.learners).toBe(150);
      expect(response.body.data.trainers).toBe(25);
      expect(response.body.data.pendingTrainerApplications).toBe(8);
    });

    it('should reject non-ADMIN access to stats', async () => {
      const response = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${learnerToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe('GET /api/admin/users - User management', () => {
    it('should return paginated users for ADMIN', async () => {
      const mockUsers = [
        { id: '1', name: 'John', email: 'john@test.com', role: 'LEARNER' },
        { id: '2', name: 'Jane', email: 'jane@test.com', role: 'TRAINER' }
      ];

      prisma.user.findMany.mockResolvedValue(mockUsers);
      prisma.user.count.mockResolvedValue(2);

      const response = await request(app)
        .get('/api/admin/users?page=1&limit=10')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.pagination.total).toBe(2);
    });

    it('should filter users by role', async () => {
      prisma.user.findMany.mockResolvedValue([{ role: 'LEARNER' }]);
      prisma.user.count.mockResolvedValue(1);

      const response = await request(app)
        .get('/api/admin/users?role=LEARNER')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ role: 'LEARNER' })
        })
      );
    });

    it('should search users by name or email', async () => {
      prisma.user.findMany.mockResolvedValue([]);
      prisma.user.count.mockResolvedValue(0);

      const response = await request(app)
        .get('/api/admin/users?search=john')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              expect.objectContaining({ name: expect.any(Object) }),
              expect.objectContaining({ email: expect.any(Object) })
            ])
          })
        })
      );
    });
  });

  describe('PATCH /api/admin/users/:userId/role - Update user role', () => {
    it('should update user role as ADMIN', async () => {
      prisma.user.count.mockResolvedValueOnce(2); // Admin count for last admin check
      prisma.user.findUnique.mockResolvedValue({ id: 'user-123', role: 'LEARNER' });
      prisma.user.update.mockResolvedValue({
        id: 'user-123',
        name: 'Test User',
        role: 'TRAINER'
      });

      const response = await request(app)
        .patch('/api/admin/users/user-123/role')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: 'TRAINER' });

      expect(response.status).toBe(200);
      expect(response.body.data.role).toBe('TRAINER');
    });

    it('should prevent demoting the last admin', async () => {
      prisma.user.count.mockResolvedValueOnce(1); // Only one admin left
      prisma.user.findUnique.mockResolvedValue({ id: 'admin-123', role: 'ADMIN' });

      const response = await request(app)
        .patch('/api/admin/users/admin-123/role')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: 'LEARNER' });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Cannot demote the last admin');
    });
  });

  describe('Admin Announcement Management', () => {
    it('should create announcement as ADMIN', async () => {
      const announcementData = {
        title: 'System Update',
        body: 'System will be down for maintenance.',
        audience: 'all'
      };

      prisma.announcement.create.mockResolvedValue({
        id: 'ann-123',
        ...announcementData,
        createdAt: new Date()
      });

      const response = await request(app)
        .post('/api/admin/announcements')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(announcementData);

      expect(response.status).toBe(201);
      expect(response.body.data.title).toBe(announcementData.title);
    });

    it('should get all announcements as ADMIN', async () => {
      prisma.announcement.findMany.mockResolvedValue([mockAnnouncement]);
      prisma.announcement.count.mockResolvedValue(1);

      const response = await request(app)
        .get('/api/admin/announcements')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeInstanceOf(Array);
    });

    it('should update announcement as ADMIN', async () => {
      const updateData = { title: 'Updated Title' };

      prisma.announcement.findUnique.mockResolvedValue(mockAnnouncement);
      prisma.announcement.update.mockResolvedValue({
        ...mockAnnouncement,
        ...updateData
      });

      const response = await request(app)
        .put(`/api/admin/announcements/${mockAnnouncement.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.data.title).toBe(updateData.title);
    });

    it('should delete announcement as ADMIN', async () => {
      prisma.announcement.findUnique.mockResolvedValue(mockAnnouncement);
      prisma.announcement.delete.mockResolvedValue(mockAnnouncement);

      const response = await request(app)
        .delete(`/api/admin/announcements/${mockAnnouncement.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});