const ErrorResponse = require('../utils/errorResponse')
const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');

// @desc       get all bootcamps
// @route      GET /api/v1/bootcamps
// @access     Public
exports.getBootcamps = async (req, res, next) => {
    try {
        
        const reqQuery = {...req.query}

        // Field to exclude
        const removeFields = ['select', 'sort']

        //Loop over removeFields and delete them from the reqQuery
        removeFields.forEach(i => delete reqQuery[i]);
        
        // /bootcamps?select=name,description
        let queryStr = JSON.stringify(reqQuery);

        // /bootcamps?averageCost[lte]=1000
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        // finding resource
        let query = Bootcamp.find(JSON.parse(queryStr));

        // Select fields
        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields)
        }

        // sort
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy)
        } else {
            query = query.sort('-createdAt');
        }

        // EXAMPLE: /bootcamps?select=name,description?sort=name
        // Executing query
        const bootcamps = await query;
        res.status(200).json({success: true, count: bootcamps.length, data: bootcamps});
    } catch (error) {
        next(new ErrorResponse(`Error happened while retrieving data. ${error}`, 404))
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

