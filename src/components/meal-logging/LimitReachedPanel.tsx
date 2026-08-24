import { motion } from 'framer-motion';
import { Duck } from '../duck/Duck';
import { Typography } from '../ui/Typography';

interface LimitReachedPanelProps {
  limit: number;
}

export const LimitReachedPanel = ({ limit }: LimitReachedPanelProps) => (
  <motion.div
    key="limit-reached"
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center gap-4 py-8 text-center"
  >
    <Duck emotion="sleepy" size={88} />
    <Typography variant="subheading" color={'var(--color-ink)'}>
      No analyses left today
    </Typography>
    <Typography
      variant="body"
      color={'var(--color-muted)'}
      className="max-w-64"
    >
      You've used all {limit} AI analyses for today. Come back tomorrow —
      Quackers will be ready!
    </Typography>
  </motion.div>
);
