// src/components/dashboard/AnnouncementsWidget.jsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Bell, Calendar, Award, Info, ChevronRight, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const announcementIcons = {
  'info': Info,
  'event': Calendar,
  'achievement': Award,
  'alert': AlertCircle,
};

export default function AnnouncementsWidget({ announcements = [] }) {
  if (!announcements || announcements.length === 0) {
    return (
      <div className="text-center py-8" style={{ color: 'var(--text-muted)' }}>
        <Bell size={32} className="mx-auto mb-2 opacity-50" />
        <p className="text-sm">No announcements</p>
      </div>
    );
  }

  const latestAnnouncements = announcements.slice(0, 3);

  return (
    <div className="space-y-4">
      {latestAnnouncements.map((announcement, index) => {
        const Icon = announcementIcons[announcement.type] || Bell;
        
        return (
          <motion.div
            key={announcement.id || index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-3 p-3 rounded-lg transition-all hover:bg-card-hover"
          >
            <div 
              className="flex-shrink-0 p-2 rounded-full"
              style={{ background: 'rgba(250, 255, 105, 0.1)', color: 'var(--color-forest-green)' }}
            >
              <Icon size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {announcement.title}
              </p>
              <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                {announcement.content}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                {formatDistanceToNow(new Date(announcement.createdAt), { addSuffix: true })}
              </p>
            </div>
          </motion.div>
        );
      })}
      
      {announcements.length > 3 && (
        <Link
          to="/announcements"
          className="block text-center text-sm py-2 rounded-lg transition-colors"
          style={{ color: 'var(--color-forest-green)' }}
        >
          View all announcements →
        </Link>
      )}
    </div>
  );
}