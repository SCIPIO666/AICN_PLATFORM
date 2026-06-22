
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users as UsersIcon, Search, Filter, X, AlertCircle, Eye, Mail, Calendar } from 'lucide-react';
import { useUsers } from '@/hooks';
import { useAdminModalStore } from '@/stores/useAdminModalStore';
import Spinner from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { safeFormatDate } from '@/utils/date';
import UserDetailsModal from '@/components/admin/UserDetailsModal';

function UserRow({ user, onView }) {
  const roleColors = {
    ADMIN: { bg: 'rgba(139,92,246,0.1)', color: '#8b5cf6' },
    TRAINER: { bg: 'rgba(22,101,52,0.1)', color: 'var(--color-forest-green)' },
    LEARNER: { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6' },
  };
  const roleInfo = roleColors[user.role] || roleColors.LEARNER;

  return (
    <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b transition-all hover:bg-card-hover" style={{ borderColor: 'var(--border-color)' }}>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: 'var(--color-forest-green)', color: 'white' }}>
            {user.name?.charAt(0) || 'U'}
          </div>
          <div>
            <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{user.name || 'Unknown'}</p>
            <p className="text-xs flex items-center gap-1" style={{ color: 'var(--text-muted)' }}><Mail size={12} />{user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ background: roleInfo.bg, color: roleInfo.color }}>{user.role}</span>
      </td>
      <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>{user.createdAt ? safeFormatDate(user.createdAt, 'MMM d, yyyy') : 'N/A'}</td>
      <td className="px-4 py-3">
        <button onClick={() => onView(user)} className="p-1.5 rounded-lg transition-colors hover:bg-card-hover" style={{ color: 'var(--text-secondary)' }}>
          <Eye size={16} />
        </button>
      </td>
    </motion.tr>
  );
}

export default function Users() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const { openUserDetails } = useAdminModalStore();
  const { data, isLoading, error, refetch } = useUsers({ search: searchTerm, role: roleFilter !== 'all' ? roleFilter : undefined });

  if (isLoading) return <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-page)' }}><Spinner /></div>;
  if (error) return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-page)' }}>
      <div className="text-center max-w-md">
        <AlertCircle size={48} className="mx-auto mb-4" style={{ color: 'var(--error-text)' }} />
        <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Failed to load users</h3>
        <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>{error?.message || 'Please try refreshing.'}</p>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    </div>
  );

  const users = data?.data || [];

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>User Management</h1>
            <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>Manage platform users and their roles</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input type="text" placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg input-themed" />
          </div>
          <div className="flex gap-2">
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="px-4 py-2 rounded-lg select-themed">
              <option value="all">All Roles</option>
              <option value="LEARNER">Learner</option>
              <option value="TRAINER">Trainer</option>
              <option value="ADMIN">Admin</option>
            </select>
            {(searchTerm || roleFilter !== 'all') && (
              <Button variant="ghost" className="flex items-center gap-2" onClick={() => { setSearchTerm(''); setRoleFilter('all'); }}>
                <X size={16} /> Clear
              </Button>
            )}
          </div>
        </div>

        {users.length > 0 ? (
          <div className="card-base overflow-hidden">
            <table className="w-full">
              <thead style={{ background: 'var(--bg-surface)' }}>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>User</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Role</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Joined</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>{users.map((user) => <UserRow key={user.id} user={user} onView={openUserDetails} />)}</tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 card-base">
            <UsersIcon size={48} className="mx-auto mb-4 opacity-50" style={{ color: 'var(--text-muted)' }} />
            <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>No users found</h3>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{searchTerm || roleFilter !== 'all' ? 'Try adjusting your filters' : 'No users registered yet'}</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <UserDetailsModal />
    </>
  );
}