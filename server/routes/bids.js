const express = require('express');
const Bid = require('../models/Bid');
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/:projectId', auth, async (req,res)=>{
  try {
    const {amount, proposal} = req.body;
    let bid = await Bid.findOne({project:req.params.projectId, freelancer:req.user.id});
    if(bid){
      bid.amount = amount; bid.proposal = proposal; await bid.save();
      return res.json(bid);
    }
    bid = new Bid({project:req.params.projectId, freelancer:req.user.id, amount, proposal});
    await bid.save();
    await Project.findByIdAndUpdate(req.params.projectId, {$addToSet:{bids:bid._id}});
    res.json(bid);
  } catch(err){ res.status(500).json({msg:err.message}) }
});

router.get('/:projectId', auth, async (req,res)=>{
  const allBids = await Bid.find({project:req.params.projectId}).populate('freelancer','name email').sort({updatedAt:-1});
  const unique=[]; const map=new Map();
  for(const b of allBids){
    if(!b.freelancer) continue;
    const key=b.freelancer._id.toString();
    if(!map.has(key)){ map.set(key,true); unique.push(b); }
  }
  res.json(unique);
});

module.exports = router;