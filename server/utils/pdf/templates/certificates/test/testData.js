// Test data for certificate preview
const getTestCertificateData = () => {
  return {
    userName: 'Michael Kiprono Omondi',
    sessionTitle: 'Advanced Full-Stack Development with React, Node.js & MongoDB',
    skillArea: 'Web Development & Software Engineering',
    duration: 240,
    completionDate: new Date('2024-12-15'),
    trainerName: 'Prof. Sarah Wanjiku Johnson',
    certCode: 'AICN-FS-2024-0421',
    issueDate: new Date(),
    verifyUrl: 'https://aicn.com/verify/AICN-FS-2024-0421'
  };
};

// Multiple test scenarios
const getTestScenarios = () => {
  return {
    standard: {
      userName: 'John Doe',
      sessionTitle: 'JavaScript Mastery',
      skillArea: 'Programming',
      duration: 120,
      completionDate: new Date(),
      trainerName: 'Jane Smith',
      certCode: 'CERT-JS-001',
      verifyUrl: 'https://aicn.com/verify/CERT-JS-001'
    },
    premium: {
      userName: 'Dr. James Mwangi Kimani',
      sessionTitle: 'Artificial Intelligence & Machine Learning Professional Certificate',
      skillArea: 'AI/ML Engineering',
      duration: 480,
      completionDate: new Date(),
      trainerName: 'Prof. Alan Turing Institute',
      certCode: 'AICN-AI-2024-0892',
      verifyUrl: 'https://aicn.com/verify/AICN-AI-2024-0892'
    },
    longName: {
      userName: 'Ms. Elizabeth Wanjiku Muthoni Kamau',
      sessionTitle: 'Cloud Architecture & DevOps Engineering',
      skillArea: 'Cloud Computing',
      duration: 360,
      completionDate: new Date(),
      trainerName: 'Dr. Robert Kipchoge',
      certCode: 'AICN-CLOUD-2024-0567',
      verifyUrl: 'https://aicn.com/verify/AICN-CLOUD-2024-0567'
    }
  };
};

module.exports = {
  getTestCertificateData,
  getTestScenarios
};