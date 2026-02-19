import React from 'react'
import { Input } from './ui/input'
import api from "../api/axios";
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { setCart } from '@/redux/productSlice';
import { Button } from './ui/button';


const ProductDesc = ({ product }) => {

  const accessToken = localStorage.getItem("accessToken")
  const dispatch = useDispatch()

  const addToCart = async (productId) => {
    try {
      const res = await api.post('/cart/add', { productId }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      if (res.data.success) {
        toast.success("Product added to cart")
        dispatch(setCart(res.data.cart))
      }

    } catch (error) {
      console.log(error);

    }
  }

  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-bold text-2xl sm:text-3xl lg:text-4xl text-gray-800">
        {product.productName}
      </h1>

      <p className="text-gray-600 text-sm sm:text-base">
        {product.category} | {product.brand}
      </p>

      <h2 className="text-teal-600 font-bold text-xl sm:text-2xl">
        ₹{product.productPrice}
      </h2>

      <p className="text-muted-foreground text-sm sm:text-base leading-relaxed line-clamp-6 lg:line-clamp-12">
        {product.productDesc}
      </p>

      {/* Quantity */}
      <div className="flex gap-3 items-center">
        <p className="text-gray-800 font-semibold">Quantity:</p>
        <Input
          type="number"
          defaultValue={1}
          className="w-20"
          min={1}
        />
      </div>

      {/* Buttons */}
      <Button
        onClick={() => addToCart(product._id)}
        className="bg-teal-600 w-full sm:w-max hover:bg-teal-800"
      >
        Add to Cart
      </Button>
    </div>
  );

}

export default ProductDesc