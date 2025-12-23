import React, { useState, useEffect } from 'react';
import { X, User, Mail, Lock, Loader2, ArrowLeft, CheckCircle, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Bdi } from './Bdi';
import { getAuthErrorMessage } from '../src/utils/authError';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'login' | 'signup' | 'forgot';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [resetSent, setResetSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  
  const { login, signup, requestPasswordReset, isLoading, webCryptoSupported } = useAuth();
  const { dir, isRTL, t } = useLanguage();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isSignupSupported = webCryptoSupported;

  const signupUnavailable = authMode === 'signup' && !isSignupSupported;
  const inputsDisabled = isLoading || signupUnavailable;

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setError("");
      setShake(false);
      setResetSent(false);
      setAuthMode('login');
      setName('');
      setEmail('');
      setPassword('');
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isOpen && !isLoading) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, isLoading, onClose]);

  const validate = () => {
    if (authMode === 'signup' && name.trim().length < 3) return t.auth.modal.validation.nameMin;
    if (!email.includes('@')) return t.auth.modal.validation.invalidEmail;
    if (authMode !== 'forgot' && password.length < 6) return t.auth.modal.validation.passwordMin;
    return null;
  };

  const triggerShake = () => {
      setShake(true);
      setTimeout(() => setShake(false), 400);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (authMode === 'signup' && !isSignupSupported) {
        setError(t.auth.signupUnsupported);
        triggerShake();
        return;
    }

    const validationError = validate();
    if (validationError) {
        setError(validationError);
        triggerShake();
        return;
    }

    try {
        if (authMode === 'login') {
            await login(email, password);
            onClose();
        } else if (authMode === 'signup') {
            await signup(name, email, password);
            onClose();
        } else if (authMode === 'forgot') {
            await requestPasswordReset(email);
            setResetSent(true);
        }
    } catch (err: any) {
        setError(getAuthErrorMessage(err, t));
        triggerShake();
    }
  };

  const getTitle = () => {
      if (authMode === 'forgot') return t.auth.modal.titles.forgot;
      return authMode === 'login' ? t.auth.modal.titles.login : t.auth.modal.titles.signup;
  };

  const getSubtitle = () => {
      if (authMode === 'forgot') return t.auth.modal.subtitles.forgot;
      return authMode === 'login' ? t.auth.modal.subtitles.login : t.auth.modal.subtitles.signup;
  };

  const getPasswordStrength = () => {
      if (password.length === 0) return { label: '', color: '' };
      if (password.length < 6) return { label: t.auth.modal.passwordStrength.weak, color: 'text-red-500' };
      if (password.length < 10) return { label: t.auth.modal.passwordStrength.medium, color: 'text-yellow-600' };
      return { label: t.auth.modal.passwordStrength.strong, color: 'text-green-600' };
  };

  const strength = getPasswordStrength();
  const [resetBefore, resetAfter] = t.auth.modal.resetSentMessage.split('{email}');

  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity duration-300" 
        dir={dir}
        onClick={(e) => {
            if (e.target === e.currentTarget && !isLoading) onClose();
        }}
    >
      <div 
        className={`bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-fade-in-up ${shake ? 'animate-shake' : ''}`} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
            <div className="bg-madinah-green p-6 flex justify-between items-center text-white relative">
            <div className="flex items-center gap-3">
                {authMode === 'forgot' && !resetSent && (
                    <button
                        onClick={() => { setAuthMode('login'); setError(""); }}
                        disabled={isLoading}
                        className="hover:bg-white/10 p-1 rounded-full transition-colors disabled:opacity-50 min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/80 focus-visible:ring-offset-madinah-green"
                        aria-label={t.auth.modal.actions.returnToLogin}
                        title={t.auth.modal.actions.returnToLogin}
                    >
                        <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
                    </button>
                )}
                <div>
                    <h3 className="text-xl font-serif font-bold">{getTitle()}</h3>
                    <p className="text-madinah-light text-sm opacity-80">
                        {getSubtitle()}
                    </p>
                </div>
            </div>
            <button
                onClick={onClose}
                disabled={isLoading}
                className="hover:bg-white/10 w-11 h-11 rounded-full transition-colors disabled:opacity-50 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/80 focus-visible:ring-offset-madinah-green absolute top-2 right-2 rtl:right-auto rtl:left-2"
                aria-label={t.auth.modal.actions.close}
                title={t.auth.modal.actions.close}
            >
                <X className="w-6 h-6" />
            </button>
        </div>

        {/* Content */}
        <div className="p-8">
            {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-sm text-red-600 animate-fade-in">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span><Bdi>{error}</Bdi></span>
                </div>
            )}

            {authMode === 'signup' && !isSignupSupported && (
                <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2 text-sm text-yellow-800 animate-fade-in">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-2 w-full">
                        <span>{t.auth.signupUnsupported}</span>
                        <a
                            className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-madinah-gold rounded-lg hover:bg-yellow-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-madinah-gold"
                            href="https://www.google.com/chrome/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            {t.auth.signupCta}
                        </a>
                    </div>
                </div>
            )}

            {authMode === 'forgot' && resetSent ? (
                <div className="text-center py-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{t.auth.modal.resetSentTitle}</h4>
                    <p className="text-gray-600 mb-6">
                        {resetBefore}
                        <Bdi>{email}</Bdi>
                        {resetAfter ?? ''}
                    </p>
                    <button 
                        onClick={() => { setAuthMode('login'); setResetSent(false); setError(""); }}
                        className="text-madinah-green font-bold hover:underline"
                    >
                        {t.auth.modal.actions.backToLogin}
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    {authMode === 'signup' && (
                        <div className="space-y-1">
                            <label htmlFor="auth-full-name" className={`text-sm font-medium text-gray-700 block ${isRTL ? 'text-right' : 'text-left'}`}>{t.auth.modal.labels.fullName}</label>
                            <div className="relative">
                                <User className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                                <input
                                    id="auth-full-name"
                                    type="text"
                                    required={authMode === 'signup'}
                                    disabled={inputsDisabled}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={`w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-madinah-gold focus:border-transparent outline-none disabled:opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed ${isRTL ? 'pr-10 pl-10 text-right' : 'pl-10 pr-4 text-left'} ${error && name.trim().length < 3 && authMode === 'signup' ? 'border-red-300 bg-red-50' : ''}`}
                                    placeholder={t.auth.modal.placeholders.fullName}
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-1">
                        <label htmlFor="auth-email" className={`text-sm font-medium text-gray-700 block ${isRTL ? 'text-right' : 'text-left'}`}>{t.auth.modal.labels.email}</label>
                        <div className="relative">
                            <Mail className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                            <input
                                id="auth-email"
                                type="email"
                                inputMode="email"
                                dir="ltr"
                                required
                                disabled={inputsDisabled}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-madinah-gold focus:border-transparent outline-none disabled:opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed ${isRTL ? 'pr-10 pl-10' : 'pl-10 pr-4'} ${error && !email.includes('@') ? 'border-red-300 bg-red-50' : ''} text-left`}
                                placeholder={t.auth.modal.placeholders.email}
                            />
                        </div>
                    </div>

                    {authMode !== 'forgot' && (
                        <div className="space-y-1">
                            <div className="flex justify-between items-center">
                                <label htmlFor="auth-password" className="text-sm font-medium text-gray-700">{t.auth.modal.labels.password}</label>
                                {authMode === 'login' && (
                                    <button
                                        type="button"
                                        disabled={isLoading}
                                        onClick={() => { setAuthMode('forgot'); setError(""); }}
                                        className="text-xs font-bold text-madinah-gold hover:text-yellow-700 disabled:opacity-50"
                                    >
                                        {t.auth.modal.actions.forgotPassword}
                                    </button>
                                )}
                            </div>
                            <div className="relative">
                                <Lock className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                                <input
                                    id="auth-password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    disabled={inputsDisabled}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-madinah-gold focus:border-transparent outline-none disabled:opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed ${isRTL ? 'pr-10 pl-10 text-right' : 'pl-10 pr-10 text-left'} ${error && password.length < 6 ? 'border-red-300 bg-red-50' : ''}`}
                                    placeholder={t.auth.modal.placeholders.password}
                                />
                                <button
                                    type="button"
                                    disabled={inputsDisabled}
                                    onClick={() => setShowPassword(!showPassword)}
                                    className={`absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 ${isRTL ? 'left-3' : 'right-3'} ${inputsDisabled ? 'cursor-not-allowed opacity-60' : ''} min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-madinah-gold`}
                                    aria-label={showPassword ? t.auth.modal.actions.hidePassword : t.auth.modal.actions.showPassword}
                                    title={showPassword ? t.auth.modal.actions.hidePassword : t.auth.modal.actions.showPassword}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {authMode === 'signup' && (
                                <div className="mt-2 space-y-1">
                                    <div className="flex gap-1 h-1">
                                        <div className={`flex-1 rounded-full transition-colors ${password.length >= 1 ? 'bg-red-500' : 'bg-gray-200'}`}></div>
                                        <div className={`flex-1 rounded-full transition-colors ${password.length >= 6 ? 'bg-yellow-500' : 'bg-gray-200'}`}></div>
                                        <div className={`flex-1 rounded-full transition-colors ${password.length >= 10 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                                    </div>
                                    {password.length > 0 && (
                                        <p className={`text-xs text-right ${strength.color}`}>
                                            {strength.label}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading || signupUnavailable}
                        aria-disabled={isLoading || signupUnavailable}
                        className="w-full bg-madinah-gold text-white font-bold py-3 rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2 mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                        {authMode === 'login'
                          ? t.auth.modal.actions.login
                          : authMode === 'signup'
                            ? t.auth.modal.actions.signup
                            : t.auth.modal.actions.sendResetLink}
                    </button>
                </form>
            )}

            {!resetSent && (
                <div className="mt-6 text-center text-sm text-gray-600">
                    {authMode === 'login' ? (
                        <>
                            {t.auth.modal.footer.noAccount}{' '}
                            <button 
                                type="button"
                                disabled={isLoading}
                                onClick={() => { setAuthMode('signup'); setError(""); }}
                                className="text-madinah-green font-bold hover:underline disabled:opacity-50"
                            >
                                {t.auth.modal.footer.signUp}
                            </button>
                        </>
                    ) : authMode === 'signup' ? (
                        <>
                            {t.auth.modal.footer.haveAccount}{' '}
                            <button 
                                type="button"
                                disabled={isLoading}
                                onClick={() => { setAuthMode('login'); setError(""); }}
                                className="text-madinah-green font-bold hover:underline disabled:opacity-50"
                            >
                                {t.auth.modal.footer.signIn}
                            </button>
                        </>
                    ) : (
                        <button 
                            type="button"
                            disabled={isLoading}
                            onClick={() => { setAuthMode('login'); setError(""); }}
                            className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
                        >
                            {t.auth.modal.footer.cancel}
                        </button>
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
