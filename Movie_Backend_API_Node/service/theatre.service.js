const Theatre = require('../model/theatre.model');

const createTheatre = async (data)=>{
    try{
           const response = await Theatre.create(data);
           return response;
    } catch(error) {
        if(error.name === 'ValidationError') {
             const validationErrors = {};
             Object.keys(error.errors).forEach((key) => {
                 validationErrors[key] = error.errors[key].message;
             });
             return { err: validationErrors, code: 422 };
        }
        throw error;
    }
};

const getTheatres = () => Theatre.find().sort({ name: 1 });

const updateTheatre = async (id, data) => Theatre.findByIdAndUpdate(id, data, { new: true, runValidators: true });

const deleteTheatre = async (id) => Theatre.findByIdAndDelete(id);

module.exports = { createTheatre, getTheatres, updateTheatre, deleteTheatre };