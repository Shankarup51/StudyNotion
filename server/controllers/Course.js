const Course = require("../models/Course");
const Tag = require("../models/Categories");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/ImasgeUploader");
const Categories = require("../models/Categories");
//creatCourse handler function
exports.createCourse = async (req, res) => {
    try {
        //data fetch
        const { courseName, courseDescription, whatYouWillLearn, price, category} = req.body;
        //get thumbnail
        const thumbnail = req.files.thumbnailImage;
        //validation
        if (!courseName || !courseDescription || !thumbnail || !whatYouWillLearn || !price || !category) {
            return res.status(400).json({
                success: false,
                message: "all fields are required"
            });
        }
        //check for instructor
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        if (!instructorDetails) {
            return res.status(404).json({
                success: false,
                message: "instructor not found"
            })
        }
        //check for tag
        const categoryDetails = await Categories.findById(category);
        if (!categoryDetails) {
            return res.status(404).json({
                success: false,
                message: "tag not found"
            })
        }
        //upload thumbnail image to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.THUMBNAIL_FOLDER);

        //create entry 
        const courseDetails = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn,
            price,
            category: categoryDetails._id,
            thunbnail: thumbnailImage.secure_url,
        })

        //add the new course to the user section of Instructor
        await User.findByIdAndUpdate(
            { _id: instructorDetails._id },
            {
                $push: { courses: courseDetails._id }
            },
            { new: true }
        );

        //update the Tag ka schema
        await Categories.findByIdAndUpdate(
            { _id: categoryDetails._id },
            {
                $push: { course: courseDetails._id }
            },
            { new: true }
        );


        //return response
        return res.status(201).json({
            success: true,
            message: "course created successfully",
            courseDetails
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "something went wrong",
            error
        })
    }
}

//getAllCourse handler finction

exports.showAllCourses = async (req, res) => {
    try {
        const allCourses = await Course.find({}, {
            courseName: true,
            instructor: true,
            ratingAndReviews: true,
            studentsEnrolled: true,
            price: true,
            thunbnail: true,
        })
            .populate("instructor")
            .exec();
        return res.status(200).json({
            success: true,
            message: "all courses fetched successfully",
            allCourses,
            data: allCourses
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "something went wrong ",
            error
        })
    }
}