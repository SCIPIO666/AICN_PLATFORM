
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Calendar, 
  ArrowLeft,
  Award,
  BookOpen,
  Clock,
  ChevronRight,
  AlertCircle,
  Edit,
  Save,
  X,
  Loader2
} from 'lucide-react';

import { useMe, useUpdateUserRole } from '@/hooks';
import Spinner from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { safeFormatDate } from '@/utils/date';
import { toast } from '@/stores/toastStore';

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  
  const { data, isLoading, error, refetch } = useMe(); // Get user by ID (you'd need a separate hook)
  const { mutate: updateUserRole, isPending: isUpdating } = useUpdateUserRole();

  // Note: You'd need a useUser(id) hook for this. Using useMe as placeholder.
  const user = data?.data || data;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-page)' }}>
        <Spinner />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-page)' }}>
        <div className="text-center max-w-md">
          <AlertCircle size={48} className="mx-auto mb-4" style={{ color: 'var(--error-text)' }} />
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            User not found
          </h3>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
            The user you're looking for doesn't exist.
          </p>
          <Link to="/admin/users" className="btn-primary inline-block">
            <ArrowLeft size={16} className="inline mr-2" />
            Back to Users
          </Link>
        </div>
      </div>
    );
  }

  const handleRoleUpdate = () => {
    if (!selectedRole || selectedRole === user.role) {
      setIsEditing(false);
      return;
    }

    const confirmed = window.confirm(
      `Change ${user.name}'s role from ${user.role} to ${selectedRole}?`
    );

    if (!confirmed) return;

    updateUserRole(
      { userId: user.id, newRole: selectedRole },
      {
        onSuccess: () => {
          toast.success(`User role updated to ${selectedRole}`);
          setIsEditing(false);
          refetch();
        },
        onError: (error) => {
          toast.error(error?.message || 'Failed to update role');
        }
      }
    );
  };

  const stats = {
    sessions: user.sessions?.length || 0,
    certificates: user.certificates?.length || 0,
    enrolments: user.enrolments?.length || 0,
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:px-8">
      {/* Back Button */}
      <Link
        to="/admin/users"
        className="inline-flex items-center gap-2 text-sm mb-6 transition-colors hover:opacity-80"
        style={{ color: 'var(--text-secondary)' }}
      >
        <ArrowLeft size={16} />
        Back to Users
      </Link>

      {/* User Profile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-base p-6 md:p-8"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold flex-shrink-0"
              style={{ background: 'var(--color-forest-green)', color: 'white' }}
            >
              {user.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {user.name || 'Unknown User'}
              </h1>
              <p className="text-sm flex items-center gap-1 mt-1" style={{ color: 'var(--text-secondary)' }}>
                <Mail size={14} />
                {user.email}
              </p>
              {user.createdAt && (
                <p className="text-xs mt-1 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                  <Calendar size={12} />
                  Joined {safeFormatDate(user.createdAt, 'PPP')}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <>
                <span
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    background: user.role === 'ADMIN' 
                      ? 'rgba(139, 92, 246, 0.1)' 
                      : user.role === 'TRAINER'
                      ? 'rgba(22, 101, 52, 0.1)'
                      : 'rgba(59, 130, 246, 0.1)',
                    color: user.role === 'ADMIN' 
                      ? '#8b5cf6' 
                      : user.role === 'TRAINER'
                      ? 'var(--color-forest-green)'
                      : '#3b82f6'
                  }}
                >
                  {user.role}
                </span>
                <button
                  onClick={() => {
                    setSelectedRole(user.role);
                    setIsEditing(true);
                  }}
                  className="p-2 rounded-lg transition-colors hover:bg-card-hover"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <Edit size={18} />
                </button>
              </>
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
                  className="p-2 rounded-lg transition-colors hover:bg-card-hover"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="card-base p-4 text-center">
          <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {stats.enrolments}
          </p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Enrolments</p>
        </div>
        <div className="card-base p-4 text-center">
          <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {stats.sessions}
          </p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Sessions</p>
        </div>
        <div className="card-base p-4 text-center">
          <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {stats.certificates}
          </p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Certificates</p>
        </div>
      </div>

      {/* Additional info could go here */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-base p-6 mt-6"
      >
        <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          Account Information
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>User ID</span>
            <span className="text-sm font-mono" style={{ color: 'var(--text-primary)' }}>{user.id}</span>
          </div>
          <div className="flex justify-between py-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Email</span>
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{user.email}</span>
          </div>
          <div className="flex justify-between py-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Role</span>
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{user.role}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Joined</span>
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
              {user.createdAt ? safeFormatDate(user.createdAt, 'PPP') : 'N/A'}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}