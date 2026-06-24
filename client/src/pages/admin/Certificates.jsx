// src/pages/admin/Certificates.jsx (Updated with new hooks)
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

import { 
  useAdminCertificates,      // NEW - uses new endpoint
  useCertificateStats,       // NEW - uses stats endpoint
  useIssueCertificate, 
  useBatchIssueCertificates 
} from '@/hooks';
import { useAdminModalStore } from '@/stores/useAdminModalStore';
import Spinner from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { safeFormatDate } from '@/utils/date';
import { toast } from '@/stores/toastStore';
import CertificateDetailsModal from '@/components/admin/CertificateDetailsModal';

// ... CertificateCard and StatsCard components remain the same ...

export default function AdminCertificates() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('issuedAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const { openCertificateDetails } = useAdminModalStore();
  
  // ✅ NEW: Use admin certificates hook instead of user certificates
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
  
  // ✅ NEW: Use stats hook
  const { 
    data: statsData, 
    isLoading: statsLoading,
    refetch: refetchStats 
  } = useCertificateStats();

  // ... rest of the component remains the same ...

  const certificates = data?.data || [];
  const pagination = data?.pagination;
  const stats = statsData?.data || { total: 0, active: 0, revoked: 0, thisMonth: 0 };

  // ... handlers remain the same ...

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-8">
        {/* Header - same */}
        {/* Stats Cards - uses statsData */}
        {/* Filters - same */}
        {/* Results Count - uses pagination */}
        {/* Certificates Grid - uses certificates */}
        {/* Pagination - new */}
      </div>
      <CertificateDetailsModal />
    </>
  );
}