import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export type AdminStudentRecord = {
  user_id: string;
  student_id: string;
  status: string | null;
  enrolled_at: string | null;
};

type AdminStudentsState = {
  students: AdminStudentRecord[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  createStudent: (
    userId: string
  ) => Promise<{ studentId: string | null; error: { message: string; code?: string } | null }>;
  updateStatus: (
    studentId: string,
    status: string
  ) => Promise<{ error: { message: string; code?: string } | null }>;
};

export const useAdminStudents = (): AdminStudentsState => {
  const [students, setStudents] = useState<AdminStudentRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('students')
      .select('user_id,student_id,status,enrolled_at')
      .order('enrolled_at', { ascending: false });

    if (fetchError) {
      setStudents([]);
      setError(fetchError.message);
      setLoading(false);
      return;
    }

    setStudents(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const createStudent = useCallback(
    async (userId: string) => {
      const { data, error: insertError } = await supabase
        .from('students')
        .insert({ user_id: userId })
        .select('student_id')
        .single();

      if (insertError) {
        return { studentId: null, error: { message: insertError.message, code: insertError.code ?? undefined } };
      }

      await fetchStudents();
      return { studentId: data?.student_id ?? null, error: null };
    },
    [fetchStudents]
  );

  const updateStatus = useCallback(
    async (studentId: string, status: string) => {
      const { error: updateError } = await supabase
        .from('students')
        .update({ status })
        .eq('student_id', studentId);

      if (updateError) {
        return { error: { message: updateError.message, code: updateError.code ?? undefined } };
      }

      await fetchStudents();
      return { error: null };
    },
    [fetchStudents]
  );

  return { students, loading, error, refresh: fetchStudents, createStudent, updateStatus };
};
