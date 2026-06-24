const theatreController = require('../controllers/theatre.controllers');

const routes = (app)=>{
     
    app.post('/mba/api/v1/theatres',theatreController.create);
}

module.exports = routes;