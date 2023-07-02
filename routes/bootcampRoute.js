const express = require('express');
const router = express.Router();
const controller = require('../controllers/bootcampContollers');
const courseRoute = require('./courseRoute');

const advancedResults = require('../middlewares/advancedResults')
const Bootcamp = require('../models/Bootcamp')
const {protect} = require('../middlewares/auth')


router.use('/:bootcampId/courses', courseRoute);

router.route('/:id/photo')
    .put(protect, controller.bootcampPhotoUpload)

router
    .route('/')
    .get(advancedResults(Bootcamp, 'courses'), controller.getBootcamps)
    .post(protect, controller.createBootcamp);

router
    .route('/:id')
    .get(controller.getBootcampById)
    .put(protect, controller.updateBootcamp)
    .delete(protect, controller.deleteBootcamp);

router
    .route('/radius/:zipcode/:distance').get(controller.getBootcampsInRadius);


module.exports = router;