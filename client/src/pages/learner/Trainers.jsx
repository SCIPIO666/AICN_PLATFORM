import { useTrainers } from '@/hooks'
import { Users, Wifi, MapPin, CheckCircle2, AlertCircle, Inbox, Star, Clock } from 'lucide-react'

//helpers

const AVAILABILITY_LABEL = {
  weekdays:    { label: 'Weekdays', icon: Clock },
  weekends:    { label: 'Weekends', icon: Clock },
  'online-only': { label: 'Online only', icon: Wifi },
}

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('en-KE', { month: 'long', year: 'numeric' })

//stock tech images 

const TECH_IMAGES = [
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1488590528505-98d2b853aba4?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1581092335879-44f7a3b0b8d6?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1512758017271-d7b84c2113f1?w=800&h=600&fit=crop',
]

//consistent image for trainer 

const getTrainerImage = (trainerId, name) => {
  const hash = (trainerId || name).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return TECH_IMAGES[hash % TECH_IMAGES.length]
}

//skill pill 

function SkillPill({ label }) {
  return (
    <span
      className="inline-block px-2.5 py-1 rounded text-xs font-medium border"
      style={{
        color: 'var(--color-neon-volt)',
        borderColor: 'var(--color-neon-volt)',
        background: 'rgba(250, 255, 105, 0.05)',
        letterSpacing: '0.02em',
      }}
    >
      {label}
    </span>
  )
}

// card

function TrainerCard({ trainer }) {
  const avail = AVAILABILITY_LABEL[trainer.availability] ?? { label: trainer.availability, icon: MapPin }
  const AvailabilityIcon = avail.icon || MapPin
  const imageUrl = getTrainerImage(trainer.id, trainer.name)

  return (
    <article
      className="group card-base overflow-hidden transition-all duration-300"
      style={{ 
        cursor: 'default',
        background: 'var(--bg-card)',
        borderColor: 'var(--border-color)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = 'var(--shadow-elevated)'
        e.currentTarget.style.borderColor = 'var(--color-neon-volt)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.borderColor = 'var(--border-color)'
      }}
    >
      {/* Hero Image Section */}
      <div 
        className="relative w-full overflow-hidden"
        style={{ 
          height: '224px',
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Gradient overlay for text readability */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.8) 100%)',
          }}
        />
        
        {/* Name overlay on image */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 
            className="text-xl font-bold leading-tight"
            style={{ color: 'var(--pure-white)' }}
          >
            {trainer.name}
          </h3>
          
          <div className="flex items-center gap-2 mt-1">
            <AvailabilityIcon size={13} className="text-neon-volt" />
            <span 
              className="text-xs font-medium"
              style={{ color: 'rgba(255,255,255,0.85)' }}
            >
              {avail.label}
            </span>
          </div>
        </div>

        {/* session badge*/}
        <div 
          className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-sm"
          style={{
            background: 'rgba(0, 0, 0, 0.6)',
            border: '1px solid var(--color-neon-volt)',
            boxShadow: '0 0 20px rgba(250, 255, 105, 0.1)',
          }}
        >
          <Star size={14} className="text-neon-volt" />
          <span 
            className="text-sm font-bold"
            style={{ color: 'var(--color-neon-volt)' }}
          >
            {trainer.totalCompletedSessions}
          </span>
          <span 
            className="text-[10px] font-medium"
            style={{ color: 'rgba(255,255,255,0.6)' }}
          >
            {trainer.totalCompletedSessions === 1 ? 'session' : 'sessions'}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col gap-4">
        {/* Bio */}
        <p
          className="text-sm leading-relaxed line-clamp-3"
          style={{ color: 'var(--text-secondary)' }}
        >
          {trainer.bio}
        </p>

        {/* Skills */}
        {trainer.skills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {trainer.skills.map((s) => (
              <SkillPill key={s} label={s} />
            ))}
          </div>
        )}

        {/* Footer - joined date */}
        <div
          className="pt-3 mt-auto border-t text-xs flex items-center justify-between"
          style={{
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-muted)',
          }}
        >
          <span>Trainer since {fmtDate(trainer.joinedAt)}</span>
          <span 
            className="flex items-center gap-1 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ color: 'var(--color-neon-volt)' }}
          >
            <CheckCircle2 size={12} />
            Verified
          </span>
        </div>
      </div>
    </article>
  )
}

// states 

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
    <div className="card-base overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div 
        className="w-full"
        style={{ 
          height: '224px',
          background: 'var(--border-color)',
        }}
      />
      
      {/* Content skeleton */}
      <div className="p-5 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="h-3 rounded w-full" style={{ background: 'var(--border-subtle)' }} />
          <div className="h-3 rounded w-5/6" style={{ background: 'var(--border-subtle)' }} />
          <div className="h-3 rounded w-4/6" style={{ background: 'var(--border-subtle)' }} />
        </div>
        <div className="flex gap-1.5">
          {[60, 80, 50].map((w) => (
            <div key={w} className="h-6 rounded" style={{ width: w, background: 'var(--border-color)' }} />
          ))}
        </div>
        <div className="pt-3 border-t flex justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="h-2.5 rounded w-1/3" style={{ background: 'var(--border-subtle)' }} />
          <div className="h-2.5 rounded w-1/4" style={{ background: 'var(--border-subtle)' }} />
        </div>
      </div>
    </div>
  )
}

// page 
export default function Trainers() {
  const { data, isLoading, error, refetch } = useTrainers()
  const trainers = data ?? []

  return (
    <div
      className="min-h-screen px-4 py-10 md:px-8 lg:px-12"
      style={{ backgroundColor: 'var(--bg-page)' }}
    >
      <div className="max-w-7xl mx-auto">

        {/* header */}
        <div className="mb-10">
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

            {/* counted only when data is loaded */}
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


       {/* grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <ErrorState onRetry={refetch} />
        ) : trainers.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainers.map((trainer) => (
              <TrainerCard key={trainer.id} trainer={trainer} />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}