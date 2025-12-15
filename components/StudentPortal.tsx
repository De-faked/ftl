import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { FileText, Upload, CheckCircle, Clock, AlertCircle, User as UserIcon, Calendar, Printer, Plane } from 'lucide-react';
import { Document, User } from '../types';
import { INSTITUTE } from '../config/institute';

// Moved outside to prevent re-creation
const VisaLetter: React.FC<{
  user: User | null;
  courseTitle: string;
  courseHours: string;
  courseDuration: string;
  startDate: string;
  endDate: string;
}> = ({ user, courseTitle, courseHours, courseDuration, startDate, endDate }) => (
  <div className="bg-white p-12 shadow-none border border-gray-200 max-w-3xl mx-auto print:p-0 print:shadow-none print:border-none" id="visa-letter">
    {/* Letter Header */}
    <div className="flex justify-between items-start border-b-2 border-madinah-gold pb-6 mb-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-madinah-green">{INSTITUTE.nameEn}</h1>
        <p className="text-sm text-gray-500 mt-1">{INSTITUTE.addressEn}</p>
        <p className="text-xs text-gray-400 mt-1">{INSTITUTE.legalLineEn}</p>
      </div>
      <div className="text-right">
        <p className="font-mono text-sm text-gray-500">Date: {new Date().toLocaleDateString()}</p>
        <p className="font-mono text-sm text-gray-500">Ref: {user?.studentId}/VISA</p>
      </div>
    </div>

    {/* Letter Body */}
    <div className="space-y-6 text-gray-800 leading-relaxed font-serif text-lg">
      <p>To The Visa Consul / Immigration Officer,</p>

      <p className="font-bold text-xl my-6 text-center underline">Subject: Confirmation of Enrollment & Visa Support</p>

      <p>
        This letter confirms that <span className="font-bold">{user?.name}</span> (Student ID: {user?.studentId}), a national of{' '}
        <span className="font-bold">{user?.nationality || user?.applicationData?.nationality || '________________'}</span>, holding Passport Number{' '}
        <span className="font-bold">{user?.passportNumber || user?.applicationData?.passportNumber || '________________'}</span>, has been enrolled and accepted into the{' '}
        <span className="font-bold">{courseTitle}</span> at {INSTITUTE.nameEn} in Al-Madinah Al-Munawwarah.
      </p>

      <p>
        The course duration is from <span className="font-bold">{startDate}</span> to <span className="font-bold">{endDate}</span>{' '}
        ({courseDuration}).
      </p>

      <p>Please note that the institute has received tuition payment for the course, which includes:</p>
      <ul className="list-disc list-inside ml-4 space-y-1 font-medium">
        <li>Tuition Fees ({courseHours})</li>
        <li>Accommodation in Madinah (if selected)</li>
        <li>Support services as described in the program package</li>
      </ul>

      <p>
        We kindly request you to grant the necessary visa to facilitate the student's travel for educational purposes. {INSTITUTE.nameEn} accepts full responsibility for the student during their study period within the scope of institute policies.
      </p>

      <p className="mt-8">Sincerely,</p>
    </div>

    {/* Signature */}
    <div className="mt-12 flex justify-between items-end">
      <div>
        <div className="h-16 w-48 bg-gray-100 mb-2 rounded flex items-center justify-center text-gray-400 italic font-serif text-xl border border-dashed border-gray-300">
          Signature
        </div>
        <p className="font-bold border-t border-gray-300 pt-2 inline-block pr-12">Admissions Office</p>
        <p className="text-sm text-gray-500">{INSTITUTE.ownerCompanyEn}</p>
      </div>
      <div className="w-24 h-24 border-4 border-madinah-green rounded-full flex items-center justify-center opacity-80 rotate-12">
        <div className="text-center text-[10px] font-bold text-madinah-green leading-tight">
          OFFICIAL SEAL<br />
          MADINAH
        </div>
      </div>
    </div>
  </div>
);

export const StudentPortal: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'visa'>('overview');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedCourse = t.courses.list.find((c: any) => c.id === user?.enrolledCourseId || c.id === user?.applicationData?.courseId);
  const courseTitle = selectedCourse?.title || 'Arabic Program';
  const courseHours = selectedCourse?.hours || '________________';
  const courseDuration = selectedCourse?.duration || '________________';

  const submissionDate = user?.applicationData?.submissionDate ? new Date(user.applicationData.submissionDate) : null;
  const start = submissionDate ? new Date(submissionDate.getTime() + 14 * 24 * 60 * 60 * 1000) : new Date();
  const end = new Date(start.getTime() + 60 * 24 * 60 * 60 * 1000);
  const startDateStr = start.toLocaleDateString();
  const endDateStr = end.toLocaleDateString();

  // Mock upload functionality
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user?.applicationData?.consentDocumentCollection) {
      alert('You must consent to document collection before uploading passport documents.');
      return;
    }
    const file = e.target.files?.[0];
    if (file && user) {
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!allowedTypes.includes(file.type)) {
            alert('Please upload a PDF or image file for your passport.');
            return;
        }

        if (file.size > maxSize) {
            alert('File is too large. Please upload a file under 5MB.');
            return;
        }

        // Create a mock document record
        const newDoc: Document = {
            id: Date.now().toString(),
            type: 'passport',
            name: file.name,
            uploadDate: new Date().toLocaleDateString(),
            status: 'pending'
        };

        // Update user state
        const currentDocs = user.documents || [];
        updateUser({
            documents: [...currentDocs, newDoc]
        });
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
        // Copy Tailwind CDN and Config from parent document to ensure styles match
        const tailwindLink = document.querySelector('script[src*="tailwindcss"]');
        const tailwindConfig = Array.from(document.querySelectorAll('script')).find(s => s.innerText.includes('tailwind.config'));
        
        doc.write('<html><head><title>Visa Letter</title>');
        if (tailwindLink) doc.write(tailwindLink.outerHTML);
        if (tailwindConfig) doc.write(tailwindConfig.outerHTML);
        
        doc.write('<style>');
        doc.write('body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white; margin: 0; }');
        doc.write('@media print { @page { margin: 1cm; } }');
        doc.write('</style>');
        
        doc.write('</head><body class="bg-white">');
        doc.write(printContent.outerHTML);
        doc.write('</body></html>');
        doc.close();

        // Wait for iframe content (and Tailwind) to load
        iframe.onload = () => {
            // Slight delay to ensure Tailwind has processed the new DOM
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
                    <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}</h1>
                    <p className="text-gray-500">Student ID: <span className="font-mono text-madinah-gold">{user?.studentId}</span></p>
                </div>
            </div>
            <div className="flex gap-4">
                 <div className="text-right">
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Status</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${isEnrolled ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {isEnrolled ? 'Enrolled' : 'Pending Payment'}
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
                        Dashboard
                    </button>
                    <button 
                         onClick={() => setActiveTab('documents')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'documents' ? 'bg-madinah-green text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                        <FileText className="w-5 h-5" />
                        Documents
                    </button>
                    <button 
                         onClick={() => setActiveTab('visa')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'visa' ? 'bg-madinah-green text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                        <Plane className="w-5 h-5" />
                        Visa Letter
                    </button>
                </nav>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3 space-y-6">
                
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                         <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Current Enrollment</h2>
                            {isEnrolled ? (
                                <div className="flex items-start gap-4 p-4 bg-madinah-sand/30 rounded-lg border border-madinah-gold/20">
                                    <div className="bg-white p-2 rounded-md shadow-sm">
                                        <CheckCircle className="w-8 h-8 text-madinah-green" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Course Confirmed</h3>
                                        <p className="text-sm text-gray-600 mt-1">You are successfully enrolled. Your classes are scheduled to begin soon. Please ensure your travel documents are in order.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                                    <AlertCircle className="w-6 h-6 text-yellow-600 mt-1" />
                                    <div>
                                        <h3 className="font-bold text-yellow-800">Action Required</h3>
                                        <p className="text-sm text-yellow-700 mt-1">Please complete your course payment to confirm your seat and generate your visa letter.</p>
                                    </div>
                                </div>
                            )}
                         </div>

                         <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">My Schedule</h2>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-gray-400" />
                                        <span className="text-sm font-medium">Orientation Day</span>
                                    </div>
                                    <span className="text-sm text-gray-500">{startDateStr}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-5 h-5 text-gray-400" />
                                        <span className="text-sm font-medium">Daily Classes</span>
                                    </div>
                                    <span className="text-sm text-gray-500">Sun-Thu, 8 AM - 1 PM</span>
                                </div>
                            </div>
                         </div>
                    </div>
                )}

                {/* Documents Tab */}
                {activeTab === 'documents' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                         <div className="flex justify-between items-center mb-6">
                             <h2 className="text-lg font-bold text-gray-900">My Documents</h2>
                             <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-2 px-4 py-2 bg-madinah-gold text-white rounded-lg text-sm font-bold hover:bg-yellow-600 transition-colors"
                             >
                                <Upload className="w-4 h-4" />
                                Upload Document
                             </button>
                             <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/*,.pdf"
                                onChange={handleFileUpload}
                             />
                         </div>

                         <div className="space-y-4">
                            {user?.documents && user.documents.length > 0 ? (
                                user.documents.map((doc) => (
                                    <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{doc.name}</p>
                                                <p className="text-xs text-gray-500">Uploaded: {doc.uploadDate}</p>
                                            </div>
                                        </div>
                                        <div>
                                            {doc.status === 'approved' && <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">Approved</span>}
                                            {doc.status === 'pending' && <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded">Pending Review</span>}
                                            {doc.status === 'rejected' && <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">Rejected</span>}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                    <p className="text-gray-500">No documents uploaded yet.</p>
                                    <p className="text-sm text-gray-400 mt-1">Please upload a copy of your passport.</p>
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
                                            Visa generation is locked. Please ensure:
                                        </p>
                                        <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
                                            <li className={isEnrolled ? 'text-green-700 font-bold' : ''}>Course fee is fully paid</li>
                                            <li className={hasApprovedDoc ? 'text-green-700 font-bold' : ''}>Passport document is uploaded and approved</li>
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
                                    Print / Download PDF
                                </button>
                            </div>
                        )}

                        {/* Letter Preview */}
                        <div className={`transform scale-90 origin-top shadow-2xl ${!canGenerateVisa ? 'opacity-50 blur-sm pointer-events-none select-none' : ''}`}>
                             <VisaLetter user={user} courseTitle={courseTitle} courseHours={courseHours} courseDuration={courseDuration} startDate={startDateStr} endDate={endDateStr} />
                        </div>
                    </div>
                )}

            </div>
        </div>
      </div>
    </div>
  );
};