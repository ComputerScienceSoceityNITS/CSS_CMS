const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Event Name"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Please Enter Event Description"],
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],

    formLink:{
        type: String
    },
   
    startTime:{
        type:String,
        required: [true, "Please Enter Event start Time"],
    },
    startDate:{
        type:Date,
        required: [true, "Please Enter Event start date"],
    },
    endDate:{
        type:Date,
        default:Date.now
    }
})

module.exports=mongoose.model("Event",eventSchema);