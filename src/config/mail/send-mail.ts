import * as nodemailer from "nodemailer";

interface SendMailParams {
	to: string;
	html: string;
	subject: string;
}

export const sendMail = async ({ to, html, subject }: SendMailParams) => {
	const transporter = nodemailer.createTransport({
		host: process.env.SMTP_HOST,
		port: Number(process.env.SMTP_PORT),
		secure: true, // True for 465, false for other ports
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASSWORD
		}
	});

	await transporter.sendMail({
		from: `"VideosHub 🐬" <${process.env.SMTP_USER}>`,
		to,
		subject,
		text: "Text key",
		html
	});

	console.log("\x1b[44m%s\x1b[0m", `Message has been sent to ${to}! 📰 `);
};
