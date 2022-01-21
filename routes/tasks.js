const express = require('express');
const router = express.Router();

// Team model
const Task = require('../models/Task');

// Register Page
router.get('/registertask', (req, res) => res.render('registertask'));

// Register post
router.post('/registertask', (req, res) => {
    //console.log('post connected')
    const { title, taskNumber } = req.body;
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
                    errors.push({ msg: 'Taki zadanie już istnieje, użyj innego numeru.'})
                    res.render('registertask', {
                        errors,
                        title,
                        taskNumber
                    });
                } else {
                    let newTask = new Task({
                        title,
                        taskNumber
                    });
                            newTask.save()
                            .then(task => {
                                req.flash('success_msg', 'dodałeś zadanie');
                                res.redirect('/tasks/registertask');
                            })
                            .catch(err => console.log(err));
                }
        });
    }
});

module.exports = router;