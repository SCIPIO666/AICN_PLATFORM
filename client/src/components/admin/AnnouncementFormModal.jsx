
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, Calendar, Award, AlertTriangle, Loader2, Save } from 'lucide-react';
import { useAdminModalStore } from '@/stores/useAdminModalStore';
import { useCreateAnnouncement, useUpdateAnnouncement } from '@/hooks';
import { toast } from '@/stores/toastStore';

const ANNOUNCEMENT_TYPES = [
  { value: 'info', label: 'Info', icon: Info, color: '#3b82f6' },
  { value: 'event', label: 'Event', icon: Calendar, color: '#8b5cf6' },
  { value: 'achievement', label: 'Achievement', icon: Award, color: '#d97706' },
  { value: 'alert', label: 'Alert', icon: AlertTriangle, color: '#dc2626' },
];

export default function AnnouncementFormModal() {
  const { isAnnouncementFormOpen, announcementToEdit, closeAnnouncementForm } = useAdminModalStore();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'info',
    isPublished: true,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { mutate: createAnnouncement } = useCreateAnnouncement();
  const { mutate: updateAnnouncement } = useUpdateAnnouncement();

  const isEditing = !!announcementToEdit;

  useEffect(() => {
    if (announcementToEdit) {
      setFormData({
        title: announcementToEdit.title || '',
        content: announcementToEdit.content || '',
        type: announcementToEdit.type || 'info',
        isPublished: announcementToEdit.isPublished !== undefined ? announcementToEdit.isPublished : true,
      });
    } else {
      setFormData({ title: '', content: '', type: 'info', isPublished: true });
    }
    setErrors({});
  }, [announcementToEdit]);

  if (!isAnnouncementFormOpen) return null;

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.content.trim()) newErrors.content = 'Content is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    const data = { ...formData };
    
    if (isEditing) {
      updateAnnouncement(
        { id: announcementToEdit.id, data },
        {
          onSuccess: () => {
            toast.success('Announcement updated');
            closeAnnouncementForm();
          },
          onError: (error) => toast.error(error?.message || 'Failed to update')
        }
      );
    } else {
      createAnnouncement(data, {
        onSuccess: () => {
          toast.success('Announcement created');
          closeAnnouncementForm();
        },
        onError: (error) => toast.error(error?.message || 'Failed to create')
      });
    }
    setIsSubmitting(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4"
        onClick={closeAnnouncementForm}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="card-base shadow-elevated max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <div>
              <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {isEditing ? 'Edit Announcement' : 'Post Announcement'}
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                {isEditing ? 'Update announcement' : 'Create a new announcement'}
              </p>
            </div>
            <button onClick={closeAnnouncementForm} className="p-2 rounded-lg hover:bg-card-hover transition-colors">
              <X size={20} style={{ color: 'var(--text-secondary)' }} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg input-themed ${errors.title ? 'border-red-500' : ''}`}
                placeholder="Announcement title"
              />
              {errors.title && <p className="text-xs mt-1 text-red-500">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Content *</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg input-themed ${errors.content ? 'border-red-500' : ''}`}
                rows={5}
                placeholder="Write your announcement..."
              />
              {errors.content && <p className="text-xs mt-1 text-red-500">{errors.content}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Type *</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {ANNOUNCEMENT_TYPES.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: value })}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                      formData.type === value ? 'border-forest-green bg-forest-green/10' : 'border-border-color hover:bg-card-hover'
                    }`}
                  >
                    <Icon size={14} style={{ color: formData.type === value ? 'var(--color-forest-green)' : 'var(--text-muted)' }} />
                    <span className="text-sm" style={{ color: formData.type === value ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Status</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.isPublished === true}
                    onChange={() => setFormData({ ...formData, isPublished: true })}
                    className="w-4 h-4"
                    style={{ accentColor: 'var(--color-forest-green)' }}
                  />
                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Published</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.isPublished === false}
                    onChange={() => setFormData({ ...formData, isPublished: false })}
                    className="w-4 h-4"
                    style={{ accentColor: 'var(--color-forest-green)' }}
                  />
                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Draft</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <button type="button" onClick={closeAnnouncementForm} className="flex-1 btn-secondary py-2">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="flex-1 btn-primary py-2 flex items-center justify-center gap-2">
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {isEditing ? 'Update' : 'Post'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}