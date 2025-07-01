const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const Course = require("../models/Course");
const { uploadImageToCloudinary } = require("../utils/ImasgeUploader");

//create subsection
exports.createSubSection = async (req, res) => {
    try {
        //fetch data from req body
        const { sectionId, title, timeDuration, description } = req.body;

        //extract video file
        const video = req.files.videoFile;
        //validation
        if (!title || !timeDuration || !description || !video) {
            return res.status(400).json({
                success: false,
                message: "all fields are required"
            })
        }
        //upload video to cloudinary
        const uplaodDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
        //create a subsection
        const SubSectionDetails = await SubSection.create({
            title,
            timeDuration,
            description,
            videoUrl: uplaodDetails.secure_url,
        });
        //update section with this sub section Objectid
        const updatedSection = await Section.findByIdAndUpdate({ _id: sectionId },
            {
                $push: { subSection: SubSectionDetails._id }
            },
            { new: true }
        );
        //log updated section here ,after adding populate query
        updatedSection.populate("subSection");
        //return response
        return res.status(201).json({
            success: true,
            message: "subsection created successfully",
            updatedSection
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

//update subsection

exports.updateSubSection = async (req, res) => {
    try {
        //fetch data from req body


    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "something went wrong",
            error
        })
    }
}

//delete subsection

exports.deleteSubSection = async (req, res) => {
    try {
        //fetch data from req body
        const { sectionId, subSectionId } = req.body;
        //  delete
        const deletedSubSection = await SubSection.findByIdAndDelete({ _id: subSectionId });
        //update section
        const updatedSection = await Section.findByIdAndUpdate(
            { _id: sectionId },
            {
                $pull: { subSection: subSectionId }
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "subsection deleted successfully",
            updatedSection
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