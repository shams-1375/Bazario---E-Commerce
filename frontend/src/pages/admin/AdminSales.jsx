import React, { useEffect, useState } from 'react'
import api from "../../api/axios"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'


const AdminSales = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalSales: 0,
    sales: []
  })

  const fetchStats = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken")

      const res = await api.get('/orders/sales', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      if (res.data.success) {
        setStats(res.data)
      }

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return (
    <div className='pl-87.5 bg-gray-100 py-20 pr-20 mx-auto px-4'>
      <div className='p-6 grid gap-6 lg:grid-cols-4'>
        {/* stats card */}
        <Card className="bg-teal-500 text-white shadow">
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{stats.totalUsers}</CardContent>
        </Card>
        <Card className="bg-teal-500 text-white shadow">
          <CardHeader>
            <CardTitle>Total Products</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{stats.totalProducts}</CardContent>
        </Card>
        <Card className="bg-teal-500 text-white shadow">
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{stats.totalOrders}</CardContent>
        </Card>
        <Card className="bg-teal-500 text-white shadow">
          <CardHeader>
            <CardTitle>Total Sales</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{stats.totalSales}</CardContent>
        </Card>

        {/* salses Char */}

        <Card className='lg:col-span-4'>
          <CardHeader>
            <CardTitle>Sales (last 30 days)</CardTitle>
          </CardHeader>
          <CardContent style={{ height: 300 }}>
            <ResponsiveContainer width='100%' height='100%' >
              <AreaChart data={stats.sales} >
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type='monotone' dataKey='amount' stroke='#319795' fill='#319795' fillOpacity={0.4} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}

export default AdminSales