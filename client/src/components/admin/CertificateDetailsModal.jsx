
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, User, Calendar, CheckCircle, Download, Mail } from 'lucide-react';
import { useAdminModalStore } from '@/stores/useAdminModalStore';
import { safeFormatDate } from '@/utils/date';

export default function CertificateDetailsModal() {
  const { isCertificateDetailsOpen, selectedCertificate, closeCertificateDetails } = useAdminModalStore();

  if (!isCertificateDetailsOpen || !selectedCertificate) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4"
        onClick={closeCertificateDetails}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="card-base shadow-elevated max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-2">
              <Award size={20} style={{ color: 'var(--color-forest-green)' }} />
              <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Certificate</h2>
            </div>
            <button onClick={closeCertificateDetails} className="p-2 rounded-lg hover:bg-card-hover transition-colors">
              <X size={20} style={{ color: 'var(--text-secondary)' }} />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div className="text-center p-6 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
              <Award size={48} style={{ color: 'var(--color-forest-green)' }} className="mx-auto mb-2" />
              <p className="font-mono text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                {selectedCertificate.certificateNumber}
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Certificate Number</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
                <User size={16} style={{ color: 'var(--color-forest-green)' }} />
                <div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Recipient</p>
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    {selectedCertificate.user?.name || 'Unknown'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
                <Mail size={16} style={{ color: 'var(--color-forest-green)' }} />
                <div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Email</p>
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    {selectedCertificate.user?.email || 'No email'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
                <Calendar size={16} style={{ color: 'var(--color-forest-green)' }} />
                <div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Issued</p>
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    {selectedCertificate.issuedAt ? safeFormatDate(selectedCertificate.issuedAt, 'PPP') : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
                <CheckCircle size={16} style={{ color: 'var(--color-forest-green)' }} />
                <div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Status</p>
                  <p className="font-medium text-green-600">Verified</p>
                </div>
              </div>
            </div>

            {selectedCertificate.session && (
              <div className="p-4 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Session</p>
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{selectedCertificate.session.title}</p>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 p-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <button className="btn-primary px-4 py-2 flex items-center gap-2">
              <Download size={16} />
              Download
            </button>
            <button onClick={closeCertificateDetails} className="btn-secondary px-4 py-2">Close</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}