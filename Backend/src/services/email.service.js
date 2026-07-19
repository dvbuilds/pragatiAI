

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

export const sendMail = async ({ to, subject, text, html }) => {
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.SMTP_FROM_NAME || 'CivicPulse AI';

  if (!process.env.BREVO_API_KEY) {
    throw new Error('BREVO_API_KEY is not set');
  }
  if (!senderEmail) {
    throw new Error('BREVO_SENDER_EMAIL is not set');
  }

  const response = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'api-key': process.env.BREVO_API_KEY,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: [{ email: to }],
      subject,
      htmlContent: html || `<pre style="font-family: inherit; white-space: pre-wrap;">${text}</pre>`,
      textContent: text,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    // Surface Brevo's actual error (invalid recipient, quota exceeded, etc.)
    // instead of a generic failure, same as the old SMTP error propagation.
    throw new Error(data.message || `Brevo send failed with status ${response.status}`);
  }

  // Shape mirrors Nodemailer's `info` object closely enough for anything
  // downstream that logs/inspects it (messageId being the notable field).
  return { messageId: data.messageId, ...data };
};

export default { sendMail };