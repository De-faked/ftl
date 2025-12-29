import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../auth/useAuth';
import { useLanguage } from '../../contexts/LanguageContext';
import { logDevError } from '../utils/logging';

type StudentRecord = {
  student_id: string;
  status: string | null;
  enrolled_at: string | null;
};

type StudentRecordState = {
  student: StudentRecord | null;
  loading: boolean;
  error: string | null;
};

export const useStudentRecord = (): StudentRecordState => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [student, setStudent] = useState<StudentRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setStudent(null);
      setLoading(false);
      setError(null);
      return;
    }

    let active = true;

    const fetchStudent = async () => {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('students')
        .select('student_id,status,enrolled_at')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();

      if (!active) return;

      if (fetchError) {
        logDevError('fetch student record failed', fetchError);
        setStudent(null);
        setError(t.portal.portalPage.loadErrorBody);
        setLoading(false);
        return;
      }

      setStudent(data ?? null);
      setLoading(false);
    };

    fetchStudent();

    return () => {
      active = false;
    };
  }, [t, user]);

  return { student, loading, error };
};
