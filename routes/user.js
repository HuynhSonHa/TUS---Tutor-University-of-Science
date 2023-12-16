const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const {isUser} = require('../middlewares/isAuthenticated');


router.get('/stored/courses/:id', isUser, userController.storedCourses);
router.get('/profile', isUser, userController.profile);
router.get('/home', isUser, userController.getHomePage);

module.exports = router;
