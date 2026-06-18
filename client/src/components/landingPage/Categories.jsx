import { motion } from 'framer-motion';

const categories = [
  'Leadership', 'ICT', 'Finance',
  'Project Management', 'Customer Service', 'Procurement',
  'Data Analytics', 'Digital Marketing', 'Human Resources'
];

export default function Categories() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      <div className="text-center">
        <p className="label-uppercase">Categories</p>
        <h2 className="text-feature-heading font-bold" style={{ color: 'var(--text-primary)' }}>
          Explore Learning Paths
        </h2>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((category, idx) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{
              scale: 1.05,
              boxShadow: '0 0 20px rgba(250,255,105,0.15)',
              borderColor: 'var(--color-neon-volt)'
            }}
            className="card-base px-6 py-3 cursor-pointer transition-all"
          >
            <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
              {category}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}