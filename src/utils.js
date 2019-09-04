const url = require('url');
const uuidv4 = require('uuid/v4');

const utilFunctions = {};

utilFunctions.getRequestUrl = function(req) {
	return url.format({
		protocol: req.protocol,
		host: req.get('host'),
		pathname: req.originalUrl,
	});
};

utilFunctions.smtpCredentials = {
	type: 'OAuth2',
	user: '<insert user email here>',
	clientId: '<insert client id here>',
	clientSecret: '<insert client secret here>',
	accessToken: '<insert access token here>',
};

utilFunctions.randomUuid = uuidv4;

module.exports = utilFunctions;
