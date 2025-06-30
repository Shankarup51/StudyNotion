const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

//auth

exports.auth = async (req, res, next) => {
    try {
        //extract token
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "token not found"
            })
        }

        //verify the token
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode;

        }
        catch (err) {
            return res.status(401).json({
                success: false,
                message: "token is invalid"
            });

        }
        next();

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

//isStudent
exports.isStudent = async (req, res, next) => {
try{
    if(req.user.accountType !== "Student"){
        return res.status(401).json({
            success:false,
            message:'This is a protected route for Students only'
            })
    }
    next();          
}   
catch(error){
    return res.status(500).json({
        success:false,
        message:"something went wrong user role can't be determined",
        error
    })
} 

}

//isInstructor
exports.isInstructor = async (req, res, next) => {
try{
    if(req.user.accountType !== "Instructor"){
        return res.status(401).json({
            success:false,
            message:'This is a protected route for Instructor only'
            })
    }
    next();          
}   
catch(error){
    return res.status(500).json({
        success:false,
        message:"something went wrong user role can't be determined",
        error
    })
} 
}


//isAdmin
exports.isAdmin = async (req, res, next) => {
try{
    if(req.user.accountType !== "Admin"){
        return res.status(401).json({
            success:false,
            message:'This is a protected route for Admin only'
            })
    }
    next();          
}   
catch(error){
    return res.status(500).json({
        success:false,
        message:"something went wrong user role can't be determined",
        error
    })
} 

}

