const { generateCertificatePDF, generateBatchCertificates } = require('../../utils/pdf/pdfGenerator');
const puppeteer = require('puppeteer');

jest.mock('puppeteer');
jest.mock('qrcode', () => ({
  toDataURL: jest.fn().mockResolvedValue('data:image/png;base64,mock-qr-code')
}));

describe('PDF Generator', () => {
  let mockBrowser;
  let mockPage;

  beforeEach(() => {
    mockPage = {
      setContent: jest.fn().mockResolvedValue(),
      pdf: jest.fn().mockResolvedValue(Buffer.from('mock-pdf-content'))
    };
    mockBrowser = {
      newPage: jest.fn().mockResolvedValue(mockPage),
      close: jest.fn().mockResolvedValue()
    };
    puppeteer.launch.mockResolvedValue(mockBrowser);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateCertificatePDF', () => {
    it('should generate PDF certificate successfully', async () => {
      const testData = {
        certCode: 'TEST-123',
        userName: 'John Doe',
        sessionTitle: 'JavaScript Workshop',
        sessionDate: new Date(),
        skillArea: 'Programming',
        duration: 120,
        trainerName: 'Jane Trainer',
        issueDate: new Date(),
        verifyUrl: 'http://localhost:3000/verify/TEST-123'
      };

      const pdfBuffer = await generateCertificatePDF(testData);

      expect(pdfBuffer).toBeInstanceOf(Buffer);
      expect(puppeteer.launch).toHaveBeenCalled();
      expect(mockPage.setContent).toHaveBeenCalled();
      expect(mockPage.pdf).toHaveBeenCalledWith(
        expect.objectContaining({
          format: 'A4',
          printBackground: true
        })
      );
      expect(mockBrowser.close).toHaveBeenCalled();
    });

    it('should handle PDF generation errors', async () => {
      mockPage.pdf.mockRejectedValue(new Error('PDF generation failed'));

      await expect(generateCertificatePDF({
        certCode: 'TEST-123',
        userName: 'John Doe',
        sessionTitle: 'Test',
        verifyUrl: 'http://test.com'
      })).rejects.toThrow('Failed to generate certificate PDF');
    });
  });

  describe('generateBatchCertificates', () => {
    it('should generate multiple PDFs', async () => {
      const certificatesData = [
        { certCode: 'CERT-1', userName: 'User 1', sessionTitle: 'Course 1', verifyUrl: 'http://test.com/1' },
        { certCode: 'CERT-2', userName: 'User 2', sessionTitle: 'Course 2', verifyUrl: 'http://test.com/2' }
      ];

      const results = await generateBatchCertificates(certificatesData);

      expect(results.successful).toHaveLength(2);
      expect(results.failed).toHaveLength(0);
      expect(results.successful[0]).toHaveProperty('certCode', 'CERT-1');
      expect(results.successful[0]).toHaveProperty('pdfBuffer');
    });

    it('should handle partial failures', async () => {
      mockPage.pdf
        .mockResolvedValueOnce(Buffer.from('pdf-1'))
        .mockRejectedValueOnce(new Error('Failed'));

      const certificatesData = [
        { certCode: 'CERT-1', userName: 'User 1', sessionTitle: 'Course 1', verifyUrl: 'http://test.com/1' },
        { certCode: 'CERT-2', userName: 'User 2', sessionTitle: 'Course 2', verifyUrl: 'http://test.com/2' }
      ];

      const results = await generateBatchCertificates(certificatesData);

      expect(results.successful).toHaveLength(1);
      expect(results.failed).toHaveLength(1);
      expect(results.failed[0]).toHaveProperty('certCode', 'CERT-2');
    });
  });
});