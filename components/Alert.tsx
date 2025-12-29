import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export type AlertVariant = 'error' | 'warning' | 'success' | 'info';

const variantStyles: Record<AlertVariant, string> = {
  error: 'border-red-200 bg-red-50 text-red-800',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
  success: 'border-green-200 bg-green-50 text-green-800',
  info: 'border-gray-200 bg-gray-50 text-gray-800',
};

export const Alert: React.FC<{
  variant: AlertVariant;
  className?: string;
  role?: 'alert' | 'status';
  children: React.ReactNode;
}> = ({ variant, className, role, children }) => {
  const { t } = useLanguage();
  const label = t.common.alerts[variant];
  const resolvedRole = role ?? (variant === 'error' || variant === 'warning' ? 'alert' : 'status');
  const ariaLive = resolvedRole === 'alert' ? 'assertive' : 'polite';

  return (
    <div
      className={`rounded-lg border px-4 py-3 text-sm ${variantStyles[variant]} ${className ?? ''}`.trim()}
      role={resolvedRole}
      aria-live={ariaLive}
    >
      <div className="flex items-start gap-2">
        <span className="font-semibold whitespace-nowrap">
          {label}
          {t.common.alerts.separator}
        </span>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};
