const fs = require('fs');
const multer = require('multer');
const path = require('path');

const uploadDir = path.join(__dirname, '..', '..', 'public', 'Payment_Screenshots');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + Date.now() + ext);
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // Limit file size to 10MB (adjust as needed)
    },
    fileFilter: (req, file, cb) => {
        // Check file type to allow only certain file extensions (e.g., images)
        if (file.mimetype.startsWith('image/')) {
            cb(null, true); // Accept the file
        } else {
            cb(new Error('Only images are allowed!'), false); // Reject the file
        }
    },
});

module.exports = { upload };
