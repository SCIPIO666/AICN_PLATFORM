
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Monitor,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';

import { useCreateSession, useUpdateSession } from '@/hooks';
import { useTrainerModalStore } from '@/stores/useTrainerModalStore';
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

export default function CreateSessionModal() {
  const { isCreateSessionOpen, sessionToEdit, closeCreateSession } = useTrainerModalStore();
  
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

  // Populate form when editing
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
      // Reset form for new session
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

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Session title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Session description is required';
    }
    if (!formData.skillArea) {
      newErrors.skillArea = 'Please select a skill area';
    }
    if (!formData.date) {
      newErrors.date = 'Session date and time is required';
    }
    if (formData.capacity < 1) {
      newErrors.capacity = 'Capacity must be at least 1';
    }
    if (formData.durationMins < 15) {
      newErrors.durationMins = 'Duration must be at least 15 minutes';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const sessionData = {
        ...formData,
        date: new Date(formData.date).toISOString(),
      };
      
      if (isEditing) {
        // Update existing session
        updateSession(
          { id: sessionToEdit.id, data: sessionData },
          {
            onSuccess: () => {
              toast.success('Session updated successfully');
              closeCreateSession();
            },
            onError: (error) => {
              toast.error(error?.response?.data?.message || 'Failed to update session');
            }
          }
        );
      } else {
        // Create new session
        createSession(sessionData, {
          onSuccess: () => {
            toast.success('Session created successfully');
            closeCreateSession();
          },
          onError: (error) => {
            toast.error(error?.response?.data?.message || 'Failed to create session');
          }
        });
      }
    } catch (error) {
      toast.error(error?.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isCreateSessionOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4"
        onClick={closeCreateSession}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="card-base shadow-elevated max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <div>
              <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {isEditing ? 'Edit Session' : 'Create New Session'}
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                {isEditing ? 'Update your training session details' : 'Schedule a new training session'}
              </p>
            </div>
            <button
              onClick={closeCreateSession}
              className="p-2 rounded-lg hover:bg-card-hover transition-colors"
            >
              <X size={20} style={{ color: 'var(--text-secondary)' }} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                Session Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg input-themed ${errors.title ? 'border-red-500' : ''}`}
                placeholder="e.g. Introduction to Data Analysis"
              />
              {errors.title && (
                <p className="text-xs mt-1 text-red-500">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg input-themed ${errors.description ? 'border-red-500' : ''}`}
                rows={3}
                placeholder="Describe what participants will learn..."
              />
              {errors.description && (
                <p className="text-xs mt-1 text-red-500">{errors.description}</p>
              )}
            </div>

            {/* Skill Area */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                Skill Area *
              </label>
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
              {errors.skillArea && (
                <p className="text-xs mt-1 text-red-500">{errors.skillArea}</p>
              )}
            </div>

            {/* Location Type */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                Location Type *
              </label>
              <div className="flex gap-2">
                {LOCATION_TYPES.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFormData({ ...formData, locationType: value })}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                      formData.locationType === value
                        ? 'border-forest-green bg-forest-green/10'
                        : 'border-border-color hover:bg-card-hover'
                    }`}
                    style={{
                      borderColor: formData.locationType === value ? 'var(--color-forest-green)' : 'var(--border-color)',
                    }}
                  >
                    <Icon size={16} style={{ 
                      color: formData.locationType === value ? 'var(--color-forest-green)' : 'var(--text-muted)' 
                    }} />
                    <span style={{ 
                      color: formData.locationType === value ? 'var(--text-primary)' : 'var(--text-secondary)' 
                    }}>
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* County & Venue (Physical only) */}
            {formData.locationType === 'PHYSICAL' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                    County
                  </label>
                  <input
                    type="text"
                    value={formData.county}
                    onChange={(e) => setFormData({ ...formData, county: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg input-themed"
                    placeholder="e.g. Nairobi"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                    Venue
                  </label>
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

            {/* Date & Time */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                Date & Time *
              </label>
              <input
                type="datetime-local"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg input-themed ${errors.date ? 'border-red-500' : ''}`}
              />
              {errors.date && (
                <p className="text-xs mt-1 text-red-500">{errors.date}</p>
              )}
            </div>

            {/* Capacity & Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                  Capacity *
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                  className={`w-full px-4 py-2 rounded-lg input-themed ${errors.capacity ? 'border-red-500' : ''}`}
                  min="1"
                  max="500"
                />
                {errors.capacity && (
                  <p className="text-xs mt-1 text-red-500">{errors.capacity}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  value={formData.durationMins}
                  onChange={(e) => setFormData({ ...formData, durationMins: parseInt(e.target.value) || 0 })}
                  className={`w-full px-4 py-2 rounded-lg input-themed ${errors.durationMins ? 'border-red-500' : ''}`}
                  min="15"
                  max="480"
                  step="5"
                />
                {errors.durationMins && (
                  <p className="text-xs mt-1 text-red-500">{errors.durationMins}</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <button
                type="button"
                onClick={closeCreateSession}
                className="flex-1 btn-secondary py-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 btn-primary py-2 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    {isEditing ? 'Update Session' : 'Create Session'}
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}