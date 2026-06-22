
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  Award,
  Sparkles,
  ChevronRight,
  AlertCircle,
  Briefcase,
  Bell,
  Activity
} from 'lucide-react';

import { useAdminStats, useUsers, useTrainerApplications } from '@/hooks';
import Spinner from '@/components/ui/Spinner';
import StatsCard from '@/components/dashboard/StatsCard';
import { safeFormatRelative, getSafeDate } from '@/utils/date';

// Helper component for recent activity
function RecentActivityItem({ activity }) {
  const icons = {
    user_registered: Users,
    trainer_applied: Briefcase,
    trainer_approved: UserCheck,
    session_created: Calendar,
    certificate_issued: Award,
    announcement_posted: Bell,
  };

  const Icon = icons[activity?.type] || Bell;

  // ✅ SAFE DATE HANDLING
  const getTimeAgo = () => {
    if (!activity?.timestamp) return 'Recently';
    const date = getSafeDate(activity.timestamp);
    if (!date) return 'Recently';
    return safeFormatRelative(date);
  };

  return (
    <motion.div
      whileHover={{ x: 4 }}
      className="flex items-center gap-3 p-3 rounded-lg transition-all"
      style={{ background: 'var(--bg-surface)' }}
    >
      <div className="flex-shrink-0 p-2 rounded-full" style={{ background: 'rgba(22, 101, 52, 0.1)' }}>
        <Icon size={16} style={{ color: 'var(--color-forest-green)' }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm truncate" style={{ color: 'var(--text-primary)' }}>
          {activity?.message || 'Activity occurred'}
        </p>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {getTimeAgo()}
        </p>
      </div>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const { data: statsData, isLoading: statsLoading, error: statsError } = useAdminStats();
  const { data: usersData, isLoading: usersLoading } = useUsers({ limit: 5 });
  const { data: applicationsData, isLoading: appsLoading } = useTrainerApplications({ limit: 5 });

  // ✅ SAFE DATA EXTRACTION
  const stats = useMemo(() => {
    if (!statsData?.data) {
      return {
        totalUsers: 0,
        totalTrainers: 0,
        totalSessions: 0,
        totalCertificates: 0,
      };
    }
    return statsData.data;
  }, [statsData]);

  // ✅ SAFE ARRAY EXTRACTION
  const recentUsers = useMemo(() => {
    if (!usersData?.data) return [];
    return Array.isArray(usersData.data) ? usersData.data : [];
  }, [usersData]);

  // ✅ SAFE ARRAY EXTRACTION
  const pendingApplications = useMemo(() => {
    if (!applicationsData?.data) return [];
    const apps = Array.isArray(applicationsData.data) ? applicationsData.data : [];
    return apps.filter(a => a?.status === 'PENDING');
  }, [applicationsData]);

  // ✅ SAFE ACTIVITY GENERATION
  const activities = useMemo(() => {
    const items = [];

    // Add user registrations
    recentUsers.slice(0, 3).forEach(u => {
      if (u?.name) {
        items.push({
          type: 'user_registered',
          message: `${u.name} registered as a ${u.role || 'user'}`,
          timestamp: u.createdAt || new Date(),
        });
      }
    });

    // Add pending applications
    pendingApplications.slice(0, 3).forEach(a => {
      if (a?.user?.name) {
        items.push({
          type: 'trainer_applied',
          message: `${a.user.name} applied to become a trainer`,
          timestamp: a.createdAt || new Date(),
        });
      }
    });

    // Sort by timestamp (newest first)
    return items.sort((a, b) => {
      const dateA = getSafeDate(a.timestamp);
      const dateB = getSafeDate(b.timestamp);
      if (!dateA || !dateB) return 0;
      return dateB - dateA;
    }).slice(0, 5);
  }, [recentUsers, pendingApplications]);

  // Loading state
  if (statsLoading || usersLoading || appsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-page)' }}>
        <Spinner />
      </div>
    );
  }

  // Error state - check if we have critical data
  if (statsError || !statsData) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-page)' }}>
        <div className="text-center max-w-md">
          <AlertCircle size={48} className="mx-auto mb-4" style={{ color: 'var(--error-text)' }} />
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Failed to load dashboard
          </h3>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
            {statsError?.message || 'Please try refreshing the page.'}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    { icon: Users, label: 'Total Users', value: stats.totalUsers || 0, color: '#3b82f6' },
    { icon: UserCheck, label: 'Trainers', value: stats.totalTrainers || 0, color: 'var(--color-forest-green)' },
    { icon: Calendar, label: 'Sessions', value: stats.totalSessions || 0, color: '#8b5cf6' },
    { icon: Award, label: 'Certificates', value: stats.totalCertificates || 0, color: '#f59e0b' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-base p-6 md:p-8 relative overflow-hidden mb-6"
      >
        <div
          className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10"
          style={{
            background: 'var(--color-forest-green)',
            filter: 'blur(60px)'
          }}
        />
        <div className="relative">
          <div className="flex items-center gap-2">
            <Sparkles size={20} style={{ color: 'var(--color-forest-green)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--color-forest-green)' }}>
              Admin Dashboard
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mt-2" style={{ color: 'var(--text-primary)' }}>
            Platform Overview
          </h1>
          <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
            Manage users, sessions, trainers, and monitor platform activity.
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
      >
        {statCards.map((stat, index) => (
          <StatsCard
            key={stat.label}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            color={stat.color}
          />
        ))}
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pending Applications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-base p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                Pending Trainer Applications
              </h3>
              <Link 
                to="/dashboard/admin/applications" 
                className="text-sm flex items-center gap-1"
                style={{ color: 'var(--color-forest-green)' }}
              >
                View All
                <ChevronRight size={16} />
              </Link>
            </div>
            {pendingApplications.length > 0 ? (
              <div className="space-y-3">
                {pendingApplications.slice(0, 3).map((application) => (
                  <Link
                    key={application.id}
                    to={`/dashboard/admin/applications/${application.id}`}
                    className="flex items-center justify-between p-3 rounded-lg transition-all hover:bg-card-hover"
                    style={{ background: 'var(--bg-surface)' }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                        style={{ background: 'var(--color-forest-green)', color: 'white' }}
                      >
                        {application.user?.name?.charAt(0) || 'A'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                          {application.user?.name || 'Unknown'}
                        </p>
                        <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                          {application.skillArea || 'No skill area'}
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-600">
                      Pending
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-6" style={{ color: 'var(--text-muted)' }}>
                <UserCheck size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No pending applications</p>
              </div>
            )}
          </motion.div>

          {/* Recent Users */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card-base p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                Recent Users
              </h3>
              <Link 
                to="/dashboard/admin/users" 
                className="text-sm flex items-center gap-1"
                style={{ color: 'var(--color-forest-green)' }}
              >
                View All
                <ChevronRight size={16} />
              </Link>
            </div>
            {recentUsers.length > 0 ? (
              <div className="space-y-3">
                {recentUsers.slice(0, 5).map((user) => (
                  <Link
                    key={user.id}
                    to={`/dashboard/admin/users/${user.id}`}
                    className="flex items-center justify-between p-3 rounded-lg transition-all hover:bg-card-hover"
                    style={{ background: 'var(--bg-surface)' }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                        style={{ background: 'var(--color-forest-green)', color: 'white' }}
                      >
                        {user.name?.charAt(0) || 'U'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                          {user.name || 'Unknown'}
                        </p>
                        <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                          {user.email || 'No email'}
                        </p>
                      </div>
                    </div>
                    <span
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{
                        background: user.role === 'ADMIN' 
                          ? 'rgba(139, 92, 246, 0.1)' 
                          : user.role === 'TRAINER'
                          ? 'rgba(22, 101, 52, 0.1)'
                          : 'rgba(59, 130, 246, 0.1)',
                        color: user.role === 'ADMIN' 
                          ? '#8b5cf6' 
                          : user.role === 'TRAINER'
                          ? 'var(--color-forest-green)'
                          : '#3b82f6'
                      }}
                    >
                      {user.role || 'User'}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-6" style={{ color: 'var(--text-muted)' }}>
                <Users size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No users yet</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="card-base p-6"
          >
            <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Link
                to="/dashboard/admin/announcements/create"
                className="flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-card-hover"
                style={{ color: 'var(--text-secondary)' }}
              >
                <Bell size={18} style={{ color: 'var(--color-forest-green)' }} />
                <span className="text-sm">Post Announcement</span>
                <ChevronRight size={16} className="ml-auto" />
              </Link>
              <Link
                to="/dashboard/admin/users"
                className="flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-card-hover"
                style={{ color: 'var(--text-secondary)' }}
              >
                <Users size={18} style={{ color: 'var(--color-forest-green)' }} />
                <span className="text-sm">Manage Users</span>
                <ChevronRight size={16} className="ml-auto" />
              </Link>
              <Link
                to="/dashboard/admin/applications"
                className="flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-card-hover"
                style={{ color: 'var(--text-secondary)' }}
              >
                <Briefcase size={18} style={{ color: 'var(--color-forest-green)' }} />
                <span className="text-sm">Review Applications</span>
                <ChevronRight size={16} className="ml-auto" />
              </Link>
              <Link
                to="/dashboard/admin/certificates"
                className="flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-card-hover"
                style={{ color: 'var(--text-secondary)' }}
              >
                <Award size={18} style={{ color: 'var(--color-forest-green)' }} />
                <span className="text-sm">Manage Certificates</span>
                <ChevronRight size={16} className="ml-auto" />
              </Link>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="card-base p-6"
          >
            <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Recent Activity
            </h3>
            {activities.length > 0 ? (
              <div className="space-y-2">
                {activities.map((activity, index) => (
                  <RecentActivityItem key={index} activity={activity} />
                ))}
              </div>
            ) : (
              <div className="text-center py-6" style={{ color: 'var(--text-muted)' }}>
                <Activity size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No recent activity</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}