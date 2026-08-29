const MovieController = require('../controllers/movie.controllers');
const MovieMIddlewares = require('../middlewares/movie.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const { movieValidator } = require('../middlewares/validation.middleware');

const routes = (app) =>{

    // routes function taken express app object as parameter
    app.post('/mba/api/v1/movies',
        [authMiddleware.verifyToken, authMiddleware.isAdmin, movieValidator, MovieMIddlewares.validateMovieCreateREquest],
        MovieController.createMovie
    );


    // delete the route
    app.delete('/mba/api/v1/movies/:movieId',
        [authMiddleware.verifyToken, authMiddleware.isAdmin],
        MovieController.deleteMovie
    );




    app.get('/mba/api/v1/movies/:id',MovieController.getMovie)


    // Update the Movies 
    app.put('/mba/api/v1/movies/:id',
        [authMiddleware.verifyToken, authMiddleware.isAdmin],
        MovieController.updateMovie
    )

    app.patch('/mba/api/v1/movies/:id',
        [authMiddleware.verifyToken, authMiddleware.isAdmin],
        MovieController.updateMovie
    )

    // Fetched
    app.get('/mba/api/v1/movies',MovieController.getMovies)
}

module.exports = routes;