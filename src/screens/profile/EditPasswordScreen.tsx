import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Button } from '../../components/Button';
import { Typography } from '../../components/ui/Typography';
import { EyeIcon } from '../../components/icons/EyeIcon';
import { useAuth, getUsername } from '../../hooks/useAuth';
import { buildAuthEmail } from '../auth/authUtils';
import { supabase } from '../../lib/supabase';
import { classNames } from '../../lib/classNames';

const inputClass =
  'box-border w-full rounded-element border-1.5 bg-white py-3 px-3.5 text-input font-medium text-ink outline-none [font-family:inherit]';

export const EditPasswordScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: buildAuthEmail(getUsername(user)),
        password: currentPassword,
      });

      if (signInError) {
        setError('Current password is incorrect');
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      navigate('/profile');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
          Password
        </Typography>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <div className="flex flex-col gap-1.5">
          <Typography
            variant="input-label"
            as="label"
            htmlFor="current-password"
          >
            Current password
          </Typography>
          <input
            id="current-password"
            type="password"
            autoComplete="current-password"
            autoFocus
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className={classNames(inputClass, 'border-line')}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Typography variant="input-label" as="label" htmlFor="new-password">
            New password
          </Typography>
          <div className="relative">
            <input
              id="new-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              aria-invalid={!!error}
              aria-describedby={error ? 'password-error' : undefined}
              className={classNames(
                inputClass,
                'pr-11',
                error ? 'border-danger' : 'border-line',
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
              className="absolute right-3 top-1/2 flex -translate-y-1/2 cursor-pointer items-center border-0 bg-transparent p-1 text-muted"
            >
              <EyeIcon open={showPassword} size={18} />
            </button>
          </div>
          {error && (
            <Typography
              id="password-error"
              variant="caption"
              color={'var(--color-danger)'}
              role="alert"
            >
              {error}
            </Typography>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          className={classNames(loading && 'opacity-70')}
        >
          {loading ? 'Saving…' : 'Save'}
        </Button>
      </form>
    </ScreenContainer>
  );
};
