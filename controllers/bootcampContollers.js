const ErrorResponse = require('../utils/errorResponse')
const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');
const { parse } = require('dotenv');
const path = require("path");

// @desc       get all bootcamps
// @route      GET /api/v1/bootcamps
// @access     Public
exports.getBootcamps = async (req, res, next) => {
    res.status(200).json(res.advancedResults);
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
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp){
        return next( new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    bootcamp.deleteOne(); // model.remove() only works in find context
    res.status(200).json({success: true, data: {}})
}


// @desc       Get bootcamps within a radius
// @route      GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access     Private
exports.getBootcampsInRadius = async (req, res, next) => {

    const {zipcode, distance} = req.params;
    // Get lat/lng from geocoder
    try {
        const loc = await geocoder.geocode(zipcode);
        const lat = loc[0].latitude;
        const lng = loc[0].longitude;

        // calc radius using radians
        // Divide distance by radius of Earth (3,963mi / 6,378km) 
        const radius = distance / 3963;
        const bootcamps = await Bootcamp.find({
            // location: {$geowithing: {$centerSphere: [ [ <x>, <y> ], <radius> ]}}
            location: {$geowithing: {$centerSphere: [ [ lat, lng ], radius ]}}
        });

        res.status(200).json({success: true, count: bootcamps.length, data: bootcamps})
    } catch (error) {
        next(error)
    }
}


// @desc       Upload photo for bootcamp
// @route      PUT /api/v1/bootcamps/:id/photo
// @access     Private
exports.bootcampPhotoUpload = async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp){
        return next( new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }

    if (!req.files) {
        return next( new ErrorResponse(`Please upload a file.`, 400));
    }

    const file = req.files.file;

    // Make sure that the file is an image
    if (!file.mimetype.startsWith('image/')){
        return next( new ErrorResponse(`Please upload an image file.`, 400));
    }

    // Validate file size
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next( new ErrorResponse(`Please upload an image with a size of less than ${process.env.MAX_FILE_UPLOAD}kb.`, 400));
    }

    // Create custom filename
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async error =>{
        if (error) {
            console.error(error);
            return next( new ErrorResponse(`Problem with file upload`, 500));
        }
        await Bootcamp.findByIdAndUpdate(req.params.id, {photo: file.name })
        res.status(200).json({success: true, data: file.name});
    });
}


