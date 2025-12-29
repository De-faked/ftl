import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../auth/useAuth';
import { useLanguage } from '../../contexts/LanguageContext';
import { logDevError } from '../utils/logging';

export type PaymentRecord = {
  id: string;
  user_id: string;
  application_id: string | null;
  cart_id: string;
  tran_ref: string | null;
  amount: number;
  currency: string;
  status: string;
  redirect_url: string | null;
  paypage_ttl: number | null;
  created_at: string | null;
};

type MyPaymentsState = {
  payments: PaymentRecord[];
  latestPayment: PaymentRecord | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export const useMyPayments = (): MyPaymentsState => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = useCallback(async () => {
    if (!user) {
      setPayments([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('payments')
      .select('id,user_id,application_id,cart_id,tran_ref,amount,currency,status,redirect_url,paypage_ttl,created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (fetchError) {
      logDevError('fetch payments failed', fetchError);
      setPayments([]);
      setError(t.portal.payment.errors.loadFailed);
      setLoading(false);
      return;
    }

    setPayments((data as PaymentRecord[]) ?? []);
    setLoading(false);
  }, [t, user]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const latestPayment = useMemo(() => payments[0] ?? null, [payments]);

  return { payments, latestPayment, loading, error, refresh: fetchPayments };
};
