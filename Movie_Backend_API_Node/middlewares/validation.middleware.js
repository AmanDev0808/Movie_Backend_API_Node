const { body, validationResult } = require('express-validator');
const { errorResponseBody } = require('../utils/responsebody');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errorResponseBody.err = errors.array();
        errorResponseBody.message = "Validation failed for the request";
        return res.status(400).json(errorResponseBody);
    }
    next();
};

const signupValidator = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    validate
];

const signinValidator = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
];

const changePasswordValidator = [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
    body('confirmPassword').custom((value, { req }) => value === req.body.newPassword).withMessage('Passwords do not match'),
    validate
];

const movieValidator = [
    body('name').notEmpty().withMessage('Movie name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('casts').isArray({ min: 1 }).withMessage('At least one cast member is required'),
    body('director').notEmpty().withMessage('Director is required'),
    body('releasedDate').notEmpty().withMessage('Release date is required'),
    body('trailerUrl').isURL().withMessage('Valid trailer URL is required'),
    validate
];

const theatreValidator = [
    body('name').isLength({ min: 5 }).withMessage('Theatre name must be at least 5 characters'),
    body('city').notEmpty().withMessage('City is required'),
    body('pincode').isNumeric().withMessage('Pincode must be a number'),
    validate
];

const showValidator = [
    body('movieId').isMongoId().withMessage('Valid Movie ID is required'),
    body('theatreId').isMongoId().withMessage('Valid Theatre ID is required'),
    body('screenId').isMongoId().withMessage('Valid Screen ID is required'),
    body('showDate').isISO8601().withMessage('Valid date is required (YYYY-MM-DD)'),
    body('showTime').notEmpty().withMessage('Show time is required'),
    body('endTime').notEmpty().withMessage('End time is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('totalSeats').isNumeric().withMessage('Total seats must be a number'),
    validate
];

const bookingValidator = [
    body('showId').isMongoId().withMessage('Valid Show ID is required'),
    body('seatNumbers').isArray({ min: 1 }).withMessage('At least one seat number is required'),
    validate
];

const paymentValidator = [
    body('bookingId').isMongoId().withMessage('Valid Booking ID is required'),
    validate
];

module.exports = {
    signupValidator,
    signinValidator,
    changePasswordValidator,
    movieValidator,
    theatreValidator,
    showValidator,
    bookingValidator,
    paymentValidator
};
