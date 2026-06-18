import { motion } from 'framer-motion';
import image from '../../public/heroe4.jpg';
import image2 from '../../public/heroe3.jpg';
import image3 from '../../public/thought-catalog-505eectW54k-unsplash.jpg';

const features = [
  {
    title: 'Live Training',
    desc: 'Attend instructor-led sessions with real-time interaction and feedback.',
    url: image2,
    icon: '🎯'
  },
  {
    title: 'Certificates',
    desc: 'Earn verified certificates recognized by employers and institutions.',
    url: image,
    icon: '📜'
  },
  {
    title: 'Expert Trainers',
    desc: 'Learn from industry professionals with years of practical experience.',
    url: image3,
    icon: '👨‍🏫'
  }
];

export default function Features() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      <div className="text-center">
        <p className="label-uppercase">Features</p>
        <h2 className="text-feature-heading font-bold" style={{ color: 'var(--text-primary)' }}>
          Everything You Need To Learn
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {features.map((feature, idx) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{
              y: -8,
              boxShadow: '0 0 30px rgba(250,255,105,0.15)',
              transition: { duration: 0.2 }
            }}
            className="card-base overflow-hidden transition-all"
          >
            <img
              src={feature.url}
              className="w-full h-48 object-cover"
              alt={feature.title}
            />
            <div className="p-6">
              <div className="text-3xl mb-2">{feature.icon}</div>
              <h3 className="text-feature-title font-semibold" style={{ color: 'var(--text-primary)' }}>
                {feature.title}
              </h3>
              <p className="mt-3" style={{ color: 'var(--text-secondary)' }}>
                {feature.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}