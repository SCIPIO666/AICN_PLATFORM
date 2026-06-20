import { motion } from 'framer-motion';

const logos = [
  { name: 'Safaricom', icon: '📱' },
  { name: 'KCB', icon: '🏦' },
  { name: 'Equity', icon: '💳' },
  { name: 'KenGen', icon: '⚡' },
  { name: 'UNDP', icon: '🌍' },
];

export default function TrustedBy() {
  return (
    <section className="py-10 text-center">
      <p className="text-sm font-semibold uppercase tracking-wider mb-8" style={{ color: 'var(--text-muted)' }}>
        Trusted By Organizations
      </p>
      <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
        {logos.map((logo, idx) => (
          <motion.div
            key={logo.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{
              scale: 1.1,
              color: 'var--color-forest-green)',
              transition: { duration: 0.2 }
            }}
            className="text-3xl md:text-4xl font-bold opacity-40 hover:opacity-100 transition-all cursor-default"
            style={{ color: 'var(--text-muted)' }}
          >
            <span className="text-2xl md:text-3xl mr-2">{logo.icon}</span>
            {logo.name}
          </motion.div>
        ))}
      </div>
    </section>
  );
}