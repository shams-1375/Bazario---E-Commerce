import React from 'react'
import { Button } from './ui/button'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const OrderCard = ({ userOrder }) => {
    const navigate = useNavigate()
    return (
        <div className='px-4 flex flex-col gap-3 max-w-5xl mx-auto w-full'>
            <div className='w-full py-6 md:p-6'>
                <div className='flex items-center gap-4 mb-6'>
                    <Button onClick={() => navigate(-1)}><ArrowLeft /></Button>
                    <h1 className='text-xl md:text-2xl font-bold'>Orders</h1>
                </div>
                {
                    userOrder?.length === 0 ? (
                        <p className='text-gray-800 space-y-6 text-xl md:text-2xl'>No Orders found for this user</p>
                    ) : (
                        <div className='space-y-6 w-full'>
                            {
                                userOrder?.map((order) => (
                                    <div key={order._id} className='shadow-lg rounded-2xl p-4 md:p-5 border border-gray-200'>
                                        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2'>
                                            <h2 className='text-base md:text-lg font-semibold break-all'>
                                                Orde ID:{" "}
                                                <span className='text-gray-600'>{order._id}</span>
                                            </h2>
                                            <p className='text-sm text-gray-500'>
                                                Amount: {"  "}
                                                <span className='font-bold text-gray-900'>
                                                    {order.currency} {order.amount.toFixed(2)}
                                                </span>
                                            </p>
                                        </div>

                                        {/* user info */}
                                        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
                                            <div className='mb-4'>
                                                <p className='text-sm text-gray-700'>
                                                    <span className='font-medium'>User:</span>{" "}
                                                    {order.user?.firstName || "Unknown"} {order.user?.lastName}
                                                </p>
                                                <p className='text-sm text-gray-600 break-all'>
                                                    Email: {order.user?.email || "N/A"}
                                                </p>
                                            </div>
                                            <span className={`${order.status === "Paid" ? "bg-green-500" : order.status ===
                                                "Failed" ? "bg-red-500" : "bg-orange-300"} text-white px-3 py-1 rounded-lg text-sm`}>
                                                {order.status}</span>
                                        </div>

                                        {/* products */}
                                        <div className='mt-4'>
                                            <h3 className='font-medium mb-2'>Products:</h3>
                                            <ul className='space-y-2'>
                                                {
                                                    order.products.map((product, index) => (
                                                        <li key={index} className='flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 p-3 rounded-lg gap-3'>
                                                            <div className='flex items-center gap-3 w-full sm:w-auto'>
                                                                <img onClick={() => navigate(`/products/${product?.productId?._id}`)}
                                                                    className='w-16 h-16 object-cover rounded cursor-pointer shrink-0' src={product.productId?.productImg?.[0].url} alt=""
                                                                />
                                                                <span className='text-sm md:w-75 line-clamp-2'>{product.productId?.productName}</span>
                                                            </div>
                                                            <span className='font-medium text-sm self-end sm:self-center'>
                                                                ₹{product.productId?.productPrice} x {product.quantity}
                                                            </span>
                                                        </li>
                                                    ))
                                                }
                                            </ul>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default OrderCard
