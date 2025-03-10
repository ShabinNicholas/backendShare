const mongoose = require('mongoose')

const Profile_PictureSchema = new mongoose.Schema({
    profile_picture: Object
})

module.exports = new mongoose.model("Profile_Picture", Profile_PictureSchema)