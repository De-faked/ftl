import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from '../../contexts/LanguageContext';
import { logDevError } from '../utils/logging';

export type AdminPaymentRecord = {
  id: string;
  user_id: string;
  application_id: string | null;
  cart_id: string;
  tran_ref: string | null;
  amount: number;
  currency: string;
  status: string;
  created_at: string | null;
};

type AdminPaymentsState = {
  payments: AdminPaymentRecord[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export const useAdminPayments = (): AdminPaymentsState => {
  const { t } = useLanguage();
  const [payments, setPayments] = useState<AdminPaymentRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('payments')
      .select('id,user_id,application_id,cart_id,tran_ref,amount,currency,status,created_at')
      .order('created_at', { ascending: false });

    if (fetchError) {
      logDevError('fetch admin payments failed', fetchError);
      setPayments([]);
      setError(t.admin.payments.errors.loadFailed);
      setLoading(false);
      return;
    }

    setPayments((data as AdminPaymentRecord[]) ?? []);
    setLoading(false);
  }, [t]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return { payments, loading, error, refresh: fetchPayments };
};
