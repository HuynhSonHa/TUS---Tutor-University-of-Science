const express = require('express');
const multer = require('multer');
const router = express.Router();
const tutorController = require('../controllers/TutorController');
const { isTutor, isUser } = require('../middlewares/isAuthenticated');
const profileMiddleware = require("../middlewares/profileMiddlewares");
const courseMiddleware = require("../middlewares/courseMiddlewares");
const orderMiddleware = require("../middlewares/orderMiddlewares");
const beTutorMiddleware = require("../middlewares/beTutorMiddlewares");

const {upload, storage} = require('../config/multer');


router.get('/stored/courses', isTutor, tutorController.storedCourses);
router.get('/stored/coursesAjax', isTutor, tutorController.storedCoursesAjax);
router.get('/stored/waiting-list', isTutor, tutorController.storedStudents);
router.get('/stored/waiting-listAjax', isTutor, tutorController.storedWaitingListAjax);
router.get('/create', isTutor, tutorController.createCourse);
router.post('/createNewCourse', isTutor, courseMiddleware.createValidator, tutorController.createNewCourse);
router.get('/profile', isTutor, tutorController.profile);
router.get('/courseDetail/:id', isTutor, tutorController.courseDetail);
router.post('/profile', isTutor, upload.single('avatar'), profileMiddleware.postValidator, tutorController.editProfile);
router.get('/tutor-mode', tutorController.getTutorMode);
router.get('/waitingStudent/:id', tutorController.getDetailStudent);
router.get("/accepted/:id", tutorController.acceptStudent);
router.get("/denied/:id", tutorController.denyStudent);
router.get('/courses/:id', tutorController.detail);
router.get('/courses/', isTutor, tutorController.showAll);
router.get('/premium', isTutor, tutorController.getPremium);
router.get('/formTutor/:page', isTutor, tutorController.getFormTutor);
router.post('/formTutor/:page', isTutor, upload.single('GPAfile'), beTutorMiddleware.postValidator, tutorController.postFormTutor);

router.get('/contactToTutor/:id', isTutor, tutorController.getContactToTutor);

router.post('/contactToTutor/:id', isTutor, orderMiddleware.postValidator, tutorController.postContactToTutor);

router.get('/', isTutor, tutorController.getHomePage);

module.exports = router;