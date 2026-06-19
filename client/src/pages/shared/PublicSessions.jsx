import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Monitor, 
  Clock, 
  Users,
  ChevronRight,
  Search,
  Filter,
  Sparkles,
  Award,
  UserCheck
} from 'lucide-react';
import { useState } from 'react';
import Reveal from '@/components/Reveal';
import { fadeUp, staggerContainer } from '@/utils/motion';

// Sample data - would come from API
const sessionsData = [
  {
    id: "cmqgqkxuc000ijsy8d7ath6o8",
    title: "Cyber Hygiene Bootcamp — Nairobi",
    skillArea: "Cyber Hygiene",
    description: "Learn how to protect yourself and your devices online. Covers passwords, phishing, safe browsing, and social media safety.",
    date: "2026-05-26T06:00:00.000Z",
    durationMins: 120,
    locationType: "PHYSICAL",
    venue: "Nairobi Innovation Hub, Westlands",
    county: "Nairobi",
    capacity: 30,
    status: "COMPLETED",
    trainer: {
      id: "cmqgqkxrw0004jsy8n3wzu3nz",
      name: "Brian Otieno"
    },
    _count: { enrolments: 4 }
  },
  {
    id: "cmqgqkxum000kjsy82d6mmqbz",
    title: "Content Creation & Monetization — Online",
    skillArea: "Content Creation & Monetization",
    description: "How to create content on YouTube, TikTok, and Instagram — and actually earn from it.",
    date: "2026-06-09T11:00:00.000Z",
    durationMins: 180,
    locationType: "ONLINE",
    venue: "https://meet.google.com/aicn-content-001",
    county: null,
    capacity: 50,
    status: "COMPLETED",
    trainer: {
      id: "cmqgqkxrt0003jsy8h87d84z3",
      name: "Fatuma Njeri"
    },
    _count: { enrolments: 5 }
  },
  {
    id: "cmqgqkxvm000tjsy83aqt1w2q",
    title: "Soft Skills Workshop — Narok",
    skillArea: "Soft Skills",
    description: "Communication, teamwork, time management and professional etiquette.",
    date: "2026-06-13T06:00:00.000Z",
    durationMins: 120,
    locationType: "PHYSICAL",
    venue: "Narok County Library",
    county: "Narok",
    capacity: 30,
    status: "CANCELLED",
    trainer: null,
    _count: { enrolments: 0 }
  },
  {
    id: "cmqgqkxvi000sjsy8ka05kt5w",
    title: "Data Analysis Masterclass — Online",
    skillArea: "Data Analysis",
    description: "Advanced data storytelling, dashboard design, and presenting insights to non-technical stakeholders.",
    date: "2026-06-21T08:00:00.000Z",
    durationMins: 150,
    locationType: "ONLINE",
    venue: "https://meet.google.com/aicn-dev-001",
    county: null,
    capacity: 50,
    status: "SCHEDULED",
    trainer: {
      id: "cmqgqkxrm0001jsy8sjjiho26",
      name: "Trainer User"
    },
    _count: { enrolments: 1 }
  },
  {
    id: "cmqgqkxut000mjsy8l1hsb7rc",
    title: "Digital Marketing Fundamentals — Nairobi",
    skillArea: "Digital Marketing",
    description: "SEO, social media marketing, email campaigns, and how to run paid ads on a budget.",
    date: "2026-06-23T06:00:00.000Z",
    durationMins: 120,
    locationType: "PHYSICAL",
    venue: "iHub Nairobi, Ngong Road",
    county: "Nairobi",
    capacity: 30,
    status: "SCHEDULED",
    trainer: {
      id: "cmqgqkxrt0003jsy8h87d84z3",
      name: "Fatuma Njeri"
    },
    _count: { enrolments: 4 }
  },
  {
    id: "cmqgqkxv6000ojsy8klx53q57",
    title: "Cyber Security Basics — Online",
    skillArea: "Basics in Cyber Security",
    description: "Understanding threats, firewalls, VPNs, and how to build a career in cybersecurity.",
    date: "2026-06-30T11:00:00.000Z",
    durationMins: 180,
    locationType: "ONLINE",
    venue: "https://meet.google.com/aicn-cyber-002",
    county: null,
    capacity: 60,
    status: "SCHEDULED",
    trainer: {
      id: "cmqgqkxrw0004jsy8n3wzu3nz",
      name: "Brian Otieno"
    },
    _count: { enrolments: 4 }
  }
];

// Skill area to image mapping
const skillImages = {
  "Data Analysis": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
  "Cyber Hygiene": "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800",
  "Digital Marketing": "https://images.unsplash.com/photo-1432881476120-f99dd183d1b5?w=800",
  "Graphic Design": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
  "Soft Skills": "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800",
  "Basics in Cyber Security": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800",
  "Content Creation & Monetization": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800"
};

function SessionCard({ session }) {
  const isOnline = session.locationType === 'ONLINE';
  const isScheduled = session.status === 'SCHEDULED';
  const isCompleted = session.status === 'COMPLETED';
  const isCancelled = session.status === 'CANCELLED';
  
  const statusColors = {
    SCHEDULED: 'var(--success-text)',
    COMPLETED: 'var(--text-muted)',
    CANCELLED: 'var(--error-text)'
  };

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
      className="card-base overflow-hidden transition-all group"
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
              color: isScheduled ? 'var(--color-neon-volt)' : 'var(--text-muted)'
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
              color: 'var(--color-neon-volt)'
            }}
          >
            {isOnline ? <Monitor size={12} /> : <MapPin size={12} />}
            {isOnline ? 'Online' : session.county}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-bold line-clamp-1" style={{ color: 'var(--text-primary)' }}>
            {session.title}
          </h3>
        </div>

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
            {session._count.enrolments}/{session.capacity}
          </span>
        </div>

        {session.trainer && (
          <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
            By {session.trainer.name}
          </p>
        )}

        <Link
          to={`/sessions/${session.id}`}
          className="inline-flex items-center gap-1 mt-4 text-sm font-semibold transition-all group-hover:gap-2"
          style={{ color: 'var(--color-neon-volt)' }}
        >
          View Details
          <ChevronRight size={16} />
        </Link>
      </div>
    </motion.div>
  );
}

export default function Sessions() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const upcomingSessions = sessionsData.filter(s => s.status === 'SCHEDULED');
  const featuredSession = upcomingSessions[0];

  const stats = {
    total: sessionsData.length,
    upcoming: upcomingSessions.length,
    skills: [...new Set(sessionsData.map(s => s.skillArea))].length,
    trainers: [...new Set(sessionsData.filter(s => s.trainer).map(s => s.trainer.name))].length
  };

  return (
    <div className="min-h-screen px-4 py-8 md:px-8 lg:px-12" style={{ background: 'var(--bg-page)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="card-base p-8 md:p-12 relative overflow-hidden mb-12">
          <div
            className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
            style={{
              background: 'var(--color-neon-volt)',
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
                <span style={{ color: 'var(--color-neon-volt)' }}>industry experts</span>
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
                    <stat.icon size={24} style={{ color: 'var(--color-neon-volt)' }} />
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
              <div className="card-neon p-6 md:p-8 relative overflow-hidden">
                <div
                  className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10"
                  style={{
                    background: 'var(--color-neon-volt)',
                    filter: 'blur(60px)'
                  }}
                />
                <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-neon-volt)' }}>
                      Featured Session
                    </span>
                    <h2 className="text-2xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
                      {featuredSession.title}
                    </h2>
                    <p className="text-sm mt-1 max-w-lg" style={{ color: 'var(--text-secondary)' }}>
                      {featuredSession.description}
                    </p>
                    <div className="flex flex-wrap gap-4 mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                      <span className="flex items-center gap-1">
                        {featuredSession.locationType === 'ONLINE' ? <Monitor size={14} /> : <MapPin size={14} />}
                        {featuredSession.locationType === 'ONLINE' ? 'Online' : featuredSession.county}
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
                        {featuredSession._count.enrolments} enrolled
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/sessions/${featuredSession.id}`}
                    className="btn-neon px-6 py-2.5 font-semibold whitespace-nowrap"
                  >
                    Reserve Seat
                  </Link>
                </div>
              </div>
            </Reveal>
          </section>
        )}

        {/* Sessions Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {sessionsData.map((session) => (
            <Reveal key={session.id} variant={fadeUp}>
              <SessionCard session={session} />
            </Reveal>
          ))}
        </motion.div>
      </div>
    </div>
  );
}