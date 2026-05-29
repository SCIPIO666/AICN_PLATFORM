
const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/v1';
const users = {
  admin: { email: 'admin@aicn.africa', password: 'Test123!@#' },
  trainer: { email: 'trainer@aicn.africa', password: 'Test123!@#' },
  learner: { email: 'learner@aicn.africa', password: 'Test123!@#' }
};

async function login(email, password) {
  const response = await axios.post(`${BASE_URL}/auth/login`, { email, password });
  return response.data.data.token;
}

async function testEndpoints(role, token) {
  console.log(`\n Testing as ${role.toUpperCase()}`);
  console.log('='.repeat(50));
  
  const headers = { Authorization: `Bearer ${token}` };
  
  // available to all
  const commonTests = [
    { name: 'Get sessions', method: 'get', url: '/sessions?upcoming=true' },
    { name: 'Get my profile', method: 'get', url: '/auth/me' },
  ];
  
  // Role-specific endpoints
  const roleTests = {
    admin: [
      { name: 'Get stats', method: 'get', url: '/admin/stats' },
      { name: 'Get users', method: 'get', url: '/admin/users?page=1&limit=5' },
      { name: 'Create announcement', method: 'post', url: '/admin/announcements', 
        data: { title: 'Test', body: 'Test content', audience: 'all' } },
    ],
    trainer: [
      { name: 'Get trainer profile', method: 'get', url: '/trainers/me' },
      { name: 'Get my sessions', method: 'get', url: '/trainers/me/sessions' },
    ],
    learner: [
      { name: 'Get my enrolments', method: 'get', url: '/enrolments/me' },
      { name: 'Apply for trainer', method: 'post', url: '/trainers/apply',
        data: { skills: ['JavaScript'], motivation: 'Test application' } },
    ]
  };
  
  // common tests
  for (const test of commonTests) {
    try {
      const response = await axios[test.method](`${BASE_URL}${test.url}`, { headers });
      console.log(` ${test.name}: ${response.status}`);
    } catch (error) {
      console.log(` ${test.name}: ${error.response?.status || error.message}`);
    }
  }
  
  // role-specific tests
  const specificTests = roleTests[role] || [];
  for (const test of specificTests) {
    try {
      const config = { headers };
      if (test.data) config.data = test.data;
      const response = await axios[test.method](`${BASE_URL}${test.url}`, config);
      console.log(` ${test.name}: ${response.status}`);
    } catch (error) {
      console.log(` ${test.name}: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
    }
  }
}

async function runAllTests() {
  console.log('🚀 Starting API Tests\n');
  
  for (const [role, credentials] of Object.entries(users)) {
    try {
      const token = await login(credentials.email, credentials.password);
      await testEndpoints(role, token);
    } catch (error) {
      console.log(` Failed to login as ${role}: ${error.message}`);
    }
  }
  
  console.log('\n Testing complete!');
}

// test
runAllTests().catch(console.error);