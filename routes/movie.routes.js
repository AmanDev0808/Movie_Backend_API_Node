const MovieController = require('../controllers/movie.controllers');
const MovieMIddlewares = require('../middlewares/movie.middleware');

const routes = (app) =>{

    // routes function taken express app object as parameter
    app.post('/mba/api/v1/movies',MovieMIddlewares.validateMovieCreateREquest,MovieController.createMovie);


    // delete the route
    app.delete('/mba/api/v1/movies/:id',MovieController.deleteMovie);




    app.get('/mba/api/v1/movies/:id',MovieController.getMovie)


    // Update the Movies 
    app.put('/mba/api/v1/movies/:id',MovieController.updateMovie)

    app.patch('/mba/api/v1/movies/:id',MovieController.updateMovie)

    // Fetched
    app.get('/mba/api/v1/movies',MovieController.getMovies)
}

module.exports = routes;