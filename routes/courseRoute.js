const express = require('express');
const router = express.Router({mergeParams: true});
const controller = require('../controllers/courseContollers');

const Course = require('../models/Course');
const advancedResults = require('../middlewares/advancedResults')

router
    .route('/')
    .get(advancedResults(Course, { path: 'bootcamp', select: 'name description'}), controller.getCourses)
    .post(controller.create);

router.route('/:id')
    .get(controller.getCourseById)
    .put(controller.updateCourse)
    .delete(controller.deleteCourse)

module.exports = router;