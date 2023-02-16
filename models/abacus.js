const mongoose = require('mongoose');

const abacusSchema=new mongoose.Schema({

    name: {type: String, required: true},
    description: {type: String,required: true},
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true},
    eventType: {type: String, required: true},
    participants: [{name:{type: String},scholarID:{type: Number}}],
    minTeamSize: {type: Number, required: true},
    maxTeamSize: {type: Number, required: true},
    teams: [{teamName: {type: String, unique: true},members: [{name: {type: String},scholarID: {type: Number}}]}],
    contacts: [{name: {type: String}, phone: {type: Number}}],
    prizes: [{position: {type: Number}, reward: {type: String}}],
    winners: [{position: {type: Number}, winnerName: {type: String},scholarID: {type: Number}}],
    winnerTeams: [{position: {type: Number}, teamName: {type: String}}]

})


const Abacus = mongoose.model("abacus", abacusSchema);

module.exports=Abacus;