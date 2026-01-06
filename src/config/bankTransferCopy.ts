type Language = 'ar' | 'en' | 'id';

type Labels = {
  bankName: string;
  accountHolder: string;
  iban: string;
  swift: string;
};

export type BankTransferCopy = {
  paymentsDisabled: string;
  bankTransferTitle: string;
  bankTransferIntro: string;
  bankTransferReferenceHint: string;
  labels: Labels;
};

const COPY: Record<Language, BankTransferCopy> = {
  ar: {
    paymentsDisabled: 'تم تعطيل الدفع الإلكتروني مؤقتًا. يرجى استخدام التحويل البنكي.',
    bankTransferTitle: 'التحويل البنكي',
    bankTransferIntro: 'يرجى تحويل المبلغ المطلوب بدقة باستخدام أحد الحسابات البنكية أدناه.',
    bankTransferReferenceHint: 'في خانة الملاحظة/المرجع، اكتب بريدك الإلكتروني أو رقم الطلب حتى نطابق التحويل.',
    labels: { bankName: 'البنك', accountHolder: 'اسم المستفيد', iban: 'رقم الآيبان', swift: 'سويفت' },
  },
  en: {
    paymentsDisabled: 'Online payments are temporarily disabled. Please use bank transfer.',
    bankTransferTitle: 'Bank Transfer',
    bankTransferIntro: 'Please transfer the exact amount using one of the bank accounts below.',
    bankTransferReferenceHint: 'In the transfer note/reference, write your email or application ID so we can match it.',
    labels: { bankName: 'Bank', accountHolder: 'Account holder', iban: 'IBAN', swift: 'SWIFT' },
  },
  id: {
    paymentsDisabled: 'Pembayaran online dinonaktifkan sementara. Silakan gunakan transfer bank.',
    bankTransferTitle: 'Transfer Bank',
    bankTransferIntro: 'Silakan transfer jumlah yang tepat menggunakan salah satu rekening bank di bawah ini.',
    bankTransferReferenceHint: 'Pada catatan/referensi transfer, tulis email atau ID aplikasi Anda agar kami dapat mencocokkannya.',
    labels: { bankName: 'Bank', accountHolder: 'Nama pemilik rekening', iban: 'IBAN', swift: 'SWIFT' },
  },
};

export function getBankTransferCopy(lang: string): BankTransferCopy {
  const k = (lang as Language);
  return (COPY[k] ?? COPY.en);
}
