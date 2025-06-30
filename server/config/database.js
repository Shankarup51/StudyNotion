const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

exports.connect=()=>{
    mongoose.connect(process.env.MONGO_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    
    })
    .then(()=>console.log("DB CONNECTED"))
    .catch((err)=>{
        console.log("DB CONNECTION ERROR");
        console.error(err);
        process.exit(1);
    });
 
}