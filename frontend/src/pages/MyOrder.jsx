import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import OrderCard from '@/components/OrderCard'


const MyOrder = () => {
    const accessToken = localStorage.getItem("accessToken")
    const [userOrder, setUserOrder] = useState([])


    const getUserOrders = async () => {
        const res = await api.get('/orders/my-order', {
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
        <div className='flex items-center'>
        <OrderCard userOrder={userOrder}/>
        </div>
    )
}

export default MyOrder
