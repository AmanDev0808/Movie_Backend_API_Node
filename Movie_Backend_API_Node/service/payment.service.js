console.log("🔥 payment.service.js LOADED");
const Show = require("../model/show.model");
const Payment = require("../model/payment.model");
const Booking = require("../model/booking.model");

const Razorpay = require("razorpay");
const crypto = require("crypto");

require("dotenv").config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// ==========================
// CREATE ORDER
// ==========================
const createOrder = async (bookingId, userId) => {

    const booking = await Booking.findOne({ _id: bookingId, userId });

    if (!booking) {
        throw new Error("Booking not found");
    }

    if (typeof booking.totalCost !== "number") {
        throw new Error("Invalid booking total");
    }

    const order = await razorpay.orders.create({
        amount: booking.totalCost * 100,
        currency: "INR",
        receipt: `receipt_${bookingId}`
    });

    const payment = await Payment.create({
        bookingId: booking._id,
        razorpayOrderId: order.id,
        amount: booking.totalCost,
        status: "PENDING"
    });

    return {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        paymentId: payment._id
    };
};

// ==========================
// VERIFY PAYMENT
// ==========================
const verifyPayment = async (data) => {

    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    } = data;

    const payment = await Payment.findOne({
        razorpayOrderId: razorpay_order_id
    });

    if (!payment) {
        throw new Error("Payment record not found");
    }

    // Generate expected signature using Razorpay key secret
    const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

    const isAuthentic = generatedSignature === razorpay_signature;

    if (isAuthentic) {

        payment.razorpayPaymentId = razorpay_payment_id;
        payment.razorpaySignature = razorpay_signature;
        payment.status = "SUCCESS";
        await payment.save();

        const booking = await Booking.findOneAndUpdate(
            { _id: payment.bookingId, status: "PENDING" },
            { status: "SUCCESS" },
            { new: true }
        );

        if (booking) {
            const emailService = require('../services/email.service');
            emailService.sendBookingConfirmation(booking._id)
                .catch(e => console.error("Confirm email failed:", e.message));
            emailService.sendDigitalTicket(booking._id)
                .catch(e => console.error("Ticket email failed:", e.message));
        }

        return { signatureIsValid: true };
    }

    // Signature invalid — mark payment and booking as FAILED, restore seats
    payment.status = "FAILED";
    await payment.save();

    const booking = await Booking.findByIdAndUpdate(
        payment.bookingId,
        { status: "FAILED" },
        { new: true }
    );

    // FIX: booking.seats is a Number, not an Array — Array.isArray() was always false
    if (booking && typeof booking.seats === 'number') {
        await Show.findByIdAndUpdate(
            booking.showId,
            { $inc: { availableSeats: booking.seats } }
        );
    }

    return { signatureIsValid: false };
};

// ==========================
// WEBHOOK
// ==========================
const handleWebhook = async (signature, body) => {

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
        .update(JSON.stringify(body))
        .digest("hex");

    if (expectedSignature !== signature) {
        throw new Error("Invalid Webhook Signature");
    }

    const event = body.event;
    const payload = body.payload.payment?.entity || body.payload.refund?.entity;
    if (!payload) {
        throw new Error('Invalid webhook payload');
    }

    const payment = await Payment.findOne({
        ...(payload.order_id ? { razorpayOrderId: payload.order_id } : { razorpayPaymentId: payload.payment_id })
    });

    if (!payment) {
        return { success: true };
    }

    if (event === "payment.captured") {

        payment.status = "SUCCESS";
        payment.razorpayPaymentId = payload.id;
        await payment.save();

        const booking = await Booking.findOneAndUpdate(
            { _id: payment.bookingId, status: "PENDING" },
            { status: "SUCCESS" },
            { new: true }
        );

        if (booking) {
            const emailService = require('../services/email.service');
            emailService.sendBookingConfirmation(booking._id)
                .catch(e => console.error("Confirm email failed:", e));
            emailService.sendDigitalTicket(booking._id)
                .catch(e => console.error("Ticket email failed:", e));
        }
    }

    if (event === "payment.failed") {

        payment.status = "FAILED";
        await payment.save();

        const booking = await Booking.findByIdAndUpdate(
            payment.bookingId,
            { status: "FAILED" },
            { new: true }
        );

        // FIX: booking.seats is a Number, not an Array
        if (booking && typeof booking.seats === 'number') {
            await Show.findByIdAndUpdate(
                booking.showId,
                { $inc: { availableSeats: booking.seats } }
            );
        }
    }

    if (event === 'refund.processed') {
        payment.status = 'REFUNDED';
        await payment.save();
    }

    if (event === 'refund.failed') {
        payment.status = 'REFUND_FAILED';
        await payment.save();
    }

    return { success: true };
};

const refundPaymentForBooking = async (bookingId) => {
    const payment = await Payment.findOne({ bookingId, status: 'SUCCESS' });
    if (!payment || !payment.razorpayPaymentId) {
        return { status: 'REFUND_PENDING' };
    }

    try {
        await razorpay.payments.refund(payment.razorpayPaymentId, {
            amount: payment.amount * 100,
            speed: 'normal'
        });
        payment.status = 'REFUND_PENDING';
        await payment.save();
        return { status: 'REFUND_PENDING' };
    } catch (error) {
        payment.status = 'REFUND_FAILED';
        await payment.save();
        console.error('Razorpay refund failed:', error.message);
        return { status: 'REFUND_FAILED' };
    }
};

module.exports = {
    createOrder,
    verifyPayment,
    handleWebhook,
    refundPaymentForBooking
};