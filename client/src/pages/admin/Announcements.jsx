// src/pages/admin/Announcements.jsx (Refactored)
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Plus, Search, X, AlertCircle, Eye, Edit, Trash2, Calendar } from 'lucide-react';
import { useAnnouncements, useDeleteAnnouncement } from '@/hooks';
import { useAdminModalStore } from '@/stores/useAdminModalStore';
import Spinner from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { safeFormatRelative } from '@/utils/date';
import { toast } from '@/stores/toastStore';
import AnnouncementFormModal from '@/components/admin/AnnouncementFormModal';

function AnnouncementCard({ announcement, onView, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const typeColors = {
    info: { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6', label: 'Info' },
    event: { bg: 'rgba(139,92,246,0.1)', color: '#8b5cf6', label: 'Event' },
    achievement: { bg: 'rgba(251,191,36,0.1)', color: '#d97706', label: 'Achievement' },
    alert: { bg: 'rgba(220,38,38,0.1)', color: '#dc2626', label: 'Alert' },
  };
  const typeInfo = typeColors[announcement.type] || typeColors.info;

  const handleDelete = () => {
    if (!window.confirm(`Delete "${announcement.title}"?`)) return;
    setIsDeleting(true);
    onDelete(announcement.id, { onSettled: () => setIsDeleting(false) });
  };

  return (
    <motion.div whileHover={{ y: -4 }} className="card-base p-6 transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold truncate" style={{ color: 'var(--text-primary)' }}>{announcement.title}</h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: typeInfo.bg, color: typeInfo.color }}>{typeInfo.label}</span>
          </div>
          <p className="text-sm mt-1 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{announcement.content}</p>
          <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span className="flex items-center gap-1"><Calendar size={12} />{safeFormatRelative(announcement.createdAt)}</span>
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          <button onClick={() => onView(announcement)} className="p-2 rounded-lg hover:bg-card-hover" style={{ color: 'var(--text-secondary)' }}><Eye size={18} /></button>
          <button onClick={() => onView(announcement)} className="p-2 rounded-lg hover:bg-card-hover" style={{ color: 'var(--text-secondary)' }}><Edit size={18} /></button>
          <button onClick={handleDelete} disabled={isDeleting} className="p-2 rounded-lg hover:bg-red-100" style={{ color: 'var(--error-text)' }}><Trash2 size={18} /></button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Announcements() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const { openAnnouncementForm } = useAdminModalStore();
  const { data, isLoading, error, refetch } = useAnnouncements({ search: searchTerm, type: typeFilter !== 'all' ? typeFilter : undefined });
  const { mutate: deleteAnnouncement } = useDeleteAnnouncement();

  if (isLoading) return <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-page)' }}><Spinner /></div>;
  if (error) return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-page)' }}>
      <div className="text-center max-w-md">
        <AlertCircle size={48} className="mx-auto mb-4" style={{ color: 'var(--error-text)' }} />
        <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Failed to load announcements</h3>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    </div>
  );

  const announcements = data?.data || [];

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Bell size={28} style={{ color: 'var(--color-forest-green)' }} />
              Announcements
            </h1>
            <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>Manage platform announcements</p>
          </div>
          <button onClick={() => openAnnouncementForm()} className="btn-primary flex items-center gap-2 px-6 py-2.5">
            <Plus size={18} /> Post Announcement
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input type="text" placeholder="Search announcements..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg input-themed" />
          </div>
          <div className="flex gap-2">
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-4 py-2 rounded-lg select-themed">
              <option value="all">All Types</option>
              <option value="info">Info</option>
              <option value="event">Event</option>
              <option value="achievement">Achievement</option>
              <option value="alert">Alert</option>
            </select>
            {(searchTerm || typeFilter !== 'all') && (
              <Button variant="ghost" className="flex items-center gap-2" onClick={() => { setSearchTerm(''); setTypeFilter('all'); }}>
                <X size={16} /> Clear
              </Button>
            )}
          </div>
        </div>

        {announcements.length > 0 ? (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <AnnouncementCard 
                key={announcement.id} 
                announcement={announcement} 
                onView={openAnnouncementForm} 
                onDelete={deleteAnnouncement} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 card-base">
            <Bell size={48} className="mx-auto mb-4 opacity-50" style={{ color: 'var(--text-muted)' }} />
            <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>No announcements found</h3>
          </div>
        )}
      </div>

      <AnnouncementFormModal />
    </>
  );
}