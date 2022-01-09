const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');


// user model
const User = require('../models/User');

// Login Page
router.get('/login', (req, res) => res.render('login'));

// Register Page
router.get('/register', (req, res) => res.render('register'));

// Register post
router.post('/register', (req, res) => {
    const { name, email, password, password2, rank } = req.body;
    let errors = [];

    // Check required fields
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Proszę wypełnić wszystkie pola' })
    }

    // Check passwords match
    if (password !== password2) {
        errors.push({ msg: 'Hasła nie pasują'});
    }

    // Check pass length
    if(password.length<6) {
        errors.push({ msg: 'Hasło musi posiadać co najmniej 6 znaków'});
    }

    if(errors.length > 0 ) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        // Validation passed
        User.findOne({ email: email })
            .then(user => {
                if(user){
                    // User exists
                    errors.push({ msg: 'Taki email już istnieje, użyj innego adresu lub funkcji przypomninania hasła.'})
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password,
                        rank
                    });
                    
                    //Hash password
                    bcrypt.genSalt(10, (err, salt) => 
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if(err) throw err;
                            // Set password to hashed
                            newUser.password = hash;
                            // Save user
                            newUser.save()
                            .then(user => {
                                req.flash('success_msg', 'Zarejestrowałeś się, możesz się teraz zalogować');
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
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, res, next);
  });
  
  // Logout
  router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Wylogowano');
    res.redirect('/users/login');
  });
    
module.exports = router;