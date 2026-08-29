const Screen = require('../model/screen.model');
const Theatre = require('../model/theatre.model');
const { successResponseBody, errorResponseBody } = require('../utils/responsebody');

const createScreen = async (req, res) => {
  try {
    const theatre = await Theatre.findById(req.body.theatreId);
    if (!theatre) {
      errorResponseBody.message = 'Theatre not found';
      return res.status(404).json(errorResponseBody);
    }

    const screen = await Screen.create({
      theatreId: req.body.theatreId,
      name: req.body.name,
      seatCapacity: Number(req.body.seatCapacity),
      screenType: req.body.screenType || 'STANDARD',
      status: req.body.status || 'ACTIVE'
    });

    successResponseBody.data = screen;
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

module.exports = { createScreen, getScreens };
