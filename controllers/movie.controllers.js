const Movie = require('../model/movie.model');

/** 
    Controller function to Create a new Movie 
    @param {*} req [name,description,................]
    @param {*} res
    @return movie created
 */

const createMovie = async (req,res) =>{ 
    try {
            // Debugging
           
            /** console.log("HEADERS:", req.headers);
                console.log("BODY:", req.body);
             */




         const movie = await Movie.create(req.body);
         return res.status(201).json({
             success:true,
             error:{},
             data:movie,
             message:"Successfully created a new movie"
         })
    } catch(err) {
          console.log(err);
         return res.status(201).json({

          success:true,
         error:err,
             data:{},
             message:"Something went wrong"
         });

    }
}

module.exports = {createMovie}