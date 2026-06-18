// const Movie = require('../model/movie.model');
// const movieServices = require('../service/service.movie');

// const errorResponseBody = {
//       err:{},
//       data:{},
//       message:"Something Wants Wrong,cannot process the request", // By default
//       sucess:false
// }

// const successResponseBody = {
//       err:{},
//       data:{},
//       message:"Successfully processed the request",
//       sucess:true
// }

// /** 
//     Controller function to Create a new Movie 
//     @param {*} req [name,description,................]
//     @param {*} res
//     @return movie created
//  */


// const createMovie = async (req,res) =>{ 
//     try {
//             // Debugging
           
//             /** console.log("HEADERS:", req.headers);
//                 console.log("BODY:", req.body);
//              */




//          const movie = await Movie.create(req.body);
//          return res.status(201).json({
//              success:true,
//              error:{},
//              data:movie,
//              message:"Successfully created a new movie"
//          })
//     } catch(err) {
//           console.log(err);
//          return res.status(201).json({

//           success:true,
//          error:err,
//              data:{},
//              message:"Something went wrong"
//          });

//     }
// }

// // Fetched the Movies
// const getMovies = async (req,res) =>{
//     try{
         
//    const response = await movieServices.getMovieById(req.params.id);
//    if(response.err) {
//         errorResponseBody.err = response.err;
//         return res.status(response.code).json(errorResponseBody);
//    } 

//    successResponseBody.data = response;
//   return res.status(200).json(successResponseBody);

//     } catch(err) {
//           console.log(err);
//           return res.status(500).json(errorResponseBody);
//     }
// }

// module.exports = {createMovie,getMovies} 

const Movie = require('../model/movie.model');
const movieServices = require('../service/service.movie');

/**
 * Controller function to Create a new Movie
 */

const createMovie = async (req, res) => {
    try {
        const movie = await Movie.create(req.body);

        return res.status(201).json({
            success: true,
            error: {},
            data: movie,
            message: "Successfully created a new movie"
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            success: false,
            error: err,
            data: {},
            message: "Something went wrong"
        });
    }
};


/**
 * Controller function to Fetch Movie By Id
 */

const getMovies = async (req, res) => {
    try {

        const response = await movieServices.getMovieById(req.params.id);

        if (response.err) 
            return res.status(response.code).json({
                success: false,
                error: response.err,
                data: {},
                message: response.message
            });
        

        return res.status(200).json({
            success: true,
            error: {},
            data: response.data,
            message: "Successfully fetched the movie details"
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            success: false,
            error: err,
            data: {},
            message: "Internal Server Error"
        });
    }
};


const deleteMovie  = async (req,res) =>{
    try{
       const response = await Movie.findByIdAndDelete(req.params.movieId);
        return res.status(200).json({
             success:true,
             error:{},
             message:"Successfull deleted the movie",
             data:response
        })
    } catch(err) {
         console.log(err);
         return res.status(500).json({
              success:false,
              error:err,
              message:"Something went wrong",
              data:{}
         });
    }
}


module.exports = {deleteMovie,createMovie,getMovies};