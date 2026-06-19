import { motion } from 'framer-motion';
import { Video, Award, Users, ArrowRight } from 'lucide-react';
import Reveal from '@/components/Reveal';
import { fadeUp, staggerContainer } from '@/utils/motion';
import image from '../../public/heroe4.jpg';
import image2 from '../../public/heroe3.jpg';
import image3 from '../../public/thought-catalog-505eectW54k-unsplash.jpg';

const features = [
  {
    icon: Video,
    title: 'Live Training',
    desc: 'Attend instructor-led sessions with real-time interaction and feedback from industry experts.',
    image: image2,
    link: '/live-training'
  },
  {
    icon: Award,
    title: 'Certifications',
    desc: 'Earn verified certificates recognized by employers and institutions worldwide.',
    image: image,
    link: '/certifications'
  },
  {
    icon: Users,
    title: 'Expert Trainers',
    desc: 'Learn from professionals with years of practical industry experience and proven track records.',
    image: image3,
    link: '/trainers'
  }
];

export default function Features() {
  return (
    <section className="space-y-8">
      <div className="text-center">
        <Reveal variant={fadeUp}>
          <p className="label-uppercase">Features</p>
        </Reveal>
        <Reveal variant={fadeUp} delay={0.1}>
          <h2 className="text-feature-heading font-bold" style={{ color: 'var(--text-primary)' }}>
            Everything You Need To Learn
          </h2>
        </Reveal>
      </div>

      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-3 gap-6"
      >
        {features.map((feature, idx) => (
          <Reveal key={feature.title} variant={fadeUp} delay={idx * 0.1}>
            <motion.div
              whileHover={{
                y: -8,
                boxShadow: '0 0 40px rgba(250,255,105,0.12)',
                transition: { duration: 0.2 }
              }}
              className="card-base overflow-hidden group transition-all"
            >
              <div className="overflow-hidden">
                <motion.img
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.4 }}
                  src={feature.image}
                  className="w-full h-52 object-cover"
                  alt={feature.title}
                />
              </div>
              <div className="p-6">
                <feature.icon 
                  size={28} 
                  style={{ color: 'var(--color-neon-volt)' }}
                  className="mb-3"
                />
                <h3 className="text-feature-title font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {feature.desc}
                </p>
                <motion.div
                  whileHover={{ x: 4 }}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold"
                  style={{ color: 'var(--color-neon-volt)' }}
                >
                  Learn More
                  <ArrowRight size={14} />
                </motion.div>
              </div>
            </motion.div>
          </Reveal>
        ))}
      </motion.div>
    </section>
  );
}