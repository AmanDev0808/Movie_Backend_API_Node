const dns = require('dns');

dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');
const env = require('dotenv');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const MovieRoutes = require('./routes/movie.routes');
const theatreRoutes = require('./routes/theatre.routes');
const authRoutes = require('./routes/auth.routes');
const showRoutes = require('./routes/show.routes');
const bookingRoutes = require('./routes/booking.routes');
const seatRoutes = require('./routes/seat.routes');
const paymentRoutes = require('./routes/payment.routes');
const adminRoutes = require('./routes/admin.routes');
const screenRoutes = require('./routes/screen.routes');
const morgan = require('morgan');
const cron = require('node-cron');
const Booking = require('./model/booking.model');
const Show = require('./model/show.model');

const path = require("path");

env.config();

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined')); // Better logging

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 300,
    skip: (req) => req.method === 'GET',
    standardHeaders: true,
    legacyHeaders: false
});
app.use(limiter);

// Automatic Expiration of PENDING bookings (every minute)
cron.schedule('* * * * *', async () => {
    console.log("Running Booking Expiration Job...");
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    
    try {
        const expiredBookings = await Booking.find({
            status: "PENDING",
            createdAt: { $lt: tenMinutesAgo }
        });

        for (const booking of expiredBookings) {
            console.log(`Expiring booking ${booking._id}`);
            booking.status = "FAILED";
            await booking.save();
            
            await Show.findByIdAndUpdate(booking.showId, {
                $inc: { availableSeats: booking.seats }
            });
        }
    } catch (err) {
        console.error("Error in Expiration Job:", err);
    }
});

app.get('/home',(req,res)=>{
    return res.json({
          success:true,
          message:"Fetched home"
      });
});

// Register Routes
MovieRoutes(app);
theatreRoutes(app);
authRoutes(app);
showRoutes(app);
bookingRoutes(app);
seatRoutes(app);
paymentRoutes(app);
screenRoutes(app);
adminRoutes(app);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: "Something went wrong!",
        error: process.env.NODE_ENV === 'production' ? {} : err.message
    });
});

const PORT = process.env.PORT || 1917;

const _dirname = path.resolve();
app.use(express.static(path.join( _dirname ,"/frontend/dist")));

app.listen(PORT, async () => {
    console.log(`Server is Running on port number ${PORT}`);
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("Successfully connected to MongoDB");
    } catch (err) {
        console.log("Not able to connect with MongoDB");
        console.error(err);
    }
});
