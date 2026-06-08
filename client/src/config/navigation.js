export const navigation = [
  // LEARNER ROUTES
  {
    id: 'learner-dashboard',
    label: 'Dashboard',
    path: '/dashboard/learner',
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
    id: 'learner-apply-trainer',
    label: 'Become a Trainer',
    path: '/dashboard/learner/apply-trainer',
    icon: '✍️',
    roles: ['LEARNER'],
    order: 6
  },

  // TRAINER ROUTES
  {
    id: 'trainer-dashboard',
    label: 'Trainer Dashboard',
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
    label: 'Trainer Profile',
    path: '/dashboard/trainer/profile',
    icon: '👤',
    roles: ['TRAINER', 'ADMIN'],
    order: 4
  },

  // ADMIN ROUTES
  {
    id: 'admin-dashboard',
    label: 'Admin Dashboard',
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

  // SHARED ROUTES
  {
    id: 'profile',
    label: 'My Profile',
    path: '/dashboard/profile',
    icon: '👤',
    roles: ['LEARNER', 'TRAINER', 'ADMIN'],
    order: 99
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/dashboard/settings',
    icon: '⚙️',
    roles: ['LEARNER', 'TRAINER', 'ADMIN'],
    order: 100
  }
]

export const getNavigationByRole = (role) => {
  return navigation
    .filter(item => item.roles.includes(role))
    .sort((a, b) => a.order - b.order)
}

export const getGroupedNavigation = (role) => {
  const items = getNavigationByRole(role)
  
  const groups = {
    main: items.filter(i => 
      i.path.includes('/dashboard/learner') || 
      i.path.includes('/dashboard/trainer') ||
      i.path === '/dashboard/admin'
    ),
    management: items.filter(i => 
      i.path.includes('/admin/users') ||
      i.path.includes('/admin/sessions') ||
      i.path.includes('/admin/applications') ||
      i.path.includes('/admin/announcements')
    ),
    settings: items.filter(i => 
      i.path.includes('/profile') ||
      i.path.includes('/settings')
    )
  }
  
  return groups
}