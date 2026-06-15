import Card from '../ui/Card';
import { Button } from '../ui/Button';
import Badge from '../ui/Badge';
import { Calendar, Clock } from 'lucide-react';
import { useEnrolmentUI } from '@/stores/enrolmentUIStore';

export default function EnlrolmentCard({ enrolment}) {
  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
  const openCancelModal = useEnrolmentUI((s) => s.openCancelModal)

function getBadgeVariant(status){
    switch(status){
        case "SCHEDULED":
            return 'neon';

        case "CANCELLED":
            return 'error';

            
        case "IN_PROGRESS":
             return 'outline'; 

        case "COMPLETED" :
            return 'success';  
        default:
            return "warning"       

    }
}
const variant=getBadgeVariant(enrolment.session.status)
  return (
    <Card variant="default" className="hover:shadow-elevated transition-all duration-300">
      <Card.Body className="space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="text-sub-heading font-bold text-text-primary line-clamp-1">
            {enrolment.session.title}
          </h3>
          <Badge variant={variant}>
            <Clock size={14} className="inline mr-1" />
            {enrolment.session.status}
          </Badge>
        </div>

        <p className="text-body text-text-secondary line-clamp-2">{enrolment.session.skillArea}</p>

        <div className="space-y-2 text-caption text-text-muted">
          <div className="flex items-center gap-2">
            <Calendar size={14} />
            <span>{formatDate(enrolment.session.date)}</span>
          </div>

        </div>

        <Button
          variant={'destructive'}
          fullWidth
          onClick={() => openCancelModal(enrolment)}
        >
            Cancel Enrolment
        </Button>
      </Card.Body>
    </Card>
  );
}
