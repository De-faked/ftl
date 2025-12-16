import React, { useState, useEffect } from 'react';
import { X, User, Mail, Lock, Loader2, ArrowLeft, CheckCircle, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

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

  const { login, signup, requestPasswordReset, isLoading, supportsWebCrypto } = useAuth();
  const { dir, isRTL } = useLanguage();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const signupUnsupported = authMode === 'signup' && !supportsWebCrypto;

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
    if (authMode === 'signup' && !supportsWebCrypto)
      return "Signup isn’t supported on this browser. Please update your browser or use Chrome/Safari latest.";
    if (authMode === 'signup' && name.trim().length < 3) return "Name must be at least 3 characters.";
    if (!email.includes('@')) return "Please enter a valid email address.";
    if (authMode !== 'forgot' && password.length < 6) return "Password must be at least 6 characters.";
    return null;
  };

  const triggerShake = () => {
      setShake(true);
      setTimeout(() => setShake(false), 400);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

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
        setError(err.message || "An unexpected error occurred.");
        triggerShake();
    }
  };

  const getTitle = () => {
      if (authMode === 'forgot') return 'Reset Password';
      return authMode === 'login' ? 'Welcome Back' : 'Join Institute';
  };

  const getSubtitle = () => {
      if (authMode === 'forgot') return 'Enter your email to receive a reset link';
      return authMode === 'login' ? 'Access your student portal' : 'Start your Arabic learning journey';
  };

  const getPasswordStrength = () => {
      if (password.length === 0) return { label: '', color: '' };
      if (password.length < 6) return { label: 'Weak', color: 'text-red-500' };
      if (password.length < 10) return { label: 'Medium', color: 'text-yellow-600' };
      return { label: 'Strong', color: 'text-green-600' };
  };

  const strength = getPasswordStrength();

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
        className={`bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up ${shake ? 'animate-shake' : ''}`} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
            <div className="bg-madinah-green p-6 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
                {authMode === 'forgot' && !resetSent && (
                    <button
                        onClick={() => { setAuthMode('login'); setError(""); }}
                        disabled={isLoading}
                        className="hover:bg-white/10 p-1 rounded-full transition-colors disabled:opacity-50"
                        aria-label="Return to login"
                        title="Return to login"
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
                className="hover:bg-white/10 p-2 rounded-full transition-colors disabled:opacity-50"
                aria-label="Close authentication modal"
                title="Close authentication modal"
            >
                <X className="w-6 h-6" />
            </button>
        </div>

        {/* Content */}
        <div className="p-8">
            {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-sm text-red-600 animate-fade-in">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

            {signupUnsupported && (
                <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2 text-sm text-yellow-800 animate-fade-in">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>
                        Signup isn’t supported on this browser. Please update your browser or use Chrome/Safari latest.
                    </span>
                </div>
            )}

            {authMode === 'forgot' && resetSent ? (
                <div className="text-center py-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Check your inbox</h4>
                    <p className="text-gray-600 mb-6">
                        If an account exists for <span className="font-bold">{email}</span>, we have sent a password reset link.
                    </p>
                    <button 
                        onClick={() => { setAuthMode('login'); setResetSent(false); setError(""); }}
                        className="text-madinah-green font-bold hover:underline"
                    >
                        Back to Login
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    {authMode === 'signup' && (
                        <div className="space-y-1">
                            <label htmlFor="auth-full-name" className={`text-sm font-medium text-gray-700 block ${isRTL ? 'text-right' : 'text-left'}`}>Full Name</label>
                            <div className="relative">
                                <User className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                                <input
                                    id="auth-full-name"
                                    type="text"
                                    required={authMode === 'signup'}
                                    disabled={isLoading}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={`w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-madinah-gold focus:border-transparent outline-none disabled:opacity-50 disabled:bg-gray-100 ${isRTL ? 'pr-10 pl-10 text-right' : 'pl-10 pr-4 text-left'} ${error && name.trim().length < 3 && authMode === 'signup' ? 'border-red-300 bg-red-50' : ''}`}
                                    placeholder="e.g. Abdullah Smith"
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-1">
                        <label htmlFor="auth-email" className={`text-sm font-medium text-gray-700 block ${isRTL ? 'text-right' : 'text-left'}`}>Email Address</label>
                        <div className="relative">
                            <Mail className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                            <input
                                id="auth-email"
                                type="email"
                                required
                                disabled={isLoading}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-madinah-gold focus:border-transparent outline-none disabled:opacity-50 disabled:bg-gray-100 ${isRTL ? 'pr-10 pl-10 text-right' : 'pl-10 pr-4 text-left'} ${error && !email.includes('@') ? 'border-red-300 bg-red-50' : ''}`}
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>

                    {authMode !== 'forgot' && (
                        <div className="space-y-1">
                            <div className="flex justify-between items-center">
                                <label htmlFor="auth-password" className="text-sm font-medium text-gray-700">Password</label>
                                {authMode === 'login' && (
                                    <button
                                        type="button"
                                        disabled={isLoading}
                                        onClick={() => { setAuthMode('forgot'); setError(""); }}
                                        className="text-xs font-bold text-madinah-gold hover:text-yellow-700 disabled:opacity-50"
                                    >
                                        Forgot Password?
                                    </button>
                                )}
                            </div>
                            <div className="relative">
                                <Lock className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                                <input
                                    id="auth-password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    disabled={isLoading}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-madinah-gold focus:border-transparent outline-none disabled:opacity-50 disabled:bg-gray-100 ${isRTL ? 'pr-10 pl-10 text-right' : 'pl-10 pr-10 text-left'} ${error && password.length < 6 ? 'border-red-300 bg-red-50' : ''}`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className={`absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 ${isRTL ? 'left-3' : 'right-3'}`}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    title={showPassword ? 'Hide password' : 'Show password'}
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
                        disabled={isLoading || signupUnsupported}
                        className="w-full bg-madinah-gold text-white font-bold py-3 rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2 mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                        {authMode === 'login' ? 'Login' : authMode === 'signup' ? 'Create Account' : 'Send Reset Link'}
                    </button>
                </form>
            )}

            {!resetSent && (
                <div className="mt-6 text-center text-sm text-gray-600">
                    {authMode === 'login' ? (
                        <>
                            Don't have an account?{' '}
                            <button 
                                type="button"
                                disabled={isLoading}
                                onClick={() => { setAuthMode('signup'); setError(""); }}
                                className="text-madinah-green font-bold hover:underline disabled:opacity-50"
                            >
                                Sign Up
                            </button>
                        </>
                    ) : authMode === 'signup' ? (
                        <>
                            Already have an account?{' '}
                            <button 
                                type="button"
                                disabled={isLoading}
                                onClick={() => { setAuthMode('login'); setError(""); }}
                                className="text-madinah-green font-bold hover:underline disabled:opacity-50"
                            >
                                Login
                            </button>
                        </>
                    ) : (
                        <button 
                            type="button"
                            disabled={isLoading}
                            onClick={() => { setAuthMode('login'); setError(""); }}
                            className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};