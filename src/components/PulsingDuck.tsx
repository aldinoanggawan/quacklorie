import { withOpacity } from '../lib/color';
import { motion, useReducedMotion } from 'framer-motion';
import { Duck, type DuckEmotion } from './duck/Duck';

interface PulsingDuckProps {
  emotion?: DuckEmotion;
  size?: number;
  ringGap?: number;
}

export const PulsingDuck = ({
  emotion = 'happy',
  size = 120,
  ringGap = 19,
}: PulsingDuckProps) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className="relative flex h-[var(--duck-size)] w-[var(--duck-size)] items-center justify-center"
      style={{ '--duck-size': `${size}px` } as React.CSSProperties}
    >
      <motion.div
        aria-hidden="true"
        animate={
          prefersReducedMotion
            ? false
            : { scale: [1, 1.4, 1], opacity: [0.45, 0, 0.45] }
        }
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute rounded-full border-2.5"
        style={{
          inset: -ringGap,
          borderColor: withOpacity('var(--color-brand)', 0.4),
          background: withOpacity('var(--color-brand)', 0.07),
        }}
      />
      <motion.div
        animate={prefersReducedMotion ? false : { y: [0, -6, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Duck emotion={emotion} size={size} />
      </motion.div>
    </div>
  );
};
