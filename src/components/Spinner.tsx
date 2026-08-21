import { motion, useReducedMotion } from 'framer-motion';
import { classNames } from '../lib/classNames';

interface SpinnerProps {
  size?: number;
  color?: string;
  trackColor?: string;
}

export const Spinner = ({
  size = 20,
  color = '#fff',
  trackColor = 'rgba(255, 255, 255, 0.4)',
}: SpinnerProps) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.span
      aria-hidden="true"
      animate={prefersReducedMotion ? undefined : { rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      className={classNames('inline-block rounded-full')}
      style={{
        width: size,
        height: size,
        borderWidth: 2.5,
        borderStyle: 'solid',
        borderColor: trackColor,
        borderTopColor: color,
      }}
    />
  );
};
