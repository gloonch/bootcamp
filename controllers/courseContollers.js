const ErrorResponse = require('../utils/errorResponse')
const Bootcamp = require('../models/Bootcamp');
const Course = require('../models/Course');
const { parse } = require('dotenv');

// @desc       get courses
// @route      GET /api/v1/courses
// @route      GET /api/v1/bootcamps/:bootcampId/courses
// @access     Public
exports.getCourses = async (req, res, next)=>{
    let query;

    try {
        if (req.params.bootcampId) {
            query = Course.find({bootcamp: req.params.bootcampId});
        } else {
            query = Course.find()
                // .populate('bootcamp');
                .populate({ path: 'bootcamp', select: 'name description'});
        }

        const courses = await query;

        res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        })
    } catch (error) {
        next(new ErrorResponse(`Error happened while retrieving data. ${error}`, 404))
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
        const bootcamp = await Bootcamp.findById(req.params.bootcampId);

        if (!bootcamp) return next(new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId} has found.`, 404));

        const course = await Course.create(req.body)

        res.status(200).json({
            success: true,
            data: course
        })
    } catch (error) {
        next(new ErrorResponse(`Error happened while retrieving data. ${error}`, 404))
    }
}
