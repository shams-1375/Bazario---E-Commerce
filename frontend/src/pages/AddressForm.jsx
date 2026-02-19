import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { addAddress, deleteAddress, setAddresses, setCart, setSelectedAddress } from '@/redux/productSlice'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import api from "../api/axios";
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'


const AddressForm = () => {
    const dispatch = useDispatch()
    const accessToken = localStorage.getItem("accessToken")
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        country: "",
    })
    const { cart, addresses, selectedAddress } = useSelector((store) => store.product)
    const [showForm, setShowForm] = useState(addresses?.length > 0 ? false : true)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }


    // 1. Fetch addresses from DB on Page Load
    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const { data } = await api.get('/user/get-addresses', {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                if (data.success) {
                    dispatch(setAddresses(data.addresses));
                }
            } catch (error) {
                console.log("Error fetching addresses:", error);
            }
        };
        if (accessToken) fetchAddresses();
    }, [accessToken, dispatch]);

    // 2. Save Address to DB
    const handleSave = async () => {
        try {
            const { data } = await api.post('/user/add-address', formData, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            if (data.success) {
                dispatch(setAddresses(data.addresses)); // Updates Redux with DB data
                setShowForm(false);
                toast.success("Address saved!");
            }
        } catch (error) {
            toast.error("Failed to save address");
        }
    };

    // 3. Delete Address from DB
    const handleRemoveAddress = async (e, index) => {
        e.stopPropagation();
        try {
            const { data } = await api.delete(`/user/delete-address/${index}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            if (data.success) {
                dispatch(setAddresses(data.addresses)); // Syncs Redux with DB
                toast.success("Address removed");
            }
        } catch (error) {
            toast.error("Failed to delete address");
        }
    };

    let subTotal = cart.totalPrice
    let shipping = subTotal > 299 ? 0 : 10
    let tax = parseFloat((subTotal * 0.05).toFixed(2))
    let total = subTotal + shipping + tax

    const handlePayment = async () => {
        try {
            const { data } = await api.post('/orders/create-order', {
                products: cart?.items?.map(item => ({
                    productId: item.productId._id,
                    quantity: item.quantity
                })),
                tax,
                shipping,
                amount: total,
                currency: "INR"

            }, {
                headers: { Authorization: `Bearer ${accessToken}` }
            })

            if (!data.success) {
                return toast.error("Something went Wrong")
            }

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY,
                amount: data.order.amount,
                currency: data.order.currency,
                order_id: data.order.id, // Order ID from backend
                name: " Bazario",
                description: "Order Payment",
                handler: async function (response) {
                    try {
                        const verifyRes = await api.post('/orders/verify-payment', response, {
                            headers: { Authorization: `Bearer ${accessToken}` }
                        })
                        if (verifyRes.data.success) {
                            toast.success(" ✅  Payment Successfull")
                            dispatch(setCart({ items: [], totalPrice: 0 }))
                            navigate("/order-success")
                        } else {
                            toast.error("❌ Payment Verification Failed")
                        }
                    } catch (error) {
                        toast.error("Error verifying Payment")
                    }
                },
                modal: {
                    ondismiss: async function () {
                        await api.post('/orders/verify-payment', {
                            razorpay_order_id: data.order.id,
                            paymentFailed: true
                        }, {
                            headers: { Authorization: `Bearer ${accessToken}` }
                        })
                        toast.error("Payment Cancelled or Failed")
                    }
                },
                prefill: {
                    name: formData.fullName,
                    email: formData.email,
                    contact: formData.phone
                },
                theme: { color: "#319795" }
            }

            const rzp = new window.Razorpay(options)

            rzp.on("payment.failed", async function (response) {
                await api.post('orders/verify-payment', {
                    razorpay_order_id: data.order.id,
                    paymentFailed: true
                }, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                })
                toast.error("Payment Failed. Please try again")
            })

            rzp.open()

        } catch (error) {
            console.log(error)
            toast.error("Something went wrong while processing Payment")
        }
    }

    return (
        <div className='min-h-screen bg-gray-50/50 p-6 md:p-10'>
            <div className='max-w-7xl mx-auto'>
                {/* Page Header */}
                <h1 className="text-2xl font-bold mb-8 text-gray-800">Checkout</h1>

                <div className='grid grid-cols-1 lg:grid-cols-3 items-start gap-10'>

                    {/* Left Column: Address Section */}
                    <div className='lg:col-span-2 space-y-6 bg-white p-8 rounded-xl border border-gray-100 shadow-sm'>
                        {showForm ? (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center border-b pb-4">
                                    <h2 className="text-xl font-semibold">Shipping Address</h2>
                                    <button
                                        onClick={() => setShowForm(false)}
                                        className="text-sm text-teal-600 hover:underline"
                                    >
                                        Back to saved addresses
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <Label className="font-semibold" htmlFor="fullName">Full Name</Label>
                                        <Input className="mt-1.5 focus:ring-teal-500" id="fullName" name="fullName" required placeholder="John Doe" value={formData.fullName} onChange={handleChange} />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label className="font-semibold" htmlFor="phone">Phone No.</Label>
                                            <Input className="mt-1.5" id="phone" name="phone" required placeholder="+91 892xxxxx06" value={formData.phone} onChange={handleChange} />
                                        </div>
                                        <div>
                                            <Label className="font-semibold" htmlFor="email">Email Address</Label>
                                            <Input className="mt-1.5" id="email" name="email" required placeholder="johndoe@email.com" value={formData.email} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="font-semibold" htmlFor="address">Street Address</Label>
                                        <Input className="mt-1.5" id="address" name="address" required placeholder="flat 205, New Street, Area" value={formData.address} onChange={handleChange} />
                                    </div>
                                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                                        <div className="col-span-1">
                                            <Label className="font-semibold" htmlFor="city">City</Label>
                                            <Input className="mt-1.5" id="city" name="city" required placeholder="Hyderabad" value={formData.city} onChange={handleChange} />
                                        </div>
                                        <div className="col-span-1">
                                            <Label className="font-semibold" htmlFor="state">State</Label>
                                            <Input className="mt-1.5" id="state" name="state" required placeholder="Telangana" value={formData.state} onChange={handleChange} />
                                        </div>
                                        <div className="col-span-1">
                                            <Label className="font-semibold" htmlFor="zip">Zip Code</Label>
                                            <Input className="mt-1.5" id="zip" name="zip" required placeholder="500008" value={formData.zip} onChange={handleChange} />
                                        </div>
                                        <div className="col-span-1">
                                            <Label className="font-semibold" htmlFor="country">Country</Label>
                                            <Input className="mt-1.5" id="country" name="country" required placeholder="India" value={formData.country} onChange={handleChange} />
                                        </div>
                                    </div>
                                </div>
                                <Button onClick={handleSave} className='w-full h-12 text-md bg-teal-600 hover:bg-teal-700 transition-colors shadow-lg shadow-teal-100'>
                                    Save & Continue to Payment
                                </Button>
                            </div>
                        ) : (
                            <div className='space-y-6'>
                                <div className="flex justify-between items-center">
                                    <h2 className='text-xl font-semibold'>Select a delivery address</h2>
                                    <Button variant='outline' size="sm" className='border-teal-600 text-teal-600 hover:bg-teal-50' onClick={() => setShowForm(true)}>
                                        + Add New Address
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    {addresses.map((addr, index) => (
                                        <div key={index}
                                            onClick={() => dispatch(setSelectedAddress(index))}
                                            className={`group border-2 p-5 cursor-pointer rounded-xl relative transition-all duration-200 ${selectedAddress === index ? "border-teal-500 bg-teal-50/30 ring-1 ring-teal-500" : "border-gray-200 hover:border-teal-200 hover:bg-gray-50"}`} >

                                            <div className="flex justify-between">
                                                <div>
                                                    <p className='font-bold text-gray-900'>{addr.fullName}</p>
                                                    <p className="text-sm text-gray-600 mt-1">{addr.phone} • {addr.email}</p>
                                                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                                                        {addr.address}, {addr.city},<br />
                                                        {addr.state}, {addr.zip}, {addr.country}
                                                    </p>
                                                </div>
                                                <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${selectedAddress === index ? "border-teal-500" : "border-gray-300"}`}>
                                                    {selectedAddress === index && <div className="h-2.5 w-2.5 rounded-full bg-teal-500" />}
                                                </div>
                                            </div>

                                            <button
                                                onClick={(e) => handleRemoveAddress(e, index)}
                                                className='mt-3 text-xs font-semibold text-red-500 opacity-0 group-hover:opacity-100 transition-opacity'
                                            >
                                                Remove Address
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <Button
                                    onClick={handlePayment}
                                    disabled={selectedAddress === null}
                                    className='w-full h-12 text-md bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300'
                                >
                                    Proceed to Checkout
                                </Button>
                                <Button onClick={() => navigate('/cart')} variant='outline' className='w-full bg-transparent mt-1'>
                                    Back to Cart
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="sticky top-10">
                        <Card className='border-none shadow-md bg-white overflow-hidden'>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className='space-y-4'>
                                <div className='flex justify-between text-gray-600'>
                                    <span>Subtotal ({cart.items.length} items)</span>
                                    <span>₹{subTotal.toLocaleString("en-IN")}</span>
                                </div>
                                <div className='flex justify-between text-gray-600'>
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-medium">{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                                </div>
                                <div className='flex justify-between text-gray-600'>
                                    <span>Estimated Tax (5%)</span>
                                    <span>₹{tax}</span>
                                </div>

                                <Separator className="my-2" />

                                <div className='flex justify-between items-baseline'>
                                    <span className="text-lg font-bold">Total</span>
                                    <span className="text-2xl text-teal-700"><span>₹{total.toLocaleString("en-IN")}</span></span>
                                </div>

                                <div className='bg-gray-50 p-4 rounded-lg space-y-3 mt-6'>
                                    <div className="flex gap-2 text-[11px] text-gray-500">
                                        <span className="text-teal-600 font-bold">✓</span>
                                        <p>Free shipping on orders over ₹299</p>
                                    </div>
                                    <div className="flex gap-2 text-[11px] text-gray-500">
                                        <span className="text-teal-600 font-bold">✓</span>
                                        <p>30-days return policy</p>
                                    </div>
                                    <div className="flex gap-2 text-[11px] text-gray-500">
                                        <span className="text-teal-600 font-bold">✓</span>
                                        <p>Secure checkout with SSL encryption</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default AddressForm