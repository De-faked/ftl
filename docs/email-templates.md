# Email Templates (Bilingual)

## Usage notes
- Supabase Auth templates: open `Auth -> Templates` in Supabase Dashboard and replace the subject/body for **Confirm signup** and **Reset password**.
- Confirmation and reset links typically use `{{ .ConfirmationURL }}`. If your template already uses a different placeholder, keep the existing URL structure and swap in that placeholder instead.
- Application status emails are manual admin templates. Replace the placeholders before sending:
  - `{{APPLICANT_NAME}}`, `{{APPLICATION_ID}}`, `{{COURSE_NAME}}`, `{{PLAN_SUMMARY}}`, `{{NEXT_STEP}}`

---

## 1) Confirm signup (Supabase Auth)
Subject:
معهد فصحى طيبة: تأكيد التسجيل

Body:
مرحبًا {{ .Email }},

شكرًا لتسجيلك في معهد فصحى طيبة للغة العربية. لتفعيل حسابك، اضغط على الرابط التالي:

CTA: تأكيد البريد الإلكتروني
{{ .ConfirmationURL }}

إذا لم تقم بإنشاء هذا الحساب، يمكنك تجاهل هذه الرسالة.

الدعم: admission.ftl@ptdima.sa
الموقع: https://ftl.ptdima.sa

---
Hello {{ .Email }},

Thank you for signing up with Fo7ha Taibah Arabic Institute. To activate your account, please use the link below:

CTA: Confirm your email
{{ .ConfirmationURL }}

If you did not create this account, you can ignore this message.

Support: admission.ftl@ptdima.sa
Website: https://ftl.ptdima.sa

---

## 2) Reset password (Supabase Auth)
Subject:
معهد فصحى طيبة: إعادة تعيين كلمة المرور

Body:
مرحبًا {{ .Email }},

تلقينا طلبًا لإعادة تعيين كلمة المرور لحسابك. لإكمال العملية، استخدم الرابط التالي:

CTA: إعادة تعيين كلمة المرور
{{ .ConfirmationURL }}

إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذه الرسالة.

الدعم: admission.ftl@ptdima.sa
الموقع: https://ftl.ptdima.sa

---
Hello {{ .Email }},

We received a request to reset the password for your account. To continue, use the link below:

CTA: Reset your password
{{ .ConfirmationURL }}

If you did not request a password reset, you can ignore this message.

Support: admission.ftl@ptdima.sa
Website: https://ftl.ptdima.sa

---

## 3) Application received (Admin)
Subject:
تم استلام طلبك — معهد فصحى طيبة

Body:
مرحبًا {{APPLICANT_NAME}},

نشكر لك تقديم طلب الالتحاق. تم استلام طلبك بنجاح وسنقوم بمراجعته قريبًا.

رقم الطلب: {{APPLICATION_ID}}
الدورة: {{COURSE_NAME}}
الباقة المختارة: {{PLAN_SUMMARY}}

الخطوة التالية: {{NEXT_STEP}}

الدعم: admission.ftl@ptdima.sa
الموقع: https://ftl.ptdima.sa

---
Hello {{APPLICANT_NAME}},

Thank you for your application. We have received it successfully and will review it shortly.

Application ID: {{APPLICATION_ID}}
Course: {{COURSE_NAME}}
Selected plan: {{PLAN_SUMMARY}}

Next step: {{NEXT_STEP}}

Support: admission.ftl@ptdima.sa
Website: https://ftl.ptdima.sa

---

## 4) Application approved (Admin)
Subject:
تمت الموافقة على طلبك — معهد فصحى طيبة

Body:
مرحبًا {{APPLICANT_NAME}},

يسعدنا إبلاغك بأن طلبك قد تمت الموافقة عليه.

رقم الطلب: {{APPLICATION_ID}}
الدورة: {{COURSE_NAME}}
الباقة المختارة: {{PLAN_SUMMARY}}

الخطوة التالية: {{NEXT_STEP}}

الدعم: admission.ftl@ptdima.sa
الموقع: https://ftl.ptdima.sa

---
Hello {{APPLICANT_NAME}},

We are pleased to inform you that your application has been approved.

Application ID: {{APPLICATION_ID}}
Course: {{COURSE_NAME}}
Selected plan: {{PLAN_SUMMARY}}

Next step: {{NEXT_STEP}}

Support: admission.ftl@ptdima.sa
Website: https://ftl.ptdima.sa

---

## 5) Application rejected / needs more info (Admin)
Subject:
تحديث بخصوص طلبك — معهد فصحى طيبة

Body:
مرحبًا {{APPLICANT_NAME}},

شكرًا لتقديم طلبك. نحتاج إلى معلومات إضافية قبل إكمال المراجعة.

رقم الطلب: {{APPLICATION_ID}}
الدورة: {{COURSE_NAME}}
الباقة المختارة: {{PLAN_SUMMARY}}

الخطوة التالية: {{NEXT_STEP}}

الدعم: admission.ftl@ptdima.sa
الموقع: https://ftl.ptdima.sa

---
Hello {{APPLICANT_NAME}},

Thank you for your application. We need additional information before completing the review.

Application ID: {{APPLICATION_ID}}
Course: {{COURSE_NAME}}
Selected plan: {{PLAN_SUMMARY}}

Next step: {{NEXT_STEP}}

Support: admission.ftl@ptdima.sa
Website: https://ftl.ptdima.sa
