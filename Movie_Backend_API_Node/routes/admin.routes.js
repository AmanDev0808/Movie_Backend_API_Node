const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const routes = (app) => {
  app.get('/mba/api/v1/admin/dashboard',
    [authMiddleware.verifyToken, authMiddleware.isAdmin],
    adminController.getDashboard
  );

  app.get('/mba/api/v1/admin/locations',
    [authMiddleware.verifyToken, authMiddleware.isAdmin],
    adminController.getLocations
  );

  app.post('/mba/api/v1/admin/locations',
    [authMiddleware.verifyToken, authMiddleware.isAdmin],
    adminController.createLocation
  );

  app.get('/mba/api/v1/admin/screens',
    [authMiddleware.verifyToken, authMiddleware.isAdmin],
    adminController.getScreens
  );

  app.post('/mba/api/v1/admin/screens',
    [authMiddleware.verifyToken, authMiddleware.isAdmin],
    adminController.createScreen
  );

  app.get('/mba/api/v1/admin/audit-logs',
    [authMiddleware.verifyToken, authMiddleware.isAdmin],
    adminController.getAuditLogs
  );
};

module.exports = routes;
