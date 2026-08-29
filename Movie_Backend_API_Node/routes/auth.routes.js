const authController = require('../controllers/auth.controllers');
const authMiddleware = require('../middlewares/auth.middleware');
const { signupValidator, signinValidator, changePasswordValidator } = require('../middlewares/validation.middleware');

const routes = (app) => {
    app.post('/mba/api/v1/auth/signup', signupValidator, authController.signup);
    app.post('/mba/api/v1/auth/signin', signinValidator, authController.signin);
    app.get('/mba/api/v1/auth/me', authMiddleware.verifyToken, authController.getProfile);
    app.patch('/mba/api/v1/auth/me', authMiddleware.verifyToken, authController.updateProfile);
    app.post('/mba/api/v1/auth/change-password', [authMiddleware.verifyToken, changePasswordValidator], authController.changePassword);
};

module.exports = routes;
