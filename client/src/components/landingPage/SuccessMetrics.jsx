import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

const metrics = [
  { value: 94, label: 'Learner Satisfaction', suffix: '%' },
  { value: 98, label: 'Certificate Verification', suffix: '%' },
  { value: 12000, label: 'Certificates Issued', prefix: '' }
];

export default function SuccessMetrics() {
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="card-base p-12 text-center"
      style={{ background: 'var(--color-near-black)' }}
    >
      <p className="label-uppercase mb-2" style={{ color: 'var(--color-neon-volt)' }}>
        Our Impact
      </p>
      <h2 className="text-feature-heading font-bold mb-8" style={{ color: 'white' }}>
        Success Metrics That Matter
      </h2>

      <div className="grid md:grid-cols-3 gap-8">
        {metrics.map((metric) => (
          <motion.div
            key={metric.label}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-display-hero font-bold" style={{ color: 'var(--color-neon-volt)' }}>
              {inView && (
                <CountUp
                  start={0}
                  end={metric.value}
                  duration={2.5}
                  suffix={metric.suffix || ''}
                />
              )}
            </div>
            <p className="mt-2 font-semibold" style={{ color: 'var(--text-secondary)' }}>
              {metric.label}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}