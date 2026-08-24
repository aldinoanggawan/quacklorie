import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ScreenContainer } from '../../components/ScreenContainer';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Typography } from '../../components/ui/Typography';
import { LimitReachedPanel } from '../../components/meal-logging/LimitReachedPanel';
import { MealUploadForm } from '../../components/meal-logging/MealUploadForm';
import { MealAnalysisResults } from '../../components/meal-logging/MealAnalysisResults';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';
import { useRemainingAnalyses } from '../../hooks/useRemainingAnalyses';
import { useMealAnalysis } from '../../hooks/useMealAnalysis';
import type { MealType } from '../../types/models';

export const MealLoggingScreen = () => {
  const { mealType } = useParams<{ mealType: MealType }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useProfile();
  const mealBudget = profile ? Math.round(profile.daily_budget / 3) : 600;

  const {
    remaining,
    limit,
    refresh: refreshRemaining,
  } = useRemainingAnalyses(user);
  const analysis = useMealAnalysis();

  useEffect(() => {
    if (!mealType) navigate('/home');
  }, [mealType, navigate]);

  if (!mealType) return null;

  const handleAnalyse = async (args: {
    beforeFile: File;
    afterFile: File | null;
    note: string;
  }) => {
    const success = await analysis.analyse(args);
    if (success) refreshRemaining();
  };

  const handleLog = async () => {
    if (!analysis.result || !user) return;
    try {
      await analysis.save(user.id, mealType);
      refreshRemaining();
      navigate('/home');
    } catch (err) {
      console.error('Failed to save meal:', err);
    }
  };

  return (
    <ScreenContainer background={'var(--color-canvas)'} className="gap-5 pt-10">
      <ScreenHeader title={`Log ${mealType}`} onBack={() => navigate('/home')}>
        {remaining !== null && (
          <div
            role="group"
            aria-label={`${remaining} of ${limit} analyses remaining today`}
            className="flex items-center gap-1 rounded-full border-1.5 border-line bg-surface-brand py-1 px-2.5"
          >
            <span aria-hidden="true" className="text-xs">
              ✦
            </span>
            <Typography
              variant="label-strong"
              color={
                remaining === 0
                  ? 'var(--color-danger)'
                  : remaining <= 2
                    ? 'var(--color-brand)'
                    : 'var(--color-ink)'
              }
            >
              {remaining} / {limit}
            </Typography>
          </div>
        )}
      </ScreenHeader>

      <AnimatePresence mode="wait">
        {!analysis.result && remaining === 0 ? (
          <LimitReachedPanel limit={limit} />
        ) : !analysis.result ? (
          <MealUploadForm
            loading={analysis.loading}
            error={analysis.error}
            onAnalyse={handleAnalyse}
          />
        ) : (
          <MealAnalysisResults
            result={analysis.result}
            items={analysis.items}
            mealType={mealType}
            mealBudget={mealBudget}
            saving={analysis.saving}
            onChangeItemKcal={analysis.updateItemKcal}
            onRemoveItem={analysis.removeItem}
            onAddItem={analysis.addItem}
            onSave={handleLog}
            onReanalyse={analysis.reset}
          />
        )}
      </AnimatePresence>
    </ScreenContainer>
  );
};
