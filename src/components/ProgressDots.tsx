import { ONBOARDING_TOTAL_STEPS } from '../constants';

export const ProgressDots = ({
  current,
  total = ONBOARDING_TOTAL_STEPS,
  activeColor = 'var(--color-brand)',
  inactiveColor = 'var(--color-line)',
}: {
  current: number;
  total?: number;
  activeColor?: string;
  inactiveColor?: string;
}) => {
  return (
    <div
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuetext={`Step ${current} of ${total}`}
      className="flex justify-center gap-1.5 py-5 pb-2"
    >
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          aria-hidden="true"
          className="h-2 rounded transition-all duration-300"
          style={{
            width: i + 1 === current ? 22 : 8,
            background: i + 1 === current ? activeColor : inactiveColor,
          }}
        />
      ))}
    </div>
  );
};
