const request = require('supertest');
const app = require('../app');
const prisma = require('../config/db');
const { generateTestToken, mockTrainerProfile, mockSession } = require('../utils/testHelpers');

describe('Trainers Endpoints (Redesigned)', () => {
  let learnerToken;
  let trainerToken;
  let adminToken;

  beforeAll(() => {
    learnerToken = generateTestToken('learner-123', 'LEARNER');
    trainerToken = generateTestToken('trainer-123', 'TRAINER');
    adminToken = generateTestToken('admin-123', 'ADMIN');
  });

  describe('GET /api/trainers/me/sessions - Trainer\'s assigned sessions', () => {
    it('should get trainer\'s own sessions with enrolments', async () => {
      const mockSessions = [{
        ...mockSession,
        trainerId: 'trainer-123',
        enrolments: [{ id: 'enrol-1', user: { name: 'John' } }],
        _count: { enrolments: 1 }
      }];

      prisma.session.findMany.mockResolvedValue(mockSessions);

      const response = await request(app)
        .get('/api/trainers/me/sessions')
        .set('Authorization', `Bearer ${trainerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data[0].trainerId).toBe('trainer-123');
    });

    it('should allow ADMIN to view any trainer\'s sessions', async () => {
      prisma.session.findMany.mockResolvedValue([mockSession]);

      const response = await request(app)
        .get('/api/trainers/me/sessions')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
    });

    it('should reject LEARNER access to trainer sessions', async () => {
      const response = await request(app)
        .get('/api/trainers/me/sessions')
        .set('Authorization', `Bearer ${learnerToken}`);

      expect(response.status).toBe(403);
    });

    it('should filter sessions by status', async () => {
      prisma.session.findMany.mockResolvedValue([mockSession]);

      const response = await request(app)
        .get('/api/trainers/me/sessions?status=SCHEDULED')
        .set('Authorization', `Bearer ${trainerToken}`);

      expect(response.status).toBe(200);
      expect(prisma.session.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: 'SCHEDULED' })
        })
      );
    });
  });

  describe('GET /api/trainers - Get all trainers (public)', () => {
    it('should return all approved trainers publicly', async () => {
      prisma.trainerProfile.findMany.mockResolvedValue([mockTrainerProfile]);
      prisma.trainerProfile.count.mockResolvedValue(1);

      const response = await request(app)
        .get('/api/trainers?status=APPROVED');

      expect(response.status).toBe(200);
      expect(response.body.data).toBeInstanceOf(Array);
    });
  });
});