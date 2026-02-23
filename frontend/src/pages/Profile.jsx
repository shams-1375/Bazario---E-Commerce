import React, { useState } from 'react'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import userLogo from '../assets/user.jpg'
import { toast } from 'sonner'
import api from '../api/axios'
import { setUser } from '@/redux/userSlice'
import MyOrder from './MyOrder'
import { Eye, EyeOff } from 'lucide-react'

const Profile = () => {
    const { user } = useSelector(store => store.user)
    const params = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()

    const userId = params.userId
    const accessToken = localStorage.getItem("accessToken")
    const defaultTab = location.state?.tab || "profile"

    const [showPassword, setShowPassword] = useState(false)
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [passwordVerified, setPasswordVerified] = useState(false)
    const [checking, setChecking] = useState(false)
    const [loading, setLoading] = useState(false)

    const passwordsMatch =
        newPassword && confirmPassword && newPassword === confirmPassword

    const [updateUser, setUpdateUser] = useState({
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        phoneNo: user?.phoneNo,
        address: user?.address,
        city: user?.city,
        state: user?.state,
        country: user?.country,
        zipCode: user?.zipCode,
        profilePic: user?.profilePic,
        role: user?.role
    })

    const [file, setFile] = useState(null)

    const handleChange = (e) => {
        setUpdateUser({ ...updateUser, [e.target.name]: e.target.value })
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]
        setFile(selectedFile)
        setUpdateUser({
            ...updateUser,
            profilePic: URL.createObjectURL(selectedFile)
        })
    }

    const saveAddressToDB = async () => {
        try {
            await api.post(
                "/user/add-address",
                {
                    fullName: `${updateUser.firstName} ${updateUser.lastName}`,
                    phone: updateUser.phoneNo,
                    email: updateUser.email,
                    address: updateUser.address,
                    city: updateUser.city,
                    state: updateUser.state,
                    zip: updateUser.zipCode,
                    country: updateUser.country
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            )
        } catch (error) {
            console.log("Address save skipped:", error.message)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)

            const formData = new FormData()
            formData.append("firstName", updateUser.firstName)
            formData.append("lastName", updateUser.lastName)
            formData.append("email", updateUser.email)
            formData.append("address", updateUser.address)
            formData.append("city", updateUser.city)
            formData.append("state", updateUser.state)
            formData.append("country", updateUser.country)
            formData.append("zipCode", updateUser.zipCode)
            formData.append("phoneNo", updateUser.phoneNo)
            formData.append("role", updateUser.role)

            if (file) {
                formData.append("file", file)
            }

            const res = await api.put(`/user/update/${userId}`, formData, {
                headers: { Authorization: `Bearer ${accessToken}` }
            })

            if (res.data.success) {
                dispatch(setUser(res.data.user))

                await saveAddressToDB()

                toast.success("Profile & Address updated successfully")
            }

        } catch (error) {
            toast.error("Failed to update profile")
        } finally {
            setLoading(false)
        }
    }

    const handleCheckPassword = async () => {
        try {
            setChecking(true)
            const res = await api.post(
                "/user/check-password",
                { currentPassword },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            )

            if (res.data.success) {
                toast.success("Password verified")
                setPasswordVerified(true)
            }
        } catch {
            toast.error("Current password incorrect")
        } finally {
            setChecking(false)
        }
    }

    const handleChangePassword = async () => {
        try {
            const res = await api.put(
                `/user/change-password/${userId}`,
                { newPassword, confirmPassword },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            )

            if (res.data.success) {
                toast.success("Password changed")
                navigate('/password-changed')
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong")
        }
    }

    return (
        <div className='pt-20 min-h-screen pb-10 bg-gray-100 px-4 sm:px-6 lg:px-8'>
            <Tabs defaultValue={defaultTab} className="max-w-7xl mx-auto">
                <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="orders">Orders</TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                    <TabsContent value="profile">
                        <div className="w-full">
                            <div className='flex flex-col items-center justify-center'>
                                <h1 className='font-bold mb-7 text-2xl text-gray-800'>Update Profile</h1>

                                <div className='w-full flex flex-col md:flex-row gap-10 justify-center items-center md:items-start max-w-4xl mx-auto'>

                                    {/* profile picture */}
                                    <div className='flex flex-col items-center shrink-0'>
                                        <img
                                            src={updateUser?.profilePic || userLogo}
                                            alt="profile"
                                            className='w-32 h-32 md:w-40 md:h-40 object-cover rounded-full border-4 border-teal-800 shadow-md'
                                        />
                                        <Label className="cursor-pointer mt-4 bg-teal-600 px-4 py-2 rounded-lg text-white hover:bg-teal-900 transition-colors">
                                            Change Picture
                                            <input type='file' accept='image/*' className='hidden' onChange={handleFileChange} />
                                        </Label>
                                    </div>

                                    {/* profile form */}
                                    <form onSubmit={handleSubmit} className='w-full space-y-4 shadow-lg p-5 md:p-8 rounded-lg bg-white'>
                                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                            <div>
                                                <Label className="block text-sm font-medium">First Name</Label>
                                                <Input type="text" name="firstName" className="w-full mt-1" placeholder="John" value={updateUser.firstName || ""} onChange={handleChange} />
                                            </div>
                                            <div>
                                                <Label className="block text-sm font-medium">Last Name</Label>
                                                <Input type="text" name="lastName" className="w-full mt-1" placeholder="Doe" value={updateUser.lastName || ""} onChange={handleChange} />
                                            </div>
                                        </div>

                                        <div>
                                            <Label className="block text-sm font-medium">Email</Label>
                                            <Input type="email" disabled name="email" className="w-full cursor-not-allowed bg-gray-100 mt-1" value={updateUser.email || ""} />
                                        </div>

                                        <div>
                                            <Label className="block text-sm font-medium">Phone Number</Label>
                                            <Input type="text" name="phoneNo" className="w-full mt-1" placeholder="Enter your Contact No." value={updateUser.phoneNo || ""} onChange={handleChange} />
                                        </div>

                                        <div>
                                            <Label className="block text-sm font-medium">Address</Label>
                                            <Input type="text" name="address" className="w-full mt-1" placeholder="Enter your Address" value={updateUser.address || ""} onChange={handleChange} />
                                        </div>

                                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                            <div>
                                                <Label className="block text-sm font-medium">State</Label>
                                                <Input type="text" name="state" className="w-full mt-1" placeholder="Enter your State" value={updateUser.state || ""} onChange={handleChange} />
                                            </div>
                                            <div>
                                                <Label className="block text-sm font-medium">City</Label>
                                                <Input type="text" name="city" className="w-full mt-1" placeholder="Enter your City" value={updateUser.city || ""} onChange={handleChange} />
                                            </div>
                                            <div>
                                                <Label className="block text-sm font-medium">Zip Code</Label>
                                                <Input type="text" name="zipCode" className="w-full mt-1" placeholder="Enter your Zip Code" value={updateUser.zipCode || ""} onChange={handleChange} />
                                            </div>
                                            <div>
                                                <Label className="block text-sm font-medium">Country</Label>
                                                <Input type="text" name="country" className="w-full mt-1" placeholder="Enter your Country" value={updateUser.country || ""} onChange={handleChange} />
                                            </div>
                                        </div>
                                        <Button type='submit' className="w-full mt-4 bg-teal-600 hover:bg-teal-800 text-white font-semibold py-2 rounded-lg">
                                            {loading ? "Updating Changes..." : "Update Changes"}
                                        </Button>
                                    </form>
                                </div>
                            </div>

                            {/* UPDATE PASSWORD SECTION */}
                            <div className="max-w-4xl mx-auto mt-10 mb-10">
                                <div className="bg-white border border-gray-200 shadow-md p-5 md:p-8 rounded-lg">
                                    <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Update Password</h2>
                                    <>
                                        {!passwordVerified ? (
                                            <div className="space-y-4">
                                                <div>
                                                    <Label>Current Password</Label>
                                                    <div className="relative mt-2">
                                                        <Input
                                                            type={showPassword ? 'text' : 'password'}
                                                            placeholder="Enter current password"
                                                            value={currentPassword}
                                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                                            className="pr-12"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                                        >
                                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="flex justify-start">
                                                    <Button
                                                        onClick={handleCheckPassword}
                                                        disabled={checking || !currentPassword}
                                                        className="bg-teal-600 hover:bg-teal-700 px-6 transition-colors"
                                                    >
                                                        {checking ? "Checking..." : "Verify Current Password"}
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-3 animate-in fade-in duration-300">
                                                <div className="relative">
                                                    <Input
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="New Password"
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                        className="pr-12"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                                                    >
                                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                    </button>
                                                </div>

                                                <div className="relative">
                                                    <Input
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="Confirm Password"
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        className={`pr-12 ${confirmPassword && newPassword !== confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                                    />
                                                </div>

                                                {confirmPassword && newPassword !== confirmPassword && (
                                                    <p className="text-sm text-red-500 ml-1">
                                                        Passwords do not match
                                                    </p>
                                                )}

                                                <Button
                                                    disabled={!passwordsMatch || !newPassword}
                                                    onClick={handleChangePassword}
                                                    className={`w-full mt-2 transition-all ${passwordsMatch && newPassword
                                                        ? "bg-teal-600 hover:bg-teal-700 shadow-md"
                                                        : "bg-gray-300 cursor-not-allowed text-gray-500"
                                                        }`}
                                                >
                                                    Continue & Save
                                                </Button>
                                            </div>
                                        )}
                                    </>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </TabsContent>

                <TabsContent value="orders">
                    <MyOrder />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default Profile









