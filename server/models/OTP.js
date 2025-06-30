const mongoose = require("mongoose");
const dotenv = require("dotenv");
const mailSender = require("../utils/mailSender");
dotenv.config();

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
    },
    otp: {
        type: String,
        required: true,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3000,
    }
});

//a function -> to send  mail

async function sendVerificationEmail(email, otp) {
    try {

        const mailResponse = await mailSender(email, "Verifiacation from StudyNotion", otp);
        console.log("email send successfully", mailResponse);
        ;
    }
    catch (error) {
        console.log("error ocured while sending mail", error);
        throw error;
    }
}

OTPSchema.pre("save", async function (next) {
    await sendVerificationEmail(this.email, this.otp);
    next();
}
)

module.exports = mongoose.model("OTP", OTPSchema);
