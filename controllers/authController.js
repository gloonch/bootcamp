const ErrorResponse = require('../utils/errorResponse');
const Bootcamp = require('../models/Bootcamp');
const User = require('../models/User');
require('dotenv').config({path: './config/config.env'});


// @desc       Register user
// @route      POST /api/v1/auth/register
// @access     Public
exports.register = async (req, res, next) => {

    const {name, email, password, role} = req.body;

    // Create user
    const user = await User.create({
        name, email, password, role
    });

    sendTokenResponse(user, 200, res);
}


// @desc       Login
// @route      POST /api/v1/auth/login
// @access     Public
exports.login = async (req, res, next) => {

    const {email, password} = req.body;

    // Validate email & password
    if (!email || !password) {
        return next(new ErrorResponse('Please provide and email and password', 400));
    }

    // Check for user
    const user = await User.findOne({email}).select('+password');

    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 400));
    }

    // Check if password matches
    const isMatched = await user.matchPassword(password);
    if (!isMatched) return next(new ErrorResponse('Invalid credentials', 401));

    sendTokenResponse(user, 200, res);
}


// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJWTToken()
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production'){
        options.secure = true;
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({success: true, token});

}


// @desc       Get the current logged in user
// @route      POST /api/v1/auth/me
// @access     Private
exports.getMe = async (req, res, next) => {

    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user
    })
}
