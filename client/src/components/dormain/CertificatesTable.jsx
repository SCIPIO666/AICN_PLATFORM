
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { useCertificateUI } from '@/stores/useCertificateUi'
import { getMyCertificates } from '@/api/certificates'
import Spinner from '../ui/Spinner'
import { Award, Download, ExternalLink, AlertCircle, FileX, Inbox } from 'lucide-react'


//helpers
const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

const fmtCode = (code) => (
  <span className="font-mono text-xs tracking-widest">{code}</span>
)


function PdfStatus({ cert }) {
  if (cert.revokedAt) {
    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
        style={{ background: 'var(--error-bg)', color: 'var(--error-text)' }}
      >
        <FileX size={11} />
        Revoked
      </span>
    )
  }

  if (cert.pdfGenerationFailed) {
    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
        style={{ background: 'var(--warning-bg)', color: 'var(--warning-text)' }}
        title={cert.pdfFailureReason ?? 'PDF generation failed'}
      >
        <AlertCircle size={11} />
        PDF failed
      </span>
    )
  }

  if (cert.pdfUrl) {
    return (
      <a
        href={cert.pdfUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold transition-opacity hover:opacity-80"
        style={{ background: 'var(--success-bg)', color: 'var(--success-text)' }}
        aria-label={`Download certificate for ${cert.session.title}`}
      >
        <Download size={11} />
        Download
      </a>
    )
  }

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{ background: 'var(--info-bg)', color: 'var(--info-text)' }}
    >
      Generating…
    </span>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <Inbox size={40} style={{ color: 'var(--text-muted)' }} strokeWidth={1.2} />
      <p className="font-semibold" style={{ color: 'var(--text-secondary)' }}>
        No certificates yet
      </p>
      <p className="text-sm text-center max-w-xs" style={{ color: 'var(--text-muted)' }}>
        Attend a session and mark attendance to earn your first certificate.
      </p>
    </div>
  )
}

function ErrorState({ onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <AlertCircle size={40} style={{ color: 'var(--error-text)' }} strokeWidth={1.2} />
      <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
        Could not load certificates
      </p>
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
        Check your connection and try again.
      </p>
      <button className="btn-outline px-4 py-2 text-sm mt-1" onClick={onRetry}>
        Retry
      </button>
    </div>
  )
}



//table

export default function CertificatesTable() {
  const { openModal } = useCertificateUI()

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['certificates'],
    queryFn: getMyCertificates,
    placeholderData: keepPreviousData,
  })

  const certs = data ?? []


  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner />
      </div>
    )
  }


  if (error) return <ErrorState onRetry={refetch} />


  if (certs.length === 0) return <EmptyState />


  return (
    <div className="card-base overflow-hidden">

      {/* header bar */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{ borderColor: 'var(--border-color)' }}
      >
        <div className="flex items-center gap-2">
          <Award size={16} style={{ color: 'var(--section-label)' }} />
          <span className="label-uppercase">Certificates</span>
        </div>
        <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
          {certs.length} earned
        </span>
      </div>

      {/* ── desktop table ── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              {['Session', 'Skill area', 'Issued', 'Code', 'PDF'].map((h) => (
                <th
                  key={h}
                  className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {certs.map((cert) => (
              <tr
                key={cert.id}
                className="group transition-colors"
                style={{ borderBottom: '1px solid var(--border-subtle)' }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = 'var(--card-hover)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = 'transparent')
                }
              >
                {/* session title */}
                <td className="px-5 py-4 max-w-[220px]">
                  <button
                    className="text-left font-medium leading-snug hover:underline underline-offset-2 line-clamp-2"
                    style={{ color: 'var(--text-primary)' }}
                    onClick={() => openModal('view', cert)}
                  >
                    {cert.session.title}
                    <ExternalLink
                      size={11}
                      className="inline ml-1 opacity-0 group-hover:opacity-60 transition-opacity"
                    />
                  </button>
                </td>

                {/* skill area */}
                <td className="px-5 py-4">
                  <span
                    className="inline-block px-2 py-0.5 rounded text-xs font-medium"
                    style={{
                      background: 'var(--border-subtle)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {cert.session.skillArea}
                  </span>
                </td>

                {/* issued at */}
                <td className="px-5 py-4 whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
                  {fmtDate(cert.issuedAt)}
                </td>

                {/* cert code */}
                <td className="px-5 py-4" style={{ color: 'var(--text-muted)' }}>
                  {fmtCode(cert.certCode)}
                </td>

                {/* pdf action */}
                <td className="px-5 py-4">
                  <PdfStatus cert={cert} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── mobile card list ── */}
      <div className="md:hidden divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
        {certs.map((cert) => (
          <div key={cert.id} className="px-4 py-4 flex flex-col gap-2">
            <button
              className="text-left font-semibold leading-snug hover:underline underline-offset-2"
              style={{ color: 'var(--text-primary)' }}
              onClick={() => openModal('view', cert)}
            >
              {cert.session.title}
            </button>

            <div className="flex flex-wrap items-center gap-2">
              <span
                className="inline-block px-2 py-0.5 rounded text-xs font-medium"
                style={{ background: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
              >
                {cert.session.skillArea}
              </span>
              <PdfStatus cert={cert} />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Issued {fmtDate(cert.issuedAt)}
              </span>
              {fmtCode(cert.certCode)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}