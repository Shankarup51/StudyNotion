const Tag = require("../models/Categories");
const Course = require("../models/Course");


exports.createCategories = async (req, res) => {
    try {
        //fetch data
        const { name, description } = req.body;
        //validation
        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: "all fields are required"
            })
        }
        //create entry in Db
        const tagDetails = await Tag.create({
            name,
            description,
        })
        return res.status(201).json({
            success: true,
            message: "tag created successfully",
            tagDetails
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
};

//get all tags handler function

exports.showAllCategories = async (req, res) => {
    try {
        const allCategories = await Tag.find({}, { name: true, description: true });
        return res.status(200).json({
            success: true,
            message: "all tags fetched successfully",
            allTags
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "something went wrong",
            error
        })
    }
};


