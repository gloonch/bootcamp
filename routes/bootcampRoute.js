const express = require('express');
const router = express.Router();
const controller = require('../controllers/bootcampContollers');
const courseRoute = require('./courseRoute');

const advancedResults = require('../middlewares/advancedResults')
const Bootcamp = require('../models/Bootcamp')
const {protect, authorize} = require('../middlewares/auth')


router.use('/:bootcampId/courses', courseRoute);

router.route('/:id/photo')
    .put(protect, authorize('publisher', 'admin'), controller.bootcampPhotoUpload)

router
    .route('/')
    .get(advancedResults(Bootcamp, 'courses'), controller.getBootcamps)
    .post(protect, authorize('publisher', 'admin'), controller.createBootcamp);

router
    .route('/:id')
    .get(controller.getBootcampById)
    .put(protect, authorize('publisher', 'admin'), controller.updateBootcamp)
    .delete(protect, authorize('publisher', 'admin'), controller.deleteBootcamp);

router
    .route('/radius/:zipcode/:distance').get(controller.getBootcampsInRadius);


module.exports = router;