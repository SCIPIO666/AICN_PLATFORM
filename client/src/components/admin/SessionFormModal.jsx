
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Monitor, MapPin, Loader2, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useAdminModalStore } from '@/stores/useAdminModalStore';
import { useCreateSession, useUpdateSession } from '@/hooks';
import { toast } from '@/stores/toastStore';

const SKILL_AREAS = [
  'Data Analysis',
  'Cyber Hygiene',
  'Digital Marketing',
  'Graphic Design',
  'Soft Skills',
  'Basics in Cyber Security',
  'Content Creation & Monetization',
  'Introduction to Online Jobs',
];

const LOCATION_TYPES = [
  { value: 'ONLINE', label: 'Online', icon: Monitor },
  { value: 'PHYSICAL', label: 'Physical', icon: MapPin },
];

export default function SessionFormModal() {
  const { isSessionFormOpen, sessionToEdit, closeSessionForm } = useAdminModalStore();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skillArea: '',
    locationType: 'ONLINE',
    county: '',
    venue: '',
    capacity: 20,
    date: '',
    durationMins: 60,
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { mutate: createSession } = useCreateSession();
  const { mutate: updateSession } = useUpdateSession();

  const isEditing = !!sessionToEdit;

  useEffect(() => {
    if (sessionToEdit) {
      setFormData({
        title: sessionToEdit.title || '',
        description: sessionToEdit.description || '',
        skillArea: sessionToEdit.skillArea || '',
        locationType: sessionToEdit.locationType || 'ONLINE',
        county: sessionToEdit.county || '',
        venue: sessionToEdit.venue || '',
        capacity: sessionToEdit.capacity || 20,
        date: sessionToEdit.date ? format(new Date(sessionToEdit.date), "yyyy-MM-dd'T'HH:mm") : '',
        durationMins: sessionToEdit.durationMins || 60,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        skillArea: '',
        locationType: 'ONLINE',
        county: '',
        venue: '',
        capacity: 20,
        date: '',
        durationMins: 60,
      });
    }
    setErrors({});
  }, [sessionToEdit]);

  if (!isSessionFormOpen) return null;

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.skillArea) newErrors.skillArea = 'Please select a skill area';
    if (!formData.date) newErrors.date = 'Date and time is required';
    if (formData.capacity < 1) newErrors.capacity = 'Capacity must be at least 1';
    if (formData.durationMins < 15) newErrors.durationMins = 'Duration must be at least 15 minutes';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    const sessionData = { ...formData, date: new Date(formData.date).toISOString() };
    
    if (isEditing) {
      updateSession(
        { id: sessionToEdit.id, data: sessionData },
        {
          onSuccess: () => {
            toast.success('Session updated successfully');
            closeSessionForm();
          },
          onError: (error) => toast.error(error?.message || 'Failed to update session')
        }
      );
    } else {
      createSession(sessionData, {
        onSuccess: () => {
          toast.success('Session created successfully');
          closeSessionForm();
        },
        onError: (error) => toast.error(error?.message || 'Failed to create session')
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
        onClick={closeSessionForm}
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
                {isEditing ? 'Edit Session' : 'Create Session'}
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                {isEditing ? 'Update session details' : 'Schedule a new training session'}
              </p>
            </div>
            <button onClick={closeSessionForm} className="p-2 rounded-lg hover:bg-card-hover transition-colors">
              <X size={20} style={{ color: 'var(--text-secondary)' }} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Form fields - same as CreateSessionModal */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg input-themed ${errors.title ? 'border-red-500' : ''}`}
                placeholder="Session title"
              />
              {errors.title && <p className="text-xs mt-1 text-red-500">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg input-themed ${errors.description ? 'border-red-500' : ''}`}
                rows={3}
                placeholder="Describe the session"
              />
              {errors.description && <p className="text-xs mt-1 text-red-500">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Skill Area *</label>
              <select
                value={formData.skillArea}
                onChange={(e) => setFormData({ ...formData, skillArea: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg select-themed ${errors.skillArea ? 'border-red-500' : ''}`}
              >
                <option value="">Select a skill area</option>
                {SKILL_AREAS.map((skill) => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
              {errors.skillArea && <p className="text-xs mt-1 text-red-500">{errors.skillArea}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Location Type *</label>
              <div className="flex gap-2">
                {LOCATION_TYPES.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFormData({ ...formData, locationType: value })}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                      formData.locationType === value ? 'border-forest-green bg-forest-green/10' : 'border-border-color hover:bg-card-hover'
                    }`}
                  >
                    <Icon size={16} style={{ color: formData.locationType === value ? 'var(--color-forest-green)' : 'var(--text-muted)' }} />
                    <span style={{ color: formData.locationType === value ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {formData.locationType === 'PHYSICAL' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>County</label>
                  <input
                    type="text"
                    value={formData.county}
                    onChange={(e) => setFormData({ ...formData, county: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg input-themed"
                    placeholder="e.g. Nairobi"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Venue</label>
                  <input
                    type="text"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg input-themed"
                    placeholder="e.g. Conference Room A"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Date & Time *</label>
              <input
                type="datetime-local"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg input-themed ${errors.date ? 'border-red-500' : ''}`}
              />
              {errors.date && <p className="text-xs mt-1 text-red-500">{errors.date}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Capacity *</label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                  className={`w-full px-4 py-2 rounded-lg input-themed ${errors.capacity ? 'border-red-500' : ''}`}
                  min="1"
                  max="500"
                />
                {errors.capacity && <p className="text-xs mt-1 text-red-500">{errors.capacity}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Duration (minutes) *</label>
                <input
                  type="number"
                  value={formData.durationMins}
                  onChange={(e) => setFormData({ ...formData, durationMins: parseInt(e.target.value) || 0 })}
                  className={`w-full px-4 py-2 rounded-lg input-themed ${errors.durationMins ? 'border-red-500' : ''}`}
                  min="15"
                  max="480"
                  step="5"
                />
                {errors.durationMins && <p className="text-xs mt-1 text-red-500">{errors.durationMins}</p>}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <button type="button" onClick={closeSessionForm} className="flex-1 btn-secondary py-2">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="flex-1 btn-primary py-2 flex items-center justify-center gap-2">
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                {isEditing ? 'Update Session' : 'Create Session'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}