// src/pages/admin/Certificates.jsx
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
  Filter,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Loader2,
  CheckCircle,
  XCircle,
  FileCheck,
  Users
} from 'lucide-react';

import { useMyCertificates, useVerifyCertificate, useIssueCertificate, useBatchIssueCertificates } from '@/hooks';
import { useAdminModalStore } from '@/stores/useAdminModalStore';
import Spinner from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { safeFormatDate, safeFormatRelative } from '@/utils/date';
import { toast } from '@/stores/toastStore';
import CertificateDetailsModal from '@/components/admin/CertificateDetailsModal';

// ============================================================
// Certificate Card Component
// ============================================================
function CertificateCard({ certificate, onView, onDownload }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await onDownload(certificate);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="card-base p-6 transition-all cursor-pointer"
      onClick={() => onView(certificate)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Award size={18} style={{ color: 'var(--color-forest-green)' }} />
            <h3 className="font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
              {certificate.certCode || certificate.certificateNumber || 'N/A'}
            </h3>
          </div>
          
          <p className="text-sm mt-1 truncate" style={{ color: 'var(--text-secondary)' }}>
            {certificate.session?.title || 'Session'}
          </p>
          
          {certificate.user && (
            <p className="text-sm flex items-center gap-1 mt-1" style={{ color: 'var(--text-muted)' }}>
              <User size={14} />
              {certificate.user.name}
            </p>
          )}
          
          <div className="flex flex-wrap gap-3 mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {certificate.issuedAt ? safeFormatDate(certificate.issuedAt, 'PPP') : 'No date'}
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle size={12} style={{ color: 'var(--color-forest-green)' }} />
              {certificate.revokedAt ? 'Revoked' : 'Active'}
            </span>
          </div>
        </div>
        
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView(certificate);
            }}
            className="p-2 rounded-lg transition-colors hover:bg-card-hover"
            style={{ color: 'var(--text-secondary)' }}
            title="View Details"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDownload();
            }}
            disabled={isDownloading}
            className="p-2 rounded-lg transition-colors hover:bg-card-hover disabled:opacity-50"
            style={{ color: 'var(--text-secondary)' }}
            title="Download PDF"
          >
            {isDownloading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Download size={18} />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================
// Stats Card Component
// ============================================================
function StatsCard({ icon: Icon, label, value, color, subtitle }) {
  return (
    <div className="card-base p-4 text-center">
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

// ============================================================
// Main Admin Certificates Component
// ============================================================
export default function AdminCertificates() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('issuedAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { openCertificateDetails } = useAdminModalStore();
  const { data, isLoading, error, refetch } = useMyCertificates();
  const { mutate: issueCertificate, isPending: isIssuing } = useIssueCertificate();
  const { mutate: batchIssue, isPending: isBatchIssuing } = useBatchIssueCertificates();

  // Handle sort
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

  // Process certificates
  const certificates = data?.data || [];
  
  // Filter certificates
  const filteredCertificates = useMemo(() => {
    let filtered = certificates;

    if (searchTerm) {
      filtered = filtered.filter(cert => 
        cert.certCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.certificateNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.session?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(cert => {
        if (statusFilter === 'active') return !cert.revokedAt;
        if (statusFilter === 'revoked') return !!cert.revokedAt;
        return true;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal, bVal;
      switch (sortField) {
        case 'certCode':
          aVal = a.certCode || a.certificateNumber || '';
          bVal = b.certCode || b.certificateNumber || '';
          break;
        case 'userName':
          aVal = a.user?.name || '';
          bVal = b.user?.name || '';
          break;
        case 'sessionTitle':
          aVal = a.session?.title || '';
          bVal = b.session?.title || '';
          break;
        case 'issuedAt':
          aVal = a.issuedAt ? new Date(a.issuedAt).getTime() : 0;
          bVal = b.issuedAt ? new Date(b.issuedAt).getTime() : 0;
          break;
        default:
          aVal = a.issuedAt ? new Date(a.issuedAt).getTime() : 0;
          bVal = b.issuedAt ? new Date(b.issuedAt).getTime() : 0;
      }
      return sortDirection === 'asc' 
        ? (aVal > bVal ? 1 : -1)
        : (aVal < bVal ? 1 : -1);
    });

    return filtered;
  }, [certificates, searchTerm, statusFilter, sortField, sortDirection]);

  // Stats
  const stats = useMemo(() => ({
    total: certificates.length,
    active: certificates.filter(c => !c.revokedAt).length,
    revoked: certificates.filter(c => c.revokedAt).length,
    thisMonth: certificates.filter(c => {
      if (!c.issuedAt) return false;
      const now = new Date();
      const issued = new Date(c.issuedAt);
      return issued.getMonth() === now.getMonth() && 
             issued.getFullYear() === now.getFullYear();
    }).length,
  }), [certificates]);

  // Handlers
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const handleDownload = async (certificate) => {
    try {
      // Implementation for PDF download
      toast.info('Downloading certificate...');
      // Simulate download
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Certificate downloaded successfully');
    } catch (error) {
      toast.error('Failed to download certificate');
    }
  };

  const handleIssueCertificate = () => {
    // Open modal to issue certificate
    toast.info('Opening certificate issuance...');
  };

  const handleBatchIssue = () => {
    // Open modal to batch issue
    toast.info('Opening batch issuance...');
  };

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
            Failed to load certificates
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
              onClick={handleIssueCertificate}
              className="btn-primary flex items-center gap-2"
            >
              <Award size={18} />
              Issue Certificate
            </Button>
            <Button
              onClick={handleBatchIssue}
              variant="outline"
              className="flex items-center gap-2"
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
            Showing {filteredCertificates.length} of {certificates.length} certificates
          </p>
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
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
        {filteredCertificates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCertificates.map((cert) => (
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
                onClick={handleIssueCertificate}
                className="mt-4 btn-primary inline-flex items-center gap-2"
              >
                <Award size={18} />
                Issue First Certificate
              </button>
            )}
          </div>
        )}
      </div>

      {/* Certificate Details Modal */}
      <CertificateDetailsModal />
    </>
  );
}