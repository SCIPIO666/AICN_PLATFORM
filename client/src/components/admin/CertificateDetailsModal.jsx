
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, User, Calendar, CheckCircle, Download, Mail, Loader2 } from 'lucide-react';
import { useAdminModalStore } from '@/stores/useAdminModalStore';
import { safeFormatDate } from '@/utils/date';
import { toast } from '@/stores/toastStore';
import { downloadCertificateFile } from '@/utils/downloadCertificate';

export default function CertificateDetailsModal() {
  const { isCertificateDetailsOpen, selectedCertificate, closeCertificateDetails } = useAdminModalStore();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(null);

  if (!isCertificateDetailsOpen || !selectedCertificate) return null;

  const handleDownload = async () => {
    if (!selectedCertificate.pdfUrl) {
      toast.info('Certificate PDF is still being prepared');
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(null);

    try {
      await downloadCertificateFile(selectedCertificate, setDownloadProgress);
      toast.success('Certificate downloaded successfully');
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Failed to download certificate';
      toast.error(message);
    } finally {
      setIsDownloading(false);
      setDownloadProgress(null);
    }
  };

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
                {selectedCertificate.certCode}
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
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="btn-primary px-4 py-2 flex items-center gap-2"
            >
              {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
              {isDownloading && downloadProgress ? `${downloadProgress}%` : 'Download'}
            </button>
            <button onClick={closeCertificateDetails} className="btn-secondary px-4 py-2">Close</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
