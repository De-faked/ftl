import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../auth/useAuth';

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
        setStudent(null);
        setError(fetchError.message);
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
  }, [user]);

  return { student, loading, error };
};
