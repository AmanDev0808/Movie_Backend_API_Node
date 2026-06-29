const theatreController = require('../controllers/theatre.controllers');

const routes = (app)=>{
     
    app.post('/mba/api/v1/theatres',theatreController.create);
    
    app.get(
           '/mba/api/v1/theatre/:id',
            theatreController.getTheatre
        );

    app.get(
            '/mba/api/v1/theatres',
            theatreController.getTheatres
    );
    

    app.delete('/mba/api/v1/theatres/:id',
                theatreController.destroy
    );
}

module.exports = routes;