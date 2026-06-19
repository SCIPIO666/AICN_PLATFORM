import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, UserPlus } from 'lucide-react';
import Reveal from '@/components/Reveal';
import { fadeUp } from '@/utils/motion';

export default function CTA() {
  return (
    <section className="card-neon p-12 text-center relative overflow-hidden">
      <motion.div
        animate={{
          boxShadow: [
            '0 0 30px rgba(250,255,105,0.05)',
            '0 0 60px rgba(250,255,105,0.1)',
            '0 0 30px rgba(250,255,105,0.05)'
          ]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0"
      />

      <div className="relative z-10">
        <Reveal variant={fadeUp}>
          <p className="label-uppercase" style={{ color: 'var(--color-neon-volt)' }}>
            Ready To Advance?
          </p>
        </Reveal>

        <Reveal variant={fadeUp} delay={0.1}>
          <h2 className="text-feature-heading font-bold mt-2 max-w-3xl mx-auto" 
            style={{ color: 'var(--text-primary)' }}
          >
            Build Skills That Move Your Career Forward
          </h2>
        </Reveal>

        <Reveal variant={fadeUp} delay={0.2}>
          <p className="mt-4 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Join professionals, teams and organizations using our platform 
            to learn, certify and grow in their careers.
          </p>
        </Reveal>

        <Reveal variant={fadeUp} delay={0.3}>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                className="btn-neon px-8 py-3.5 text-lg font-bold inline-flex items-center gap-2" 
                to='/signup'
              >
                <UserPlus size={20} />
                Start Learning
                <ArrowRight size={20} />
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                className="px-8 py-3.5 text-lg font-semibold rounded border inline-flex items-center gap-2"
                style={{
                  borderColor: 'var(--color-neon-volt)',
                  color: 'var(--color-neon-volt)'
                }}
                to='/login'
              >
                Become A Trainer
                <ArrowRight size={20} />
              </Link>
            </motion.div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}