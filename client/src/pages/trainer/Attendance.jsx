// src/pages/trainer/Attendance.jsx
import { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  Filter,
  ChevronRight
} from 'lucide-react';

import { useSession, useMyTrainerSessions, useMarkAttendance } from '@/hooks';
import Spinner from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { getSafeDate, safeFormatDate } from '@/utils/date';
import { toast } from '@/stores/toastStore';

// ============================================================
// Session Selector Component (for trainers with multiple sessions)
// ============================================================
function SessionSelector({ sessions, currentSessionId, onSelect, isLoading }) {
  const [isOpen, setIsOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Spinner size="sm" />
        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading sessions...</span>
      </div>
    );
  }

  if (!sessions || sessions.length === 0) {
    return (
      <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
        No sessions available
      </div>
    );
  }

  const currentSession = sessions.find(s => s.id === currentSessionId);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:bg-card-hover"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          color: 'var(--text-primary)'
        }}
      >
        <Calendar size={16} style={{ color: 'var(--color-forest-green)' }} />
        <span className="text-sm font-medium truncate max-w-[200px]">
          {currentSession?.title || 'Select Session'}
        </span>
        <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />
      </button>

      {isOpen && (
        <div 
          className="absolute top-full left-0 mt-1 w-64 max-h-60 overflow-y-auto rounded-lg shadow-elevated z-10"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)'
          }}
        >
          {sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => {
                onSelect(session.id);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-card-hover"
              style={{
                color: session.id === currentSessionId ? 'var(--color-forest-green)' : 'var(--text-primary)',
                background: session.id === currentSessionId ? 'rgba(22,101,52,0.05)' : 'transparent'
              }}
            >
              <div className="flex items-center justify-between">
                <span className="truncate">{session.title}</span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {session._count?.enrolments || 0} enrolled
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// Participant Row Component
// ============================================================
function ParticipantRow({ 
  enrolment, 
  isSelected, 
  onToggleSelect, 
  isUpdating,
  onMarkIndividual 
}) {
  const [isMarking, setIsMarking] = useState(false);

  const statusConfig = {
    ENROLLED: { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', label: 'Not Marked', icon: null },
    ACTIVE: { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', label: 'Not Marked', icon: null },
    CANCELLED: { bg: 'rgba(220, 38, 38, 0.1)', color: '#dc2626', label: 'Absent', icon: XCircle },
    COMPLETED: { bg: 'rgba(107, 114, 128, 0.1)', color: 'var(--text-muted)', label: 'Completed', icon: null },
    ATTENDED: { bg: 'rgba(22, 101, 52, 0.1)', color: 'var(--color-forest-green)', label: 'Present', icon: CheckCircle },
  };

  const status = statusConfig[enrolment.status] || statusConfig.ENROLLED;
  const isMarked = enrolment.status === 'ATTENDED' || enrolment.status === 'CANCELLED';
  const canSelect = enrolment.status === 'ENROLLED' || enrolment.status === 'ACTIVE';

  const handleIndividualMark = async (newStatus) => {
    setIsMarking(true);
    try {
      await onMarkIndividual(enrolment.id, newStatus);
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
        opacity: isMarked ? 0.75 : 1,
        background: isSelected ? 'rgba(22, 101, 52, 0.05)' : 'transparent'
      }}
    >
      <td className="px-4 py-3 w-12">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(enrolment.id)}
          disabled={!canSelect || isUpdating}
          className="w-4 h-4 rounded transition-all disabled:opacity-30"
          style={{ 
            accentColor: 'var(--color-forest-green)',
            cursor: canSelect ? 'pointer' : 'not-allowed'
          }}
        />
      </td>

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
          {status.icon && <status.icon size={12} />}
          {status.label}
        </span>
      </td>

      <td className="px-4 py-3 text-right">
        {canSelect ? (
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => handleIndividualMark('ATTENDED')}
              disabled={isMarking || isUpdating}
              className="p-1.5 rounded-lg transition-all hover:bg-green-100 disabled:opacity-50"
              style={{ color: 'var(--color-forest-green)' }}
              title="Mark Present"
            >
              {isMarking ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <CheckCircle size={16} />
              )}
            </button>
            <button
              onClick={() => handleIndividualMark('CANCELLED')}
              disabled={isMarking || isUpdating}
              className="p-1.5 rounded-lg transition-all hover:bg-red-100 disabled:opacity-50"
              style={{ color: 'var(--error-text)' }}
              title="Mark Absent"
            >
              {isMarking ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <XCircle size={16} />
              )}
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
  
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isSaving, setIsSaving] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState(id);
  
  // Hooks
  const { data: sessionsData, isLoading: sessionsLoading } = useMyTrainerSessions();
  const { data: sessionData, isLoading: sessionLoading, error: sessionError, refetch: refetchSession } = useSession(selectedSessionId);
  const { mutate: markAttendance, isPending: isUpdating } = useMarkAttendance();

  // Extract sessions and current session
  const sessions = sessionsData?.data || [];
  const session = sessionData?.data || sessionData;
  const enrolments = session?.enrolments || [];

  // Auto-select first session if none selected
  useEffect(() => {
    if (!selectedSessionId && sessions.length > 0) {
      setSelectedSessionId(sessions[0].id);
    }
  }, [sessions, selectedSessionId]);

  // Reset selection when enrolments change
  useEffect(() => {
    const validIds = enrolments
      .filter(e => e.status === 'ENROLLED' || e.status === 'ACTIVE')
      .map(e => e.id);
    setSelectedIds(prev => prev.filter(id => validIds.includes(id)));
  }, [enrolments]);

  // Handlers
  const handleSessionSelect = (sessionId) => {
    setSelectedSessionId(sessionId);
    setSelectedIds([]);
    setSearchTerm('');
    setStatusFilter('all');
  };

  const handleToggleSelect = (enrolmentId) => {
    setSelectedIds(prev => 
      prev.includes(enrolmentId) 
        ? prev.filter(id => id !== enrolmentId)
        : [...prev, enrolmentId]
    );
  };

  const handleSelectAll = () => {
    const unmarkedIds = enrolments
      .filter(e => e.status === 'ENROLLED' || e.status === 'ACTIVE')
      .map(e => e.id);
    
    const allSelected = unmarkedIds.every(id => selectedIds.includes(id));
    
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(unmarkedIds);
    }
  };

  const handleClearAll = () => {
    setSelectedIds([]);
  };

  const handleMarkIndividual = async (enrolmentId, status) => {
    return new Promise((resolve, reject) => {
      markAttendance(
        { enrolmentId, status },
        {
          onSuccess: () => {
            toast.success(`Marked as ${status === 'ATTENDED' ? 'Present' : 'Absent'}`);
            refetchSession();
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

  const handleSaveSelected = async () => {
    if (selectedIds.length === 0) {
      toast.info('No participants selected');
      return;
    }

    const confirmed = window.confirm(
      `Mark ${selectedIds.length} participant(s) as present?`
    );
    
    if (!confirmed) return;

    setIsSaving(true);

    try {
      const toMark = enrolments.filter(e => selectedIds.includes(e.id));
      
      for (const enrolment of toMark) {
        await new Promise((resolve, reject) => {
          markAttendance(
            { enrolmentId: enrolment.id, status: 'ATTENDED' },
            {
              onSuccess: () => resolve(),
              onError: (error) => reject(error)
            }
          );
        });
      }

      toast.success(`Marked ${toMark.length} participant(s) as present`);
      setSelectedIds([]);
      await refetchSession();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to save attendance');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetchSession();
    setSelectedIds([]);
    setIsRefreshing(false);
  };

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
    selected: selectedIds.length,
  }), [enrolments, selectedIds]);

  // Loading state
  if (sessionsLoading || sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-page)' }}>
        <Spinner />
      </div>
    );
  }

  // No sessions
  if (sessions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-page)' }}>
        <div className="text-center max-w-md">
          <Calendar size={48} className="mx-auto mb-4 opacity-30" style={{ color: 'var(--text-muted)' }} />
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            No Sessions Available
          </h3>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
            You don't have any sessions with enrolments yet.
          </p>
          <Link to="/trainer/sessions" className="btn-primary inline-block">
            View My Sessions
          </Link>
        </div>
      </div>
    );
  }

  // Session error
  if (sessionError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-page)' }}>
        <div className="text-center max-w-md">
          <AlertCircle size={48} className="mx-auto mb-4" style={{ color: 'var(--error-text)' }} />
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Failed to load session
          </h3>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
            {sessionError?.message || 'Please try again.'}
          </p>
          <Button onClick={handleRefresh}>Try Again</Button>
        </div>
      </div>
    );
  }

  const sessionDate = getSafeDate(session?.date);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:px-8">
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
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Take Attendance
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <SessionSelector
                  sessions={sessions}
                  currentSessionId={selectedSessionId}
                  onSelect={handleSessionSelect}
                  isLoading={sessionsLoading}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 rounded-lg hover:bg-card-hover transition-colors"
                style={{ color: 'var(--text-secondary)' }}
              >
                <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
              </button>
              <Link
                to={`/trainer/sessions/${selectedSessionId}`}
                className="btn-secondary flex items-center gap-2 px-4 py-2 text-sm"
              >
                <ArrowLeft size={16} />
                Session Details
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Session Info */}
      {session && (
        <div className="card-base p-4 mb-6">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                {session.title}
              </p>
              {sessionDate && (
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  <Calendar size={12} className="inline mr-1" />
                  {safeFormatDate(sessionDate, 'PPP')}
                  <Clock size={12} className="inline ml-2 mr-1" />
                  {safeFormatDate(sessionDate, 'h:mm a')}
                </p>
              )}
            </div>
            <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
              <span className="flex items-center gap-1">
                <Users size={14} />
                {stats.total} enrolled
              </span>
              <span className="flex items-center gap-1" style={{ color: 'var(--color-forest-green)' }}>
                <CheckCircle size={14} />
                {stats.present} present
              </span>
              <span className="flex items-center gap-1" style={{ color: 'var(--error-text)' }}>
                <XCircle size={14} />
                {stats.absent} absent
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
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
            {stats.selected}
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Selected</p>
        </div>
        <div className="card-base p-3 text-center" style={{ borderColor: '#22c55e' }}>
          <p className="text-xl font-bold" style={{ color: '#22c55e' }}>
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
        <div className="flex flex-wrap gap-2">
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
          
          {stats.selected > 0 && (
            <Button
              onClick={handleSaveSelected}
              disabled={isSaving || isUpdating}
              className="btn-primary flex items-center gap-2 whitespace-nowrap"
            >
              {isSaving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save ({stats.selected})
                </>
              )}
            </Button>
          )}
          
          <Button
            onClick={handleSelectAll}
            disabled={stats.notMarked === 0}
            variant="outline"
            className="flex items-center gap-2 whitespace-nowrap text-sm"
            style={{ color: 'var(--color-forest-green)' }}
          >
            <UserCheck size={16} />
            Select All
          </Button>
          
          <Button
            onClick={handleClearAll}
            disabled={selectedIds.length === 0}
            variant="outline"
            className="flex items-center gap-2 whitespace-nowrap text-sm"
            style={{ color: 'var(--error-text)' }}
          >
            <X size={16} />
            Clear
          </Button>
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
                  <th className="px-4 py-3 w-12">
                    <input
                      type="checkbox"
                      checked={stats.notMarked > 0 && selectedIds.length === stats.notMarked}
                      onChange={handleSelectAll}
                      disabled={stats.notMarked === 0}
                      className="w-4 h-4 rounded"
                      style={{ 
                        accentColor: 'var(--color-forest-green)',
                        cursor: stats.notMarked > 0 ? 'pointer' : 'not-allowed'
                      }}
                    />
                  </th>
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
                      isSelected={selectedIds.includes(enrolment.id)}
                      onToggleSelect={handleToggleSelect}
                      isUpdating={isUpdating}
                      onMarkIndividual={handleMarkIndividual}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center" style={{ color: 'var(--text-muted)' }}>
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
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-green-500/50 border border-green-500" />
          Selected
        </span>
      </div>
    </div>
  );
}