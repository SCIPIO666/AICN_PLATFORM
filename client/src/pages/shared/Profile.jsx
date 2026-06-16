// MyProfile.jsx
// General profile page — shown to all roles.
// Trainers also see a "Trainer profile →" card linking to /profile/trainer.
// Data comes from useMe() (auth store / GET /auth/me).
//
// User shape:
// { id, name, email, phone, county, role, emailVerified,
//   isActive, profilePicture, createdAt, updatedAt }

import { useMe } from '@/hooks'
import { Link } from 'react-router-dom'
import {
  User, Mail, Phone, MapPin, ShieldCheck, CalendarDays,
  BadgeCheck, ChevronRight, AlertCircle, Settings,
} from 'lucide-react'

// ─── helpers ────────────────────────────────────────────────────────────────

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('en-KE', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

const ROLE_LABEL = {
  LEARNER: { label: 'Learner',  color: 'var(--info-text)',    bg: 'var(--info-bg)'    },
  TRAINER: { label: 'Trainer',  color: 'var(--success-text)', bg: 'var(--success-bg)' },
  ADMIN:   { label: 'Admin',    color: 'var(--warning-text)', bg: 'var(--warning-bg)' },
}

// ─── sub-components ─────────────────────────────────────────────────────────

function Avatar({ name, picture }) {
  if (picture) {
    return (
      <img
        src={picture}
        alt={name}
        className="rounded-full object-cover flex-shrink-0"
        style={{ width: 72, height: 72 }}
      />
    )
  }
  const initials = name
    ?.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase() ?? '?'
  return (
    <div
      className="rounded-full flex items-center justify-center flex-shrink-0 text-xl font-bold"
      style={{
        width: 72, height: 72,
        background: 'var(--color-forest-green)',
        color: 'var(--color-neon-volt)',
      }}
    >
      {initials}
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-3.5" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
      <Icon size={15} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
      <div className="flex-1 min-w-0">
        <p className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
        <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
          {value ?? <span style={{ color: 'var(--text-muted)' }}>Not set</span>}
        </p>
      </div>
    </div>
  )
}

// ─── page ────────────────────────────────────────────────────────────────────

export default function Profile() {
  const { data: user, isLoading, error } = useMe()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-page)' }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--color-neon-volt)', borderTopColor: 'transparent' }} />
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading profile…</span>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-page)' }}>
        <div className="flex flex-col items-center gap-2 text-center">
          <AlertCircle size={36} style={{ color: 'var(--error-text)' }} strokeWidth={1.2} />
          <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Could not load profile</p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Try refreshing the page.</p>
        </div>
      </div>
    )
  }

  const role = ROLE_LABEL[user.role] ?? ROLE_LABEL.LEARNER
  const isTrainer = user.role === 'TRAINER'
  const isAdmin   = user.role === 'ADMIN'

  return (
    <div
      className="min-h-screen px-4 py-10 md:px-8 lg:px-12"
      style={{ backgroundColor: 'var(--bg-page)' }}
    >
      <div className="max-w-2xl mx-auto flex flex-col gap-6">

        {/* ── page header ── */}
        <div>
          <span className="label-uppercase flex items-center gap-2 mb-3">
            <User size={13} />
            Account
          </span>
          <h1
            className="text-3xl md:text-4xl font-bold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            My Profile
          </h1>
          <div className="mt-5 h-px w-12" style={{ backgroundColor: 'var(--color-neon-volt)' }} />
        </div>

        {/* ── identity card ── */}
        <div className="card-base p-6">
          <div className="flex items-center gap-4 mb-6">
            <Avatar name={user.name} picture={user.profilePicture} />
            <div className="flex-1 min-w-0">
              <h2
                className="text-xl font-bold leading-tight truncate"
                style={{ color: 'var(--text-primary)' }}
              >
                {user.name}
              </h2>
              <p className="text-sm mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>
                {user.email}
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                {/* role badge */}
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                  style={{ background: role.bg, color: role.color }}
                >
                  <ShieldCheck size={10} />
                  {role.label}
                </span>
                {/* email verified */}
                {user.emailVerified ? (
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                    style={{ background: 'var(--success-bg)', color: 'var(--success-text)' }}
                  >
                    <BadgeCheck size={10} />
                    Verified
                  </span>
                ) : (
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                    style={{ background: 'var(--warning-bg)', color: 'var(--warning-text)' }}
                  >
                    <AlertCircle size={10} />
                    Unverified
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* detail rows */}
          <div>
            <InfoRow icon={Mail}        label="Email address"  value={user.email} />
            <InfoRow icon={Phone}       label="Phone number"   value={user.phone} />
            <InfoRow icon={MapPin}      label="County"         value={user.county} />
            <InfoRow icon={CalendarDays} label="Member since"  value={fmtDate(user.createdAt)} />
          </div>
        </div>

        {/* ── trainer profile card (trainer / admin only) ── */}
        {(isTrainer || isAdmin) && (
          <Link
            to="/profile/trainer"
            className="card-base p-5 flex items-center justify-between gap-4 transition-colors group"
            style={{ textDecoration: 'none' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--card-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-card)')}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--success-bg)' }}
              >
                <BadgeCheck size={16} style={{ color: 'var(--success-text)' }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Trainer profile
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  Bio, skills, availability and session history
                </p>
              </div>
            </div>
            <ChevronRight
              size={16}
              style={{ color: 'var(--text-muted)' }}
              className="flex-shrink-0 transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        )}

        {/* ── settings shortcut ── */}
        <Link
          to="/settings"
          className="card-base p-5 flex items-center justify-between gap-4 transition-colors group"
          style={{ textDecoration: 'none' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--card-hover)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-card)')}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--border-subtle)' }}
            >
              <Settings size={16} style={{ color: 'var(--text-secondary)' }} />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                Account settings
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                Change password and notification preferences
              </p>
            </div>
          </div>
          <ChevronRight
            size={16}
            style={{ color: 'var(--text-muted)' }}
            className="flex-shrink-0 transition-transform group-hover:translate-x-0.5"
          />
        </Link>

      </div>
    </div>
  )
}