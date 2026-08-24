import { useNavigate } from 'react-router-dom';
import { EditGoalsForm } from '../../components/profile/EditGoalsForm';
import { LoadingScreen } from '../../components/LoadingScreen';
import { ScreenContainer } from '../../components/ScreenContainer';
import { ScreenHeader } from '../../components/ScreenHeader';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';

export const EditGoalsScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, loading } = useProfile();

  if (loading || !profile) return <LoadingScreen />;

  return (
    <ScreenContainer className="gap-5 pt-10">
      <ScreenHeader
        title="Goals & body stats"
        onBack={() => navigate('/profile')}
      />

      <EditGoalsForm
        userId={user!.id}
        profile={profile}
        onSaved={() => navigate('/profile')}
      />
    </ScreenContainer>
  );
};
