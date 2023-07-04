const express = require('express');
const controller = require('../controllers/authController');

const router = express.Router();
const { protect } = require('../middlewares/auth')

router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/me', protect, controller.getMe);
router.put('/updatedetails', protect, controller.updateUserDetails);
router.put('/updatepassword', protect, controller.updatePassword);
router.post('/forgotpassword', controller.forgotPassword);
router.put('/resetpassword/:resettoken', controller.resetPassword);

module.exports = router;