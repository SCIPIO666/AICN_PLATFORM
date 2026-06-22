
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Calendar, Award, BookOpen, Clock, Edit, Save, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useAdminModalStore } from '@/stores/useAdminModalStore';
import { useUpdateUserRole } from '@/hooks';
import { safeFormatDate } from '@/utils/date';
import { toast } from '@/stores/toastStore';

export default function UserDetailsModal() {
  const { isUserDetailsOpen, selectedUser, closeUserDetails } = useAdminModalStore();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const { mutate: updateUserRole, isPending: isUpdating } = useUpdateUserRole();

  if (!isUserDetailsOpen || !selectedUser) return null;

  const handleRoleUpdate = () => {
    if (!selectedRole || selectedRole === selectedUser.role) {
      setIsEditing(false);
      return;
    }

    const confirmed = window.confirm(
      `Change ${selectedUser.name}'s role from ${selectedUser.role} to ${selectedRole}?`
    );

    if (!confirmed) return;

    updateUserRole(
      { userId: selectedUser.id, newRole: selectedRole },
      {
        onSuccess: () => {
          toast.success(`User role updated to ${selectedRole}`);
          setIsEditing(false);
          closeUserDetails();
        },
        onError: (error) => {
          toast.error(error?.message || 'Failed to update role');
        }
      }
    );
  };

  const stats = {
    enrolments: selectedUser.enrolments?.length || 0,
    sessions: selectedUser.sessions?.length || 0,
    certificates: selectedUser.certificates?.length || 0,
  };

  const roleColors = {
    ADMIN: { bg: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' },
    TRAINER: { bg: 'rgba(22, 101, 52, 0.1)', color: 'var(--color-forest-green)' },
    LEARNER: { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' },
  };

  const roleInfo = roleColors[selectedUser.role] || roleColors.LEARNER;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4"
        onClick={closeUserDetails}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="card-base shadow-elevated max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0"
                style={{ background: 'var(--color-forest-green)', color: 'white' }}
              >
                {selectedUser.name?.charAt(0) || 'U'}
              </div>
              <div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {selectedUser.name || 'Unknown User'}
                </h2>
                <p className="text-sm flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                  <Mail size={14} />
                  {selectedUser.email}
                </p>
                <p className="text-xs flex items-center gap-1 mt-1" style={{ color: 'var(--text-muted)' }}>
                  <Calendar size={12} />
                  Joined {safeFormatDate(selectedUser.createdAt, 'PPP')}
                </p>
              </div>
            </div>
            <button
              onClick={closeUserDetails}
              className="p-2 rounded-lg hover:bg-card-hover transition-colors"
            >
              <X size={20} style={{ color: 'var(--text-secondary)' }} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Role */}
            <div>
              <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Role</h3>
              {!isEditing ? (
                <div className="flex items-center gap-3">
                  <span
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      background: roleInfo.bg,
                      color: roleInfo.color
                    }}
                  >
                    {selectedUser.role}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedRole(selectedUser.role);
                      setIsEditing(true);
                    }}
                    className="p-1.5 rounded-lg hover:bg-card-hover transition-colors"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <Edit size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="px-3 py-1.5 rounded-lg select-themed"
                    disabled={isUpdating}
                  >
                    <option value="LEARNER">Learner</option>
                    <option value="TRAINER">Trainer</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                  <button
                    onClick={handleRoleUpdate}
                    disabled={isUpdating}
                    className="btn-primary p-2 flex items-center gap-1"
                  >
                    {isUpdating ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Save size={16} />
                    )}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="p-2 rounded-lg hover:bg-card-hover transition-colors"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Stats */}
            <div>
              <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>Activity</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 text-center rounded-lg" style={{ background: 'var(--bg-surface)' }}>
                  <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    {stats.enrolments}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Enrolments</p>
                </div>
                <div className="p-3 text-center rounded-lg" style={{ background: 'var(--bg-surface)' }}>
                  <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    {stats.sessions}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Sessions</p>
                </div>
                <div className="p-3 text-center rounded-lg" style={{ background: 'var(--bg-surface)' }}>
                  <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    {stats.certificates}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Certificates</p>
                </div>
              </div>
            </div>

            {/* User Info */}
            <div>
              <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Account Info</h3>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>User ID</span>
                  <span className="text-sm font-mono" style={{ color: 'var(--text-primary)' }}>{selectedUser.id}</span>
                </div>
                <div className="flex justify-between py-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Email</span>
                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{selectedUser.email}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Joined</span>
                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                    {selectedUser.createdAt ? safeFormatDate(selectedUser.createdAt, 'PPP') : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end p-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <button
              onClick={closeUserDetails}
              className="btn-secondary px-6 py-2"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}