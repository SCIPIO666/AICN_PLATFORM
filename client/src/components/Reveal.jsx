
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function Reveal({ 
  children, 
  variant, 
  delay = 0, 
  className = "" 
}) {
  const [ref, inView] = useInView({
    threshold: 0.15,
    triggerOnce: true
  });

  return (
    <motion.div
      ref={ref}
      variants={variant}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}