import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Users, Search, CheckCircle, XCircle, Loader2,
  Calendar, Clock, RefreshCw, ChevronDown, ChevronUp,
  AlertCircle, Award
} from 'lucide-react';

import { useSession, useMarkAttendance } from '@/hooks';
import { useAttendanceModalStore } from '@/stores/useAttendanceModalStore';
import { useAdminModalStore } from '@/stores/useAdminModalStore';
import Spinner from '@/components/ui/Spinner';
import { Button } from '@/components/ui/button';
import { getSafeDate, safeFormatDate } from '@/utils/date';
import { toast } from '@/stores/toastStore';

function ParticipantRow({ enrolment, onStatusChange, isUpdating }) {
  const [isMarking, setIsMarking] = useState(false);
  const [status, setStatus] = useState(enrolment.status || 'ENROLLED');

  const statusOptions = [
    { value: 'ENROLLED', label: 'Not Marked', color: '#3b82f6' },
    { value: 'ATTENDED', label: 'Attended', color: 'var(--color-forest-green)' },
    { value: 'CANCELLED', label: 'Absent', color: '#dc2626' },
  ];

  const currentStatus = statusOptions.find(opt => opt.value === status) || statusOptions[0];
  const isMarked = status === 'ATTENDED' || status === 'CANCELLED';

  const handleStatusChange = async (newStatus) => {
    if (newStatus === status) return;
    setIsMarking(true);
    try {
      await onStatusChange(enrolment.id, newStatus);
      setStatus(newStatus);
    } finally {
      setIsMarking(false);
    }
  };

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b transition-all hover:bg-card-hover/50"
      style={{ 
        borderColor: 'var(--border-color)',
        opacity: isMarked ? 0.75 : 1
      }}
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs"
            style={{ 
              background: isMarked ? 'var(--text-muted)' : 'var(--color-forest-green)',
              color: 'white',
              opacity: isMarked ? 0.5 : 1
            }}
          >
            {enrolment.user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <p className="text-sm font-medium" style={{ 
              color: isMarked ? 'var(--text-muted)' : 'var(--text-primary)',
              textDecoration: isMarked ? 'line-through' : 'none'
            }}>
              {enrolment.user?.name || 'Unknown User'}
            </p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {enrolment.user?.email || 'No email'}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
          style={{ background: `${currentStatus.color}20`, color: currentStatus.color }}
        >
          {currentStatus.label}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleStatusChange(option.value)}
              disabled={isMarking || isUpdating || (option.value === 'ENROLLED' && status === 'ENROLLED')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5
                ${status === option.value ? 'ring-2 ring-offset-1' : 'opacity-60 hover:opacity-100'}`}
              style={{
                background: status === option.value ? `${option.color}30` : 'transparent',
                color: option.color,
                borderColor: status === option.value ? option.color : 'transparent',
                borderWidth: status === option.value ? '1px' : '0',
                ringColor: option.color,
                opacity: (isMarking || isUpdating) ? 0.5 : 1
              }}
            >
              {status === option.value && option.value === 'ATTENDED' && <CheckCircle size={12} />}
              {status === option.value && option.value === 'CANCELLED' && <XCircle size={12} />}
              {option.label}
            </button>
          ))}
        </div>
      </td>
    </motion.tr>
  );
}

export default function AttendanceModal() {
  // ✅ ALL hooks at the top (no early returns before hooks)
  const { isOpen, sessionId, sessionData, closeModal } = useAttendanceModalStore();
  const { openIssueCertificate } = useAdminModalStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState({});
  
  const { 
    data: fetchedData, 
    isLoading, 
    error, 
    refetch 
  } = useSession(sessionId, {
    enabled: isOpen && !sessionData,
  });

  const { mutate: markAttendance, isPending: isUpdating } = useMarkAttendance();

  const session = sessionData || fetchedData?.data || fetchedData;
  const enrolments = session?.enrolments || [];

  // ✅ useMemo hooks
  const filteredEnrolments = useMemo(() => {
    let filtered = [...enrolments];

    if (searchTerm) {
      filtered = filtered.filter(e => 
        e.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(e => (selectedStatuses[e.id] || e.status) === statusFilter);
    }

    filtered.sort((a, b) => {
      let aVal, bVal;
      switch (sortField) {
        case 'name':
          aVal = a.user?.name || '';
          bVal = b.user?.name || '';
          break;
        case 'email':
          aVal = a.user?.email || '';
          bVal = b.user?.email || '';
          break;
        case 'status':
          aVal = selectedStatuses[a.id] || a.status || '';
          bVal = selectedStatuses[b.id] || b.status || '';
          break;
        default:
          aVal = a.user?.name || '';
          bVal = b.user?.name || '';
      }
      return sortDirection === 'asc' 
        ? aVal.localeCompare(bVal) 
        : bVal.localeCompare(aVal);
    });

    return filtered;
  }, [enrolments, searchTerm, statusFilter, sortField, sortDirection, selectedStatuses]);

  const stats = useMemo(() => {
    const total = enrolments.length;
    const attended = enrolments.filter(e => (selectedStatuses[e.id] || e.status) === 'ATTENDED').length;
    const absent = enrolments.filter(e => (selectedStatuses[e.id] || e.status) === 'CANCELLED').length;
    const notMarked = enrolments.filter(e => (selectedStatuses[e.id] || e.status) === 'ENROLLED' || (selectedStatuses[e.id] || e.status) === 'ACTIVE').length;
    return { total, attended, absent, notMarked };
  }, [enrolments, selectedStatuses]);


  useEffect(() => {
    if (enrolments.length > 0) {
      const initial = {};
      enrolments.forEach(e => {
        initial[e.id] = e.status || 'ENROLLED';
      });
      setSelectedStatuses(initial);
    }
  }, [enrolments]);


  if (!isOpen) return null;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronDown size={14} className="opacity-30" />;
    return sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  const handleStatusChange = async (enrolmentId, status) => {
    return new Promise((resolve, reject) => {
      markAttendance(
        { enrolmentId, status },
        {
          onSuccess: () => {
            setSelectedStatuses(prev => ({ ...prev, [enrolmentId]: status }));
            toast.success(`Marked as ${status === 'ATTENDED' ? 'Attended' : status === 'CANCELLED' ? 'Absent' : 'Not Marked'}`);
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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  // Once attendance has been marked, jump straight into issuing
  // certificates for this session without re-selecting it.
  // IssueCertificateModal is mounted by the parent page (it lives
  // alongside the sessions list / Certificates page), so we just
  // open it here — it renders on top of this modal.
  const handleIssueCertificates = () => {
    openIssueCertificate(session);
    closeModal();
  };

  if (isLoading) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4"
        >
          <div className="card-base shadow-elevated max-w-4xl w-full p-12 text-center">
            <Loader2 size={48} className="animate-spin mx-auto" style={{ color: 'var(--color-forest-green)' }} />
            <p className="mt-4" style={{ color: 'var(--text-muted)' }}>Loading session data...</p>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (error || !session) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div className="card-base shadow-elevated max-w-md w-full p-8 text-center" onClick={(e) => e.stopPropagation()}>
            <AlertCircle size={48} className="mx-auto mb-4" style={{ color: 'var(--error-text)' }} />
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Failed to load session
            </h3>
            <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
              {error?.message || 'Please try again.'}
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={handleRefresh} className="btn-primary">Retry</Button>
              <Button onClick={closeModal} variant="outline">Close</Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  const sessionDate = getSafeDate(session.date);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4"
        onClick={closeModal}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="card-base shadow-elevated max-w-5xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b" style={{ 
            borderColor: 'var(--border-color)',
            background: 'var(--bg-card)'
          }}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                  Mark Attendance
                </h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{
                  background: 'rgba(22, 101, 52, 0.1)',
                  color: 'var(--color-forest-green)'
                }}>
                  {stats.total} enrolled
                </span>
              </div>
              <p className="text-sm truncate mt-1" style={{ color: 'var(--text-secondary)' }}>
                {session.title}
              </p>
              {sessionDate && (
                <p className="text-xs mt-1 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {safeFormatDate(sessionDate, 'PPP')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {safeFormatDate(sessionDate, 'h:mm a')}
                  </span>
                </p>
              )}
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
                onClick={closeModal}
                className="p-2 rounded-lg hover:bg-card-hover transition-colors"
              >
                <X size={20} style={{ color: 'var(--text-secondary)' }} />
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <div className="text-center">
              <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{stats.total}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Total Enrolled</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold" style={{ color: '#3b82f6' }}>{stats.notMarked}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Not Marked</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold" style={{ color: 'var(--color-forest-green)' }}>{stats.attended}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Attended</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold" style={{ color: 'var(--error-text)' }}>{stats.absent}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Absent</p>
            </div>
          </div>

          {/* Filters */}
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
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-card-hover"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-sm rounded-lg select-themed"
              >
                <option value="all">All Status</option>
                <option value="ENROLLED">Not Marked</option>
                <option value="ATTENDED">Attended</option>
                <option value="CANCELLED">Absent</option>
              </select>
              {(searchTerm || statusFilter !== 'all') && (
                <button
                  onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
                  className="px-3 py-2 text-sm rounded-lg hover:bg-card-hover transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <X size={14} />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Results Count */}
          <div className="flex justify-between items-center px-4 py-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span>Showing {filteredEnrolments.length} of {enrolments.length} participants</span>
            <div className="flex items-center gap-2">
              <button onClick={() => handleSort('name')} className="flex items-center gap-1 hover:opacity-70">
                Name <SortIcon field="name" />
              </button>
              <button onClick={() => handleSort('status')} className="flex items-center gap-1 hover:opacity-70">
                Status <SortIcon field="status" />
              </button>
            </div>
          </div>

          {/* Table */}
          {enrolments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ background: 'var(--bg-surface)' }}>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      Participant
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      Current Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEnrolments.length > 0 ? (
                    filteredEnrolments.map((enrolment) => (
                      <ParticipantRow
                        key={enrolment.id}
                        enrolment={enrolment}
                        onStatusChange={handleStatusChange}
                        isUpdating={isUpdating}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center" style={{ color: 'var(--text-muted)' }}>
                        <Users size={32} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No participants match your filters</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users size={48} className="mx-auto mb-4 opacity-50" style={{ color: 'var(--text-muted)' }} />
              <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                No participants enrolled
              </h3>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                This session has no enrolments yet.
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between p-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {stats.attended > 0
                ? `${stats.attended} participant${stats.attended === 1 ? '' : 's'} ready for certificates`
                : 'Mark participants as Attended to make them eligible for certificates'}
            </p>
            <div className="flex gap-2">
              <button
                onClick={closeModal}
                className="btn-secondary px-6 py-2"
              >
                Close
              </button>
              {stats.attended > 0 && (
                <Button
                  onClick={handleIssueCertificates}
                  className="btn-primary flex items-center gap-2"
                >
                  <Award size={16} />
                  Issue Certificates ({stats.attended})
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}