const ErrorResponse = require('../utils/errorResponse')

const Bootcamp = require('../models/Bootcamp');

// @desc       get all bootcamps
// @route      GET /api/v1/bootcamps
// @access     Public
exports.getBootcamps = async (req, res, next) => {
    try {
        const bootcamps = await Bootcamp.find();
        res.status(200).json({success: true, count: bootcamps.length, data: bootcamps});
    } catch (error) {
        // res.status(400).json({success: false})
        next(new ErrorResponse(`Error happened while retrieving data.`, 404))
    }
}

// @desc       get single bootcamps
// @route      GET /api/v1/bootcamps/:id
// @access     Public
exports.getBootcampById = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);

        if (!bootcamp) {
            return res.status(400).json({success: false});
        }
        res.status(200).json({success: true, data: bootcamp})
    } catch (error) {
        // res.status(400).json({success: false})
        next(new ErrorResponse(`Bootcamp not found with the given id of ${req.params.id}`, 404))
    }
}

// @desc       get single bootcamps
// @route      POST /api/v1/bootcamps/
// @access     Public
exports.createBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.create(req.body);
        res.status(201).json({success: true, data: bootcamp});
    } catch (error) {
        next(error)
    }
}

// @desc       get single bootcamps
// @route      PUT /api/v1/bootcamps/:id
// @access     Public
exports.updateBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!bootcamp) {
            return res.status(400).json({success: false});
            next(new ErrorResponse(`Error happened while retrieving data.`, 404))

        }

        res.status(200).json({success: true, data: bootcamp});
    } catch (error) {
        next(error)
    }
}

// @desc       Delete single bootcamps
// @route      DELETE /api/v1/bootcamps/:id
// @access     Public
exports.deleteBootcamp = async (req, res, next) => {

    try {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
        res.status(200).json({success: true, data: bootcamp})
    } catch (error) {
        next(error)
    }
}