import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Award, 
  Clock, 
  ArrowRight,
  Sparkles 
} from 'lucide-react';
import Reveal from '../Reveal';
import { fadeUp, staggerContainer } from '@/utils/motion';
import heroImage from '../../public/heroe2.jpg';

const floatingMetrics = [
  { icon: Users, value: '15,000+', label: 'Learners' },
  { icon: Award, value: '95%', label: 'Completion Rate' },
  { icon: Clock, value: '200+', label: 'Live Sessions' }
];

export default function HeroeSection() {
  return (
    <section className="card-base overflow-hidden relative">
      <div className="grid lg:grid-cols-2 min-h-[750px]">
        {/* LEFT */}
        <div className="p-6 sm:p-10 lg:p-16 flex flex-col justify-center relative min-w-0">
          <Reveal variant={fadeUp}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border"
              style={{
                borderColor: 'var--color-forest-green)',
                background: 'var(--success-bg)'
              }}
            >
              <Sparkles size={16} style={{ color: 'var--color-forest-green)' }} />
              <span className="text-sm font-semibold" style={{ color: 'var--color-forest-green)' }}>
                New Courses Every Month
              </span>
            </div>
          </Reveal>

          <Reveal variant={fadeUp} delay={0.1}>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                4.9 / 500+ Happy Learners
              </span>
            </div>
          </Reveal>

          <Reveal variant={fadeUp} delay={0.2}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-display-hero font-bold leading-tight lg:leading-none text-balance break-words"
              style={{ color: 'var(--text-primary)' }}
            >
              Education Without Boundaries Starts Here
            </h1>
          </Reveal>

          <Reveal variant={fadeUp} delay={0.3}>
            <p className="text-body-large max-w-xl mt-6" 
              style={{ color: 'var(--text-secondary)' }}
            >
              Interactive online education platform designed for students, 
              professionals and lifelong learners.
            </p>
          </Reveal>

          <Reveal variant={fadeUp} delay={0.4}>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link 
                className="btn-neon px-8 py-3 text-lg font-bold inline-flex items-center gap-2"
                to='/sessions'
              >
                Start Learning
                <ArrowRight size={20} />
              </Link>
              <Link
                className="px-8 py-3 text-lg font-semibold rounded border"
                style={{
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-secondary)'
                }}
                to='/about'
              >
                Learn More
              </Link>
            </div>
          </Reveal>
        </div>

        {/* RIGHT */}
        <div className="relative overflow-hidden min-h-[400px] lg:min-h-0">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2 }}
            src={heroImage}
            alt="Professional learning environment"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          
          {/* Floating Metrics - Now positioned on the image side */}
          <div className="absolute left-6 bottom-6 lg:left-8 lg:bottom-8 flex flex-col gap-3">
            {floatingMetrics.map((metric, idx) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  y: [0, -8, 0]
                }}
                transition={{
                  delay: idx * 0.2,
                  y: {
                    duration: 3,
                    repeat: Infinity,
                    delay: idx * 0.5
                  }
                }}
                className="card-base p-3 flex items-center gap-3 backdrop-blur-sm"
                style={{ 
                  background: 'rgba(0, 0, 0, 0.7)',
                  backdropFilter: 'blur(12px)',
                  borderColor: 'var--color-forest-green)'
                }}
              >
                <metric.icon size={18} style={{ color: 'var--color-forest-green)' }} />
                <div>
                  <span className="text-sm font-bold text-white">
                    {metric.value}
                  </span>
                  <span className="text-xs ml-1" style={{ color: 'var(--text-muted)' }}>
                    {metric.label}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}