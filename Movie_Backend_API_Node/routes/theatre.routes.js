const theatreController = require('../controllers/theatre.controllers');
const theatreMiddleware = require('../middlewares/theatre.middlewares');
const authMiddleware = require('../middlewares/auth.middleware');
const { theatreValidator } = require('../middlewares/validation.middleware');

const routes = (app)=>{
    app.get('/mba/api/v1/theatres', theatreController.list);
     
    app.post('/mba/api/v1/theatres',
        [authMiddleware.verifyToken, authMiddleware.isAdmin, theatreValidator, theatreMiddleware.validateTheatreCreateREquest],
        theatreController.create
    );

    app.put('/mba/api/v1/theatres/:id', [authMiddleware.verifyToken, authMiddleware.isAdmin], theatreController.update);
    app.patch('/mba/api/v1/theatres/:id', [authMiddleware.verifyToken, authMiddleware.isAdmin], theatreController.update);
    app.delete('/mba/api/v1/theatres/:id', [authMiddleware.verifyToken, authMiddleware.isAdmin], theatreController.remove);
}

module.exports = routes;