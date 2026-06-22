
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Monitor, Clock, Users, UserCheck, Award, Briefcase } from 'lucide-react';
import { useState } from 'react';
import { useSessions, useMyEnrolments } from '@/hooks';
import { format } from 'date-fns';

const skillImages = {
  "Data Analysis": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
  "Cyber Hygiene": "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800",
  "Digital Marketing": "https://images.unsplash.com/photo-1432881476120-f99dd183d1b5?w=800",
  "Graphic Design": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
  "Soft Skills": "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800",
};

function TrainerAvatar({ name, picture, size = 80 }) {
  if (picture) {
    return (
      <img
        src={picture}
        alt={name}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }
  
  const initials = name
    ?.split(' ')
    .slice(0, 2)
    .map(word => word[0])
    .join('')
    .toUpperCase() || '?';

  return (
    <div
      className="rounded-full flex items-center justify-center font-bold text-2xl flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: 'var(--color-forest-green)',
        color: 'white'
      }}
    >
      {initials}
    </div>
  );
}

function SessionItem({ session, onEnrol, isEnrolling }) {
  const isOnline = session.locationType === 'ONLINE';
  const isFull = session._count?.enrolments >= session.capacity;
  const isPast = new Date(session.date) < new Date();

  return (
    <div className="card-base p-4 hover:border-neon-border transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
            {session.title}
          </h4>
          <div className="flex flex-wrap gap-3 mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {format(new Date(session.date), 'MMM d, yyyy')}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {session.durationMins} min
            </span>
            <span className="flex items-center gap-1">
              {isOnline ? <Monitor size={12} /> : <MapPin size={12} />}
              {isOnline ? 'Online' : session.county || 'Physical'}
            </span>
            <span className="flex items-center gap-1">
              <Users size={12} />
              {session._count?.enrolments || 0}/{session.capacity}
            </span>
          </div>
        </div>
        {!isPast && (
          <button
            onClick={() => onEnrol(session.id)}
            disabled={isEnrolling || isFull}
            className="btn-primary px-4 py-1.5 text-sm whitespace-nowrap"
            style={{
              background: isFull ? 'var(--text-muted)' : 'var(--color-forest-green)',
              cursor: isFull ? 'not-allowed' : 'pointer'
            }}
          >
            {isFull ? 'Full' : 'Enrol'}
          </button>
        )}
      </div>
    </div>
  );
}

export default function TrainerProfileModal({ isOpen, data, onClose }) {
  const [enrollingId, setEnrollingId] = useState(null);
  const { enrol } = useMyEnrolments();
  const { data: sessionsData, refetch } = useSessions();

  if (!isOpen || !data) return null;

  const trainer = data;
  
  // Get trainer's sessions
  const trainerSessions = sessionsData?.data?.filter(s => s.trainerId === trainer.id) || [];
  const upcomingSessions = trainerSessions.filter(s => s.status === 'SCHEDULED' && new Date(s.date) > new Date());
  const pastSessions = trainerSessions.filter(s => s.status === 'COMPLETED' || new Date(s.date) < new Date());

  const handleEnrol = async (sessionId) => {
    setEnrollingId(sessionId);
    try {
      await enrol(sessionId);
      await refetch();
    } catch (error) {
      console.error('Failed to enrol:', error);
    } finally {
      setEnrollingId(null);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="card-base shadow-elevated max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with Trainer Info */}
          <div className="p-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <TrainerAvatar 
                  name={trainer.name} 
                  picture={trainer.profilePicture} 
                  size={72}
                />
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    {trainer.name}
                  </h2>
                  <div className="flex flex-wrap gap-3 mt-1">
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      <Briefcase size={14} className="inline mr-1" />
                      {trainer.experience || 'Experienced Trainer'}
                    </span>
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      <Users size={14} className="inline mr-1" />
                      {trainerSessions.length} Sessions
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-card-hover transition-colors"
              >
                <X size={20} style={{ color: 'var(--text-secondary)' }} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Bio */}
            {trainer.bio && (
              <div>
                <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  About
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {trainer.bio}
                </p>
              </div>
            )}

            {/* Skills */}
            {trainer.skills?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {trainer.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        background: 'rgba(250,255,105,0.08)',
                        color: 'var(--color-forest-green)'
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming Sessions */}
            {upcomingSessions.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <Calendar size={16} style={{ color: 'var(--color-forest-green)' }} />
                  Upcoming Sessions ({upcomingSessions.length})
                </h3>
                <div className="space-y-3">
                  {upcomingSessions.map((session) => (
                    <SessionItem
                      key={session.id}
                      session={session}
                      onEnrol={handleEnrol}
                      isEnrolling={enrollingId === session.id}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Past Sessions */}
            {pastSessions.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                  <Clock size={16} />
                  Past Sessions ({pastSessions.length})
                </h3>
                <div className="space-y-3 opacity-60">
                  {pastSessions.slice(0, 3).map((session) => (
                    <SessionItem
                      key={session.id}
                      session={session}
                      onEnrol={() => {}}
                      isEnrolling={false}
                    />
                  ))}
                  {pastSessions.length > 3 && (
                    <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
                      +{pastSessions.length - 3} more past sessions
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}