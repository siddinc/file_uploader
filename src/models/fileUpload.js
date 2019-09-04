const mongoose = require('mongoose');

const fileUploadSchema = new mongoose.Schema({
	originalFileName: {
		type: String,
		required: true,
	},
	fileName: {
		type: String,
		required: true,
	},
	fileUuid: {
		type: String,
		required: true,
	},
	emailId: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model('FileUpload', fileUploadSchema);
