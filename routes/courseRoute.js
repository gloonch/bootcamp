const express = require('express');
const router = express.Router({mergeParams: true});
const controller = require('../controllers/courseContollers');

const Course = require('../models/Course');
const advancedResults = require('../middlewares/advancedResults')
const {protect, authorize} = require("../middlewares/auth");

router
    .route('/')
    .get(advancedResults(Course, { path: 'bootcamp', select: 'name description'}), controller.getCourses)
    .post(protect, authorize('publisher', 'admin'), controller.create);

router.route('/:id')
    .get(controller.getCourseById)
    .put(protect, authorize('publisher', 'admin'), controller.updateCourse)
    .delete(protect, authorize('publisher', 'admin'), controller.deleteCourse)

module.exports = router;