import { motion, useReducedMotion } from 'framer-motion';

export const Spinner = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.span
      aria-hidden="true"
      animate={prefersReducedMotion ? undefined : { rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      className="inline-block h-5 w-5 rounded-full border-2.5 border-white/40 border-t-white"
    />
  );
};
