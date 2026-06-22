// src/components/dashboard/DashboardHeader.jsx
import { motion } from 'framer-motion';
import { User, Calendar, Sparkles } from 'lucide-react';

export default function DashboardHeader({ user, nextSession }) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="card-base p-6 md:p-8 relative overflow-hidden">
      <div
        className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10"
        style={{
          background: 'var(--color-forest-green)',
          filter: 'blur(60px)'
        }}
      />
      
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2"
        >
          <Sparkles size={20} style={{ color: 'var(--color-forest-green)' }} />
          <span className="text-sm font-medium" style={{ color: 'var(--color-forest-green)' }}>
            {getGreeting()}
          </span>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl font-bold mt-2"
          style={{ color: 'var(--text-primary)' }}
        >
          {user?.name || 'Learner'} 
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-2"
          style={{ color: 'var(--text-secondary)' }}
        >
          {nextSession ? (
            <>
              Your next session <strong style={{ color: 'var(--text-primary)' }}>
                {nextSession.title}
              </strong> starts {nextSession.startTime}
            </>
          ) : (
            'You have no upcoming sessions. Browse sessions to get started!'
          )}
        </motion.p>
      </div>
    </div>
  );
}