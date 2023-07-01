const express = require('express');
const router = express.Router();
const controller = require('../controllers/bootcampContollers');
const courseRoute = require('./courseRoute');

const advancedResults = require('../middlewares/advancedResults')
const Bootcamp = require('../models/Bootcamp')


router.use('/:bootcampId/courses', courseRoute);

router.route('/:id/photo')
    .put(controller.bootcampPhotoUpload)

router
    .route('/')
    .get(advancedResults(Bootcamp, 'courses'), controller.getBootcamps)
    .post(controller.createBootcamp);

router
    .route('/:id')
    .get(controller.getBootcampById)
    .put(controller.updateBootcamp)
    .delete(controller.deleteBootcamp);

router
    .route('/radius/:zipcode/:distance').get(controller.getBootcampsInRadius);


module.exports = router;