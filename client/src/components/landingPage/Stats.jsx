import { motion } from 'framer-motion';
import { Users, BookOpen, UserCheck, Award, TrendingUp } from 'lucide-react';
import Reveal from '@/components/Reveal';
import { fadeUp, staggerContainer } from '@/utils/motion';

const stats = [
  { icon: Users, value: '15,000+', label: 'Learners' },
  { icon: BookOpen, value: '200+', label: 'Courses' },
  { icon: UserCheck, value: '100+', label: 'Trainers' },
  { icon: Award, value: '95%', label: 'Completion Rate' }
];

export default function Stats() {
  return (
    <motion.div 
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border-t"
      style={{ borderColor: 'var(--border-color)' }}
    >
      {stats.map((stat) => (
        <Reveal key={stat.label} variant={fadeUp}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-center"
          >
            <stat.icon
              size={28}
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
        </Reveal>
      ))}
    </motion.div>
  );
}