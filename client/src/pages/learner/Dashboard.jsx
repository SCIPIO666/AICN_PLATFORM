// src/pages/learner/Dashboard.jsx
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Award, 
  Clock, 
  Calendar, 
  Bell, 
  Activity,
  ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';

// Hooks
import { useMyEnrolments, useMyCertificates } from '@/hooks';
import { useMe } from '@/hooks';
import { useAnnouncements } from '@/hooks';

// Components
import StatsCard from '@/components/dashboard/StatsCard';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import UpcomingSessionsWidget from '@/components/dashboard/UpcomingSessionsWidget';
import AnnouncementsWidget from '@/components/dashboard/AnnouncementsWidget';
import RecentActivityWidget from '@/components/dashboard/RecentActivityWidget';
import Spinner from '@/components/ui/Spinner';

// Store
import { useDashboardStore } from '@/stores/useDashboardStore';
import { cancelSession } from '@/api/sessions';

export default function LearnerDashboard() {

  const { data: userData, isLoading: userLoading } = useMe();
  const { data: enrolmentsData, isLoading: enrolmentsLoading } = useMyEnrolments();
  const { data: certificatesData, isLoading: certificatesLoading } = useMyCertificates();
  const { data: announcementsData, isLoading: announcementsLoading } = useAnnouncements();
  

  const { showAnnouncements, showRecentActivity } = useDashboardStore();


  const user = userData?.data || userData;
  const enrolments = enrolmentsData?.data || [];
  const certificates = certificatesData?.data || [];
  const announcements = announcementsData?.data || [];

  // Calculated stats
  const stats = useMemo(() => {
    const activeEnrolments = enrolments.filter(e => e.status === 'ACTIVE');
    const completedEnrolments = enrolments.filter(e => e.status === 'COMPLETED');
    const cancelledSessions =enrolments.filter(e => e.status === 'CANCELLED');
    const upcomingSessions = enrolments
      .filter(e => e.session?.status === 'SCHEDULED' && new Date(e.session.date) > new Date())
      .sort((a, b) => new Date(a.session.date) - new Date(b.session.date));
    
    //  --> 1 hour per session completed
    const totalHours = completedEnrolments.reduce((acc, e) => acc + (e.session?.durationMins || 0), 0) / 60;
    
    return {
      activeEnrolments: activeEnrolments.length,
      completedSessions: completedEnrolments.length,
      cancelledSessions : cancelledSessions.length,
      certificates: certificates.length,
      upcomingSessions: upcomingSessions.slice(0, 5),
      nextSession: upcomingSessions[0],
      cancelSession
    };
  }, [enrolments, certificates]);

 
  const activities = useMemo(() => {

    const recentActivities = [];//to pull from api later
    
    if (enrolments.length > 0) {
      // Latest enrolment
      const latest = enrolments[0];
      if (latest) {
        recentActivities.push({
          id: 'enrol-1',
          type: 'enrolment',
          message: `Enrolled in "${latest.session?.title || 'Session'}"`,
          timestamp: new Date(latest.enrolledAt || Date.now()),
        });
      }
    }
    
    if (certificates.length > 0) {
      const latestCert = certificates[0];
      if (latestCert) {
        recentActivities.push({
          id: 'cert-1',
          type: 'certificate',
          message: `Certificate issued for "${latestCert.session?.title || 'Session'}"`,
          timestamp: new Date(latestCert.issuedAt || Date.now()),
        });
      }
    }
    
    return recentActivities;
  }, [enrolments, certificates]);

  // Loading state
  if (userLoading || enrolmentsLoading || certificatesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-page)' }}>
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:px-8">
      {/* Header */}
      <DashboardHeader 
        user={user} 
        nextSession={stats.nextSession ? {
          title: stats.nextSession.session?.title,
          startTime: stats.nextSession.session?.date ? 
            format(new Date(stats.nextSession.session.date), 'h:mm a') : 'soon'
        } : null}
      />

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6"
      >
        <StatsCard
          icon={BookOpen}
          label="Active Enrolments"
          value={stats.activeEnrolments}
          color="var(--color-forest-green)"
        />
        <StatsCard
          icon={Clock}
          label="Completed Sessions"
          value={stats.completedSessions}
          color="#3b82f6"
        />
        <StatsCard
          icon={Award}
          label="Certificates"
          value={stats.certificates}
          color="#f59e0b"
        />
        <StatsCard
          icon={Calendar}
          label="Cancelled Sessions"
          value={stats.cancelledSessions}
          color="#8b5cf6"
        />
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Sessions Card */}
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
                to="/my-enrolments" 
                className="text-sm flex items-center gap-1"
                style={{ color: 'var(--color-forest-green)' }}
              >
                View All
                <ChevronRight size={16} />
              </Link>
            </div>
            <UpcomingSessionsWidget sessions={stats.upcomingSessions} />
          </motion.div>

          {/* Recent Activity Card (if enabled) */}
          {showRecentActivity && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card-base p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <Activity size={18} style={{ color: 'var(--color-forest-green)' }} />
                  Recent Activity
                </h3>
              </div>
              <RecentActivityWidget activities={activities} />
            </motion.div>
          )}
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* Announcements Card */}
          {showAnnouncements && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="card-base p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <Bell size={18} style={{ color: 'var(--color-forest-green)' }} />
                  Announcements
                </h3>
                {announcements.length > 3 && (
                  <Link 
                    to="/announcements" 
                    className="text-sm"
                    style={{ color: 'var(--color-forest-green)' }}
                  >
                    View All
                  </Link>
                )}
              </div>
              <AnnouncementsWidget announcements={announcements} />
            </motion.div>
          )}

          {/* Quick Stats Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="card-base p-6"
          >
            <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Quick Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Total Enrolments</span>
                <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{enrolments.length}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Completion Rate</span>
                <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                  {enrolments.length > 0 ? Math.round((stats.completedSessions / enrolments.length) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Certificates Earned</span>
                <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{stats.certificates}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Cancelled Sessions</span>
                <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{stats.cancelledSessions}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}