import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, AppView, ApplicationData, Document } from '../types';

interface CourseStats {
  capacity: number;
  enrolled: number;
  isFull: boolean;
  remaining: number;
}

// Keep intent shape stable so TS never complains when reading optional fields
// (e.g., courseId). This also simplifies persistence to localStorage.
type AuthIntent = { view: AppView; courseId?: string } | null;

interface AuthContextType {
  user: User | null;
  authReady: boolean;

  currentView: AppView;
  setCurrentView: (view: AppView) => void;

  // Auth
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;

  isLoading: boolean;
  error: string | null;
  setError: (error: string | null) => void;

  // Course preselect / post-auth intent
  selectedCourseId: string | null;
  setSelectedCourseId: (courseId: string | null) => void;
  setAuthIntent: (intent: AuthIntent) => void;

  // User update
  updateUser: (updates: Partial<User>) => void;

  // Admin methods
  getAllStudents: () => User[];
  approveDocument: (studentId: string, docId: string) => void;
  rejectDocument: (studentId: string, docId: string, reason: string) => void;
  updateStudent: (studentId: string, updates: Partial<User>) => void;

  // Capacity methods
  getCourseStats: (courseId: string, defaultCapacity: number) => CourseStats;
  updateCourseCapacity: (courseId: string, capacity: number) => void;

  // Application
  submitApplication: (data: ApplicationData) => Promise<void>;

  // Password Reset (demo)
  requestPasswordReset: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const b64 = {
  encode(bytes: Uint8Array): string {
    let binary = '';
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return btoa(binary);
  },
  decode(str: string): Uint8Array {
    const binary = atob(str);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  },
};

async function hashPassword(password: string, saltB64?: string): Promise<{ hashB64: string; saltB64: string }> {
  const enc = new TextEncoder();
  // NOTE: Some TS/lib.dom versions type getRandomValues() as Uint8Array<ArrayBufferLike>.
  // PBKDF2 expects BufferSource backed by ArrayBuffer, so we normalize to a fresh Uint8Array
  // and pass an ArrayBuffer slice to keep TS satisfied across environments (Netlify, Node 22, etc.).
  const saltBytes = saltB64 ? b64.decode(saltB64) : new Uint8Array(crypto.getRandomValues(new Uint8Array(16)));
  const saltBuf = saltBytes.buffer.slice(saltBytes.byteOffset, saltBytes.byteOffset + saltBytes.byteLength);
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: saltBuf, iterations: 120000, hash: 'SHA-256' },
    keyMaterial,
    256
  );
  return { hashB64: b64.encode(new Uint8Array(bits)), saltB64: saltB64 ?? b64.encode(saltBytes) };
}

function normalizeEmail(email: string) {
  return email.toLowerCase().trim();
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<AppView>('LANDING');

  const [courseCapacities, setCourseCapacities] = useState<Record<string, number>>({});
  const [selectedCourseId, setSelectedCourseIdState] = useState<string | null>(null);

  const [authIntent, setAuthIntentState] = useState<AuthIntent>(null);

  // --- Storage helpers ---
  const readDb = (): User[] => {
    try {
      const dbStr = localStorage.getItem('fti_db') || '[]';
      return JSON.parse(dbStr);
    } catch {
      return [];
    }
  };

  const writeDb = (db: User[]) => localStorage.setItem('fti_db', JSON.stringify(db));

  const syncToDatabase = (userData: User) => {
    const db = readDb();
    const index = db.findIndex((u) => normalizeEmail(u.email) === normalizeEmail(userData.email));
    if (index >= 0) db[index] = userData;
    else db.push(userData);
    writeDb(db);
  };

  const generateStudentId = () => {
    const year = new Date().getFullYear().toString().slice(-2);
    const random = Math.floor(1000 + Math.random() * 9000);
    return `FTI-${year}-${random}`;
  };

  // Load user, capacities, and intent on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('fti_user');
      if (storedUser) setUser(JSON.parse(storedUser));
    } catch {}

    try {
      const storedCaps = localStorage.getItem('fti_capacities');
      if (storedCaps) setCourseCapacities(JSON.parse(storedCaps));
    } catch {}

    try {
      const storedSelected = localStorage.getItem('fti_selected_course');
      if (storedSelected) setSelectedCourseIdState(storedSelected);
    } catch {}

    try {
      const storedIntent = localStorage.getItem('fti_auth_intent');
      if (storedIntent) setAuthIntentState(JSON.parse(storedIntent));
    } catch {}

    setAuthReady(true);
  }, []);

  const setSelectedCourseId = (courseId: string | null) => {
    setSelectedCourseIdState(courseId);
    if (courseId) localStorage.setItem('fti_selected_course', courseId);
    else localStorage.removeItem('fti_selected_course');
  };

  const setAuthIntent = (intent: AuthIntent) => {
    setAuthIntentState(intent);
    if (intent) localStorage.setItem('fti_auth_intent', JSON.stringify(intent));
    else localStorage.removeItem('fti_auth_intent');
  };

  const clearAuthIntent = () => setAuthIntent(null);

  // --- Auth ---
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      if (!email || !password) throw new Error('Email and password are required');

      const normalizedEmail = normalizeEmail(email);

      const db = readDb();
      const found = db.find((u) => normalizeEmail(u.email) === normalizedEmail) as any;

      if (!found) throw new Error('No account found with this email.');

      // Modern hashed password path
      if (found.passwordHash && found.passwordSalt) {
        const { hashB64 } = await hashPassword(password, found.passwordSalt);
        if (hashB64 !== found.passwordHash) throw new Error('Incorrect password.');
      } else if (found.password) {
        // Legacy plaintext migration path (demo only)
        if (found.password !== password) throw new Error('Incorrect password.');
        const { hashB64, saltB64 } = await hashPassword(password);
        delete found.password;
        found.passwordHash = hashB64;
        found.passwordSalt = saltB64;
        // persist migration
        const idx = db.findIndex((u) => u.id === found.id);
        if (idx >= 0) db[idx] = found;
        writeDb(db);
      } else {
        throw new Error('Account is missing a password. Please reset your password.');
      }

      const safeUser: User = { ...found };
      setUser(safeUser);
      localStorage.setItem('fti_user', JSON.stringify(safeUser));

      // Apply post-auth intent if present
      const intent = authIntent;
      clearAuthIntent();

      if (intent?.view === 'APPLICATION') {
        if (intent.courseId) setSelectedCourseId(intent.courseId);
        setCurrentView('APPLICATION');
      } else if (intent?.view) {
        setCurrentView(intent.view);
      } else {
        setCurrentView(safeUser.role === 'admin' ? 'ADMIN_DASHBOARD' : 'STUDENT_PORTAL');
      }
    } catch (err: any) {
      setError(err?.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (!name || !email || !password) throw new Error('All fields are required');
      if (name.trim().length < 2) throw new Error('Full name is too short');
      if (password.length < 6) throw new Error('Password must be at least 6 characters');

      const normalizedEmail = normalizeEmail(email);
      const db = readDb();

      if (db.some((u) => normalizeEmail(u.email) === normalizedEmail)) {
        throw new Error('An account with this email already exists.');
      }

      const { hashB64, saltB64 } = await hashPassword(password);

      const newUser: User = {
        id: Date.now().toString(),
        name: name.trim(),
        email: normalizedEmail,
        studentId: generateStudentId(),
        role: 'student',
        enrollmentStatus: 'pending',
        paymentStatus: 'unpaid',
        documents: [],
        passwordHash: hashB64,
        passwordSalt: saltB64,
      };

      setUser(newUser);
      localStorage.setItem('fti_user', JSON.stringify(newUser));
      syncToDatabase(newUser);

      // Apply post-auth intent if present
      const intent = authIntent;
      clearAuthIntent();
      if (intent?.view === 'APPLICATION') {
        if (intent.courseId) setSelectedCourseId(intent.courseId);
        setCurrentView('APPLICATION');
      } else if (intent?.view) {
        setCurrentView(intent.view);
      } else {
        setCurrentView('STUDENT_PORTAL');
      }
    } catch (err: any) {
      setError(err?.message || 'Signup failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('fti_user');
    setUser(null);
    setCurrentView('LANDING');
    setError(null);
  };

  // --- User update ---
  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    const updated: User = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('fti_user', JSON.stringify(updated));
    syncToDatabase(updated);
  };

  // --- Application ---
  const submitApplication = async (data: ApplicationData) => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 900));
      if (!user) throw new Error('Not authenticated');

      // Require legal consents (for production-readiness)
      if (!data.consentTerms || !data.consentPrivacy || !data.consentDocumentCollection) {
        throw new Error('You must accept Terms, Privacy Policy, and Document Consent.');
      }

      const updatedUser: User = {
        ...user,
        enrolledCourseId: data.courseId,
        enrollmentStatus: 'payment_pending',
        paymentStatus: user.paymentStatus ?? 'unpaid',
        nationality: data.nationality,
        passportNumber: data.passportNumber,
        applicationData: data,
      };

      setUser(updatedUser);
      localStorage.setItem('fti_user', JSON.stringify(updatedUser));
      syncToDatabase(updatedUser);
      localStorage.removeItem('fti_app_draft');
      setCurrentView('STUDENT_PORTAL');
    } catch (err: any) {
      setError(err?.message || 'Submission failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // --- Password Reset (demo) ---
  const requestPasswordReset = async (_email: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setIsLoading(false);
    // Always return true to avoid account enumeration in demo
    return true;
  };

  // --- Admin methods ---
  const getAllStudents = () => {
    return readDb().filter((u) => u.role === 'student');
  };

  const updateStudent = (studentId: string, updates: Partial<User>) => {
    const db = readDb();
    const index = db.findIndex((u) => u.id === studentId);
    if (index >= 0) {
      db[index] = { ...db[index], ...updates };
      writeDb(db);
      if (user && user.id === studentId) {
        setUser(db[index]);
        localStorage.setItem('fti_user', JSON.stringify(db[index]));
      }
    }
  };

  const approveDocument = (studentId: string, docId: string) => {
    const db = readDb();
    const studentIndex = db.findIndex((u) => u.id === studentId);
    if (studentIndex >= 0) {
      const student = db[studentIndex];
      const docs = (student.documents || []) as Document[];
      const updatedDocs: Document[] = docs.map((d) =>
        d.id === docId
          ? { ...d, status: 'approved' as const, rejectionReason: undefined }
          : d
      );
      db[studentIndex] = { ...student, documents: updatedDocs };
      writeDb(db);
      if (user && user.id === studentId) {
        setUser(db[studentIndex]);
        localStorage.setItem('fti_user', JSON.stringify(db[studentIndex]));
      }
    }
  };

  const rejectDocument = (studentId: string, docId: string, reason: string) => {
    const db = readDb();
    const studentIndex = db.findIndex((u) => u.id === studentId);
    if (studentIndex >= 0) {
      const student = db[studentIndex];
      const docs = (student.documents || []) as Document[];
      const updatedDocs: Document[] = docs.map((d) =>
        d.id === docId
          ? { ...d, status: 'rejected' as const, rejectionReason: reason || 'Rejected' }
          : d
      );
      db[studentIndex] = { ...student, documents: updatedDocs };
      writeDb(db);
      if (user && user.id === studentId) {
        setUser(db[studentIndex]);
        localStorage.setItem('fti_user', JSON.stringify(db[studentIndex]));
      }
    }
  };

  // --- Capacity methods ---
  const updateCourseCapacity = (courseId: string, capacity: number) => {
    const newCaps = { ...courseCapacities, [courseId]: capacity };
    setCourseCapacities(newCaps);
    localStorage.setItem('fti_capacities', JSON.stringify(newCaps));
  };

  const getCourseStats = (courseId: string, defaultCapacity: number): CourseStats => {
    const db = readDb();

    const enrolledCount = db.filter((u) => {
      return (
        u.enrolledCourseId === courseId &&
        ['payment_pending', 'enrolled', 'visa_issued'].includes(u.enrollmentStatus || '')
      );
    }).length;

    const capacity = courseCapacities[courseId] !== undefined ? courseCapacities[courseId] : defaultCapacity;

    return {
      capacity,
      enrolled: enrolledCount,
      isFull: enrolledCount >= capacity,
      remaining: Math.max(0, capacity - enrolledCount),
    };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authReady,
        currentView,
        setCurrentView,
        login,
        signup,
        logout,
        isLoading,
        error,
        setError,
        selectedCourseId,
        setSelectedCourseId,
        setAuthIntent,
        updateUser,
        getAllStudents,
        approveDocument,
        rejectDocument,
        updateStudent,
        getCourseStats,
        updateCourseCapacity,
        submitApplication,
        requestPasswordReset,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
