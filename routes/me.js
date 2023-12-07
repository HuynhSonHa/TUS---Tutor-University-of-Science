const express = require('express');
const router = express.Router();
const meController = require('../controllers/MeController');

router.get('/stored/courses/:id', meController.storedCourses);
router.get('/profile/:id', meController.profile);
module.exports = router;
