const express = require('express');
const router = express.Router();
const courseController = require('../controllers/CourseController');
const {isTutor} = require('../middlewares/isAuthenticated');

router.get('/create', isTutor, courseController.create);
router.post('/store', isTutor, courseController.store);
router.get('/:id/edit', isTutor, courseController.edit);
router.put('/:id', isTutor, courseController.update);
router.delete('/:id', isTutor, courseController.destroy);
router.get('/:id', courseController.detail);
router.get('/', courseController.showAll);

module.exports = router;
