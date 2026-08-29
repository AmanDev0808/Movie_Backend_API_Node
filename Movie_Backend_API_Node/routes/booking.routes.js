const bookingController = require('../controllers/booking.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { bookingValidator } = require('../middlewares/validation.middleware');

const routes = (app) => {
    app.post('/mba/api/v1/bookings', 
        [authMiddleware.verifyToken, bookingValidator], 
        bookingController.createBooking
    );

    app.get('/mba/api/v1/bookings', 
        [authMiddleware.verifyToken], 
        bookingController.getUserBookings
    );

    app.get('/mba/api/v1/bookings/my-bookings', 
        [authMiddleware.verifyToken], 
        bookingController.getMyBookings
    );

    app.post('/mba/api/v1/bookings/:bookingId/cancel', 
        [authMiddleware.verifyToken], 
        bookingController.cancelSuccessBooking
    );

    app.get('/mba/api/v1/bookings/:id', 
        [authMiddleware.verifyToken], 
        bookingController.getBooking
    );

    app.put('/mba/api/v1/bookings/:id/cancel', 
        [authMiddleware.verifyToken], 
        bookingController.cancelBooking
    );
};

module.exports = routes;
