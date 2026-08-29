const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    showId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Show",
        required: true
    },
    seats: {
        type: Number,
        required: true,
        min: 1
    },
    seatNumbers: {
        type: [Number],
        required: true
    },
    totalCost: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: "PENDING",
        enum: ["SUCCESS", "CANCELLED", "PENDING", "FAILED"]
    }
}, { timestamps: true });

bookingSchema.index({ userId: 1 });
bookingSchema.index({ showId: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ showId: 1, seatNumbers: 1, status: 1 });

module.exports = mongoose.model("Booking", bookingSchema);
