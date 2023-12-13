const express = require('express');
const router = express.Router();
const meController = require('../controllers/MeController');

<<<<<<< Updated upstream
router.get('/stored/courses/:id', meController.storedCourses);
router.get('/profile/:id', meController.profile);
=======
router.get('/stored/courses', meController.storedCourses);

>>>>>>> Stashed changes
module.exports = router;
