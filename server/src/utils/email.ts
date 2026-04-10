import nodemailer from "nodemailer";

export default async function sendEmail(
  to: string,
  subject: string,
  html: string,
) {
  try {
    if (
      !process.env.SMTP_HOST ||
      !process.env.SMTP_PORT ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS ||
      !process.env.EMAIL_FROM
    ) {
      throw new Error("Email configuration is missing");
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.NODE_ENV === "production",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
  } catch (error) {
    throw new Error(
      `Failed to send email: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
