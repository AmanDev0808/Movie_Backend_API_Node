const MovieController = require('../controllers/movie.controllers');

const routes = (app) =>{

    // routes function taken express app object as parameter
    app.post('/mba/api/v1/movies',MovieController.createMovie);
}

module.exports = routes;