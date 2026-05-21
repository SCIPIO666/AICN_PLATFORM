const request = require('supertest');
const app = require('../../app');
const prisma = require('../../config/db');
const { generateTestToken, mockEnrolment, mockUser, mockSession } = require('../utils/testHelpers');

jest.mock('../../utils/pdf/pdfGenerator', () => ({
  generateCertificatePDF: jest.fn().mockResolvedValue(Buffer.from('mock-pdf-content'))
}));

jest.mock('../../utils/email/emailService', () => ({
  sendCertificateEmail: jest.fn().mockResolvedValue({ messageId: 'mock-id' })
}));

describe('Certificate Integration with PDF & Email', () => {
  let adminToken;

  beforeAll(() => {
    adminToken = generateTestToken('admin-123', 'ADMIN');
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/certificates', () => {
    it('should issue certificate and trigger PDF generation & email', async () => {
      prisma.enrolment.findFirst.mockResolvedValue({
        ...mockEnrolment,
        status: 'ATTENDED',
        user: mockUser,
        session: mockSession
      });
      prisma.certificate.findUnique.mockResolvedValue(null);
      prisma.certificate.create.mockResolvedValue({
        id: 'new-cert-id',
        certCode: 'CERT-TEST123',
        userId: mockUser.id,
        sessionId: mockSession.id,
        issuedAt: new Date()
      });

      const response = await request(app)
        .post('/api/certificates')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          userId: mockUser.id,
          sessionId: mockSession.id
        });

      expect(response.status).toBe(201);
      expect(require('../../utils/pdf/pdfGenerator').generateCertificatePDF).toHaveBeenCalled();
      expect(require('../../utils/email/emailService').sendCertificateEmail).toHaveBeenCalled();
    });
  });

  describe('POST /api/certificates/batch/:sessionId', () => {
    it('should batch issue certificates with emails', async () => {
      const attendedEnrolments = [
        { userId: 'user-1', user: { name: 'John', email: 'john@test.com' }, status: 'ATTENDED', session: mockSession },
        { userId: 'user-2', user: { name: 'Jane', email: 'jane@test.com' }, status: 'ATTENDED', session: mockSession }
      ];

      prisma.enrolment.findMany.mockResolvedValue(attendedEnrolments);
      prisma.certificate.findUnique.mockResolvedValue(null);
      prisma.certificate.create.mockResolvedValue({ id: 'cert-id', certCode: 'CERT-123' });
      prisma.enrolment.findFirst.mockResolvedValue({ status: 'ATTENDED', user: { name: 'Test' }, session: mockSession });

      const response = await request(app)
        .post('/api/certificates/batch/session-123')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(201);
      expect(response.body.data.issued).toBe(2);
    });
  });
});