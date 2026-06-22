// Updated PublicTrainers.jsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Award, 
  Calendar, 
  MapPin, 
  Monitor, 
  Clock,
  ChevronRight,
  Sparkles,
  UserCheck,
  AlertCircle,
  Briefcase
} from 'lucide-react';
import { useMemo } from 'react';
import Reveal from '@/components/Reveal';
import { fadeUp, staggerContainer } from '@/utils/motion';
import Spinner from '@/components/ui/Spinner';
import { useTrainers, useSessions } from '@/hooks';
import useModalStore from '@/stores/useModalStore';
import TrainerProfileModal from '@/components/dormain/TrainerProfileModal';
import PublicNavbar from '@/components/PublicNavbar';
const availabilityLabels = {
  'online-only': { label: 'Online Trainer', icon: Monitor, color: 'var(--info-text)' },
  'weekends': { label: 'Available Weekends', icon: Calendar, color: 'var(--success-text)' },
  'weekdays': { label: 'Available Weekdays', icon: Clock, color: 'var(--warning-text)' }
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

function TrainerCard({ trainer, sessions, onViewProfile }) {
  const availability = availabilityLabels[trainer.availability] || availabilityLabels['online-only'];
  const AvailabilityIcon = availability.icon;
  
  const trainerSessions = sessions?.filter(s => s.trainerId === trainer.id) || [];
  const upcomingSessions = trainerSessions.filter(s => s.status === 'SCHEDULED');
  const totalLearners = trainerSessions.reduce((acc, s) => acc + (s._count?.enrolments || 0), 0);

  return (
    <motion.div
      whileHover={{
        y: -8,
        boxShadow: '0 0 40px rgba(250,255,105,0.08)',
        transition: { duration: 0.2 }
      }}
      className="card-base overflow-hidden transition-all group cursor-pointer"
      onClick={() => onViewProfile(trainer)}
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          <TrainerAvatar 
            name={trainer.name} 
            picture={trainer.profilePicture} 
            size={72}
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold truncate" style={{ color: 'var(--text-primary)' }}>
              {trainer.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <AvailabilityIcon size={14} style={{ color: availability.color }} />
              <span className="text-xs font-medium" style={{ color: availability.color }}>
                {availability.label}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                <Users size={12} className="inline mr-1" />
                {upcomingSessions.length} Upcoming
              </span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                <UserCheck size={12} className="inline mr-1" />
                {totalLearners} Learners
              </span>
            </div>
          </div>
        </div>

        <p className="text-sm mt-3 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
          {trainer.bio || 'Experienced trainer passionate about sharing knowledge.'}
        </p>

        <div className="flex flex-wrap gap-2 mt-4">
          {trainer.skills?.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="px-2 py-1 rounded text-xs font-medium"
              style={{
                background: 'rgba(250,255,105,0.08)',
                color: 'var(--color-forest-green)'
              }}
            >
              {skill}
            </span>
          ))}
          {trainer.skills?.length > 3 && (
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              +{trainer.skills.length - 3} more
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewProfile(trainer);
          }}
          className="inline-flex items-center gap-1 mt-4 text-sm font-semibold transition-all group-hover:gap-2"
          style={{ color: 'var(--color-forest-green)' }}
        >
          View Profile
          <ChevronRight size={16} />
        </button>
      </div>
    </motion.div>
  );
}

export default function PublicTrainers() {
  const { openModal, closeModal, isOpen, modalData, modalType } = useModalStore();
  const { data: trainersData, error: trainersError, isError: isTrainersError, isLoading: isTrainersLoading } = useTrainers();
  const { data: sessionsData } = useSessions();

  const trainers = useMemo(() => {
    if (!trainersData) return [];
    if (Array.isArray(trainersData)) return trainersData;
    if (trainersData.data && Array.isArray(trainersData.data)) return trainersData.data;
    if (trainersData.items && Array.isArray(trainersData.items)) return trainersData.items;
    if (trainersData.results && Array.isArray(trainersData.results)) return trainersData.results;
    return [];
  }, [trainersData]);

  const sessions = useMemo(() => {
    if (!sessionsData) return [];
    if (Array.isArray(sessionsData)) return sessionsData;
    if (sessionsData.data && Array.isArray(sessionsData.data)) return sessionsData.data;
    return [];
  }, [sessionsData]);

  const stats = useMemo(() => {
    const allSkills = trainers.flatMap(t => t.skills || []);
    const totalSessions = trainers.reduce((acc, t) => acc + (t.totalCompletedSessions || 0), 0);
    const totalUpcoming = sessions.filter(s => s.status === 'SCHEDULED').length;
    
    return {
      total: trainers.length,
      skills: new Set(allSkills).size,
      sessions: totalSessions,
      upcoming: totalUpcoming
    };
  }, [trainers, sessions]);

  const handleViewProfile = (trainer) => {
    openModal('trainerProfile', trainer);
  };

  if (isTrainersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-page)' }}>
        <Spinner />
      </div>
    );
  }

  if (isTrainersError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-page)' }}>
        <div className="text-center max-w-md">
          <AlertCircle size={48} className="mx-auto mb-4" style={{ color: 'var(--error-text)' }} />
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Failed to load trainers
          </h3>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {trainersError?.message || 'Please try refreshing the page or check back later.'}
          </p>
        </div>
      </div>
    );
  }

  if (trainers.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-page)' }}>
        <div className="text-center max-w-md">
          <Users size={48} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            No trainers available
          </h3>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Check back soon for new expert trainers.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
    <PublicNavbar/>
      <div className="min-h-screen px-4 py-8 md:px-8 lg:px-12" style={{ background: 'var(--bg-page)' }}>
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <section className="card-base p-8 md:p-12 relative overflow-hidden mb-12">
            <div
              className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
              style={{
                background: 'var(--color-forest-green)',
                filter: 'blur(60px)'
              }}
            />
            
            <div className="relative">
              <Reveal variant={fadeUp}>
                <p className="label-uppercase flex items-center gap-2">
                  <Sparkles size={16} />
                  Meet Our Expert Trainers
                </p>
              </Reveal>
              
              <Reveal variant={fadeUp} delay={0.1}>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mt-2" style={{ color: 'var(--text-primary)' }}>
                  Learn from practitioners,<br />
                  <span style={{ color: 'var(--color-forest-green)' }}>industry leaders and experts</span>
                </h1>
              </Reveal>

              <Reveal variant={fadeUp} delay={0.2}>
                <p className="text-body-large mt-4 max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
                  Discover trainers who are driving change across Africa with practical,
                  hands-on experience in their fields.
                </p>
              </Reveal>

              <div className="flex flex-wrap gap-8 mt-8">
                {[
                  { icon: Users, value: stats.total, label: 'Expert Trainers' },
                  { icon: Award, value: stats.skills, label: 'Skills Covered' },
                  { icon: Calendar, value: stats.upcoming, label: 'Upcoming Sessions' },
                  { icon: UserCheck, value: stats.sessions, label: 'Sessions Completed' }
                ].map((stat, idx) => (
                  <Reveal key={stat.label} variant={fadeUp} delay={0.3 + idx * 0.1}>
                    <div className="flex items-center gap-3">
                      <stat.icon size={24} style={{ color: 'var(--color-forest-green)' }} />
                      <div>
                        <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                          {stat.value}
                        </p>
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                          {stat.label}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* Trainers Grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {trainers.map((trainer) => (
              <Reveal key={trainer.id} variant={fadeUp}>
                <TrainerCard 
                  trainer={trainer} 
                  sessions={sessions} 
                  onViewProfile={handleViewProfile}
                />
              </Reveal>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Single Modal - Mounted at End */}
      <TrainerProfileModal
        isOpen={isOpen && modalType === 'trainerProfile'}
        data={modalData}
        onClose={closeModal}
      />
    </>
  );
}