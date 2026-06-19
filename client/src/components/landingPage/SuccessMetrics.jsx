import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState, useEffect, useRef } from 'react';
import Reveal from '@/components/Reveal';
import { fadeUp, staggerContainer } from '@/utils/motion';

const metrics = [
  { value: 94, label: 'Learner Satisfaction', suffix: '%' },
  { value: 98, label: 'Certificate Verification', suffix: '%' },
  { value: 12000, label: 'Certificates Issued' }
];

function AnimatedCounter({ end, duration = 2.5, suffix = '' }) {
  const [count, setCount] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  const elementRef = useRef(null);
  const [ref, inView] = useInView({ 
    threshold: 0.3, 
    triggerOnce: true 
  });

  useEffect(() => {
    if (inView && !isCounting) {
      setIsCounting(true);
      let startTime;
      const startValue = 0;
      const endValue = end;

      const updateCount = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        
        // Use easeOutQuart for smoother animation
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const currentCount = Math.floor(easedProgress * (endValue - startValue) + startValue);
        setCount(currentCount);

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        }
      };

      requestAnimationFrame(updateCount);
    }
  }, [inView, end, duration, isCounting]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function SuccessMetrics() {
  return (
    <section 
      className="card-base p-12 text-center relative overflow-hidden"
      style={{ background: 'var(--color-near-black)' }}
    >
      {/* Subtle background glow */}
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10"
        style={{ 
          background: 'var(--color-neon-volt)',
          filter: 'blur(80px)'
        }}
      />
      
      <div className="relative z-10">
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
          {metrics.map((metric, index) => (
            <Reveal key={metric.label} variant={fadeUp} delay={index * 0.1}>
              <motion.div
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                className="relative"
              >
                <div className="text-display-hero font-bold" style={{ color: 'var(--color-neon-volt)' }}>
                  <AnimatedCounter 
                    end={metric.value} 
                    suffix={metric.suffix || ''} 
                    duration={2.5}
                  />
                </div>
                <p className="mt-2 font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  {metric.label}
                </p>
                {/* Decorative underline */}
                <div 
                  className="w-12 h-0.5 mx-auto mt-3"
                  style={{ background: 'var(--color-neon-volt)' }}
                />
              </motion.div>
            </Reveal>
          ))}
        </motion.div>
      </div>
    </section>
  );
}