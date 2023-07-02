const express = require('express');
const controller = require('../controllers/authController');

const router = express.Router();
const { protect } = require('../middlewares/auth')

router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/me', protect, controller.getMe);

module.exports = router;