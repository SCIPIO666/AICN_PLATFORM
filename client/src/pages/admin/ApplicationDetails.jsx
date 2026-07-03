
import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Briefcase,
  Award,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  FileText,
  MessageSquare
} from 'lucide-react';

import { useTrainerApplications, useApproveTrainer, useRejectTrainer } from '@/hooks';
import Spinner from '@/components/ui/Spinner';
import { Button } from '@/components/ui/button';
import { safeFormatDate, safeFormatRelative } from '@/utils/date';
import { toast } from '@/stores/toastStore';

export default function ApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  
  const { data, isLoading, error, refetch } = useTrainerApplications();
  const { mutate: approveTrainer } = useApproveTrainer();
  const { mutate: rejectTrainer } = useRejectTrainer();

  // Find the specific application
  const application = data?.data?.find(a => a.id === id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-page)' }}>
        <Spinner />
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-page)' }}>
        <div className="text-center max-w-md">
          <AlertCircle size={48} className="mx-auto mb-4" style={{ color: 'var(--error-text)' }} />
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Application not found
          </h3>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
            The application you're looking for doesn't exist.
          </p>
          <Link to="/admin/applications" className="btn-primary inline-block">
            <ArrowLeft size={16} className="inline mr-2" />
            Back to Applications
          </Link>
        </div>
      </div>
    );
  }

  const handleApprove = () => {
    setProcessing(true);
    const message = prompt('Optional approval message:');
    
    approveTrainer(
      { applicationId: application.id, message: message || undefined },
      {
        onSuccess: () => {
          toast.success('Trainer application approved');
          refetch();
          setProcessing(false);
        },
        onError: (error) => {
          toast.error(error?.message || 'Failed to approve application');
          setProcessing(false);
        }
      }
    );
  };

  const handleReject = () => {
    setProcessing(true);
    const reason = prompt('Reason for rejection:');
    
    rejectTrainer(
      { applicationId: application.id, reason: reason || 'Application did not meet requirements' },
      {
        onSuccess: () => {
          toast.success('Trainer application rejected');
          refetch();
          setProcessing(false);
        },
        onError: (error) => {
          toast.error(error?.message || 'Failed to reject application');
          setProcessing(false);
        }
      }
    );
  };

  const statusColors = {
    PENDING: { bg: 'rgba(251, 191, 36, 0.1)', color: '#d97706', label: 'Pending Review' },
    APPROVED: { bg: 'rgba(22, 101, 52, 0.1)', color: 'var(--color-forest-green)', label: 'Approved' },
    REJECTED: { bg: 'rgba(220, 38, 38, 0.1)', color: '#dc2626', label: 'Rejected' },
  };

  const statusInfo = statusColors[application.status] || statusColors.PENDING;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:px-8">
      {/* Back Button */}
      <Link
        to="/admin/applications"
        className="inline-flex items-center gap-2 text-sm mb-6 transition-colors hover:opacity-80"
        style={{ color: 'var(--text-secondary)' }}
      >
        <ArrowLeft size={16} />
        Back to Applications
      </Link>

      {/* Application Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-base p-6 md:p-8"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0"
              style={{ background: 'var(--color-forest-green)', color: 'white' }}
            >
              {application.user?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {application.user?.name || 'Unknown Applicant'}
              </h1>
              <p className="text-sm flex items-center gap-1 mt-1" style={{ color: 'var(--text-secondary)' }}>
                <Mail size={14} />
                {application.user?.email || 'No email'}
              </p>
              <p className="text-xs mt-1 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                <Calendar size={12} />
                Applied {safeFormatRelative(application.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span
              className="px-3 py-1 rounded-full text-sm font-medium"
              style={{
                background: statusInfo.bg,
                color: statusInfo.color
              }}
            >
              {statusInfo.label}
            </span>
            {application.status === 'PENDING' && (
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleApprove}
                  disabled={processing}
                  className="btn-primary px-4 py-2 text-sm flex items-center gap-2"
                >
                  {processing ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <CheckCircle size={16} />
                  )}
                  Approve
                </button>
                <button
                  onClick={handleReject}
                  disabled={processing}
                  className="btn-danger px-4 py-2 text-sm flex items-center gap-2"
                >
                  {processing ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <XCircle size={16} />
                  )}
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 space-y-6">
          {/* Application Details */}
          <div>
            <h3 className="text-sm font-semibold flex items-center gap-2 mb-3" style={{ color: 'var(--text-primary)' }}>
              <FileText size={16} style={{ color: 'var(--color-forest-green)' }} />
              Application Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Skill Area</p>
                <p className="font-medium mt-1" style={{ color: 'var(--text-primary)' }}>
                  {application.skillArea || 'N/A'}
                </p>
              </div>
              <div className="p-4 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Experience</p>
                <p className="font-medium mt-1" style={{ color: 'var(--text-primary)' }}>
                  {application.experience || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Bio */}
          {application.bio && (
            <div>
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-2" style={{ color: 'var(--text-primary)' }}>
                <MessageSquare size={16} style={{ color: 'var(--color-forest-green)' }} />
                Bio
              </h3>
              <div className="p-4 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {application.bio}
                </p>
              </div>
            </div>
          )}

          {/* Skills */}
          {application.skills?.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-2" style={{ color: 'var(--text-primary)' }}>
                <Award size={16} style={{ color: 'var(--color-forest-green)' }} />
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {application.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: 'rgba(22, 101, 52, 0.1)',
                      color: 'var(--color-forest-green)'
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          {application.documents?.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-2" style={{ color: 'var(--text-primary)' }}>
                <Briefcase size={16} style={{ color: 'var(--color-forest-green)' }} />
                Documents
              </h3>
              <div className="space-y-2">
                {application.documents.map((doc) => (
                  <a
                    key={doc.id}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 rounded-lg transition-colors hover:bg-card-hover"
                    style={{ background: 'var(--bg-surface)' }}
                  >
                    <FileText size={16} style={{ color: 'var(--color-forest-green)' }} />
                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{doc.name}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
              <span>Created: {safeFormatDate(application.createdAt, 'PPP')}</span>
              {application.updatedAt && (
                <span>Updated: {safeFormatDate(application.updatedAt, 'PPP')}</span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}