const Movie = require('../model/movie.model');



/**
 * 
 * @param data --> object containing details of the new movie to be created
 * @returns --> return the new movie objected created
 */
const createMovie = async (data) =>{
       try {
            const movie = await Movie.create(data);
            return movie;
       } catch(error) {
              
               if(error.name == 'ValidationError') {
                       let err = {}
                       Object.keys(error).forEach((key)=>{
                          console.log(error.errors);
                          err[key] = cc[key].message;
                       });
                       console.log(err);
                       return {err:err,code:422}
               } else {
                     throw new error;
               }
              
       }
}

/**
 * 
 * @param  id --> id which will be used to identify the movie to be deleted
 * @returns -> object containig detail of the movie created
 */

const deleteMovie = async (id)=>{
    try{
     const response = await Movie.findByIdAndDelete(id);
     if(!response) {
         return {
            err: "No movie found for the id provided",
            code:404
         }
     }
     return response;
    } catch(error) {
            console.log(error);
            throw error;
    }

}

/**
 * 
 * @param  id -->id which will be used to identitfy the movie to be fetched
 * @returns -> object containing movie fetched
 */
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

/**
 * 
 * @param  id -->id which will be used to identify the movie to be updated 
 * @param  data --> object that contains actual data which is to be updated in the db
 * @returns --> return the new updted moviues detail
 */

const updateMovie = async (id,data) =>{
    try{
           const movie = await Movie.findByIdAndUpdate(id,data,{new:true , runValidators:true});
           return movie;

    } catch(error) {
        if(error.name == 'ValidationError') {
            let err = {};
            Object.keys(error.errors).forEach((key)=>{
                  err[key] = error.errors[key].message;
            });
            console.log(err);
            return {err:err,code:422};
        } else {
             throw error;
        }
    }
}

/**
 * 
 * @param filter -->filtyer will help us in filtering out data based on the conditionals
 * @returns -> return an object containing all the  movie fetched based on the filter
 */

const fetchMovies = async (filter)=>{
     let query = {};
    
    if(filter.name) {
        query.name = filter.name;
     }
     let movies = await Movie.find(query);
     if(!movies) {
          return {
              err: 'Not able to find the queries movies',
              code:404
          }
     }
     return movies;
     
}

module.exports = {getMovieById ,createMovie ,deleteMovie,updateMovie,fetchMovies} 
