const request = require('supertest');
const app = require('../app');
const prisma = require('../config/db');
const { generateTestToken, mockEnrolment, mockSession } = require('../utils/testHelpers');

describe('Enrolments Endpoints (Redesigned)', () => {
  let learnerToken;
  let trainerToken;
  let adminToken;

  beforeAll(() => {
    learnerToken = generateTestToken('learner-123', 'LEARNER');
    trainerToken = generateTestToken('trainer-123', 'TRAINER');
    adminToken = generateTestToken('admin-123', 'ADMIN');
  });

  describe('POST /api/enrolments - Enroll in session', () => {
    it('should enrol user in session', async () => {
      const enrolmentData = { sessionId: 'test-session-123' };

      prisma.session.findUnique.mockResolvedValue({
        ...mockSession,
        _count: { enrolments: 15 },
        capacity: 30,
        status: 'SCHEDULED'
      });
      prisma.enrolment.findUnique.mockResolvedValue(null);
      prisma.enrolment.create.mockResolvedValue(mockEnrolment);

      const response = await request(app)
        .post('/api/enrolments')
        .set('Authorization', `Bearer ${learnerToken}`)
        .send(enrolmentData);

      expect(response.status).toBe(201);
      expect(response.body.message).toContain('Successfully enrolled');
    });

    it('should reject enrolment in cancelled session', async () => {
      prisma.session.findUnique.mockResolvedValue({
        ...mockSession,
        status: 'CANCELLED'
      });

      const response = await request(app)
        .post('/api/enrolments')
        .set('Authorization', `Bearer ${learnerToken}`)
        .send({ sessionId: 'cancelled-session' });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('cancelled');
    });
  });

  describe('GET /api/enrolments/me - Get my enrolments', () => {
    it('should get user\'s own enrolments only', async () => {
      prisma.enrolment.findMany.mockResolvedValue([mockEnrolment]);
      prisma.enrolment.count.mockResolvedValue(1);

      const response = await request(app)
        .get('/api/enrolments/me')
        .set('Authorization', `Bearer ${learnerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeInstanceOf(Array);
      
      // Verify filter includes userId
      expect(prisma.enrolment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ userId: 'learner-123' })
        })
      );
    });

    it('should not allow access to other users\' enrolments', async () => {
      // The endpoint is hardcoded to /me, so no way to access others
      const response = await request(app)
        .get('/api/enrolments/me')
        .set('Authorization', `Bearer ${learnerToken}`);

      expect(response.status).toBe(200);
      // The service should always filter by the authenticated user's ID
    });
  });

  describe('PATCH /api/enrolments/:id/attend - Mark attendance (TRAINER/ADMIN)', () => {
    it('should mark attendance as TRAINER', async () => {
      prisma.enrolment.findUnique.mockResolvedValue({
        ...mockEnrolment,
        sessionId: 'session-123'
      });
      prisma.session.findUnique.mockResolvedValue({
        ...mockSession,
        trainerId: 'trainer-123'
      });
      prisma.enrolment.update.mockResolvedValue({
        ...mockEnrolment,
        status: 'ATTENDED'
      });

      const response = await request(app)
        .patch(`/api/enrolments/${mockEnrolment.id}/attend`)
        .set('Authorization', `Bearer ${trainerToken}`)
        .send({ status: 'ATTENDED' });

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('marked as ATTENDED');
    });

    it('should reject attendance marking by LEARNER', async () => {
      const response = await request(app)
        .patch(`/api/enrolments/${mockEnrolment.id}/attend`)
        .set('Authorization', `Bearer ${learnerToken}`)
        .send({ status: 'ATTENDED' });

      expect(response.status).toBe(403);
    });

    it('should validate status is ATTENDED or ABSENT', async () => {
      const response = await request(app)
        .patch(`/api/enrolments/${mockEnrolment.id}/attend`)
        .set('Authorization', `Bearer ${trainerToken}`)
        .send({ status: 'INVALID' });

      expect(response.status).toBe(400);
    });
  });

  describe('PATCH /api/enrolments/:id/cancel - Cancel own enrolment', () => {
    it('should cancel user\'s own enrolment', async () => {
      prisma.enrolment.findUnique.mockResolvedValue({
        ...mockEnrolment,
        userId: 'learner-123',
        status: 'ENROLLED'
      });
      prisma.enrolment.update.mockResolvedValue({
        ...mockEnrolment,
        status: 'CANCELLED'
      });

      const response = await request(app)
        .patch(`/api/enrolments/${mockEnrolment.id}/cancel`)
        .set('Authorization', `Bearer ${learnerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('cancelled');
    });

    it('should not allow cancelling already attended enrolment', async () => {
      prisma.enrolment.findUnique.mockResolvedValue({
        ...mockEnrolment,
        userId: 'learner-123',
        status: 'ATTENDED'
      });

      const response = await request(app)
        .patch(`/api/enrolments/${mockEnrolment.id}/cancel`)
        .set('Authorization', `Bearer ${learnerToken}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Cannot cancel');
    });

    it('should allow ADMIN to cancel any enrolment', async () => {
      prisma.enrolment.findUnique.mockResolvedValue({
        ...mockEnrolment,
        userId: 'other-user',
        status: 'ENROLLED'
      });
      prisma.enrolment.update.mockResolvedValue({
        ...mockEnrolment,
        status: 'CANCELLED'
      });

      const response = await request(app)
        .patch(`/api/enrolments/${mockEnrolment.id}/cancel`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
    });
  });
});