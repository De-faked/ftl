export type Language = 'en' | 'ar' | 'id';

export type UserRole = 'student' | 'admin';

export type EnrollmentStatus = 'pending' | 'payment_pending' | 'enrolled' | 'visa_issued';

export type PaymentStatus = 'unpaid' | 'paid';

export type AppView =
  | 'LANDING'
  | 'STUDENT_PORTAL'
  | 'ADMIN_DASHBOARD'
  | 'APPLICATION'
  | 'TESTIMONIALS'
  | 'LEGAL_PRIVACY'
  | 'LEGAL_TERMS'
  | 'LEGAL_REFUNDS'
  | 'LEGAL_CONSENT'
  | 'LEGAL_GDPR';

export interface Document {
  id: string;
  type: 'passport' | 'id_card';
  name: string;
  uploadDate: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
}

export interface ApplicationData {
  phone: string;
  address: string;
  dob: string;
  nationality: string;
  passportNumber: string;
  passportExpiry: string;
  courseId: string;
  accommodationType: 'shared' | 'private';
  visaRequired: boolean;
  submissionDate: string;

  // Legal consents (required in production; collected here for compliance)
  consentTerms?: boolean;
  consentPrivacy?: boolean;
  consentDocumentCollection?: boolean;
  consentGDPR?: boolean;
}

export interface User {
  id: string; // Internal ID
  name: string;
  email: string;
  studentId: string;
  role: UserRole;
  enrolledCourseId?: string;
  enrollmentStatus?: EnrollmentStatus;
  paymentStatus?: PaymentStatus;
  documents?: Document[];
  applicationData?: ApplicationData;
  passportNumber?: string;
  nationality?: string;

  // Demo authentication (do NOT store plaintext passwords)
  passwordHash?: string;
  passwordSalt?: string;
}

export interface Course {
  id: string;
  title: string;
  arabicTitle: string;
  level: string;
  shortDescription: string;
  fullDescription: string;
  duration: string;
  hours: string;
  price: string;
  suitability: string;
  schedule: string;
  inclusions: string[];
  features: string[];
  capacity: number;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  country: string;
  text: string;
  rating: number;
  image?: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS'
}
