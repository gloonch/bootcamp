const express = require('express');
const router = express.Router();
const controller = require('../controllers/bootcampContollers');
const courseRoute = require('./courseRoute');

router.use('/:bootcampId/courses', courseRoute);

router
    .route('/')
    .get(controller.getBootcamps)
    .post(controller.createBootcamp);

router
    .route('/:id')
    .get(controller.getBootcampById)
    .put(controller.updateBootcamp)
    .delete(controller.deleteBootcamp);

router
    .route('/radius/:zipcode/:distance').get(controller.getBootcampsInRadius);


module.exports = router;