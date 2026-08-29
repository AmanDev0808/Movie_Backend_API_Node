const theatreService = require('../service/theatre.service');
const { successResponseBody, errorResponseBody} = require('../utils/responsebody');



const create = async (req,res)=>{
     try{
      const response = await theatreService.createTheatre(req.body);
      if(response.err) {
          errorResponseBody.err = response.err;
          errorResponseBody.message = "Validation failed on few parameter of the request body";
          return res.status(response.code).json(errorResponseBody);
      }
      successResponseBody.data = response;
      successResponseBody.message ="Successfully Created the theatre:";
      return res.status(201).json(successResponseBody);
      
     } catch(error) {
          errorResponseBody.err = error;
          return res.status(500).json(errorResponseBody);
     }
}

const list = async (req, res) => {
     try {
          const response = await theatreService.getTheatres();
          return res.status(200).json({ success: true, data: response, message: 'Theatres fetched successfully' });
     } catch (error) {
          return res.status(500).json({ success: false, message: 'Failed to fetch theatres' });
     }
};

const update = async (req, res) => {
     try {
          const response = await theatreService.updateTheatre(req.params.id, req.body);
          if (!response) return res.status(404).json({ success: false, message: 'Theatre not found' });
          return res.status(200).json({ success: true, data: response, message: 'Theatre updated successfully' });
     } catch (error) {
          return res.status(400).json({ success: false, message: 'Failed to update theatre' });
     }
};

const remove = async (req, res) => {
     try {
          const response = await theatreService.deleteTheatre(req.params.id);
          if (!response) return res.status(404).json({ success: false, message: 'Theatre not found' });
          return res.status(200).json({ success: true, data: response, message: 'Theatre deleted successfully' });
     } catch (error) {
          return res.status(400).json({ success: false, message: 'Failed to delete theatre' });
     }
};

module.exports = { create, list, update, remove };