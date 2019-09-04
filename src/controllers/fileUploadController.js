const fs = require('fs');
const path = require('path');

const utilFunctions = require('../utils');
const FileUpload = require('../models/fileUpload');
const sendEmail = require('../config/smtpConfig');
const fileUploadController = {};

fileUploadController.fileUploadForm = function(req, res) {
	res.status(200).render('index');
};

fileUploadController.getFile = async function(req, res, next) {
	const fileUuid = req.params.uuid;

	if (!fileUuid) {
		res.status(400).send({
			requested_url: utilFunctions.getRequestUrl(req),
			status: res.statusCode,
			message: 'File cannot be downloaded',
		});
	} else {
		try {
			pseudoFile = await FileUpload.findOne({ fileUuid: fileUuid });
		} catch (error) {
			return next(error);
		}

		if (pseudoFile === null) {
			res.status(404).send({
				requested_url: utilFunctions.getRequestUrl(req),
				status: res.statusCode,
				message: 'File does not exist',
			});
		} else {
			const fileName = pseudoFile.fileName;
			const originalFileName = pseudoFile.originalFileName;
			const filePath = path.join('files', fileName);
			const fileStream = fs.createReadStream(filePath);
			res.setHeader(
				'Content-Disposition',
				'attachment; filename="' + originalFileName + '"'
			);
			res.status(200);
			fileStream.pipe(res);
		}
	}
};

fileUploadController.postFile = async function(req, res, next) {
	const uploadedFile = req.file;
	const emailId = req.body.email;
	var pseudoFile;

	if (!uploadedFile) {
		res.status(400).send({
			requested_url: utilFunctions.getRequestUrl(req),
			status: res.statusCode,
			message: `No file provided`,
		});
	} else if (!emailId) {
		res.status(400).send({
			requested_url: utilFunctions.getRequestUrl(req),
			status: res.statusCode,
			message: `No email provided`,
		});
	} else if (!emailId && !uploadedFile) {
		res.status(400).send({
			requested_url: utilFunctions.getRequestUrl(req),
			status: res.statusCode,
			message: `Neither email nor file provided`,
		});
	} else {
		try {
			pseudoFile = await FileUpload.create({
				originalFileName: uploadedFile.originalname,
				fileName: uploadedFile.filename,
				fileUuid: utilFunctions.randomUuid(),
				emailId: emailId,
			});
		} catch (error) {
			return next(error);
		}

		await sendEmail(
			emailId,
			`http://localhost:3000/file_upload/get_file/${pseudoFile.fileUuid}`
		);

		res.status(201).send({
			requested_url: utilFunctions.getRequestUrl(req),
			status: res.statusCode,
			message: `File ${uploadedFile.originalname} uploaded successfully. Check your email to download the file.`,
		});
	}
};

module.exports = fileUploadController;
