const Profile = require("../models/Profile");
const User = require("../models/User");
const Course = require("../models/Course");


exports.updateProfile = async (req, res) => {
    try {
        //fetch data from req body
        const { gender, dateOfBirth = "", about = "", contactNumber } = req.body;
        //get userid
        const id = req.user.id;
        //validation
        if (!gender || !contactNumber || !id) {
            return res.status(400).json({
                success: false,
                message: "all fields are required"
            })
        }
        //find profile
        const userDetails = await Profile.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);
        //update profile
        profileDetails.gender = gender;
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.contactNumber = contactNumber;
        await profileDetails.save();

        //return response
        return res.status(200).json({
            success: true,
            message: "profile updated successfully",
            profileDetails
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "something went wrong",
            error
        });
    }
}


//Delete Account
exports.deleteAccount = async (req, res) => {

    try {
        //get id
        const id = req.user.id;
        //validation
        const userDetails = await User.findById(id);
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "user not found"
            })
        }
        //delete profile
        await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails });
        //unenroll user from all enrolled courses
        await Course.updateMany(
            { enrolledStudents: id },
            { $pull: { enrolledStudents: id } }
        );
        //delete user
        await User.findByIdAndDelete(id);
        //return response
        return res.status(200).json({
            success: true,
            message: "account deleted successfully"
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "something went wrong",
            error
        })
    }
}

exports.getAllUserDetails = async (req, res) => {
    try {
        //get id
        const id = req.user.id;
        //validation
        const userDetails = await User.findById(id).populate("additionalDetails");
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "user not found"
            })
        }
        //return response
        return res.status(200).json({
            success: true,
            message: "user details fetched successfully",
            userDetails
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "something went wrong",
            error
        })
    }

}
