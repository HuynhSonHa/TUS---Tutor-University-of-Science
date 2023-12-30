const express = require('express');
const router = express.Router();
const courseController = require('../controllers/CourseController');
const { isTutor } = require('../middlewares/isAuthenticated');
const courseMiddleware = require("../middlewares/courseMiddlewares");

router.get('/create', isTutor, courseController.createCourse);
router.post('/store', isTutor, courseMiddleware.createValidator,courseController.store);

router.get('/edit/:id', isTutor, courseController.edit);
router.get('/clone/:id', isTutor, courseController.clone);
router.put('/:id', isTutor, courseMiddleware.createValidator, courseController.update)
router.delete('/:id', isTutor, courseController.destroy);
router.post('/createNewCourse', isTutor, courseMiddleware.createValidator, courseController.createNewCourse);

router.get('/:id', courseController.detail);
router.get('/', courseController.showAll);

module.exports = router;
