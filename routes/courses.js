const express = require('express');
const router = express.Router();
const courseController = require('../controllers/CourseController');
const { isTutor } = require('../middlewares/isAuthenticated');

router.get('/create', isTutor, courseController.createCourse);
router.post('/store', isTutor, courseController.store);

router.get('/edit/:id', isTutor, courseController.edit);
router.get('/clone/:id', isTutor, courseController.clone);
router.put('/:id', isTutor, courseController.update)
router.delete('/:id', isTutor, courseController.destroy);

router.get('/:id', courseController.detail);
router.get('/', courseController.showAll);

module.exports = router;
