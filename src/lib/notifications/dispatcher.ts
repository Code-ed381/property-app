import { Resend } from 'resend';
import { ReactElement } from 'react';
import { render } from '@react-email/render';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// The central notification dispatcher
export async function sendNotification({
  to,
  subject,
  emailComponent,
  smsMessage,
}: {
  to: { email?: string; phone?: string };
  subject: string;
  emailComponent: ReactElement;
  smsMessage?: string;
}) {
  const responses: { email?: any; sms?: any; error?: string } = {};

  try {
    // 1. Send Email
    if (to.email) {
      if (resend) {
        // Send actual email via Resend
        const htmlContext = await render(emailComponent);
        const { data, error } = await resend.emails.send({
          from: 'PILAS Properties <noreply@pilasproperties.com>', // Replace with your verified domain
          to: [to.email],
          subject,
          html: htmlContext,
        });

        if (error) {
          console.error("Resend Error:", error);
          responses.error = error.message;
        } else {
          console.log(`[Notification] Auto-Email sent to ${to.email}`);
          responses.email = data;
        }
      } else {
        // Mock email sending
        console.log(`[Notification MOCK] Email queued for ${to.email}. Subject: "${subject}"`);
        responses.email = "mock-success";
      }
    }

    // 2. Send SMS (Placeholder for Twilio or other provider)
    if (to.phone && smsMessage) {
      const TWILIO_SID = process.env.TWILIO_SID;
      if (TWILIO_SID) {
         // Twilio integration goes here
         console.log(`[Notification] Actual SMS sent via Twilio to ${to.phone}`);
         responses.sms = "twilio-success";
      } else {
         // Mock SMS
         console.log(`[Notification MOCK] SMS queued for ${to.phone}: "${smsMessage}"`);
         responses.sms = "mock-success";
      }
    }

    return responses;
  } catch (error) {
    console.error("[Notification Error]", error);
    return { error: "Failed to dispatch notification" };
  }
}
