import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { logDevError } from '../utils/logging';

export type Profile = {
  id: string;
  email: string | null;
  role: string | null;
  full_name: string | null;
};

export type AuthContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  profile: Profile | null;
  profileLoading: boolean;
  profileError: Error | null;
  isAdmin: boolean;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<Error | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!mounted) return;
        if (error) logDevError('supabase.auth.getSession error', error);
        setSession(data.session ?? null);
        setLoading(false);
      })
      .catch((err) => {
        if (!mounted) return;
        logDevError('supabase.auth.getSession threw', err);
        setLoading(false);
      });

    const { data } = supabase.auth.onAuthStateChange((_event, updatedSession) => {
      setSession(updatedSession ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId) {
      setProfile(null);
      setProfileLoading(false);
      setProfileError(null);
      return;
    }

    let active = true;
    setProfileLoading(true);
    setProfileError(null);

    (async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id,email,role,full_name')
          .eq('id', userId)
          .single();

        if (!active) return;

        if (error) {
          const anyError = error as unknown as { code?: string; message?: string };
          if (anyError.code === 'PGRST116') {
            setProfile(null);
          } else {
            logDevError('profiles select error', error);
            setProfile(null);
            setProfileError(error as unknown as Error);
          }
        } else {
          setProfile((data ?? null) as Profile | null);
        }
      } catch (err) {
        if (!active) return;
        logDevError('profiles select threw', err);
        setProfile(null);
        setProfileError(err as Error);
      } finally {
        if (active) setProfileLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [session?.user?.id]);

  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId) {
      setIsAdmin(false);
      return;
    }

    let active = true;
    (async () => {
      try {
        const { data, error } = await supabase
          .from('admin_users')
          .select('user_id')
          .eq('user_id', userId)
          .limit(1);

        if (!active) return;

        if (error) {
          logDevError('admin_users select error', error);
          setIsAdmin(false);
          return;
        }

        setIsAdmin((data ?? []).length > 0);
      } catch (err) {
        if (!active) return;
        logDevError('admin_users select threw', err);
        setIsAdmin(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [session?.user?.id]);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const user = session?.user ?? null;
    return { session, user, loading, profile, profileLoading, profileError, isAdmin, signOut };
  }, [session, loading, profile, profileLoading, profileError, isAdmin, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
