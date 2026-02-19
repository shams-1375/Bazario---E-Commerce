import api from "../../api/axios"
import OrderCard from '@/components/OrderCard'
import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom"

const ShowUserOrders = () => {
  const params = useParams()

  const [userOrder, setUserOrder] = useState(null)

  const getUserOrders = async () => {
    const accessToken = localStorage.getItem("accessToken")
    const res = await api.get(`orders/user-order/${params.userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    if (res.data.success) {
      setUserOrder(res.data.orders)
    }
  }

  useEffect(() => {
    getUserOrders()
  }, [])

  return (
    <div className="pl-87.5 py-20">
      <OrderCard userOrder={userOrder} />
    </div>
  )
}

export default ShowUserOrders
