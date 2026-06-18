const MovieController = require('../controllers/movie.controllers');

const routes = (app) =>{

    // routes function taken express app object as parameter
    app.post('/mba/api/v1/movies',MovieController.createMovie);


    // delete the route
    app.delete('/mba/api/v1/movies/:movieId',MovieController.deleteMovie);




    app.get('/mba/api/v1/movies/:id',MovieController.getMovies)
}

module.exports = routes;