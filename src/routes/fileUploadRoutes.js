const express = require('express');
const router = express.Router();

const fileUploadController = require('../controllers/fileUploadController');

// route for file form get
router.get('/file_upload_form', fileUploadController.fileUploadForm);

// route for file get
router.get('/get_file/:uuid', fileUploadController.getFile);

// route for file post
router.post('/post_file', fileUploadController.postFile);

module.exports = router;
