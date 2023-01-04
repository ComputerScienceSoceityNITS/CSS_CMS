const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Name"],
        maxlength: [30, "Name cannot exceed 30 characters"],
        minlength: [3, "Name should have more than 2 characters"],
    },

    avatar: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        }
    },

    role: {
        type: String,
        required: [true, "Please Enter the Wing of the member"],
    },

    session:{
        type: String,
        required: [true, "Please Enter the session of the member"],
    },

    year:{
        type:String,
        required: [true, "Please Enter the year of the member"],
    },

    socialMedia:{
        instagram:{
            type: String,
        },
        linkedin:{
            type: String,
        },
        github:{
            type: String,
        },
        facebook:{
            type: String,
        }
    }

});

 

module.exports = mongoose.model("Member", memberSchema);
