export type PaymentMode = 'paytabs' | 'bank_transfer';

/**
 * Cloudflare Pages env:
 *   VITE_PAYMENT_MODE=paytabs | bank_transfer
 * Default is bank_transfer (safe).
 */
export const PAYMENT_MODE: PaymentMode =
  (import.meta.env.VITE_PAYMENT_MODE as PaymentMode) ?? 'bank_transfer';

export const BASE_CURRENCY = 'USD' as const;

export type BankAccount = {
  label: string;
  bankName: string;
  accountHolder: string;
  iban?: string;
  swift?: string;
  note?: string;
};

export const BANK_ACCOUNTS: BankAccount[] = [
  {
    label: 'Bank 1',
    bankName: 'REPLACE_ME',
    accountHolder: 'Fo7ha Taibah Arabic Institute',
    iban: 'REPLACE_ME',
    swift: 'REPLACE_ME',
    note: '',
  },
  {
    label: 'Bank 2',
    bankName: 'REPLACE_ME',
    accountHolder: 'Fo7ha Taibah Arabic Institute',
    iban: 'REPLACE_ME',
    swift: 'REPLACE_ME',
    note: '',
  },
];
