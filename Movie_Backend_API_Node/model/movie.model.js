const mongoose = require('mongoose');

/**
 * Define the Schema of the movie resource to be stored in DB
 */
const movieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2
  },

  description: {
    type: String,
    required: true,
    minLength: 5
  },

  casts: {
    type: [String],
    required: true
  },

  trailerUrl: {
    type: String,
    required: true
  },

  language: {
    type: String,
    required: true,
    default: "English"
  },

  releasedDate: {
    type: String,
    required: true
  },

  director: {
    type: String,
    required: true
  },

  releaseStatus: {
    type: String,
    required: true,
    default: "RELEASED"
  },

  // NEW FIELDS
  poster: {
    type: String,
    default: ""
  },

  genre: {
    type: String,
    default: ""
  },

  duration: {
    type: String,
    default: ""
  },

  rating: {
    type: Number,
    default: 0
  }

}, { timestamps: true });

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;