import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import Reveal from '@/components/Reveal';
import { fadeUp, staggerContainer } from '@/utils/motion';

const testimonials = [
  {
    name: 'Sarah Wanjiru',
    role: 'Project Manager',
    review: 'The certification helped me secure a promotion within three months. The trainers are exceptional and the content is relevant to real-world challenges.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
  },
  {
    name: 'James Ochieng',
    role: 'Software Developer',
    review: 'Best online learning platform I\'ve used. The hands-on approach and real-world projects made all the difference in my career growth.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  },
  {
    name: 'Mary Akinyi',
    role: 'HR Specialist',
    review: 'I\'ve completed 5 courses and each one has added immense value to my career. Highly recommend to any professional looking to upskill.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150'
  }
];

export default function Testimonials() {
  return (
    <section className="space-y-8">
      <div className="text-center">
        <Reveal variant={fadeUp}>
          <p className="label-uppercase">Testimonials</p>
        </Reveal>
        <Reveal variant={fadeUp} delay={0.1}>
          <h2 className="text-feature-heading font-bold" style={{ color: 'var(--text-primary)' }}>
            What Our Learners Say
          </h2>
        </Reveal>
      </div>

      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-3 gap-6"
      >
        {testimonials.map((testimonial, idx) => (
          <Reveal key={testimonial.name} variant={fadeUp} delay={idx * 0.1}>
            <motion.div
              whileHover={{
                y: -5,
                boxShadow: '0 0 30px rgba(250,255,105,0.08)',
                transition: { duration: 0.2 }
              }}
              className="card-base p-6 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {testimonial.name}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {testimonial.role}
                  </p>
                </div>
              </div>

              <div className="flex mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill="var--color-forest-green)"
                    style={{ color: 'var--color-forest-green)' }}
                  />
                ))}
              </div>

              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                "{testimonial.review}"
              </p>
            </motion.div>
          </Reveal>
        ))}
      </motion.div>
    </section>
  );
}