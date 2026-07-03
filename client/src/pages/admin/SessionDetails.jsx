
import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Monitor,
  ArrowLeft,
  User,
  Award,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';

import { useSession, useCancelSession } from '@/hooks';
import Spinner from '@/components/ui/Spinner';
import { Button } from '@/components/ui/button';
import { getSafeDate, safeFormatDate, safeFormatTime } from '@/utils/date';
import { toast } from '@/stores/toastStore';

export default function SessionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isCancelling, setIsCancelling] = useState(false);
  
  const { data, isLoading, error, refetch } = useSession(id);
  const { mutate: cancelSession } = useCancelSession();

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
          <Link to="/admin/sessions" className="btn-primary inline-block">
            <ArrowLeft size={16} className="inline mr-2" />
            Back to Sessions
          </Link>
        </div>
      </div>
    );
  }

  const session = data.data || data;
  const sessionDate = getSafeDate(session.date);

  const handleCancel = () => {
    const confirmed = window.confirm(
      `Cancel session "${session.title}"? This action cannot be undone.`
    );
    if (!confirmed) return;
    
    setIsCancelling(true);
    cancelSession(session.id, {
      onSuccess: () => {
        toast.success('Session cancelled');
        refetch();
        setIsCancelling(false);
      },
      onError: (error) => {
        toast.error(error?.message || 'Failed to cancel session');
        setIsCancelling(false);
      }
    });
  };

  const statusColors = {
    SCHEDULED: { bg: 'rgba(22, 101, 52, 0.1)', color: 'var(--color-forest-green)', label: 'Scheduled' },
    ONGOING: { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', label: 'Ongoing' },
    COMPLETED: { bg: 'rgba(107, 114, 128, 0.1)', color: 'var(--text-muted)', label: 'Completed' },
    CANCELLED: { bg: 'rgba(220, 38, 38, 0.1)', color: '#dc2626', label: 'Cancelled' },
  };

  const statusInfo = statusColors[session.status] || statusColors.SCHEDULED;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:px-8">
      {/* Back Button */}
      <Link
        to="/admin/sessions"
        className="inline-flex items-center gap-2 text-sm mb-6 transition-colors hover:opacity-80"
        style={{ color: 'var(--text-secondary)' }}
      >
        <ArrowLeft size={16} />
        Back to Sessions
      </Link>

      {/* Session Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-base p-6 md:p-8"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold truncate" style={{ color: 'var(--text-primary)' }}>
              {session.title}
            </h1>
            <div className="flex flex-wrap gap-2 mt-2">
              <span
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{
                  background: statusInfo.bg,
                  color: statusInfo.color
                }}
              >
                {statusInfo.label}
              </span>
              <span
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{
                  background: session.locationType === 'ONLINE' 
                    ? 'rgba(59, 130, 246, 0.1)' 
                    : 'rgba(139, 92, 246, 0.1)',
                  color: session.locationType === 'ONLINE' ? '#3b82f6' : '#8b5cf6'
                }}
              >
                {session.locationType === 'ONLINE' ? 'Online' : 'Physical'}
              </span>
            </div>
          </div>
          {session.status === 'SCHEDULED' && (
            <button
              onClick={handleCancel}
              disabled={isCancelling}
              className="btn-danger px-4 py-2 text-sm flex items-center gap-2"
            >
              {isCancelling ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <XCircle size={16} />
              )}
              Cancel Session
            </button>
          )}
        </div>

        <div className="mt-6 space-y-6">
          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sessionDate && (
              <div className="p-4 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Date & Time</p>
                <p className="font-medium mt-1 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <Calendar size={16} />
                  {safeFormatDate(sessionDate, 'PPP')} at {safeFormatTime(sessionDate)}
                </p>
              </div>
            )}
            <div className="p-4 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Duration</p>
              <p className="font-medium mt-1 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <Clock size={16} />
                {session.durationMins} minutes
              </p>
            </div>
            <div className="p-4 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Capacity</p>
              <p className="font-medium mt-1 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <Users size={16} />
                {session._count?.enrolments || 0} / {session.capacity} enrolled
              </p>
            </div>
            {session.skillArea && (
              <div className="p-4 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Skill Area</p>
                <p className="font-medium mt-1" style={{ color: 'var(--text-primary)' }}>
                  {session.skillArea}
                </p>
              </div>
            )}
          </div>

          {/* Description */}
          {session.description && (
            <div>
              <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                Description
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {session.description}
              </p>
            </div>
          )}

          {/* Trainer */}
          {session.trainer && (
            <div>
              <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                Trainer
              </h3>
              <div className="flex items-center gap-3 p-4 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                  style={{ background: 'var(--color-forest-green)', color: 'white' }}
                >
                  {session.trainer.name?.charAt(0) || 'T'}
                </div>
                <div>
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    {session.trainer.name}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {session.trainer.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Location */}
          {session.locationType === 'PHYSICAL' && (session.county || session.venue) && (
            <div>
              <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                Location
              </h3>
              <div className="p-4 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
                {session.venue && <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{session.venue}</p>}
                {session.county && <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{session.county}</p>}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}