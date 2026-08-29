const {errorResponseBody} = require('../utils/responsebody');
const validateTheatreCreateREquest = async (req,res,next) =>{
      
    //Valide the presence of name
       if(!req.body.name) {
           errorResponseBody.message = "The name of the theatre is not present";
           return res.status(400).json(errorResponseBody)
       }

       // Validate the presemce of pincode
       if(!req.body.pincode) {
           errorResponseBody.message = "The pincode of the theatre is not present";
           return res.status(400).json(errorResponseBody)
       }

       // Validate the presemce of city
       if(!req.body.city) {
           errorResponseBody.message = "The city of the theatre is not present";
           return res.status(400).json(errorResponseBody)
       }
       next();
}

module.exports = {validateTheatreCreateREquest}