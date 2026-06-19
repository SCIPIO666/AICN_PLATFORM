import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState, useEffect } from 'react';
import Reveal from '@/components/Reveal';
import { fadeUp, staggerContainer } from '@/utils/motion';

const metrics = [
  { value: 94, label: 'Learner Satisfaction', suffix: '%' },
  { value: 98, label: 'Certificate Verification', suffix: '%' },
  { value: 12000, label: 'Certificates Issued' }
];

function AnimatedCounter({ end, duration = 2.5, suffix = '' }) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true });

  useEffect(() => {
    if (!inView) return;

    let startTime;
    const startValue = 0;
    const endValue = end;

    const updateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const currentCount = Math.floor(progress * (endValue - startValue) + startValue);
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };

    requestAnimationFrame(updateCount);
  }, [inView, end, duration]);

  return <span>{count.toLocaleString()}{suffix}</span>;
}

export default function SuccessMetrics() {
  return (
    <section 
      className="card-base p-12 text-center"
      style={{ background: 'var(--color-near-black)' }}
    >
      <div className="text-center">
        <Reveal variant={fadeUp}>
          <p className="label-uppercase" style={{ color: 'var(--color-neon-volt)' }}>
            Our Impact
          </p>
        </Reveal>
        <Reveal variant={fadeUp} delay={0.1}>
          <h2 className="text-feature-heading font-bold mb-8" style={{ color: 'white' }}>
            Success Metrics That Matter
          </h2>
        </Reveal>
      </div>

      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-3 gap-8"
      >
        {metrics.map((metric) => (
          <Reveal key={metric.label} variant={fadeUp}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-display-hero font-bold" style={{ color: 'var(--color-neon-volt)' }}>
                <AnimatedCounter 
                  end={metric.value} 
                  suffix={metric.suffix || ''} 
                />
              </div>
              <p className="mt-2 font-semibold" style={{ color: 'var(--text-secondary)' }}>
                {metric.label}
              </p>
            </motion.div>
          </Reveal>
        ))}
      </motion.div>
    </section>
  );
}