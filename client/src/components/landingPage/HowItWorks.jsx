import { motion } from 'framer-motion';
import { UserPlus, BookOpen, Video, Award } from 'lucide-react';
import Reveal from '@/components/Reveal';
import { fadeUp, fadeLeft, fadeRight, staggerContainer } from '@/utils/motion';

const steps = [
  {
    icon: UserPlus,
    title: 'Create Account',
    desc: 'Sign up in minutes and set up your professional learning profile.'
  },
  {
    icon: BookOpen,
    title: 'Enroll In Training',
    desc: 'Choose from hundreds of courses designed for your career goals.'
  },
  {
    icon: Video,
    title: 'Attend Sessions',
    desc: 'Join live interactive sessions or learn at your own pace.'
  },
  {
    icon: Award,
    title: 'Earn Certificate',
    desc: 'Complete your training and receive verified certification.'
  }
];

export default function HowItWorks() {
  return (
    <section className="space-y-8">
      <div className="text-center">
        <Reveal variant={fadeUp}>
          <p className="label-uppercase">How It Works</p>
        </Reveal>
        <Reveal variant={fadeUp} delay={0.1}>
          <h2 className="text-feature-heading font-bold" style={{ color: 'var(--text-primary)' }}>
            Get Started In 4 Simple Steps
          </h2>
        </Reveal>
      </div>

      <div className="relative">
        <div
          className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 hidden md:block"
          style={{ background: 'var--color-forest-green)' }}
        />

        <div className="space-y-8">
          {steps.map((step, idx) => (
            <Reveal
              key={step.title}
              variant={idx % 2 === 0 ? fadeLeft : fadeRight}
              delay={idx * 0.1}
            >
              <div className={`flex flex-col md:flex-row items-center gap-6 ${
                idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}>
                <div className="flex-1 text-center md:text-left">
                  <div className="text-sm font-bold mb-1" style={{ color: 'var--color-forest-green)' }}>
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
                    border: '2px solid var--color-forest-green)'
                  }}
                >
                  <step.icon size={24} style={{ color: 'var--color-forest-green)' }} />
                </div>

                <div className="flex-1" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}