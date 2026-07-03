import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Award, 
  Users, 
  Search, 
  CheckCircle, 
  XCircle,
  Loader2,
  AlertCircle,
  User,
  Calendar,
  Clock,
  RefreshCw,
  FileCheck,
  UserCheck,
  ChevronRight
} from 'lucide-react';

import { useSession, useSessions, useIssueCertificate, useBatchIssueCertificates } from '@/hooks';
import { useAdminModalStore } from '@/stores/useAdminModalStore';
import Spinner from '@/components/ui/Spinner';
import { Button } from '@/components/ui/button';
import { safeFormatDate, getSafeDate } from '@/utils/date';
import { toast } from '@/stores/toastStore';

// ============================================================
// Session Picker — shown inside the modal when no session has
// been selected yet (e.g. opened from the "Issue Certificate" /
// "Batch Issue" buttons on the Certificates page toolbar)
// ============================================================
function SessionPicker({ onSelect, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading, error } = useSessions({ search: searchTerm, limit: 20 });

  const sessions = data?.data || data?.sessions || [];

  return (
    <>
      <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b" style={{ 
        borderColor: 'var(--border-color)',
        background: 'var(--bg-card)'
      }}>
        <div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Select a Session
          </h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Choose the session you want to issue certificates for
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-card-hover transition-colors"
        >
          <X size={20} style={{ color: 'var(--text-secondary)' }} />
        </button>
      </div>

      <div className="p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search sessions by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg input-themed"
            autoFocus
          />
        </div>
      </div>

      <div className="p-4 max-h-[400px] overflow-y-auto">
        {isLoading ? (
          <div className="py-12 text-center">
            <Loader2 size={32} className="animate-spin mx-auto" style={{ color: 'var(--color-forest-green)' }} />
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <AlertCircle size={32} className="mx-auto mb-2" style={{ color: 'var(--error-text)' }} />
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Failed to load sessions</p>
          </div>
        ) : sessions.length > 0 ? (
          <div className="space-y-2">
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => onSelect(session)}
                className="w-full flex items-center justify-between p-4 rounded-lg text-left transition-all hover:bg-card-hover"
                style={{ background: 'var(--bg-surface)' }}
              >
                <div className="min-w-0">
                  <p className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                    {session.title}
                  </p>
                  <p className="text-xs mt-0.5 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                    {session.date && (
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {safeFormatDate(session.date, 'PPP')}
                      </span>
                    )}
                    {typeof session.enrolledCount === 'number' && (
                      <span className="flex items-center gap-1">
                        <Users size={12} />
                        {session.enrolledCount} enrolled
                      </span>
                    )}
                  </p>
                </div>
                <ChevronRight size={18} className="flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
              </button>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <Calendar size={32} className="mx-auto mb-2 opacity-50" style={{ color: 'var(--text-muted)' }} />
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {searchTerm ? 'No sessions match your search' : 'No sessions found'}
            </p>
          </div>
        )}
      </div>
    </>
  );
}


function EligibleParticipant({ enrolment, onIssue, isIssuing, isIssued, index }) {
  const [isMarking, setIsMarking] = useState(false);

  const handleIssue = async () => {
    setIsMarking(true);
    try {
      await onIssue(enrolment.userId, enrolment.sessionId);
    } finally {
      setIsMarking(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ x: 4 }}
      className="flex items-center justify-between p-4 rounded-lg transition-all"
      style={{ 
        background: isIssued ? 'rgba(22, 101, 52, 0.05)' : 'var(--bg-surface)',
        border: isIssued ? '1px solid rgba(22, 101, 52, 0.2)' : 'none'
      }}
    >
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
          style={{ 
            background: isIssued ? 'var(--text-muted)' : 'var(--color-forest-green)',
            color: 'white',
            opacity: isIssued ? 0.5 : 1
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
        </div>
      </div>
      
      {!isIssued ? (
        <Button
          onClick={handleIssue}
          disabled={isIssuing || isMarking}
          className="btn-primary flex items-center gap-2 flex-shrink-0"
          size="sm"
        >
          {isMarking || isIssuing ? (
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
        <span className="flex items-center gap-1 text-sm" style={{ color: 'var(--color-forest-green)' }}>
          <CheckCircle size={16} />
          Issued
        </span>
      )}
    </motion.div>
  );
}

export default function IssueCertificateModal() {
  const { isIssueCertificateOpen, selectedSessionForIssue, openIssueCertificate, closeIssueCertificate } = useAdminModalStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [issuedUserIds, setIssuedUserIds] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { 
    data: sessionData, 
    isLoading, 
    error, 
    refetch 
  } = useSession(selectedSessionForIssue?.id, {
    enabled: isIssueCertificateOpen && !!selectedSessionForIssue?.id,
  });

  const { mutate: issueCertificate, isPending: isIssuing } = useIssueCertificate();
  const { mutate: batchIssue, isPending: isBatchIssuing } = useBatchIssueCertificates();

  const session = sessionData?.data || sessionData || selectedSessionForIssue;
  const enrolments = session?.enrolments || [];

  // Reset locally-tracked "issued in this session" state whenever the
  // target session changes, so stale checkmarks don't leak across sessions
  useEffect(() => {
    setIssuedUserIds([]);
    setSearchTerm('');
  }, [selectedSessionForIssue?.id]);

  // Filter eligible participants (ATTENDED status)
  const eligibleEnrolments = useMemo(() => {
    return enrolments.filter(e => e.status === 'ATTENDED');
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
        refetch();
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

    const confirmed = window.confirm(
      `Issue certificates to ${eligible.length} participant(s)?`
    );
    
    if (!confirmed) return;

    batchIssue(selectedSessionForIssue.id, {
      onSuccess: (result) => {
        const userIds = eligible.map(e => e.userId);
        setIssuedUserIds(prev => [...prev, ...userIds]);
        toast.success(`${result?.issued || userIds.length} certificates issued successfully`);
        refetch();
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
    await refetch();
    setIsRefreshing(false);
  };

  // Clear search
  const clearSearch = () => setSearchTerm('');

  if (!isIssueCertificateOpen) return null;

  // Stats
  const stats = {
    total: enrolments.length,
    eligible: eligibleEnrolments.length,
    issued: issuedUserIds.length,
    pending: eligibleEnrolments.length - issuedUserIds.length,
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4"
        onClick={closeIssueCertificate}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="card-base shadow-elevated max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {!selectedSessionForIssue ? (
            <SessionPicker
              onSelect={(session) => openIssueCertificate(session)}
              onClose={closeIssueCertificate}
            />
          ) : (
          <>
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b" style={{ 
            borderColor: 'var(--border-color)',
            background: 'var(--bg-card)'
          }}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                  Issue Certificates
                </h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{
                  background: 'rgba(22, 101, 52, 0.1)',
                  color: 'var(--color-forest-green)'
                }}>
                  {stats.eligible} eligible
                </span>
              </div>
              <p className="text-sm truncate mt-1" style={{ color: 'var(--text-secondary)' }}>
                {session?.title || 'Session'}
              </p>
              {session?.date && (
                <p className="text-xs mt-1 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {safeFormatDate(session.date, 'PPP')}
                  </span>
                </p>
              )}
              <button
                onClick={() => openIssueCertificate(null)}
                className="text-xs mt-1 hover:underline"
                style={{ color: 'var(--color-forest-green)' }}
              >
                Change session
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 rounded-lg hover:bg-card-hover transition-colors"
                style={{ color: 'var(--text-secondary)' }}
              >
                <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
              </button>
              <button
                onClick={closeIssueCertificate}
                className="p-2 rounded-lg hover:bg-card-hover transition-colors"
              >
                <X size={20} style={{ color: 'var(--text-secondary)' }} />
              </button>
            </div>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="p-12 text-center">
              <Loader2 size={48} className="animate-spin mx-auto" style={{ color: 'var(--color-forest-green)' }} />
              <p className="mt-4" style={{ color: 'var(--text-muted)' }}>Loading session data...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <AlertCircle size={48} className="mx-auto mb-4" style={{ color: 'var(--error-text)' }} />
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Failed to load session
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                {error?.message || 'Please try again.'}
              </p>
              <Button onClick={handleRefresh} className="btn-primary">Retry</Button>
            </div>
          ) : (
            <>
              {/* Stats Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
                <div className="text-center">
                  <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{stats.total}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Total Enrolled</p>
                </div>
                <div className="text-center" style={{ borderColor: 'var(--color-forest-green)' }}>
                  <p className="text-xl font-bold" style={{ color: 'var(--color-forest-green)' }}>{stats.eligible}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Eligible</p>
                </div>
                <div className="text-center" style={{ borderColor: '#3b82f6' }}>
                  <p className="text-xl font-bold" style={{ color: '#3b82f6' }}>{stats.issued}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Issued</p>
                </div>
                <div className="text-center" style={{ borderColor: stats.pending > 0 ? '#d97706' : 'var(--border-color)' }}>
                  <p className="text-xl font-bold" style={{ color: stats.pending > 0 ? '#d97706' : 'var(--text-muted)' }}>
                    {stats.pending}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Pending</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
                <div className="flex-1 relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Search participants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg input-themed"
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
                <Button
                  onClick={handleBatchIssue}
                  disabled={isBatchIssuing || stats.eligible === 0 || allIssued}
                  className="btn-primary flex items-center gap-2 whitespace-nowrap"
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

              {/* Results Count */}
              <div className="flex justify-between items-center px-4 py-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                <span>Showing {filteredEnrolments.length} of {eligibleEnrolments.length} eligible participants</span>
                {allIssued && stats.eligible > 0 && (
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle size={12} />
                    All certificates issued
                  </span>
                )}
              </div>

              {/* Participants List */}
              {eligibleEnrolments.length > 0 ? (
                <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto">
                  {filteredEnrolments.length > 0 ? (
                    filteredEnrolments.map((enrolment, index) => (
                      <EligibleParticipant
                        key={enrolment.id}
                        enrolment={enrolment}
                        onIssue={handleIssueCertificate}
                        isIssuing={isIssuing}
                        isIssued={issuedUserIds.includes(enrolment.userId)}
                        index={index}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8">
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
                <div className="text-center py-16">
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
                </div>
              )}
            </>
          )}

          {/* Footer */}
          <div className="flex justify-end p-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <button
              onClick={closeIssueCertificate}
              className="btn-secondary px-6 py-2"
            >
              Close
            </button>
          </div>
          </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}