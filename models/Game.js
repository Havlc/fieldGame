const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");

const GameSchema = new mongoose.Schema({
    started: {
        type: Boolean,
        required: true,
        default: false
    },
    uuid: {
        type: String,
        required: true,
        unique: true
    }
});

GameSchema.plugin(passportLocalMongoose)
const Game = mongoose.model('Game', GameSchema);

module.exports = Game;