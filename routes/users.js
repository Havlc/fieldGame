const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const async = require('async');
const nodemailer = require('nodemailer');
const crypto = require('crypto');


// user model
const User = require('../models/User');
const { GMAILUSER, GMAILPW } = require('../config/keys');

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

  // Forgot password
  router.get('/forgot', (req, res) => {
      res.render('forgot');
  });

  router.post('/forgot', (req, res, next) => {
    async.waterfall([
        function(done) {
            crypto.randomBytes(20, (err, buf) => {
                let token = buf.toString('hex');
                done(err, token);
            });
        },
        function (token, done) {
            User.findOne ({ email: req.body.email }, function (err, user) {
               /* console.log(user)
                console.log(req.body.email)
                console.log(err)*/

                //Nie działa komunikat
                if(!user){
                    req.flash('error_msg', `Konto przypisane do ${user.email} nie istnieje`);
                    return res.redirect('/users/forgot');
                }
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000 // 1hour

                user.save( (err) => {
                    done(err, token, user);
                });
            });
        }, 
        function (token, user, done) {
            const smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth:{ 
                    user: GMAILUSER,
                    pass: GMAILPW
                 }
            });
            const mailOptions = {
                to: user.email,
                from: GMAILUSER,
                subject: 'Gra terenowa - reset hasła',
                text: `Otrzymałeś wiadomość ponieważ została zgłoszona prośba o reset hasła. Kliknij proszę na poniższy link by zresetować hasło 
                http://${req.headers.host}/users/reset/${token}\n\n Jeśli to nie Twoja prośba, zignoruj email, Twoje hasło pozostanie bez zmian`
            };
            smtpTransport.sendMail(mailOptions, (err) => {
                console.log('mail sent');
                req.flash('success_msg', `Email zawierający dalsze instrukcje został wysłany do ${user.email}`);
                done(err, 'done');
            })
        }
    ], function (err) {
        if (err) return next(err);         
        res.redirect('/users/login');
      });
    }); 
    
    router.get('/reset/:token', function(req, res) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
            //console.log(user)
          if (!user) {
            req.flash('error', 'Token do resetu hasła jest nieprawidłowy lub wygasł.');
            return res.redirect('/users/forgot');
          }
          res.render('reset', {token: req.params.token});   
        });
      });
      
      router.post('/reset/:token', function(req, res) {
          //console.log(req.params.token)
        async.waterfall([
          function(done) {
            User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
              
              if (!user) {
                req.flash('error', 'Token do resetu hasła jest nieprawidłowy lub wygasł.');
                return res.redirect('back');
              }
              // NIE ZMIENIA HASŁA
              if(req.body.password === req.body.confirm) {              
                user.setPassword(req.body.password, function(err) {
                  bcrypt.genSalt(10, function(err, salt) {
                    if (err) return /*next(*/err//);
                
                    console.log('old Password is ' + user.password)
                    console.log('new Password is ' + req.body.password)
                    console.log('Salt is ' + salt)
                    bcrypt.hash(req.body.password, salt, function(err, hash) {
                      if (err) { 
                        console.log(err)
                        return /*next(*/err//);
                      }
                      console.log('Set new hash: ' + hash)
                      user.password = hash;
                      console.log("user in now " + user)
                      //next();
                    }, function(progress) {
                      if (progress === 1)
                      {
                        user.resetPasswordToken = undefined;
                        user.resetPasswordExpires = undefined;
                        console.log(user.password)
                        user.save(function(err) {
                          console.log("saving to mongo this user " + user)
                          console.log(err)
                          req.login(user, function(err) {
                            console.log("Error db save")
                            console.log(err)
                            console.log(user)
                            done(err, user);
                          });
                        });
                      }
                    });
                  });  
         
                })
              } else {
                  req.flash("error", "Hasła nie pasują.");
                  return res.redirect('back');
              }
            });
          },
          function(user, done) {
            const smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth:{ 
                    user: GMAILUSER,
                    pass: GMAILPW
                 }
            });
            const mailOptions = {
                to: user.email,
                from: GMAILUSER,
              subject: 'Twoje hasło zostało zmienione',
              text: 'Witaj,\n\n' +
              `Ta wiadomość to potwierdzenie, że hasło do Twojego konta ${user.email} zostało zmienione\n`
            };
            smtpTransport.sendMail(mailOptions, function(err) {
              req.flash('success', 'Sukces! Twoje hasło zostało zmienione.');
              done(err);
            });
          }
        ], function(err) {
          res.redirect('/dashboard');
        });
      });
      

module.exports = router;