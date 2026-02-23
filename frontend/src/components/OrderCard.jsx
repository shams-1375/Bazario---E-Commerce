import React from 'react'
import { Button } from './ui/button'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const OrderCard = ({ userOrder }) => {
    const navigate = useNavigate()
    return (
        <div className='w-full px-2 sm:px-4 md:px-0 flex flex-col gap-3'>
            <div className='w-full max-w-5xl mx-auto p-2 sm:p-6'>
                <div className='flex items-center gap-4 mb-6'>
                    <Button variant="outline" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="w-5 h-5" /></Button>
                    <h1 className='text-xl md:text-2xl font-bold'>My Orders</h1>
                </div>

                {userOrder?.length === 0 ? (
                    <div className="text-center py-20">
                        <p className='text-gray-500 text-xl'>No Orders found for this user</p>
                    </div>
                ) : (
                    <div className='space-y-6 w-full'>
                        {userOrder?.map((order) => (
                            <div key={order._id} className='shadow-md rounded-2xl p-4 md:p-6 border border-gray-200 bg-white'>
                                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4'>
                                    <h2 className='text-sm md:text-lg font-semibold truncate w-full sm:w-auto'>
                                        Order ID: <span className='text-gray-500 font-mono'>{order._id}</span>
                                    </h2>
                                    <p className='text-sm bg-gray-100 px-3 py-1 rounded-full'>
                                        Total: <span className='font-bold text-teal-700'>{order.currency} {order.amount.toFixed(2)}</span>
                                    </p>
                                </div>

                                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center border-t pt-4 gap-4'>
                                    <div className='text-sm'>
                                        <p className='text-gray-700'><span className='font-medium'>Recipient:</span> {order.user?.firstName} {order.user?.lastName}</p>
                                        <p className='text-gray-500 text-xs md:text-sm'>{order.user?.email}</p>
                                    </div>
                                    <span className={`text-xs uppercase tracking-wider font-bold px-3 py-1 rounded-full ${order.status === "Paid" ? "bg-green-100 text-green-700" :
                                            order.status === "Failed" ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>

                                <div className='mt-6'>
                                    <h3 className='font-medium mb-3 text-sm text-gray-600'>Products</h3>
                                    <div className='space-y-3'>
                                        {order.products.map((product, index) => (
                                            <div key={index} className='flex items-center gap-3 bg-gray-50 p-3 rounded-xl hover:bg-gray-100 transition-colors'>
                                                <img
                                                    onClick={() => navigate(`/products/${product?.productId?._id}`)}
                                                    className='w-14 h-14 md:w-20 md:h-20 object-cover rounded-lg cursor-pointer shrink-0'
                                                    src={product.productId?.productImg?.[0].url}
                                                    alt="product"
                                                />
                                                <div className="flex flex-col md:flex-row md:justify-between w-full gap-1">
                                                    <span className='text-sm font-medium line-clamp-1 md:line-clamp-2 md:max-w-md'>
                                                        {product.productId?.productName}
                                                    </span>
                                                    <span className='text-xs md:text-sm font-bold text-teal-800'>
                                                        ₹{product.productId?.productPrice} × {product.quantity}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default OrderCard
