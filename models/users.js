const mongoose = require('mongoose');

const userSchema=new mongoose.Schema({

    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    scholarID:{type:Number,required:true,unique:true},
    password:{type:String,required:true},
    role:{type: String,required:true},
    codeForcesHandle:{type:String,required:true,unique:true},
    gitHubHandle:{type:String}

})

const User = mongoose.model("user", userSchema);

module.exports=User;