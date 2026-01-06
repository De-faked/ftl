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
  iban?: string;   // also used for Account No when IBAN is not applicable
  swift?: string;
  note?: string;   // e.g. currency notes
};

export const BANK_ACCOUNTS: BankAccount[] = [
  {
    label: 'Saudi Arabia (SNB)',
    bankName: 'Saudi National Bank (SNB)',
    accountHolder: 'PT DIMA KHERAIZAH GROUP',
    iban: 'SA7210000033000000502005',
    swift: 'NCBKSAJE',
    note: '',
  },
  {
    label: 'Indonesia (Mandiri) — USD',
    bankName: 'MANDIRI',
    accountHolder: 'PT DIMA KHERAIZAH',
    iban: '1670003550380',
    swift: 'BMRIIDJA',
    note: 'US Dollar account',
  },
  {
    label: 'Indonesia (Mandiri) — IDR',
    bankName: 'MANDIRI',
    accountHolder: 'PT DIMA KHERAIZAH',
    iban: '1670003550372',
    swift: 'BMRIIDJA',
    note: 'Rupiah (IDR) account',
  },
];
