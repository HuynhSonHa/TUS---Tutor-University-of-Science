const express = require('express');
const router = express.Router();
const tutorController = require('../controllers/TutorController');
const {isTutor} = require('../middlewares/isAuthenticated');


router.get('/stored/courses', isTutor, tutorController.storedCourses);
router.get('/stored/waiting-list', isTutor, tutorController.storedStudents);
router.get('/create', isTutor, tutorController.createCourse);
router.get('/profile', isTutor, tutorController.profile);
router.post('/profile', isTutor, tutorController.editProfile);
router.get('/tutor-mode', tutorController.getTutorMode);
router.get('/waitingStudent/:id', tutorController.getDetailStudent);
router.get("/accepted/:id", tutorController.acceptStudent);
router.get("/denied/:id", tutorController.denyStudent);
router.get('/', isTutor, tutorController.getHomePage);

module.exports = router;