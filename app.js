const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

//Passport config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').MongoURI;
const User = require('./models/User');

// Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Bodyparser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

//Global vars
app.use((req,res,next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/teams', require('./routes/teams'));
app.use('/tasks', require('./routes/tasks'));
/*
//Team management
pickTeam("blue")
async function pickTeam(color){
    try {
        //const user = await User.findById("61e72d37a18c3fcb8da760a7")
        const user = await User.findOne({ name: "test"})
        console.log(user)
        user.team = color
        await user.save()
        console.log(user)
    } catch (error) {
        console.log(error.message)
    }
}

makeTeam()
async function makeTeam(color){

}*/

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on  ${PORT}`));