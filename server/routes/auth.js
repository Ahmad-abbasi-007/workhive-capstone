const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/register', async (req,res)=>{
  const {name,email,password,role} = req.body;
  try {
    let user = await User.findOne({email});
    if(user) return res.status(400).json({msg:'User exists'});
    const hash = await bcrypt.hash(password,10);
    user = new User({name,email,password:hash,role});
    await user.save();
    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET || 'secret123');
    res.json({token, user:{_id:user._id, name:user.name, email:user.email, role:user.role}});
  } catch(e){ res.status(500).json({msg:e.message}) }
});

router.post('/login', async (req,res)=>{
  const {email,password} = req.body;
  try {
    const user = await User.findOne({email});
    if(!user) return res.status(400).json({msg:'User not found'});
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) return res.status(400).json({msg:'Wrong password'});
    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET || 'secret123');
    res.json({token, user:{_id:user._id, name:user.name, email:user.email, role:user.role}});
  } catch(e){ res.status(500).json({msg:e.message}) }
});
module.exports = router;