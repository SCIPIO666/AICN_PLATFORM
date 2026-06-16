import { useTrainers } from '@/hooks'
import { Users, Wifi, MapPin, CheckCircle2, AlertCircle, Inbox } from 'lucide-react'

// ─── helpers ────────────────────────────────────────────────────────────────

const AVAILABILITY_LABEL = {
  weekdays:    { label: 'Weekdays',    },
  weekends:    { label: 'Weekends',    },
  'online-only': { label: 'Online only', },
}

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('en-KE', { month: 'long', year: 'numeric' })

// ─── avatar ─────────────────────────────────────────────────────────────────

function Avatar({ name, picture, size = 48 }) {
  if (picture) {
    return (
      <img
        src={picture}
        alt={name}
        width={size}
        height={size}
        className="rounded-full object-cover flex-shrink-0"
        style={{ width: size, height: size }}
      />
    )
  }
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <div
      className="rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm"
      style={{
        width: size,
        height: size,
        background: 'var(--color-forest-green)',
        color: 'var(--color-neon-volt)',
        letterSpacing: '0.05em',
      }}
    >
      {initials}
    </div>
  )
}

// ─── skill pill ─────────────────────────────────────────────────────────────

function SkillPill({ label }) {
  return (
    <span
      className="inline-block px-2 py-0.5 rounded text-xs font-medium"
      style={{
        background: 'var(--border-subtle)',
        color: 'var(--text-secondary)',
        border: '1px solid var(--border-color)',
      }}
    >
      {label}
    </span>
  )
}

// ─── trainer card ────────────────────────────────────────────────────────────

function TrainerCard({ trainer }) {
  const avail = AVAILABILITY_LABEL[trainer.availability] ?? { label: trainer.availability }
  const isOnline = trainer.availability === 'online-only'

  return (
    <article
      className="card-base p-5 flex flex-col gap-4 transition-colors"
      style={{ cursor: 'default' }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--card-hover)')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-card)')}
    >
      {/* top row — avatar + name + availability */}
      <div className="flex items-start gap-3">
        <Avatar name={trainer.name} picture={trainer.profilePicture} size={44} />

        <div className="flex-1 min-w-0">
          <p
            className="font-semibold leading-snug truncate"
            style={{ color: 'var(--text-primary)' }}
          >
            {trainer.name}
          </p>
          <span
            className="inline-flex items-center gap-1 mt-0.5 text-xs font-medium"
            style={{ color: isOnline ? 'var(--info-text)' : 'var(--text-muted)' }}
          >
            {isOnline ? <Wifi size={11} /> : <MapPin size={11} />}
            {avail.label}
          </span>
        </div>

        {/* sessions badge */}
        <div className="flex flex-col items-end flex-shrink-0">
          <span
            className="text-xl font-bold leading-none"
            style={{ color: 'var(--color-neon-volt)', filter: 'brightness(0.85)' }}
          >
            {trainer.totalCompletedSessions}
          </span>
          <span className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {trainer.totalCompletedSessions === 1 ? 'session' : 'sessions'}
          </span>
        </div>
      </div>

      {/* bio */}
      <p
        className="text-sm leading-relaxed line-clamp-3"
        style={{ color: 'var(--text-secondary)' }}
      >
        {trainer.bio}
      </p>

      {/* skills */}
      {trainer.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {trainer.skills.map((s) => (
            <SkillPill key={s} label={s} />
          ))}
        </div>
      )}

      {/* footer — joined */}
      <div
        className="pt-3 mt-auto border-t text-xs"
        style={{
          borderColor: 'var(--border-subtle)',
          color: 'var(--text-muted)',
        }}
      >
        Trainer since {fmtDate(trainer.joinedAt)}
      </div>
    </article>
  )
}

// ─── states ─────────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <Inbox size={40} style={{ color: 'var(--text-muted)' }} strokeWidth={1.2} />
      <p className="font-semibold" style={{ color: 'var(--text-secondary)' }}>
        No trainers yet
      </p>
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
        Check back soon — new trainers are reviewed regularly.
      </p>
    </div>
  )
}

function ErrorState({ onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <AlertCircle size={40} style={{ color: 'var(--error-text)' }} strokeWidth={1.2} />
      <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
        Could not load trainers
      </p>
      <button className="btn-outline px-4 py-2 text-sm mt-1" onClick={onRetry}>
        Retry
      </button>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="card-base p-5 flex flex-col gap-4 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="rounded-full flex-shrink-0" style={{ width: 44, height: 44, background: 'var(--border-color)' }} />
        <div className="flex-1 flex flex-col gap-2 pt-1">
          <div className="h-3 rounded w-2/3" style={{ background: 'var(--border-color)' }} />
          <div className="h-2.5 rounded w-1/3" style={{ background: 'var(--border-subtle)' }} />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-2.5 rounded w-full" style={{ background: 'var(--border-subtle)' }} />
        <div className="h-2.5 rounded w-5/6" style={{ background: 'var(--border-subtle)' }} />
        <div className="h-2.5 rounded w-4/6" style={{ background: 'var(--border-subtle)' }} />
      </div>
      <div className="flex gap-1.5">
        {[60, 80, 50].map((w) => (
          <div key={w} className="h-5 rounded" style={{ width: w, background: 'var(--border-color)' }} />
        ))}
      </div>
    </div>
  )
}

// ─── page ────────────────────────────────────────────────────────────────────

export default function Trainers() {
  const { data, isLoading, error, refetch } = useTrainers()
  const trainers = data ?? []

  return (
    <div
      className="min-h-screen px-4 py-10 md:px-8 lg:px-12"
      style={{ backgroundColor: 'var(--bg-page)' }}
    >
      <div className="max-w-6xl mx-auto">

        {/* ── header ── */}
        <div className="mb-8">
          <span className="label-uppercase flex items-center gap-2 mb-3">
            <Users size={13} />
            Our team
          </span>

          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h1
                className="text-3xl md:text-4xl font-bold tracking-tight leading-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                Meet the trainers
              </h1>
              <p
                className="mt-2 text-sm md:text-base max-w-lg"
                style={{ color: 'var(--text-muted)' }}
              >
                Practitioners who have been through the programme themselves —
                now passing it on.
              </p>
            </div>

            {/* live count — only when data is loaded */}
            {!isLoading && !error && trainers.length > 0 && (
              <div className="flex items-center gap-2 flex-shrink-0">
                <CheckCircle2 size={14} style={{ color: 'var(--section-label)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {trainers.length} active {trainers.length === 1 ? 'trainer' : 'trainers'}
                </span>
              </div>
            )}
          </div>

          <div
            className="mt-5 h-px w-12"
            style={{ backgroundColor: 'var(--color-neon-volt)' }}
          />
        </div>

        {/* ── grid ── */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <ErrorState onRetry={refetch} />
        ) : trainers.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {trainers.map((trainer) => (
              <TrainerCard key={trainer.id} trainer={trainer} />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}