const express = require('express');
const router = express.Router();

// Task model
const Task = require('../models/Task');

// Register Page
router.get('/registertask', (req, res) => res.render('registertask', {layout: 'startLayout'}));

// Register post
router.post('/registertask', (req, res) => {
    //console.log('post connected')
    const { title, taskNumber, content, firstHint, secondHint, solution } = req.body;
    //console.log(req.body)
    let errors = [];

    // Check required fields
    if (!title || !taskNumber) {
        errors.push({ msg: 'Proszę wypełnić wszystkie pola' })
    }

    if(errors.length > 0 ) {
        res.render('registertask', {
            errors,
            title,
            taskNumber
        });
    } else {
        // Validation passed
        Task.findOne({ taskNumber: taskNumber})
            .then(task => {
                if(task){
                    // Task exists
                    errors.push({ msg: 'Takie zadanie już istnieje, użyj innego numeru.'})
                    res.render('registertask', {
                        errors,
                        title,
                        taskNumber,
                        content, 
                        firstHint, 
                        secondHint, 
                        solution
                    });
                } else {
                    let newTask = new Task({
                        title,
                        taskNumber,
                        content, 
                        firstHint, 
                        secondHint, 
                        solution
                    });
                            newTask.save()
                            .then(task => {
                                req.flash('success_msg', 'dodałeś zadanie');
                                res.redirect('/tasks/registertask');                        
              })
                            .catch(err => console.log(err));   }
        });
    }
});

module.exports = router;