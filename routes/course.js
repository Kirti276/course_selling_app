const {Router} = require("express")
const courseRouter= Router();
const {userMiddleware} = require("../middlewares/user")
const{purchaseModel, courseModel}= require("../db")

courseRouter.get('/purchase ', userMiddleware, async function(req,res){
    const userId= req.userId;
    const courseId= req.body.courseId;

    // should check whether the user has actually paid or not
    await purchaseModel.create({
        userId,
        courseId
    })

    res.json({
        msg: "course successfully bought"
    })
})

courseRouter.post('/preview' , async function(req,res){
    const courses= await courseModel.find({})

     res.json({
       courses
    })
})

module.exports={
    courseRouter: courseRouter
}