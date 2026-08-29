const screenController = require('../controllers/screen.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const routes = (app) => {
  app.get('/mba/api/v1/screens', [authMiddleware.verifyToken, authMiddleware.isAdmin], screenController.getScreens);
  app.post('/mba/api/v1/screens', [authMiddleware.verifyToken, authMiddleware.isAdmin], screenController.createScreen);
};

module.exports = routes;
