import razorpayInstance from "../config/razorpay.js";
import { Cart } from "../models/cartModel.js";
import { Order } from "../models/orderModel.js";
import { User } from "../models/userModel.js";
import { Product } from "../models/productModel.js";

import crypto from "crypto"
import "dotenv/config";



export const createOrder = async (req, res) => {
    try {
        const { products, amount, tax, shipping, currency } = req.body;
        const options = {
            amount: Math.round(Number(amount) * 100),
            currency: currency || "INR",
            receipt: `receipt_${Date.now()}`
        }

        const razorpayOrder = await razorpayInstance.orders.create(options)

        const newOrder = new Order({
            user: req.user._id,
            products,
            amount,
            tax,
            shipping,
            currency,
            status: "Pending",
            razorPayOrderId: razorpayOrder.id
        })

        await newOrder.save()
        res.status(200).json({
            success: true,
            order: razorpayOrder,
            dbOrder: newOrder
        })

    } catch (error) {
        console.log("Error in Create Order", error)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentFailed } = req.body
        const userId = req.user._id

        if (paymentFailed) {
            const order = await Order.findOneAndUpdate(
                { razorPayOrderId: razorpay_order_id },
                { status: "Failed" },
                { new: true }
            )
            return res.status(200).json({
                success: false,
                message: "Payment Failed",
                order
            })
        }

        const sign = razorpay_order_id + "|" + razorpay_payment_id
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(sign.toString())
            .digest("hex")


        if (expectedSignature === razorpay_signature) {
            const order = await Order.findOneAndUpdate(
                { razorPayOrderId: razorpay_order_id },
                { status: "Paid", razorPayPaymentId: razorpay_payment_id, razorPaySignature: razorpay_signature },
                { new: true }
            )

            await Cart.findOneAndUpdate({ userId }, { $set: { items: [], totalPrice: 0 } })

            return res.status(200).json({
                success: true,
                message: "Payment Successfull",
                order
            })
        } else {
            await Order.findOneAndUpdate(
                { razorPayOrderId: razorpay_order_id },
                { status: "Failed" },
                { new: true }
            )
            return res.json({
                success: false,
                message: "Invalid Signature"
            })
        }

    } catch (error) {
        console.log("Error in verify Payment", error)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getMyOrder = async (req, res) => {
    try {
        const userId = req.id
        const orders = await Order.find({ user: userId })
            .sort({ createdAt: -1 })
            .populate({ path: "products.productId", select: "productName productPrice productImg" })
            .populate("user", "firstName lastName email")

        res.status(200).json({
            success: true,
            count: orders.length,
            orders,
        })

    } catch (error) {
        console.log("Error Fetching user orders:", error)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params;

        const orders = await Order.find({ user: userId })
            .sort({ createdAt: -1 })
            .populate({
                path: "products.productId",
                select: "productName productPrice productImg"
            }) // fetch product details
            .populate("user", "firstName lastName email")

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        })
    } catch (error) {
        console.log("Error fetching user order: ", error)
        res.status(500).json({ message: error.message })
    }
}

export const getAllOrdersAdmin = async (req, res) => {
    try {
        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .populate("user", "name email") // populate user info
            .populate("products.productId", "productName productPrice") // populate product info

        res.json({
            success: true,
            count: orders.length,
            orders
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch all orders",
            error: error.message
        })
    }
}

export const getSalesData = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({})
        const totalProducts = await Product.countDocuments({})
        const totalOrders = await Order.countDocuments({ status: "Paid" })

        // total sales
        const totalSaleAgg = await Order.aggregate([
            { $match: { status: "Paid" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ])

        const totalSales = totalSaleAgg[0]?.total || 0

        // ---- LAST 30 DAYS SALES ----
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const thirtyDaysAgo = new Date(today)
        thirtyDaysAgo.setDate(today.getDate() - 29)

        // get actual sales from DB
        const salesAgg = await Order.aggregate([
            {
                $match: {
                    status: "Paid",
                    createdAt: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },
                    amount: { $sum: "$amount" }
                }
            },
            { $sort: { _id: 1 } }
        ])

        // convert aggregation result to map
        const salesMap = {}
        salesAgg.forEach(item => {
            salesMap[item._id] = item.amount
        })

        // build full 30-day series
        const sales = []
        for (let i = 0; i < 30; i++) {
            const date = new Date(thirtyDaysAgo)
            date.setDate(thirtyDaysAgo.getDate() + i)

            const formattedDate = date.toISOString().split("T")[0]

            sales.push({
                date: formattedDate,
                amount: salesMap[formattedDate] || 0
            })
        }

        res.json({
            success: true,
            totalUsers,
            totalProducts,
            totalOrders,
            totalSales,
            sales
        })

    } catch (error) {
        console.error("Error fetching sales data", error)
        res.status(500).json({ success: false })
    }
}
