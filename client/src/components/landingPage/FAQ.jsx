import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Reveal from '@/components/Reveal';
import { fadeUp } from '@/utils/motion';

const faqs = [
  {
    q: 'How do I enroll in a course?',
    a: 'Simply create an account, browse our course catalog, and click "Enroll" on any course you\'re interested in. You\'ll get immediate access to the learning materials and upcoming session schedule.'
  },
  {
    q: 'Are certificates verified?',
    a: 'Yes, all certificates issued on our platform are verified and can be shared on LinkedIn, included in your professional portfolio, or verified by employers through our secure verification system.'
  },
  {
    q: 'Can I learn remotely?',
    a: 'Absolutely! All our sessions are live and interactive, but also recorded so you can learn at your own pace and revisit content whenever you need.'
  },
  {
    q: 'Do trainers provide support?',
    a: 'Yes, our expert trainers are available during sessions and through our community forums to answer questions, provide guidance, and offer personalized feedback.'
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="space-y-8">
      <div className="text-center">
        <Reveal variant={fadeUp}>
          <p className="label-uppercase">FAQ</p>
        </Reveal>
        <Reveal variant={fadeUp} delay={0.1}>
          <h2 className="text-feature-heading font-bold" style={{ color: 'var(--text-primary)' }}>
            Frequently Asked Questions
          </h2>
        </Reveal>
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((faq, idx) => (
          <Reveal key={idx} variant={fadeUp} delay={idx * 0.05}>
            <div className="card-base overflow-hidden transition-all">
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-opacity-5 transition-colors"
                style={{ 
                  background: openIndex === idx ? 'var(--card-hover)' : 'transparent'
                }}
              >
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {faq.q}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === idx ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={20} style={{ color: 'var(--text-muted)' }} />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-4">
                      <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {faq.a}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}