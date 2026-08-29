const Movie = require('../model/movie.model');
const movieService = require('../service/service.movie');
const { successResponseBody, errorResponseBody} = require('../utils/responsebody');
                                                                                

/**
 * Controller function to create a new movie
 * @returns movie created
*/


const createMovie = async (req, res) => {
    try {
        const response = await movieService.createMovie(req.body);
        if(response.err) {
            errorResponseBody.err = response.err;
            errorResponseBody.message = "Validation failed on few parameters of the request body"
            return res.status(response.code).json(errorResponseBody);
        }
        successResponseBody.data = response;
        successResponseBody.message = "Successfully created the movie";

        return res.status(201).json(successResponseBody);
    } catch (err) {
    console.log(err);
    return res.status(500).json(errorResponseBody);
}
};

const deleteMovie = async (req, res) => {
    try {
        const response = await movieService.deleteMovie(req.params.movieId);

        successResponseBody.data = response;
        successResponseBody.message = "Successfully deleted the movie";

        return res.status(200).json(successResponseBody);
    } catch (err) {
        console.log(err);
        errorResponseBody.err = err.message;
        errorResponseBody.message = "Failed to delete the movie";
        return res.status(err.statusCode || 500).json(errorResponseBody);
    }
}

const getMovie = async (req, res) => {
    try {
        const response = await movieService.getMovieById(req.params.id);
        if (response.err) {
            errorResponseBody.err = response.err;
            errorResponseBody.message = "Movie not found";
            errorResponseBody.data = {};
            errorResponseBody.success = false;
            return res.status(404).json(errorResponseBody);
        }
        successResponseBody.data = response.data;
        successResponseBody.message = "Successfully fetched the movie";
        successResponseBody.err = {};
        successResponseBody.success = true;
        return res.status(200).json(successResponseBody);
    } catch (error) {
        console.log(error);
        errorResponseBody.err = error.message;
        errorResponseBody.message = "Something went wrong, cannot process the request";
        errorResponseBody.data = {};
        errorResponseBody.success = false;
        return res.status(500).json(errorResponseBody);
    }
}


const updateMovie = async (req,res) =>{
    
    try {
        const response = await movieService.updateMovie(req.params.id,req.body);
        if(response.err) {
              errorResponseBody.err = response.err;
              errorResponseBody.message = "the updates  that we are trying to apply doesnot validate the Schema";
              return res.status(response.code).json(errorResponseBody)
        }
        successResponseBody.data = response;
        return res.status(200).json(successResponseBody);
    } catch(err) {
        console.log(err);
        errorResponseBody.err = err.message;
        return  res.status(500).json(errorResponseBody);
    }
}

    const getMovies = async (req,res) =>{
        try{
             const response = await movieService.fetchMovies(req.query);
             if(response.err) {
                 errorResponseBody.err = response.err;
                 errorResponseBody.message = "Failed to fetch the movies";
                 return res.status(response.code).json(errorResponseBody);
             }
              successResponseBody.data = response;
              successResponseBody.message = "Successfully fetched all the movies";
              return res.status(200).json(successResponseBody);
        } catch(error) {
            console.log(error);
            errorResponseBody.err = error.message;
            errorResponseBody.message = "Failed to fetch the movies";
            return  res.status(500).json(errorResponseBody);
        }
}


module.exports = {deleteMovie,createMovie,getMovie,updateMovie,getMovies };