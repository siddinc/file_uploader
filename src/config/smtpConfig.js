const nodemailer = require('nodemailer');

const utilFunctions = require('../utils');
const smtpTransporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	secure: true,
	port: 465,
	auth: {
		type: utilFunctions.smtpCredentials.type,
		user: utilFunctions.smtpCredentials.user,
		clientId: utilFunctions.smtpCredentials.clientId,
		clientSecret: utilFunctions.smtpCredentials.clientSecret,
		accessToken: utilFunctions.smtpCredentials.accessToken,
	},
});

async function sendEmail(toEmailId, fileDownloadLink) {
	let mailOptions = {
		from: utilFunctions.smtpCredentials.user,
		to: toEmailId,
		subject: 'File download link',
		html: `<a href=${fileDownloadLink}><h1>File download link</h1></a>`,
	};

	await smtpTransporter.sendMail(mailOptions, function(error, response) {
		if (error) {
			return next(error);
		} else {
			if (response.accepted.length !== 0) {
				console.log('Mail sent');
			}
		}
		smtpTransporter.close();
	});
}

module.exports = sendEmail;
