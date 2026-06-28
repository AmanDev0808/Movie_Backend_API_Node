const Theatre = require('../model/theatre.model');

const createTheatre = async (data)=>{
    try{
           const response = await Theatre.create(data);
           return response;
    } catch(err) {
          console.log(err);
          throw err;
    }
    
}


/**
 * 
 * @param  id -> it is the unique _id based on which we will fetch a theatre
 */
const getTheatre = async (id)=>{
      
     try{
         const response = await Theatre.findById(id);
         if(!response) {
             // no record found for the given id
             return {
                err: "NO Theartre found for the given id",
                code: 404
             }
         }
         return response;
     } catch (error) {
           console.log(error);
           throw error;
     }
}

const getAllTheatre = async()=>{
    try{
        const response = await Theatre.find({});
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
}



module.exports = {createTheatre, getTheatre,getAllTheatre}