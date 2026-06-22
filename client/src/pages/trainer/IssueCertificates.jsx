
import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Award, 
  Users, 
  CheckCircle, 
  XCircle,
  ArrowLeft,
  AlertCircle,
  Loader2,
  UserCheck,
  Calendar,
  Clock
} from 'lucide-react';

import { useSession, useIssueCertificate, useBatchIssueCertificates } from '@/hooks';
import Spinner from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { safeFormatDate } from '@/utils/date';
import { toast } from '@/stores/toastStore';

function ParticipantItem({ enrolment, onIssue, isIssuing, isIssued }) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      className="flex items-center justify-between p-4 rounded-lg transition-all"
      style={{ background: 'var(--bg-surface)' }}
    >
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
          style={{ background: 'var(--color-forest-green)', color: 'white' }}
        >
          {enrolment.user?.name?.charAt(0) || 'U'}
        </div>
        <div>
          <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
            {enrolment.user?.name || 'Unknown User'}
          </p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {enrolment.user?.email || 'No email'}
          </p>
        </div>
      </div>
      {isIssued ? (
        <span className="flex items-center gap-1 text-sm text-green-600">
          <CheckCircle size={16} />
          Issued
        </span>
      ) : (
        <Button
          onClick={() => onIssue(enrolment.userId, enrolment.sessionId)}
          disabled={isIssuing || enrolment.status !== 'ATTENDED'}
          className="btn-primary flex items-center gap-2"
        >
          {isIssuing ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Issuing...
            </>
          ) : (
            <>
              <Award size={16} />
              Issue Certificate
            </>
          )}
        </Button>
      )}
    </motion.div>
  );
}

export default function IssueCertificates() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issuedUserIds, setIssuedUserIds] = useState([]);
  
  const { data, isLoading, error } = useSession(id);
  const { mutate: issueCertificate, isPending: isIssuing } = useIssueCertificate();
  const { mutate: batchIssue, isPending: isBatchIssuing } = useBatchIssueCertificates();

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
  const attendedEnrolments = enrolments.filter(e => e.status === 'ATTENDED');

  const handleIssueCertificate = (userId, sessionId) => {
    issueCertificate({ userId, sessionId }, {
      onSuccess: () => {
        setIssuedUserIds(prev => [...prev, userId]);
        toast.success('Certificate issued successfully');
      },
      onError: (error) => {
        toast.error(error?.message || 'Failed to issue certificate');
      }
    });
  };

  const handleBatchIssue = () => {
    batchIssue(id, {
      onSuccess: () => {
        const userIds = attendedEnrolments.map(e => e.userId);
        setIssuedUserIds(userIds);
        toast.success('Certificates issued successfully');
      },
      onError: (error) => {
        toast.error(error?.message || 'Failed to issue certificates');
      }
    });
  };

  const allIssued = attendedEnrolments.every(e => issuedUserIds.includes(e.userId));

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
              Issue Certificates
            </h1>
            <div className="flex gap-4 mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
              <span>{session.title}</span>
              {session.date && (
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {safeFormatDate(session.date, 'PPP')}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Users size={14} />
                {attendedEnrolments.length} eligible
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => navigate('/trainer/certificates')}
            variant="outline"
          >
            Manage Certificates
          </Button>
          <Button
            onClick={handleBatchIssue}
            disabled={isBatchIssuing || attendedEnrolments.length === 0 || allIssued}
            className="btn-primary flex items-center gap-2"
          >
            {isBatchIssuing ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Issuing...
              </>
            ) : (
              <>
                <Users size={16} />
                Issue All ({attendedEnrolments.length})
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="card-base p-4 mb-6">
        <div className="flex flex-wrap gap-6 text-sm">
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Attended:</span>
            <span className="ml-2 font-bold" style={{ color: 'var(--text-primary)' }}>
              {attendedEnrolments.length}
            </span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Issued:</span>
            <span className="ml-2 font-bold text-green-600">
              {issuedUserIds.length}
            </span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Pending:</span>
            <span className="ml-2 font-bold" style={{ color: 'var(--text-primary)' }}>
              {attendedEnrolments.length - issuedUserIds.length}
            </span>
          </div>
        </div>
      </div>

      {/* Participants List */}
      {attendedEnrolments.length > 0 ? (
        <div className="space-y-2">
          {attendedEnrolments.map((enrolment) => (
            <ParticipantItem
              key={enrolment.id}
              enrolment={enrolment}
              onIssue={handleIssueCertificate}
              isIssuing={isIssuing}
              isIssued={issuedUserIds.includes(enrolment.userId)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 card-base">
          <UserCheck size={48} className="mx-auto mb-4 opacity-50" style={{ color: 'var(--text-muted)' }} />
          <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            No eligible participants
          </h3>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Participants must have attended the session to receive a certificate.
          </p>
        </div>
      )}
    </div>
  );
}