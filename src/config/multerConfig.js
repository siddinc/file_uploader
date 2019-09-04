const multer = require('multer');

const multerConfig = {};
const allowedMimeTypes = [
	'image/png',
	'image/jpg',
	'image/jpeg',
	'application/pdf',
	'application/msword',
	'text/plain',
];

multerConfig.fileStorage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, 'files');
	},
	filename: function(req, file, cb) {
		cb(null, `${Date.now()}-${file.originalname}`);
	},
});

multerConfig.fileFilter = function(req, file, cb) {
	if (allowedMimeTypes.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

multerConfig.limits = {
	fileSize: 500 * 1024, //500kb
};

module.exports = multerConfig;
