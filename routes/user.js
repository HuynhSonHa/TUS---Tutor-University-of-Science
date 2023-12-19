const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const {isUser} = require('../middlewares/isAuthenticated');


router.get('/stored/courses', isUser, userController.storedCourses);
router.get('/profile', isUser, userController.profile);
router.post('/profile', isUser, userController.editProfile);
router.get('/premium', isUser, userController.getPremium);
router.get('/formTutor/:page', isUser, userController.getFormTutor);
router.post('/formTutor/:page', isUser, upload.single('GPAfile'), userController.postFormTutor);
router.get('/contact/:id', isUser, userController.getContact);
router.get('/', isUser, userController.getHomePage);

module.exports = router;
