const User=require('../models/users');
var CryptoJS = require("crypto-js");

// signup funtion
const signUp= async(req,res) => {

    try{

        const name=req.body.name;
        const password=req.body.password;
        const email=req.body.email;
        const scholarID=req.body.scholarID;
        const codeForcesHandle=req.body.cfHandle;
        const gitHubHandle=req.body.ghHandle;

        if(!name || !email || !password || !scholarID || !codeForcesHandle){
            res.status(401).json({error: "Please Fill In All The Details"});
            return;
        }

        password=CryptoJS.AES.encrypt(password,'secret key 123').toString();

        const existingUser=await User.findOne({$or:[{email,codeForcesHandle,scholarID}]});

        if(existingUser){
            res.status(401).json({error: "User With Same Email Or ScholarID or codeForcesHandle already Exists!!!"});
            return;
        }

        const user=await User({name,email,password,scholarID,codeForcesHandle,gitHubHandle:gitHubHandle?gitHubHandle:""});

        res.status(201).json({success: "true"});
     
    }
    catch{

        res.status(401).json({error: "Something Went Wrong. Please Try Again!!!"});

    }
}


const login = async(req,res) => {

    try{

        const email=req.body.email;
        const password=req.body.password;

        if(!email || !password){
            res.status(401).json({error: "Please Fill in All the Details!!!"});
            return;
        }

        const user=await User.findOne({email});
        
        if(!user){
            res.status(401).json({error: "No Such User!!!"});
            return;
        }

        if(CryptoJS.AES.decrypt(user?.password,'secret key 123').toString(CryptoJS.enc.Utf8)==password){
            var token = jwt.sign({ user: email,exp: Math.floor(Date.now() / 1000) + (60 * 60)*24*2 }, 'secret-1234567');
            res.status(200).json({user:token,success:"true"});
        }
        else{
            res.status(401).json({error: "Invalid Credentials"});
        }

    }
    catch(e){

        res.status(401).json({error: "Something Went Wrong. Please Try Again!!!"});

    }
}


const authenticate =async(req,res,next) => {

    try{

        const email=await jwt.verify(req.body.user,'secret-1234567');
        const user=await User.findOne({email});
        req.user=user;
        next();
        
    }
    catch(e){

        res.status(401).json({error: "Please Login!!!"});

    }
}

module.exports={signUp,login,authenticate};