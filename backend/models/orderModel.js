import mongoose from 'mongoose'


const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    products: [
        {
            productId: {type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true},
            quantity: {type:Number, required: true}
        }
    ],
    amount: {type:Number, required: true},
    tax: {type:Number, required: true},
    shipping: {type:Number, required: true},
    currency: {type:String, required: true},
    status: {type:String, enum: ["Pending", "Paid", "Failed"], default: "Pending" , required: true},

    //RazorPay Fields
    razorPayOrderId: {type: String},
    razorPayPaymentId: {type: String},
    razortPaySignature: {type: String}

}, {timestamps: true})

export const Order = mongoose.model("Order", orderSchema )