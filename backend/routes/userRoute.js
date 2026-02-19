import express from "express"
import { login, register, reVerify, verify, logout, forgotPassword, verifyOtp, changePassword, allUsers, getUserById, updateUser, checkCurrentPassword, changePasswordOtp, addAddress, getAddresses, deleteAddressFromDB } from "../controllers/userController.js"
import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js"
import { singleUpload } from "../middleware/multer.js"



const router = express.Router()

router.post("/register", register)
router.get("/verify/:token", verify)
router.post("/reverify", reVerify)
router.post("/login", login )
router.post("/logout", isAuthenticated, logout)
router.post("/forgot-password", forgotPassword )
router.post("/verify-otp/:email", verifyOtp )
router.post("/change-password/:email", changePasswordOtp )
router.put("/change-password/:id", isAuthenticated, changePassword )
router.get("/all-user", isAuthenticated, isAdmin, allUsers)
router.get("/get-user/:userId", getUserById)
router.post("/check-password", isAuthenticated, checkCurrentPassword)
router.put("/update/:id", isAuthenticated, singleUpload, updateUser)
router.post("/add-address", isAuthenticated, addAddress);
router.get("/get-addresses", isAuthenticated, getAddresses);
router.delete("/delete-address/:index", isAuthenticated, deleteAddressFromDB);



export default router