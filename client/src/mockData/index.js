// Mock Users
import { useAuth } from "@/contexts/AuthContext"
// const {user,token}=useAuth()
export const mockUsers = {
  learners: [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'LEARNER', county: 'Nairobi', phone: '+254712345678', avatar: null },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'LEARNER', county: 'Mombasa', phone: '+254723456789', avatar: null },
    { id: '3', name: 'Peter Kimani', email: 'peter@example.com', role: 'LEARNER', county: 'Kisumu', phone: '+254734567890', avatar: null },
  ],
  trainers: [
    { id: '4', name: 'Dr. Sarah Wanjiku', email: 'sarah@aicn.com', role: 'TRAINER', skills: ['JavaScript', 'React', 'Node.js'], bio: 'Senior software engineer with 10+ years experience', avatar: null },
    { id: '5', name: 'Prof. James Otieno', email: 'james@aicn.com', role: 'TRAINER', skills: ['Python', 'Data Science', 'AI'], bio: 'PhD in Computer Science, AI researcher', avatar: null },
  ],
  admin: [
    { id: '6', name: 'Admin User', email: 'admin@aicn.com', role: 'ADMIN', avatar: null },
  ],
  // user
}

// Mock Sessions
export const mockSessions = [
  {
    id: '1',
    title: 'Advanced JavaScript: Modern ES2024 Features',
    skillArea: 'Programming',
    description: 'Deep dive into the latest JavaScript features including async/await patterns, modules, and new APIs.',
    date: '2027-12-15T10:00:00Z',
    durationMins: 120,
    locationType: 'ONLINE',
    meetingLink: 'https://zoom.us/j/123456789',
    venue: null,
    county: null,
    capacity: 50,
    enrolledCount: 32,
    status: 'SCHEDULED',
    trainerId: '4',
    trainer: { id: '4', name: 'Dr. Sarah Wanjiku' },
    image: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400'
  },
  {
    id: '2',
    title: 'React Masterclass: Building Production Apps',
    skillArea: 'Frontend',
    description: 'Learn React hooks, context API, performance optimization, and testing strategies.',
    date: '2027-12-18T14:00:00Z',
    durationMins: 180,
    locationType: 'ONLINE',
    meetingLink: 'https://zoom.us/j/987654321',
    venue: null,
    county: null,
    capacity: 40,
    enrolledCount: 28,
    status: 'SCHEDULED',
    trainerId: '4',
    trainer: { id: '4', name: 'Dr. Sarah Wanjiku' },
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400'
  },
  {
    id: '3',
    title: 'Python for Data Science',
    skillArea: 'Data Science',
    description: 'Introduction to Python programming with focus on data analysis using pandas and numpy.',
    date: '2027-12-20T09:00:00Z',
    durationMins: 240,
    locationType: 'PHYSICAL',
    meetingLink: null,
    venue: 'Nairobi Tech Hub, 3rd Floor',
    county: 'Nairobi',
    capacity: 30,
    enrolledCount: 25,
    status: 'SCHEDULED',
    trainerId: '5',
    trainer: { id: '5', name: 'Prof. James Otieno' },
    image: 'https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?w=400'
  },
  {
    id: '4',
    title: 'Machine Learning Fundamentals',
    skillArea: 'AI/ML',
    description: 'Understanding ML algorithms, model training, and evaluation techniques.',
    date: '2027-12-22T11:00:00Z',
    durationMins: 180,
    locationType: 'ONLINE',
    meetingLink: 'https://zoom.us/j/555666777',
    venue: null,
    county: null,
    capacity: 35,
    enrolledCount: 20,
    status: 'SCHEDULED',
    trainerId: '5',
    trainer: { id: '5', name: 'Prof. James Otieno' },
    image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400'
  },
  {
    id: '5',
    title: 'UI/UX Design Principles',
    skillArea: 'Design',
    description: 'Learn design thinking, wireframing, prototyping, and user research methods.',
    date: '2027-01-05T10:00:00Z',
    durationMins: 150,
    locationType: 'PHYSICAL',
    meetingLink: null,
    venue: 'Design Hub, Westlands',
    county: 'Nairobi',
    capacity: 25,
    enrolledCount: 15,
    status: 'SCHEDULED',
    trainerId: null,
    trainer: null,
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400'
  },
  {
    id: '6',
    title: 'Cloud Computing with AWS',
    skillArea: 'Cloud',
    description: 'Introduction to AWS services, EC2, S3, Lambda, and cloud architecture patterns.',
    date: '2027-01-10T13:00:00Z',
    durationMins: 200,
    locationType: 'ONLINE',
    meetingLink: 'https://zoom.us/j/111222333',
    venue: null,
    county: null,
    capacity: 45,
    enrolledCount: 42,
    status: 'SCHEDULED',
    trainerId: null,
    trainer: null,
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400'
  }
]

// Mock Enrolments
export const mockEnrolments = [
  {
    id: '1',
    userId: '1',
    sessionId: '1',
    session: mockSessions[0],
    status: 'ENROLLED',
    enrolledAt: '2024-12-01T10:00:00Z',
    attendedAt: null,
    certificateIssued: false
  },
  {
    id: '2',
    userId: '1',
    sessionId: '2',
    session: mockSessions[1],
    status: 'ENROLLED',
    enrolledAt: '2024-12-02T14:30:00Z',
    attendedAt: null,
    certificateIssued: false
  },
  {
    id: '3',
    userId: '1',
    sessionId: '3',
    session: mockSessions[2],
    status: 'COMPLETED',
    enrolledAt: '2024-11-15T09:00:00Z',
    attendedAt: '2024-11-20T16:00:00Z',
    certificateIssued: true
  }
]

// Mock Certificates
export const mockCertificates = [
  {
    id: '1',
    certificateCode: 'CERT-A1B2C3D4E5F6G7H8',
    userId: '1',
    sessionId: '3',
    session: mockSessions[2],
    issuedAt: '2024-11-21T10:00:00Z',
    downloadUrl: '/certificates/1/download'
  },
  {
    id: '2',
    certificateCode: 'CERT-H8G7F6E5D4C3B2A1',
    userId: '1',
    sessionId: '5',
    session: mockSessions[4],
    issuedAt: '2024-10-15T14:00:00Z',
    downloadUrl: '/certificates/2/download'
  }
]

// Mock Trainer Applications
export const mockTrainerApplications = [
  {
    id: '1',
    userId: '2',
    user: { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    bio: 'Full-stack developer with 5 years experience in React and Node.js',
    skills: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
    availability: 'Weekends and evenings',
    motivation: 'Passionate about teaching and mentoring junior developers',
    status: 'PENDING',
    submittedAt: '2024-12-01T08:00:00Z'
  },
  {
    id: '2',
    userId: '3',
    user: { id: '3', name: 'Peter Kimani', email: 'peter@example.com' },
    bio: 'Data scientist with expertise in Python and ML',
    skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow'],
    availability: 'Full-time availability',
    motivation: 'Want to share practical AI knowledge with learners',
    status: 'PENDING',
    submittedAt: '2024-12-03T11:00:00Z'
  }
]

// Mock Announcements
export const mockAnnouncements = [
  {
    id: '1',
    title: '🎉 New Year Schedule Update',
    body: 'Training sessions will resume on January 15th, 2025. Happy holidays!',
    audience: 'all',
    createdBy: 'Admin',
    createdAt: '2024-12-20T09:00:00Z'
  },
  {
    id: '2',
    title: '📢 New React Workshop Added',
    body: 'We\'re excited to announce a new Advanced React workshop starting January 20th. Limited seats available!',
    audience: 'learners',
    createdBy: 'Admin',
    createdAt: '2024-12-18T14:30:00Z'
  },
  {
    id: '3',
    title: '👨‍🏫 Trainer Orientation',
    body: 'All approved trainers, please attend the orientation session on January 5th at 2 PM.',
    audience: 'trainers',
    createdBy: 'Admin',
    createdAt: '2024-12-15T10:00:00Z'
  }
]

// Dashboard Stats
export const mockStats = {
  totalUsers: 156,
  totalLearners: 142,
  totalTrainers: 12,
  totalSessions: 24,
  activeSessions: 8,
  completedSessions: 16,
  totalEnrolments: 345,
  certificatesIssued: 128,
  pendingApplications: 5,
  recentActivities: [
    { id: 1, action: 'New user registered', user: 'Alice Mwangi', time: '2 hours ago', type: 'user' },
    { id: 2, action: 'Enrolled in session', user: 'Bob Ochieng', session: 'React Workshop', time: '5 hours ago', type: 'enrolment' },
    { id: 3, action: 'Certificate issued', user: 'Carol Wanjiku', session: 'Python Basics', time: '1 day ago', type: 'certificate' },
  ]
}

// Helper function to simulate API delay
export const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

// Mock API functions (will be replaced with real axios calls)
export const mockAPI = {
  // Sessions
  getSessions: async (filters = {}) => {
    await delay()
    let filtered = [...mockSessions]
    if (filters.upcoming) {
      filtered = filtered.filter(s => new Date(s.date) > new Date())
    }
    if (filters.skillArea) {
      filtered = filtered.filter(s => s.skillArea.toLowerCase().includes(filters.skillArea.toLowerCase()))
    }
    return {
      success: true,
      data: filtered,
      pagination: { page: 1, limit: 10, total: filtered.length, totalPages: 1 }
    }
  },
  
  getSessionById: async (id) => {
    await delay()
    const session = mockSessions.find(s => s.id === id)
    return { success: true, data: session }
  },
  
  // Enrolments
  getMyEnrolments: async () => {
    await delay()
    return { success: true, data: mockEnrolments }
  },
  
  enrolInSession: async (sessionId) => {
    await delay()
    const session = mockSessions.find(s => s.id === sessionId)
    const newEnrolment = {
      id: Date.now().toString(),
      userId: '1',
      sessionId,
      session,
      status: 'ENROLLED',
      enrolledAt: new Date().toISOString()
    }
    return { success: true, data: newEnrolment }
  },
  
  cancelEnrolment: async (enrolmentId) => {
    await delay()
    return { success: true, message: 'Enrolment cancelled' }
  },
  
  // Certificates
  getMyCertificates: async () => {
    await delay()
    return { success: true, data: mockCertificates }
  },
  
  verifyCertificate: async (code) => {
    await delay()
    const certificate = mockCertificates.find(c => c.certificateCode === code)
    if (certificate) {
      return { success: true, data: certificate }
    }
    throw { response: { data: { message: 'Certificate not found' } } }
  },
  
  // Trainers
  getTrainers: async () => {
    await delay()
    return { success: true, data: mockUsers.trainers }
  },
  
  applyForTrainer: async (application) => {
    await delay()
    return { success: true, data: { ...application, id: Date.now().toString(), status: 'PENDING' } }
  },
  
  getMyTrainerProfile: async () => {
    await delay()
    return { success: true, data: mockUsers.trainers[0] }
  },
  
  // Admin
  getStats: async () => {
    await delay()
    return { success: true, data: mockStats }
  },
  
  getAnnouncements: async () => {
    await delay()
    return { success: true, data: mockAnnouncements }
  },
  
  createAnnouncement: async (data) => {
    await delay()
    const newAnnouncement = { ...data, id: Date.now().toString(), createdAt: new Date().toISOString() }
    return { success: true, data: newAnnouncement }
  }
}