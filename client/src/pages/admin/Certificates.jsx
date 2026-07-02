import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Award, 
  Search, 
  X, 
  AlertCircle, 
  Eye, 
  Download, 
  Calendar, 
  User,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Loader2,
  CheckCircle,
  XCircle,
  Users,
  FileCheck,
  Plus,
  Filter
} from 'lucide-react';

import { 
  useAdminCertificates,
  useCertificateStats,
  useIssueCertificate,
  useBatchIssueCertificates 
} from '@/hooks';
import { useAdminModalStore } from '@/stores/useAdminModalStore';
import Spinner from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { safeFormatDate } from '@/utils/date';
import { toast } from '@/stores/toastStore';
import CertificateDetailsModal from '@/components/admin/CertificateDetailsModal';
import IssueCertificateModal from '@/components/admin/IssueCertificateModal';
import { downloadCertificateFile } from '@/utils/downloadCertificate';

function StatsCard({ icon: Icon, label, value, color, subtitle }) {
  return (
    <div className="card-base p-4 text-center transition-all hover:border-neon-border">
      <div className="flex items-center justify-center mb-2">
        <div className="p-2 rounded-full" style={{ background: `${color}20`, color }}>
          <Icon size={20} />
        </div>
      </div>
      <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
        {value}
      </p>
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{label}</p>
      {subtitle && (
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>
      )}
    </div>
  );
}


function CertificateCard({ certificate, onView, onDownload }) {
  const isRevoked = !!certificate.revokedAt;
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(null);

  const handleDownload = async (e) => {
    e.stopPropagation();
    setIsDownloading(true);
    setDownloadProgress(null);
    try {
      await onDownload(certificate, setDownloadProgress);
    } finally {
      setIsDownloading(false);
      setDownloadProgress(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      onClick={() => onView(certificate)}
      className="card-base p-4 cursor-pointer transition-all hover:border-neon-border"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs"
            style={{
              background: isRevoked ? 'rgba(220, 38, 38, 0.15)' : 'rgba(22, 101, 52, 0.15)',
              color: isRevoked ? '#dc2626' : 'var(--color-forest-green)',
            }}
          >
            {certificate.user?.name?.charAt(0) || 'U'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
              {certificate.user?.name || 'Unknown User'}
            </p>
            <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
              {certificate.user?.email || 'No email'}
            </p>
          </div>
        </div>
        <span
          className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
          style={{
            background: isRevoked ? 'rgba(220, 38, 38, 0.1)' : 'rgba(22, 101, 52, 0.1)',
            color: isRevoked ? '#dc2626' : 'var(--color-forest-green)',
          }}
        >
          {isRevoked ? <XCircle size={12} /> : <CheckCircle size={12} />}
          {isRevoked ? 'Revoked' : 'Active'}
        </span>
      </div>

      <p className="text-sm font-medium truncate mb-1" style={{ color: 'var(--text-primary)' }}>
        {certificate.session?.title || 'Untitled Session'}
      </p>
      <p className="text-xs truncate mb-3" style={{ color: 'var(--text-muted)' }}>
        {certificate.session?.skillArea || ''}
      </p>

      <div className="flex items-center justify-between text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
        <span className="flex items-center gap-1">
          <Calendar size={12} />
          {certificate.issuedAt ? safeFormatDate(certificate.issuedAt, 'PP') : '—'}
        </span>
        <span className="font-mono">{certificate.certCode}</span>
      </div>

      <div className="flex gap-2 pt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 flex items-center justify-center gap-1.5"
          onClick={(e) => { e.stopPropagation(); onView(certificate); }}
        >
          <Eye size={14} />
          View
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 flex items-center justify-center gap-1.5"
          onClick={handleDownload}
          disabled={isDownloading}
        >
          {isDownloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
          {isDownloading && downloadProgress ? `${downloadProgress}%` : 'Download'}
        </Button>
      </div>
    </motion.div>
  );
}

export default function AdminCertificates() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('issuedAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const { openCertificateDetails, openIssueCertificate } = useAdminModalStore();
  
  const { 
    data, 
    isLoading, 
    error, 
    refetch 
  } = useAdminCertificates({
    search: searchTerm,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    sortBy: sortField,
    sortOrder: sortDirection,
    page: currentPage,
    limit: 12,
  });
  
  const { 
    data: statsData, 
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats 
  } = useCertificateStats();

  // Handlers
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refetch(), refetchStats()]);
    setIsRefreshing(false);
    toast.info('Data refreshed');
  };

  const handleDownload = async (certificate, onProgress) => {
    try {
      if (!certificate.pdfUrl) {
        toast.info('Certificate PDF is still being prepared');
        return;
      }

      await downloadCertificateFile(certificate, onProgress);
      toast.success('Certificate downloaded successfully');
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Failed to download certificate';
      toast.error(message);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronDown size={14} className="opacity-30" />;
    return sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  // Process data
  const certificates = data?.data || [];
  const pagination = data?.pagination;
  const stats = statsData?.data || { total: 0, active: 0, revoked: 0, thisMonth: 0 };

  // Loading state
  if (isLoading || statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-page)' }}>
        <Spinner />
      </div>
    );
  }

  // Error state
  if (error || statsError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-page)' }}>
        <div className="text-center max-w-md">
          <AlertCircle size={48} className="mx-auto mb-4" style={{ color: 'var(--error-text)' }} />
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Failed to load certificates
          </h3>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
            {error?.response?.data?.message || error?.message || 'Please try refreshing the page.'}
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={handleRefresh} className="btn-primary">
              <RefreshCw size={16} className="mr-2" />
              Try Again
            </Button>
            <Button 
              onClick={() => window.location.href = '/dashboard/admin'} 
              variant="outline"
            >
              Back to Dashboard
            </Button>
          </div>
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
                Certificate Management
              </h1>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{
                background: 'rgba(22, 101, 52, 0.1)',
                color: 'var(--color-forest-green)'
              }}>
                {stats.total} total
              </span>
            </div>
            <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>
              View, manage, and issue certificates across the platform
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => openIssueCertificate()}
              className="btn-primary flex items-center gap-2"
            >
              <Award size={18} />
              Issue Certificate
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => openIssueCertificate()}
            >
              <Users size={18} />
              Batch Issue
            </Button>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatsCard
            icon={Award}
            label="Total Certificates"
            value={stats.total}
            color="#8b5cf6"
          />
          <StatsCard
            icon={CheckCircle}
            label="Active"
            value={stats.active}
            color="var(--color-forest-green)"
          />
          <StatsCard
            icon={XCircle}
            label="Revoked"
            value={stats.revoked}
            color="#dc2626"
          />
          <StatsCard
            icon={Calendar}
            label="This Month"
            value={stats.thisMonth}
            color="#3b82f6"
            subtitle={`${stats.total > 0 ? Math.round((stats.thisMonth / stats.total) * 100) : 0}% of total`}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by certificate number, session, or learner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg input-themed"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-card-hover"
                style={{ color: 'var(--text-muted)' }}
              >
                <X size={16} />
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-lg select-themed"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="revoked">Revoked</option>
            </select>
            {(searchTerm || statusFilter !== 'all') && (
              <Button
                variant="ghost"
                className="flex items-center gap-2"
                onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
              >
                <X size={16} />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Showing {certificates.length} of {pagination?.total || 0} certificates
          </p>
          <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
            <button
              onClick={() => handleSort('issuedAt')}
              className="flex items-center gap-1 hover:opacity-70"
            >
              Date <SortIcon field="issuedAt" />
            </button>
            <button
              onClick={() => handleSort('userName')}
              className="flex items-center gap-1 hover:opacity-70"
            >
              User <SortIcon field="userName" />
            </button>
            <button
              onClick={() => handleSort('sessionTitle')}
              className="flex items-center gap-1 hover:opacity-70"
            >
              Session <SortIcon field="sessionTitle" />
            </button>
          </div>
        </div>

        {/* Certificates Grid */}
        {certificates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {certificates.map((cert) => (
              <CertificateCard
                key={cert.id}
                certificate={cert}
                onView={openCertificateDetails}
                onDownload={handleDownload}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 card-base">
            <Award size={48} className="mx-auto mb-4 opacity-50" style={{ color: 'var(--text-muted)' }} />
            <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              {searchTerm || statusFilter !== 'all' 
                ? 'No certificates match your filters' 
                : 'No certificates issued yet'}
            </h3>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Issue certificates to learners who have completed sessions'}
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <button
                className="mt-4 btn-primary inline-flex items-center gap-2"
                onClick={() => openIssueCertificate()}
              >
                <Award size={18} />
                Issue First Certificate
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg border transition-colors disabled:opacity-50"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
            >
              Previous
            </button>
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
              disabled={currentPage === pagination.totalPages}
              className="px-3 py-1 rounded-lg border transition-colors disabled:opacity-50"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <CertificateDetailsModal />
      <IssueCertificateModal />
    </>
  );
}
