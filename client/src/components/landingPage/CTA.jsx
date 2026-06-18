import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function CTA() {
  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="card-neon p-12 text-center relative overflow-hidden"
    >
      {/* Animated glow effect */}
      <motion.div
        animate={{
          boxShadow: [
            '0 0 20px rgba(250,255,105,0.1)',
            '0 0 40px rgba(250,255,105,0.2)',
            '0 0 20px rgba(250,255,105,0.1)'
          ]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0"
      />

      <div className="relative z-10">
        <p className="label-uppercase" style={{ color: 'var(--color-neon-volt)' }}>
          Ready To Advance?
        </p>

        <h2 className="text-feature-heading font-bold mt-2" style={{ color: 'var(--text-primary)' }}>
          Join Thousands Of Learners Building New Skills
        </h2>

        <p className="mt-4 max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
          Start your learning journey today and unlock new career opportunities
          with our comprehensive training programs.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link className="btn-neon px-8 py-3 text-lg font-bold" to='/signup'>
              Start Learning
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              className="px-8 py-3 text-lg font-semibold rounded"
              style={{
                border: '1px solid var(--color-neon-volt)',
                color: 'var(--color-neon-volt)'
              }}
              to='/trainer-signup'
            >
              Become A Trainer
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}