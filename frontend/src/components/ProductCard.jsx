import { ShoppingCart } from 'lucide-react'
import React from 'react'
import { Button } from './ui/button'
import { Skeleton } from './ui/skeleton'
import api from "../api/axios";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCart } from '@/redux/productSlice';
import { toast } from 'sonner';


const ProductCard = ({ product, loading }) => {
    const accessToken = localStorage.getItem("accessToken")
    const { productImg, productPrice, productName } = product
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const addToCart = async (productId) => {
        try {
            const res = await api.post("/cart/add", { productId }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            if (res.data.success) {
                toast.success('Product added to Cart')
                dispatch(setCart(res.data.cart))
            }

        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <div className="shadow-lg rounded-lg overflow-hidden h-full flex flex-col">

            <div className="w-full aspect-square overflow-hidden">
                {loading ? (
                    <Skeleton className="w-full h-full bg-gray-600" />
                ) : (
                    <img
                        onClick={() => navigate(`/products/${product._id}`)}
                        src={productImg[0]?.url}
                        alt=""
                        className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                    />
                )}
            </div>

            {loading ? (
                <div className="px-2 space-y-2 my-2">
                    <Skeleton className="w-full h-4 bg-gray-600" />
                    <Skeleton className="w-1/2 h-4 bg-gray-600" />
                    <Skeleton className="w-full h-8 bg-gray-600" />
                </div>
            ) : (
                <div className="px-2 py-2 flex flex-col gap-1 flex-1">
                    <h1 className="font-semibold line-clamp-2 text-sm sm:text-base">
                        {productName}
                    </h1>
                    <h2 className="font-bold text-base">₹{productPrice}</h2>
                    <Button
                        onClick={() => addToCart(product._id)}
                        className="bg-teal-600 mt-auto w-full hover:bg-teal-800"
                    >
                        <ShoppingCart className="mr-1" />
                        Add to Cart
                    </Button>
                </div>
            )}
        </div>
    );

}

export default ProductCard