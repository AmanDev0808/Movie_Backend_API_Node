const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie",
        required: true
    },
    theatreId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Theatre",
        required: true
    },
    screenId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Screen",
        required: true
    },
    showDate: {
        type: Date,
        required: true
    },
    showTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'],
        default: 'UPCOMING'
    },
    price: {
        type: Number,
        required: true
    },
    totalSeats: {
        type: Number,
        required: true
    },
    availableSeats: {
        type: Number,
        required: true
    }
}, { timestamps: true });

showSchema.index({ movieId: 1 });
showSchema.index({ theatreId: 1 });
showSchema.index({ screenId: 1 });
showSchema.index({ showDate: 1 });
showSchema.index({ theatreId: 1, screenId: 1, showDate: 1 });

module.exports = mongoose.model("Show", showSchema);
