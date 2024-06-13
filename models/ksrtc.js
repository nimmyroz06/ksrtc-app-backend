const mongoose=require("mongoose")
const schema=mongoose.Schema({
    "name":String,
    "email":String,
    "phn":String,
    "gender":String,
    "password":String,
    "cpassword":String
})
let ksrtcmodel=mongoose.model("users",schema)
module.exports={ksrtcmodel}