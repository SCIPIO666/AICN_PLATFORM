// src/pages/trainer/TrainerSessions.jsx
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  Clock, 
  Plus,
  Search,
  Filter,
  X,
  AlertCircle,
  Eye,
  UserCheck,
  Award,
  Edit,
  ChevronRight
} from 'lucide-react';

import { useMyTrainerSessions } from '@/hooks';
import { useAdminModalStore } from '@/stores/useAdminModalStore';
import Spinner from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { getSafeDate, safeFormatDate } from '@/utils/date';
import SessionFormModal from '@/components/modals/SessionFormModal';

function SessionCard({ session, onEdit, onViewAttendance, onViewDetails }) {
  const date = getSafeDate(session.date);
  const isOnline = session.locationType === 'ONLINE';
  const isFull = session._count?.enrolments >= session.capacity;
  const isPast = date && date < new Date();
  const isActive = session.status === 'SCHEDULED' || session.status === 'ONGOING';

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="card-base p-6 transition-all"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold truncate" style={{ color: 'var(--text-primary)' }}>
            {session.title}
          </h3>
          <div className="flex flex-wrap gap-3 mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            {date && (
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {safeFormatDate(date, 'MMM d, yyyy')}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {session.durationMins} min
            </span>
            <span className="flex items-center gap-1">
              <Users size={14} />
              {session._count?.enrolments || 0}/{session.capacity}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <span
              className="px-2 py-1 rounded text-xs font-medium"
              style={{
                background: session.status === 'SCHEDULED' 
                  ? 'rgba(22, 101, 52, 0.1)' 
                  : session.status === 'COMPLETED'
                  ? 'rgba(59, 130, 246, 0.1)'
                  : session.status === 'ONGOING'
                  ? 'rgba(251, 191, 36, 0.1)'
                  : 'rgba(107, 114, 128, 0.1)',
                color: session.status === 'SCHEDULED' 
                  ? 'var(--color-forest-green)' 
                  : session.status === 'COMPLETED'
                  ? '#3b82f6'
                  : session.status === 'ONGOING'
                  ? '#d97706'
                  : 'var(--text-muted)'
              }}
            >
              {session.status}
            </span>
            {isFull && (
              <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-600">
                Full
              </span>
            )}
            {isPast && session.status !== 'COMPLETED' && session.status !== 'CANCELLED' && (
              <span className="px-2 py-1 rounded text-xs font-medium bg-amber-100 text-amber-600">
                Past Due
              </span>
            )}
            {session.locationType === 'ONLINE' ? (
              <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
                Online
              </span>
            ) : (
              <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 inline-block" />
                Physical
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => onViewDetails(session)}
            className="p-2 rounded-lg transition-colors hover:bg-card-hover"
            style={{ color: 'var(--text-secondary)' }}
            title="View Details"
          >
            <Eye size={18} />
          </button>
          
          {isActive && (
            <>
              <button
                onClick={() => onViewAttendance(session)}
                className="p-2 rounded-lg transition-colors hover:bg-card-hover"
                style={{ color: 'var(--text-secondary)' }}
                title="Mark Attendance"
              >
                <UserCheck size={18} />
              </button>
              <button
                onClick={() => onEdit(session)}
                className="p-2 rounded-lg transition-colors hover:bg-card-hover"
                style={{ color: 'var(--text-secondary)' }}
                title="Edit Session"
              >
                <Edit size={18} />
              </button>
            </>
          )}
          
          {session.status === 'COMPLETED' && (
            <Link
              to={`/trainer/certificates/issue/${session.id}`}
              className="p-2 rounded-lg transition-colors hover:bg-card-hover"
              style={{ color: 'var(--text-secondary)' }}
              title="Issue Certificates"
            >
              <Award size={18} />
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function TrainerSessions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  
  const { openSessionForm } = useAdminModalStore();
  
  const { data, isLoading, error, refetch } = useMyTrainerSessions();

  // Memoize filtered sessions
  const filteredSessions = useMemo(() => {
    const sessions = data?.data || [];
    
    return sessions.filter(session => {
      const matchesSearch = session.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
      const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
      const matchesLocation = locationFilter === 'all' || session.locationType === locationFilter;
      return matchesSearch && matchesStatus && matchesLocation;
    });
  }, [data, searchTerm, statusFilter, locationFilter]);

  // Stats
  const stats = useMemo(() => {
    const sessions = data?.data || [];
    return {
      total: sessions.length,
      scheduled: sessions.filter(s => s.status === 'SCHEDULED').length,
      completed: sessions.filter(s => s.status === 'COMPLETED').length,
      ongoing: sessions.filter(s => s.status === 'ONGOING').length,
    };
  }, [data]);

  // Handlers
  const handleEditSession = (session) => {
    openSessionForm(session);
  };

  const handleCreateSession = () => {
    openSessionForm();
  };

  const handleViewAttendance = (session) => {
    // Navigate to attendance page or open attendance modal
    window.location.href = `/trainer/attendance/${session.id}`;
  };

  const handleViewDetails = (session) => {
    window.location.href = `/trainer/sessions/${session.id}`;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setLocationFilter('all');
  };

  const hasActiveFilters = searchTerm || statusFilter !== 'all' || locationFilter !== 'all';

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-page)' }}>
        <Spinner />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-page)' }}>
        <div className="text-center max-w-md">
          <AlertCircle size={48} className="mx-auto mb-4" style={{ color: 'var(--error-text)' }} />
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Failed to load sessions
          </h3>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
            {error?.message || 'Please try refreshing the page.'}
          </p>
          <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                My Sessions
              </h1>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ 
                background: 'rgba(22, 101, 52, 0.1)',
                color: 'var(--color-forest-green)'
              }}>
                {stats.total} total
              </span>
            </div>
            <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>
              Manage your training sessions
            </p>
          </div>
          <button 
            onClick={handleCreateSession}
            className="btn-primary flex items-center gap-2 px-6 py-2.5"
          >
            <Plus size={18} />
            Create Session
          </button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="card-base p-3 text-center">
            <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{stats.total}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Total</p>
          </div>
          <div className="card-base p-3 text-center" style={{ borderColor: 'var(--color-forest-green)' }}>
            <p className="text-xl font-bold" style={{ color: 'var(--color-forest-green)' }}>{stats.scheduled}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Scheduled</p>
          </div>
          <div className="card-base p-3 text-center" style={{ borderColor: '#d97706' }}>
            <p className="text-xl font-bold" style={{ color: '#d97706' }}>{stats.ongoing}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Ongoing</p>
          </div>
          <div className="card-base p-3 text-center" style={{ borderColor: '#3b82f6' }}>
            <p className="text-xl font-bold" style={{ color: '#3b82f6' }}>{stats.completed}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Completed</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search sessions by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg input-themed"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-lg select-themed"
            >
              <option value="all">All Status</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="ONGOING">Ongoing</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="px-4 py-2 rounded-lg select-themed"
            >
              <option value="all">All Locations</option>
              <option value="ONLINE">Online</option>
              <option value="PHYSICAL">Physical</option>
            </select>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 rounded-lg flex items-center gap-1 transition-colors hover:bg-card-hover"
                style={{ color: 'var(--text-secondary)' }}
              >
                <X size={16} />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Found {filteredSessions.length} session{filteredSessions.length !== 1 ? 's' : ''}
          </p>
          {filteredSessions.length > 0 && (
            <button
              onClick={() => refetch()}
              className="text-xs flex items-center gap-1 hover:underline"
              style={{ color: 'var(--text-muted)' }}
            >
              <span className="inline-block w-3 h-3 rounded-full border" style={{ borderColor: 'var(--border-color)' }} />
              Refresh
            </button>
          )}
        </div>

        {/* Sessions Grid */}
        {filteredSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSessions.map((session) => (
              <SessionCard 
                key={session.id} 
                session={session} 
                onEdit={handleEditSession}
                onViewAttendance={handleViewAttendance}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 card-base">
            <div className="flex justify-center mb-4">
              <Calendar size={64} className="opacity-30" style={{ color: 'var(--text-muted)' }} />
            </div>
            <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              {hasActiveFilters ? 'No matching sessions found' : 'No sessions yet'}
            </h3>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              {hasActiveFilters 
                ? 'Try adjusting your filters' 
                : 'Create your first training session to get started'}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 btn-secondary inline-flex items-center gap-2"
              >
                <X size={16} />
                Clear All Filters
              </button>
            )}
            {!hasActiveFilters && (
              <button 
                onClick={handleCreateSession}
                className="mt-4 btn-primary inline-flex items-center gap-2"
              >
                <Plus size={18} />
                Create Session
              </button>
            )}
          </div>
        )}
      </div>

      {/* Session Form Modal - Replaces CreateSessionModal */}
      <SessionFormModal />
    </>
  );
}