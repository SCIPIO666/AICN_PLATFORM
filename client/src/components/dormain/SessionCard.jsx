import Card from '../ui/Card';
import { Button } from '../ui/Button';
import Badge from '../ui/Badge';
import { Monitor, MapPin, Calendar, Clock, Users, User, CheckCircle, XCircle } from 'lucide-react';

export default function SessionCard({ session, onEnrol, isEnrolling }) {
  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const isFull = session.enrolledCount >= session.capacity;
  const isOnline = session.locationType === 'ONLINE';

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

        <Button
          variant={isFull ? 'ghost' : 'neon'}
          fullWidth
          onClick={() => onEnrol(session.id)}
          isLoading={isEnrolling}
          disabled={isFull}
        >
          {isFull ? (
            <>
              <XCircle size={16} className="mr-2" />
              Session Full
            </>
          ) : (
            <>
              <CheckCircle size={16} className="mr-2" />
              Enrol Now
            </>
          )}
        </Button>
      </Card.Body>
    </Card>
  );
}