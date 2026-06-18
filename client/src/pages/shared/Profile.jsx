import { useMe } from '@/hooks'
import { Link } from 'react-router-dom'
import {
   Mail, Phone, MapPin,  CalendarDays,
  BadgeCheck, ChevronRight, AlertCircle, Settings,
  BookOpen, Users, Award, Clock, CheckCircle, TrendingUp,
  Activity, Briefcase,  LogOut
} from 'lucide-react'

// helpers
const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('en-KE', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

const ROLE_LABEL = {
  LEARNER: { label: 'Learner',  color: 'var(--info-text)',    bg: 'var(--info-bg)'    },
  TRAINER: { label: 'Trainer',  color: 'var(--success-text)', bg: 'var(--success-bg)' },
  ADMIN:   { label: 'Admin',    color: 'var(--warning-text)', bg: 'var(--warning-bg)' },
}

//  Avatar 
function Avatar({ name, picture, size = 72 }) {
  if (picture) {
    return (
      <img
        src={picture}
        alt={name}
        className="rounded-full object-cover flex-shrink-0 border-2"
        style={{ 
          width: size, 
          height: size,
          borderColor: 'var(--color-neon-volt)'
        }}
      />
    )
  }
  const initials = name
    ?.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase() ?? '?'
  return (
    <div
      className="rounded-full flex items-center justify-center flex-shrink-0 text-2xl font-bold border-2"
      style={{
        width: size, height: size,
        background: 'var(--color-forest-green)',
        color: 'var(--color-neon-volt)',
        borderColor: 'var(--color-neon-volt)',
      }}
    >
      {initials}
    </div>
  )
}

//Section Header 
function SectionHeader({ label, title }) {
  return (
    <div className="mb-6">
      <span className="label-uppercase flex items-center gap-2">
        {label}
      </span>
      <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
        {title}
      </h2>
      <div
        className="mt-3 h-px w-12"
        style={{ background: 'var(--color-neon-volt)' }}
      />
    </div>
  )
}

// Stat Card 
function StatCard({ icon: Icon, value, label }) {
  return (
    <div className="card-base p-4 text-center">
      <div className="flex items-center justify-center gap-2 mb-1">
        <Icon size={16} style={{ color: 'var(--color-neon-volt)' }} />
        <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          {value}
        </span>
      </div>
      <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
        {label}
      </p>
    </div>
  )
}

//Info Field 
function InfoField({ icon: Icon, label, value }) {
  return (
    <div className="card-base p-4">
      <div className="flex items-center gap-2 mb-1.5">
        <Icon size={14} style={{ color: 'var(--color-neon-volt)' }} />
        <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
          {label}
        </span>
      </div>
      <p className="font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
        {value ?? <span style={{ color: 'var(--text-muted)' }}>Not set</span>}
      </p>
    </div>
  )
}

//Quick Action Card 
function QuickAction({ to, icon: Icon, title, description }) {
  return (
    <Link
      to={to}
      className="card-base p-5 flex items-center justify-between gap-4 transition-all group hover:card-neon"
      style={{ textDecoration: 'none' }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-opacity-20"
          style={{ background: 'var(--border-subtle)' }}
        >
          <Icon size={18} style={{ color: 'var(--text-secondary)' }} />
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            {title}
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {description}
          </p>
        </div>
      </div>
      <ChevronRight
        size={16}
        style={{ color: 'var(--text-muted)' }}
        className="flex-shrink-0 transition-transform group-hover:translate-x-0.5"
      />
    </Link>
  )
}


// Main 
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
  const isAdmin = user.role === 'ADMIN'


  // Stats based on role
  const stats = isAdmin
    ? [
        { icon: Users, value: '1.2k', label: 'Users Managed' },
        { icon: Briefcase, value: '47', label: 'Sessions Created' },
        { icon: CheckCircle, value: '89', label: 'Approvals Processed' },
      ]
    : isTrainer
    ? [
        { icon: Clock, value: '24', label: 'Sessions Conducted' },
        { icon: Users, value: '18', label: 'Learners Trained' },
        { icon: Award, value: '12', label: 'Certificates Issued' },
      ]
    : [
        { icon: BookOpen, value: '12', label: 'Courses' },
        { icon: TrendingUp, value: '5', label: 'Active' },
        { icon: Award, value: '7', label: 'Certs' },
      ]


  return (
    <div
      className="min-h-screen px-4 py-8 md:px-8 lg:px-12"
      style={{ backgroundColor: 'var(--bg-page)' }}
    >
      <div className="max-w-5xl mx-auto flex flex-col gap-6">

        {/* HERO CARD */}
        <div className="card-neon p-6 md:p-8 relative overflow-hidden">
          <div
            className="absolute top-0 right-0 w-48 h-48 opacity-10 rounded-full"
            style={{
              background: 'var(--color-neon-volt)',
              filter: 'blur(60px)',
            }}
          />
          <div className="relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* Left: Avatar + Id */}
              <div className="flex items-center gap-5">
                <Avatar name={user.name} picture={user.profilePicture} size={80} />
                <div>
                  <h1
                    className="text-2xl md:text-3xl font-bold tracking-tight"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {user.name}
                  </h1>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span
                      className="px-3 py-0.5 rounded-full text-xs font-semibold"
                      style={{ background: role.bg, color: role.color }}
                    >
                      {role.label}
                    </span>
    
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                        style={{ background: 'var(--success-bg)', color: 'var(--success-text)' }}
                      >
                        <BadgeCheck size={12} />
                        Verified
                      </span>
                
                  </div>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                    Joined {fmtDate(user.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/*STATS ROW */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, idx) => (
            <StatCard key={idx} {...stat} />
          ))}
        </div>

        {/* TWO-COLUMN LAYOUT  */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* PROFILE INFORMATION */}
          <div>
            <SectionHeader label="PROFILE DETAILS" title="Personal Information" />
            <div className="space-y-3">
              <InfoField icon={Mail} label="Email" value={user.email} />
              <InfoField icon={Phone} label="Phone" value={user.phone} />
              <InfoField icon={MapPin} label="County" value={user.county} />
              <InfoField icon={CalendarDays} label="Member Since" value={fmtDate(user.createdAt)} />
            </div>
          </div>

          {/* ACCOUNT STATUS */}
          <div>
            <SectionHeader label="ACCOUNT STATUS" title="Security & Compliance" />
            <div className="card-base p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Email</span>
                <span className="text-sm font-semibold flex items-center gap-1" style={{ color: 'var(--success-text)' }}>
                  <BadgeCheck size={14} /> Verified
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Role</span>
                <span
                  className="px-3 py-0.5 rounded-full text-xs font-semibold"
                  style={{ background: role.bg, color: role.color }}
                >
                  {role.label}
                </span>
              </div>
  
            </div>
          </div>
        </div>


        {/*QUICK ACTIONS*/}
        <div>
          <SectionHeader label="QUICK ACTIONS" title="Manage Your Account" />
          <div className="grid md:grid-cols-2 gap-4">
            {/* Trainer Profile - only show for trainers & admins */}
            {(isTrainer || isAdmin) && (
              <QuickAction
                to="/profile/trainer"
                icon={Briefcase}
                title="Trainer Profile"
                description="Manage skills, bio & availability"
              />
            )}
            <QuickAction
              to="/dashboard/settings"
              icon={Settings}
              title="Account Settings"
              description="Change password & notification preferences"
            />
            <QuickAction
              to="/dashboard"
              icon={Activity}
              title="Dashboard"
              description="View your learning progress"
            />
            <QuickAction
              to="/logout"
              icon={LogOut}
              title="Sign Out"
              description="Secure logout from your account"
            />
          </div>
        </div>

      </div>
    </div>
  )
}