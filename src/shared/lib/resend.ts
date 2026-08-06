import { Resend } from "resend";

// Resend's shared test sender — only delivers to the email address on the
// Resend account itself until a real domain is verified in the dashboard.
export const EMAIL_FROM = "Finkith <onboarding@resend.dev>";

// FLAG: flip to true once a custom domain is verified at resend.com/domains
// and EMAIL_FROM above is updated to use it. Until then, sending to anyone
// but the Resend account's own email fails silently (sandbox restriction),
// so invite emails are skipped rather than attempted.
export const EMAIL_SENDING_ENABLED = false;

let resendClient: Resend | undefined;

// Constructing Resend() throws immediately if RESEND_API_KEY is unset. Every
// server action in groups/api/actions.ts shares one module, so a top-level
// `new Resend(...)` there would crash createGroup/joinGroupByCode/etc. too —
// not just the email-sending action — the moment the key is missing in an
// environment. Building the client lazily, only when sending is enabled and
// actually attempted, keeps that failure scoped to email sending alone.
export function getResendClient() {
  resendClient ??= new Resend(process.env.RESEND_API_KEY);
  return resendClient;
}
