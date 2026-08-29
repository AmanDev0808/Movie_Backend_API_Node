const seatController = require('../controllers/seat.controller');

const routes = (app) => {
    app.get('/mba/api/v1/shows/:showId/seats', seatController.getSeatLayout);
    app.get('/mba/api/v1/shows/:showId/available-seats', seatController.getAvailableSeats);
};

module.exports = routes;
