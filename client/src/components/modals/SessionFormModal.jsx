// src/components/modals/SessionFormModal.jsx (Updated with validation)
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Monitor, MapPin, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useAdminModalStore } from '@/stores/useAdminModalStore';
import { useCreateSession, useUpdateSession } from '@/hooks';
import { toast } from '@/stores/toastStore';
import {
  SKILL_AREAS,
  LOCATION_TYPES,
  LOCATION_TYPE_VALUES,
  SESSION_STATUS,
  SESSION_STATUS_VALUES,
  validateSession,
  prepareSessionData,
  getDefaultSessionData,
  populateSessionData,
  formatDateForInput,
  sessionValidationRules,
} from '@/validators/sessions';

export default function SessionFormModal() {
  const { isSessionFormOpen, sessionToEdit, closeSessionForm } = useAdminModalStore();
  
  const [formData, setFormData] = useState(getDefaultSessionData());
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({});

  const { mutate: createSession, isPending: isCreating } = useCreateSession();
  const { mutate: updateSession, isPending: isUpdating } = useUpdateSession();

  const isEditing = !!sessionToEdit;
  const isPending = isCreating || isUpdating || isSubmitting;

  // Load session data for editing
  useEffect(() => {
    if (sessionToEdit) {
      setIsLoading(true);
      try {
        setFormData(populateSessionData(sessionToEdit));
        setSubmitError(null);
      } catch (error) {
        toast.error('Failed to load session data');
        console.error('Error loading session:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setFormData(getDefaultSessionData());
      setErrors({});
      setSubmitError(null);
      setTouched({});
    }
  }, [sessionToEdit]);

  // Reset on close
  useEffect(() => {
    if (!isSessionFormOpen) {
      setErrors({});
      setSubmitError(null);
      setIsSubmitting(false);
      setTouched({});
    }
  }, [isSessionFormOpen]);

  if (!isSessionFormOpen) return null;

  // Validate single field on blur
  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Validate only the touched field
    const validationErrors = validateSession(formData, isEditing);
    if (validationErrors[field]) {
      setErrors(prev => ({ ...prev, [field]: validationErrors[field] }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Validate all fields on submit
  const validateForm = () => {
    const validationErrors = validateSession(formData, isEditing);
    setErrors(validationErrors);
    
    // Touch all fields to show errors
    const allFields = Object.keys(formData);
    setTouched(allFields.reduce((acc, field) => ({ ...acc, [field]: true }), {}));
    
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      // Scroll to first error
      const firstError = document.querySelector('.border-red-500');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for API (matches backend schema)
      const sessionData = prepareSessionData(formData, isEditing);

      if (isEditing) {
        await new Promise((resolve, reject) => {
          updateSession(
            { id: sessionToEdit.id, data: sessionData },
            {
              onSuccess: (response) => {
                toast.success('Session updated successfully! 🎉');
                closeSessionForm();
                resolve(response);
              },
              onError: (error) => {
                const message = error?.response?.data?.message || error?.message || 'Failed to update session';
                setSubmitError(message);
                toast.error(message);
                reject(error);
              }
            }
          );
        });
      } else {
        await new Promise((resolve, reject) => {
          createSession(sessionData, {
            onSuccess: (response) => {
              toast.success('Session created successfully! 🎉');
              closeSessionForm();
              resolve(response);
            },
            onError: (error) => {
              const message = error?.response?.data?.message || error?.message || 'Failed to create session';
              setSubmitError(message);
              toast.error(message);
              reject(error);
            }
          });
        });
      }
    } catch (error) {
      console.error('Session submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const handleReset = () => {
    if (isEditing) {
      setFormData(populateSessionData(sessionToEdit));
    } else {
      setFormData(getDefaultSessionData());
    }
    setErrors({});
    setSubmitError(null);
    setTouched({});
  };

  // if field has error 
  const hasError = (field) => {
    return touched[field] && errors[field];
  };

  // Loading state
  if (isLoading) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="card-base shadow-elevated max-w-2xl w-full p-12 text-center"
          >
            <Loader2 size={48} className="animate-spin mx-auto" style={{ color: 'var(--color-forest-green)' }} />
            <p className="mt-4" style={{ color: 'var(--text-muted)' }}>Loading session data...</p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

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
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b sticky top-0" style={{ 
            borderColor: 'var(--border-color)',
            background: 'var(--bg-card)',
            zIndex: 10
          }}>
            <div>
              <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {isEditing ? 'Edit Session' : 'Create New Session'}
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                {isEditing ? 'Update your training session details' : 'Schedule a new training session'}
              </p>
            </div>
            <button 
              onClick={closeSessionForm} 
              disabled={isPending}
              className="p-2 rounded-lg hover:bg-card-hover transition-colors disabled:opacity-50"
            >
              <X size={20} style={{ color: 'var(--text-secondary)' }} />
            </button>
          </div>

          {/* Error Banner */}
          {submitError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-6 mt-4 p-4 rounded-lg flex items-start gap-3"
              style={{ 
                background: 'var(--error-bg)',
                border: '1px solid var(--error-border)',
                color: 'var(--error-text)'
              }}
            >
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Submission Failed</p>
                <p className="text-sm opacity-90">{submitError}</p>
              </div>
              <button 
                onClick={() => setSubmitError(null)}
                className="ml-auto p-1 rounded hover:bg-black/5"
              >
                <X size={16} />
              </button>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                Session Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                onBlur={() => handleBlur('title')}
                className={`w-full px-4 py-2 rounded-lg input-themed transition-all ${
                  hasError('title') ? 'border-red-500 ring-1 ring-red-500' : ''
                }`}
                placeholder="e.g. Introduction to Data Analysis"
                disabled={isPending}
                maxLength={sessionValidationRules.title.max}
                autoFocus
              />
              {hasError('title') && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs mt-1 text-red-500"
                >
                  {errors.title}
                </motion.p>
              )}
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                {formData.title.length}/{sessionValidationRules.title.max} characters
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                onBlur={() => handleBlur('description')}
                className={`w-full px-4 py-2 rounded-lg input-themed transition-all ${
                  hasError('description') ? 'border-red-500 ring-1 ring-red-500' : ''
                }`}
                rows={3}
                placeholder="Describe what participants will learn..."
                disabled={isPending}
                maxLength={sessionValidationRules.description.max}
              />
              {hasError('description') && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs mt-1 text-red-500"
                >
                  {errors.description}
                </motion.p>
              )}
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                {formData.description?.length || 0}/{sessionValidationRules.description.max} characters
              </p>
            </div>

            {/* Skill Area */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                Skill Area <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.skillArea}
                onChange={(e) => setFormData({ ...formData, skillArea: e.target.value })}
                onBlur={() => handleBlur('skillArea')}
                className={`w-full px-4 py-2 rounded-lg select-themed transition-all ${
                  hasError('skillArea') ? 'border-red-500 ring-1 ring-red-500' : ''
                }`}
                disabled={isPending}
              >
                <option value="">Select a skill area</option>
                {SKILL_AREAS.map((skill) => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
              {hasError('skillArea') && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs mt-1 text-red-500"
                >
                  {errors.skillArea}
                </motion.p>
              )}
            </div>

            {/* Location Type */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                Location Type <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                {LOCATION_TYPE_VALUES.map((value) => {
                  const label = value.charAt(0) + value.slice(1).toLowerCase();
                  const Icon = value === 'ONLINE' ? Monitor : MapPin;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, locationType: value });
                        setTouched(prev => ({ ...prev, locationType: true }));
                      }}
                      disabled={isPending}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                        formData.locationType === value 
                          ? 'border-forest-green bg-forest-green/10' 
                          : 'border-border-color hover:bg-card-hover'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
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
                  );
                })}
              </div>
              {hasError('locationType') && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs mt-1 text-red-500"
                >
                  {errors.locationType}
                </motion.p>
              )}
            </div>

            {/* County & Venue (Physical only) */}
            {formData.locationType === 'PHYSICAL' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden"
              >
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                    County
                  </label>
                  <input
                    type="text"
                    value={formData.county}
                    onChange={(e) => setFormData({ ...formData, county: e.target.value })}
                    onBlur={() => handleBlur('county')}
                    className={`w-full px-4 py-2 rounded-lg input-themed transition-all ${
                      hasError('county') ? 'border-red-500 ring-1 ring-red-500' : ''
                    }`}
                    placeholder="e.g. Nairobi"
                    disabled={isPending}
                    maxLength={sessionValidationRules.county.max}
                  />
                  {hasError('county') && (
                    <p className="text-xs mt-1 text-red-500">{errors.county}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                    Venue <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    onBlur={() => handleBlur('venue')}
                    className={`w-full px-4 py-2 rounded-lg input-themed transition-all ${
                      hasError('venue') ? 'border-red-500 ring-1 ring-red-500' : ''
                    }`}
                    placeholder="e.g. Conference Room A"
                    disabled={isPending}
                    maxLength={sessionValidationRules.venue.max}
                  />
                  {hasError('venue') && (
                    <p className="text-xs mt-1 text-red-500">{errors.venue}</p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Date & Time */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                Date & Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                onBlur={() => handleBlur('date')}
                className={`w-full px-4 py-2 rounded-lg input-themed transition-all ${
                  hasError('date') ? 'border-red-500 ring-1 ring-red-500' : ''
                }`}
                disabled={isPending}
                min={formatDateForInput(new Date())}
              />
              {hasError('date') && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs mt-1 text-red-500"
                >
                  {errors.date}
                </motion.p>
              )}
            </div>

            {/* Capacity & Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                  Capacity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                  onBlur={() => handleBlur('capacity')}
                  className={`w-full px-4 py-2 rounded-lg input-themed transition-all ${
                    hasError('capacity') ? 'border-red-500 ring-1 ring-red-500' : ''
                  }`}
                  min={sessionValidationRules.capacity.min}
                  max={sessionValidationRules.capacity.max}
                  disabled={isPending}
                />
                {hasError('capacity') && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs mt-1 text-red-500"
                  >
                    {errors.capacity}
                  </motion.p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                  Duration (minutes) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.durationMins}
                  onChange={(e) => setFormData({ ...formData, durationMins: parseInt(e.target.value) || 0 })}
                  onBlur={() => handleBlur('durationMins')}
                  className={`w-full px-4 py-2 rounded-lg input-themed transition-all ${
                    hasError('durationMins') ? 'border-red-500 ring-1 ring-red-500' : ''
                  }`}
                  min={sessionValidationRules.durationMins.min}
                  max={sessionValidationRules.durationMins.max}
                  step="5"
                  disabled={isPending}
                />
                {hasError('durationMins') && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs mt-1 text-red-500"
                  >
                    {errors.durationMins}
                  </motion.p>
                )}
              </div>
            </div>

            {/* Status (Edit only) */}
            {isEditing && (
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg select-themed"
                  disabled={isPending}
                >
                  {SESSION_STATUS_VALUES.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0) + status.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex gap-3 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <button 
                type="button" 
                onClick={handleReset}
                disabled={isPending}
                className="flex-1 btn-secondary py-2 disabled:opacity-50"
              >
                Reset
              </button>
              <button 
                type="button" 
                onClick={closeSessionForm}
                disabled={isPending}
                className="flex-1 btn-secondary py-2 disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isPending}
                className="flex-1 btn-primary py-2 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isPending ? (
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