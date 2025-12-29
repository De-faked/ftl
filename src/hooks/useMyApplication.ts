import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../auth/useAuth';
import { useLanguage } from '../../contexts/LanguageContext';
import { logDevError } from '../utils/logging';

export type ApplicationRecord = {
  id: string;
  user_id: string;
  status: string | null;
  data: Record<string, unknown> | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type SaveResult = { error: string | null };

type MyApplicationState = {
  application: ApplicationRecord | null;
  loading: boolean;
  error: string | null;
  upsertDraft: (data: Record<string, unknown>) => Promise<SaveResult>;
  submit: (data: Record<string, unknown>) => Promise<SaveResult>;
};

export const useMyApplication = (): MyApplicationState => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [application, setApplication] = useState<ApplicationRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setApplication(null);
      setLoading(false);
      setError(null);
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);

    supabase
      .from('applications')
      .select('id,user_id,status,data,created_at,updated_at')
      .eq('user_id', user.id)
      .limit(1)
      .maybeSingle()
      .then(({ data, error: fetchError }) => {
        if (!active) return;
        if (fetchError) {
          logDevError('fetch application failed', fetchError);
          setApplication(null);
          setError(t.applicationForm.errors.loadFailed);
          setLoading(false);
          return;
        }

        setApplication((data as ApplicationRecord) ?? null);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [t, user]);

  const saveApplication = useCallback(
    async (status: 'draft' | 'submitted', data: Record<string, unknown>): Promise<SaveResult> => {
      if (!user) {
        const message = t.applicationForm.errors.authRequired;
        setError(message);
        return { error: message };
      }

      setError(null);

      const { data: saved, error: saveError } = await supabase
        .from('applications')
        .upsert({ user_id: user.id, status, data }, { onConflict: 'user_id' })
        .select('id,user_id,status,data,created_at,updated_at')
        .maybeSingle();

      if (saveError) {
        logDevError('save application failed', saveError);
        setError(t.applicationForm.errors.submitFailed);
        return { error: t.applicationForm.errors.submitFailed };
      }

      setApplication((saved as ApplicationRecord) ?? null);
      return { error: null };
    },
    [t, user]
  );

  const upsertDraft = useCallback(
    async (data: Record<string, unknown>) => saveApplication('draft', data),
    [saveApplication]
  );

  const submit = useCallback(
    async (data: Record<string, unknown>) => saveApplication('submitted', data),
    [saveApplication]
  );

  return { application, loading, error, upsertDraft, submit };
};
