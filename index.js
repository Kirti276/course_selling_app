require('dotenv').config()
console.log(process.env.Mongo_URL)
const express= require("express")
const jwt= require("jsonwebtoken")
const mongoose= require("mongoose")
const {userRouter}= require("./routes/user")
const {courseRouter}= require("./routes/course")
const {adminRouter}= require("./routes/admin")
const app = express();

app.use(express.json())
app.use("/user", userRouter) // all the prefixes of the route can be written here
app.use("/course", courseRouter)
app.use("/admin", adminRouter)


async function main(params) {
    mongoose.connect(process.env.Mongo_URL)// if the database fails to connect the backend should go down therefore we are awaiting on database if we dont await then backend will keep running but the data doesnt reach to database
    app.listen(3000)
}
main()


