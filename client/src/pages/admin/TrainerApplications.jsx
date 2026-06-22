
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Search, Filter, X, AlertCircle, Eye, CheckCircle, XCircle, Calendar, Mail } from 'lucide-react';
import { useTrainerApplications } from '@/hooks';
import { useAdminModalStore } from '@/stores/useAdminModalStore';
import Spinner from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { safeFormatRelative } from '@/utils/date';
import ApplicationDetailsModal from '@/components/admin/ApplicationDetailsModal';

function ApplicationCard({ application, onView }) {
  const statusColors = {
    PENDING: { bg: 'rgba(251,191,36,0.1)', color: '#d97706', label: 'Pending' },
    APPROVED: { bg: 'rgba(22,101,52,0.1)', color: 'var(--color-forest-green)', label: 'Approved' },
    REJECTED: { bg: 'rgba(220,38,38,0.1)', color: '#dc2626', label: 'Rejected' },
  };
  const statusInfo = statusColors[application.status] || statusColors.PENDING;

  return (
    <motion.div whileHover={{ y: -4 }} className="card-base p-6 transition-all cursor-pointer" onClick={() => onView(application)}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: 'var(--color-forest-green)', color: 'white' }}>
              {application.user?.name?.charAt(0) || 'A'}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold truncate" style={{ color: 'var(--text-primary)' }}>{application.user?.name || 'Unknown'}</h3>
              <p className="text-sm truncate flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}><Mail size={14} />{application.user?.email}</p>
            </div>
          </div>
          <div className="mt-3 space-y-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <p><strong style={{ color: 'var(--text-primary)' }}>Skill Area:</strong> {application.skillArea || 'N/A'}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Applied {safeFormatRelative(application.createdAt)}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: statusInfo.bg, color: statusInfo.color }}>{statusInfo.label}</span>
          <button className="text-sm flex items-center gap-1 hover:underline" style={{ color: 'var(--color-forest-green)' }}>
            View <Eye size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function TrainerApplications() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { openApplicationDetails } = useAdminModalStore();
  const { data, isLoading, error, refetch } = useTrainerApplications({ search: searchTerm, status: statusFilter !== 'all' ? statusFilter : undefined });

  if (isLoading) return <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-page)' }}><Spinner /></div>;
  if (error) return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-page)' }}>
      <div className="text-center max-w-md">
        <AlertCircle size={48} className="mx-auto mb-4" style={{ color: 'var(--error-text)' }} />
        <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Failed to load applications</h3>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    </div>
  );

  const applications = data?.data || [];
  const pendingCount = applications.filter(a => a.status === 'PENDING').length;

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Trainer Applications</h1>
            <p className="mt-1 flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
              Review and manage trainer applications
              {pendingCount > 0 && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-600">{pendingCount} pending</span>}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input type="text" placeholder="Search applications..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg input-themed" />
          </div>
          <div className="flex gap-2">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 rounded-lg select-themed">
              <option value="all">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
            {(searchTerm || statusFilter !== 'all') && (
              <Button variant="ghost" className="flex items-center gap-2" onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}>
                <X size={16} /> Clear
              </Button>
            )}
          </div>
        </div>

        {applications.length > 0 ? (
          <div className="space-y-4">
            {applications.map((application) => <ApplicationCard key={application.id} application={application} onView={openApplicationDetails} />)}
          </div>
        ) : (
          <div className="text-center py-12 card-base">
            <Briefcase size={48} className="mx-auto mb-4 opacity-50" style={{ color: 'var(--text-muted)' }} />
            <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>No applications found</h3>
          </div>
        )}
      </div>

      <ApplicationDetailsModal />
    </>
  );
}