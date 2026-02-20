import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import userLogo from "../assets/user.jpg"
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios'
import { setCart } from '@/redux/productSlice';
import { toast } from 'sonner';



const Cart = () => {
  const { cart } = useSelector(store => store.product)

  const subTotal = cart?.totalPrice
  const shipping = subTotal > 299 ? 0 : 10
  let tax = parseFloat((subTotal * 0.05).toFixed(2))
  const total = subTotal + shipping + tax
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const accessToken = localStorage.getItem('accessToken')

  const loadCart = async () => {
    try {
      const res = await api.get('/cart', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      if (res.data.success) {
        dispatch(setCart(res.data.cart))
      }

    } catch (error) {
      console.log(error.message)
    }
  }


  const handleUpdateQuantity = async (productId, type) => {
    try {
      const res = await api.put('/cart/update', { productId, type }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      if (res.data.success) {
        dispatch(setCart(res.data.cart))
      }

    } catch (error) {
      console.log(error.message)
    }
  }

  const handleRemove = async (productId) => {
    try {
      const res = await api.delete('/cart/remove', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        data: { productId }
      })

      if (res.data.success) {
        dispatch(setCart(res.data.cart))
        toast.success('Product Remove from Cart')
      }

    } catch (error) {

    }
  }

  useEffect(() => {
    loadCart()
  }, [])

  return (
    <div className="pt-20 bg-gray-50 min-h-screen">
      {cart?.items?.length > 0 ? (
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-7">
            Shopping Cart
          </h1>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Cart Items */}
            <div className="flex flex-col gap-4 flex-1">
              {cart?.items?.map((product, index) => (
                <Card
                  key={index}
                  className="group transition-all duration-200 hover:shadow-md border-gray-100"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4">

                    {/* Product */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100 border">
                        <img
                          src={
                            product?.productId?.productImg?.[0]?.url ||
                            userLogo
                          }
                          alt={product?.productId?.productName}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>

                      <div className="flex flex-col min-w-0 max-w-full sm:max-w-70">
                        <h3 className="font-bold text-gray-900 truncate text-base sm:text-lg">
                          {product?.productId?.productName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Unit Price: ₹
                          {product?.productId?.productPrice?.toLocaleString(
                            "en-IN"
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="flex sm:flex-col items-start sm:items-center gap-2">
                      <div className="flex items-center bg-gray-50 rounded-md border h-9">
                        <Button
                          onClick={() =>
                            handleUpdateQuantity(
                              product.productId._id,
                              "decrease"
                            )
                          }
                          variant="ghost"
                          className="h-full px-3 border-r"
                        >
                          -
                        </Button>
                        <span className="w-10 text-center font-semibold">
                          {product.quantity}
                        </span>
                        <Button
                          onClick={() =>
                            handleUpdateQuantity(
                              product.productId._id,
                              "increase"
                            )
                          }
                          variant="ghost"
                          className="h-full px-3 border-l"
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex flex-row sm:flex-col items-start sm:items-end gap-2 min-w-22.5">
                      <p className="text-lg sm:text-xl font-bold text-teal-600">
                        ₹
                        {(
                          product?.productId?.productPrice *
                          product?.quantity
                        ).toLocaleString("en-IN")}
                      </p>
                      <button
                        onClick={() =>
                          handleRemove(product?.productId?._id)
                        }
                        className="flex items-center gap-1 pt-2 text-xs font-semibold text-red-500 hover:text-red-700 uppercase"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-90 lg:sticky lg:top-24">
              <Card className="border-none shadow-md bg-white">
                <CardHeader className="pb-2 px-4">
                  <CardTitle className="text-lg">Order Summary</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cart.items.length} items)</span>
                    <span>₹{subTotal.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">
                      {shipping === 0 ? "FREE" : `₹${shipping}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Estimated Tax (5%)</span>
                    <span>₹{tax}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-baseline">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-2xl font-bold text-teal-700">
                      ₹{total.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="space-y-3 pt-4">
                    <div className="flex gap-2">
                      <Input placeholder="Promo Code" />
                      <Button variant="outline">Apply</Button>
                    </div>

                    <Button
                      onClick={() => navigate("/address")}
                      className="w-full bg-teal-600 hover:bg-teal-800"
                    >
                      PLACE ORDER
                    </Button>

                    <Button
                      onClick={() => navigate("/products")}
                      variant="outline"
                      className="w-full"
                    >
                      Continue Shopping
                    </Button>
                  </div>

                  <div className="text-sm text-muted-foreground pt-4">
                    <p>* Free shipping on orders over ₹299</p>
                    <p>* 30-days return policy</p>
                    <p>* Secure checkout with SSL encryption</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
          <div className="bg-teal-100 p-6 rounded-full">
            <ShoppingCart className="w-16 h-16 text-teal-600" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-gray-800">
            Your Cart is Empty
          </h2>
          <p className="mt-2 text-gray-600">
            Looks like you haven't added anything yet
          </p>
          <Button
            onClick={() => navigate("/products")}
            className="mt-6 bg-teal-600 hover:bg-teal-800"
          >
            Explore Products
          </Button>
        </div>
      )}
    </div>
  );

}

export default Cart