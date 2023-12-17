const express = require('express');
const router = express.Router();
const tutorController = require('../controllers/TutorController');
const {isTutor} = require('../middlewares/isAuthenticated');


router.get('/stored/courses', isTutor, tutorController.storedCourses);
router.get('/stored/waiting-list', isTutor, tutorController.storedStudents);
router.get('/profile', isTutor, tutorController.profile);
router.get('/', isTutor, tutorController.getHomePage);

module.exports = router;