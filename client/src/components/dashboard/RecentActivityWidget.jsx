// src/components/dashboard/RecentActivityWidget.jsx
import { motion } from 'framer-motion';
import { CheckCircle, Award, Calendar, UserCheck, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const activityIcons = {
  'enrolment': { icon: CheckCircle, color: 'text-green-500' },
  'certificate': { icon: Award, color: 'text-amber-500' },
  'attendance': { icon: UserCheck, color: 'text-blue-500' },
  'session': { icon: Calendar, color: 'text-purple-500' },
};

export default function RecentActivityWidget({ activities = [] }) {
  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-8" style={{ color: 'var(--text-muted)' }}>
        <Clock size={32} className="mx-auto mb-2 opacity-50" />
        <p className="text-sm">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.slice(0, 5).map((activity, index) => {
        const { icon: Icon, color } = activityIcons[activity.type] || activityIcons.enrolment;
        
        return (
          <motion.div
            key={activity.id || index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-3 p-2 rounded-lg"
          >
            <Icon size={16} className={color} />
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>
                {activity.message}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}