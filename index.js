const express = require('express');
const env = require('dotenv');
const mongoose = require('mongoose');


const MovieRoutes = require('./routes/movie.routes');




env.config();

const app = express();

app.get('/home',(req,res)=>{
    console.log("Hitting /home");
    return res.json({
          success:true,
          message:"Fetched home"
      });
});



app.use(express.json());   // <-- ADD THIS
/**
 *   Step 4: Register Middleware
         You added:
         app.use(express.json());
         This tells Express:
         "Whenever JSON comes from Postman, convert it into req.body."
          Without it:
          req.body = {}
          With it:
          req.body = {name: "Jhund"}
 */
MovieRoutes(app);  // invoking in movie routers


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