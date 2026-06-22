// src/pages/learner/PublicSessions.jsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import FilterBar from '../../components/dormain/FilterBar';
import { useEffect, useState } from 'react';
import Pagination from '@/components/ui/Pagination';
import useSessionFilters from '../../stores/sessionFilters';

import { 
  Calendar, 
  MapPin, 
  Monitor, 
  Clock, 
  Users,
  ChevronRight,
  Sparkles,
  Award,
  AlertCircle,
  UserCheck 
} from 'lucide-react';
import { useMemo } from 'react';
import Reveal from '@/components/Reveal';
import { fadeUp, staggerContainer } from '@/utils/motion';
import Spinner from '@/components/ui/Spinner';
import { useSessions, useMyEnrolments } from '@/hooks';

import SessionDetailsModal from '@/components/dormain/SessionDetailsModal';

const skillImages = {
  "Data Analysis": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
  "Cyber Hygiene": "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800",
  "Digital Marketing": "https://images.unsplash.com/photo-1432881476120-f99dd183d1b5?w=800",
  "Graphic Design": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
  "Soft Skills": "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800",
  "Basics in Cyber Security": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800",
  "Content Creation & Monetization": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
  "Introduction to Online Jobs": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800"
};

function SessionCard({ session, onViewDetails }) {
  const isOnline = session.locationType === 'ONLINE';
  const isScheduled = session.status === 'SCHEDULED';
  
  const date = new Date(session.date);
  const formattedDate = date.toLocaleDateString('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const imageUrl = skillImages[session.skillArea] || skillImages['Soft Skills'];

  return (
    <motion.div
      whileHover={{
        y: -6,
        boxShadow: '0 0 40px rgba(250,255,105,0.08)',
        transition: { duration: 0.2 }
      }}
      className="card-base overflow-hidden transition-all group cursor-pointer"
      onClick={() => onViewDetails(session)}
    >
      <div className="relative h-48 overflow-hidden">
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
          src={imageUrl}
          alt={session.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-4 right-4">
          <span
            className="px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm"
            style={{
              background: isScheduled ? 'rgba(22, 101, 52, 0.9)' : 'rgba(0,0,0,0.7)',
              color: isScheduled ? '#fff' : '#ccc'
            }}
          >
            {session.status}
          </span>
        </div>
        <div className="absolute top-4 left-4">
          <span
            className="px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm flex items-center gap-1"
            style={{
              background: 'rgba(0,0,0,0.7)',
              color: '#a3e635'
            }}
          >
            {isOnline ? <Monitor size={12} /> : <MapPin size={12} />}
            {isOnline ? 'Online' : session.county || 'Physical'}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-bold line-clamp-2 min-h-[3.5rem]" style={{ color: 'var(--text-primary)' }}>
          {session.title}
        </h3>

        <div className="flex flex-wrap gap-3 mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>
          <span className="flex items-center gap-1">
            <Calendar size={14} />
            {formattedDate}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {session.durationMins} min
          </span>
          <span className="flex items-center gap-1">
            <Users size={14} />
            {session._count?.enrolments || 0}/{session.capacity}
          </span>
        </div>

        {session.trainer && (
          <p className="text-sm mt-2 truncate" style={{ color: 'var(--text-secondary)' }}>
            By {session.trainer.name}
          </p>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(session);
          }}
          className="inline-flex items-center gap-1 mt-4 text-sm font-semibold transition-all group-hover:gap-2"
          style={{ color: 'var(--color-forest-green)' }}
        >
          View Details
          <ChevronRight size={16} />
        </button>
      </div>
    </motion.div>
  );
}

export default function PublicSessions() {
  const [selectedSession, setSelectedSession] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { data, error, isError, isLoading, refetch } = useSessions();
  const { enrol, isEnrolling } = useMyEnrolments();
  const { filters, setFilters, resetFilters } = useSessionFilters();

  const sessions = useMemo(() => {
    if (Array.isArray(data)) {
      return data;
    }
    if (data?.data && Array.isArray(data.data)) {
      return data.data;
    }
    return [];
  }, [data]);

  const upcomingSessions = useMemo(() => {
    return sessions.filter(s => s.status === 'SCHEDULED');
  }, [sessions]);

  const featuredSession = upcomingSessions[0] || sessions[0];

  const stats = useMemo(() => {
    return {
      total: sessions.length,
      upcoming: upcomingSessions.length,
      skills: new Set(sessions.map(s => s.skillArea).filter(Boolean)).size,
      trainers: new Set(sessions.filter(s => s.trainer).map(s => s.trainer?.name).filter(Boolean)).size
    };
  }, [sessions, upcomingSessions]);

  useEffect(() => { 
    refetch(); 
  }, [filters, refetch]);

  const handleViewDetails = (session) => {
    setSelectedSession(session);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSession(null);
  };

  const handleEnrol = async (sessionId) => {
    await enrol(sessionId);
    await refetch(); // Refresh to update enrolment status
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-page)' }}>
        <Spinner />
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-page)' }}>
        <div className="text-center max-w-md">
          <AlertCircle size={48} className="mx-auto mb-4" style={{ color: 'var(--error-text)' }} />
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Failed to load sessions
          </h3>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {error?.message || 'Please try refreshing the page or check back later.'}
          </p>
        </div>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-page)' }}>
        <div className="text-center max-w-md">
          <Sparkles size={48} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            No sessions available
          </h3>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Check back soon for upcoming training sessions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
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
                  Discover Training Sessions
                </p>
              </Reveal>
              
              <Reveal variant={fadeUp} delay={0.1}>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mt-2" style={{ color: 'var(--text-primary)' }}>
                  Build practical skills from
                  <br />
                  <span style={{ color: 'var(--color-forest-green)' }}>industry experts</span>
                </h1>
              </Reveal>

              <Reveal variant={fadeUp} delay={0.2}>
                <p className="text-body-large mt-4 max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
                  Browse our catalog of live training sessions designed to help you
                  gain real-world skills and advance your career.
                </p>
              </Reveal>

              <div className="flex flex-wrap gap-8 mt-8">
                {[
                  { icon: Calendar, value: stats.upcoming, label: 'Upcoming Sessions' },
                  { icon: Award, value: stats.skills, label: 'Skill Areas' },
                  { icon: UserCheck, value: stats.trainers, label: 'Expert Trainers' }
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

          {/* Featured Session */}
          {featuredSession && (
            <section className="mb-12">
              <Reveal variant={fadeUp}>
                <div className="card-neon p-6 md:p-8 relative overflow-hidden cursor-pointer" onClick={() => handleViewDetails(featuredSession)}>
                  <div
                    className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10"
                    style={{
                      background: 'var(--color-forest-green)',
                      filter: 'blur(60px)'
                    }}
                  />
                  <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-forest-green)' }}>
                        Featured Session
                      </span>
                      <h2 className="text-2xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
                        {featuredSession.title}
                      </h2>
                      <p className="text-sm mt-1 max-w-lg line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                        {featuredSession.description}
                      </p>
                      <div className="flex flex-wrap gap-4 mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                        <span className="flex items-center gap-1">
                          {featuredSession.locationType === 'ONLINE' ? <Monitor size={14} /> : <MapPin size={14} />}
                          {featuredSession.locationType === 'ONLINE' ? 'Online' : featuredSession.county || 'Physical'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(featuredSession.date).toLocaleDateString('en-KE', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {featuredSession.durationMins} min
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={14} />
                          {featuredSession._count?.enrolments || 0} enrolled
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(featuredSession);
                      }}
                      className="btn-neon px-6 py-2.5 font-semibold whitespace-nowrap flex-shrink-0"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </Reveal>
            </section>
          )}
          
          <FilterBar filters={filters} onFilterChange={setFilters} onReset={resetFilters} />

          {/* Sessions Grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {sessions.map((session) => (
              <Reveal key={session.id} variant={fadeUp}>
                <SessionCard session={session} onViewDetails={handleViewDetails} />
              </Reveal>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Session Details Modal */}
      <SessionDetailsModal
        session={selectedSession}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onEnrol={handleEnrol}
      />
    </>
  );
}