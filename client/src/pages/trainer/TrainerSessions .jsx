// src/pages/trainer/TrainerSessions.jsx
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  Clock, 
  Search,
  Filter,
  X,
  AlertCircle,
  UserCheck,
  Award,
  MapPin,
  Monitor,
  CheckCircle,
  XCircle,
  ChevronRight
} from 'lucide-react';

import { useMyTrainerSessions } from '@/hooks';
import { useAttendanceModalStore } from '@/stores/useAttendanceModalStore';
import Spinner from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { getSafeDate, safeFormatDate } from '@/utils/date';
import AttendanceModal from '@/components/trainer/AttendanceModal';

function SessionCard({ session, onMarkAttendance }) {
  const date = getSafeDate(session.date);
  const isOnline = session.locationType === 'ONLINE';
  const isFull = session._count?.enrolments >= session.capacity;
  const isPast = date && date < new Date();
  const isActive = session.status === 'SCHEDULED' || session.status === 'IN_PROGRESS';
  
  // Count attendance statuses
  const enrolments = session.enrolments || [];
  const attendedCount = enrolments.filter(e => e.status === 'ATTENDED').length;
  const notMarkedCount = enrolments.filter(e => e.status === 'ENROLLED' || e.status === 'ACTIVE').length;

  const statusColors = {
    SCHEDULED: { bg: 'rgba(22, 101, 52, 0.1)', color: 'var(--color-forest-green)', label: 'Scheduled' },
    IN_PROGRESS: { bg: 'rgba(251, 191, 36, 0.1)', color: '#d97706', label: 'In Progress' },
    COMPLETED: { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', label: 'Completed' },
    CANCELLED: { bg: 'rgba(220, 38, 38, 0.1)', color: '#dc2626', label: 'Cancelled' },
  };

  const statusInfo = statusColors[session.status] || statusColors.SCHEDULED;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="card-base p-6 transition-all cursor-pointer hover:border-neon-border"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold truncate" style={{ color: 'var(--text-primary)' }}>
            {session.title}
          </h3>
          
          <div className="flex flex-wrap gap-3 mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            {date && (
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {safeFormatDate(date, 'MMM d, yyyy')}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {session.durationMins} min
            </span>
            <span className="flex items-center gap-1">
              <Users size={14} />
              {session._count?.enrolments || 0}/{session.capacity}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            <span
              className="px-2 py-1 rounded text-xs font-medium"
              style={{
                background: statusInfo.bg,
                color: statusInfo.color
              }}
            >
              {statusInfo.label}
            </span>
            {isFull && (
              <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-600">
                Full
              </span>
            )}
            {isOnline ? (
              <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-600 flex items-center gap-1">
                <Monitor size={12} />
                Online
              </span>
            ) : (
              <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-600 flex items-center gap-1">
                <MapPin size={12} />
                Physical
              </span>
            )}
          </div>

          {/* Attendance Quick Stats */}
          {isActive && enrolments.length > 0 && (
            <div className="flex items-center gap-4 mt-3 text-xs">
              <span className="flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                <Users size={12} />
                {enrolments.length} enrolled
              </span>
              <span className="flex items-center gap-1" style={{ color: 'var(--color-forest-green)' }}>
                <CheckCircle size={12} />
                {attendedCount} present
              </span>
              {notMarkedCount > 0 && (
                <span className="flex items-center gap-1" style={{ color: '#3b82f6' }}>
                  <Clock size={12} />
                  {notMarkedCount} not marked
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          <button
            onClick={() => onMarkAttendance(session)}
            className="btn-primary flex items-center gap-2 px-4 py-2 text-sm"
          >
            <UserCheck size={16} />
            Mark Attendance
          </button>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {session._count?.enrolments || 0} learners
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function TrainerSessions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { openModal } = useAttendanceModalStore();
  
  const { data, isLoading, error, refetch } = useMyTrainerSessions();

  const sessions = data?.data || [];

  const filteredSessions = useMemo(() => {
    return sessions.filter(session => {
      const matchesSearch = session.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
      const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [sessions, searchTerm, statusFilter]);

  const stats = useMemo(() => ({
    total: sessions.length,
    scheduled: sessions.filter(s => s.status === 'SCHEDULED').length,
    inProgress: sessions.filter(s => s.status === 'IN_PROGRESS').length,
    completed: sessions.filter(s => s.status === 'COMPLETED').length,
  }), [sessions]);

  const handleMarkAttendance = (session) => {
    openModal(session.id, session);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-page)' }}>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-page)' }}>
        <div className="text-center max-w-md">
          <AlertCircle size={48} className="mx-auto mb-4" style={{ color: 'var(--error-text)' }} />
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Failed to load sessions
          </h3>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
            {error?.message || 'Please try refreshing the page.'}
          </p>
          <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
              My Sessions
            </h1>
            <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>
              Mark attendance for your assigned sessions
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {stats.total} total sessions
            </span>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="card-base p-3 text-center">
            <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{stats.total}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Total</p>
          </div>
          <div className="card-base p-3 text-center" style={{ borderColor: 'var(--color-forest-green)' }}>
            <p className="text-xl font-bold" style={{ color: 'var(--color-forest-green)' }}>{stats.scheduled}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Scheduled</p>
          </div>
          <div className="card-base p-3 text-center" style={{ borderColor: '#d97706' }}>
            <p className="text-xl font-bold" style={{ color: '#d97706' }}>{stats.inProgress}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>In Progress</p>
          </div>
          <div className="card-base p-3 text-center" style={{ borderColor: '#3b82f6' }}>
            <p className="text-xl font-bold" style={{ color: '#3b82f6' }}>{stats.completed}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Completed</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search sessions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg input-themed"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-lg select-themed"
            >
              <option value="all">All Status</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            {(searchTerm || statusFilter !== 'all') && (
              <Button 
                variant="ghost" 
                className="flex items-center gap-2"
                onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
              >
                <X size={16} />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Sessions Grid */}
        {filteredSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSessions.map((session) => (
              <SessionCard 
                key={session.id} 
                session={session} 
                onMarkAttendance={handleMarkAttendance}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 card-base">
            <Calendar size={48} className="mx-auto mb-4 opacity-50" style={{ color: 'var(--text-muted)' }} />
            <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              {searchTerm || statusFilter !== 'all' 
                ? 'No sessions match your filters' 
                : 'No sessions assigned to you yet'}
            </h3>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Sessions will appear here once assigned by an admin'}
            </p>
          </div>
        )}
      </div>

      {/* Attendance Modal */}
      <AttendanceModal />
    </>
  );
}