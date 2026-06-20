import { motion } from 'framer-motion';
import { Users, Star } from 'lucide-react';
import Reveal from '@/components/Reveal';
import { fadeUp, staggerContainer } from '@/utils/motion';

const trainers = [
  {
    name: 'John Kamau',
    role: 'Leadership Coach',
    specialty: 'Executive Leadership',
    learners: 1200,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    rating: 4.9
  },
  {
    name: 'Grace Muthoni',
    role: 'Data Analytics Expert',
    specialty: 'Data Science & AI',
    learners: 850,
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200',
    rating: 4.8
  },
  {
    name: 'David Otieno',
    role: 'Finance Specialist',
    specialty: 'Financial Management',
    learners: 950,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    rating: 4.9
  }
];

export default function TrainersSpotlight() {
  return (
    <section className="space-y-8">
      <div className="text-center">
        <Reveal variant={fadeUp}>
          <p className="label-uppercase">Meet Our Trainers</p>
        </Reveal>
        <Reveal variant={fadeUp} delay={0.1}>
          <h2 className="text-feature-heading font-bold" style={{ color: 'var(--text-primary)' }}>
            Learn From Industry Experts
          </h2>
        </Reveal>
      </div>

      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-3 gap-6"
      >
        {trainers.map((trainer, idx) => (
          <Reveal key={trainer.name} variant={fadeUp} delay={idx * 0.1}>
            <motion.div
              whileHover={{
                y: -6,
                boxShadow: '0 0 40px rgba(250,255,105,0.1)',
                transition: { duration: 0.2 }
              }}
              className="card-base p-6 text-center transition-all"
            >
              <img
                src={trainer.image}
                alt={trainer.name}
                className="w-28 h-28 rounded-full mx-auto mb-4 object-cover border-2"
                style={{ borderColor: 'var--color-forest-green)' }}
              />
              <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {trainer.name}
              </h3>
              <p className="text-sm font-semibold" style={{ color: 'var--color-forest-green)' }}>
                {trainer.role}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                {trainer.specialty}
              </p>
              <div className="mt-3 flex items-center justify-center gap-4">
                <div className="flex items-center gap-1">
                  <Star size={14} fill="var--color-forest-green)" style={{ color: 'var--color-forest-green)' }} />
                  <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                    {trainer.rating}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={14} style={{ color: 'var(--text-muted)' }} />
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {trainer.learners.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          </Reveal>
        ))}
      </motion.div>
    </section>
  );
}