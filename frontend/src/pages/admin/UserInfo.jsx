import React, { useEffect, useState } from "react"
import api from "../../api/axios"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"


const UserInfo = () => {
  const { id } = useParams()
  const { user: loggedInUser } = useSelector((state) => state.user)

  const [selectedUser, setSelectedUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken")

        const res = await api.get(`/user/get-user/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        if (res.data.success) {
          setSelectedUser(res.data.user)
        }
      } catch (error) {
        toast.error("Failed to fetch user")
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchUser()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (loggedInUser?.role !== "admin") {
      return toast.error("Unauthorized")
    }

    try {
      const accessToken = localStorage.getItem("accessToken")

      const formData = new FormData()
      formData.append("role", selectedUser.role)

      const res = await api.put(`/user/update/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (res.data.success) {
        toast.success("Role updated successfully")
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed")
    }
  }

  if (loading) return <div className="p-6">Loading...</div>
  if (!selectedUser) return <div className="p-6">User not found</div>

  return (
    <div className="flex items-center justify-center mt-10 min-h-[80vh] p-4">
      <div className="w-full max-w-md">

        <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100">

          <div className="relative p-6 border-b border-gray-50">
            <button
              onClick={() => navigate(-1)}
              className="absolute left-6 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-xl font-bold text-center text-gray-800">
              Manage User Role
            </h2>
          </div>

          <div className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider text-gray-500 font-semibold">First Name</Label>
                <Input className="bg-gray-50 border-none" value={selectedUser.firstName || ""} disabled />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Last Name</Label>
                <Input className="bg-gray-50 border-none" value={selectedUser.lastName || ""} disabled />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Email Address</Label>
              <Input className="bg-gray-50 border-none" value={selectedUser.email || ""} disabled />
            </div>

            <hr className="my-2 border-gray-100" />

            <div className="space-y-3">
              <Label className="text-sm font-bold text-gray-700">Assign Role</Label>
              <RadioGroup
                value={selectedUser.role}
                onValueChange={(value) => setSelectedUser({ ...selectedUser, role: value })}
                className="flex gap-4 p-3 bg-teal-50/50 rounded-lg border border-teal-100"
              >
                <div className="flex items-center space-x-2 flex-1 justify-center py-1">
                  <RadioGroupItem value="user" id="user" className="text-teal-600" />
                  <Label htmlFor="user" className="cursor-pointer">User</Label>
                </div>

                <div className="flex items-center space-x-2 flex-1 justify-center py-1">
                  <RadioGroupItem value="admin" id="admin" className="text-teal-600" />
                  <Label htmlFor="admin" className="cursor-pointer">Admin</Label>
                </div>
              </RadioGroup>
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white font-medium transition-all shadow-md shadow-teal-100"
            >
              Update Permissions
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserInfo
