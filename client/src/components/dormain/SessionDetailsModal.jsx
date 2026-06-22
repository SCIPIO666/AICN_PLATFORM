import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Calendar, MapPin, Monitor, Clock, Users, 
  User, ChevronRight, CheckCircle, XCircle, Loader2,
  Award, AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

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

const SessionDetailsModal = ({ session, isOpen, onClose, onEnrol }) => {
  const [isEnrolling, setIsEnrolling] = useState(false);
  const { user } = useAuth();
  
  if (!isOpen || !session) return null;

  const isOnline = session.locationType === 'ONLINE';
  const isScheduled = session.status === 'SCHEDULED';
  const isFull = session._count?.enrolments >= session.capacity;
  const isPast = new Date(session.date) < new Date();
  
  // Check if user is already enrolled
  const isEnrolled = session.enrolments?.some(e => e.userId === user?.id) || false;
  const hasCancelled = session.enrolments?.some(e => 
    e.userId === user?.id && e.status === 'CANCELLED'
  ) || false;

  const imageUrl = skillImages[session.skillArea] || skillImages['Soft Skills'];

  const formatDate = (date) => {
    return format(new Date(date), 'EEEE, MMMM d, yyyy');
  };

  const formatTime = (date) => {
    return format(new Date(date), 'h:mm a');
  };

  const handleEnrol = async () => {
    setIsEnrolling(true);
    try {
      await onEnrol(session.id);
      onClose();
    } catch (error) {
      console.error('Failed to enrol:', error);
    } finally {
      setIsEnrolling(false);
    }
  };

  const getActionButton = () => {
    if (isEnrolled) {
      return (
        <div className="card-inset p-4 text-center border border-green-500/30">
          <p className="flex items-center justify-center gap-2 text-sm font-medium" style={{ color: 'var(--success-text)' }}>
            <CheckCircle size={18} />
            Already Enrolled
          </p>
        </div>
      );
    }

    if (hasCancelled) {
      return (
        <div className="space-y-3">
          <p className="text-xs text-center font-medium" style={{ color: 'var(--warning-text)' }}>
            You previously cancelled this session
          </p>
          <button
            onClick={handleEnrol}
            disabled={isEnrolling || isPast || isFull}
            className="btn-primary w-full flex items-center justify-center gap-2"
            style={{
              background: isPast || isFull ? 'var(--text-muted)' : 'var(--color-forest-green)',
              cursor: isPast || isFull ? 'not-allowed' : 'pointer'
            }}
          >
            {isEnrolling ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Enrolling...
              </>
            ) : (
              'Re-Enrol'
            )}
          </button>
        </div>
      );
    }

    return (
      <button
        onClick={handleEnrol}
        disabled={isEnrolling || isPast || isFull}
        className="btn-primary w-full flex items-center justify-center gap-2"
        style={{
          background: isPast || isFull ? 'var(--text-muted)' : 'var(--color-forest-green)',
          cursor: isPast || isFull ? 'not-allowed' : 'pointer'
        }}
      >
        {isEnrolling ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Enrolling...
          </>
        ) : (
          'Enrol Now'
        )}
      </button>
    );
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
          {/* Image Header */}
          <div className="relative h-56 overflow-hidden">
            <img
              src={imageUrl}
              alt={session.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors z-10"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Badges */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
              <span
                className="px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm"
                style={{
                  background: isScheduled ? 'rgba(22, 101, 52, 0.9)' : 'rgba(0,0,0,0.7)',
                  color: isScheduled ? '#fff' : '#ccc'
                }}
              >
                {session.status}
              </span>
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
              {isFull && (
                <span
                  className="px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm flex items-center gap-1"
                  style={{
                    background: 'rgba(220, 38, 38, 0.9)',
                    color: '#fff'
                  }}
                >
                  <XCircle size={12} />
                  Full
                </span>
              )}
              {isPast && (
                <span
                  className="px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm flex items-center gap-1"
                  style={{
                    background: 'rgba(107, 114, 128, 0.9)',
                    color: '#fff'
                  }}
                >
                  <AlertCircle size={12} />
                  Past
                </span>
              )}
            </div>

            {/* Title on Image */}
            <div className="absolute bottom-20 left-6 right-6">
              <h2 className="text-feature-heading font-bold text-white drop-shadow-lg">
                {session.title}
              </h2>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Skill Area */}
            {session.skillArea && (
              <div className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--color-forest-green)' }}>
                <Award size={16} />
                {session.skillArea}
              </div>
            )}

            {/* Description */}
            <p className="text-body" style={{ color: 'var(--text-secondary)' }}>
              {session.description}
            </p>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <Calendar size={16} />
                  <span>Date: {formatDate(session.date)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <Clock size={16} />
                  <span>Time: {formatTime(session.date)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <Clock size={16} />
                  <span>Duration: {session.durationMins} minutes</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <Users size={16} />
                  <span>Enrolled: {session._count?.enrolments || 0}/{session.capacity}</span>
                </div>
                {session.trainer && (
                  <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                    <User size={16} />
                    <span>Trainer: {session.trainer.name}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                  {isOnline ? <Monitor size={16} /> : <MapPin size={16} />}
                  <span>
                    {isOnline ? 'Online Session' : session.county || 'Physical Location'}
                  </span>
                </div>
              </div>
            </div>

            {/* Progress/Status */}
            {session._count?.enrolments > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm" style={{ color: 'var(--text-muted)' }}>
                  <span>Capacity Utilization</span>
                  <span>{Math.round((session._count.enrolments / session.capacity) * 100)}%</span>
                </div>
                <div className="w-full h-2 rounded-full" style={{ background: 'var(--bg-surface)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min((session._count.enrolments / session.capacity) * 100, 100)}%`,
                      background: 'var(--color-forest-green)'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Action Button */}
            {user && isScheduled && !isPast && (
              <div className="pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
                {getActionButton()}
              </div>
            )}

            {!user && isScheduled && !isPast && (
              <div className="pt-4 border-t text-center" style={{ borderColor: 'var(--border-color)' }}>
                <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
                  Sign in to enrol in this session
                </p>
                <a
                  href="/login"
                  className="btn-primary inline-flex items-center gap-2 px-6 py-2.5"
                >
                  Sign In to Enrol
                  <ChevronRight size={16} />
                </a>
              </div>
            )}

            {(isPast || !isScheduled) && (
              <div className="pt-4 border-t text-center" style={{ borderColor: 'var(--border-color)' }}>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  {isPast ? 'This session has already passed' : 'This session is not currently available for enrolment'}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SessionDetailsModal;