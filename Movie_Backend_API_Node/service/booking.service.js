const Booking = require('../model/booking.model');
const Show = require('../model/show.model');
const Payment = require('../model/payment.model');
const mongoose = require('mongoose');

const createBooking = async (data) => {
    const show = await Show.findById(data.showId);

    if (!show) {
        throw new Error("Show not found");
    }

    if (show.availableSeats < data.seatNumbers.length) {
        throw new Error("Not enough seats available");
    }

    const overlappingBookings = await Booking.find({
        showId: data.showId,
        status: { $in: ["SUCCESS", "PENDING"] },
        seatNumbers: { $in: data.seatNumbers }
    });

    if (overlappingBookings.length > 0) {
        throw new Error("One or more seats already booked");
    }

    const seats = data.seatNumbers.length;

    const booking = await Booking.create({
        ...data,
        seats,
        totalCost: show.price * seats,
        status: "PENDING"
    });

    show.availableSeats -= seats;
    await show.save();

    return booking;
};
const getBookingById = async (id, userId) => {
    try {
        const booking = await Booking.findOne({ _id: id, userId })
            .populate('userId', 'name email')
            .populate({
                path: 'showId',
                populate: { path: 'movieId theatreId' }
            });
        return booking;
    } catch (err) {
        throw err;
    }
};

const getUserBookings = async (userId) => {
    try {
        const bookings = await Booking.find({ userId })
            .populate({
                path: 'showId',
                populate: { path: 'movieId theatreId' }
            });
        return bookings;
    } catch (err) {
        throw err;
    }
};

const cancelBooking = async (id, userId) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const booking = await Booking.findOne({ _id: id, userId }).session(session);
        if (!booking) {
            throw new Error("Booking not found");
        }

        if (booking.status === "CANCELLED") {
            throw new Error("Booking is already cancelled");
        }

        const oldStatus = booking.status;
        booking.status = "CANCELLED";
        await booking.save({ session });

        // Restore seats in show ONLY IF they weren't released already
        if (oldStatus !== "FAILED") {
            await Show.findByIdAndUpdate(booking.showId, { 
                $inc: { availableSeats: booking.seats } 
            }, { session });
        }

        await session.commitTransaction();
        return booking;
    } catch (err) {
        await session.abortTransaction();
        throw err;
    } finally {
        session.endSession();
    }
};

const getMyBookings = async (userId, page = 1, limit = 5) => {
    try {
        const skip = (page - 1) * limit;

        const bookings = await Booking.find({ userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate({
                path: 'showId',
                populate: { path: 'movieId theatreId' }
            });

        const totalBookings = await Booking.countDocuments({ userId });
        const totalPages = Math.ceil(totalBookings / limit);

        const bookingIds = bookings.map(b => b._id);
        const payments = await Payment.find({ bookingId: { $in: bookingIds } });
        
        const paymentMap = payments.reduce((acc, p) => {
            acc[p.bookingId.toString()] = p.status;
            return acc;
        }, {});

        const bookingsWithPayment = bookings.map(booking => {
            const bookingObj = booking.toObject();
            bookingObj.paymentStatus = paymentMap[booking._id.toString()] || "PENDING";
            return bookingObj;
        });

        return {
            bookings: bookingsWithPayment,
            pagination: {
                totalBookings,
                totalPages,
                currentPage: page,
                limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        };
    } catch (err) {
        throw err;
    }
};

const getShowStartDateTime = (showDate, showTime) => {
    const baseDate = new Date(showDate);
    let hours = 0;
    let minutes = 0;

    const timeStr = showTime.trim().toUpperCase();
    const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
    if (match) {
        hours = parseInt(match[1], 10);
        minutes = parseInt(match[2], 10);
        const ampm = match[3];
        if (ampm) {
            if (ampm === "PM" && hours < 12) {
                hours += 12;
            } else if (ampm === "AM" && hours === 12) {
                hours = 0;
            }
        }
    } else {
        const parts = timeStr.split(":");
        hours = parseInt(parts[0], 10) || 0;
        minutes = parseInt(parts[1] || "0", 10) || 0;
    }

    baseDate.setHours(hours, minutes, 0, 0);
    return baseDate;
};

const cancelSuccessBooking = async (bookingId, userId) => {
    // Check if booking exists
    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new Error("Booking not found");
    }

    // Check if booking belongs to logged in user
    if (booking.userId.toString() !== userId) {
        throw new Error("Unauthorized to cancel this booking");
    }

    // Already cancelled
    if (booking.status === "CANCELLED") {
        return {
            alreadyCancelled: true,
            booking
        };
    }

    // Only successful bookings can be cancelled
    if (booking.status !== "SUCCESS") {
        throw new Error("Only successful bookings can be cancelled");
    }

    // Find associated show
    const show = await Show.findById(booking.showId);

    if (!show) {
        throw new Error("Associated show not found");
    }

    // Don't allow cancellation after show starts
    const showStart = getShowStartDateTime(show.showDate, show.showTime);

    if (showStart < new Date()) {
        throw new Error("Cannot cancel booking after the show has started");
    }

    // Update booking status
    booking.status = "CANCELLED";
    await booking.save();

    // Update payment status
    await Payment.findOneAndUpdate(
        { bookingId: booking._id },
        { status: "REFUND_PENDING" }
    );

    const paymentService = require('./payment.service');
    await paymentService.refundPaymentForBooking(booking._id);

    // Restore seats
    show.availableSeats += booking.seats;
    await show.save();

    // Return updated booking
    const updatedBooking = await Booking.findById(bookingId)
        .populate({
            path: "showId",
            populate: {
                path: "movieId theatreId"
            }
        });

    // Trigger cancellation and refund emails asynchronously
    const emailService = require('../services/email.service');
    emailService.sendBookingCancellation(booking._id).catch(e => console.error("Cancellation email failed:", e.message));

    return {
        alreadyCancelled: false,
        booking: updatedBooking
    };
};
module.exports = {
    createBooking,
    getBookingById,
    getUserBookings,
    cancelBooking,
    getMyBookings,
    cancelSuccessBooking
};
