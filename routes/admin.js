const {Router}= require("express")
const jwt= require("jsonwebtoken")
const bcrypt= require("bcrypt")
const {z} = require("zod")
const{adminModel, courseModel}= require("../db")
const adminRouter= Router();
const {JWT_SECRET_ADMIN} = require("../config")
const {adminMiddleware} = require("../middlewares/admin")

adminRouter.post('/signup', async function(req,res){
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
     await adminModel.create({
        email: email,
        password: hashedPassword,
        firstName: firstName,
        lastName: lastName
     })
    res.json({
        message: "you are signed up"
    })
})

adminRouter.post('/login', async function(req,res){
   const {email, password}= req.body;
    const admin= await adminModel.findOne({
        email
    })
    if(!admin){
        res.status(403).json({
            msg:"user does not exist"
        })
    }
    
    const passwordMatch= await bcrypt.compare(password,admin.password)
    if(passwordMatch){
        const token= jwt.sign({
            id: admin._id.toString()
        }, JWT_SECRET_ADMIN)

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


//create a course
adminRouter.post('/course', adminMiddleware,  async function(req,res){
    const adminId= req.userId;
    const {title, description, imageURL, price }= req.body;

  const course= await courseModel.create({
        title, 
        description, 
        imageURL, 
        price ,
        creatorId: adminId
    })

    res.json({
        message: "Course Created",
        courseId: course._id
    })
})

// change the course name etc
adminRouter.put('/course/update', adminMiddleware, async function(req,res){
    const adminId= req.userId;
    const {title, description, imageURL, price , courseId}= req.body;

  const course= await courseModel.updateOne({
    // update that course id which belongs to admin id 
    // this prevents other creator to change course of some other creator
      _id: courseId,
      creatorId: adminId
  },{
        title, 
        description, 
        imageURL, 
        price 
        
    })

    res.json({
        message: "Course Updated",
        courseId: course._id
    })
})

// want all the courses he created
adminRouter.get('/course/bulk',adminMiddleware, async function(req,res){
    const adminId= req.userId;
    
  const courses = await courseModel.findOne({
    creatorId: adminId
  })

    res.json({
        message: "Course Updated",
        courses
    })
})

module.exports={
    adminRouter: adminRouter
}