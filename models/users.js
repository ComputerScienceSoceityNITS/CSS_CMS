const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema=new mongoose.Schema({

    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    scholarID:{type:Number,required:true,unique:true},
    password:{type:String,required:true},
    codeForcesHandle:{type:String,required:true},
    gitHubHandle:{type:String}

})

module.exports={userSchema};