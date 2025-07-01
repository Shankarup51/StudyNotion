const Section = require("../models/Section")
const Course = require("../models/Course")


exports.createSection = async (req, res)=>{
    try {
        //data fetchh
        const { sectionName, courseId } = req.body;

        //data validation
        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: "all fields are required"
            })
        }
        //creat section
        const newSection = await Section.create({
            sectionName,
        });
        //update course with section ObjectiD
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            { _id: courseId },
            {
                $push: { courseContent: newSection._id }
            },
            { new: true }
        );
        //use populate to replace sections / subsections both in updatedCourseDetails
        await updatedCourseDetails.populate("courseContent.subSection");
        //return response
        return res.status(201).json({
            success: true,
            message: "section created successfully",
            updatedCourseDetails
        })

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "something went wrong",
            error
        });
    }
}

exports.updateSection = async (req, res)=>{
    try{
        //data fetch
        const { sectionName, sectionId } = req.body;
        //validation
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success:false,
                message:"all fields are required"
            })
        }
        //update
        const section = await Section.findByIdAndUpdate(
            { _id: sectionId },
            { sectionName },
            { new: true }
        );
        //return response
        return res.status(200).json({
            success:true,
            message:"section updated successfully",
            section
        })  

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"something went wrong",
            error
        })
    }
}

//delete section
exports.deleteSection = async (req, res)=>{
    try{
        //get Id
        const { sectionId,courseId } = req.body;
        //use  findbyidanddelete
        const deletedSection = await Section.findByIdAndDelete({ _id: sectionId });
        //update course
        
        //return response
        return res.status(200).json({
            success:true,
            message:"section deleted successfully",
            deletedSection
        })

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"something went wrong",
            error
        })
    }
}

