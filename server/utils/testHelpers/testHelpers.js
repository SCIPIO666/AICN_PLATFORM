const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// test token with  role
const generateTestToken = (userId = 'test-user-123', role = 'LEARNER') => {
  return jwt.sign(
    { userId, email: `${userId}@example.com`, role },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '1h' }
  );
};

//  user data
const mockUser = {
  id: 'test-user-123',
  name: 'Test User',
  email: 'test@example.com',
  password: bcrypt.hashSync('Password123!', 10),
  phone: '+254712345678',
  county: 'Nairobi',
  role: 'LEARNER',
  deletedAt: null,
  createdAt: new Date(),
  updatedAt: new Date()
};

// session data
const mockSession = {
  id: 'test-session-123',
  title: 'Test Workshop',
  skillArea: 'Programming',
  description: 'Test description',
  date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  durationMins: 120,
  locationType: 'ONLINE',
  venue: 'https://zoom.us/test',
  county: 'Nairobi',
  capacity: 30,
  status: 'SCHEDULED',
  trainerId: 'test-trainer-123',
  createdAt: new Date(),
  updatedAt: new Date(),
  _count: { enrolments: 0 }
};

//  enrolment data
const mockEnrolment = {
  id: 'test-enrolment-123',
  userId: 'test-user-123',
  sessionId: 'test-session-123',
  status: 'ENROLLED',
  createdAt: new Date(),
  updatedAt: new Date(),
  user: mockUser,
  session: mockSession
};

// certificate data
const mockCertificate = {
  id: 'test-cert-123',
  userId: 'test-user-123',
  sessionId: 'test-session-123',
  certCode: 'CERT-TEST1234567890',
  issuedAt: new Date(),
  revokedAt: null,
  revokedReason: null,
  user: mockUser,
  session: mockSession
};

// trainer profile
const mockTrainerProfile = {
  id: 'test-trainer-123',
  userId: 'test-user-123',
  bio: 'Experienced trainer',
  skills: ['JavaScript', 'React'],
  availability: 'Weekends',
  motivation: 'Passionate about teaching',
  status: 'PENDING',
  createdAt: new Date(),
  updatedAt: new Date(),
  user: mockUser
};

// announcement
const mockAnnouncement = {
  id: 'test-announcement-123',
  title: 'Test Announcement',
  body: 'This is a test announcement',
  audience: 'all',
  createdAt: new Date()
};

//  clearing all mocks between tests
const resetMocks = () => {
  jest.clearAllMocks();
};

module.exports = {
  generateTestToken,
  mockUser,
  mockSession,
  mockEnrolment,
  mockCertificate,
  mockTrainerProfile,
  mockAnnouncement,
  resetMocks
};