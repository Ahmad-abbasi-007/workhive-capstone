const mongoose = require('mongoose');
const ProjectSchema = new mongoose.Schema({
  title: String,
  description: String,
  budget: Number,
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  bids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bid' }],
  assignedFreelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  status: { type: String, enum: ['open','hired','completed'], default: 'open' }
}, { timestamps: true });
module.exports = mongoose.model('Project', ProjectSchema);