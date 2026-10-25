// server/clean.js
const mongoose = require('mongoose');
const Bid = require('./models/Bid');
require('dotenv').config();

(async()=>{
  await mongoose.connect(process.env.MONGO_URI);
  const bids = await Bid.find().sort({updatedAt:-1});
  const seen = new Set();
  let del = 0;
  for(const b of bids){
    const key = `${b.project}-${b.freelancer}`;
    if(seen.has(key)){ await Bid.findByIdAndDelete(b._id); del++; }
    else seen.add(key);
  }
  console.log(`Deleted ${del} duplicate bids, kept ${seen.size} latest`);
  process.exit();
})()