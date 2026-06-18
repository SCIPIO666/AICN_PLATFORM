import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

const trainers = [
  {
    name: 'John Kamau',
    role: 'Leadership Coach',
    image: '👨‍💼',
    learners: 1200,
    specialty: 'Executive Leadership'
  },
  {
    name: 'Grace Muthoni',
    role: 'Data Analytics Expert',
    image: '👩‍💼',
    learners: 850,
    specialty: 'Data Science & AI'
  },
  {
    name: 'David Otieno',
    role: 'Finance Specialist',
    image: '👨‍💻',
    learners: 950,
    specialty: 'Financial Management'
  }
];

export default function TrainersSpotlight() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      <div className="text-center">
        <p className="label-uppercase">Meet Our Trainers</p>
        <h2 className="text-feature-heading font-bold" style={{ color: 'var(--text-primary)' }}>
          Learn From Industry Experts
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {trainers.map((trainer, idx) => (
          <motion.div
            key={trainer.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{
              y: -6,
              boxShadow: '0 0 30px rgba(250,255,105,0.1)',
              transition: { duration: 0.2 }
            }}
            className="card-base p-6 text-center"
          >
            <div
              className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-5xl"
              style={{
                background: 'var(--color-forest-green)',
                border: '2px solid var(--color-neon-volt)'
              }}
            >
              {trainer.image}
            </div>
            <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {trainer.name}
            </h3>
            <p className="text-sm font-semibold" style={{ color: 'var(--color-neon-volt)' }}>
              {trainer.role}
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              {trainer.specialty}
            </p>
            <div className="mt-3 flex items-center justify-center gap-2">
              <Users size={14} style={{ color: 'var(--text-muted)' }} />
              <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                {trainer.learners.toLocaleString()} Learners Trained
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}