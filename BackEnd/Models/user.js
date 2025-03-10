const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    phoneCountryCode: {
        type: Number,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    stateOrRegion: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    zipOrCode: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    status: {
        type: String,
        // required: true,
        default: "active"
    },
    role: {
        type: String,
        required: true,
        default: "user"
    },
    profile_picture: {
        type: Object

    }
})






module.exports = mongoose.model("User_Details", UserSchema)