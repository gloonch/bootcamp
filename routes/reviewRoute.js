const express = require('express');
const router = express.Router({mergeParams: true});
const controller = require('../controllers/reviewController');

const Review = require('../models/Review');
const advancedResults = require('../middlewares/advancedResults')
const {protect, authorize} = require("../middlewares/auth");

router
    .route('/')
    .get(advancedResults(Review, {
            path: 'bootcamp',
            select: 'name description'}),
        controller.getReviews)
    .post(protect, authorize('user', 'admin'), controller.addReview)

router
    .route('/:id')
    .get(controller.getReview)
    .put(protect, authorize('admin', 'user'), controller.updateReview)
    .delete(protect, authorize('admin', 'user'), controller.deleteReview)


module.exports = router;