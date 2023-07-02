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

    // Create token
    const token = user.getSignedJWTToken()


    res.status(200).json({success: true, token});
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

    // Create token
    const token = user.getSignedJWTToken()


    res.status(200).json({success: true, token});
}
