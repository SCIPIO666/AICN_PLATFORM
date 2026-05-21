const request = require('supertest');
const app = require('../app');
const prisma = require('../config/db');
const { generateTestToken, mockSession } = require('../utils/testHelpers');

describe('Sessions Endpoints (Redesigned - Public GET)', () => {
  describe('GET /api/sessions - PUBLIC (no auth required)', () => {
    it('should get all sessions without authentication', async () => {
      prisma.session.findMany.mockResolvedValue([mockSession]);
      prisma.session.count.mockResolvedValue(1);

      const response = await request(app)
        .get('/api/sessions');  // No auth header!

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.sessions).toBeInstanceOf(Array);
    });

    it('should filter upcoming sessions', async () => {
      prisma.session.findMany.mockResolvedValue([mockSession]);
      prisma.session.count.mockResolvedValue(1);

      const response = await request(app)
        .get('/api/sessions?upcoming=true');

      expect(response.status).toBe(200);
      // Verify that fromDate filter was applied
      expect(prisma.session.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            date: expect.objectContaining({ gte: expect.any(Date) })
          })
        })
      );
    });

    it('should filter by skillArea', async () => {
      const response = await request(app)
        .get('/api/sessions?skillArea=Programming');

      expect(response.status).toBe(200);
    });

    it('should filter by county', async () => {
      const response = await request(app)
        .get('/api/sessions?county=Nairobi');

      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/sessions/:id - PUBLIC', () => {
    it('should get session by ID without auth', async () => {
      prisma.session.findUnique.mockResolvedValue({
        ...mockSession,
        _count: { enrolments: 5 }
      });

      const response = await request(app)
        .get(`/api/sessions/${mockSession.id}`);  // No auth!

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe(mockSession.id);
    });
  });

  describe('POST /api/sessions - ADMIN only', () => {
    it('should create session as ADMIN', async () => {
      const adminToken = generateTestToken('admin-123', 'ADMIN');
      const sessionData = {
        title: 'New Workshop',
        skillArea: 'Programming',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        durationMins: 120,
        locationType: 'ONLINE',
        capacity: 30
      };

      prisma.session.create.mockResolvedValue({
        id: 'new-session-id',
        ...sessionData,
        status: 'SCHEDULED'
      });

      const response = await request(app)
        .post('/api/sessions')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(sessionData);

      expect(response.status).toBe(201);
    });

    it('should reject session creation without auth', async () => {
      const response = await request(app)
        .post('/api/sessions')
        .send({ title: 'Test' });

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/sessions/:id - SOFT DELETE (set status=CANCELLED)', () => {
    it('should cancel session (soft delete) as ADMIN', async () => {
      const adminToken = generateTestToken('admin-123', 'ADMIN');
      
      prisma.session.findUnique.mockResolvedValue(mockSession);
      prisma.session.update.mockResolvedValue({
        ...mockSession,
        status: 'CANCELLED'
      });

      const response = await request(app)
        .delete(`/api/sessions/${mockSession.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('cancelled');
      expect(prisma.session.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: 'CANCELLED' })
        })
      );
    });
  });
});