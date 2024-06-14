const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")

const { ksrtcmodel } = require("./models/ksrtc")
mongoose.connect("mongodb+srv://nimmyroz:roz206@cluster0.svkepzi.mongodb.net/ksrtcdb?retryWrites=true&w=majority&appName=Cluster0")
const app=express()
app.use(cors())
app.use(express.json())

const generateHashedPassword=async(password)=>{
    const salt=await bcrypt.genSalt(10)
    return bcrypt.hash(password,salt)
}
app.post("/signup",async(req,res)=>{
    let input=req.body
    let hashedPassword=await generateHashedPassword(input.password)
    console.log(hashedPassword)
    input.password=hashedPassword
    let ksrtc=new ksrtcmodel(input)
    ksrtc.save()
    res.json("done")
})

app.post("/signIn",(req,res)=>{
    let input=req.body
    ksrtcmodel.find({"email":req.body.email}).then(
        (response)=>{
            if (response.length>0) {
                let dbPassword=response[0].password
                console.log(dbPassword)
                bcrypt.compare(input.password,dbPassword,(error,isMatch)=>{
                    if (isMatch) {
                        jwt.sign({email:input.email},"ksrtc-app",{expiresIn:"1d"},
                            (error,token)=>{
                                if (error) {
                                    res.json({"status":"unable to create token"})
                                    
                                } else {
                                    res.json({"status":"success","userId":response[0]._id,"token":token})
                                }
                            }
                        )
                    } else {
                        res.json({"status":"incorrect password"})
                    }
                })
            } else {
                res.json({"status":"user doesn't exist"})
            }
        }
    ).catch()
})

app.post("/viewusers",(req,res)=>{
    let token=req.headers["token"]
    jwt.verify(token,"blog-app",(error,decoded)=>{
        if (error) {
            res.json({"status":"unauthorized access"})
        } else {
            if(decoded)
                {
                    ksrtcmodel.find().then(
                        (response)=>{
                            res.json(response)
                        }
                    ).catch()
                }
        }
    })
})

app.listen(8080,()=>{
    console.log("server started")
})