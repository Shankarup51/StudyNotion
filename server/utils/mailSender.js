const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const mailSender = async( email,title,body) =>{
    try{
        let transporter = nodemailer.createTransport({
                host: process.env.HOST,
                auth:{
                    user:process.env.MAIL_USER,
                    pass:process.env.MAIL_PASS,
                }
                })
                
           let info = await transporter.sendMail({
                from:"StudyNotion --by umashankar",
                  to:`${email}`,
                  subject:`${title}`,
                  html:`${body}`   
           })

           console.log(info);
           return info;
     }
   catch(error){
        console.log(error.message);
    }
}

module.exports = mailSender;


