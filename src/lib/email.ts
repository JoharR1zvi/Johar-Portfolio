import 'server-only';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Notifies the site owner about a new contact form message. Uses Resend's
 * shared `onboarding@resend.dev` sender rather than a verified custom
 * domain — no domain exists yet for this project (see `docs/DECISIONS.md`).
 * Reply-to is the visitor's own address so a reply from the inbox goes
 * straight back to them. Never throws: an email-delivery failure shouldn't
 * fail the contact form submission itself, since the message is already
 * safely stored in `contact_submissions` by the time this runs.
 */
export async function sendContactNotification({
  to,
  fromName,
  fromEmail,
  message,
}: {
  to: string;
  fromName: string;
  fromEmail: string;
  message: string;
}): Promise<void> {
  try {
    await resend.emails.send({
      from: 'Portfolio Contact Form <onboarding@resend.dev>',
      to,
      replyTo: fromEmail,
      subject: `New portfolio message from ${fromName}`,
      text: `From: ${fromName} <${fromEmail}>\n\n${message}`,
    });
  } catch (error) {
    console.error('Failed to send contact notification email:', error);
  }
}
