const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['client','freelancer'], default: 'client' }
}, { timestamps: true });
module.exports = mongoose.model('User', UserSchema);