
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Search, X, AlertCircle, Eye, Download, Calendar, User } from 'lucide-react';
import { useMyCertificates } from '@/hooks';
import { useAdminModalStore } from '@/stores/useAdminModalStore';
import Spinner from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { safeFormatDate } from '@/utils/date';
import CertificateDetailsModal from '@/components/admin/CertificateDetailsModal';

function CertificateCard({ certificate, onView }) {
  return (
    <motion.div whileHover={{ y: -4 }} className="card-base p-6 transition-all cursor-pointer" onClick={() => onView(certificate)}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Award size={18} style={{ color: 'var(--color-forest-green)' }} />
            <h3 className="font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{certificate.certificateNumber}</h3>
          </div>
          <p className="text-sm mt-1 truncate" style={{ color: 'var(--text-secondary)' }}>{certificate.session?.title || 'Session'}</p>
          {certificate.user && <p className="text-sm flex items-center gap-1 mt-1" style={{ color: 'var(--text-muted)' }}><User size={14} />{certificate.user.name}</p>}
          <div className="flex flex-wrap gap-3 mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span className="flex items-center gap-1"><Calendar size={12} />{certificate.issuedAt ? safeFormatDate(certificate.issuedAt, 'PPP') : 'No date'}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 rounded-lg hover:bg-card-hover" style={{ color: 'var(--text-secondary)' }}><Eye size={18} /></button>
          <button className="p-2 rounded-lg hover:bg-card-hover" style={{ color: 'var(--text-secondary)' }}><Download size={18} /></button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Certificates() {
  const [searchTerm, setSearchTerm] = useState('');
  const { openCertificateDetails } = useAdminModalStore();
  const { data, isLoading, error, refetch } = useMyCertificates();

  if (isLoading) return <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-page)' }}><Spinner /></div>;
  if (error) return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-page)' }}>
      <div className="text-center max-w-md">
        <AlertCircle size={48} className="mx-auto mb-4" style={{ color: 'var(--error-text)' }} />
        <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Failed to load certificates</h3>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    </div>
  );

  const certificates = data?.data || [];
  const filteredCertificates = certificates.filter(cert => 
    cert.certificateNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.session?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Certificates</h1>
            <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>View and manage issued certificates</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input type="text" placeholder="Search certificates..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg input-themed" />
          </div>
          {searchTerm && (
            <Button variant="ghost" className="flex items-center gap-2" onClick={() => setSearchTerm('')}>
              <X size={16} /> Clear
            </Button>
          )}
        </div>

        {filteredCertificates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCertificates.map((cert) => <CertificateCard key={cert.id} certificate={cert} onView={openCertificateDetails} />)}
          </div>
        ) : (
          <div className="text-center py-12 card-base">
            <Award size={48} className="mx-auto mb-4 opacity-50" style={{ color: 'var(--text-muted)' }} />
            <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>No certificates found</h3>
          </div>
        )}
      </div>

      <CertificateDetailsModal />
    </>
  );
}