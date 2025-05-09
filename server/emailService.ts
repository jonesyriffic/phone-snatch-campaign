import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string | string[];
  cc?: string | string[];
  subject: string;
  text: string;
  html?: string;
  from: string;
  replyTo?: string;
}

// Create a transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.mailtrap.io', // Fallback to mailtrap for development
  port: parseInt(process.env.SMTP_PORT || '2525'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const mailOptions = {
      from: options.from,
      to: options.to,
      cc: options.cc,
      subject: options.subject,
      text: options.text,
      html: options.html,
      replyTo: options.replyTo
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error(`Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
