import { User } from "../models/userModel.js"
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"
import { Session } from "../models/sessionModel.js";
import cloudinary from "../utils/cloudinary.js";


// Creating a New User
export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields required" });
        }

        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            isVerified: true
        });

        return res.status(201).json({
            success: true,
            message: "Account created successfully! You can now login. 🎉",
        });

    } catch (err) {
        console.error("Registration Error:", err);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

//Logging In Registerd User
export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        const existingUser = await User.findOne({ email })
        if (!existingUser) {
            return res.status(400).json({
                success: false,
                message: "User not exists"
            })
        }
        const isPassword = await bcrypt.compare(password, existingUser.password)
        if (!isPassword) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials"
            })
        }
        if (existingUser.isVerified === false) {
            return res.status(400).json({
                success: false,
                message: "Verify Your account and then login"
            })
        }

        const accessToken = jwt.sign({ id: existingUser.id }, process.env.SECRET_KEY, { expiresIn: '10d' })
        const refreshToken = jwt.sign({ id: existingUser.id }, process.env.SECRET_KEY, { expiresIn: '30d' })

        existingUser.isLoggedIn = true
        await existingUser.save()

        const existingSession = await Session.findOne({ userId: existingUser._id })
        if (existingSession) {
            await Session.deleteOne({ userId: existingUser._id })
        }

        await Session.create({ userId: existingUser._id })
        return res.status(200).json({
            success: true,
            message: `Welcome back ${existingUser.firstName}`,
            user: existingUser,
            accessToken,
            refreshToken
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//Logging Out Registered User with middleware 
export const logout = async (req, res) => {
    try {
        const userId = req.id
        await Session.deleteMany({ userId: userId })
        await User.findByIdAndUpdate(userId, { isLoggedIn: false })
        return res.status(200).json({
            success: true,
            message: "User Loggedout Successfully"
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//check password in db and current password 
export const checkCurrentPassword = async (req, res) => {
    try {
        const { currentPassword } = req.body
        const userId = req.user.id   // from isAuthenticated middleware

        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ success: false })
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password)

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Password verified"
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//Change Password
export const changePassword = async (req, res) => {
    try {
        const userIdToUpdate = req.params.id
        const { newPassword, confirmPassword } = req.body

        const loggedInUser = req.user // from auth middleware

        // Authorization check
        if (
            loggedInUser._id.toString() !== userIdToUpdate &&
            loggedInUser.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to update this profile"
            })
        }

        // Find user correctly
        const user = await User.findById(userIdToUpdate)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        // Validation
        if (!newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            })
        }

        // Hash & save
        user.password = await bcrypt.hash(newPassword, 10)
        await user.save()

        res.status(200).json({
            success: true,
            message: "Password changed successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


//Get All Users For Admin Only
export const allUsers = async (_, res) => {
    try {
        const users = await User.find()
        return res.status(200).json({
            success: true,
            users
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//Get individual User By Id
export const getUserById = async (req, res) => {
    try {
        const { userId } = req.params
        const user = await User.findById(userId).select("-password -otp -otpExpiry -token")
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Foundd"
            })
        }
        res.status(200).json({
            success: true,
            user
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//Update User
export const updateUser = async (req, res) => {
    try {
        const userIdToUpdate = req.params.id
        const loggedInUser = req.user
        const { firstName, lastName, address, city, zipCode, phoneNo, role } = req.body

        if (loggedInUser._id.toString() !== userIdToUpdate && loggedInUser.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to update this profile"
            })
        }
        let user = await User.findById(userIdToUpdate)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not Found"
            })
        }

        let profilePicUrl = user.profilePic;
        let profilePicPublicId = user.profilePicPublicId

        if (req.file) {
            if (profilePicPublicId) {
                await cloudinary.uploader.destroy(profilePicPublicId)
            }
            const uploadResult = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "profiles" },
                    (error, result) => {
                        if (error) reject(error)
                        else resolve(result)
                    }
                )
                stream.end(req.file.buffer)
            })
            profilePicUrl = uploadResult.secure_url;
            profilePicPublicId = uploadResult.public_id
        }

        //Update Fields
        user.firstName = firstName || user.firstName
        user.lastName = lastName || user.lastName
        user.address = address || user.address
        user.city = city || user.city
        user.zipCode = zipCode || user.zipCode
        user.phoneNo = phoneNo || user.phoneNo
        user.role = role || user.role
        user.profilePic = profilePicUrl
        user.profilePicPublicId = profilePicPublicId

        const updateUser = await user.save()

        return res.status(200).json({
            success: true,
            message: "User Updated Successfully",
            user: updateUser
        })


    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Add a new address
export const addAddress = async (req, res) => {
    try {
        const user = await User.findById(req.id); // req.id from isAuthenticated
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        user.addresses.push(req.body);
        await user.save();
        res.status(200).json({ success: true, addresses: user.addresses });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error saving address" });
    }
};

// Get all addresses for the logged-in user
export const getAddresses = async (req, res) => {
    try {
        const user = await User.findById(req.id);
        res.status(200).json({ success: true, addresses: user.addresses || [] });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching addresses" });
    }
};

// Delete an address from DB
export const deleteAddressFromDB = async (req, res) => {
    try {
        const { index } = req.params;
        const user = await User.findById(req.id);
        user.addresses.splice(index, 1);
        await user.save();
        res.status(200).json({ success: true, addresses: user.addresses });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting address" });
    }
};