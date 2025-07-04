const {Router} = require("express");
const jwt= require("jsonwebtoken")
const bcrypt= require("bcrypt")
const {z} = require("zod")
const{userModel, purchaseModel}= require("../db")
const userRouter= Router();
const {JWT_SECRET_USER} = require("../config")
const {userMiddleware} = require("../middlewares/user")

userRouter.post('/signup', async function(req,res){
    // zod validation
    const requiredbody= z.object({
        email: z.string().min(3).max(100).email(),
        password: z.string().min(3).max(30),
        firstName: z.string().min(2).max(50),
        lastName: z.string().min(2).max(50)
    })

    const parsedData= requiredbody.safeParse(req.body)
     if(!parsedData.success){
        res.json({
            msg: "Incorrect format",
            error: parsedData.error
        })
        return
     }
    // hashing of password using bcrypt
     const {email, password, firstName, lastName}= req.body;

     const hashedPassword= await bcrypt.hash(password, 5);
     await userModel.create({
        email: email,
        password: hashedPassword,
        firstName: firstName,
        lastName: lastName
     })
    res.json({
        message: "you are signed up"
    })
})

userRouter.post('/login', async function(req,res){
    const {email, password}= req.body;
    const user= await userModel.findOne({
        email
    })
    if(!user){
        res.status(403).json({
            msg:"user does not exist"
        })
    }
    
    const passwordMatch= await bcrypt.compare(password,user.password)
    if(passwordMatch){
        const token= jwt.sign({
            id: user._id.toString()
        }, JWT_SECRET_USER)

        res.json({
            token: token
        })
    }
    else{
        res.status(403).json({
            msg:'Incorrect credentials'
        })
    }
    
})

userRouter.get('/purchases',userMiddleware, async function(req,res){
    const userId= req.userId;

    const purchases= await purchaseModel.findOne({
        userId
    })

    res.json({
        purchases
    })
})

module.exports= {
    userRouter: userRouter
}

/*
to avoid writing so many routes in index.js , we have use routing in express 
Express  module provides a Router function 
we write all the routes of the user in a separate file and remove user from the name of the routes because we will 
add a line of code in index.js which will automatically add user in route
*/