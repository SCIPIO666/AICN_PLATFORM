import { motion } from 'framer-motion';
import Reveal from '@/components/Reveal';
import { fadeUp, staggerContainer } from '@/utils/motion';

const categories = [
  'Leadership', 'ICT', 'Finance',
  'Project Management', 'Customer Service', 'Procurement',
  'Data Analytics', 'Digital Marketing', 'Human Resources'
];

export default function Categories() {
  return (
    <section className="space-y-8">
      <div className="text-center">
        <Reveal variant={fadeUp}>
          <p className="label-uppercase">Categories</p>
        </Reveal>
        <Reveal variant={fadeUp} delay={0.1}>
          <h2 className="text-feature-heading font-bold" style={{ color: 'var(--text-primary)' }}>
            Explore Learning Paths
          </h2>
        </Reveal>
      </div>

      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap justify-center gap-3"
      >
        {categories.map((category) => (
          <Reveal key={category} variant={fadeUp}>
            <motion.div
              whileHover={{
                scale: 1.05,
                boxShadow: '0 0 30px rgba(250,255,105,0.15)',
                borderColor: 'var(--color-neon-volt)'
              }}
              className="card-base px-6 py-3 cursor-pointer transition-all"
            >
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                {category}
              </span>
            </motion.div>
          </Reveal>
        ))}
      </motion.div>
    </section>
  );
}