const mongoose = require('mongoose');

/**
 * Define the Schema of the movie resoirce to be stored int DB
 */
const movieSchema = new mongoose.Schema({
      name:{
          type: String,
          required:true,
          minLength:2
      },
      description:{
          type:String,
          required:true,
          minLength: 5
      },
      casts:{
        type:[String],
        required:true,
      },
      trailerUrl:{
        type:String,
        required:true
      },
      language:{
        type:String,
        required:true,
        default:"English"
      },
      releasedDate:{
        type:String,
        required:true
      },
      director:{
        type:String,
        required:true
      },
      releaseStatus:{
        type:String,
        required:true,
        default:"RELEASED",
      }
    //   lightMan:{
    //    type:[String],
    //     required:true
    //   },
    //   Verdict:{
    //     type:String,
    //     required:true
    //   }
},{timestamps:true});

const Movie = mongoose.model("Movie", movieSchema);
module.exports = Movie;    // returning the Movie Model