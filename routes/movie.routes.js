const MovieController = require('../controllers/movie.controllers');
const MovieMIddlewares = require('../middlewares/movie.middleware');

const routes = (app) =>{

    // routes function taken express app object as parameter
    app.post('/mba/api/v1/movies',MovieMIddlewares.validateMovieCreateREquest,MovieController.createMovie);


    // delete the route
    app.delete('/mba/api/v1/movies/:movieId',MovieController.deleteMovie);




    app.get('/mba/api/v1/movies/:id',MovieController.getMovies)


    // Update the Movies 
    app.put('/mba/api/v1/movies/:id',MovieController.updateMovie)
}

module.exports = routes;