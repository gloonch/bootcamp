const express = require('express');
const router = express.Router({mergeParams: true});
const controller = require('../controllers/courseContollers');

router
    .route('/')
    .get(controller.getCourses)
    .post(controller.create);

router.route('/:id')
    .get(controller.getCourseById)

module.exports = router;