const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const advancedResults = (model, populate) => async (req, res, next) => {
    try {
        const reqQuery = {...req.query}

        // Field to exclude
        const removeFields = ['select', 'sort', 'page', 'limit'];

        //Loop over removeFields and delete them from the reqQuery
        removeFields.forEach(i => delete reqQuery[i]);

        // /models?select=name,description
        let queryStr = JSON.stringify(reqQuery);

        // /models?averageCost[lte]=1000
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        // finding resource
        let query = model.find(JSON.parse(queryStr));

        // Select fields
        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields)
        }

        // sort
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy)
        } else {
            query = query.sort('-createdAt');
        }

        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 1;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await model.countDocuments()

        query = query.skip(startIndex).limit(limit);

        if (populate) {
            query = query.populate(populate)
        }

        // EXAMPLE: /models?select=name,description?sort=name
        // Executing query
        const results = await query;

        // EXAMPLE: /models?page=2
        // Pagination result
        const pagination = {};
        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit
            }
        }

        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            }
        }

        res.advancedResults = {
            success: true,
            count: results.length,
            pagination,
            data: results
        }

        next();
    } catch (error) {
        next(new ErrorResponse(`Error happened while retrieving data. ${error}`, 404))
    }
}

module.exports = advancedResults;