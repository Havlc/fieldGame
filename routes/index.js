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
        team: req.teams,
        visibility: calculateVisibilityMap(req.user, tasks),
        pointsForTask: calculatePointsMap(req.user, tasks)
      })
    } else {
      console.log("ERROR!")
    }
  })
})


function calculateVisibilityMap(user, tasks) {
  let visibilityMap = new Map();
  const userColor = user.team;
  tasks.forEach(task => {
    let teamResult = task.teamResults.find(x => x.team == userColor);
    if(teamResult){
      visibilityMap.set(task._id, teamResult.visibility)
    }
    else {
      visibilityMap.set(task._id, 'display')
    }
  });
  return visibilityMap;
}

function calculatePointsMap(user, tasks) {
  let pointsMap = new Map();
  const userColor = user.team;
  tasks.forEach(task => {
    let teamResult = task.teamResults.find(x => x.team == userColor);
    if(teamResult){
      pointsMap.set(task._id, teamResult.pointsForTask)
    }
    else {
      pointsMap.set(task._id, 0)
    }
  });
  return pointsMap;
}

router.get('/scoreboard', ensureAuthenticated, async (req, res) => {
  let team = await Team.find().sort({
    totalPoints: -1
  }).then((team) => team)
  console.log(team)

  User.find().sort({
    totalPoints: -1
  }).then((users) => {
    if (users) {
      res.render('scoreboard', {
        user: req.user,
        users: users,
        team: team
      })
    } else {
      console.log("ERROR!")
    }
  })
})


router.get('/:id', ensureAuthenticated, async (req, res) => {
  console.log(req.params.id)

  res.render('dashboardForOne', {
    user: req.user,
    info: "informacja",
    task: updatedTask
  })
})

router.post('/:id/hintOne', ensureAuthenticated, async (req, res) => {
  const team = req.user.team
  if (!await Task.exists({
      "_id": req.params.id,
      "teamResults.team": team
    })) {
    await Task.findByIdAndUpdate({
      _id: req.params.id
    }, {
      $push: {
        "teamResults": {"team": team}
      }
    }, {
      new: true
    })
  }

  await Task.findOneAndUpdate({
    "_id": req.params.id,
    "teamResults.team": team
  }, {
    "$set": {
      "teamResults.$.hintOneClicked": true,
    }
  }, {
    new: true
  });

  let ob = {
    success: true
  }
  res.json(ob)
})

router.post('/:id', ensureAuthenticated, async (req, res) => {
  console.log("-------" + req.params.id)
  console.log("-------" + req.body.points)
  console.log("-------" + req.json)


  const team = req.user.team
  let taskVisibility = "display";
  if (!await Task.exists({
      "_id": req.params.id,
      "teamResults.team": team
    })) {
    await Task.findByIdAndUpdate({
      _id: req.params.id
    }, {
      $push: {
        "teamResults": {"team": team}
      }
    }, {
      new: true
    })
  }
  else {
    let currentTask = await Task.findById({
      _id: req.params.id,
    })
    taskVisibility = currentTask.teamResults.find(teamResult => teamResult.team == team).visibility
  }

   if (taskVisibility == 'hidden') {
    res.status(400).send()
  } else {
    const updatedTeamResult = await Task.findOneAndUpdate({
      "_id": req.params.id,
      "teamResults.team": team
    }, {
      "$set": {
        "teamResults.$.pointsForTask": req.body.points,
        "teamResults.$.visibility": "hidden"
      }
    }, {
      new: true
    });

    await User.findByIdAndUpdate({
      _id: req.user.id
    }, {
      $inc: {
        totalPoints: req.body.points
      }
    }, {
      new: true
    });

    const updatedTeam = await Team.findOneAndUpdate({
      color: team
    }, {
      $inc: {
        totalPoints: req.body.points
      }
    }, {
      new: true
    })
    console.log(updatedTeam)
    let ob = {
      success: true,
      pointsForTask: req.body.points,
      totalPoints: updatedTeam.totalPoints,
      visibility: 'hidden'
    }
    res.json(ob)
  };
})

module.exports = router;