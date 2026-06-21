const Movie = require('../model/movie.model');

const createMovie = async (data) =>{
       const movie = await Movie.create(data);
       return movie;
}

const deleteMovie = async (id)=>{
     const response = await Movie.findByIdAndDelete(id);
     return response;

}

const getMovieById = async (id) => {
    const movie = await Movie.findById(id);

    if (!movie) {
        return {
            err: "No Movie found corresponding to the Id provided",
            code: 404,
            message: "Something went wrong, unable to fetch the movie",
            data: {}
        };
    }

    return {
        err: null,
        code: 200,
        message: "Movie fetched successfully",
        data: movie
    };
};
module.exports = {getMovieById ,createMovie ,deleteMovie } 
