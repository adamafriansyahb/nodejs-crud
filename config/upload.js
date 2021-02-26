const multer = require('multer');
const path = require('path');

const uploadConfig = (filePath) => {

    const uploadPath =  path.join('public', filePath);
    
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + file.originalname);
        }
    });

    const upload = multer({
        storage: storage,
        limits: {
            fileSize: 5 * 1024 * 1024
        }, 
        fileFilter: (req, file, cb) => {
            if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
                cb(null, true);
            } 
            else {
                cb(null, false);
            }
        }
    });

    return upload;

}

module.exports = uploadConfig;