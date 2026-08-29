const Location = require('../model/location.model');
const Screen = require('../model/screen.model');
const AuditLog = require('../model/audit.model');
const Movie = require('../model/movie.model');
const Theatre = require('../model/theatre.model');
const Show = require('../model/show.model');
const Booking = require('../model/booking.model');
const { successResponseBody, errorResponseBody } = require('../utils/responsebody');

const getDashboard = async (req, res) => {
  try {
    const [movies, theatres, shows, bookings, customers, auditLogs] = await Promise.all([
      Movie.countDocuments(),
      Theatre.countDocuments({ status: { $ne: 'INACTIVE' } }),
      Show.countDocuments({ status: { $ne: 'CANCELLED' } }),
      Booking.countDocuments({ status: { $in: ['SUCCESS', 'PENDING'] } }),
      require('../model/user.model').countDocuments({ userType: 'CUSTOMER' }),
      AuditLog.find().sort({ createdAt: -1 }).limit(10).populate('adminId', 'name email')
    ]);

    const upcomingMovies = await Movie.countDocuments({ releaseStatus: 'UPCOMING' });
    const cancelledBookings = await Booking.countDocuments({ status: 'CANCELLED' });

    const dashboard = {
      totalMovies: movies,
      upcomingMovies,
      activeTheatres: theatres,
      todaysShows: shows,
      totalBookings: bookings,
      registeredCustomers: customers,
      cancelledBookings,
      recentActivities: auditLogs,
      revenue: await Booking.aggregate([
        { $match: { status: 'SUCCESS' } },
        { $group: { _id: null, total: { $sum: '$totalCost' } } }
      ])
    };

    successResponseBody.data = dashboard;
    successResponseBody.message = 'Admin dashboard fetched successfully';
    return res.status(200).json(successResponseBody);
  } catch (err) {
    errorResponseBody.err = err.message;
    errorResponseBody.message = 'Failed to fetch admin dashboard';
    return res.status(500).json(errorResponseBody);
  }
};

const createLocation = async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    if (!name) {
      errorResponseBody.message = 'Location name is required';
      return res.status(400).json(errorResponseBody);
    }

    const location = await Location.create({
      name,
      city: req.body.city || '',
      state: req.body.state || '',
      country: req.body.country || 'India'
    });

    const audit = await AuditLog.create({
      adminId: req.userId,
      action: 'CREATE_LOCATION',
      entity: 'Location',
      entityId: location._id,
      metadata: { name: location.name }
    });

    successResponseBody.data = { location, audit };
    successResponseBody.message = 'Location created successfully';
    return res.status(201).json(successResponseBody);
  } catch (error) {
    if (error && error.code === 11000) {
      errorResponseBody.err = error.message;
      errorResponseBody.message = 'This location already exists for the same city/state';
      return res.status(409).json(errorResponseBody);
    }

    errorResponseBody.err = error.message;
    errorResponseBody.message = 'Failed to create location';
    return res.status(400).json(errorResponseBody);
  }
};

const getLocations = async (req, res) => {
  try {
    const locations = await Location.find().sort({ createdAt: -1 });
    successResponseBody.data = locations;
    successResponseBody.message = 'Locations fetched successfully';
    return res.status(200).json(successResponseBody);
  } catch (error) {
    errorResponseBody.err = error.message;
    errorResponseBody.message = 'Failed to fetch locations';
    return res.status(500).json(errorResponseBody);
  }
};

const createScreen = async (req, res) => {
  try {
    const screen = await Screen.create({
      theatreId: req.body.theatreId,
      name: req.body.name,
      seatCapacity: Number(req.body.seatCapacity),
      screenType: req.body.screenType || 'STANDARD',
      status: req.body.status || 'ACTIVE'
    });

    const audit = await AuditLog.create({
      adminId: req.userId,
      action: 'CREATE_SCREEN',
      entity: 'Screen',
      entityId: screen._id,
      metadata: { theatreId: screen.theatreId, name: screen.name }
    });

    successResponseBody.data = { screen, audit };
    successResponseBody.message = 'Screen created successfully';
    return res.status(201).json(successResponseBody);
  } catch (error) {
    errorResponseBody.err = error.message;
    errorResponseBody.message = 'Failed to create screen';
    return res.status(400).json(errorResponseBody);
  }
};

const getScreens = async (req, res) => {
  try {
    const screens = await Screen.find().populate('theatreId', 'name city').sort({ createdAt: -1 });
    successResponseBody.data = screens;
    successResponseBody.message = 'Screens fetched successfully';
    return res.status(200).json(successResponseBody);
  } catch (error) {
    errorResponseBody.err = error.message;
    errorResponseBody.message = 'Failed to fetch screens';
    return res.status(500).json(errorResponseBody);
  }
};

const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find().populate('adminId', 'name email').sort({ createdAt: -1 }).limit(50);
    successResponseBody.data = logs;
    successResponseBody.message = 'Audit logs fetched successfully';
    return res.status(200).json(successResponseBody);
  } catch (error) {
    errorResponseBody.err = error.message;
    errorResponseBody.message = 'Failed to fetch audit logs';
    return res.status(500).json(errorResponseBody);
  }
};

module.exports = {
  getDashboard,
  createLocation,
  getLocations,
  createScreen,
  getScreens,
  getAuditLogs
};
