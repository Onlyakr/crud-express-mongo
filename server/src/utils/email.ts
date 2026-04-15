import nodemailer from "nodemailer";
import env from "../config/env.js";

export default async function sendEmail(
	to: string,
	subject: string,
	html: string,
) {
	const transporter = nodemailer.createTransport({
		host: env.SMTP_HOST,
		port: env.SMTP_PORT,
		secure: env.NODE_ENV === "production",
		auth: {
			user: env.SMTP_USER,
			pass: env.SMTP_PASS,
		},
	});

	await transporter.sendMail({
		from: env.EMAIL_FROM,
		to,
		subject,
		html,
	});
}
