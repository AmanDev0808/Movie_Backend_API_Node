const Show = require('../model/show.model');
const Screen = require('../model/screen.model');
const Theatre = require('../model/theatre.model');
const Movie = require('../model/movie.model');

const createShow = async (data) => {
    try {
        const movie = await Movie.findById(data.movieId);
        if (!movie) {
            const error = new Error('Movie not found');
            error.statusCode = 404;
            throw error;
        }

        const theatre = await Theatre.findById(data.theatreId);
        if (!theatre) {
            const error = new Error('Theatre not found');
            error.statusCode = 404;
            throw error;
        }

        const screen = await Screen.findById(data.screenId);
        if (!screen || String(screen.theatreId) !== String(data.theatreId)) {
            const error = new Error('Selected screen does not belong to the selected theatre');
            error.statusCode = 400;
            throw error;
        }

        if (!data.showTime || !data.endTime) {
            const error = new Error('Show start time and end time are required');
            error.statusCode = 400;
            throw error;
        }

        const startMins = timeToMinutes(data.showTime);
        const endMins = timeToMinutes(data.endTime);

        if (Number.isNaN(startMins) || Number.isNaN(endMins) || startMins >= endMins) {
            const error = new Error('Show start time must be earlier than end time');
            error.statusCode = 400;
            throw error;
        }

        const showDate = new Date(data.showDate);
        if (Number.isNaN(showDate.getTime()) || showDate < new Date(new Date().setHours(0,0,0,0))) {
            const error = new Error('Show date cannot be in the past');
            error.statusCode = 400;
            throw error;
        }

        const totalSeats = Number(data.totalSeats);
        if (!Number.isFinite(totalSeats) || totalSeats <= 0) {
            const error = new Error('Total seats must be a positive number');
            error.statusCode = 400;
            throw error;
        }

        const price = Number(data.price);
        if (!Number.isFinite(price) || price <= 0) {
            const error = new Error('Price must be a positive number');
            error.statusCode = 400;
            throw error;
        }

        const overlapping = await Show.findOne({
            theatreId: data.theatreId,
            screenId: data.screenId,
            showDate: showDate,
            status: { $ne: 'CANCELLED' }
        });

        if (overlapping) {
            const existingStart = timeToMinutes(overlapping.showTime);
            const existingEnd = timeToMinutes(overlapping.endTime || overlapping.showTime);
            if (!(endMins <= existingStart || startMins >= existingEnd)) {
                const error = new Error('This screen already has an overlapping show scheduled at that time');
                error.statusCode = 409;
                throw error;
            }
        }

        const show = await Show.create({
            ...data,
            totalSeats,
            price,
            availableSeats: data.availableSeats ?? totalSeats,
            status: data.status || 'UPCOMING'
        });

        return show;
    } catch (err) {
        throw err;
    }
};

const timeToMinutes = (time) => {
    if (!time || typeof time !== 'string') return Number.NaN;
    const [t, meridiem] = time.split(' ');
    const [hours, minutes] = t.split(':').map(Number);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return Number.NaN;
    let total = hours * 60 + minutes;
    if (meridiem && meridiem.toUpperCase() === 'PM' && hours !== 12) total += 12 * 60;
    if (meridiem && meridiem.toUpperCase() === 'AM' && hours === 12) total -= 12 * 60;
    return total;
};

const getShows = async (filter) => {
    try {
        const shows = await Show.find(filter).populate('movieId').populate('theatreId');
        return shows;
    } catch (err) {
        throw err;
    }
};

const getShowById = async (id) => {
    try {
        const show = await Show.findById(id).populate('movieId').populate('theatreId');
        return show;
    } catch (err) {
        throw err;
    }
};

const updateShow = async (id, data) => {
    try {
        const show = await Show.findByIdAndUpdate(id, data, { new: true });
        return show;
    } catch (err) {
        throw err;
    }
};

const deleteShow = async (id) => {
    try {
        const show = await Show.findByIdAndDelete(id);
        return show;
    } catch (err) {
        throw err;
    }
};

module.exports = {
    createShow,
    getShows,
    getShowById,
    updateShow,
    deleteShow
};
