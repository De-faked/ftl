import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { FileText, Upload, CheckCircle, Clock, AlertCircle, User as UserIcon, Calendar, Printer, Plane, Download, Trash2, Loader2 } from 'lucide-react';
import { User } from '../types';
import { Bdi } from './Bdi';
import { supabase } from '../src/lib/supabaseClient';
import { useAuth as useSupabaseAuth } from '../src/auth/useAuth';

// Moved outside to prevent re-creation
type TranslationShape = ReturnType<typeof useLanguage>['t'];

const VisaLetter: React.FC<{
  user: User | null;
  courseTitle: string;
  courseHours: string;
  courseDuration: string;
  startDate: string;
  endDate: string;
  t: TranslationShape;
  dir: 'ltr' | 'rtl';
}> = ({ user, courseTitle, courseHours, courseDuration, startDate, endDate, t, dir }) => {
  const renderTemplate = (template: string, values: Record<string, string>) =>
    template.split(/(\\{[^}]+\\})/g).map((part, index) => {
      const key = part.startsWith('{') ? part.slice(1, -1) : null;
      if (key && values[key] !== undefined) {
        return <Bdi key={`${key}-${index}`}>{values[key]}</Bdi>;
      }
      return <React.Fragment key={`text-${index}`}>{part}</React.Fragment>;
    });

  return (
  <div className="bg-white p-12 shadow-none border border-gray-200 max-w-3xl mx-auto print:p-0 print:shadow-none print:border-none" id="visa-letter" dir={dir}>
    {/* Letter Header */}
    <div className="flex justify-between items-start border-b-2 border-madinah-gold pb-6 mb-8">
      <div>
        <h2 className="text-3xl font-serif font-bold text-madinah-green">{t.common.instituteNameLatin}</h2>
        <p className="text-sm text-gray-500 mt-1">{t.common.instituteAddress}</p>
        <p className="text-xs text-gray-400 mt-1">{t.common.instituteLegalLine}</p>
      </div>
      <div className="text-right">
        <p className="font-mono text-sm text-gray-500">
          {t.portal.visaLetterDoc.dateLabel} <Bdi>{new Date().toLocaleDateString()}</Bdi>
        </p>
        <p className="font-mono text-sm text-gray-500">
          {t.portal.visaLetterDoc.refLabel}{' '}
          <Bdi>{`${user?.studentId}/${t.portal.visaLetterDoc.refSuffix}`}</Bdi>
        </p>
      </div>
    </div>

    {/* Letter Body */}
    <div className="space-y-6 text-gray-800 leading-relaxed font-serif text-lg">
      <p>{t.portal.visaLetterDoc.greeting}</p>

      <p className="font-bold text-xl my-6 text-center underline">{t.portal.visaLetterDoc.subject}</p>

      <p>
        {renderTemplate(t.portal.visaLetterDoc.bodyIntro, {
          name: user?.name ?? '',
          studentId: user?.studentId ?? '',
          nationality: user?.nationality || user?.applicationData?.nationality || t.portal.visaLetterDoc.blankValue,
          passportNumber: user?.passportNumber || user?.applicationData?.passportNumber || t.portal.visaLetterDoc.blankValue,
          courseTitle,
        })}
      </p>

      <p>
        {renderTemplate(t.portal.visaLetterDoc.durationLine, {
          startDate,
          endDate,
          courseDuration,
        })}
      </p>

      <p>{t.portal.visaLetterDoc.tuitionIntro}</p>
      <ul className="list-disc list-inside ml-4 space-y-1 font-medium">
        <li>
          {renderTemplate(t.portal.visaLetterDoc.tuitionItems.fees, { courseHours })}
        </li>
        <li>{t.portal.visaLetterDoc.tuitionItems.accommodation}</li>
        <li>{t.portal.visaLetterDoc.tuitionItems.support}</li>
      </ul>

      <p>
        {t.portal.visaLetterDoc.requestLine}
      </p>

      <p className="mt-8">{t.portal.visaLetterDoc.closing}</p>
    </div>

    {/* Signature */}
    <div className="mt-12 flex justify-between items-end">
      <div>
        <div className="h-16 w-48 bg-gray-100 mb-2 rounded flex items-center justify-center text-gray-400 italic font-serif text-xl border border-dashed border-gray-300">
          {t.portal.visaLetterDoc.signatureLabel}
        </div>
        <p className="font-bold border-t border-gray-300 pt-2 inline-block pr-12">{t.portal.visaLetterDoc.admissionsOffice}</p>
        <p className="text-sm text-gray-500">{t.common.ownerCompany}</p>
      </div>
      <div className="w-24 h-24 border-4 border-madinah-green rounded-full flex items-center justify-center opacity-80 rotate-12">
        <div className="text-center text-[10px] font-bold text-madinah-green leading-tight">
          {t.portal.visaLetterDoc.officialSeal}<br />
          {t.portal.visaLetterDoc.sealLocation}
        </div>
      </div>
    </div>
  </div>
);
};

export const StudentPortal: React.FC = () => {
  const { user } = useAuth();
  const { user: supabaseUser } = useSupabaseAuth();
  const { t, dir } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'visa'>('overview');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [storageFiles, setStorageFiles] = useState<Array<{
    name: string;
    id?: string;
    created_at?: string;
    updated_at?: string;
    fullPath: string;
  }>>([]);
  const [filesLoading, setFilesLoading] = useState(false);
  const [filesError, setFilesError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [activeFileAction, setActiveFileAction] = useState<string | null>(null);

  const selectedCourse = t.home.courses.list.find((c: any) => c.id === user?.enrolledCourseId || c.id === user?.applicationData?.courseId);
  const courseTitle = selectedCourse?.title || t.portal.visaLetterDoc.defaultCourseTitle;
  const courseHours = selectedCourse?.hours || t.portal.visaLetterDoc.blankValue;
  const courseDuration = selectedCourse?.duration || t.portal.visaLetterDoc.blankValue;

  const submissionDate = user?.applicationData?.submissionDate ? new Date(user.applicationData.submissionDate) : null;
  const start = submissionDate ? new Date(submissionDate.getTime() + 14 * 24 * 60 * 60 * 1000) : new Date();
  const end = new Date(start.getTime() + 60 * 24 * 60 * 60 * 1000);
  const startDateStr = start.toLocaleDateString();
  const endDateStr = end.toLocaleDateString();

  const safeFileName = (name: string) => {
    const baseName = name.trim().split('/').pop() || name.trim();
    const cleaned = baseName.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9._-]/g, '');
    return cleaned || 'document';
  };

  const fetchStudentFiles = useCallback(
    async (uid: string) => {
      setFilesLoading(true);
      setFilesError(null);
      try {
        const { data, error } = await supabase.storage.from('student-docs').list(`students/${uid}`, {
          limit: 200,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' }
        });

        if (error) {
          console.error('storage list error', error);
          setFilesError(t.portal.fileUpload.listError);
          setStorageFiles([]);
          return;
        }

        const sorted = [...(data ?? [])].sort((a, b) => {
          const aDate = new Date(a.created_at ?? a.updated_at ?? 0).getTime();
          const bDate = new Date(b.created_at ?? b.updated_at ?? 0).getTime();
          return bDate - aDate;
        });

        setStorageFiles(
          sorted.map((item) => ({
            name: item.name,
            id: item.id ?? undefined,
            created_at: item.created_at ?? undefined,
            updated_at: item.updated_at ?? undefined,
            fullPath: `students/${uid}/${item.name}`
          }))
        );
      } catch (err) {
        console.error('storage list threw', err);
        setFilesError(t.portal.fileUpload.listError);
        setStorageFiles([]);
      } finally {
        setFilesLoading(false);
      }
    },
    [t.portal.fileUpload.listError]
  );

  useEffect(() => {
    if (activeTab !== 'documents') return;
    if (!supabaseUser?.id) {
      setStorageFiles([]);
      setFilesError(t.portal.fileUpload.authRequired);
      return;
    }
    fetchStudentFiles(supabaseUser.id);
  }, [activeTab, fetchStudentFiles, supabaseUser?.id, t.portal.fileUpload.authRequired]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (e.target) e.target.value = '';
    setUploadError(null);
    setUploadSuccess(null);

    if (!user?.applicationData?.consentDocumentCollection) {
      setUploadError(t.portal.fileUpload.consentRequired);
      return;
    }

    if (!supabaseUser?.id) {
      setUploadError(t.portal.fileUpload.authRequired);
      return;
    }

    if (!file) return;

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setUploadError(t.portal.fileUpload.invalidType);
      return;
    }

    if (file.size > maxSize) {
      setUploadError(t.portal.fileUpload.tooLarge);
      return;
    }

    const timestamp = Date.now();
    const safeName = safeFileName(file.name);
    const uploadPath = `students/${supabaseUser.id}/${timestamp}-${safeName}`;

    setUploading(true);
    try {
      const { error } = await supabase.storage.from('student-docs').upload(uploadPath, file, {
        contentType: file.type
      });

      if (error) {
        console.error('storage upload error', error);
        setUploadError(t.portal.fileUpload.uploadFailed);
        return;
      }

      setUploadSuccess(t.portal.fileUpload.uploadSuccess);
      await fetchStudentFiles(supabaseUser.id);
    } catch (err) {
      console.error('storage upload threw', err);
      setUploadError(t.portal.fileUpload.uploadFailed);
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (fullPath: string) => {
    if (!supabaseUser?.id) return;
    setFilesError(null);
    setActiveFileAction(fullPath);
    try {
      const { data, error } = await supabase.storage.from('student-docs').createSignedUrl(fullPath, 600);
      if (error || !data?.signedUrl) {
        console.error('signed url error', error);
        setFilesError(t.portal.fileUpload.downloadFailed);
        return;
      }
      window.open(data.signedUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error('signed url threw', err);
      setFilesError(t.portal.fileUpload.downloadFailed);
    } finally {
      setActiveFileAction(null);
    }
  };

  const handleDelete = async (fullPath: string) => {
    if (!supabaseUser?.id) return;
    setFilesError(null);
    setActiveFileAction(fullPath);
    try {
      const { error } = await supabase.storage.from('student-docs').remove([fullPath]);
      if (error) {
        console.error('storage remove error', error);
        setFilesError(t.portal.fileUpload.deleteFailed);
        return;
      }
      await fetchStudentFiles(supabaseUser.id);
    } catch (err) {
      console.error('storage remove threw', err);
      setFilesError(t.portal.fileUpload.deleteFailed);
    } finally {
      setActiveFileAction(null);
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById('visa-letter');
    if (!printContent) return;

    // Create a hidden iframe for printing to preserve React state and events
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
        const headStyles = Array.from(document.head.querySelectorAll('link[rel="stylesheet"], style'));

        doc.write(`<html><head><title>${t.portal.visaLetterDoc.title}</title>`);

        headStyles.forEach((element) => {
            doc.write(element.outerHTML);
        });

        doc.write('<style>');
        doc.write('body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white; margin: 0; }');
        doc.write('@media print { @page { margin: 1cm; } }');
        doc.write('</style>');

        doc.write('</head><body class="bg-white">');
        doc.write(printContent.outerHTML);
        doc.write('</body></html>');
        doc.close();

        // Wait for iframe content (and styles) to load
        iframe.onload = () => {
            setTimeout(() => {
                iframe.contentWindow?.focus();
                iframe.contentWindow?.print();

                // Cleanup iframe after a delay to allow print dialog to handle content
                setTimeout(() => {
                    document.body.removeChild(iframe);
                }, 2000);
            }, 500);
        };
    }
  };

  const isEnrolled = user?.enrollmentStatus === 'enrolled' || user?.enrollmentStatus === 'visa_issued';
  const isPaid = user?.paymentStatus === 'paid';
  const hasApprovedDoc = user?.documents?.some(d => d.status === 'approved');
  const canGenerateVisa = isEnrolled && hasApprovedDoc && isPaid;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Welcome Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-madinah-green text-white rounded-full flex items-center justify-center text-2xl font-bold">
                    {user?.name.charAt(0)}
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{t.portal.welcome}, <Bdi>{user?.name}</Bdi></h1>
                    <p className="text-gray-500">{t.portal.studentId}: <span className="font-mono text-madinah-gold"><Bdi>{user?.studentId}</Bdi></span></p>
                </div>
            </div>
            <div className="flex gap-4">
                 <div className="text-right">
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">{t.portal.status}</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${isEnrolled ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {isEnrolled ? t.portal.enrolled : t.portal.pendingPayment}
                    </span>
                 </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
                <nav className="space-y-2">
                    <button 
                        onClick={() => setActiveTab('overview')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'overview' ? 'bg-madinah-green text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                        <UserIcon className="w-5 h-5" />
                        {t.portal.dashboard}
                    </button>
                    <button
                         onClick={() => setActiveTab('documents')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'documents' ? 'bg-madinah-green text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                        <FileText className="w-5 h-5" />
                        {t.portal.documents}
                    </button>
                    <button
                         onClick={() => setActiveTab('visa')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'visa' ? 'bg-madinah-green text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                        <Plane className="w-5 h-5" />
                        {t.portal.visaLetter}
                    </button>
                </nav>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3 space-y-6">
                
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                         <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">{t.portal.currentEnrollment}</h2>
                            {isEnrolled ? (
                                <div className="flex items-start gap-4 p-4 bg-madinah-sand/30 rounded-lg border border-madinah-gold/20">
                                    <div className="bg-white p-2 rounded-md shadow-sm">
                                        <CheckCircle className="w-8 h-8 text-madinah-green" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{t.portal.courseConfirmed}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{t.portal.courseConfirmedDesc}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                                    <AlertCircle className="w-6 h-6 text-yellow-600 mt-1" />
                                    <div>
                                        <h3 className="font-bold text-yellow-800">{t.portal.actionRequired}</h3>
                                        <p className="text-sm text-yellow-700 mt-1">{t.portal.actionRequiredDesc}</p>
                                    </div>
                                </div>
                            )}
                         </div>

                         <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">{t.portal.mySchedule}</h2>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-gray-400" />
                                        <span className="text-sm font-medium">{t.portal.orientationDay}</span>
                                    </div>
                                    <span className="text-sm text-gray-500"><Bdi>{startDateStr}</Bdi></span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-5 h-5 text-gray-400" />
                                        <span className="text-sm font-medium">{t.portal.dailyClasses}</span>
                                    </div>
                                    <span className="text-sm text-gray-500">{t.portal.dailySchedule}</span>
                                </div>
                            </div>
                         </div>
                    </div>
                )}

                {/* Documents Tab */}
                {activeTab === 'documents' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                         <div className="flex justify-between items-center mb-6">
                             <h2 className="text-lg font-bold text-gray-900">{t.portal.documents}</h2>
                             <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading || !user?.applicationData?.consentDocumentCollection || !supabaseUser?.id}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${uploading || !user?.applicationData?.consentDocumentCollection || !supabaseUser?.id ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-madinah-gold text-white hover:bg-yellow-600'}`}
                             >
                                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                {uploading ? t.portal.fileUpload.uploading : t.portal.uploadDocument}
                             </button>
                             <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden" 
                                accept="application/pdf,image/jpeg,image/png,image/webp"
                                onChange={handleFileUpload}
                             />
                         </div>

                         <div className="space-y-4">
                            {!user?.applicationData?.consentDocumentCollection && (
                              <div className="rounded-lg border border-yellow-100 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
                                {t.portal.fileUpload.consentRequired}
                              </div>
                            )}
                            {uploadError && (
                              <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                                {uploadError}
                              </div>
                            )}
                            {uploadSuccess && (
                              <div className="rounded-lg border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700" role="status">
                                {uploadSuccess}
                              </div>
                            )}
                            {filesError && (
                              <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                                {filesError}
                              </div>
                            )}
                            {filesLoading && (
                              <div className="flex items-center gap-2 text-sm text-gray-500" role="status" aria-live="polite">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-madinah-green" />
                                {t.portal.fileUpload.listLoading}
                              </div>
                            )}
                            {storageFiles.length > 0 ? (
                              storageFiles.map((file) => {
                                const dateLabel = file.created_at || file.updated_at;
                                return (
                                  <div key={file.fullPath} className="flex flex-col gap-3 rounded-lg border border-gray-100 p-4 transition-colors hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between">
                                      <div className="flex items-center gap-4">
                                          <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center">
                                              <FileText className="w-5 h-5" />
                                          </div>
                                          <div>
                                              <p className="font-bold text-gray-900"><Bdi>{file.name}</Bdi></p>
                                              <p className="text-xs text-gray-500">
                                                {t.portal.documentMeta.uploadedLabel}{' '}
                                                <Bdi>{dateLabel ? new Date(dateLabel).toLocaleDateString() : t.common.emptyValue}</Bdi>
                                              </p>
                                          </div>
                                      </div>
                                      <div className="flex flex-wrap items-center gap-2">
                                        <button
                                          onClick={() => handleDownload(file.fullPath)}
                                          disabled={activeFileAction === file.fullPath}
                                          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:border-gray-300"
                                        >
                                          <Download className="h-4 w-4" />
                                          {t.portal.fileUpload.download}
                                        </button>
                                        <button
                                          onClick={() => handleDelete(file.fullPath)}
                                          disabled={activeFileAction === file.fullPath}
                                          className="inline-flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:border-red-200"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                          {t.portal.fileUpload.delete}
                                        </button>
                                      </div>
                                  </div>
                                );
                              })
                            ) : (
                                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                    <p className="text-gray-500">{t.portal.noDocuments}</p>
                                    <p className="text-sm text-gray-400 mt-1">{t.portal.noDocumentsHint}</p>
                                </div>
                            )}
                         </div>
                    </div>
                )}

                {/* Visa Tab */}
                {activeTab === 'visa' && (
                    <div className="space-y-8">
                        {!canGenerateVisa ? (
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <AlertCircle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-yellow-700">
                                            {t.portal.visaLocked}
                                        </p>
                                        <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
                                            <li className={isEnrolled ? 'text-green-700 font-bold' : ''}>{t.portal.visaPaid}</li>
                                            <li className={hasApprovedDoc ? 'text-green-700 font-bold' : ''}>{t.portal.visaDocs}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-end">
                                <button
                                    onClick={handlePrint}
                                    className="flex items-center gap-2 px-6 py-3 bg-madinah-green text-white rounded-lg font-bold shadow-lg hover:bg-green-800 transition-colors"
                                >
                                    <Printer className="w-5 h-5" />
                                    {t.portal.print}
                                </button>
                            </div>
                        )}

                        {/* Letter Preview */}
                        <div className={`transform scale-90 origin-top shadow-2xl ${!canGenerateVisa ? 'opacity-50 blur-sm pointer-events-none select-none' : ''}`}>
                             <VisaLetter
                               user={user}
                               courseTitle={courseTitle}
                               courseHours={courseHours}
                               courseDuration={courseDuration}
                               startDate={startDateStr}
                               endDate={endDateStr}
                               t={t}
                               dir={dir}
                             />
                        </div>
                    </div>
                )}

            </div>
        </div>
      </div>
    </div>
  );
};
