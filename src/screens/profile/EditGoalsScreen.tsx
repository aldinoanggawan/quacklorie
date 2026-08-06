import { useNavigate } from 'react-router-dom';
import { EditGoalsForm } from '../../components/profile/EditGoalsForm';
import { LoadingScreen } from '../../components/LoadingScreen';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Typography } from '../../components/ui/Typography';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';

export const EditGoalsScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, loading } = useProfile();

  if (loading || !profile) return <LoadingScreen />;

  return (
    <ScreenContainer className="gap-5 pt-10">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Go back"
          onClick={() => navigate('/profile')}
          className="cursor-pointer border-0 bg-transparent py-1 pr-2 text-2xl leading-none text-ink"
        >
          ←
        </button>
        <Typography variant="subheading" as="h1" className="flex-1">
          Goals & body stats
        </Typography>
      </div>

      <EditGoalsForm
        userId={user!.id}
        profile={profile}
        onSaved={() => navigate('/profile')}
      />
    </ScreenContainer>
  );
};
