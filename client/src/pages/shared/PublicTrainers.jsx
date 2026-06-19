
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
  Briefcase
} from 'lucide-react';
import { useState } from 'react';
import Reveal from '@/components/Reveal';
import { fadeUp, staggerContainer, fadeLeft, fadeRight } from '@/utils/motion';

// Sample data - would come from API
const trainersData = [
  {
    id: "cmqgqkxu2000gjsy884u7x46e",
    name: "Brian Otieno",
    profilePicture: null,
    skills: ["Cyber Hygiene", "Basics in Cyber Security"],
    bio: "Cybersecurity professional, CompTIA Security+ certified. 5 years in network security.",
    availability: "online-only",
    totalCompletedSessions: 1,
    joinedAt: "2026-06-16T14:27:36.650Z"
  },
  {
    id: "cmqgqkxty000fjsy8be7ahh8m",
    name: "Fatuma Njeri",
    profilePicture: null,
    skills: ["Digital Marketing", "Content Creation & Monetization", "Video Editing"],
    bio: "Digital marketer and content creator. Runs a successful YouTube channel on East African tech trends.",
    availability: "weekends",
    totalCompletedSessions: 1,
    joinedAt: "2026-06-16T14:27:36.646Z"
  },
  {
    id: "cmqgqkxtv000ejsy8d5h5xw6m",
    name: "Amara Osei",
    profilePicture: null,
    skills: ["Data Analysis", "Soft Skills"],
    bio: "Data analyst with 4 years experience in fintech and NGO reporting. Passionate about making data accessible to young people.",
    availability: "weekends",
    totalCompletedSessions: 1,
    joinedAt: "2026-06-16T14:27:36.643Z"
  },
  {
    id: "cmqgqkxsl000djsy8zn9puaba",
    name: "Trainer User",
    profilePicture: null,
    skills: ["Digital Marketing", "Data Analysis", "Soft Skills", "Cyber Hygiene"],
    bio: "All-rounder trainer used for development and QA. Covers multiple skill areas and has both online and physical sessions.",
    availability: "weekdays",
    totalCompletedSessions: 1,
    joinedAt: "2026-06-16T14:27:36.597Z"
  }
];

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
    .split(' ')
    .slice(0, 2)
    .map(word => word[0])
    .join('')
    .toUpperCase();

  return (
    <div
      className="rounded-full flex items-center justify-center font-bold text-2xl"
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, var(--color-forest-green), var(--color-neon-volt))',
        color: 'var(--color-pure-black)'
      }}
    >
      {initials}
    </div>
  );
}

function TrainerCard({ trainer }) {
  const availability = availabilityLabels[trainer.availability] || availabilityLabels['online-only'];
  const AvailabilityIcon = availability.icon;

  return (
    <motion.div
      whileHover={{
        y: -8,
        boxShadow: '0 0 40px rgba(250,255,105,0.08)',
        transition: { duration: 0.2 }
      }}
      className="card-base overflow-hidden transition-all group"
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
                {trainer.totalCompletedSessions} Sessions
              </span>
            </div>
          </div>
        </div>

        <p className="text-sm mt-3 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
          {trainer.bio}
        </p>

        <div className="flex flex-wrap gap-2 mt-4">
          {trainer.skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="px-2 py-1 rounded text-xs font-medium"
              style={{
                background: 'rgba(250,255,105,0.08)',
                color: 'var(--color-neon-volt)'
              }}
            >
              {skill}
            </span>
          ))}
          {trainer.skills.length > 3 && (
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              +{trainer.skills.length - 3} more
            </span>
          )}
        </div>

        <Link
          to={`/trainers/${trainer.id}`}
          className="inline-flex items-center gap-1 mt-4 text-sm font-semibold transition-all group-hover:gap-2"
          style={{ color: 'var(--color-neon-volt)' }}
        >
          View Profile
          <ChevronRight size={16} />
        </Link>
      </div>
    </motion.div>
  );
}

export default function Trainers() {
  const stats = {
    total: trainersData.length,
    skills: [...new Set(trainersData.flatMap(t => t.skills))].length,
    sessions: trainersData.reduce((acc, t) => acc + t.totalCompletedSessions, 0)
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
                <Users size={16} />
                Meet Our Experts
              </p>
            </Reveal>
            
            <Reveal variant={fadeUp} delay={0.1}>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mt-2" style={{ color: 'var(--text-primary)' }}>
                Learn from practitioners,<br />
                <span style={{ color: 'var(--color-neon-volt)' }}>industry leaders and experts</span>
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
                { icon: UserCheck, value: stats.sessions, label: 'Sessions Completed' }
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

        {/* Trainers Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {trainersData.map((trainer) => (
            <Reveal key={trainer.id} variant={fadeUp}>
              <TrainerCard trainer={trainer} />
            </Reveal>
          ))}
        </motion.div>
      </div>
    </div>
  );
}