import { useNavigate } from 'react-router-dom';
import { Duck } from '../../components/duck/Duck';
import { Typography } from '../../components/ui/Typography';
import { Button } from '../../components/Button';

interface LogEmptyStateProps {
  isCurrentWeek: boolean;
}

export const LogEmptyState = ({ isCurrentWeek }: LogEmptyStateProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center gap-4 pt-16 text-center">
      <Duck emotion={isCurrentWeek ? 'worried' : 'sleepy'} size={100} />
      <div>
        <Typography variant="subheading" as="p" color={'var(--color-ink)'}>
          {isCurrentWeek ? 'Nothing logged yet' : 'No entries this week'}
        </Typography>
        <Typography
          variant="body"
          color={'var(--color-muted)'}
          className="mt-1"
        >
          {isCurrentWeek
            ? 'Meals, workouts, and water you log will show up here.'
            : "This week doesn't have any logged meals, workouts, or water."}
        </Typography>
      </div>
      {isCurrentWeek && (
        <Button className="mt-1" onClick={() => navigate('/home')}>
          Go to Home
        </Button>
      )}
    </div>
  );
};
