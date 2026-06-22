
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  Clock, 
  ChevronRight,
  Plus,
  Search,
  Filter,
  X,
  AlertCircle,
  Eye,
  UserCheck,
  Award,
  Edit
} from 'lucide-react';

import { useMyTrainerSessions } from '@/hooks';
import { useTrainerModalStore } from '@/stores/useTrainerModalStore';
import Spinner from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { getSafeDate, safeFormatDate } from '@/utils/date';
import CreateSessionModal from '@/components/modals/CreateSessionModal';

function SessionCard({ session, onEdit }) {
  const date = getSafeDate(session.date);
  const isOnline = session.locationType === 'ONLINE';
  const isFull = session._count?.enrolments >= session.capacity;
  const isPast = date && date < new Date();

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
                  : 'rgba(107, 114, 128, 0.1)',
                color: session.status === 'SCHEDULED' 
                  ? 'var(--color-forest-green)' 
                  : session.status === 'COMPLETED'
                  ? '#3b82f6'
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
              <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-600">
                Online
              </span>
            ) : (
              <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-600">
                Physical
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          <Link
            to={`/trainer/sessions/${session.id}`}
            className="p-2 rounded-lg transition-colors hover:bg-card-hover"
            style={{ color: 'var(--text-secondary)' }}
            title="View Details"
          >
            <Eye size={18} />
          </Link>
          {session.status !== 'COMPLETED' && session.status !== 'CANCELLED' && (
            <>
              <Link
                to={`/trainer/attendance/${session.id}`}
                className="p-2 rounded-lg transition-colors hover:bg-card-hover"
                style={{ color: 'var(--text-secondary)' }}
                title="Mark Attendance"
              >
                <UserCheck size={18} />
              </Link>
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
  const { openCreateSession } = useTrainerModalStore();
  
  const { data, isLoading, error, refetch } = useMyTrainerSessions();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-page)' }}>
        <Spinner />
      </div>
    );
  }

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

  const sessions = data?.data || [];
  
  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
              My Sessions
            </h1>
            <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>
              Manage your training sessions
            </p>
          </div>
          <button 
            onClick={() => openCreateSession()}
            className="btn-primary flex items-center gap-2 px-6 py-2.5"
          >
            <Plus size={18} />
            Create Session
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search sessions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg input-themed"
            />
          </div>
          <div className="flex gap-2">
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
            <Button variant="outline" className="flex items-center gap-2">
              <Filter size={18} />
              More Filters
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
          Found {filteredSessions.length} sessions
        </p>

        {/* Sessions Grid */}
        {filteredSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSessions.map((session) => (
              <SessionCard 
                key={session.id} 
                session={session} 
                onEdit={openCreateSession}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 card-base">
            <Calendar size={48} className="mx-auto mb-4 opacity-50" style={{ color: 'var(--text-muted)' }} />
            <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              No sessions found
            </h3>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your filters' 
                : 'Create your first training session'}
            </p>
            {(searchTerm || statusFilter !== 'all') && (
              <Button 
                variant="ghost" 
                className="mt-4 flex items-center gap-2 mx-auto"
                onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
              >
                <X size={16} />
                Clear Filters
              </Button>
            )}
            {!searchTerm && statusFilter === 'all' && (
              <button 
                onClick={() => openCreateSession()}
                className="mt-4 btn-primary inline-flex items-center gap-2"
              >
                <Plus size={18} />
                Create Session
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create Session Modal */}
      <CreateSessionModal />
    </>
  );
}