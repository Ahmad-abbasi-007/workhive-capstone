const express = require('express');
const Message = require('../models/Message');
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const router = express.Router();

// GET messages for a project - sirf owner client ya hired freelancer dekh sakta hai
router.get('/:projectId', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if(!project) return res.status(404).json({msg:'Project not found'});
    
    const isClient = project.client.toString() === req.user.id;
    const isFreelancer = project.assignedFreelancer && project.assignedFreelancer.toString() === req.user.id;
    
    if(!isClient && !isFreelancer) return res.status(403).json({msg:'Not authorized for chat'});
    
    const messages = await Message.find({ project: req.params.projectId })
      .populate('sender','name')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch(err){ res.status(500).json({msg:err.message}) }
});

// POST new message
router.post('/:projectId', auth, async (req, res) => {
  try {
    const { text, receiverId } = req.body;
    const project = await Project.findById(req.params.projectId);
    
    const isClient = project.client.toString() === req.user.id;
    const isFreelancer = project.assignedFreelancer && project.assignedFreelancer.toString() === req.user.id;
    if(!isClient && !isFreelancer) return res.status(403).json({msg:'Not authorized'});

    const message = new Message({
      project: req.params.projectId,
      sender: req.user.id,
      receiver: receiverId,
      text
    });
    await message.save();
    const populated = await message.populate('sender','name');
    res.json(populated);
  } catch(err){ res.status(500).json({msg:err.message}) }
});

module.exports = router;