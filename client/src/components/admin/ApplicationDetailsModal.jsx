
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Calendar, Briefcase, Award, FileText, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useAdminModalStore } from '@/stores/useAdminModalStore';
import { useApproveTrainer, useRejectTrainer } from '@/hooks';
import { safeFormatDate, safeFormatRelative } from '@/utils/date';
import { toast } from '@/stores/toastStore';

export default function ApplicationDetailsModal() {
  const { isApplicationDetailsOpen, selectedApplication, closeApplicationDetails } = useAdminModalStore();
  const [processing, setProcessing] = useState(false);
  const { mutate: approveTrainer } = useApproveTrainer();
  const { mutate: rejectTrainer } = useRejectTrainer();

  if (!isApplicationDetailsOpen || !selectedApplication) return null;

  const statusColors = {
    PENDING: { bg: 'rgba(251, 191, 36, 0.1)', color: '#d97706', label: 'Pending Review' },
    APPROVED: { bg: 'rgba(22, 101, 52, 0.1)', color: 'var(--color-forest-green)', label: 'Approved' },
    REJECTED: { bg: 'rgba(220, 38, 38, 0.1)', color: '#dc2626', label: 'Rejected' },
  };

  const statusInfo = statusColors[selectedApplication.status] || statusColors.PENDING;

  const handleApprove = () => {
    setProcessing(true);
    const message = prompt('Optional approval message:');
    approveTrainer(
      { applicationId: selectedApplication.id, message: message || undefined },
      {
        onSuccess: () => {
          toast.success('Application approved');
          closeApplicationDetails();
        },
        onError: (error) => toast.error(error?.message || 'Failed to approve'),
        onSettled: () => setProcessing(false)
      }
    );
  };

  const handleReject = () => {
    setProcessing(true);
    const reason = prompt('Reason for rejection:');
    rejectTrainer(
      { applicationId: selectedApplication.id, reason: reason || 'Did not meet requirements' },
      {
        onSuccess: () => {
          toast.success('Application rejected');
          closeApplicationDetails();
        },
        onError: (error) => toast.error(error?.message || 'Failed to reject'),
        onSettled: () => setProcessing(false)
      }
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4"
        onClick={closeApplicationDetails}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="card-base shadow-elevated max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between p-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0"
                style={{ background: 'var(--color-forest-green)', color: 'white' }}
              >
                {selectedApplication.user?.name?.charAt(0) || 'A'}
              </div>
              <div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {selectedApplication.user?.name || 'Unknown'}
                </h2>
                <p className="text-sm flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                  <Mail size={14} />
                  {selectedApplication.user?.email || 'No email'}
                </p>
                <p className="text-xs flex items-center gap-1 mt-1" style={{ color: 'var(--text-muted)' }}>
                  <Calendar size={12} />
                  Applied {safeFormatRelative(selectedApplication.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ background: statusInfo.bg, color: statusInfo.color }}>
                {statusInfo.label}
              </span>
              {selectedApplication.status === 'PENDING' && (
                <div className="flex gap-2">
                  <button onClick={handleApprove} disabled={processing} className="btn-primary px-3 py-1.5 text-sm flex items-center gap-1">
                    {processing ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                    Approve
                  </button>
                  <button onClick={handleReject} disabled={processing} className="btn-danger px-3 py-1.5 text-sm flex items-center gap-1">
                    {processing ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Skill Area</p>
                <p className="font-medium mt-1" style={{ color: 'var(--text-primary)' }}>{selectedApplication.skillArea || 'N/A'}</p>
              </div>
              <div className="p-4 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Experience</p>
                <p className="font-medium mt-1" style={{ color: 'var(--text-primary)' }}>{selectedApplication.experience || 'N/A'}</p>
              </div>
            </div>

            {selectedApplication.bio && (
              <div>
                <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Bio</h3>
                <div className="p-4 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{selectedApplication.bio}</p>
                </div>
              </div>
            )}

            {selectedApplication.skills?.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedApplication.skills.map((skill) => (
                    <span key={skill} className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(22,101,52,0.1)', color: 'var(--color-forest-green)' }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <div className="flex justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
                <span>Created: {safeFormatDate(selectedApplication.createdAt, 'PPP')}</span>
                {selectedApplication.updatedAt && <span>Updated: {safeFormatDate(selectedApplication.updatedAt, 'PPP')}</span>}
              </div>
            </div>
          </div>

          <div className="flex justify-end p-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <button onClick={closeApplicationDetails} className="btn-secondary px-6 py-2">Close</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}