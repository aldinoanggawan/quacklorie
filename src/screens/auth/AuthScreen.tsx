import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Duck, type DuckEmotion } from '../../components/duck/Duck';
import { Button } from '../../components/Button';
import { Typography } from '../../components/ui/Typography';
import { EyeIcon } from '../../components/icons/EyeIcon';
import { supabase } from '../../lib/supabase';
import { isUsernameTaken, getProfile, saveUsername } from '../../lib/db';
import { buildAuthEmail } from './authUtils';
import { classNames } from '../../lib/classNames';

type Step = 'username' | 'returning' | 'new';

const USERNAME_RE = /^[a-z0-9_]{3,20}$/;

const STEP_CONFIG: Record<
  Exclude<Step, 'username'>,
  { emotion: DuckEmotion; heading: string; passwordHint: string; cta: string }
> = {
  returning: {
    emotion: 'happy',
    heading: 'Welcome back!',
    passwordHint: 'Enter your password to log in',
    cta: 'Log in',
  },
  new: {
    emotion: 'excited',
    heading: 'Create your account',
    passwordHint: 'Pick a password to secure your account',
    cta: 'Sign up',
  },
};

const inputClass =
  'box-border w-full rounded-element border-1.5 bg-white py-3 px-3.5 text-input font-medium text-ink outline-none [font-family:inherit]';

export const AuthScreen = () => {
  const navigate = useNavigate();
  const passwordRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>('username');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const config = step !== 'username' ? STEP_CONFIG[step] : null;

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setUsernameError('');
    setFormError('');

    if (!USERNAME_RE.test(username)) {
      setUsernameError(
        'Username must be 3–20 characters, letters, numbers, and underscores only',
      );
      return;
    }

    setLoading(true);
    try {
      const taken = await isUsernameTaken(username);
      setStep(taken ? 'returning' : 'new');
      setTimeout(() => passwordRef.current?.focus(), 50);
    } catch {
      setFormError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setFormError('');

    if (step === 'new' && password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }
    if (!password) {
      setPasswordError('Password is required');
      return;
    }

    setLoading(true);
    try {
      const email = buildAuthEmail(username);

      if (step === 'returning') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error || !data.user) {
          setFormError('Invalid username or password');
          return;
        }
        const profile = await getProfile(data.user.id);
        navigate(profile?.daily_budget ? '/home' : '/onboarding');
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) {
          setFormError(error.message);
          return;
        }
        if (data.user) {
          await saveUsername(data.user.id, username.toLowerCase().trim());
        }
        navigate('/onboarding');
      }
    } catch {
      setFormError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-canvas py-6 px-4">
      <div className="flex w-full max-w-sm flex-col items-center gap-6 rounded-3xl border-1.5 border-line bg-white py-8 px-7">
        <Duck emotion={config?.emotion ?? 'grumpy'} size={80} />

        <motion.div layout className="text-center">
          <Typography variant="heading-lg" as="h1" className="m-0">
            {config?.heading ?? 'Quackies'}
          </Typography>
        </motion.div>
        {/* Username chip — shown once step advances */}
        <AnimatePresence>
          {step !== 'username' && (
            <motion.button
              key="chip"
              type="button"
              aria-label={`Change username, currently @${username}`}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              onClick={() => {
                setStep('username');
                setPassword('');
                setPasswordError('');
                setFormError('');
              }}
              className="flex cursor-pointer items-center justify-between gap-2 self-stretch rounded-full border-1.5 border-line bg-surface-brand py-1.5 pl-2.5 pr-3.5 font-[inherit]"
            >
              <Typography variant="label-strong" color={'var(--color-brand)'}>
                @{username}
              </Typography>
              <Typography variant="caption" color={'var(--color-muted)'}>
                Change
              </Typography>
            </motion.button>
          )}
        </AnimatePresence>

        <form
          onSubmit={step === 'username' ? handleContinue : handleSubmit}
          className="flex w-full flex-col gap-4"
          noValidate
        >
          {/* Username field — only visible in step 1 */}
          <AnimatePresence initial={false}>
            {step === 'username' && (
              <motion.div
                key="username-field"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-col gap-1.5 overflow-hidden"
              >
                <Typography variant="input-label" as="label" htmlFor="username">
                  Username
                </Typography>
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  aria-invalid={!!usernameError}
                  aria-describedby={
                    usernameError ? 'username-error' : undefined
                  }
                  className={classNames(
                    inputClass,
                    usernameError ? 'border-danger' : 'border-line',
                  )}
                />
                {usernameError && (
                  <Typography
                    id="username-error"
                    variant="caption"
                    color={'var(--color-danger)'}
                    role="alert"
                  >
                    {usernameError}
                  </Typography>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence initial={false}>
            {step !== 'username' && (
              <motion.div
                key="password-field"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-col gap-1.5 overflow-hidden"
              >
                <Typography variant="input-label" as="label" htmlFor="password">
                  Password
                </Typography>
                <div className="relative">
                  <input
                    ref={passwordRef}
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={
                      step === 'returning' ? 'current-password' : 'new-password'
                    }
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-invalid={!!passwordError}
                    aria-describedby={
                      passwordError ? 'password-error' : 'password-hint'
                    }
                    className={classNames(
                      inputClass,
                      'pr-11',
                      passwordError ? 'border-danger' : 'border-line',
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    aria-pressed={showPassword}
                    className="absolute right-3 top-1/2 flex -translate-y-1/2 cursor-pointer items-center border-0 bg-transparent p-1 text-muted"
                  >
                    <EyeIcon open={showPassword} size={18} />
                  </button>
                </div>
                {passwordError ? (
                  <Typography
                    id="password-error"
                    variant="caption"
                    color={'var(--color-danger)'}
                    role="alert"
                  >
                    {passwordError}
                  </Typography>
                ) : (
                  <Typography
                    id="password-hint"
                    variant="caption"
                    color={'var(--color-muted)'}
                  >
                    {config?.passwordHint}
                  </Typography>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {formError && (
            <Typography
              variant="caption"
              color={'var(--color-danger)'}
              className="text-center"
              role="alert"
            >
              {formError}
            </Typography>
          )}

          <Button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className={classNames('mt-1', loading && 'opacity-70')}
          >
            {loading ? (
              <>
                <span aria-hidden="true">…</span>
                <span className="sr-only">Loading</span>
              </>
            ) : step === 'username' ? (
              <>
                Continue <span aria-hidden="true">→</span>
              </>
            ) : (
              config?.cta
            )}
          </Button>
        </form>
      </div>
    </main>
  );
};
