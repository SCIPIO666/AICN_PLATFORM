const request = require('supertest');
const app = require('../app');
const prisma = require('../config/db');
const { generateTestToken, mockCertificate, mockEnrolment } = require('../utils/testHelpers');

jest.mock('../utils/pdfGenerator', () => ({
  generateCertificatePDF: jest.fn().mockResolvedValue(Buffer.from('mock-pdf'))
}));

jest.mock('../utils/emailService', () => ({
  sendCertificateEmail: jest.fn().mockResolvedValue(true)
}));

describe('Certificates Endpoints (Redesigned with Batch)', () => {
  let adminToken;

  beforeAll(() => {
    adminToken = generateTestToken('admin-123', 'ADMIN');
  });

  describe('GET /api/certificates/me - My certificates', () => {
    it('should get authenticated user\'s certificates', async () => {
      const learnerToken = generateTestToken('learner-123', 'LEARNER');
      
      prisma.certificate.findMany.mockResolvedValue([mockCertificate]);

      const response = await request(app)
        .get('/api/certificates/me')
        .set('Authorization', `Bearer ${learnerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeInstanceOf(Array);
    });
  });

  describe('GET /api/certificates/verify/:code - Public verification', () => {
    it('should verify valid certificate', async () => {
      prisma.certificate.findUnique.mockResolvedValue({
        ...mockCertificate,
        revokedAt: null
      });

      const response = await request(app)
        .get(`/api/certificates/verify/${mockCertificate.certCode}`);

      expect(response.status).toBe(200);
      expect(response.body.data.certCode).toBe(mockCertificate.certCode);
    });

    it('should return 410 for revoked certificate', async () => {
      prisma.certificate.findUnique.mockResolvedValue({
        ...mockCertificate,
        revokedAt: new Date()
      });

      const response = await request(app)
        .get(`/api/certificates/verify/${mockCertificate.certCode}`);

      expect(response.status).toBe(410);
    });
  });

  describe('POST /api/certificates/batch/:sessionId - Batch issue certificates', () => {
    it('should issue certificates to all ATTENDED users in session', async () => {
      const attendedEnrolments = [
        { userId: 'user-1', user: { name: 'John' }, status: 'ATTENDED' },
        { userId: 'user-2', user: { name: 'Jane' }, status: 'ATTENDED' }
      ];

      prisma.enrolment.findMany.mockResolvedValue(attendedEnrolments);
      prisma.certificate.create.mockResolvedValue(mockCertificate);
      prisma.certificate.findUnique.mockResolvedValue(null);
      prisma.enrolment.findFirst.mockResolvedValue({ status: 'ATTENDED' });

      const response = await request(app)
        .post('/api/certificates/batch/session-123')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(201);
      expect(response.body.data.issued).toBe(2);
      expect(response.body.message).toContain('Issued 2 certificates');
    });

    it('should handle partial failures in batch issuance', async () => {
      const attendedEnrolments = [
        { userId: 'user-1', user: { name: 'John' }, status: 'ATTENDED' },
        { userId: 'user-2', user: { name: 'Jane' }, status: 'ATTENDED' }
      ];

      prisma.enrolment.findMany.mockResolvedValue(attendedEnrolments);
      prisma.certificate.create
        .mockResolvedValueOnce(mockCertificate)
        .mockRejectedValueOnce(new Error('Duplicate certificate'));
      prisma.certificate.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockCertificate);
      prisma.enrolment.findFirst
        .mockResolvedValue({ status: 'ATTENDED' });

      const response = await request(app)
        .post('/api/certificates/batch/session-123')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(201);
      expect(response.body.data.issued).toBe(1);
      expect(response.body.data.failed).toBe(1);
      expect(response.body.data.errors).toHaveLength(1);
    });

    it('should reject batch issuance by non-ADMIN', async () => {
      const trainerToken = generateTestToken('trainer-123', 'TRAINER');

      const response = await request(app)
        .post('/api/certificates/batch/session-123')
        .set('Authorization', `Bearer ${trainerToken}`);

      expect(response.status).toBe(403);
    });
  });
});