import Card from '../ui/Card';
import { Button } from '../ui/Button';
import Badge from '../ui/Badge';
import { Monitor, MapPin, Calendar, Clock, Users, User, CheckCircle, XCircle } from 'lucide-react';

export default function EnlrolmentCard({ enrolment, onCancel, isCancelling }) {
  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });


//    {
//       "id": "cmqdf8nbl0005ggv0k4r0m6mu",
//       "userId": "cmqdbucsz000278v06kxpemmi",
//       "sessionId": "cmpjofnoo000n9kv02u69j1le",
//       "status": "ENROLLED",
//       "createdAt": "2026-06-14T06:46:48.849Z",
//       "updatedAt": "2026-06-14T06:46:48.849Z",
//       "user": {
//         "id": "cmqdbucsz000278v06kxpemmi",
//         "name": "Learner User",
//         "email": "learner@aicn.africa"
//       },
//       "session": {
//         "id": "cmpjofnoo000n9kv02u69j1le",
//         "title": "Video Editing with CapCut & DaVinci — Nairobi",
//         "date": "2026-06-21T06:00:00.000Z",
//         "skillArea": "Video Editing",
//         "status": "SCHEDULED"
//       }
//     },
function getBadgeVariant(status){
    switch(status){
        case "SCHEDULED":
            return 'neon';
            break;
        case "CANCELLED":
            return 'error';
            break; 
            
        case "IN_PROGRESS":
             return 'outline'; 
             break;
        case "COMPLETED" :
            return 'success';  
            break;
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
          onClick={() => onCancel(session.id)}
          isLoading={isCancelling}
        >
            Cancel Enrolment
        </Button>
      </Card.Body>
    </Card>
  );
}