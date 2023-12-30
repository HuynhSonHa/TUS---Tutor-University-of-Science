const express = require('express');
const router = express.Router();
const orderController = require('../controllers/OrderController.js');
const orderMiddleware = require("../middlewares/orderMiddlewares");
const {isUser} = require('../middlewares/isAuthenticated');

router.post('/store/:id', isUser, orderMiddleware.postValidator,orderController.store);

module.exports = router;