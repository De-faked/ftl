import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Check, ChevronRight, ChevronLeft, Calendar, MapPin, User, Upload, CreditCard, ShieldCheck } from 'lucide-react';
import { ApplicationData, Course } from '../types';

export const ApplicationForm: React.FC = () => {
  const { user, submitApplication, isLoading, selectedCourseId, setCurrentView } = useAuth();
  const { t, dir } = useLanguage();
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [formError, setFormError] = useState<string | null>(null);

  const [formData, setFormData] = useState<ApplicationData>({
    phone: user?.applicationData?.phone || '',
    address: user?.applicationData?.address || '',
    dob: user?.applicationData?.dob || '',
    nationality: user?.applicationData?.nationality || user?.nationality || '',
    passportNumber: user?.applicationData?.passportNumber || user?.passportNumber || '',
    passportExpiry: user?.applicationData?.passportExpiry || '',
    courseId: user?.applicationData?.courseId || selectedCourseId || '',
    accommodationType: user?.applicationData?.accommodationType || 'shared',
    visaRequired: user?.applicationData?.visaRequired ?? true,
    submissionDate: user?.applicationData?.submissionDate || new Date().toISOString(),
    consentTerms: user?.applicationData?.consentTerms || false,
    consentPrivacy: user?.applicationData?.consentPrivacy || false,
    consentDocumentCollection: user?.applicationData?.consentDocumentCollection || false,
    consentGDPR: user?.applicationData?.consentGDPR || false
  });

  useEffect(() => {
      if (!user) return;

      if (user.applicationData) {
          setFormData(prev => ({
              ...prev,
              ...user.applicationData,
              courseId: selectedCourseId || user.applicationData.courseId || prev.courseId,
          }));
          return;
      }

      setFormData(prev => ({
          ...prev,
          nationality: user.nationality || prev.nationality,
          passportNumber: user.passportNumber || prev.passportNumber,
          courseId: selectedCourseId || prev.courseId,
      }));
  }, [user, selectedCourseId]);

  const handleChange = (field: keyof ApplicationData, value: any) => {
      setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (s: number): string | null => {
      const isEmpty = (v: any) => !v || String(v).trim().length === 0;
      if (s === 1) {
        if (isEmpty(formData.dob)) return 'Please enter your date of birth.';
        if (isEmpty(formData.phone)) return 'Please enter your phone number.';
        if (isEmpty(formData.address)) return 'Please enter your home address.';
      }
      if (s === 2) {
        if (isEmpty(formData.nationality)) return 'Please enter your nationality.';
        if (isEmpty(formData.passportNumber)) return 'Please enter your passport number.';
        if (isEmpty(formData.passportExpiry)) return 'Please enter your passport expiry date.';
        const exp = new Date(formData.passportExpiry);
        if (!isNaN(exp.getTime()) && exp.getTime() < Date.now()) return 'Passport expiry date must be in the future.';
      }
      if (s === 3) {
        if (isEmpty(formData.courseId)) return 'Please select a course.';
      }
      if (s === 4) {
        if (!formData.consentTerms || !formData.consentPrivacy || !formData.consentDocumentCollection) {
          return 'Please accept Terms, Privacy Policy, and Document Consent before submitting.';
        }
      }
      return null;
  };

  const handleNext = () => {
      const err = validateStep(step);
      if (err) {
        setFormError(err);
        return;
      }
      setFormError(null);
      if (step < totalSteps) setStep(step + 1);
  };

  const handlePrev = () => {
      if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
      const err = validateStep(4);
      if (err) {
        setFormError(err);
        return;
      }
      setFormError(null);
      await submitApplication(formData);
  };

  const courses = t.courses.list;

  const StepIndicator = () => (
      <div className="flex items-center justify-between mb-8 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-madinah-green transition-all duration-500 -z-10" style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}></div>
          
          {[1, 2, 3, 4].map((num) => (
              <div key={num} className={`flex flex-col items-center gap-2 bg-white px-2`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-colors ${
                      step >= num ? 'bg-madinah-green border-madinah-green text-white' : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                      {step > num ? <Check className="w-5 h-5" /> : num}
                  </div>
                  <span className={`text-xs font-bold uppercase ${step >= num ? 'text-madinah-green' : 'text-gray-400'} hidden md:block`}>
                      {num === 1 ? 'Personal' : num === 2 ? 'Passport' : num === 3 ? 'Course' : 'Review'}
                  </span>
              </div>
          ))}
      </div>
  );

  return (
    <div className="min-h-screen bg-madinah-sand py-24 px-4 sm:px-6 lg:px-8" dir={dir}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
            <h1 className="text-3xl font-serif font-bold text-gray-900">Program Application</h1>
            <p className="text-gray-600 mt-2">Step {step} of {totalSteps}</p>
        </div>

        <StepIndicator />

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            {formError && (
                <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 text-red-800 text-sm font-medium" role="alert">
                    {formError}
                </div>
            )}
            
            {/* Step 1: Personal Info */}
            {step === 1 && (
                <div className="space-y-6 animate-fade-in">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 pb-4 border-b border-gray-100">
                        <User className="text-madinah-gold" /> Personal Information
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="application-full-name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input id="application-full-name" type="text" value={user?.name} disabled className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed" />
                        </div>
                        <div>
                            <label htmlFor="application-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input id="application-email" type="text" value={user?.email} disabled className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed" />
                        </div>
                        <div>
                            <label htmlFor="application-dob" className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                            <input
                                id="application-dob"
                                type="date"
                                value={formData.dob}
                                onChange={(e) => handleChange('dob', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-madinah-green outline-none"
                            />
                        </div>
                        <div>
                            <label htmlFor="application-phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input
                                id="application-phone"
                                type="tel"
                                placeholder="+1 234 567 890"
                                value={formData.phone}
                                onChange={(e) => handleChange('phone', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-madinah-green outline-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="application-address" className="block text-sm font-medium text-gray-700 mb-1">Home Address</label>
                        <textarea
                            id="application-address"
                            rows={3}
                            value={formData.address}
                            onChange={(e) => handleChange('address', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-madinah-green outline-none"
                            placeholder="Street, City, Country, Zip Code"
                        ></textarea>
                    </div>
                </div>
            )}

            {/* Step 2: Passport Info */}
            {step === 2 && (
                <div className="space-y-6 animate-fade-in">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 pb-4 border-b border-gray-100">
                        <ShieldCheck className="text-madinah-gold" /> Travel Document
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="application-nationality" className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                            <input
                                id="application-nationality"
                                type="text"
                                value={formData.nationality}
                                onChange={(e) => handleChange('nationality', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-madinah-green outline-none"
                            />
                        </div>
                        <div>
                            <label htmlFor="application-passport-number" className="block text-sm font-medium text-gray-700 mb-1">Passport Number</label>
                            <input
                                id="application-passport-number"
                                type="text"
                                value={formData.passportNumber}
                                onChange={(e) => handleChange('passportNumber', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-madinah-green outline-none"
                            />
                        </div>
                        <div>
                            <label htmlFor="application-passport-expiry" className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                            <input
                                id="application-passport-expiry"
                                type="date"
                                value={formData.passportExpiry}
                                onChange={(e) => handleChange('passportExpiry', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-madinah-green outline-none"
                            />
                        </div>
                        <div className="md:col-span-2">
                             <label className="block text-sm font-medium text-gray-700 mb-2">Visa Requirement</label>
                             <div className="flex gap-4">
                                <label className="flex items-center gap-2 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 flex-1">
                                    <input 
                                        type="radio" 
                                        name="visa"
                                        checked={formData.visaRequired === true}
                                        onChange={() => handleChange('visaRequired', true)}
                                        className="text-madinah-green focus:ring-madinah-green"
                                    />
                                    <span className="text-sm font-medium">I need a Student Visa</span>
                                </label>
                                <label className="flex items-center gap-2 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 flex-1">
                                    <input 
                                        type="radio" 
                                        name="visa"
                                        checked={formData.visaRequired === false}
                                        onChange={() => handleChange('visaRequired', false)}
                                        className="text-madinah-green focus:ring-madinah-green"
                                    />
                                    <span className="text-sm font-medium">I have a valid Visa / Residency</span>
                                </label>
                             </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Step 3: Course Selection */}
            {step === 3 && (
                <div className="space-y-6 animate-fade-in">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 pb-4 border-b border-gray-100">
                        <Calendar className="text-madinah-gold" /> Select Your Path
                    </h2>
                    
                    <div className="space-y-4">
                        {courses.map(course => (
                            <div 
                                key={course.id}
                                onClick={() => handleChange('courseId', course.id)}
                                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                    formData.courseId === course.id 
                                    ? 'border-madinah-green bg-madinah-green/5 ring-1 ring-madinah-green' 
                                    : 'border-gray-200 hover:border-madinah-gold'
                                }`}
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-gray-900">{course.title}</h3>
                                        <p className="text-sm text-gray-500">{course.duration} • {course.level}</p>
                                    </div>
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                        formData.courseId === course.id ? 'border-madinah-green bg-madinah-green text-white' : 'border-gray-300'
                                    }`}>
                                        {formData.courseId === course.id && <Check className="w-3 h-3" />}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4">
                         <label className="block text-sm font-medium text-gray-700 mb-2">Accommodation Preference</label>
                         <div className="grid grid-cols-2 gap-4">
                            <label className={`p-4 border-2 rounded-xl cursor-pointer text-center hover:bg-gray-50 ${formData.accommodationType === 'shared' ? 'border-madinah-gold bg-yellow-50/50' : 'border-gray-200'}`}>
                                <input type="radio" className="hidden" checked={formData.accommodationType === 'shared'} onChange={() => handleChange('accommodationType', 'shared')} />
                                <div className="font-bold text-gray-900">Shared Suite</div>
                                <div className="text-xs text-gray-500">2 Students per room</div>
                            </label>
                            <label className={`p-4 border-2 rounded-xl cursor-pointer text-center hover:bg-gray-50 ${formData.accommodationType === 'private' ? 'border-madinah-gold bg-yellow-50/50' : 'border-gray-200'}`}>
                                <input type="radio" className="hidden" checked={formData.accommodationType === 'private'} onChange={() => handleChange('accommodationType', 'private')} />
                                <div className="font-bold text-gray-900">Private Suite</div>
                                <div className="text-xs text-gray-500">Upgrade fee applies</div>
                            </label>
                         </div>
                    </div>
                </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
                <div className="space-y-6 animate-fade-in">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 pb-4 border-b border-gray-100">
                        <Check className="text-madinah-gold" /> Review & Submit
                    </h2>
                    
                    <div className="bg-gray-50 rounded-xl p-6 space-y-4 text-sm">
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-gray-500">Applicant</span>
                            <span className="font-bold text-gray-900">{user?.name}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-gray-500">Course</span>
                            <span className="font-bold text-gray-900">{courses.find(c => c.id === formData.courseId)?.title || 'Not Selected'}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-gray-500">Passport</span>
                            <span className="font-bold text-gray-900">{formData.passportNumber}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-gray-500">Visa Request</span>
                            <span className="font-bold text-gray-900">{formData.visaRequired ? 'Yes' : 'No'}</span>
                        </div>
                        <div className="flex justify-between pb-2">
                            <span className="text-gray-500">Accommodation</span>
                            <span className="font-bold text-gray-900 capitalize">{formData.accommodationType}</span>
                        </div>
                    </div>

                    
                    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
                        <div className="font-bold text-gray-900">Required Consents</div>

                        <label className="flex items-start gap-3 text-sm text-gray-700">
                            <input type="checkbox" className="mt-1" checked={!!formData.consentTerms} onChange={(e) => handleChange('consentTerms', e.target.checked)} />
                            <span>
                                I agree to the <button type="button" onClick={() => setCurrentView('LEGAL_TERMS')} className="text-madinah-green font-bold hover:underline">Terms of Service</button>.
                            </span>
                        </label>

                        <label className="flex items-start gap-3 text-sm text-gray-700">
                            <input type="checkbox" className="mt-1" checked={!!formData.consentPrivacy} onChange={(e) => handleChange('consentPrivacy', e.target.checked)} />
                            <span>
                                I agree to the <button type="button" onClick={() => setCurrentView('LEGAL_PRIVACY')} className="text-madinah-green font-bold hover:underline">Privacy Policy</button>.
                            </span>
                        </label>

                        <label className="flex items-start gap-3 text-sm text-gray-700">
                            <input type="checkbox" className="mt-1" checked={!!formData.consentDocumentCollection} onChange={(e) => handleChange('consentDocumentCollection', e.target.checked)} />
                            <span>
                                I consent to collecting and processing my passport/identity documents for application review and visa support. See <button type="button" onClick={() => setCurrentView('LEGAL_CONSENT')} className="text-madinah-green font-bold hover:underline">Document Consent</button>.
                            </span>
                        </label>

                        <label className="flex items-start gap-3 text-sm text-gray-700">
                            <input type="checkbox" className="mt-1" checked={!!formData.consentGDPR} onChange={(e) => handleChange('consentGDPR', e.target.checked)} />
                            <span>
                                If I am in the EU/EEA, I acknowledge the <button type="button" onClick={() => setCurrentView('LEGAL_GDPR')} className="text-madinah-green font-bold hover:underline">GDPR Notice</button>.
                            </span>
                        </label>
                    </div>


                    <div className="flex items-start gap-3 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm">
                        <ShieldCheck className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <p>
                            By submitting this application, you declare that all information provided is accurate. 
                            You agree to the institute's code of conduct while residing in the Holy City of Madinah.
                        </p>
                    </div>
                </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-10 pt-6 border-t border-gray-100">
                <button 
                    onClick={handlePrev}
                    disabled={step === 1}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-colors ${step === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                    <ChevronLeft className="w-4 h-4 rtl:rotate-180" /> Previous
                </button>
                
                {step < totalSteps ? (
                    <button 
                        onClick={handleNext}
                        className="flex items-center gap-2 px-8 py-3 bg-madinah-green text-white rounded-lg font-bold hover:bg-opacity-90 transition-colors"
                    >
                        Next Step <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                    </button>
                ) : (
                    <button 
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-8 py-3 bg-madinah-gold text-white rounded-lg font-bold hover:bg-yellow-600 transition-colors"
                    >
                        {isLoading ? 'Submitting...' : 'Submit Application'} <Check className="w-4 h-4" />
                    </button>
                )}
            </div>

        </div>
      </div>
    </div>
  );
};