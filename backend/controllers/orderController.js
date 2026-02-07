import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"



// Placing orders using COD Method 
const placeOrder = async (req, res) => {
    
    try {

        const {userId, items, amount, address} = req.body

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: 'COD',
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        await userModel.findByIdAndUpdate(userId, {cartData: {}})

        res.json({success: true, message: 'Order Placed'})
        
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }

}


// Placing orders using Stripe Method 
const placeOrderStripe = async (req, res) => {

}


// Placing orders using Razorpay Method 
const placeOrderRazorpay = async (req, res) => {

}


// all Orders Data For Admin panel
const allOrders = async (req, res) => {

    try {
       
        const orders = await orderModel.find({})
        res.json({success: true, orders})

    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }


}

// user Order Data For frontend
const userOrders = async (req, res) => {

    try {
        
        const {userId} = req.body

        const orders = await orderModel.find({userId})
        res.json({success: true, orders})

    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }

}

// update Order status from Admin Panel
const updateStatus = async (req, res) => {


}


export { 
    placeOrder, 
    placeOrderStripe, 
    placeOrderRazorpay, 
    allOrders, 
    userOrders, 
    updateStatus 
};