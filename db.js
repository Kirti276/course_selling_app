const mongoose= require("mongoose")
const {Schema}= require("mongoose")
const {ObjectId}= require("mongoose")

const userSchema= new Schema({
   email: {type: String , unique: true},
   password: String,
   firstName: String,
   lastName: String
})

const adminSchema= new Schema({
   email: {type: String , unique: true},
   password: String,
   firstName: String,
   lastName: String
})

const courseSchema= new Schema({
    title: String,
    description: String,
    price: Number,
    imageURL: String,
    creatorId: ObjectId
})

const purchaseSchema= new Schema({
    userId: ObjectId, // refers to userschema
    courseId: ObjectId // refers to courseschema
})

const userModel= mongoose.model("user" , userSchema)
const adminModel= mongoose.model("admin" , adminSchema)
const courseModel= mongoose.model("course" , courseSchema)
const purchaseModel= mongoose.model("purchase" , purchaseSchema)

module.exports={
   userModel,
   adminModel,
   purchaseModel,
   courseModel
}