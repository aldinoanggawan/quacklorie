import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConfirmSheet } from '../../components/ConfirmSheet';
import { Duck } from '../../components/duck/Duck';
import { ChevronIcon } from '../../components/icons/ChevronIcon';
import { ScreenContainer } from '../../components/ScreenContainer';
import { SettingsRow } from '../../components/profile/SettingsRow';
import { Typography } from '../../components/ui/Typography';
import { useAuth, getUsername } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';
import { GOAL_LABELS } from '../../lib/profileOptions';

export const ProfileScreen = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const [confirmingLogOut, setConfirmingLogOut] = useState(false);

  const goalLabel = profile ? GOAL_LABELS[profile.goal_type] : '…';

  const handleConfirmLogOut = async () => {
    setConfirmingLogOut(false);
    await signOut();
  };

  return (
    <ScreenContainer className="gap-5 pt-10">
      <header className="flex items-center gap-4">
        <Duck emotion="happy" size={64} className="shrink-0" />
        <Typography variant="subheading" as="h1" className="min-w-0 truncate">
          @{getUsername(user)}
        </Typography>
      </header>

      <button
        type="button"
        onClick={() => navigate('/profile/goals')}
        className="cursor-pointer rounded-3xl border border-line bg-white p-6 text-left font-[inherit] shadow-card transition-colors duration-150 hover:border-brand"
      >
        <div className="flex items-center justify-between">
          <Typography variant="label-strong" color={'var(--color-muted)'}>
            {goalLabel}
          </Typography>
          <ChevronIcon />
        </div>
        <div className="mt-3 flex items-baseline gap-1.5">
          <Typography
            variant="display"
            color={'var(--color-brand)'}
            className="leading-none tabular-nums"
          >
            {profile?.daily_budget?.toLocaleString() ?? '…'}
          </Typography>
          <Typography variant="body" as="span" color={'var(--color-muted)'}>
            kcal/day
          </Typography>
        </div>
        <Typography
          variant="caption"
          as="p"
          color={'var(--color-muted)'}
          className="mt-1 uppercase tracking-label"
        >
          Daily budget
        </Typography>
        <Typography
          variant="label"
          as="p"
          color={'var(--color-muted)'}
          className="mt-3"
        >
          {profile?.weight_kg ?? '…'} kg → {profile?.target_weight_kg ?? '…'} kg
          · {profile?.activity_level ?? '…'} activity
        </Typography>
      </button>

      <section className="flex flex-col gap-2">
        <Typography
          variant="label-strong"
          color={'var(--color-muted)'}
          className="block"
        >
          Account
        </Typography>
        <SettingsRow label="Username" value={getUsername(user)} />
        <SettingsRow
          label="Password"
          value="••••••••"
          onClick={() => navigate('/profile/password')}
        />
      </section>

      <button
        type="button"
        onClick={() => setConfirmingLogOut(true)}
        className="mt-4 w-full cursor-pointer rounded-pill border-1.5 border-danger bg-white py-3.5 font-[inherit] transition-colors duration-150 hover:bg-[rgba(232,64,96,0.08)]"
      >
        <Typography
          variant="input-label"
          as="span"
          color={'var(--color-danger)'}
        >
          Log out
        </Typography>
      </button>

      <ConfirmSheet
        open={confirmingLogOut}
        title="Log out of Quackies?"
        confirmLabel="Log out"
        danger
        onConfirm={handleConfirmLogOut}
        onCancel={() => setConfirmingLogOut(false)}
      />
    </ScreenContainer>
  );
};
