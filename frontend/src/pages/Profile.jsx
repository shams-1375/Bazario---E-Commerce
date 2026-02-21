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
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import userLogo from '../assets/user.jpg'
import { toast } from 'sonner'
import api from '../api/axios'
import { setUser } from '@/redux/userSlice'
import MyOrder from './MyOrder'
import { useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from 'lucide-react'


const Profile = () => {
    const { user } = useSelector(store => store.user)
    const params = useParams()
    const navigate = useNavigate()
    const location = useLocation();
    const userId = params.userId
    const showPasswordFields = location.state?.showPasswordFields
    const [showPassword, setShowPassword] = useState(false)
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const accessToken = localStorage.getItem("accessToken")



    const passwordsMatch =
        newPassword && confirmPassword && newPassword === confirmPassword


    const defaultTab = location.state?.tab || "profile";

    const [currentPassword, setCurrentPassword] = useState("")
    const [passwordVerified, setPasswordVerified] = useState(false)
    const [checking, setChecking] = useState(false)


    const [updateUser, setUpdateUser] = useState({
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        address: user?.address,
        phoneNo: user?.phoneNo,
        city: user?.city,
        zipCode: user?.zipCode,
        profilePic: user?.profilePic,
        role: user?.role
    })

    const [file, setFile] = useState(null)
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setUpdateUser({ ...updateUser, [e.target.name]: e.target.value })
    }

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0]
        setFile(selectedFile)
        setUpdateUser({ ...updateUser, profilePic: URL.createObjectURL(selectedFile) })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const accessToken = localStorage.getItem("accessToken")

        try {
            setLoading(true)
            const formData = new FormData()
            formData.append("firstName", updateUser.firstName)
            formData.append("lastName", updateUser.lastName)
            formData.append("email", updateUser.email)
            formData.append("address", updateUser.address)
            formData.append("city", updateUser.city)
            formData.append("zipCode", updateUser.zipCode)
            formData.append("phoneNo", updateUser.phoneNo)
            formData.append("role", updateUser.role)

            if (file) {
                formData.append("file", file)
            }
            const res = await api.put(`/user/update/${userId}`, formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            if (res.data.success) {
                toast.success(res.data.message)
                dispatch(setUser(res.data.user))
            }

        } catch (error) {
            console.log(error)
            toast.error("Fail to update profile")

        } finally {
            setLoading(false)
        }
    }

    const handleCheckPassword = async () => {
        if (!currentPassword) {
            toast.error("Please enter current password")
            return
        }

        try {
            setChecking(true)

            const res = await api.post(
                "/user/check-password",
                { currentPassword },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            )

            if (res.data.success) {
                toast.success("Password verified")
                setPasswordVerified(true)
            }

        } catch (error) {
            toast.error("Current password is incorrect")
        } finally {
            setChecking(false)
        }
    }

    const handleChangePassword = async () => {
        try {
            const res = await api.put(`/user/change-password/${userId}`,
                { newPassword, confirmPassword }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            if (res.data.success) {
                toast.success("Passwrod Changed")
                navigate('/password-changed')
            }

        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong")
        }
    }



    return (
        <div className='pt-20 min-h-screen pb-10 bg-gray-100'>
            <Tabs defaultValue={defaultTab} className="max-w-7xl mx-auto items-center">
                <TabsList>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="orders">Orders</TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                    <div>
                        <div className='flex flex-col items-center justify-center bg-gray-100'>
                            <h1 className=' font-bold mb-7 text-2xl text-gray-800'>Update Profile</h1>
                            <div className='w-full flex gap-10 justify-between items-start max-w-2xl'>

                                {/* profile picture */}
                                <div className='flex flex-col items-center'>
                                    <img src={updateUser?.profilePic || userLogo} alt="profile" className='w-32 h-32 object-cover rounded-full border-4 border-teal-800' />
                                    <Label
                                        className="cursor-pointer mt-4 bg-teal-600 px-4 py-2 rounded-lg text-white hover:bg-teal-900" >Change Picture
                                        <input
                                            type='file'
                                            accept='image/*'
                                            className='hidden'
                                            onChange={handleFileChange}
                                        />
                                    </Label>
                                </div>

                                {/* profiele form */}
                                <form onSubmit={handleSubmit} className='space-y-4 shadow-lg p-5 rounded-lg bg-white'>
                                    <div className='grid grid-cols-2 gap-4'>
                                        <div>
                                            <Label className="block text-sm font-medium">First Name</Label>
                                            <Input type="text" name="firstName" className="w-full rounded-lg border px-3 py-2 mt-1" placeholder="John" value={updateUser.firstName || ""} onChange={handleChange} />
                                        </div>
                                        <div>
                                            <Label className="block text-sm font-medium">Last Name</Label>
                                            <Input type="text" name="lastName" className="w-full rounded-lg border px-3 py-2 mt-1" placeholder="Doe" value={updateUser.lastName || ""} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="block text-sm font-medium">Email</Label>
                                        <Input type="email" disabled name="email" className="w-full rounded-lg border px-3 py-2 cursor-not-allowed bg-gray-100 mt-1" value={updateUser.email || ""} onChange={handleChange} />
                                    </div>
                                    <div>
                                        <Label className="block text-sm font-medium">Phone Number</Label>
                                        <Input type="text" name="phoneNo" className="w-full rounded-lg border px-3 py-2 mt-1" placeholder="Enter your Contact No." value={updateUser.phoneNo || ""} onChange={handleChange} />
                                    </div>
                                    <div>
                                        <Label className="block text-sm font-medium">Address</Label>
                                        <Input type="text" name="address" className="w-full rounded-lg border px-3 py-2 mt-1" placeholder="Enter your Address" value={updateUser.address || ""} onChange={handleChange} />
                                    </div>
                                    <div className='grid grid-cols-2 gap-4' >
                                        <div>
                                            <Label className="block text-sm font-medium">City</Label>
                                            <Input type="text" name="city" className="w-full rounded-lg border px-3 py-2 mt-1" placeholder="Enter your City" value={updateUser.city || ""} onChange={handleChange} />
                                        </div>
                                        <div>
                                            <Label className="block text-sm font-medium">Zip Code</Label>
                                            <Input type="text" name="zipCode" className="w-full rounded-lg border px-3 py-2 mt-1" placeholder="Enter your Zip Code" value={updateUser.zipCode || ""} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <Button type='submit' className="w-full mt-4 bg-teal-600 hover:bg-teal-800 text-white font-semibold py-2 rounded-lg">{loading ? "Updating Changes..." : "Update Changes"}</Button>
                                </form>
                            </div>
                        </div>

                        {/* UPDATE PASSWORD SECTION */}
                        <div className="mt-10 max-w-2xl mx-auto bg-white border border-gray-200 shadow-md p-6 rounded-lg">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                                Update Password
                            </h2>

                            {!passwordVerified && (
                                <>
                                    <Label>Current Password</Label>
                                    <div className='relative'>
                                        <Input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Enter current password"
                                            className="mt-2"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                        />
                                        {
                                            showPassword ? <EyeOff className='w-5 h-5 text-gray-500 absolute right-5 bottom-2 cursor-pointer ' onClick={() => setShowPassword(false)} /> : <Eye className='w-5 h-5 text-gray-500 absolute right-5 bottom-2 cursor-pointer ' onClick={() => setShowPassword(true)} />
                                        }
                                    </div>
                                </>
                            )}

                            {passwordVerified && (
                                <>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="New Password"
                                            className="mb-3"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                        {showPassword ? (
                                            <EyeOff
                                                className="w-5 h-5 text-gray-500 absolute right-5 bottom-5 cursor-pointer"
                                                onClick={() => setShowPassword(false)}
                                            />
                                        ) : (
                                            <Eye
                                                className="w-5 h-5 text-gray-500 absolute right-5 bottom-5 cursor-pointer"
                                                onClick={() => setShowPassword(true)}
                                            />
                                        )}
                                    </div>

                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Confirm Password"
                                            className="mb-1"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                        {showPassword ? (
                                            <EyeOff
                                                className="w-5 h-5 text-gray-500 absolute right-5 bottom-3 cursor-pointer"
                                                onClick={() => setShowPassword(false)}
                                            />
                                        ) : (
                                            <Eye
                                                className="w-5 h-5 text-gray-500 absolute right-5 bottom-3 cursor-pointer"
                                                onClick={() => setShowPassword(true)}
                                            />
                                        )}
                                    </div>

                                    {/* Error Message */}
                                    {confirmPassword && newPassword !== confirmPassword && (
                                        <p className="text-sm text-red-500 mb-2">
                                            Passwords do not match
                                        </p>
                                    )}

                                    <Button
                                        disabled={!passwordsMatch}
                                        onClick={handleChangePassword}
                                        className={`w-full mt-2 ${passwordsMatch
                                            ? "bg-teal-600 hover:bg-teal-700"
                                            : "bg-gray-300 cursor-not-allowed"
                                            }`}
                                    >
                                        Continue
                                    </Button>
                                </>

                            )}
                        </div>

                    </div>
                </TabsContent>

                <TabsContent value="orders">
                    <MyOrder />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default Profile
