# Email Templates (AR/EN/ID)

## Usage notes
- Supabase Auth templates: open `Auth -> Templates` in Supabase Dashboard and paste the **Confirmation** and **Recovery** templates.
- Placeholders for Supabase Auth:
  - Confirmation: `{{ .ConfirmationURL }}`, `{{ .SiteURL }}`, `{{ .Email }}`
  - Recovery: `{{ .ConfirmationURL }}`, `{{ .SiteURL }}`, `{{ .Email }}`
- Application status emails are manual admin templates. Replace:
  - `{{FULL_NAME}}`, `{{APPLICATION_ID}}`, `{{COURSE_NAME}}`, `{{PLAN_DAYS}}`, `{{NEXT_STEP}}`

---

## A) Supabase Auth — Confirmation

Subject (AR):
تأكيد التسجيل — معهد فصحى طيبة للغة العربية

Body (AR):
مرحبًا {{ .Email }},

شكرًا لتسجيلك في معهد فصحى طيبة للغة العربية. لتفعيل حسابك، يرجى الضغط على الرابط التالي:

CTA: تأكيد البريد الإلكتروني
{{ .ConfirmationURL }}

إذا لم تقم بإنشاء هذا الحساب، يمكنك تجاهل هذه الرسالة.

الدعم: admission.ftl@ptdima.sa
الموقع: {{ .SiteURL }}

---

Subject (EN):
Confirm your signup — Fo7ha Taibah Arabic Institute

Body (EN):
Hello {{ .Email }},

Thank you for signing up with Fo7ha Taibah Arabic Institute. To activate your account, please use the link below:

CTA: Confirm your email
{{ .ConfirmationURL }}

If you did not create this account, you can ignore this message.

Support: admission.ftl@ptdima.sa
Website: {{ .SiteURL }}

---

Subject (ID):
Konfirmasi pendaftaran — Fo7ha Taibah Arabic Institute

Body (ID):
Halo {{ .Email }},

Terima kasih telah mendaftar di Fo7ha Taibah Arabic Institute. Untuk mengaktifkan akun Anda, silakan gunakan tautan berikut:

CTA: Konfirmasi email Anda
{{ .ConfirmationURL }}

Jika Anda tidak membuat akun ini, Anda dapat mengabaikan pesan ini.

Dukungan: admission.ftl@ptdima.sa
Situs: {{ .SiteURL }}

---

## B) Supabase Auth — Recovery

Subject (AR):
إعادة تعيين كلمة المرور — معهد فصحى طيبة للغة العربية

Body (AR):
مرحبًا {{ .Email }},

تلقينا طلبًا لإعادة تعيين كلمة المرور لحسابك. لإكمال العملية، استخدم الرابط التالي:

CTA: إعادة تعيين كلمة المرور
{{ .ConfirmationURL }}

إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذه الرسالة.

الدعم: admission.ftl@ptdima.sa
الموقع: {{ .SiteURL }}

---

Subject (EN):
Reset your password — Fo7ha Taibah Arabic Institute

Body (EN):
Hello {{ .Email }},

We received a request to reset the password for your account. To continue, use the link below:

CTA: Reset your password
{{ .ConfirmationURL }}

If you did not request a password reset, you can ignore this message.

Support: admission.ftl@ptdima.sa
Website: {{ .SiteURL }}

---

Subject (ID):
Atur ulang kata sandi — Fo7ha Taibah Arabic Institute

Body (ID):
Halo {{ .Email }},

Kami menerima permintaan untuk mengatur ulang kata sandi akun Anda. Untuk melanjutkan, silakan gunakan tautan berikut:

CTA: Atur ulang kata sandi
{{ .ConfirmationURL }}

Jika Anda tidak meminta pengaturan ulang kata sandi, Anda dapat mengabaikan pesan ini.

Dukungan: admission.ftl@ptdima.sa
Situs: {{ .SiteURL }}

---

## C) Application Status — Submitted / Approved / Rejected (Manual)

### Submitted
Subject (AR):
تم استلام طلبك — معهد فصحى طيبة

Body (AR):
مرحبًا {{FULL_NAME}},

تم استلام طلبك بنجاح وسيتم مراجعته قريبًا.

رقم الطلب: {{APPLICATION_ID}}
الدورة: {{COURSE_NAME}}
مدة الخطة: {{PLAN_DAYS}} يوم

الخطوة التالية: {{NEXT_STEP}}

الدعم: admission.ftl@ptdima.sa
الموقع: https://ftl.ptdima.sa

Subject (EN):
Application received — Fo7ha Taibah Arabic Institute

Body (EN):
Hello {{FULL_NAME}},

We have received your application and will review it shortly.

Application ID: {{APPLICATION_ID}}
Course: {{COURSE_NAME}}
Plan duration: {{PLAN_DAYS}} days

Next step: {{NEXT_STEP}}

Support: admission.ftl@ptdima.sa
Website: https://ftl.ptdima.sa

Subject (ID):
Permohonan diterima — Fo7ha Taibah Arabic Institute

Body (ID):
Halo {{FULL_NAME}},

Kami telah menerima permohonan Anda dan akan meninjaunya segera.

ID aplikasi: {{APPLICATION_ID}}
Program: {{COURSE_NAME}}
Durasi paket: {{PLAN_DAYS}} hari

Langkah selanjutnya: {{NEXT_STEP}}

Dukungan: admission.ftl@ptdima.sa
Situs: https://ftl.ptdima.sa

---

### Approved
Subject (AR):
تمت الموافقة على طلبك — معهد فصحى طيبة

Body (AR):
مرحبًا {{FULL_NAME}},

يسعدنا إبلاغك بالموافقة على طلبك. يرجى استكمال الدفع عبر التحويل البنكي باستخدام التفاصيل التالية:

رقم الطلب: {{APPLICATION_ID}}
الدورة: {{COURSE_NAME}}
مدة الخطة: {{PLAN_DAYS}} يوم

حساب السعودية (SNB):
- اسم المستفيد: PT DIMA KHERAIZAH GROUP
- IBAN: SA7210000033000000502005
- SWIFT: NCBKSAJE
- البنك: Saudi National Bank (SNB)

حساب إندونيسيا (MANDIRI):
- اسم المستفيد: PT DIMA KHERAIZAH
- SWIFT: BMRIIDJA
- USD: 1670003550380
- Rp: 1670003550372
- البنك: MANDIRI

الخطوة التالية: {{NEXT_STEP}}

الدعم: admission.ftl@ptdima.sa
الموقع: https://ftl.ptdima.sa

Subject (EN):
Application approved — Fo7ha Taibah Arabic Institute

Body (EN):
Hello {{FULL_NAME}},

We are pleased to inform you that your application has been approved. Please complete payment via bank transfer using the details below:

Application ID: {{APPLICATION_ID}}
Course: {{COURSE_NAME}}
Plan duration: {{PLAN_DAYS}} days

Saudi account (SNB):
- Account holder: PT DIMA KHERAIZAH GROUP
- IBAN: SA7210000033000000502005
- SWIFT: NCBKSAJE
- Bank: Saudi National Bank (SNB)

Indonesia account (MANDIRI):
- Account holder: PT DIMA KHERAIZAH
- SWIFT: BMRIIDJA
- USD: 1670003550380
- Rp: 1670003550372
- Bank: MANDIRI

Next step: {{NEXT_STEP}}

Support: admission.ftl@ptdima.sa
Website: https://ftl.ptdima.sa

Subject (ID):
Permohonan disetujui — Fo7ha Taibah Arabic Institute

Body (ID):
Halo {{FULL_NAME}},

Kami dengan senang hati menginformasikan bahwa permohonan Anda telah disetujui. Silakan lakukan pembayaran melalui transfer bank dengan rincian berikut:

ID aplikasi: {{APPLICATION_ID}}
Program: {{COURSE_NAME}}
Durasi paket: {{PLAN_DAYS}} hari

Rekening Saudi (SNB):
- Nama pemilik: PT DIMA KHERAIZAH GROUP
- IBAN: SA7210000033000000502005
- SWIFT: NCBKSAJE
- Bank: Saudi National Bank (SNB)

Rekening Indonesia (MANDIRI):
- Nama pemilik: PT DIMA KHERAIZAH
- SWIFT: BMRIIDJA
- USD: 1670003550380
- Rp: 1670003550372
- Bank: MANDIRI

Langkah selanjutnya: {{NEXT_STEP}}

Dukungan: admission.ftl@ptdima.sa
Situs: https://ftl.ptdima.sa

---

### Rejected / Needs More Info
Subject (AR):
تحديث بخصوص طلبك — معهد فصحى طيبة

Body (AR):
مرحبًا {{FULL_NAME}},

شكرًا لتقديم طلبك. نحتاج إلى معلومات إضافية قبل إكمال المراجعة.

رقم الطلب: {{APPLICATION_ID}}
الدورة: {{COURSE_NAME}}
مدة الخطة: {{PLAN_DAYS}} يوم

الخطوة التالية: {{NEXT_STEP}}

الدعم: admission.ftl@ptdima.sa
الموقع: https://ftl.ptdima.sa

Subject (EN):
Update on your application — Fo7ha Taibah Arabic Institute

Body (EN):
Hello {{FULL_NAME}},

Thank you for your application. We need additional information before completing the review.

Application ID: {{APPLICATION_ID}}
Course: {{COURSE_NAME}}
Plan duration: {{PLAN_DAYS}} days

Next step: {{NEXT_STEP}}

Support: admission.ftl@ptdima.sa
Website: https://ftl.ptdima.sa

Subject (ID):
Pembaruan permohonan Anda — Fo7ha Taibah Arabic Institute

Body (ID):
Halo {{FULL_NAME}},

Terima kasih atas permohonan Anda. Kami membutuhkan informasi tambahan sebelum menyelesaikan peninjauan.

ID aplikasi: {{APPLICATION_ID}}
Program: {{COURSE_NAME}}
Durasi paket: {{PLAN_DAYS}} hari

Langkah selanjutnya: {{NEXT_STEP}}

Dukungan: admission.ftl@ptdima.sa
Situs: https://ftl.ptdima.sa
