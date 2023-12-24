const express = require('express');
const multer = require('multer');
const router = express.Router();
const tutorController = require('../controllers/TutorController');
const {isTutor} = require('../middlewares/isAuthenticated');
const storage = require('../config/multer');
const upload = multer({ storage: storage });


router.get('/stored/courses', isTutor, tutorController.storedCourses);
router.get('/stored/waiting-list', isTutor, tutorController.storedStudents);
router.get('/create', isTutor, tutorController.createCourse);
router.post('/createNewCourse', isTutor, tutorController.createNewCourse);
router.get('/profile', isTutor, tutorController.profile);
router.get('/courseDetail/:id', isTutor, tutorController.courseDetail);
router.post('/profile', isTutor, upload.single('avatar'), tutorController.editProfile);
router.get('/tutor-mode', tutorController.getTutorMode);
router.get('/waitingStudent/:id', tutorController.getDetailStudent);
router.get("/accepted/:id", tutorController.acceptStudent);
router.get("/denied/:id", tutorController.denyStudent);
router.get('/', isTutor, tutorController.getHomePage);

module.exports = router;