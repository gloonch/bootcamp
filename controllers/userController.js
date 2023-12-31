const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
require('dotenv').config({path: './config/config.env'});


// @desc       Get all users
// @route      GET /api/v1/auth/users
// @access     Private
exports.getUsers = async (req, res, next) => {

    res.status(200).json(res.advancedResults)
}


// @desc       Get single user
// @route      GET /api/v1/auth/users
// @access     Private
exports.getSingleUser = async (req, res, next) => {
    const user = await User.findById(req.params.id);
    res.status(200).json({
        success: true,
        data: user
    })
}


// @desc       Create user
// @route      POST /api/v1/auth/users
// @access     Private
exports.createUser = async (req, res, next) => {
    const user = await User.create(req.body);

    res.status(201).json({
        success: true,
        data: user
    })
}


// @desc       Update user
// @route      PUT /api/v1/auth/users/:id
// @access     Private
exports.updateUser = async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: user
    })
}


// @desc       Delete user
// @route      DELETE /api/v1/auth/users/:id
// @access     Private/Admin
exports.deleteUser = async (req, res, next) => {
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        data: {}
    })
}

