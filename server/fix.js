const fs = require('fs');

fs.mkdirSync('models', {recursive: true});
fs.mkdirSync('routes', {recursive: true});
fs.mkdirSync('middleware', {recursive: true});

fs.writeFileSync('models/User.js', `
const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['client', 'freelancer'], default: 'freelancer' }
}, { timestamps: true });
module.exports = mongoose.model('User', UserSchema);
`);

fs.writeFileSync('middleware/auth.js', `
const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
  const token = req.header('x-auth-token') || req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ msg: 'No token, auth denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (e) {
    res.status(401).json({ msg: 'Token not valid' });
  }
};
`);

fs.writeFileSync('routes/auth.js', `
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const router = express.Router();
router.post('/register', [body('name').notEmpty(), body('email').isEmail(), body('password').isLength({min:6})], async (req,res)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
  const {name,email,password,role} = req.body;
  try{
    let user = await User.findOne({email});
    if(user) return res.status(400).json({msg:'User exists'});
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password,salt);
    user = new User({name,email,password:hashed,role});
    await user.save();
    const payload = {user:{id:user.id, role:user.role}};
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn:'5h'});
    res.json({token, user:{id:user.id, name:user.name, role:user.role}});
  }catch(err){ res.status(500).send('Server error'); }
});
router.post('/login', [body('email').isEmail(), body('password').exists()], async (req,res)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
  const {email,password}=req.body;
  try{
    const user = await User.findOne({email});
    if(!user) return res.status(400).json({msg:'Invalid credentials'});
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) return res.status(400).json({msg:'Invalid credentials'});
    const payload = {user:{id:user.id, role:user.role}};
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn:'5h'});
    res.json({token, user:{id:user.id, name:user.name, role:user.role}});
  }catch(err){ res.status(500).send('Server error'); }
});
module.exports = router;
`);

console.log('All files created correctly without BOM');