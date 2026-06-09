export const navigation = [
  // LEARNER ROUTES
  {
    id: 'learner-dashboard',
    label: 'Dashboard',
    path: '/dashboard/learner',  // Full path including /dashboard
    icon: '📊',
    roles: ['LEARNER', 'TRAINER', 'ADMIN'],
    order: 1
  },
  {
    id: 'learner-sessions',
    label: 'Browse Sessions',
    path: '/dashboard/learner/sessions',
    icon: '📚',
    roles: ['LEARNER', 'TRAINER', 'ADMIN'],
    order: 2
  },
  {
    id: 'learner-enrolments',
    label: 'My Enrolments',
    path: '/dashboard/learner/my-enrolments',
    icon: '✅',
    roles: ['LEARNER', 'TRAINER', 'ADMIN'],
    order: 3
  },
  {
    id: 'learner-certificates',
    label: 'My Certificates',
    path: '/dashboard/learner/my-certificates',
    icon: '🎓',
    roles: ['LEARNER', 'TRAINER', 'ADMIN'],
    order: 4
  },
  {
    id: 'learner-trainers',
    label: 'Find Trainers',
    path: '/dashboard/learner/trainers',
    icon: '👨‍🏫',
    roles: ['LEARNER', 'TRAINER', 'ADMIN'],
    order: 5
  },
  {
    id: 'learner-apply',
    label: 'Become a Trainer',
    path: '/dashboard/learner/apply-trainer',
    icon: '✍️',
    roles: ['LEARNER'],
    order: 6
  },

  // TRAINER ROUTES
  {
    id: 'trainer-dashboard',
    label: 'Dashboard',
    path: '/dashboard/trainer',
    icon: '📊',
    roles: ['TRAINER', 'ADMIN'],
    order: 1
  },
  {
    id: 'trainer-sessions',
    label: 'My Sessions',
    path: '/dashboard/trainer/sessions',
    icon: '👨‍🏫',
    roles: ['TRAINER', 'ADMIN'],
    order: 2
  },
  {
    id: 'trainer-attendance',
    label: 'Mark Attendance',
    path: '/dashboard/trainer/attendance',
    icon: '📝',
    roles: ['TRAINER', 'ADMIN'],
    order: 3
  },
  {
    id: 'trainer-profile',
    label: 'Profile',
    path: '/dashboard/trainer/profile',
    icon: '👤',
    roles: ['TRAINER', 'ADMIN'],
    order: 4
  },

  // ADMIN ROUTES
  {
    id: 'admin-dashboard',
    label: 'Dashboard',
    path: '/dashboard/admin',
    icon: '📊',
    roles: ['ADMIN'],
    order: 1
  },
  {
    id: 'admin-users',
    label: 'Manage Users',
    path: '/dashboard/admin/users',
    icon: '👥',
    roles: ['ADMIN'],
    order: 2
  },
  {
    id: 'admin-sessions',
    label: 'Manage Sessions',
    path: '/dashboard/admin/sessions',
    icon: '📅',
    roles: ['ADMIN'],
    order: 3
  },
  {
    id: 'admin-applications',
    label: 'Trainer Applications',
    path: '/dashboard/admin/applications',
    icon: '✍️',
    roles: ['ADMIN'],
    order: 4
  },
  {
    id: 'admin-announcements',
    label: 'Announcements',
    path: '/dashboard/admin/announcements',
    icon: '📢',
    roles: ['ADMIN'],
    order: 5
  },
  {
    id: 'admin-certificates',
    label: 'Certificates',
    path: '/dashboard/admin/certificates',
    icon: '🎓',
    roles: ['ADMIN'],
    order: 6
  },

  // SHARED ROUTES
  {
    id: 'profile',
    label: 'My Profile',
    path: '/dashboard/profile',
    icon: '👤',
    roles: ['LEARNER', 'TRAINER', 'ADMIN'],
    order: 98
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/dashboard/settings',
    icon: '⚙️',
    roles: ['LEARNER', 'TRAINER', 'ADMIN'],
    order: 99
  }
]

export const getNavigationByRole = (role) => {
  return navigation
    .filter(item => item.roles.includes(role))
    .sort((a, b) => a.order - b.order)
}