const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },    
    password:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    },
    rank:{
        type: String,
        default: 'szeregowy'
    },
    team: {
        type: String,
        default: 'white'
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isAdmin:{
        type: Boolean,
        default: false
    },
    totalPoints: {
        type: Number
    }
});

UserSchema.plugin(passportLocalMongoose)
const User = mongoose.model('User', UserSchema);

module.exports = User;