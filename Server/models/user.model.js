import mongoose  from "mongoose";

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : [true , "Username is required"],
        trim : true,
    },
    email : {
        type : String,
        required : [true , "Email is required"],
        unique : true,
        lowercase : true,
        trim : true,
    },
    password : {
        type : String,
        required : [true , "Password is required"],
        minlength : 6
    },
    department :{
        type : String,
        required : [true , "Department is required"],
        enum : ["BCA" ,"MCA", "BBA", "MBA", "JMC", "B.TECH"],
    },
},{
    timestamps : true
})

const User = mongoose.model("User" , userSchema)
export default User;