const seatService = require('../service/seat.service');
const { successResponseBody, errorResponseBody } = require('../utils/responsebody');

const getSeatLayout = async (req, res) => {
    try {
        const response = await seatService.getSeatLayout(req.params.showId);
        successResponseBody.data = response;
        successResponseBody.message = "Successfully fetched seat layout";
        return res.status(200).json(successResponseBody);
    } catch (err) {
        errorResponseBody.err = err.message;
        errorResponseBody.message = "Failed to fetch seat layout";
        return res.status(500).json(errorResponseBody);
    }
};

const getAvailableSeats = async (req, res) => {
    try {
        const response = await seatService.getAvailableSeats(req.params.showId);
        successResponseBody.data = response;
        successResponseBody.message = "Successfully fetched available seats";
        return res.status(200).json(successResponseBody);
    } catch (err) {
        errorResponseBody.err = err.message;
        errorResponseBody.message = "Failed to fetch available seats";
        return res.status(500).json(errorResponseBody);
    }
};

module.exports = {
    getSeatLayout,
    getAvailableSeats
};
