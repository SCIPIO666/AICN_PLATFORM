
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  Award, 
  Clock, 
  ChevronRight,
  UserCheck,
  FileCheck,
  TrendingUp,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { format, isValid } from 'date-fns';

import { useMyTrainerProfile, useMyTrainerSessions } from '@/hooks';
import { useMe } from '@/hooks';
import StatsCard from '@/components/dashboard/StatsCard';
import Spinner from '@/components/ui/Spinner';
import { getSafeDate, safeFormatDate } from '@/utils/date';

function SessionItem({ session }) {
  const date = getSafeDate(session.date);
  const isOnline = session.locationType === 'ONLINE';
  const isFull = session._count?.enrolments >= session.capacity;

  return (
    <motion.div
      whileHover={{ x: 4 }}
      className="flex items-center justify-between p-3 rounded-lg transition-all"
      style={{ background: 'var(--bg-surface)' }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-xs font-bold flex-col"
          style={{ background: 'var(--color-forest-green)', color: 'white' }}
        >
          {date ? (
            <>
              <span>{safeFormatDate(date, 'dd')}</span>
              <span>{safeFormatDate(date, 'MMM')}</span>
            </>
          ) : (
            <>
              <span>??</span>
              <span>???</span>
            </>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
            {session.title || 'Untitled Session'}
          </p>
          <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span className="flex items-center gap-1">
              <Users size={12} />
              {session._count?.enrolments || 0}/{session.capacity}
            </span>
            {isFull && (
              <span className="text-red-500 font-medium">Full</span>
            )}
            <span className="flex items-center gap-1">
              {isOnline ? 'Online' : session.county || 'Physical'}
            </span>
          </div>
        </div>
      </div>
      <Link
        to={`/trainer/sessions/${session.id}`}
        className="flex-shrink-0 p-2 rounded-lg transition-colors hover:bg-card-hover"
      >
        <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
      </Link>
    </motion.div>
  );
}

export default function TrainerDashboard() {
  const { data: userData, isLoading: userLoading } = useMe();
  const { data: profileData, isLoading: profileLoading } = useMyTrainerProfile();
  const { data: sessionsData, isLoading: sessionsLoading } = useMyTrainerSessions();

  const user = userData?.data || userData;
  const profile = profileData?.data || profileData;

  const stats = useMemo(() => {
    const sessions = sessionsData?.data || [];
    
    const upcomingSessions = sessions.filter(s => {
      if (s.status !== 'SCHEDULED') return false;
      const date = getSafeDate(s.date);
      return date && date > new Date();
    });

    const completedSessions = sessions.filter(s => s.status === 'COMPLETED');
    
    const totalEnrolments = sessions.reduce((acc, s) => acc + (s._count?.enrolments || 0), 0);
    const totalAttendance = sessions.reduce((acc, s) => acc + (s._count?.attended || 0), 0);
    
    return {
      totalSessions: sessions.length,
      upcomingSessions: upcomingSessions.length,
      completedSessions: completedSessions.length,
      totalEnrolments,
      totalAttendance,
      upcomingList: upcomingSessions.slice(0, 4),
    };
  }, [sessionsData]);

  if (userLoading || profileLoading || sessionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-page)' }}>
        <Spinner />
      </div>
    );
  }

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
              Trainer Dashboard
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mt-2" style={{ color: 'var(--text-primary)' }}>
            Welcome back, {user?.name || 'Trainer'} 👋
          </h1>
          <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
            {profile?.bio || 'Manage your sessions, track attendance, and issue certificates.'}
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
        <StatsCard
          icon={Calendar}
          label="Total Sessions"
          value={stats.totalSessions}
          color="var(--color-forest-green)"
        />
        <StatsCard
          icon={Clock}
          label="Upcoming"
          value={stats.upcomingSessions}
          color="#3b82f6"
        />
        <StatsCard
          icon={Users}
          label="Total Enrolments"
          value={stats.totalEnrolments}
          color="#8b5cf6"
        />
        <StatsCard
          icon={UserCheck}
          label="Attendance"
          value={stats.totalAttendance}
          color="#f59e0b"
        />
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Sessions - 2/3 width */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-base p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                Upcoming Sessions
              </h3>
              <Link 
                to="/trainer/sessions" 
                className="text-sm flex items-center gap-1"
                style={{ color: 'var(--color-forest-green)' }}
              >
                View All
                <ChevronRight size={16} />
              </Link>
            </div>
            {stats.upcomingList.length > 0 ? (
              <div className="space-y-3">
                {stats.upcomingList.map((session) => (
                  <SessionItem key={session.id} session={session} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8" style={{ color: 'var(--text-muted)' }}>
                <Calendar size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No upcoming sessions</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Quick Actions - 1/3 width */}
        <div className="space-y-6">
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
                to="/trainer/sessions"
                className="flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-card-hover"
                style={{ color: 'var(--text-secondary)' }}
              >
                <Calendar size={18} style={{ color: 'var(--color-forest-green)' }} />
                <span className="text-sm">Manage Sessions</span>
                <ChevronRight size={16} className="ml-auto" />
              </Link>
              <Link
                to="/trainer/attendance"
                className="flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-card-hover"
                style={{ color: 'var(--text-secondary)' }}
              >
                <UserCheck size={18} style={{ color: 'var(--color-forest-green)' }} />
                <span className="text-sm">Take Attendance</span>
                <ChevronRight size={16} className="ml-auto" />
              </Link>
              <Link
                to="/trainer/certificates"
                className="flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-card-hover"
                style={{ color: 'var(--text-secondary)' }}
              >
                <Award size={18} style={{ color: 'var(--color-forest-green)' }} />
                <span className="text-sm">Issue Certificates</span>
                <ChevronRight size={16} className="ml-auto" />
              </Link>
              <Link
                to="/profile"
                className="flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-card-hover"
                style={{ color: 'var(--text-secondary)' }}
              >
                <FileCheck size={18} style={{ color: 'var(--color-forest-green)' }} />
                <span className="text-sm">Update Profile</span>
                <ChevronRight size={16} className="ml-auto" />
              </Link>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card-base p-6"
          >
            <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Session Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Completion Rate</span>
                <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                  {stats.totalSessions > 0 
                    ? Math.round((stats.completedSessions / stats.totalSessions) * 100) 
                    : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Avg. Enrolments</span>
                <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                  {stats.totalSessions > 0 
                    ? Math.round(stats.totalEnrolments / stats.totalSessions) 
                    : 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Attendance Rate</span>
                <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                  {stats.totalEnrolments > 0 
                    ? Math.round((stats.totalAttendance / stats.totalEnrolments) * 100) 
                    : 0}%
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}