import { motion } from 'framer-motion';
import { Button } from './Button';

interface OnboardingCTAProps {
  onClick: () => void;
  label?: string;
  color?: string;
  animationDelay?: number;
}

export const OnboardingCTA = ({
  onClick,
  label = 'Next',
  color,
  animationDelay = 0.58,
}: OnboardingCTAProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: animationDelay }}
    className="w-full"
  >
    <Button onClick={onClick} color={color}>
      {label} <span aria-hidden="true">→</span>
    </Button>
  </motion.div>
);
