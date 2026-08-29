const showController = require('../controllers/show.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { showValidator } = require('../middlewares/validation.middleware');

const routes = (app) => {
    app.post('/mba/api/v1/shows', 
        [authMiddleware.verifyToken, authMiddleware.isAdmin, showValidator], 
        showController.createShow
    );

    app.get('/mba/api/v1/shows', 
        showController.getShows
    );

    app.get('/mba/api/v1/shows/:id', 
        showController.getShow
    );

    app.put('/mba/api/v1/shows/:id', 
        [authMiddleware.verifyToken, authMiddleware.isAdmin], 
        showController.updateShow
    );

    app.delete('/mba/api/v1/shows/:id', 
        [authMiddleware.verifyToken, authMiddleware.isAdmin], 
        showController.deleteShow
    );
};

module.exports = routes;
