const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// Team model
const Team = require('../models/Team');

// Login Page
router.get('/login', (req, res) => res.render('login'));

// Register Page
router.get('/registerteam', (req, res) => res.render('registerteam'));

// Register post
router.post('/registerteam', (req, res) => {
  console.log('team post connected')
    const { name, color, password, password2 } = req.body;
    console.log(req.body)
    let errors = [];

    // Check required fields
    if (!name || !color || !password || !password2) {
        errors.push({ msg: 'Proszę wypełnić wszystkie pola' })
    }

    // Check passwords match
    if (password !== password2) {
        errors.push({ msg: 'Hasła nie pasują'});
    }

    // Check pass length
    if(password.length<3) {
        errors.push({ msg: 'Hasło musi posiadać co najmniej 3 znaki'});
    }

    if(errors.length > 0 ) {
        res.render('registerteam', {
            errors,
            name,
            color,
            password,
            password2
        });
    } else {
        // Validation passed
        Team.findOne({ name: name })
            .then(team => {
                if(team){
                    // Team exists
                    errors.push({ msg: 'Taki zespół już istnieje, użyj innej nazwy.'})
                    res.render('registerteam', {
                        errors,
                        name,
                        color,
                        password,
                        password2
                    });
                } else {
                    let newTeam = new Team({
                        name,
                        color,
                        password,
                    });
                    
                    //Hash password
                    bcrypt.genSalt(10, (err, salt) => 
                        bcrypt.hash(newTeam.password, salt, (err, hash) => {
                            if(err) throw err;
                            // Set password to hashed
                            newTeam.password = hash;
                            // Save team
                            newTeam.save()
                            .then(team => {
                                req.flash('success_msg', `Dodałeś nowy team ${team.name}`);
                                res.redirect('/users/login');
                            })
                            .catch(err => console.log(err));
                    }))
                }
        });
    }
});

// Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/teams/login',
      failureFlash: true
    })(req, res, next);
  });
  
  // Logout
  router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Wylogowano');
    res.redirect('/teams/login');
  });

module.exports = router;