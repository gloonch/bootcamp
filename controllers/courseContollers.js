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
