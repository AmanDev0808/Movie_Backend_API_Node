const Theatre = require('../model/theatre.model');

/**
 * 
 * @param  data --> object containing details of the theatre to be created 
 * @returns --> object with new theatre details
 */
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


/**
 * 
 * @param  id --> the unique id using which we can identify the theatre to be deleted 
 * @returns --> return the deleted  theatre object
 */

const deleteTheatre  = async(id)=>{
     try{
         const response = await Theatre.findByIdAndDelete(id);
         if(!response) {
            return {
                err: "No record of a Theatre found for the Given Id",
                code: 404
            }
         }
         return response;
     } catch(error) {
         console.log(error);
         throw error;
     }
}


module.exports = {createTheatre, getTheatre,getAllTheatre,deleteTheatre }