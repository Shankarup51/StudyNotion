const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const subSectionSchema = new mongoose.Schema({

title:{
    type:String,
    required:true,
    trim:true,
},
timeDuration:{
    type:String
},
description:{
    type:String,
},
videoUrl:{
    type:String,

}


});

module.exports = mongoose.model("SubSection", subSectionSchema);