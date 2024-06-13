const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const { ksrtcmodel } = require("./models/ksrtc")

const app=express()
app.use(cors())
app.use(express.json())

app.post("/signup",(req,res)=>{
    let input=req.body
    let ksrtc=new ksrtcmodel(input)
    ksrtc.save()
    res.json("done")
})


app.listen(8080,()=>{
    console.log("server started")
})