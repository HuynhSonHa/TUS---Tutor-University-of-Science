const express = require('express');
const router = express.Router();
const courseController = require('../controllers/CourseController');
const {isTutor} = require('../middlewares/isAuthenticated');

router.get('/courses/:id', courseController.detail);
router.get('/courses/', courseController.showAll);

module.exports = router;