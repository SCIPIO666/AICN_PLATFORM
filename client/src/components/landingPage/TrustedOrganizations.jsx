import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';
import Reveal from '@/components/Reveal';
import { fadeUp, staggerContainer } from '@/utils/motion';

const organizations = [
  { name: 'Safaricom' },
  { name: 'KCB' },
  { name: 'Equity' },
  { name: 'KenGen' },
  { name: 'UNDP' }
];

export default function TrustedOrganizations() {
  return (
    <section className="py-10 text-center">
      <Reveal variant={fadeUp}>
        <p className="text-sm font-semibold uppercase tracking-wider mb-8" 
          style={{ color: 'var(--text-muted)' }}
        >
          Trusted By Leading Organizations
        </p>
      </Reveal>

      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap justify-center items-center gap-8 md:gap-12"
      >
        {organizations.map((org) => (
          <motion.div
            key={org.name}
            variants={fadeUp}
            whileHover={{ 
              scale: 1.05,
              color: 'var--color-forest-green)',
              transition: { duration: 0.2 }
            }}
            className="flex items-center gap-2 text-2xl md:text-3xl font-bold opacity-40 hover:opacity-100 transition-all cursor-default"
            style={{ color: 'var(--text-muted)' }}
          >
            <Building2 size={28} />
            {org.name}
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}