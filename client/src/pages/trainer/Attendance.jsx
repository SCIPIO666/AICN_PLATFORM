
import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
  RefreshCw,
  Loader2,
  ChevronLeft
} from 'lucide-react';

import { useSession, useMarkAttendance } from '@/hooks';
import Spinner from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { getSafeDate, safeFormatDate } from '@/utils/date';
import { toast } from '@/stores/toastStore';

function ParticipantItem({ enrolment, onMarkAttendance, isUpdating }) {
  const [isMarking, setIsMarking] = useState(false);

  const handleMark = async (status) => {
    setIsMarking(true);
    try {
      await onMarkAttendance(enrolment.id, status);
    } finally {
      setIsMarking(false);
    }
  };

  const statusColors = {
    ACTIVE: 'var(--color-forest-green)',
    CANCELLED: 'var(--error-text)',
    COMPLETED: 'var(--text-muted)',
    ATTENDED: '#3b82f6',
  };

  const statusLabels = {
    ACTIVE: 'Active',
    CANCELLED: 'Absent',
    COMPLETED: 'Completed',
    ATTENDED: 'Present',
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
          <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
            {enrolment.user?.email || 'No email'}
          </p>
          <span
            className="inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1"
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
      
      {enrolment.status === 'ACTIVE' && (
        <div className="flex gap-2">
          <button
            onClick={() => handleMark('ATTENDED')}
            disabled={isMarking || isUpdating}
            className="p-2 rounded-lg transition-colors hover:bg-green-100"
            style={{ color: 'var(--color-forest-green)' }}
            title="Mark Present"
          >
            {isMarking ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <CheckCircle size={18} />
            )}
          </button>
          <button
            onClick={() => handleMark('CANCELLED')}
            disabled={isMarking || isUpdating}
            className="p-2 rounded-lg transition-colors hover:bg-red-100"
            style={{ color: 'var(--error-text)' }}
            title="Mark Absent"
          >
            {isMarking ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <XCircle size={18} />
            )}
          </button>
        </div>
      )}
      
      {enrolment.status === 'ATTENDED' && (
        <span className="flex items-center gap-1 text-sm font-medium" style={{ color: '#3b82f6' }}>
          <CheckCircle size={16} />
          Present
        </span>
      )}
      
      {enrolment.status === 'CANCELLED' && (
        <span className="flex items-center gap-1 text-sm font-medium" style={{ color: 'var(--error-text)' }}>
          <XCircle size={16} />
          Absent
        </span>
      )}
    </motion.div>
  );
}

export default function Attendance() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { data, isLoading, error, refetch } = useSession(id);
  const { mutate: markAttendance, isPending: isUpdating } = useMarkAttendance();

  const handleMarkAttendance = async (enrolmentId, status) => {
    return new Promise((resolve, reject) => {
      markAttendance(
        { enrolmentId, status },
        {
          onSuccess: () => {
            toast.success('Attendance marked successfully');
            refetch();
            resolve();
          },
          onError: (error) => {
            toast.error(error?.response?.data?.message || 'Failed to mark attendance');
            reject(error);
          }
        }
      );
    });
  };

  const handleMarkAllPresent = async () => {
    if (!session) return;
    
    const activeEnrolments = session.enrolments?.filter(e => e.status === 'ACTIVE') || [];
    if (activeEnrolments.length === 0) {
      toast.info('No active participants to mark present');
      return;
    }

    const confirmed = window.confirm(
      `Mark all ${activeEnrolments.length} participants as present?`
    );
    
    if (!confirmed) return;

    for (const enrolment of activeEnrolments) {
      try {
        await handleMarkAttendance(enrolment.id, 'ATTENDED');
        // Small delay to prevent rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error('Failed to mark attendance for:', enrolment.id);
      }
    }
    
    toast.success('All participants marked present');
    await refetch();
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

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
          <Link to="/dashboard" className="btn-primary inline-block">
            <ArrowLeft size={16} className="inline mr-2" />
            Back to Dashboard
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
    absent: enrolments.filter(e => e.status === 'CANCELLED').length,
  };

  const sessionDate = getSafeDate(session.date);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:px-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/trainer/sessions"
          className="p-2 rounded-lg transition-colors hover:bg-card-hover"
        >
          <ChevronLeft size={20} style={{ color: 'var(--text-secondary)' }} />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                Mark Attendance
              </h1>
              <p className="text-sm truncate mt-1" style={{ color: 'var(--text-secondary)' }}>
                {session.title}
              </p>
              {sessionDate && (
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  <Calendar size={12} className="inline mr-1" />
                  {safeFormatDate(sessionDate, 'PPP')}
                  <Clock size={12} className="inline ml-2 mr-1" />
                  {safeFormatDate(sessionDate, 'h:mm a')}
                </p>
              )}
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-lg hover:bg-card-hover transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="card-base p-4 text-center">
          <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {attendanceStats.total}
          </p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Total</p>
        </div>
        <div className="card-base p-4 text-center">
          <p className="text-2xl font-bold" style={{ color: '#3b82f6' }}>
            {attendanceStats.active}
          </p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Active</p>
        </div>
        <div className="card-base p-4 text-center">
          <p className="text-2xl font-bold" style={{ color: 'var(--color-forest-green)' }}>
            {attendanceStats.attended}
          </p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Present</p>
        </div>
        <div className="card-base p-4 text-center">
          <p className="text-2xl font-bold" style={{ color: 'var(--error-text)' }}>
            {attendanceStats.absent}
          </p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Absent</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search participants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg input-themed"
          />
        </div>
        <Button
          onClick={handleMarkAllPresent}
          disabled={isUpdating || attendanceStats.active === 0}
          className="btn-primary flex items-center gap-2 whitespace-nowrap"
        >
          <UserCheck size={16} />
          Mark All Present ({attendanceStats.active})
        </Button>
        <Link
          to={`/trainer/sessions/${id}`}
          className="btn-secondary flex items-center gap-2 whitespace-nowrap px-4 py-2"
        >
          <ArrowLeft size={16} />
          Session Details
        </Link>
      </div>

      {/* Participants List */}
      {filteredEnrolments.length > 0 ? (
        <div className="space-y-2">
          {filteredEnrolments.map((enrolment) => (
            <ParticipantItem
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
            {searchTerm ? 'Try adjusting your search' : 'No one has enrolled in this session yet'}
          </p>
          {searchTerm && (
            <Button 
              variant="ghost" 
              className="mt-4 flex items-center gap-2 mx-auto"
              onClick={() => setSearchTerm('')}
            >
              <X size={16} />
              Clear Search
            </Button>
          )}
        </div>
      )}
    </div>
  );
}