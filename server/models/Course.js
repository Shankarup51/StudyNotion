const mongoose = require("mongoose");


const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        required: true,
        trim: true,
    },
    couseDescription: {
        type: String,
        required: true,
        trim: true,
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    whatYouWillLearn: {
        type: String,
        required: true,
        trim: true,
    },
    courseContent: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Section"
    }],
    ratingAndReviews: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "RatingAndReview"
    }],
    price: {
        type: Number,
        required: true,
    },
    thunbnail: {
        type: String,
        required: true,
    },
    tag: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Tag"

    },
    studentsEnrolled: [{
        typr: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }]
});

module.exports = mongoose.model("Course", courseSchema);

