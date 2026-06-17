const express = require('express');
const env = require('dotenv');
const mongoose = require('mongoose');
const Movie = require('./model/movie.model');
env.config();

const app = express();

app.get('/home',(req,res)=>{
    console.log("Hitting /home");
    return res.json({
          success:true,
          message:"Fetched home"
      });
});


app.listen(process.env.PORT, async () => {
    console.log(`Server is Running on port number ${process.env.PORT}`);

    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("Successfully connected to MongoDB");

  /**     await Movie.create({
              name:"Bacchan Pandey",
              description:"Comedy ,masala Movie",
              casts:["Akshay Kumar","Kriti Sanon","Jaqueline Fernandiz"],
              director:"Farhad Samji",
              trailerUrl:"http://BacchanPandey/trailers/1",
              releasedDate:"18-03-2022",
              releaseStatus:"RELEASED",
             lightMan:["Pratham Mishra","Praveen Tiwari"],
              Verdict:"Average",
        }); 
        */

    } catch (err) {
        console.log("Not able to connect with MongoDB");
        console.error(err);
    }
});