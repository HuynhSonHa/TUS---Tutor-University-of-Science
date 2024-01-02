const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/'); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // File name with timestamp
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, callback) => {
      // Chỉ chấp nhận các file ảnh (định dạng: jpeg, jpg, png, gif)
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return callback(new Error("Chỉ chấp nhận file ảnh"));
      }
      callback(null, true);
  },
  limits: {
      // Giới hạn kích thước mỗi file là 5MB
      fileSize: 5 * 1024 * 1024,
  },
});

module.exports = {storage, upload};
