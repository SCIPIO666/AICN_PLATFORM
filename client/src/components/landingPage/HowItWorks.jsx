import { motion } from 'framer-motion';
import { UserPlus, BookOpen, Video, Award } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: 'Create Account',
    desc: 'Sign up in minutes and set up your learning profile.'
  },
  {
    icon: BookOpen,
    title: 'Enroll In Training',
    desc: 'Choose from hundreds of courses and training programs.'
  },
  {
    icon: Video,
    title: 'Attend Sessions',
    desc: 'Join live sessions or watch recordings at your pace.'
  },
  {
    icon: Award,
    title: 'Earn Certificate',
    desc: 'Complete your training and receive verified certification.'
  }
];

export default function HowItWorks() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      <div className="text-center">
        <p className="label-uppercase">How It Works</p>
        <h2 className="text-feature-heading font-bold" style={{ color: 'var(--text-primary)' }}>
          Get Started In 4 Simple Steps
        </h2>
      </div>

      <div className="relative">
        {/* Vertical Line */}
        <div
          className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 hidden md:block"
          style={{ background: 'var(--color-neon-volt)' }}
        />

        <div className="space-y-8">
          {steps.map((step, idx) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.15 }}
              className={`flex flex-col md:flex-row items-center gap-6 ${
                idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              <div className="flex-1 text-center md:text-left">
                <div className="text-sm font-bold mb-1" style={{ color: 'var(--color-neon-volt)' }}>
                  Step {idx + 1}
                </div>
                <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {step.title}
                </h3>
                <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>
                  {step.desc}
                </p>
              </div>

              <div
                className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 z-10"
                style={{
                  background: 'var(--color-forest-green)',
                  border: '2px solid var(--color-neon-volt)'
                }}
              >
                <step.icon size={24} style={{ color: 'var(--color-neon-volt)' }} />
              </div>

              <div className="flex-1" />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}