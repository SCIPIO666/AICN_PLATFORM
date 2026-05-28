const jwt = require('jsonwebtoken');

const generateTestToken = (userId, role, email = 'test@example.com') => {
  return jwt.sign(
    { userId, email, role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

const createAuthHeader = (token) => ({
  Authorization: `Bearer ${token}`
});

const getTestUsers = () => ({
  learner: {
    id: 'test-learner-1',
    email: 'learner@test.com',
    role: 'LEARNER',
    token: null
  },
  trainer: {
    id: 'test-trainer-1',
    email: 'trainer@test.com',
    role: 'TRAINER',
    token: null
  },
  admin: {
    id: 'test-admin-1',
    email: 'admin@test.com',
    role: 'ADMIN',
    token: null
  }
});

const setupTestTokens = () => {
  const users = getTestUsers();
  users.learner.token = generateTestToken(users.learner.id, users.learner.role, users.learner.email);
  users.trainer.token = generateTestToken(users.trainer.id, users.trainer.role, users.trainer.email);
  users.admin.token = generateTestToken(users.admin.id, users.admin.role, users.admin.email);
  return users;
};

module.exports = {
  generateTestToken,
  createAuthHeader,
  getTestUsers,
  setupTestTokens
};