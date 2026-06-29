const theatreService = require('../service/theatre.service');
const { successResponseBody, errorResponseBody} = require('../utils/responsebody');



const create = async (req,res)=>{
     try{
      const response = await theatreService.createTheatre(req.body);
      successResponseBody.data = response;
      successResponseBody.message ="Successfully Created the theatre:";
      return res.status(201).json(successResponseBody);
      
     } catch(error) {
          errorResponseBody.err = error;
          return res.status(500).json(errorResponseBody);
     }
}
const getTheatre = async (req, res) => {
    try {
        const response = await theatreService.getTheatre(req.params.id);

        if (response.err) {
            errorResponseBody.err = response.err;
            return res.status(response.code).json(errorResponseBody);
        }

        successResponseBody.data = response;
        successResponseBody.message = "Successfully fetched the data of the theatre";

        return res.status(200).json(successResponseBody);

    } catch (error) {
        errorResponseBody.err = error;
        return res.status(500).json(errorResponseBody);
    }
};


const getTheatres = async (req,res) =>{
     try{
          const response = await theatreService.getAllTheatre();
          successResponseBody.data = response;
          successResponseBody.message = "Successsfully fetched all Theartre";
          return res.status(200).json(successResponseBody);

     } catch(error) {
          errorResponseBody.err = error;
          return res.status(500).json(errorResponseBody);
     }
}

const destroy = async (req,res)=>{
      try{
          const response = await theatreService.deleteTheatre(req.params.id);
          if(response.err) {
               errorResponseBody.err = Response.err;
               return res.status(response.code).json(errorResponseBody);
          }
          successResponseBody.data = response;
          successResponseBody.message = "Successfully deleted the given threatre";
          return res.status(200).json(successResponseBody);

      } catch(error) {
           errorResponseBody.err = error;
           return res.status(500).json(errorResponseBody);
      }
}

module.exports = { create, getTheatre,getTheatres,destroy};