import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE !== 'false',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendMail = async ({ to, subject, text, html }) => {
  const info = await transporter.sendMail({
    from: `"${process.env.SMTP_FROM_NAME || 'CivicPulse AI'}" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
    html: html || `<pre style="font-family: inherit; white-space: pre-wrap;">${text}</pre>`,
  });
  return info;
};

export default { sendMail };
