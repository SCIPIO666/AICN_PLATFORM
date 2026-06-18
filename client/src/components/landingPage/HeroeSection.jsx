import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Stats from './Stats';
import heroImage from '../../public/heroe2.jpg';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 }
};

export default function HeroeSection() {
  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
      }}
      className="card-base overflow-hidden"
    >
      <div className="grid lg:grid-cols-2 min-h-[700px]">
        {/* LEFT */}
        <div className="p-12 lg:p-16 flex flex-col justify-center">
          <div className="space-y-8">
            <motion.div variants={fadeUp}>
              {/* Floating Badge */}
              <motion.div
                animate={{
                  y: [0, -8, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
                style={{
                  background: 'var(--success-bg)',
                  border: '1px solid var(--color-neon-volt)'
                }}
              >
                <span className="text-sm font-semibold" style={{ color: 'var(--color-neon-volt)' }}>
                  🚀 New Courses Every Month
                </span>
              </motion.div>
            </motion.div>

            <motion.div variants={fadeUp}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-yellow-400 text-lg">★★★★★</span>
                <span
                  className="text-caption"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  4.9 / 500+ Happy Learners
                </span>
              </div>
              <h1
                className="
                  text-display-hero
                  font-bold
                  leading-none
                  text-balance
                "
                style={{ color: 'var(--text-primary)' }}
              >
                Education Without Boundaries Starts Here
              </h1>
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="text-body-large max-w-xl"
              style={{ color: 'var(--text-secondary)' }}
            >
              Interactive online education platform
              designed for students, professionals
              and lifelong learners.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <Link className="btn-neon px-8 py-3 text-lg" to='/sessions'>
                Start Learning →
              </Link>
              <Link
                className="px-8 py-3 text-lg font-semibold rounded"
                style={{
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-secondary)'
                }}
                to='/about'
              >
                Learn More
              </Link>
            </motion.div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative overflow-hidden">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2 }}
            src={heroImage}
            alt="Learning platform"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
      </div>
      <Stats />
    </motion.section>
  );
}