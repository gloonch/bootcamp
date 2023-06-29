const express = require('express');
const router = express.Router();
const controller = require('../controllers/bootcampContollers');

// router.get('/', controller.getBootcamps);
// router.get('/:id', controller.getBootcampById);
// router.post('/', controller.createBootcamp);
// router.put('/:id', controller.updateBootcamp);

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