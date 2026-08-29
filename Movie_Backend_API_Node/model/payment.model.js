const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        required: true
    },
    razorpayOrderId: {
        type: String,
        required: true
    },
    razorpayPaymentId: {
        type: String
    },
    razorpaySignature: {
        type: String
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: "PENDING",
        enum: ["PENDING", "SUCCESS", "FAILED", "REFUND_PENDING", "REFUNDED", "REFUND_FAILED"]
    }
}, { timestamps: true });

paymentSchema.index({ razorpayOrderId: 1 });
paymentSchema.index({ bookingId: 1 });

module.exports = mongoose.model("Payment", paymentSchema);
