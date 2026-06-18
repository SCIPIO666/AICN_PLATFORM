import { motion } from 'framer-motion';
import { Users, BookOpen, UserCheck, Award } from 'lucide-react';

const stats = [
  { icon: Users, value: '15,000+', label: 'Learners' },
  { icon: BookOpen, value: '200+', label: 'Courses' },
  { icon: UserCheck, value: '100+', label: 'Trainers' },
  { icon: Award, value: '95%', label: 'Completion Rate' }
];

export default function Stats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
      {stats.map((stat, idx) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          whileHover={{ scale: 1.05 }}
          className="text-center"
        >
          <stat.icon
            size={24}
            className="mx-auto mb-2"
            style={{ color: 'var(--color-neon-volt)' }}
          />
          <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {stat.value}
          </p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {stat.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}