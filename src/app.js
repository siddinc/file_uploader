const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const multerConfig = require('./config/multerConfig');
const fileUploadRoutes = require('./routes/fileUploadRoutes');
const PORT = process.env.PORT || 3000;
const DB_CONNECTION_URL = 'mongodb://localhost:27017/fileupload';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
	multer({
		storage: multerConfig.fileStorage,
		fileFilter: multerConfig.fileFilter,
		limits: multerConfig.limits,
	}).single('file')
);

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.set('views', path.join(__dirname, 'views'));
app.set('files', path.join(__dirname, 'files'));
app.set('view engine', 'ejs');
app.set('json spaces', 2);

// file upload routes
app.use('/file_upload', fileUploadRoutes);

// error 404 route
app.use('*', function(req, res) {
	return res.status(404).send({
		status: res.statusCode,
		message: 'Page not found',
	});
});

// custom error handler
app.use(function(err, req, res, next) {
	return res.send({
		status: 500 || err.status,
		message: err.message,
		error: err,
	});
});

async function main() {
	try {
		await mongoose.connect(DB_CONNECTION_URL, { useNewUrlParser: true });
		console.log({ status: 'DB connection successful' });
	} catch (error) {
		return console.log({
			status: 'DB connection unsuccessful',
			error: error,
		});
	}

	app.listen(PORT, process.env.IP, function() {
		console.log({
			status: 'Server running',
			port: PORT,
		});
	});
}

if (typeof module !== 'undefined' && !module.parent) {
	main();
}
