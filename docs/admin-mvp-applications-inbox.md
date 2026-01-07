# Admin MVP: Applications Inbox

## Overview: Inbox workflow
- Admin receives new applications in a single Inbox list.
- Admin opens an application, reviews details, and decides to approve or reject.
- If approved, admin sends a payment link by copy/paste to WhatsApp or email.
- Admin can see whether payment link was sent and optionally whether payment was marked paid.

## Non-goals (must be hidden/removed from admin UI)
- UUID fields or any internal database IDs.
- Student CRUD screens or any student management actions.
- Payment amount input forms or payment configuration tools.
- Developer tools, debug panels, or raw database views.

## Required application fields (NO passport)
- Friendly Application ID (public).
- Full name.
- Nationality.
- Email.
- Phone.
- Course + option.
- Submitted timestamp.
- Updated timestamp.
- Admin notes.
- Rejection reason.

## Application ID rule
- Public human-friendly format: `FTL-APP-YYYY-######`.
- Counter resets per year and is zero padded.
- Admin sees only this ID; never internal UUIDs.
- ID must be unique and stable for the lifetime of the application.

## Status model (MVP)
- Use a derived admin-visible status to avoid breaking the existing lifecycle.
- Derived status rules (in this exact order):
  1) If rejected -> Rejected
  2) Else if `payment_paid_at` exists -> Paid (optional)
  3) Else if `payment_link` exists -> Payment Link Sent
  4) Else if approved -> Approved
  5) Else -> New
- Existing backend status may remain submitted/approved/rejected; admin status is derived.

## Legacy handling
- "Plan missing" must not appear in admin UI.
- If legacy applications lack course option or `planDays`, show a "Needs option" state.
- "Needs option" blocks approval until an option is assigned.

## Admin UI (MVP pages)
- Only one default page: Admin > Applications (Inbox).
- One details view (modal or page) opened via View.

## Inbox list spec
- Columns: Application ID, full name, nationality, phone (click), email (click), course + option, submitted date, status, actions.
- Filters:
  - Search (name/email/phone/Application ID).
  - Status dropdown (All/New/Approved/Rejected/Payment Link Sent/Paid).
- Action buttons are state-aware:
  - New: View / Approve / Reject.
  - Approved: View / Send payment link.
  - Payment Link Sent: View / Copy link / Resend / Mark paid (optional).
  - Paid: View.
  - Rejected: View / Reopen (optional).
- Protect destructive actions with confirmation.

## Details view spec
- Show Application ID prominently with a Copy button.
- Show contact info, course+option, and a simple status timeline.
- Payment link section:
  - Paste link (validate https).
  - Copy link.
  - Copy message.
  - Open WhatsApp with prefilled message.
- Message template must include Application ID and payment link.

## Data storage (MVP, minimal risk)
- Add `applications.public_id` for the friendly ID.
- Add a small admin-only table `application_payment_links`:
  - `application_id` (FK).
  - `payment_link`.
  - `payment_link_sent_at`.
  - `payment_paid_at` (optional).
  - Timestamps.
- RLS: admin-only; do not leak internal UUIDs in URLs or UI.

## Localization rules
- Arabic is source of truth.
- Support AR/EN/ID.
- No hardcoded UI strings.
- RTL/LTR compliance.

## Security checklist
- Admin-only routes.
- No internal IDs in UI or URLs.
- Payment secrets never in the browser.
- Treat payment links as sensitive data.

## Acceptance checklist
- [ ] Admin Inbox is the only default page.
- [ ] Application details open via View (modal or page).
- [ ] Admin sees only friendly Application ID, never UUIDs.
- [ ] Application ID format is `FTL-APP-YYYY-######`, unique and stable.
- [ ] Required fields displayed: friendly ID, name, nationality, email, phone, course + option, timestamps, admin notes, rejection reason.
- [ ] No passport fields shown anywhere.
- [ ] No student CRUD in admin UI.
- [ ] No payment amount forms or payment configuration tools in admin UI.
- [ ] No dev tools or debug panels in admin UI.
- [ ] Derived status follows exact rule order (Rejected > Paid > Payment Link Sent > Approved > New).
- [ ] "Plan missing" never appears in admin UI.
- [ ] Legacy missing option/planDays shows "Needs option" and blocks approval.
- [ ] Inbox columns match spec.
- [ ] Inbox filters match spec.
- [ ] State-aware actions match spec.
- [ ] Destructive actions require confirmation.
- [ ] Details view shows Application ID with Copy button.
- [ ] Details view shows contact info, course+option, and status timeline.
- [ ] Payment link section validates https and supports Copy link, Copy message, and Open WhatsApp.
- [ ] Message template includes Application ID and payment link.
- [ ] `applications.public_id` exists.
- [ ] `application_payment_links` table exists with required fields.
- [ ] RLS restricts admin-only access; internal UUIDs not exposed.
- [ ] Arabic is source of truth; AR/EN/ID supported; RTL/LTR compliance.
- [ ] Admin routes are protected.
- [ ] Payment secrets never in browser; payment links treated as sensitive.
