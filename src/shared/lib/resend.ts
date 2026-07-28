import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

// Resend's shared test sender — only delivers to the email address on the
// Resend account itself until a real domain is verified in the dashboard.
export const EMAIL_FROM = "CashControl <onboarding@resend.dev>";

// FLAG: flip to true once a custom domain is verified at resend.com/domains
// and EMAIL_FROM above is updated to use it. Until then, sending to anyone
// but the Resend account's own email fails silently (sandbox restriction),
// so invite emails are skipped rather than attempted.
export const EMAIL_SENDING_ENABLED = false;
