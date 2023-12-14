const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const {isAuthenticated} = require('../middlewares/isAuthenticated');


router.get('/stored/courses/:id', isAuthenticated, userController.storedCourses);
router.get('/profile/:id', isAuthenticated, userController.profile);
router.get('/home', isAuthenticated, userController.getHomePage);

module.exports = router;
