

const multerFilter = (req, file, callback) => {
    if (file.originalname.match(/\.jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
        callback(null, true);
    } else {
        req.fileValidationError = 'Only image files allowed';
        callback(new Error('Only image files allowed'), flase);
    }
};

exports.multerFilter = multerFilter;



// const upload = multer ({
//     storage: storage,
//     fileFilter: multerFilter
// });

// exports.uploadPhoto = upload.single('photo');