const ErrorResponse = require('../utils/errorResponse')
const Bootcamp = require('../models/Bootcamp');
const Course = require('../models/Course');
const { parse } = require('dotenv');

// @desc       get courses
// @route      GET /api/v1/courses
// @route      GET /api/v1/bootcamps/:bootcampId/courses
// @access     Public
exports.getCourses = async (req, res, next)=>{
    if (req.params.bootcampId) {
        const courses = await Course.find({bootcamp: req.params.bootcampId});
        return res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        })
    } else {
        res.status(200).json(res.advancedResults);
    }
}

// @desc       get single course
// @route      GET /api/v1/courses/:id
// @access     Public
exports.getCourseById = async (req, res, next)=>{

    try {
        const course = await Course.findById(req.params.id)
            .populate({
                path: 'bootcamp',
                select: 'name description'
            });

        if (!course) return next(new ErrorResponse(`No course with the id of ${req.params.id} has found.`, 404));

        res.status(200).json({
            success: true,
            data: course
        })
    } catch (error) {
        next(new ErrorResponse(`Error happened while retrieving data. ${error}`, 404))
    }
}


// @desc       Add new course
// @route      POST /api/v1/bootcamps/:bootcampId/courses
// @access     Private
exports.create = async (req, res, next)=>{

    try {
        req.body.bootcamp = req.params.bootcampId;
        req.body.user = req.user.id;
        const bootcamp = await Bootcamp.findById(req.params.bootcampId);

        if (!bootcamp) return next(new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId} has found.`, 404));

        // Make sure user is bootcamp owner
        if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(new ErrorResponse(`User ${req.user.id} is not authorized to add a course to bootcamp ${bootcamp._id}`, 401))
        }

        const course = await Course.create(req.body)

        res.status(200).json({
            success: true,
            data: course
        })
    } catch (error) {
        next(new ErrorResponse(`Error happened while retrieving data. ${error}`, 404))
    }
}


// @desc       Update course
// @route      PUT /api/v1/courses/:id
// @access     Private
exports.updateCourse = async (req, res, next)=>{
    let course = await Course.findById(req.params.id);

    if (!course) return next(new ErrorResponse(`No course with the id of ${req.params.id} has found.`, 404));

    // Make sure user is course owner
    if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update course ${course._id}`, 401))
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        data: course
    })
    res.status(200).json({success: true, data: course})

}


// @desc       Delete course
// @route      DELETE /api/v1/courses/:id
// @access     Private
exports.deleteCourse = async (req, res, next)=>{
    const course = await Course.findById(req.params.id);

    if (!course) return next(new ErrorResponse(`No course with the id of ${req.params.id} has found.`, 404));

    // Make sure user is course owner
    if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete course ${course._id}`, 401))
    }

    await course.deleteOne();

    res.status(200).json({success: true, data: {}})

}
