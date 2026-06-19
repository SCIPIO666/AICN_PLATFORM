import { motion } from 'framer-motion';
import { Users, BookOpen, UserCheck, Award } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { useState, useEffect } from 'react';
import Reveal from '@/components/Reveal';
import { fadeUp, staggerContainer } from '@/utils/motion';

const stats = [
  { icon: Users, value: 15000, label: 'Learners', suffix: '+' },
  { icon: BookOpen, value: 200, label: 'Courses', suffix: '+' },
  { icon: UserCheck, value: 100, label: 'Trainers', suffix: '+' },
  { icon: Award, value: 95, label: 'Completion Rate', suffix: '%' }
];

function AnimatedStat({ icon: Icon, value, label, suffix = '' }) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true });

  useEffect(() => {
    if (!inView) return;

    let startTime;
    const duration = 2000; // 2 seconds
    const startValue = 0;
    const endValue = value;

    const updateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // EaseOutQuart for smooth animation
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.floor(easedProgress * (endValue - startValue) + startValue);
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };

    requestAnimationFrame(updateCount);
  }, [inView, value]);

  return (
    <motion.div
      ref={ref}
      whileHover={{ scale: 1.05 }}
      className="text-center"
    >
      <Icon
        size={28}
        className="mx-auto mb-2"
        style={{ color: 'var(--color-neon-volt)' }}
      />
      <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
        {count.toLocaleString()}{suffix}
      </p>
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
        {label}
      </p>
    </motion.div>
  );
}

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
          <AnimatedStat 
            icon={stat.icon}
            value={stat.value}
            label={stat.label}
            suffix={stat.suffix || ''}
          />
        </Reveal>
      ))}
    </motion.div>
  );
}