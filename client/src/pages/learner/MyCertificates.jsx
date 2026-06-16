import CertificatesTable from '@/components/dormain/CertificatesTable'
import { Award } from 'lucide-react'

export default function MyCertificates() {
  return (
    <div
      className="min-h-screen px-4 py-10 md:px-8 lg:px-12"
      style={{ backgroundColor: 'var(--bg-page)' }}
    >
      {/* page header*/}
      <div className="mb-8 max-w-5xl mx-auto">


        <span className="label-uppercase flex items-center gap-2 mb-3">
          <Award size={13} />
          My achievements
        </span>

        {/* headline */}
        <h1
          className="text-3xl md:text-4xl font-bold leading-tight tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          Certificates
        </h1>


        <p
          className="mt-2 text-sm md:text-base max-w-lg"
          style={{ color: 'var(--text-muted)' }}
        >
          Every certificate here is tied to a session you attended.
          Download the PDF or share the code to verify your credential.
        </p>


        <div
          className="mt-5 h-px w-12"
          style={{ backgroundColor: 'var(--color-neon-volt)' }}
        />
      </div>

      <div className="max-w-5xl mx-auto">
        <CertificatesTable />
      </div>
    </div>
  )
}