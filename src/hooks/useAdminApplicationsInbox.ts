import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from '../../contexts/LanguageContext';
import { logDevError } from '../utils/logging';
import type { ApplicationStatus } from './useMyApplication';
import type { NormalizedPlanDays } from '../utils/planDays';

type RawApplicationRow = {
  id: string;
  public_id: string;
  user_id: string;
  status: ApplicationStatus | string | null;
  data: Record<string, unknown> | null;
  created_at: string | null;
  updated_at: string | null;
  payment_link: string | null;
  payment_link_sent_at: string | null;
  payment_paid_at: string | null;
  rejection_reason: string | null;
};

type ProfileRow = {
  id: string;
  email: string | null;
  full_name: string | null;
};

export type AdminInboxApplication = {
  id: string;
  publicId: string;
  userId: string;
  status: ApplicationStatus | string;
  data: Record<string, unknown> | null;
  createdAt: string | null;
  updatedAt: string | null;
  paymentLink: string | null;
  paymentLinkSentAt: string | null;
  paymentPaidAt: string | null;
  rejectionReason: string | null;
  profileEmail: string | null;
  profileName: string | null;
};

type ActionResult = { error: string | null };

type UseAdminApplicationsInbox = {
  applications: AdminInboxApplication[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  approve: (applicationId: string) => Promise<ActionResult>;
  reject: (applicationId: string, reason?: string | null) => Promise<ActionResult>;
  sendPaymentLink: (applicationId: string, paymentLink: string) => Promise<ActionResult>;
  markPaid: (applicationId: string) => Promise<ActionResult>;
  assignPlan: (applicationId: string, planDays: NormalizedPlanDays) => Promise<ActionResult>;
};

const mapApplications = (
  rows: RawApplicationRow[],
  profiles: Map<string, ProfileRow>
): AdminInboxApplication[] => {
  return rows.map((row) => {
    const profile = profiles.get(row.user_id) ?? null;
    return {
      id: row.id,
      publicId: row.public_id,
      userId: row.user_id,
      status: (row.status as ApplicationStatus | string) ?? 'submitted',
      data: row.data ?? null,
      createdAt: row.created_at ?? null,
      updatedAt: row.updated_at ?? null,
      paymentLink: row.payment_link ?? null,
      paymentLinkSentAt: row.payment_link_sent_at ?? null,
      paymentPaidAt: row.payment_paid_at ?? null,
      rejectionReason: row.rejection_reason ?? null,
      profileEmail: profile?.email ?? null,
      profileName: profile?.full_name ?? null,
    };
  });
};

export const useAdminApplicationsInbox = (): UseAdminApplicationsInbox => {
  const { t } = useLanguage();
  const [applications, setApplications] = useState<AdminInboxApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: appsError } = await supabase
        .from('applications')
        .select(
          'id,public_id,user_id,status,data,created_at,updated_at,payment_link,payment_link_sent_at,payment_paid_at,rejection_reason'
        )
        .neq('status', 'draft')
        .order('created_at', { ascending: false });

      if (appsError) {
        logDevError('admin applications load failed', appsError);
        setApplications([]);
        setError(t.admin.applicationsInbox.errors.loadFailed);
        return;
      }

      const rows = (data as RawApplicationRow[]) ?? [];
      const userIds = Array.from(new Set(rows.map((row) => row.user_id).filter(Boolean)));
      let profileMap = new Map<string, ProfileRow>();

      if (userIds.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id,email,full_name')
          .in('id', userIds);

        if (profilesError) {
          logDevError('admin applications profiles load failed', profilesError);
          setApplications([]);
          setError(t.admin.applicationsInbox.errors.loadFailed);
          return;
        }

        profileMap = new Map(
          ((profilesData ?? []) as ProfileRow[]).map((profile) => [profile.id, profile])
        );
      }

      setApplications(mapApplications(rows, profileMap));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void fetchApplications();
  }, [fetchApplications]);

  const wrapAction = useCallback(
    async (
      action: () => Promise<{ error: Error | null } | { error: null } | void>,
      errorMessage: string
    ) => {
      try {
        const result = (await action()) as { error?: Error | null } | void;
        if (result && result.error) {
          return { error: errorMessage };
        }
        await fetchApplications();
        return { error: null };
      } catch (err) {
        logDevError('admin applications action failed', err);
        return { error: errorMessage };
      }
    },
    [fetchApplications]
  );

  const approve = useCallback(
    async (applicationId: string): Promise<ActionResult> => {
      return wrapAction(
        async () => {
          const { error: approveError } = await supabase.rpc('approve_application', {
            p_application_id: applicationId,
          });
          if (approveError) {
            logDevError('approve_application failed', approveError);
            return { error: approveError };
          }
          return { error: null };
        },
        t.admin.applicationsInbox.errors.approveFailed
      );
    },
    [t.admin.applicationsInbox.errors.approveFailed, wrapAction]
  );

  const reject = useCallback(
    async (applicationId: string, reason?: string | null): Promise<ActionResult> => {
      return wrapAction(
        async () => {
          const { error: rejectError } = await supabase.rpc('admin_update_application_status', {
            p_application_id: applicationId,
            p_status: 'rejected',
            p_rejection_reason: reason ?? null,
          });
          if (rejectError) {
            logDevError('reject application failed', rejectError);
            return { error: rejectError };
          }
          return { error: null };
        },
        t.admin.applicationsInbox.errors.rejectFailed
      );
    },
    [t.admin.applicationsInbox.errors.rejectFailed, wrapAction]
  );

  const sendPaymentLink = useCallback(
    async (applicationId: string, paymentLink: string): Promise<ActionResult> => {
      return wrapAction(
        async () => {
          const trimmed = paymentLink.trim();
          const { error: paymentError } = await supabase.rpc('admin_set_payment_link', {
            p_application_id: applicationId,
            p_payment_link: trimmed,
          });
          if (paymentError) {
            logDevError('admin_set_payment_link failed', paymentError);
            return { error: paymentError };
          }
          return { error: null };
        },
        t.admin.applicationsInbox.errors.paymentLinkFailed
      );
    },
    [t.admin.applicationsInbox.errors.paymentLinkFailed, wrapAction]
  );

  const markPaid = useCallback(
    async (applicationId: string): Promise<ActionResult> => {
      return wrapAction(
        async () => {
          const { error: paidError } = await supabase.rpc('admin_mark_payment_paid', {
            p_application_id: applicationId,
          });
          if (paidError) {
            logDevError('admin_mark_payment_paid failed', paidError);
            return { error: paidError };
          }
          return { error: null };
        },
        t.admin.applicationsInbox.errors.markPaidFailed
      );
    },
    [t.admin.applicationsInbox.errors.markPaidFailed, wrapAction]
  );

  const assignPlan = useCallback(
    async (applicationId: string, planDays: NormalizedPlanDays): Promise<ActionResult> => {
      return wrapAction(
        async () => {
          const { error: planError } = await supabase.rpc('admin_set_application_plan_days', {
            p_application_id: applicationId,
            p_plan_days: planDays,
          });
          if (planError) {
            logDevError('admin_set_application_plan_days failed', planError);
            return { error: planError };
          }
          return { error: null };
        },
        t.admin.applicationsInbox.errors.planUpdateFailed
      );
    },
    [t.admin.applicationsInbox.errors.planUpdateFailed, wrapAction]
  );

  return {
    applications,
    loading,
    error,
    refresh: fetchApplications,
    approve,
    reject,
    sendPaymentLink,
    markPaid,
    assignPlan,
  };
};
