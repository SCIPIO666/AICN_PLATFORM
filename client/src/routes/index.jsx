
export const learnerRoutes = [
  { path: "learner", element: <LearnerDashboard />, roles: ['LEARNER', 'TRAINER', 'ADMIN'] },
  { path: "learner/sessions", element: <Sessions />, roles: ['LEARNER', 'TRAINER', 'ADMIN'] },
  { path: "learner/my-enrolments", element: <MyEnrolments />, roles: ['LEARNER', 'TRAINER', 'ADMIN'] },
  { path: "learner/my-certificates", element: <MyCertificates />, roles: ['LEARNER', 'TRAINER', 'ADMIN'] },
  { path: "learner/trainers", element: <Trainers />, roles: ['LEARNER', 'TRAINER', 'ADMIN'] },
  { path: "learner/apply-trainer", element: <ApplyTrainer />, roles: ['LEARNER', 'TRAINER', 'ADMIN'] },
];

export const trainerRoutes = [
  { path: "trainer", element: <TrainerDashboard />, roles: ['TRAINER', 'ADMIN'] },
  { path: "trainer/sessions", element: <TrainerSessions />, roles: ['TRAINER', 'ADMIN'] },
  { path: "trainer/attendance/:sessionId", element: <Attendance />, roles: ['TRAINER', 'ADMIN'] },
  { path: "trainer/profile", element: <TrainerProfile />, roles: ['TRAINER', 'ADMIN'] },
];

export const adminRoutes = [
  { path: "admin", element: <AdminDashboard />, roles: ['ADMIN'] },
  { path: "admin/users", element: <Users />, roles: ['ADMIN'] },
  { path: "admin/sessions", element: <AdminSessions />, roles: ['ADMIN'] },
  { path: "admin/trainer-applications", element: <TrainerApplications />, roles: ['ADMIN'] },
  { path: "admin/announcements", element: <Announcements />, roles: ['ADMIN'] },
];

export const sharedRoutes = [
  { path: "profile", element: <Profile />, roles: [] },
  { path: "settings", element: <Settings />, roles: [] },
];