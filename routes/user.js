const express = require('express');
const multer = require('multer');
const router = express.Router();
const userController = require('../controllers/UserController');
const {isUser} = require('../middlewares/isAuthenticated');
const storage = require('../config/multer');
const upload = multer({ storage: storage });

router.get('/stored/courses/:id', isUser, userController.detailCourses);
router.get('/stored/courses', isUser, userController.storedCourses);

router.get('/profile', isUser, userController.profile);
router.post('/profile', isUser, userController.editProfile);
router.get('/premium', isUser, userController.getPremium);
router.get('/formTutor/:page', isUser, userController.getFormTutor);
router.post('/formTutor/:page', isUser, upload.single('GPAfile'), userController.postFormTutor);
router.get('/contact/:id', isUser, userController.getContact);

router.get('/', isUser, userController.getHomePage);

module.exports = router;
