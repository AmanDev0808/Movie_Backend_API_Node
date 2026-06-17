const express = require('express');
const env = require('dotenv');
const mongoose = require('mongoose');
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
    } catch (err) {
        console.log("Not able to connect with MongoDB");
        console.error(err);
    }
});