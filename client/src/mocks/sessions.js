export const mockSessions = [
  {
    id: '1',
    title: 'Advanced JavaScript: Modern ES2024 Features',
    skillArea: 'Programming',
    description: 'Deep dive into the latest JavaScript features including async/await patterns, modules, and new APIs.',
    date: '2024-12-15T10:00:00Z',
    durationMins: 120,
    locationType: 'ONLINE',
    capacity: 50,
    enrolledCount: 32,
    trainer: { id: 't1', name: 'Dr. Sarah Wanjiku' },
  },
  {
    id: '2',
    title: 'React Masterclass: Building Production Apps',
    skillArea: 'Frontend',
    description: 'Learn React hooks, context API, performance optimization, and testing strategies.',
    date: '2024-12-18T14:00:00Z',
    durationMins: 180,
    locationType: 'ONLINE',
    capacity: 40,
    enrolledCount: 28,
    trainer: { id: 't1', name: 'Dr. Sarah Wanjiku' },
  },
  {
    id: '3',
    title: 'Python for Data Science',
    skillArea: 'Data Science',
    description: 'Introduction to Python programming with focus on data analysis using pandas and numpy.',
    date: '2024-12-20T09:00:00Z',
    durationMins: 240,
    locationType: 'PHYSICAL',
    capacity: 30,
    enrolledCount: 25,
    trainer: { id: 't2', name: 'Prof. James Otieno' },
  },
];

export const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAPI = {
  getSessions: async (filters) => {
    await delay();
    let filtered = [...mockSessions];
    if (filters.skillArea) {
      filtered = filtered.filter(s => s.skillArea === filters.skillArea);
    }
    if (filters.locationType) {
      filtered = filtered.filter(s => s.locationType === filters.locationType);
    }
    if (filters.search) {
      filtered = filtered.filter(s => s.title.toLowerCase().includes(filters.search.toLowerCase()));
    }
    if (filters.upcoming) {
      filtered = filtered.filter(s => new Date(s.date) > new Date());
    }
    return {
      data: filtered,
      pagination: { page: filters.page || 1, limit: filters.limit || 10, total: filtered.length, totalPages: Math.ceil(filtered.length / (filters.limit || 10)) }
    };
  },
  enrolInSession: async (sessionId) => {
    await delay();
    return { success: true, enrolmentId: `enrol-${Date.now()}` };
  }
};