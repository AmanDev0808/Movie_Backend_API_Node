
const badRequestResponse = {
     success: false,
     err:"",
     data:{},
     message:"Malformed Request | Bad Request"
}





const validateMovieCreateREquest = async (req,res,next) =>{
        
    // Validate the movie name
    if(!req.body.name) {
         badRequestResponse.err = "The description of the movie is not present in the request";
         return res.status(400).json(badRequestResponse);
    }

    // Validaten the movie description
    if(!req.body.description) {
          badRequestResponse.err = "The description of the movie is not present in the request";
          return res.status(400).json(badRequestResponse);
    }

    // Validate the caste name
    if(!req.body.casts || 
       !(req.body.casts instanceof Array) || 
       req.body.casts.lenght <= 0) 
    {
                 badRequestResponse.err = "The casts of the movie is not present in the request";
                 return res.status(400).json(badRequestResponse);
    }

    // Validate the movie trailer URL
    if(!req.body.trailerUrl) {
         badRequestResponse.err = "The trailerUrl of the movie is not present in the request";
         return res.status(400).json(badRequestResponse);

    }
    // Validate the released date of the movie 
    if(!req.body.releasedDate) {
        badRequestResponse.err = "The releaseDate of the movie is not present int the request";
        return res.status(400).json(badRequestResponse);

    }

      // Validate director  of the movie 
    if(!req.body.director) {
        badRequestResponse.err = "The director of the movie is not present int the request";
        return res.status(400).json(badRequestResponse);

    }
    next();
}

module.exports = { validateMovieCreateREquest }