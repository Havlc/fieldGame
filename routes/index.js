const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Task = require('../models/Task');

// Welcome page
router.get(('/'), (req, res) => res.render('landing', {layout: 'startLayout'}));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
Task.find({}, (err, tasks)=>{
//Task.findOne({taskNumber: "1"}, (err, task)=>{
  if (err){
    console.log("ERROR!");
  } else {
    res.render('dashboard', {
      user: req.user, info: "informacja", tasks: tasks
    })
  }
}))

module.exports = router;