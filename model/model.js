const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
  id: Number,
  first_name: String,
  last_name: String,
  email: String,
  gender: String,
  income: String,
  city: String,
  car: String,
  quote: String,
  phone_price: String
});

const UserModel = mongoose.model('User', userSchema);
module.exports={UserModel}
