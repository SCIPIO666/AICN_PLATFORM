
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Award, 
  Calendar,
  Edit,
  Save,
  X,
  AlertCircle,
  Users,
  Clock,
  CheckCircle,
  Briefcase,
  Sparkles
} from 'lucide-react';

import { useMyTrainerProfile, useUpdateTrainerProfile } from '@/hooks';
import { useMe } from '@/hooks';
import Spinner from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { toast } from '@/stores/toastStore';

export default function TrainerProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  
  const { data: userData, isLoading: userLoading } = useMe();
  const { data: profileData, isLoading: profileLoading, refetch } = useMyTrainerProfile();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateTrainerProfile();

  const user = userData?.data || userData;
  const profile = profileData?.data || profileData;

  const isLoading = userLoading || profileLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-page)' }}>
        <Spinner />
      </div>
    );
  }

  const stats = {
    sessions: profile?.totalSessions || 0,
    learners: profile?.totalLearners || 0,
    certificates: profile?.totalCertificates || 0,
    rating: profile?.rating || 0,
  };

  const handleEdit = () => {
    setFormData({
      bio: profile?.bio || '',
      skills: profile?.skills?.join(', ') || '',
      availability: profile?.availability || 'online-only',
      experience: profile?.experience || '',
      county: profile?.county || '',
      phone: user?.phone || '',
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({});
  };

  const handleSubmit = () => {
    const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(Boolean);
    
    updateProfile({
      bio: formData.bio,
      skills: skillsArray,
      availability: formData.availability,
      experience: formData.experience,
      county: formData.county,
      phone: formData.phone,
    }, {
      onSuccess: () => {
        toast.success('Profile updated successfully');
        setIsEditing(false);
        refetch();
      },
      onError: (error) => {
        toast.error(error?.message || 'Failed to update profile');
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-base p-6 md:p-8 relative overflow-hidden"
      >
        <div
          className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10"
          style={{
            background: 'var(--color-forest-green)',
            filter: 'blur(60px)'
          }}
        />
        <div className="relative flex items-start justify-between">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold flex-shrink-0"
              style={{ background: 'var(--color-forest-green)', color: 'white' }}
            >
              {user?.name?.charAt(0) || 'T'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {user?.name || 'Trainer'}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{ background: 'rgba(22, 101, 52, 0.1)', color: 'var(--color-forest-green)' }}
                >
                  Trainer
                </span>
              </div>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                <Mail size={14} className="inline mr-1" />
                {user?.email || 'No email'}
              </p>
              {profile?.experience && (
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                  <Briefcase size={14} className="inline mr-1" />
                  {profile.experience}
                </p>
              )}
            </div>
          </div>
          {!isEditing && (
            <Button onClick={handleEdit} className="flex items-center gap-2">
              <Edit size={16} />
              Edit Profile
            </Button>
          )}
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="card-base p-4 text-center">
          <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {stats.sessions}
          </p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Sessions</p>
        </div>
        <div className="card-base p-4 text-center">
          <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {stats.learners}
          </p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Learners</p>
        </div>
        <div className="card-base p-4 text-center">
          <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {stats.certificates}
          </p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Certificates</p>
        </div>
        <div className="card-base p-4 text-center">
          <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {stats.rating}★
          </p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Rating</p>
        </div>
      </div>

      {/* Profile Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-base p-6 mt-6"
      >
        {isEditing ? (
          // Edit Mode
          <div className="space-y-4">
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              Edit Profile
            </h2>
            
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-4 py-2 rounded-lg input-themed"
                rows={4}
                placeholder="Tell learners about yourself..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                Skills (comma separated)
              </label>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                className="w-full px-4 py-2 rounded-lg input-themed"
                placeholder="e.g. JavaScript, Python, React"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                Experience
              </label>
              <input
                type="text"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="w-full px-4 py-2 rounded-lg input-themed"
                placeholder="e.g. 5 years in software development"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                Availability
              </label>
              <select
                value={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                className="w-full px-4 py-2 rounded-lg select-themed"
              >
                <option value="online-only">Online Only</option>
                <option value="weekdays">Weekdays</option>
                <option value="weekends">Weekends</option>
                <option value="evenings">Evenings</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                County / Location
              </label>
              <input
                type="text"
                value={formData.county}
                onChange={(e) => setFormData({ ...formData, county: e.target.value })}
                className="w-full px-4 py-2 rounded-lg input-themed"
                placeholder="e.g. Nairobi, Kenya"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                Phone Number
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 rounded-lg input-themed"
                placeholder="e.g. +254 700 000 000"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSubmit} disabled={isUpdating} className="flex items-center gap-2">
                {isUpdating ? (
                  <>
                    <div className="animate-spin">⏳</div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Changes
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleCancel} className="flex items-center gap-2">
                <X size={16} />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          // View Mode
          <div className="space-y-4">
            {profile?.bio && (
              <div>
                <h3 className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  About
                </h3>
                <p className="mt-1" style={{ color: 'var(--text-primary)' }}>
                  {profile.bio}
                </p>
              </div>
            )}

            {profile?.skills?.length > 0 && (
              <div>
                <h3 className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        background: 'rgba(22, 101, 52, 0.1)',
                        color: 'var(--color-forest-green)'
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile?.availability && (
                <div>
                  <h3 className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                    Availability
                  </h3>
                  <p className="mt-1" style={{ color: 'var(--text-primary)' }}>
                    {profile.availability}
                  </p>
                </div>
              )}
              {profile?.county && (
                <div>
                  <h3 className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                    Location
                  </h3>
                  <p className="mt-1" style={{ color: 'var(--text-primary)' }}>
                    {profile.county}
                  </p>
                </div>
              )}
              {user?.phone && (
                <div>
                  <h3 className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                    Phone
                  </h3>
                  <p className="mt-1" style={{ color: 'var(--text-primary)' }}>
                    {user.phone}
                  </p>
                </div>
              )}
              {profile?.createdAt && (
                <div>
                  <h3 className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                    Trainer Since
                  </h3>
                  <p className="mt-1" style={{ color: 'var(--text-primary)' }}>
                    {new Date(profile.createdAt).toLocaleDateString('en-KE', {
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}