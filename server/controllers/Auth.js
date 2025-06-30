const USer = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Profile = require("../models/Profile");
const mailSender = require("../utils/mailSender");

require("dotenv").config();





//otpSender
exports.sendOTP = async (req, res) => {

    try {
        //fetch email from request ki body
        const { email } = req.body;

        //check if user already exist
        const checkUserPresent = await USer.findOne({ email });

        //if user already exist , then return a response 
        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: "user already registered"
            })
        }

        //generate otp
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        console.log("OTP generated", otp);

        //check unique otp or not

        const result = await OTP.findOne({ otp: otp });

        while (result) {

            //generate otp
            var otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            result = await OTP.findOne({ otp: otp });
        }

        const otpPayload = { email, otp };

        //create an entry in db
        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);

        //return response
        return res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
            otp
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


//signup

exports.signUp = async (req, res) => {
    try {
        //data fetch from request ki body
        const {
            firstName,
            lastName,
            email,
            password,
            accountType,
            contactNumber,
            confirmPassword,
            otp
        } = req.body;

        //validate karo
        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(403).json({
                success: false,
                message: "all fields are required"
            })
        }
        //2 password match karlo

        if (password !== confirmPassword) {
            return res.status(403).json({
                success: false,
                message: "password and confirm password does not match ,please try again"

            })
        }
        //check user already exist or not

        const existingUser = await USer.findOne({ email });
        if (existingUser) {
            return res.status(401).json({
                success: false,
                message: "user already registered"
            })
        }
        //find most recent otp stored for the user
        const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        console.log(recentOtp);


        //valdate OTP
        if (recentOtp.length == 0) {
            //otp not found
            return res.status(400).json({
                success: false,
                message: "OTP not found"
            })
        }
        else if (recentOtp.otp !== otp) {
            //invalid otp
            return res.status(400).json({
                success: false,
                message: "invalid otp"
            })
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //entry create in DB
        const profileDetails = await Profile.create({
            contactNumber: null,
            about: null,
            gender: null,
            dateOfBirth: null,
        })

        const user = await USer.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            accountType,
            contactNumber,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        })
        //return res
        return res.status(201).json({
            success: true,
            message: "user registered successfully",
            user,
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


//login

exports.login = async (req, res) => {
    try {
        //get data from request body
        const { email, password } = req.body;

        //validate data
        if (!email || !password) {
            return res.status(403).json({
                success: false,
                message: "all fields are required"
            })
        }

        //user chack exist or not
        const user = await USer.findOne({ email }).populate("additionalDetails");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "user not found"
            })
        }
        //generate JWT , after password matching
        if (await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h",
            });
            user.token = token;
            user.password = undefined;

            //create cookie and send response
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "logged in successfully"
            })
        }
        else{
            return res.status(400).json({
                success:false,
                message:"invalid  password"
            })
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success:  false,
            message: "something went wrong",
            error
        }); 
    }
}

//changepassword
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // Check all fields
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(403).json({
        success: false,
        message: "All fields are required"
      });
    }

    // New password match check
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match"
      });
    }

    // Find user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Compare old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Old password is incorrect"
      });
    }

    // Hash and update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Send confirmation email
    await mailSender(
      user.email,
      "Your StudyNotion Password Has Been Changed",
      `<h2>Hello ${user.firstName || "there"},</h2>
      <p>Your password was successfully changed on ${new Date().toLocaleString()}.</p>
      <p>If this was not you, please reset your password or contact our support team immediately.</p>
      <p>– Team StudyNotion</p>`
    );

    return res.status(200).json({
      success: true,
      message: "Password updated successfully. A confirmation email has been sent."
    });

  } catch (error) {
    console.log("Error in changePassword:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong during password update.",
      error: error.message
    });
  }
};
