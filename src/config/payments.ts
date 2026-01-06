export type PaymentMode = 'paytabs' | 'bank_transfer';

/**
 * TEMP: Payment gate disabled until finalization.
 * Switch back to 'paytabs' later.
 */
export const PAYMENT_MODE: PaymentMode =
  (import.meta.env.VITE_PAYMENT_MODE as PaymentMode) ?? 'bank_transfer';

export const BASE_CURRENCY = 'USD' as const;

export type BankAccount = {
  label: string;           // e.g. "Bank 1"
  bankName: string;
  accountHolder: string;
  iban?: string;
  swift?: string;
  accountNumber?: string;
  country?: string;
  notes?: string;
};

export const BANK_ACCOUNTS: BankAccount[] = [
  {
    label: 'Bank 1',
    bankName: 'REPLACE_ME',
    accountHolder: 'REPLACE_ME',
    iban: 'REPLACE_ME',
    swift: 'REPLACE_ME',
    accountNumber: 'REPLACE_ME',
    country: 'REPLACE_ME',
    notes: 'REPLACE_ME',
  },
  {
    label: 'Bank 2',
    bankName: 'REPLACE_ME',
    accountHolder: 'REPLACE_ME',
    iban: 'REPLACE_ME',
    swift: 'REPLACE_ME',
    accountNumber: 'REPLACE_ME',
    country: 'REPLACE_ME',
    notes: 'REPLACE_ME',
  },
];
