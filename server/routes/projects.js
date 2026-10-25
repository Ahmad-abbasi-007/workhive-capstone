const express = require('express');
const Project = require('../models/Project');
const Bid = require('../models/Bid');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req,res)=>{
  const projects = await Project.find().populate('client','_id name').populate('assignedFreelancer','_id name').sort({createdAt:-1});
  res.json(projects);
});

router.post('/', auth, async (req,res)=>{
  const {title, description, budget} = req.body;
  if(!title || !description || !budget) return res.status(400).json({msg:'All fields required'});
  const project = new Project({title, description, budget, client: req.user.id});
  await project.save();
  res.json(project);
});

// EDIT - Only owner and only if open
router.put('/:projectId', auth, async (req,res)=>{
  try{
    const project = await Project.findById(req.params.projectId);
    if(!project) return res.status(404).json({msg:'Not found'});
    if(project.client.toString()!==req.user.id) return res.status(403).json({msg:'Not owner'});
    if(project.status!=='open') return res.status(400).json({msg:'Can only edit open projects'});
    const {title, description, budget} = req.body;
    if(title) project.title = title;
    if(description) project.description = description;
    if(budget) project.budget = budget;
    await project.save();
    res.json(project);
  }catch(e){ res.status(500).json({msg:e.message}) }
});

// DELETE - Only owner and only if open
router.delete('/:projectId', auth, async (req,res)=>{
  try{
    const project = await Project.findById(req.params.projectId);
    if(!project) return res.status(404).json({msg:'Not found'});
    if(project.client.toString()!==req.user.id) return res.status(403).json({msg:'Not owner'});
    if(project.status!=='open') return res.status(400).json({msg:'Can only delete open projects'});
    await Project.findByIdAndDelete(req.params.projectId);
    res.json({msg:'Deleted'});
  }catch(e){ res.status(500).json({msg:e.message}) }
});

router.put('/:projectId/accept/:bidId', auth, async (req,res)=>{
  try {
    const project = await Project.findById(req.params.projectId);
    if(project.client.toString() !== req.user.id) return res.status(403).json({msg:'Not owner'});
    const bid = await Bid.findById(req.params.bidId);
    project.assignedFreelancer = bid.freelancer;
    project.status = 'hired';
    await project.save();
    await Bid.updateMany({project: project._id}, {status:'rejected'});
    bid.status = 'accepted'; await bid.save();
    res.json(project);
  } catch(err){ res.status(500).json({msg:err.message}) }
});

router.put('/:projectId/complete', auth, async (req,res)=>{
  try {
    const project = await Project.findById(req.params.projectId);
    if(project.client.toString() !== req.user.id) return res.status(403).json({msg:'Only owner'});
    if(project.status !== 'hired') return res.status(400).json({msg:'Not hired'});
    project.status = 'completed'; await project.save();
    res.json(project);
  } catch(err){ res.status(500).json({msg:err.message}) }
});

module.exports = router;