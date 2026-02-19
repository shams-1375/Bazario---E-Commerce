import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import api from "../api/axios";
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setUser } from '@/redux/userSlice'



const Login = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    console.log(formData)
    try {
      setLoading(true)
      const res = await api.post(`/user/login`, formData, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      if (res.data.success) {
        navigate('/')
        dispatch(setUser(res.data.user))
        localStorage.setItem("accessToken", res.data.accessToken)
        toast.success(res.data.message)

      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || "Something went wrong, please try again")
    }
    finally {
      setLoading(false)
    }
  }


  return (
    <div className='flex justify-center items-center min-h-screen bg-teal-50'>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login your account</CardTitle>
          <CardDescription>
            Enter Your Credentials to Login
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-4">
            </div>
            <div className='grid gap-2'>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className='relative'>
                <Input
                  id="password"
                  name="password"
                  placeholder="Enter you'r password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
                {
                  showPassword ? <EyeOff className='w-5 h-5 text-gray-500 absolute right-5 bottom-2 cursor-pointer ' onClick={() => setShowPassword(false)} /> : <Eye className='w-5 h-5 text-gray-500 absolute right-5 bottom-2 cursor-pointer ' onClick={() => setShowPassword(true)} />
                }
              </div>
            </div>
            <div className="flex justify-between items-center mt-3">
              <span
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-teal-600 underline cursor-pointer hover:text-teal-800"
              >
                Forgot your password?
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button onClick={submitHandler} type="button" className="w-full cursor-pointer bg-teal-700 hover:bg-teal-900">
            {loading ? "Logging in..." : "Login"}
          </Button>
          <p className='text-gray-800 text-sm' >Don't have an account? <Link to={'/signup'} className='hover:underline cursor:pointer text-teal-900'>Signup</Link> </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Login
