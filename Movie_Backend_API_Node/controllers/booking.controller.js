const bookingService = require('../service/booking.service');
const { successResponseBody, errorResponseBody } = require('../utils/responsebody');

const createBooking = async (req, res) => {
    try {
        // userId comes from auth middleware
        const bookingData = {
            ...req.body,
            userId: req.userId
        };
        const response = await bookingService.createBooking(bookingData);
        successResponseBody.data = response;
        successResponseBody.message = "Successfully created the booking";
        return res.status(201).json(successResponseBody);
    } catch (err) {
        errorResponseBody.err = err.message;
        errorResponseBody.message = "Failed to create the booking";
        return res.status(500).json(errorResponseBody);
    }
};

const getBooking = async (req, res) => {
    try {
        const response = await bookingService.getBookingById(req.params.id, req.userId);
        if (!response) {
            errorResponseBody.message = "Booking not found";
            return res.status(404).json(errorResponseBody);
        }
        successResponseBody.data = response;
        successResponseBody.message = "Successfully fetched the booking";
        return res.status(200).json(successResponseBody);
    } catch (err) {
        errorResponseBody.err = err.message;
        errorResponseBody.message = "Failed to fetch the booking";
        return res.status(500).json(errorResponseBody);
    }
};

const getUserBookings = async (req, res) => {
    try {
        const response = await bookingService.getUserBookings(req.userId);
        successResponseBody.data = response;
        successResponseBody.message = "Successfully fetched all the bookings for the user";
        return res.status(200).json(successResponseBody);
    } catch (err) {
        errorResponseBody.err = err.message;
        errorResponseBody.message = "Failed to fetch user bookings";
        return res.status(500).json(errorResponseBody);
    }
};

const cancelBooking = async (req, res) => {
    try {
        const response = await bookingService.cancelBooking(req.params.id, req.userId);
        successResponseBody.data = response;
        successResponseBody.message = "Successfully cancelled the booking";
        return res.status(200).json(successResponseBody);
    } catch (err) {
        errorResponseBody.err = err.message;
        errorResponseBody.message = "Failed to cancel the booking";
        return res.status(500).json(errorResponseBody);
    }
};

const getMyBookings = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        
        const response = await bookingService.getMyBookings(req.userId, page, limit);
        
        // Return structured data with pagination
        successResponseBody.data = response;
        successResponseBody.message = "Successfully fetched all the bookings for the user";
        return res.status(200).json(successResponseBody);
    } catch (err) {
        errorResponseBody.err = err.message;
        errorResponseBody.message = "Failed to fetch user bookings";
        return res.status(500).json(errorResponseBody);
    }
};

const cancelSuccessBooking = async (req, res) => {
    try {
        const response = await bookingService.cancelSuccessBooking(req.params.bookingId, req.userId);
        
        if (response.alreadyCancelled) {
            successResponseBody.data = response.booking;
            successResponseBody.message = "Booking is already cancelled";
            return res.status(200).json(successResponseBody);
        }

        successResponseBody.data = response.booking;
        successResponseBody.message = "Successfully cancelled the booking";
        return res.status(200).json(successResponseBody);
    } catch (err) {
    console.log("===== CANCEL ERROR =====");
    console.log(err);
    console.log(err.stack);

    errorResponseBody.err = err.message;
    errorResponseBody.message = "Failed to cancel the booking";

    return res.status(400).json(errorResponseBody);
}
};

module.exports = {
    createBooking,
    getBooking,
    getUserBookings,
    cancelBooking,
    getMyBookings,
    cancelSuccessBooking
};
