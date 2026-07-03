
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
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

import { useSession, useMarkAttendance } from '@/hooks';
import Spinner from '@/components/ui/Spinner';
import { Button } from '@/components/ui/button';
import { safeFormatDate } from '@/utils/date';

export default function SessionAttendance() {
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data, isLoading, error, refetch } = useSession(id);
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
            The session you're looking for doesn't exist.
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

  const handleMarkAllPresent = () => {
    const activeEnrolments = enrolments.filter(e => e.status === 'ACTIVE');
    activeEnrolments.forEach(e => {
      markAttendance({ enrolmentId: e.id, status: 'ATTENDED' });
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            to="/trainer/sessions"
            className="p-2 rounded-lg transition-colors hover:bg-card-hover"
          >
            <ArrowLeft size={20} style={{ color: 'var(--text-secondary)' }} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Take Attendance
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {session.title}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => refetch()}
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Refresh
          </Button>
          <Button 
            onClick={handleMarkAllPresent}
            disabled={isUpdating}
            className="btn-primary flex items-center gap-2"
          >
            <UserCheck size={16} />
            Mark All Present
          </Button>
        </div>
      </div>

      {/* Session Info */}
      <div className="card-base p-4 mb-6 flex flex-wrap gap-4 text-sm">
        <span className="flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
          <Calendar size={14} />
          {session.date ? safeFormatDate(session.date, 'PPP') : 'No date set'}
        </span>
        <span className="flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
          <Clock size={14} />
          {session.durationMins} min
        </span>
        <span className="flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
          <Users size={14} />
          {enrolments.length} enrolled
        </span>
      </div>

      {/* Attendance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {enrolments.map((enrolment) => (
          <motion.div
            key={enrolment.id}
            whileHover={{ y: -4 }}
            className="card-base p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                  {enrolment.user?.name || 'Unknown'}
                </p>
                <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                  {enrolment.user?.email || 'No email'}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      background: enrolment.status === 'ATTENDED' 
                        ? 'rgba(34, 197, 94, 0.1)' 
                        : enrolment.status === 'ACTIVE'
                        ? 'rgba(59, 130, 246, 0.1)'
                        : 'rgba(107, 114, 128, 0.1)',
                      color: enrolment.status === 'ATTENDED' 
                        ? '#22c55e' 
                        : enrolment.status === 'ACTIVE'
                        ? '#3b82f6'
                        : 'var(--text-muted)'
                    }}
                  >
                    {enrolment.status}
                  </span>
                </div>
              </div>
              {enrolment.status === 'ACTIVE' && (
                <div className="flex gap-1">
                  <button
                    onClick={() => markAttendance({ enrolmentId: enrolment.id, status: 'ATTENDED' })}
                    disabled={isUpdating}
                    className="p-1.5 rounded-lg transition-colors hover:bg-green-100"
                    style={{ color: 'var(--color-forest-green)' }}
                  >
                    <CheckCircle size={18} />
                  </button>
                  <button
                    onClick={() => markAttendance({ enrolmentId: enrolment.id, status: 'CANCELLED' })}
                    disabled={isUpdating}
                    className="p-1.5 rounded-lg transition-colors hover:bg-red-100"
                    style={{ color: 'var(--error-text)' }}
                  >
                    <XCircle size={18} />
                  </button>
                </div>
              )}
              {enrolment.status === 'ATTENDED' && (
                <span className="flex items-center gap-1 text-sm text-green-600">
                  <CheckCircle size={16} />
                  Present
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}