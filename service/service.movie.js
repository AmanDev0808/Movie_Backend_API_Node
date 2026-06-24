const Movie = require('../model/movie.model');

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

module.exports = {getMovieById ,createMovie ,deleteMovie,updateMovie} 
