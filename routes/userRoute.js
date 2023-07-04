const express = require('express');
const controller = require('../controllers/userController');
const User = require('../models/User')
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth')
const advancedResults = require('../middlewares/advancedResults')
const {getUsers, createUser} = require("../controllers/userController");

router.use(protect);
router.use(authorize('admin'));

router.route('/')
    // .get(advancedResults(User), getUsers) // gets the model and the model contains roles
    .get(advancedResults(User), controller.getUsers)
    .post(controller.createUser)

router.route('/:id')
    .get(controller.getSingleUser)
    .put(controller.updateUser)
    .delete(controller.deleteUser)

module.exports = router;
