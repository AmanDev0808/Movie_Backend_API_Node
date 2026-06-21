// const Movie = require('../model/movie.model');
// const movieServices = require('../service/service.movie');

// /**
//  * Controller function to Create a new Movie
//  */

// const createMovie = async (req, res) => {
//     try {
//         const movie = await Movie.create(req.body);

//         return res.status(201).json({
//             success: true,
//             error: {},
//             data: movie,
//             message: "Successfully created a new movie"
//         });

//     } catch (err) {
//         console.log(err);

//         return res.status(500).json({
//             success: false,
//             error: err,
//             data: {},
//             message: "Something went wrong"
//         });
//     }
// };


// /**
//  * Controller function to Fetch Movie By Id
//  */

// const getMovies = async (req, res) => {
//     try {

//         const response = await movieServices.getMovieById(req.params.id);

//         if (response.err) 
//             return res.status(response.code).json({
//                 success: false,
//                 error: response.err,
//                 data: {},
//                 message: response.message
//             });
        

//         return res.status(200).json({
//             success: true,
//             error: {},
//             data: response.data,
//             message: "Successfully fetched the movie details"
//         });

//     } catch (err) {
//         console.log(err);

//         return res.status(500).json({
//             success: false,
//             error: err,
//             data: {},
//             message: "Internal Server Error"
//         });
//     }
// };


// const deleteMovie  = async (req,res) =>{
//     try{
//        const response = await Movie.findByIdAndDelete(req.params.movieId);
//         return res.status(200).json({
//              success:true,
//              error:{},
//              message:"Successfull deleted the movie",
//              data:response
//         })
//     } catch(err) {
//          console.log(err);
//          return res.status(500).json({
//               success:false,
//               error:err,
//               message:"Something went wrong",
//               data:{}
//          });
//     }
// }


// module.exports = {deleteMovie,createMovie,getMovies};






// Cleaner Version of Above

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
        const response = await movieService.deleteMovie(req.params.id);

        successResponseBody.data = response;
        successResponseBody.message = "Successfully deleted the movie";

        return res.status(200).json(successResponseBody);
    } catch (err) {
        console.log(err);
        return res.status(500).json(errorResponseBody);
    }
}

const getMovies = async (req, res) => {
    try {
        const response = await movieService.fetchMovies(req.query);
        if(response.err) {
            errorResponseBody.err = response.err;
            return res.status(response.code).json(errorResponseBody);
        }
        successResponseBody.data = response;
        return res.status(200).json(successResponseBody);
    } catch (error) {
        console.log(error);
        errorResponseBody.err = error;
        return res.status(500).json(errorResponseBody);
    }
}


module.exports = {deleteMovie,createMovie,getMovies};