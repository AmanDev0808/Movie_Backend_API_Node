const paymentController = require('../controllers/payment.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { paymentValidator } = require('../middlewares/validation.middleware');

const routes = (app) => {
    app.post('/mba/api/v1/payments/create-order', 
        [authMiddleware.verifyToken, paymentValidator], 
        paymentController.createOrder
    );

    app.post('/mba/api/v1/payments/verify', 
        [authMiddleware.verifyToken], 
        paymentController.verifyPayment
    );

    app.post('/mba/api/v1/payments/webhook', 
        paymentController.handleWebhook
    );
};

module.exports = routes;
