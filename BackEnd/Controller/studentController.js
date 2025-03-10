const Profile_PictureSchema = require('../Models/Profile_PictureSchema')
const UserSchema = require('../Models/user')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid')
// const check = (req, res) => {
//     res.send("hai")
// }

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./Upload");
    },
    filename: function (req, file, cb) {
        const fileExtension = file.originalname.split('.').pop();
        const fileName = `${uuidv4()}.${fileExtension}`;
        cb(null, fileName);
    }
});

const upload = multer({ storage: storage }).single("profile_picture");

//Route to handle profile picture upload
const profilePic = (req, res) => {
    upload(req, res, function (err) {
        if (err) {
            console.log(err);
            return res.status(500).json({
                error: err,
                message: "Error in handling profile picture"
            });
        }

        const createProfilePic = new Profile_PictureSchema({
            profile_picture: req.file ? req.file : "no image"
        });

        createProfilePic.save()
            .then((data) => {
                res.json({
                    'data': data,
                    imageUrl: `/Upload/${req.file.filename}` // Use the filename for the image URL
                });
            })
            .catch((err) => {
                res.json({
                    error: err,
                    message: "Error in uploading profile pic"
                });
            });
    });
};


const newStudent = async (req, res) => {
    try {
        const emailExist = await UserSchema.findOne({ email: req.body.email })
        if (emailExist) {
            return res.status(400).json({
                message: "Email already exists. Please use a different email"
            })
        }
        const createUser = new UserSchema({
            fullName: req.body.fullName,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            phoneCountryCode: req.body.phoneCountryCode,
            country: req.body.country,
            stateOrRegion: req.body.stateOrRegion,
            city: req.body.city,
            address: req.body.address,
            zipOrCode: req.body.zipOrCode,
            company: req.body.company,
            status: req.body.status || "active",
            role: req.body.role || "user",
            profile_picture: req.body.profile_picture || "in progress"
        })
        const savedUser = await createUser.save();
        return res.status(200).json({
            data: savedUser,
            message: "User created successfully"
        })
    } catch (error) {
        console.error("Mongoose save error", error);

        res.json({ 'err': error })
    }
}

const getStudents = async (req, res) => {
    try {
        const users = await UserSchema.find()
        if (!users) {
            res.status(404).json({
                message: "No users found"
            })
        }
        res.status(200).json({
            data: users,
            message: "Users details fetched successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: "Caught an error",
            error: error.message
        })
    }
}

const getStudent = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await UserSchema.findOne({ _id: id });
        res.status(200).json({
            data: user,
            message: "User details fetched"
        })
    } catch (error) {
        res.status(500).json({
            message: "Caught an error",
            error: error.message
        })
    }
}

const editStudent = async (req, res) => {
    try {
        const editedData = {
            fullName: req.body.fullName,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            phoneCountryCode: req.body.phoneCountryCode,
            country: req.body.country,
            state: req.body.state,
            city: req.body.city,
            address: req.body.address,
            zipOrCode: req.body.zipOrCode,
            company: req.body.company,
            role: req.body.role || "user",
            profile_picture: req.body.profile_picture || "In progress"
        }
        const updatedData = await UserSchema.findByIdAndUpdate(req.params.id, editedData)
        if (!updatedData) {
            res.status(404).json({ message: "User not found" })
        }
        res.json({
            data: updatedData,
            message: "User updated successfully"
        })
    } catch (error) {
        console.error("Error in updating user:", error);
        res.status(500).json({
            message: "Caught an error",
            error: error
        })
    }
}

const deleteStudent = async (req, res) => {
    try {
        const resumeId = req.params.id;
        const user = await UserSchema.findByIdAndDelete(resumeId);
        if (!user) {
            res.status(404).json({
                message: "No user found in that id"
            })
        }
        res.status(200).json({
            message: "User and all his data deleted successfully",
        })
    } catch (error) {
        res.status(500).json({
            message: "Caught an error",
            error: error
        })
    }
}

const deleteSelectedStudents = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!ids || !ids.length) {
            return res.status(400).json({
                message: "No user IDs provided for deletion"
            })
        }
        const result = await UserSchema.deleteMany({ _id: { $in: ids } })
        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: "No user found with the provided IDs"
            })
        }
        res.status(200).json({
            message: "Selected users deleted successfully",
            deletedCount: result.deletedCount
        })
    } catch (error) {
        console.error("Error in deleting users:", error);
        res.status(500).json({
            message: "Caught an error",
            error: error.message
        })

    }
}


module.exports = {
    // check,
    newStudent,
    getStudents,
    getStudent,
    editStudent,
    deleteStudent,
    profilePic,
    deleteSelectedStudents
}
