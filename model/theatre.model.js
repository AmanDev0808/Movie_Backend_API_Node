const mongoose  = required('mongoose');
/**
 * Defines the Schema of theatre resource to be stored int the DB
 */

const theatreSchema = new mongoose.Schema({
      name: {
         type:String,
         required:true
      },
      description: String ,
      city: {
          type:String,
          required:true
      },
      pincode: {
        type:Number,
        required:true
      },
      address: String
},{timestamps: true});

const Theatre = mongoose.model('Theatre',theatreSchema);
module.exports = Theatre;