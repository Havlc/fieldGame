const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");

const TeamSchema = new mongoose.Schema({
    color: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    avatar:{
        type: String,
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
    images: [Array],
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isActive:{
        type: Boolean,
        default: false
    },
    totalPoints: {
        type: Number,
        default: 0
    },
    members: [Array]
});

TeamSchema.plugin(passportLocalMongoose)
const Team = mongoose.model('Team', TeamSchema);

module.exports = Team;