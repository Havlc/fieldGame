const mongoose = require('mongoose');
//const passportLocalMongoose = require("passport-local-mongoose");

const TaskSchema = new mongoose.Schema({
    taskNumber:{
        type: Number,
        required: true,
        unique: true
    },
    avatar:{
        type: String,
        //required: true
    },
    code: {
        type: String,
        //required: true
    },
    title: {
        type: String,
        //required: true
    },
    type:{
        type: String,
        //required: true,
    },
    location: {
        type: String,
        //required: true,
    },
    mapImage:{
        type: String,
        //required: true
    },
    qrCode: {
        type: String,
    },
    images: [Array],
    content: {
        type: String,
        //required: true
    },
    firstHint:{
        type: String,
        //required: true
    },
    secondHint:{
        type: String,
        //required: true
    },
    solution:{
        type: String,
        //required: true
    },
    pointsToEarn:{
        type: Number,
        default: 10
    },
    pointsForTask:{
        type: Number,
        default: 0
    },
    teamResults: [{
        hintOneClicked: {
            type: Boolean,
            default: false
        },
        hintTwoClicked: {
            type: Boolean,
            default: false
        },
        SolutioneClicked: {
            type: Boolean,
            default: false
        },
        pointsForTask: {
            type: Number,
            default: 0
        },
        visibility: {
            type: String,
            default: "visible"
        },
        team: {
            type: String
        }
    }],
    date:{
        type: Date,
        default: Date.now
    },
    link:{
        type: String
    },
    nextTask:{
        type: String
    }

});

//TaskSchema.plugin(passportLocalMongoose)
const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;