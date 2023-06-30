const express = require('express');
const router = express.Router({mergeParams: true});
const controller = require('../controllers/courseContollers');

router
    .route('/')
    .get(controller.getCourses);

module.exports = router;