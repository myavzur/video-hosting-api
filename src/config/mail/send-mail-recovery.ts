import { sendMail } from "./send-mail";

export const sendMailRecovery = async (to: string, link: string) => {
	return await sendMail({
		to,
		subject: "Password Recovery 🔒",
		html: `<b>You have requested password recovery.</b> <a href=${link}>Jump to recovery page!</a>`
	});
};
