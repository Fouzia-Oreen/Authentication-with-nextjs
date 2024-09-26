import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    firstname : {
        type: String,
        required: [true, "Please provide first name!"],
        unique: true
    },
    lastname : {
        type: String,
        required: [true, "Please provide last name!"],
        unique: true
    },
    email : {
        type: String,
        required: [true, "Please provide an email!"],
        unique: true
    },
    // password, password-token & password-token-expiry
    password : {
        type: String,
        required: [true, "Please provide a password!"],
    },
    forgotPasswordToken :  String,
    forgotPasswordTokenExpiry :  Date,
    // token & token expiry
    verifyToken : String,
    verifyTokenExpiry :Date,
    isVerified : {
        type: Boolean,
        default: false
    },
    isAdmin : {
        type: Boolean,
        default: false
    }
})
const User = mongoose.models.users || mongoose.model("users", userSchema)
export default User