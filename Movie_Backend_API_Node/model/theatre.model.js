const mongoose = require('mongoose');

const theatreSchema = new mongoose.Schema({
      name: {
         type:String,
         required:true,
         minLength:5
      },
      description: String,
      city: {
          type:String,
          required:true
      },
      pincode: {
        type:Number,
        required:true
      },
      address: String,
      locationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        default: null
      },
      status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE'],
        default: 'ACTIVE'
      }
},{timestamps: true});

const Theatre = mongoose.model('Theatre',theatreSchema);
module.exports = Theatre;