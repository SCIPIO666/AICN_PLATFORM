// src/components/dashboard/UpcomingSessionsWidget.jsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Monitor, ChevronRight, Users } from 'lucide-react';
import { format, isValid, parseISO } from 'date-fns';

function SessionItem({ session }) {
  const isOnline = session.locationType === 'ONLINE';
  
  const getFormattedDate = () => {
    if (!session.date) return { day: '??', month: '??' };
    
    try {
      const date = typeof session.date === 'string' ? parseISO(session.date) : new Date(session.date);
      
      if (!isValid(date)) {
        return { day: '??', month: '??' };
      }
      
      return {
        day: format(date, 'dd'),
        month: format(date, 'MMM'),
        time: format(date, 'h:mm a'),
        fullDate: date,
      };
    } catch (error) {
      console.warn('Invalid date for session:', session.id, session.date);
      return { day: '??', month: '??' };
    }
  };

  const dateInfo = getFormattedDate();

  return (
    <motion.div
      whileHover={{ x: 4 }}
      className="flex items-center justify-between p-3 rounded-lg transition-all"
      style={{ background: 'var(--bg-surface)' }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-xs font-bold flex-col"
          style={{ background: 'var(--color-forest-green)', color: 'white' }}
        >
          <span>{dateInfo.day}</span>
          <span>{dateInfo.month}</span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
            {session.title || 'Untitled Session'}
          </p>
          <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
            {dateInfo.time && (
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {dateInfo.time}
              </span>
            )}
            <span className="flex items-center gap-1">
              {isOnline ? <Monitor size={12} /> : <MapPin size={12} />}
              {isOnline ? 'Online' : session.county || 'Physical'}
            </span>
          </div>
        </div>
      </div>
      <Link
        to={`/sessions/${session.id}`}
        className="flex-shrink-0 p-2 rounded-lg transition-colors hover:bg-card-hover"
      >
        <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
      </Link>
    </motion.div>
  );
}

export default function UpcomingSessionsWidget({ sessions }) {
  if (!sessions || sessions.length === 0) {
    return (
      <div className="text-center py-8" style={{ color: 'var(--text-muted)' }}>
        <Calendar size={32} className="mx-auto mb-2 opacity-50" />
        <p className="text-sm">No upcoming sessions</p>
        <Link to="/sessions" className="text-xs mt-2 inline-block" style={{ color: 'var(--color-forest-green)' }}>
          Browse sessions →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sessions.slice(0, 4).map((session) => (
        <SessionItem key={session.id} session={session} />
      ))}
      {sessions.length > 4 && (
        <Link
          to="/dashboard/learner/my-enrolments"
          className="block text-center text-sm py-2 rounded-lg transition-colors"
          style={{ color: 'var(--color-forest-green)' }}
        >
          View all {sessions.length} sessions →
        </Link>
      )}
    </div>
  );
}