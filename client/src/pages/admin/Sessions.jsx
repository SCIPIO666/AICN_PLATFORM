
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Search, Filter, X, AlertCircle, Eye, Users, Clock, MapPin, Monitor, Plus } from 'lucide-react';
import { useSessions } from '@/hooks';
import { useAdminModalStore } from '@/stores/useAdminModalStore';
import Spinner from '@/components/ui/Spinner';
import { Button } from '@/components/ui/button';
import { getSafeDate, safeFormatDate } from '@/utils/date';
import SessionDetailsModal from '@/components/admin/SessionDetailsModal';
import SessionFormModal from '@/components/modals/SessionFormModal';

function SessionCard({ session, onView }) {
  const date = getSafeDate(session.date);
  const statusColors = {
    SCHEDULED: { bg: 'rgba(22,101,52,0.1)', color: 'var(--color-forest-green)' },
    ONGOING: { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6' },
    COMPLETED: { bg: 'rgba(107,114,128,0.1)', color: 'var(--text-muted)' },
    CANCELLED: { bg: 'rgba(220,38,38,0.1)', color: '#dc2626' },
  };
  const statusInfo = statusColors[session.status] || statusColors.SCHEDULED;

  return (
    <motion.div whileHover={{ y: -4 }} className="card-base p-6 transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold truncate" style={{ color: 'var(--text-primary)' }}>{session.title}</h3>
          <div className="flex flex-wrap gap-3 mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            {date && <span className="flex items-center gap-1"><Calendar size={14} />{safeFormatDate(date, 'MMM d, yyyy')}</span>}
            <span className="flex items-center gap-1"><Clock size={14} />{session.durationMins} min</span>
            <span className="flex items-center gap-1"><Users size={14} />{session._count?.enrolments || 0}/{session.capacity}</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="px-2 py-1 rounded text-xs font-medium" style={{ background: statusInfo.bg, color: statusInfo.color }}>{session.status}</span>
            {session.locationType === 'ONLINE' ? (
              <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-600 flex items-center gap-1"><Monitor size={12} />Online</span>
            ) : (
              <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-600 flex items-center gap-1"><MapPin size={12} />Physical</span>
            )}
          </div>
        </div>
        <button onClick={() => onView(session)} className="flex-shrink-0 p-2 rounded-lg transition-colors hover:bg-card-hover" style={{ color: 'var(--text-secondary)' }}>
          <Eye size={18} />
        </button>
      </div>
    </motion.div>
  );
}

export default function Sessions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { openSessionDetails, openSessionForm } = useAdminModalStore();
  const { data, isLoading, error, refetch } = useSessions({ search: searchTerm, status: statusFilter !== 'all' ? statusFilter : undefined });

  if (isLoading) return <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-page)' }}><Spinner /></div>;
  if (error) return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-page)' }}>
      <div className="text-center max-w-md">
        <AlertCircle size={48} className="mx-auto mb-4" style={{ color: 'var(--error-text)' }} />
        <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Failed to load sessions</h3>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    </div>
  );

  const sessions = data?.data || [];

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Sessions</h1>
            <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>Manage all training sessions</p>
          </div>
          <button onClick={() => openSessionForm()} className="btn-primary flex items-center gap-2 px-6 py-2.5">
            <Plus size={18} /> Create Session
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input type="text" placeholder="Search sessions..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg input-themed" />
          </div>
          <div className="flex gap-2">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 rounded-lg select-themed">
              <option value="all">All Status</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="ONGOING">Ongoing</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            {(searchTerm || statusFilter !== 'all') && (
              <Button variant="ghost" className="flex items-center gap-2" onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}>
                <X size={16} /> Clear
              </Button>
            )}
          </div>
        </div>

        {sessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sessions.map((session) => <SessionCard key={session.id} session={session} onView={openSessionDetails} />)}
          </div>
        ) : (
          <div className="text-center py-12 card-base">
            <Calendar size={48} className="mx-auto mb-4 opacity-50" style={{ color: 'var(--text-muted)' }} />
            <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>No sessions found</h3>
          </div>
        )}
      </div>

      {/* Modals */}
      <SessionDetailsModal />
      <SessionFormModal />
    </>
  );
}