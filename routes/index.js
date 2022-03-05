const express = require('express');
const router = express.Router();
const {
  ensureAuthenticated
} = require('../config/auth');
const Task = require('../models/Task');
const User = require('../models/User');
const Team = require('../models/Team');

//Add JSDOM
const jsdom = require("jsdom");
const {
  concatSeries
} = require('async');
const {
  JSDOM
} = jsdom;
const dom = new JSDOM(`<!DOCTYPE html><p>JSDOM Connected</p>`);
console.log(dom.window.document.querySelector("p").textContent);

// Welcome page
router.get(('/'), (req, res) => res.render('start', {
  layout: 'startLayout'
}));

//root route
router.get("/landing", (req, res) => {
  res.render("landing");
});

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  Task.find().sort({
    taskNumber: 1
  }).then((tasks) => {
    if (tasks) {
      res.render('dashboard', {
        user: req.user,
        info: "informacja",
        tasks: tasks,
        team: req.teams
      })
    } else {
      console.log("ERROR!")
    }
  })
})

router.get('/:id', ensureAuthenticated, async (req, res) => {
  console.log(req.params.id)

  //const updatedTask = await Task.findById(req.params.id)
  //updatedTask.pointsForTask = 3
  //await updatedTask.save();
  //console.log(updatedTask)

  res.render('dashboardForOne', {
    user: req.user,
    info: "informacja",
    task: updatedTask
  })
})

router.post('/:id', ensureAuthenticated, async (req, res) => {
  console.log("-------" + req.params.id)
  console.log("-------" + req.body.points)
  console.log("-------" + req.json)

  const taskVisibility = await Task.findById({
    _id: req.params.id
  })
  const team = req.user.team

  if (taskVisibility.visibility == 'hidden') {
    res.status(400).send()
  } else {
    let updatedTask = await Task.findByIdAndUpdate({
      _id: req.params.id
    }, {
      $set: {
        pointsForTask: req.body.points,
      }
    }, {
      new: true
    })
    
    if (team == "yellow"){
      updatedTask = await Task.findByIdAndUpdate({
        _id: req.params.id
      }, {
        $set: {
          yellowPointsForTask: req.body.points,
          yellowVisibility: 'hidden'
        }
      }, {
        new: true
      })
    } else if (team == "red"){
      updatedTask = await Task.findByIdAndUpdate({
        _id: req.params.id
      }, {
        $set: {
          redPointsForTask: req.body.points,
          redVisibility: 'hidden'
        }
      }, {
        new: true
      })
    } else if (team == "green"){
      updatedTask = await Task.findByIdAndUpdate({
        _id: req.params.id
      }, {
        $set: {
          greenPointsForTask: req.body.points,
          greenVisibility: 'hidden'
        }
      }, {
        new: true
      })
    }

    // pobrać dane z przycisków i uzyskaną sumę punktów dodać do counter i do DB do pointsForTask
    //updatedTask.pointsForTask = 9;
    console.log(updatedTask)

    console.log(req.user.totalPoints)
    //await updatedTask.save();

    //const result = await User.find(req.user)
    const result = await User.findByIdAndUpdate({
      _id: req.user.id
    }, {
      $inc: {
        totalPoints: updatedTask.pointsForTask
      }
    }, {
      new: true
    })
    console.log(team)

    let ob = {
      success: true,
      pointsForTask: updatedTask.pointsForTask,
      //yellowPointsForTask: updatedTask.pointsForTask,
      //team: result.team,
      totalPoints: result.totalPoints,
      visibility: 'hidden'
    }
    res.json(ob)
  }
})

module.exports = router;