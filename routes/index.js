const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Task = require('../models/Task');

//Add JSDOM
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM(`<!DOCTYPE html><p>JSDOM Connected</p>`);
console.log(dom.window.document.querySelector("p").textContent);

// Welcome page
router.get(('/'), (req, res) => res.render('landing', {layout: 'startLayout'}));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
Task.find({}, (err, tasks)=>{
//Task.findOne({taskNumber: "1"}, (err, task)=>{
  if (err){
    console.log("ERROR!");
  } else {
    //res.send({user: req.user})
    res.render('dashboard', {
      user: req.user, info: "informacja", tasks: tasks, team: req.teams
    })
  }
}))

module.exports = router;