const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const courseProgress = new mongoose.Schema({

    courseID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",

    },
    completedVideos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubSection",

        }
    ]

});

module.exports = mongoose.model("CourseProgress", courseProgress);