// src/pages/trainer/Attendance.jsx
import { useState, useMemo, useEffect } from 'react';
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
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Save,
  X,
  Filter
} from 'lucide-react';

import { useSession, useMarkAttendance } from '@/hooks';
import Spinner from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { getSafeDate, safeFormatDate } from '@/utils/date';
import { toast } from '@/stores/toastStore';

// ============================================================
// Participant Row Component
// ============================================================
function ParticipantRow({ enrolment, onMarkAttendance, isUpdating }) {
  const [isMarking, setIsMarking] = useState(false);

  const handleMark = async (status) => {
    setIsMarking(true);
    try {
      await onMarkAttendance(enrolment.id, status);
    } finally {
      setIsMarking(false);
    }
  };

  const statusConfig = {
    ENROLLED: { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', label: 'Not Marked' },
    ACTIVE: { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', label: 'Not Marked' },
    CANCELLED: { bg: 'rgba(220, 38, 38, 0.1)', color: '#dc2626', label: 'Absent' },
    COMPLETED: { bg: 'rgba(107, 114, 128, 0.1)', color: 'var(--text-muted)', label: 'Completed' },
    ATTENDED: { bg: 'rgba(22, 101, 52, 0.1)', color: 'var(--color-forest-green)', label: 'Present' },
  };

  const status = statusConfig[enrolment.status] || statusConfig.ENROLLED;
  const isMarked = enrolment.status === 'ATTENDED' || enrolment.status === 'CANCELLED';
  const canMark = enrolment.status === 'ENROLLED' || enrolment.status === 'ACTIVE';

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
        <span
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
          style={{
            background: status.bg,
            color: status.color
          }}
        >
          {status.label}
        </span>
      </td>

      <td className="px-4 py-3 text-right">
        {canMark ? (
          <div className="flex items-center justify-end gap-2">
            {/* Mark Present */}
            <button
              onClick={() => handleMark('ATTENDED')}
              disabled={isMarking || isUpdating}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5"
              style={{
                background: 'rgba(22, 101, 52, 0.1)',
                color: 'var(--color-forest-green)',
                opacity: (isMarking || isUpdating) ? 0.5 : 1
              }}
            >
              {isMarking ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <CheckCircle size={14} />
              )}
              Present
            </button>

            {/* Mark Absent */}
            <button
              onClick={() => handleMark('CANCELLED')}
              disabled={isMarking || isUpdating}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5"
              style={{
                background: 'rgba(220, 38, 38, 0.1)',
                color: 'var(--error-text)',
                opacity: (isMarking || isUpdating) ? 0.5 : 1
              }}
            >
              {isMarking ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <XCircle size={14} />
              )}
              Absent
            </button>
          </div>
        ) : (
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {enrolment.status === 'ATTENDED' ? '✓ Present' : 
             enrolment.status === 'CANCELLED' ? '✗ Absent' :
             'Locked'}
          </span>
        )}
      </td>
    </motion.tr>
  );
}

// ============================================================
// Main Attendance Component
// ============================================================
export default function Attendance() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const { data, isLoading, error, refetch } = useSession(id);
  const { mutate: markAttendance, isPending: isUpdating } = useMarkAttendance();

  const session = data?.data || data;
  const enrolments = session?.enrolments || [];

  // Sort handlers
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

  // Handle mark attendance
  const handleMarkAttendance = async (enrolmentId, status) => {
    return new Promise((resolve, reject) => {
      markAttendance(
        { enrolmentId, status },
        {
          onSuccess: () => {
            toast.success(`Marked as ${status === 'ATTENDED' ? 'Present' : 'Absent'}`);
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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  // Filter and sort enrolments
  const filteredEnrolments = useMemo(() => {
    let filtered = [...enrolments];

    if (searchTerm) {
      filtered = filtered.filter(e => 
        e.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(e => e.status === statusFilter);
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
          aVal = a.status || '';
          bVal = b.status || '';
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
  }, [enrolments, searchTerm, statusFilter, sortField, sortDirection]);

  // Stats
  const stats = useMemo(() => ({
    total: enrolments.length,
    notMarked: enrolments.filter(e => e.status === 'ENROLLED' || e.status === 'ACTIVE').length,
    present: enrolments.filter(e => e.status === 'ATTENDED').length,
    absent: enrolments.filter(e => e.status === 'CANCELLED').length,
  }), [enrolments]);

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
            The session you're looking for doesn't exist or you don't have access.
          </p>
          <Link to="/dashboard/trainer/sessions" className="btn-primary inline-block">
            <ArrowLeft size={16} className="inline mr-2" />
            Back to Sessions
          </Link>
        </div>
      </div>
    );
  }

  const sessionDate = getSafeDate(session.date);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:px-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/trainer/sessions"
          className="p-2 rounded-lg transition-colors hover:bg-card-hover"
        >
          <ChevronLeft size={20} style={{ color: 'var(--text-secondary)' }} />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                Mark Attendance
              </h1>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="card-base p-3 text-center">
          <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {stats.total}
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Total Enrolled</p>
        </div>
        <div className="card-base p-3 text-center" style={{ borderColor: '#3b82f6' }}>
          <p className="text-xl font-bold" style={{ color: '#3b82f6' }}>
            {stats.notMarked}
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Not Marked</p>
        </div>
        <div className="card-base p-3 text-center" style={{ borderColor: 'var(--color-forest-green)' }}>
          <p className="text-xl font-bold" style={{ color: 'var(--color-forest-green)' }}>
            {stats.present}
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Present</p>
        </div>
        <div className="card-base p-3 text-center" style={{ borderColor: 'var(--error-text)' }}>
          <p className="text-xl font-bold" style={{ color: 'var(--error-text)' }}>
            {stats.absent}
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Absent</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
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
            <option value="ACTIVE">Active</option>
            <option value="ATTENDED">Present</option>
            <option value="CANCELLED">Absent</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Showing {filteredEnrolments.length} of {enrolments.length} participants
        </p>
        {(searchTerm || statusFilter !== 'all') && (
          <button
            onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
            className="text-xs flex items-center gap-1 hover:underline"
            style={{ color: 'var(--text-muted)' }}
          >
            <X size={12} />
            Clear Filters
          </button>
        )}
      </div>

      {/* Table */}
      {enrolments.length > 0 ? (
        <div className="card-base overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ background: 'var(--bg-surface)' }}>
                <tr>
                  <th 
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer hover:opacity-70"
                    style={{ color: 'var(--text-muted)' }}
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      Participant
                      <SortIcon field="name" />
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer hover:opacity-70"
                    style={{ color: 'var(--text-muted)' }}
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-1">
                      Status
                      <SortIcon field="status" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
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
                      onMarkAttendance={handleMarkAttendance}
                      isUpdating={isUpdating}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center" style={{ color: 'var(--text-muted)' }}>
                      <Users size={32} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">
                        {searchTerm || statusFilter !== 'all' 
                          ? 'No participants match your filters' 
                          : 'No enrolments yet'}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 card-base">
          <Users size={48} className="mx-auto mb-4 opacity-50" style={{ color: 'var(--text-muted)' }} />
          <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            No participants enrolled
          </h3>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            This session has no enrolments yet.
          </p>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 text-xs" style={{ color: 'var(--text-muted)' }}>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-500/30 border border-blue-500/50" />
          Not Marked
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-green-500/30 border border-green-500/50" />
          Present
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500/30 border border-red-500/50" />
          Absent
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-gray-500/30 border border-gray-500/50" />
          Completed
        </span>
      </div>
    </div>
  );
}