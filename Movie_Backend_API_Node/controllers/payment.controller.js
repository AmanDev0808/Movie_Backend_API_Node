const paymentService = require('../service/payment.service');
const { successResponseBody, errorResponseBody } = require('../utils/responsebody');

const createOrder = async (req, res) => {
    try {
        const response = await paymentService.createOrder(req.body.bookingId, req.userId);
        successResponseBody.data = response;
        successResponseBody.message = "Successfully created Razorpay order";
        return res.status(201).json(successResponseBody);
    } catch (err) {
        errorResponseBody.err = err.message;
        errorResponseBody.message = "Failed to create Razorpay order";
        return res.status(500).json(errorResponseBody);
    }
};

const verifyPayment = async (req, res) => {
    try {
        const response = await paymentService.verifyPayment(req.body);
        if (response.signatureIsValid) {
            successResponseBody.data = response;
            successResponseBody.message = "Payment verified successfully";
            return res.status(200).json(successResponseBody);
        } else {
            errorResponseBody.message = "Payment verification failed";
            return res.status(400).json(errorResponseBody);
        }
    } catch (err) {
        console.error("verifyPayment error:", err.stack);
        errorResponseBody.err = err.message;
        errorResponseBody.message = "Internal server error during verification";
        return res.status(500).json(errorResponseBody);
    }
};

const handleWebhook = async (req, res) => {
    try {
        const signature = req.headers['x-razorpay-signature'];
        await paymentService.handleWebhook(signature, req.body);
        return res.status(200).json({ status: 'ok' });
    } catch (err) {
        return res.status(400).send('Webhook Error');
    }
};

module.exports = {
    createOrder,
    verifyPayment,
    handleWebhook
};
