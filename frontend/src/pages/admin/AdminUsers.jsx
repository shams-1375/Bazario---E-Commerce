import React, { useEffect, useState } from 'react'
import api from "../../api/axios";
import { Edit, Eye, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import UserLogo from "../../assets/user.jpg"
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()
  

  const getAllUsers = async () => {
    const accessToken = localStorage.getItem("accessToken")

    try {
      const res = await api.get('/user/all-user', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      if (res.data.success) {
        setUsers(res.data.users)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const filteredUsers = users.filter(user => `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) || 
  user.email.toLowerCase().includes(searchTerm.toLowerCase())
)

  useEffect(() => {
    getAllUsers()
  }, [])

  return (
    <div className='pl-87.5 mt-2 py-20 pr-20 mx-auto px-4'>
      <h1 className='font-bold text-2xl mb-0.5'>User Management</h1>
      <p>View and manage registered users</p>

      <div className='flex relative w-75 mt-4'>
        <Search className='absolute left-2 top-1.5 text-gray-600 w-5' />
        <Input value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} className='pl-10' placeholder="Search Users..." />
      </div>
      <div className='grid grid-cols-3 mt-7 gap-7'>
        {
          filteredUsers.map((user, index) => {
            return <div key={index} className='bg-teal-100 p-5 rounded-lg'>
              <div className='flex items-center gap-2'>
                <img src={user?.profilePic || UserLogo} alt="" className='rounded-full aspect-square w-16 object-cover border border-teal-600' />
                <div>
                  <h1 className='font-semibold'>{user.firstName} {user.lastName}</h1>
                  <h3>{user?.email}</h3>
                </div>
              </div>
              <div className='flex gap-3 mt-3'>
                <Button onClick={()=>navigate(`/dashboard/users/${user?._id}`)} ><Edit/>Edit</Button>
                <Button onClick={()=>navigate(`/dashboard/users/orders/${user?._id}`)} ><Eye/>Show Order</Button>
              </div>
            </div>
          })
        }
      </div>
    </div>
  )
}

export default AdminUsers