
import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  Clock,
  Search,
  Filter,
  X,
  RefreshCw
} from 'lucide-react';

import { useSession, useMyTrainerSessions, useIssueCertificate, useBatchIssueCertificates } from '@/hooks';
import Spinner from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { safeFormatDate, getSafeDate } from '@/utils/date';
import { toast } from '@/stores/toastStore';

function ParticipantItem({ enrolment, onIssue, isIssuing, isIssued, index }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ x: 4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex items-center justify-between p-4 rounded-lg transition-all"
      style={{ 
        background: isIssued ? 'rgba(22, 101, 52, 0.05)' : 'var(--bg-surface)',
        border: isIssued ? '1px solid rgba(22, 101, 52, 0.2)' : 'none'
      }}
    >
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
          style={{ 
            background: isIssued ? 'var(--color-forest-green)' : 'var(--color-forest-green)',
            color: 'white',
            opacity: isIssued ? 0.7 : 1
          }}
        >
          {enrolment.user?.name?.charAt(0) || 'U'}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium truncate" style={{ 
              color: isIssued ? 'var(--text-muted)' : 'var(--text-primary)',
              textDecoration: isIssued ? 'line-through' : 'none'
            }}>
              {enrolment.user?.name || 'Unknown User'}
            </p>
            {isIssued && (
              <span className="flex-shrink-0 flex items-center gap-1 text-xs text-green-600">
                <CheckCircle size={12} />
                Issued
              </span>
            )}
          </div>
          <p className="text-sm truncate" style={{ color: 'var(--text-muted)' }}>
            {enrolment.user?.email || 'No email'}
          </p>
          {enrolment.attendanceStatus && (
            <span className="text-xs px-2 py-0.5 rounded-full" style={{
              background: enrolment.attendanceStatus === 'PRESENT' 
                ? 'rgba(22, 101, 52, 0.1)' 
                : 'rgba(220, 38, 38, 0.1)',
              color: enrolment.attendanceStatus === 'PRESENT' 
                ? 'var(--color-forest-green)' 
                : 'var(--error-text)'
            }}>
              {enrolment.attendanceStatus}
            </span>
          )}
        </div>
      </div>
      
      {!isIssued ? (
        <Button
          onClick={() => onIssue(enrolment.userId, enrolment.sessionId)}
          disabled={isIssuing || enrolment.status !== 'ATTENDED'}
          className="btn-primary flex items-center gap-2 flex-shrink-0"
          size="sm"
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
      ) : (
        <Button
          variant="ghost"
          className="flex items-center gap-1 text-sm"
          style={{ color: 'var(--text-muted)' }}
          disabled
        >
          <CheckCircle size={16} style={{ color: 'var(--color-forest-green)' }} />
          Issued
        </Button>
      )}
    </motion.div>
  );
}

export default function IssueCertificates() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [issuedUserIds, setIssuedUserIds] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Fetch session with enrolments
  const { 
    data: sessionData, 
    isLoading: sessionLoading, 
    error: sessionError,
    refetch: refetchSession
  } = useSession(id);
  
  // Fetch trainer sessions for context
  const { refetch: refetchTrainerSessions } = useMyTrainerSessions();
  
  const { mutate: issueCertificate, isPending: isIssuing } = useIssueCertificate();
  const { mutate: batchIssue, isPending: isBatchIssuing } = useBatchIssueCertificates();

  // Extract session and enrolments
  const session = sessionData?.data || sessionData;
  const enrolments = session?.enrolments || [];
  
  // Filter eligible participants (ATTENDED status)
  const eligibleEnrolments = useMemo(() => {
    return enrolments.filter(e => e.status === 'ATTENDED' || e.status === 'COMPLETED');
  }, [enrolments]);

  // Filter by search
  const filteredEnrolments = useMemo(() => {
    if (!searchTerm) return eligibleEnrolments;
    
    return eligibleEnrolments.filter(e => 
      e.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [eligibleEnrolments, searchTerm]);

  // Check if all eligible have been issued
  const allIssued = eligibleEnrolments.length > 0 && 
    eligibleEnrolments.every(e => issuedUserIds.includes(e.userId));

  // Handle individual certificate issuance
  const handleIssueCertificate = (userId, sessionId) => {
    issueCertificate({ userId, sessionId }, {
      onSuccess: () => {
        setIssuedUserIds(prev => [...prev, userId]);
        toast.success('Certificate issued successfully');
        // Refetch to update UI
        refetchSession();
      },
      onError: (error) => {
        const message = error?.response?.data?.message || error?.message || 'Failed to issue certificate';
        toast.error(message);
      }
    });
  };

  // Handle batch issuance
  const handleBatchIssue = () => {
    const eligible = eligibleEnrolments.filter(e => !issuedUserIds.includes(e.userId));
    
    if (eligible.length === 0) {
      toast.info('All eligible participants already have certificates');
      return;
    }

    // Confirm batch issuance
    const confirmed = window.confirm(
      `Issue certificates to ${eligible.length} participant(s)?`
    );
    
    if (!confirmed) return;

    batchIssue(id, {
      onSuccess: () => {
        const userIds = eligible.map(e => e.userId);
        setIssuedUserIds(prev => [...prev, ...userIds]);
        toast.success(`${userIds.length} certificates issued successfully`);
        refetchSession();
        refetchTrainerSessions();
      },
      onError: (error) => {
        const message = error?.response?.data?.message || error?.message || 'Failed to issue certificates';
        toast.error(message);
      }
    });
  };

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetchSession();
    setIsRefreshing(false);
    toast.info('Session data refreshed');
  };

  // Clear search
  const clearSearch = () => setSearchTerm('');

  // Loading state
  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-page)' }}>
        <Spinner />
      </div>
    );
  }

  // Error state
  if (sessionError || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-page)' }}>
        <div className="text-center max-w-md">
          <AlertCircle size={48} className="mx-auto mb-4" style={{ color: 'var(--error-text)' }} />
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Session not found
          </h3>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
            {sessionError?.message || 'The session you\'re looking for doesn\'t exist or you don\'t have access.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => refetchSession()} variant="outline">
              <RefreshCw size={16} className="mr-2" />
              Retry
            </Button>
            <Link to="/trainer/sessions" className="btn-primary inline-flex items-center gap-2">
              <ArrowLeft size={16} />
              Back to Sessions
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get session date
  const sessionDate = getSafeDate(session.date);

  // Stats
  const stats = {
    total: enrolments.length,
    eligible: eligibleEnrolments.length,
    issued: issuedUserIds.length,
    pending: eligibleEnrolments.length - issuedUserIds.length,
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:px-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4 min-w-0">
          <Link
            to="/trainer/sessions"
            className="p-2 rounded-lg transition-colors hover:bg-card-hover flex-shrink-0"
          >
            <ArrowLeft size={20} style={{ color: 'var(--text-secondary)' }} />
          </Link>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold truncate" style={{ color: 'var(--text-primary)' }}>
              Issue Certificates
            </h1>
            <div className="flex flex-wrap gap-3 mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
              <span className="truncate">{session.title}</span>
              {sessionDate && (
                <span className="flex items-center gap-1 flex-shrink-0">
                  <Calendar size={14} />
                  {safeFormatDate(sessionDate, 'PPP')}
                </span>
              )}
              <span className="flex items-center gap-1 flex-shrink-0">
                <Users size={14} />
                {stats.eligible} eligible
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            Refresh
          </Button>
          <Button
            onClick={handleBatchIssue}
            disabled={isBatchIssuing || stats.eligible === 0 || allIssued}
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
                Issue All ({stats.pending})
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="card-base p-4 text-center">
          <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {stats.total}
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Total Enrolled</p>
        </div>
        <div className="card-base p-4 text-center" style={{ borderColor: 'var(--color-forest-green)' }}>
          <p className="text-2xl font-bold" style={{ color: 'var(--color-forest-green)' }}>
            {stats.eligible}
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Eligible</p>
        </div>
        <div className="card-base p-4 text-center" style={{ borderColor: '#3b82f6' }}>
          <p className="text-2xl font-bold" style={{ color: '#3b82f6' }}>
            {stats.issued}
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Issued</p>
        </div>
        <div className="card-base p-4 text-center" style={{ borderColor: stats.pending > 0 ? '#d97706' : 'var(--border-color)' }}>
          <p className="text-2xl font-bold" style={{ color: stats.pending > 0 ? '#d97706' : 'var(--text-muted)' }}>
            {stats.pending}
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Pending</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search participants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg input-themed"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-card-hover"
              style={{ color: 'var(--text-muted)' }}
            >
              <X size={14} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
          <span>
            Showing {filteredEnrolments.length} of {eligibleEnrolments.length} eligible
          </span>
        </div>
      </div>

      {/* Participants List */}
      {eligibleEnrolments.length > 0 ? (
        <div className="space-y-2">
          {filteredEnrolments.length > 0 ? (
            filteredEnrolments.map((enrolment, index) => (
              <ParticipantItem
                key={enrolment.id}
                enrolment={enrolment}
                onIssue={handleIssueCertificate}
                isIssuing={isIssuing}
                isIssued={issuedUserIds.includes(enrolment.userId)}
                index={index}
              />
            ))
          ) : (
            <div className="text-center py-8 card-base">
              <Search size={32} className="mx-auto mb-2 opacity-50" style={{ color: 'var(--text-muted)' }} />
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                No participants match your search
              </p>
              <Button variant="ghost" onClick={clearSearch} className="mt-2">
                Clear Search
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16 card-base">
          <div className="flex justify-center mb-4">
            <UserCheck size={64} className="opacity-30" style={{ color: 'var(--text-muted)' }} />
          </div>
          <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            No Eligible Participants
          </h3>
          <p className="text-sm mt-2 max-w-md mx-auto" style={{ color: 'var(--text-muted)' }}>
            Participants must have their attendance marked as <strong>Attended</strong> 
            to be eligible for a certificate.
          </p>
          <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to={`/trainer/attendance/${id}`}
              className="btn-primary inline-flex items-center gap-2"
            >
              <UserCheck size={16} />
              Mark Attendance
            </Link>
            <Link
              to="/trainer/sessions"
              className="btn-secondary inline-flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to Sessions
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}