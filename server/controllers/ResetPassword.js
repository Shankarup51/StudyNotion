const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const OTP = require("../models/OTP");
const crypto = require("crypto");



//resetPasswordToken
exports.resetPasswordToken = async (req, res) => {
try{
    
    //get email from req body
    const email = req.body.email;
    //check user for this email , email validation
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "user not found"
        })
    }
    //generate token
    const token = crypto.randomUUID();
    //update user by adding token ans expiration time
    const updatedDetails = await User.findByIdAndUpdate(
        { email: email },
        {
            token: token,
            resetPasswordExpires: Date.now() + 5 * 60 * 1000,
        },
        { new: true }
    )
    //create url
    const url = `http://localhost:3000/reset-password/${token}`;
    //send mail containing the url
    await mailSender(email, "Password Reset Link", `Password Reset Link ${url}`);
    //return response
}
catch(error){
    console.log(error);
    return res.status(500).json({
        success:false,
        message:"something went wrong while reset password",
        error
    })
}
}

//resetPassword

exports.resetPassword = async (req, res) => {
try{
    //data fetch
    const { password, confirmPassword, token } = req.body;
    //validation
    if(password !== confirmPassword){
        return res.status(400).json({
            success:false,
            message:"password and confirm password does not match"
        });
    }

    //find user
    //get user details from db using token
    const userDetails = await User.findOne({token : token});

    //if no entry -invalid token
    if(!userDetails){
        return res.status(404).json({
            success:false,
            message:"invalid token"
        });
    }
    //token time check
    if(userDetails.resetPasswordExpires < Date.now()){
        return res.status(404).json({
            success:false,
            message:"token expired"
        });
    }
    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    //password update
    await User.findByIdAndUpdate(
        { token:token},
        {  password:hashedPassword},
        { new: true }
    )
 
    //return response
    return res.status(200).json({
        success:true,
        message:"password reset successfully"
    })
}
catch(error){
    console.log(error);
    return res.status(401).jason({
        success:false,
        message:"something went wrong while reseting password",
        error
    })
}
}
