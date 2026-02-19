import mongoose from 'mongoose'


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    profilePic: {
        type: String,
        default: ""
    },
    profilePicPublicId: {
        type: String,
        default: ""
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    token: {
        type: String,
        default: null
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isLoggedIn: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
        default: null
    },
    otpExpiry: {
        type: Date,
        default: null
    },
    addresses: [
        {
            fullName: String,
            phone: String,
            email: String,
            address: String,
            city: String,
            state: String,
            zip: String,
            country: String,
        }
    ],
    city: {
        type: String
    },
    zipCode: {
        type: String
    },
    phoneNo: {
        type: String
    },
    isOtpVerified: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })


export const User = mongoose.model("User", userSchema)