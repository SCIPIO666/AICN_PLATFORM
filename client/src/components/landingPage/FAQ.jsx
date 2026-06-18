import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'How do I enroll in a course?',
    a: 'Simply create an account, browse our course catalog, and click "Enroll" on any course you\'re interested in. You\'ll get immediate access to the learning materials.'
  },
  {
    q: 'Are certificates verified?',
    a: 'Yes, all certificates issued on our platform are verified and can be shared on LinkedIn or included in your professional portfolio.'
  },
  {
    q: 'Can I learn remotely?',
    a: 'Absolutely! All our sessions are live and interactive, but also recorded so you can learn at your own pace and revisit content whenever you need.'
  },
  {
    q: 'Do trainers provide support?',
    a: 'Yes, our expert trainers are available during sessions and through our community forums to answer questions and provide guidance.'
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      <div className="text-center">
        <p className="label-uppercase">FAQ</p>
        <h2 className="text-feature-heading font-bold" style={{ color: 'var(--text-primary)' }}>
          Frequently Asked Questions
        </h2>
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((faq, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="card-base overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
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
                    <p style={{ color: 'var(--text-secondary)' }}>{faq.a}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}