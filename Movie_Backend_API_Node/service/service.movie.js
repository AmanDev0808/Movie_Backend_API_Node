const Movie = require('../model/movie.model');
const Show = require('../model/show.model');

/**
 * CREATE MOVIE
 */
const createMovie = async (data) => {
    try {
        const movie = await Movie.create(data);
        return movie;
    } catch (error) {

        // ✅ FIXED VALIDATION ERROR HANDLING
        if (error.name === 'ValidationError') {
            let err = {};

            Object.keys(error.errors).forEach((key) => {
                err[key] = error.errors[key].message;
            });

            console.log(err);
            return { err: err, code: 422 };
        }

        // ❌ FIXED: wrong "throw new error"
        throw error;
    }
};


/**
 * DELETE MOVIE
 */
const deleteMovie = async (id) => {
    const activeShow = await Show.exists({ movieId: id });
    if (activeShow) {
        const error = new Error('Movie cannot be deleted while shows reference it');
        error.statusCode = 409;
        throw error;
    }
    const response = await Movie.findByIdAndDelete(id);
    return response;
};


/**
 * GET MOVIE BY ID
 */
const getMovieById = async (id) => {
    try {
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
    } catch (error) {
        if (error.name === 'CastError') {
            return {
                err: "No Movie found corresponding to the Id provided",
                code: 404,
                message: "Something went wrong, unable to fetch the movie",
                data: {}
            };
        }
        throw error;
    }
};


/**
 * UPDATE MOVIE
 */
const updateMovie = async (id, data) => {
    try {
        const movie = await Movie.findByIdAndUpdate(
            id,
            data,
            { new: true, runValidators: true }
        );

        return movie;

    } catch (error) {

        if (error.name === 'ValidationError') {
            let err = {};

            Object.keys(error.errors).forEach((key) => {
                err[key] = error.errors[key].message;
            });

            console.log(err);
            return { err: err, code: 422 };
        }

        throw error;
    }
};


/**
 * FETCH MOVIES
 */
const fetchMovies = async (filter) => {
    let query = {};

    const searchTerm = filter.search || filter.name;
    if (searchTerm && searchTerm.trim()) {
        const pattern = { $regex: searchTerm.trim(), $options: 'i' };
        query.$or = [{ name: pattern }, { genre: pattern }, { casts: pattern }];
    }

    const movies = await Movie.find(query);

    return movies || [];
};


module.exports = {
    getMovieById,
    createMovie,
    deleteMovie,
    updateMovie,
    fetchMovies
};