const express = require('express');
const router = express.Router();
const courseController = require('../controllers/CourseController');
const {isAuthenticated} = require('../middlewares/isAuthenticated');

router.get('/create', isAuthenticated, courseController.create);
router.post('/store', isAuthenticated, courseController.store);
router.get('/:id/edit', isAuthenticated, courseController.edit);
router.put('/:id', isAuthenticated, courseController.update);
router.delete('/:id', isAuthenticated, courseController.destroy);
router.get('/:id', courseController.detail);
router.get('/', courseController.showAll);

module.exports = router;
