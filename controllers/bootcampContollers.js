// @desc       get all bootcamps
// @route      GET /api/v1/bootcamps
// @access     Public
exports.getBootcamps = (req, res, next) => {
    res.status(200).json({success: true, message: 'Show all bootcamps'});
}

// @desc       get single bootcamps
// @route      GET /api/v1/bootcamps/:id
// @access     Public
exports.getBootcampById = (req, res, next) => {
    const {id} = req.params;
    res.status(200).json({success: true, message: id})
}

// @desc       get single bootcamps
// @route      POST /api/v1/bootcamps/
// @access     Public
exports.createBootcamp = (req, res, next) => {
    const {bootcamp} = req.params;
    res.status(200).json({success: true, message: "Create new bootcamps"})
}

// @desc       get single bootcamps
// @route      PUT /api/v1/bootcamps/:id
// @access     Public
exports.updateBootcamp = (req, res, next) => {
    const {id} = req.params;
    res.status(200).json({success: true, message: id})
}

// @desc       Delete single bootcamps
// @route      DELETE /api/v1/bootcamps/:id
// @access     Public
exports.deleteBootcamp = (req, res, next) => {
    const {id} = req.params;
    res.status(200).json({success: true, message: "Deleted bootcamp " + id})
}