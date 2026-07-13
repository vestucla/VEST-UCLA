import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

interface WelcomeEmailParams {
  to: string;
  firstName: string;
  lastName: string;
}

export async function sendWelcomeEmail({ to, firstName, lastName }: WelcomeEmailParams) {
  const loginUrl = process.env.NEXT_PUBLIC_BASE_URL 
    ? `${process.env.NEXT_PUBLIC_BASE_URL}/members/login`
    : "http://localhost:3000/members/login";

  const mailOptions = {
    from: `"VEST UCLA" <${process.env.GMAIL_USER}>`,
    to,
    subject: "Welcome to VEST UCLA!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a1a1a;">Welcome to VEST, ${firstName}!</h1>
        <p style="color: #444; font-size: 16px; line-height: 1.6;">
          Your VEST UCLA member account has been created. You can now sign in using your UCLA Google account.
        </p>
        <div style="margin: 30px 0;">
          <a href="${loginUrl}" 
             style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Sign In to VEST
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          Once signed in, you'll be able to complete your profile and connect with other VEST members.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
        <p style="color: #999; font-size: 12px;">
          VEST UCLA - Venture Education for Students in Technology
        </p>
      </div>
    `,
    text: `
Welcome to VEST, ${firstName}!

Your VEST UCLA member account has been created. You can now sign in using your UCLA Google account.

Sign in here: ${loginUrl}

Once signed in, you'll be able to complete your profile and connect with other VEST members.

- VEST UCLA
    `.trim(),
  };

  await transporter.sendMail(mailOptions);
}
