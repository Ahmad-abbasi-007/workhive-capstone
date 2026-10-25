const express = require('express');
const Review = require('../models/Review');
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const router = express.Router();

// Post a review
router.post('/:projectId', auth, async (req,res)=>{
  try {
    const { rating, comment, reviewedId } = req.body;
    const project = await Project.findById(req.params.projectId);
    
    // Check if project is hired/completed and user is part of it
    const isClient = project.client.toString() === req.user.id;
    const isFreelancer = project.assignedFreelancer && project.assignedFreelancer.toString() === req.user.id;
    if(!isClient && !isFreelancer) return res.status(403).json({msg:'Not authorized'});

    const existing = await Review.findOne({ project: req.params.projectId, reviewer: req.user.id });
    if(existing) return res.status(400).json({msg:'You already reviewed'});

    const review = new Review({
      project: req.params.projectId,
      reviewer: req.user.id,
      reviewed: reviewedId,
      rating,
      comment
    });
    await review.save();
    res.json(review);
  } catch(e){ res.status(500).json({msg:e.message}) }
});

// Get reviews for a project
router.get('/:projectId', async (req,res)=>{
  const reviews = await Review.find({ project: req.params.projectId }).populate('reviewer','name role').sort({createdAt:-1});
  res.json(reviews);
});

module.exports = router;