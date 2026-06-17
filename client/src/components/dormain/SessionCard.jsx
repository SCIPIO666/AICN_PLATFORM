import Card from '../ui/Card';
import { Button } from '../ui/Button';
import Badge from '../ui/Badge';
import { Monitor, MapPin, Calendar, Clock, Users, User, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function SessionCard({ session, onEnrol, isEnrolling }) {
  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const isFull = session.enrolledCount >= session.capacity;
  const isOnline = session.locationType === 'ONLINE';

// useMyEnrolments

// past sessions
 const now = new Date();
const sessionDate = new Date(session.date);
const isUnavailable = sessionDate < now;


//already enrolled
  const isCancelled =null // session.userEnrolment?.status === 'CANCELLED'
  const isEnrolled =null // session.isEnrolled 

const getActionButton = () => {
    // Active enrolment exists
    if (isEnrolled) {
      return (
        <button
          disabled
          className="w-full py-2 rounded-lg text-sm bg-green-100 
                     text-green-700 border border-green-300 cursor-not-allowed"
        >
          ✓ Already Enrolled
        </button>
      )
    }

    //  Previously cancelled — allow re-enrol
      if (isCancelled) {
      return (
        <div className="space-y-2">
          <p className="text-xs text-amber-600 text-center">
            You previously cancelled this session
          </p>
          <button
            onClick={() => onEnrol(session.id)}
            disabled={isEnrolling || isUnavailable}
            className="w-full py-2 rounded-lg text-sm bg-amber-500 
                      text-white hover:bg-amber-600 transition-colors
                      disabled:opacity-50"
          >
            {isEnrolling ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={14} className="animate-spin" />
                Enrolling...
              </span>
            ) : (
              'Re-Enrol'
            )}
          </button>
        </div>
      )
    }

    // Never enrolled-default
    return (
            <button
              onClick={() => onEnrol(session.id)}
              disabled={isEnrolling || isUnavailable}
              className="w-full py-2 rounded-lg text-sm bg-green-600 
                        text-white hover:bg-green-700 disabled:opacity-50 
                        transition-colors"
            >
              {isEnrolling ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={14} className="animate-spin" />
                  Enrolling...
                </span>
              ) : (
                'Enrol Now'
              )}
            </button>
        )
  }


  return (
    <Card variant="default" className="hover:shadow-elevated transition-all duration-300">
      <Card.Body className="space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="text-sub-heading font-bold text-text-primary line-clamp-1">
            {session.title}
          </h3>
          <Badge variant={isOnline ? 'neon' : 'success'}>
            {isOnline ? (
              <>
                <Monitor size={14} className="inline mr-1" />
                Online
              </>
            ) : (
              <>
                <MapPin size={14} className="inline mr-1" />
                Physical
              </>
            )}
          </Badge>
        </div>

        <p className="text-body text-text-secondary line-clamp-2">{session.description}</p>

        <div className="space-y-2 text-caption text-text-muted">
          <div className="flex items-center gap-2">
            <Calendar size={14} />
            <span>{formatDate(session.date)}</span>
            <span>•</span>
            <Clock size={14} />
            <span>{session.durationMins} min</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={14} />
            <span>{session.enrolledCount}/{session.capacity} enrolled</span>
            {isFull && <XCircle size={14} className="text-red-500 ml-1" />}
          </div>
          {session.trainer && (
            <div className="flex items-center gap-2">
              <User size={14} />
              <span>{session.trainer.name}</span>
            </div>
          )}
        </div>
          {isFull ? (
            <>
              <XCircle size={16} className="mr-2" />
              Session Full
            </>
          ) : 
  
      getActionButton()}
      </Card.Body>
    </Card>
  );
}