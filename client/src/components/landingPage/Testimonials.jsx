import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Wanjiru',
    role: 'Project Manager',
    review: 'The certification helped me secure a promotion within three months. The trainers are exceptional and the content is relevant.',
    rating: 5
  },
  {
    name: 'James Ochieng',
    role: 'Software Developer',
    review: 'Best online learning platform I\'ve used. The hands-on approach and real-world projects made all the difference.',
    rating: 5
  },
  {
    name: 'Mary Akinyi',
    role: 'HR Specialist',
    review: 'I\'ve completed 5 courses and each one has added value to my career. Highly recommend to any professional.',
    rating: 5
  }
];

export default function Testimonials() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      <div className="text-center">
        <p className="label-uppercase">Testimonials</p>
        <h2 className="text-feature-heading font-bold" style={{ color: 'var(--text-primary)' }}>
          What Our Learners Say
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, idx) => (
          <motion.div
            key={testimonial.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{
              y: -5,
              transition: { duration: 0.2 }
            }}
            className="card-base p-6"
          >
            <div className="flex mb-3">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  fill="var(--color-neon-volt)"
                  style={{ color: 'var(--color-neon-volt)' }}
                />
              ))}
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
              "{testimonial.review}"
            </p>
            <div>
              <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                {testimonial.name}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {testimonial.role}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}