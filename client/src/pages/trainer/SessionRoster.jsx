
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Calendar, 
  Clock,
  ArrowLeft,
  Search,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  Mail,
  Phone
} from 'lucide-react';
import { format } from 'date-fns';

import { useSession } from '@/hooks';
import { useMarkAttendance } from '@/hooks';
import Spinner from '@/components/ui/Spinner';
import { Button } from '@/components/ui/button';
import { getSafeDate, safeFormatDate } from '@/utils/date';

function RosterItem({ enrolment, onMarkAttendance, isUpdating }) {
  const [showActions, setShowActions] = useState(false);
  
  const statusColors = {
    ACTIVE: 'var(--color-forest-green)',
    CANCELLED: 'var(--error-text)',
    COMPLETED: 'var(--text-muted)',
    ATTENDED: '#3b82f6',
  };

  const statusLabels = {
    ACTIVE: 'Active',
    CANCELLED: 'Cancelled',
    COMPLETED: 'Completed',
    ATTENDED: 'Attended',
  };

  return (
    <motion.div
      whileHover={{ x: 4 }}
      className="flex items-center justify-between p-4 rounded-lg transition-all"
      style={{ background: 'var(--bg-surface)' }}
    >
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
          style={{ background: 'var(--color-forest-green)', color: 'white' }}
        >
          {enrolment.user?.name?.charAt(0) || 'U'}
        </div>
        <div className="min-w-0">
          <p className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>
            {enrolment.user?.name || 'Unknown User'}
          </p>
          <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span className="flex items-center gap-1">
              <Mail size={12} />
              {enrolment.user?.email || 'No email'}
            </span>
            <span
              className="px-2 py-0.5 rounded-full text-xs font-medium"
              style={{
                background: statusColors[enrolment.status] 
                  ? `${statusColors[enrolment.status]}20` 
                  : 'rgba(107,114,128,0.1)',
                color: statusColors[enrolment.status] || 'var(--text-muted)'
              }}
            >
              {statusLabels[enrolment.status] || enrolment.status}
            </span>
          </div>
        </div>
      </div>
      
      {enrolment.status === 'ACTIVE' && (
        <div className="flex gap-2">
          <button
            onClick={() => onMarkAttendance(enrolment.id, 'ATTENDED')}
            disabled={isUpdating}
            className="p-2 rounded-lg transition-colors hover:bg-green-100"
            style={{ color: 'var(--color-forest-green)' }}
          >
            <UserCheck size={18} />
          </button>
          <button
            onClick={() => onMarkAttendance(enrolment.id, 'CANCELLED')}
            disabled={isUpdating}
            className="p-2 rounded-lg transition-colors hover:bg-red-100"
            style={{ color: 'var(--error-text)' }}
          >
            <UserX size={18} />
          </button>
        </div>
      )}
      
      {enrolment.status === 'ATTENDED' && (
        <span className="flex items-center gap-1 text-sm" style={{ color: '#3b82f6' }}>
          <CheckCircle size={16} />
          Present
        </span>
      )}
    </motion.div>
  );
}

export default function SessionRoster() {
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data, isLoading, error } = useSession(id);
  const { mutate: markAttendance, isPending: isUpdating } = useMarkAttendance();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-page)' }}>
        <Spinner />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-page)' }}>
        <div className="text-center max-w-md">
          <AlertCircle size={48} className="mx-auto mb-4" style={{ color: 'var(--error-text)' }} />
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Session not found
          </h3>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
            The session you're looking for doesn't exist or you don't have access.
          </p>
          <Link to="/trainer/sessions" className="btn-primary inline-block">
            <ArrowLeft size={16} className="inline mr-2" />
            Back to Sessions
          </Link>
        </div>
      </div>
    );
  }

  const session = data.data || data;
  const enrolments = session.enrolments || [];
  
  const filteredEnrolments = enrolments.filter(e => 
    e.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const attendanceStats = {
    total: enrolments.length,
    attended: enrolments.filter(e => e.status === 'ATTENDED').length,
    active: enrolments.filter(e => e.status === 'ACTIVE').length,
  };

  const handleMarkAttendance = (enrolmentId, status) => {
    markAttendance({ enrolmentId, status });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:px-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/trainer/sessions"
          className="p-2 rounded-lg transition-colors hover:bg-card-hover"
        >
          <ArrowLeft size={20} style={{ color: 'var(--text-secondary)' }} />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {session.title}
          </h1>
          <div className="flex flex-wrap gap-4 mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
            {session.date && (
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {safeFormatDate(session.date, 'PPP')}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {session.durationMins} min
            </span>
            <span className="flex items-center gap-1">
              <Users size={14} />
              {attendanceStats.total} enrolled
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card-base p-4 text-center">
          <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {attendanceStats.total}
          </p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Total Enrolled</p>
        </div>
        <div className="card-base p-4 text-center">
          <p className="text-2xl font-bold" style={{ color: '#3b82f6' }}>
            {attendanceStats.attended}
          </p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Attended</p>
        </div>
        <div className="card-base p-4 text-center">
          <p className="text-2xl font-bold" style={{ color: 'var(--color-forest-green)' }}>
            {attendanceStats.active}
          </p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Active</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
        <input
          type="text"
          placeholder="Search participants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg input-themed"
        />
      </div>

      {/* Roster */}
      {filteredEnrolments.length > 0 ? (
        <div className="space-y-2">
          {filteredEnrolments.map((enrolment) => (
            <RosterItem
              key={enrolment.id}
              enrolment={enrolment}
              onMarkAttendance={handleMarkAttendance}
              isUpdating={isUpdating}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 card-base">
          <Users size={48} className="mx-auto mb-4 opacity-50" style={{ color: 'var(--text-muted)' }} />
          <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            No participants found
          </h3>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {searchTerm ? 'Try adjusting your search' : 'No one has enrolled yet'}
          </p>
        </div>
      )}
    </div>
  );
}