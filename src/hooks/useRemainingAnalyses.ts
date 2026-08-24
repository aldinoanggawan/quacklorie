import { useCallback, useEffect, useState } from 'react';
import { getRemainingAnalyses } from '../lib/db';
import type { User } from '@supabase/supabase-js';

export const useRemainingAnalyses = (user: User | null) => {
  const [remaining, setRemaining] = useState<number | null>(null);
  const [limit, setLimit] = useState(10);

  const refresh = useCallback(() => {
    if (!user) return;
    getRemainingAnalyses(user.id)
      .then(({ remaining, limit }) => {
        setRemaining(remaining);
        setLimit(limit);
      })
      .catch(console.error);
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { remaining, limit, refresh };
};
