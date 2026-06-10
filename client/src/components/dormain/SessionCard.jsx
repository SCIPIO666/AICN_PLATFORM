import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

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
            {isOnline ? '💻 Online' : '📍 Physical'}
          </Badge>
        </div>

        <p className="text-body text-text-secondary line-clamp-2">{session.description}</p>

        <div className="space-y-2 text-caption text-text-muted">
          <div className="flex items-center gap-2">
            <span>📅</span>
            <span>{formatDate(session.date)}</span>
            <span>•</span>
            <span>⏰ {session.durationMins} min</span>
          </div>
          <div className="flex items-center gap-2">
            <span>👥</span>
            <span>{session.enrolledCount}/{session.capacity} enrolled</span>
          </div>
          {session.trainer && (
            <div className="flex items-center gap-2">
              <span>👨‍🏫</span>
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
          {isFull ? 'Session Full' : 'Enrol Now'}
        </Button>
      </Card.Body>
    </Card>
  );
}