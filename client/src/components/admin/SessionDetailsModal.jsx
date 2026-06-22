
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Users, MapPin, Monitor, User, Award, XCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useAdminModalStore } from '@/stores/useAdminModalStore';
import { useCancelSession } from '@/hooks';
import { getSafeDate, safeFormatDate, safeFormatTime } from '@/utils/date';
import { toast } from '@/stores/toastStore';

export default function SessionDetailsModal() {
  const { isSessionDetailsOpen, selectedSession, closeSessionDetails } = useAdminModalStore();
  const [isCancelling, setIsCancelling] = useState(false);
  const { mutate: cancelSession } = useCancelSession();

  if (!isSessionDetailsOpen || !selectedSession) return null;

  const sessionDate = getSafeDate(selectedSession.date);

  const statusColors = {
    SCHEDULED: { bg: 'rgba(22,101,52,0.1)', color: 'var(--color-forest-green)', label: 'Scheduled' },
    ONGOING: { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6', label: 'Ongoing' },
    COMPLETED: { bg: 'rgba(107,114,128,0.1)', color: 'var(--text-muted)', label: 'Completed' },
    CANCELLED: { bg: 'rgba(220,38,38,0.1)', color: '#dc2626', label: 'Cancelled' },
  };

  const statusInfo = statusColors[selectedSession.status] || statusColors.SCHEDULED;

  const handleCancel = () => {
    const confirmed = window.confirm(`Cancel session "${selectedSession.title}"? This cannot be undone.`);
    if (!confirmed) return;
    
    setIsCancelling(true);
    cancelSession(selectedSession.id, {
      onSuccess: () => {
        toast.success('Session cancelled');
        closeSessionDetails();
      },
      onError: (error) => toast.error(error?.message || 'Failed to cancel'),
      onSettled: () => setIsCancelling(false)
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4"
        onClick={closeSessionDetails}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="card-base shadow-elevated max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between p-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                {selectedSession.title}
              </h2>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ background: statusInfo.bg, color: statusInfo.color }}>
                  {statusInfo.label}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium" style={{
                  background: selectedSession.locationType === 'ONLINE' ? 'rgba(59,130,246,0.1)' : 'rgba(139,92,246,0.1)',
                  color: selectedSession.locationType === 'ONLINE' ? '#3b82f6' : '#8b5cf6'
                }}>
                  {selectedSession.locationType === 'ONLINE' ? 'Online' : 'Physical'}
                </span>
              </div>
            </div>
            {selectedSession.status === 'SCHEDULED' && (
              <button onClick={handleCancel} disabled={isCancelling} className="btn-danger px-3 py-1.5 text-sm flex items-center gap-1">
                {isCancelling ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                Cancel
              </button>
            )}
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sessionDate && (
                <div className="p-3 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Date & Time</p>
                  <p className="font-medium flex items-center gap-2 mt-1" style={{ color: 'var(--text-primary)' }}>
                    <Calendar size={14} />
                    {safeFormatDate(sessionDate, 'PPP')} at {safeFormatTime(sessionDate)}
                  </p>
                </div>
              )}
              <div className="p-3 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Duration</p>
                <p className="font-medium flex items-center gap-2 mt-1" style={{ color: 'var(--text-primary)' }}>
                  <Clock size={14} />
                  {selectedSession.durationMins} minutes
                </p>
              </div>
              <div className="p-3 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Capacity</p>
                <p className="font-medium flex items-center gap-2 mt-1" style={{ color: 'var(--text-primary)' }}>
                  <Users size={14} />
                  {selectedSession._count?.enrolments || 0} / {selectedSession.capacity}
                </p>
              </div>
              {selectedSession.skillArea && (
                <div className="p-3 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Skill Area</p>
                  <p className="font-medium mt-1" style={{ color: 'var(--text-primary)' }}>{selectedSession.skillArea}</p>
                </div>
              )}
            </div>

            {selectedSession.description && (
              <div>
                <h3 className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Description</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{selectedSession.description}</p>
              </div>
            )}

            {selectedSession.trainer && (
              <div>
                <h3 className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Trainer</h3>
                <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: 'var(--color-forest-green)', color: 'white' }}>
                    {selectedSession.trainer.name?.charAt(0) || 'T'}
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{selectedSession.trainer.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{selectedSession.trainer.email}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end p-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <button onClick={closeSessionDetails} className="btn-secondary px-6 py-2">Close</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}