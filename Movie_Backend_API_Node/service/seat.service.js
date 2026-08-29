const Booking = require('../model/booking.model');
const Show = require('../model/show.model');

const getSeatLayout = async (showId) => {
    try {
        const show = await Show.findById(showId);
        if (!show) {
            throw new Error("Show not found");
        }

        const bookings = await Booking.find({ 
            showId: showId, 
            status: "SUCCESS" 
        });

        const bookedSeats = [];
        bookings.forEach(booking => {
            bookedSeats.push(...booking.seatNumbers);
        });

        const totalSeats = show.totalSeats;
        const seats = [];

        for (let i = 1; i <= totalSeats; i++) {
            seats.push({
                seatNumber: i,
                isAvailable: !bookedSeats.includes(i)
            });
        }

        return {
            totalSeats,
            bookedSeats,
            availableSeatsCount: totalSeats - bookedSeats.length,
            seats
        };
    } catch (err) {
        throw err;
    }
};

const getAvailableSeats = async (showId) => {
    try {
        const layout = await getSeatLayout(showId);
        return layout.seats.filter(seat => seat.isAvailable).map(seat => seat.seatNumber);
    } catch (err) {
        throw err;
    }
};

module.exports = {
    getSeatLayout,
    getAvailableSeats
};
