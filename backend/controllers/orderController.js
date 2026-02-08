import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"
import productModel from "../models/productModel.js"
import Stripe from 'stripe'
import Razorpay from 'razorpay'

// global variables
const currency = 'inr'
const deliveryCharge = 10

// gateway initialization
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})

const buildOrderItemsAndAmount = async (items) => {
    if(!Array.isArray(items) || items.length === 0)
    {
        return {orderItems: [], amount: 0}
    }

    const productIds = [...new Set(items.map((item) => item._id).filter(Boolean))]
    const products = await productModel.find({_id: {$in: productIds}})
    const productMap = new Map(products.map((p) => [p._id.toString(), p]))

    let itemsTotal = 0
    const orderItems = []

    for(const item of items)
    {
        const product = productMap.get(item._id?.toString())
        if(!product) continue

        const quantity = Number(item.quantity || 0)
        if(quantity <= 0) continue

        const price = Number(product.price)
        itemsTotal += price * quantity

        orderItems.push({
            _id: product._id,
            name: product.name,
            image: product.image,
            price,
            size: item.size,
            quantity
        })
    }

    const delivery = itemsTotal === 0 ? 0 : deliveryCharge
    return {orderItems, amount: itemsTotal + delivery}
}

// Placing orders using COD Method 
const placeOrder = async (req, res) => {
    
    try {

        const {userId, items, address} = req.body

        const {orderItems, amount} = await buildOrderItemsAndAmount(items)

        const orderData = {
            userId,
            items: orderItems,
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

    try {

        const {userId, items, address} = req.body
        const {origin} = req.headers

        const {orderItems, amount} = await buildOrderItemsAndAmount(items)

        const orderData = {
            userId,
            items: orderItems,
            address,
            amount,
            paymentMethod: 'Stripe',
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        const line_items = orderItems.map((item) => ({
            price_data: {
                currency:currency,
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data: {
                currency:currency,
                product_data: {
                    name: 'Delivery Charges'
                },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',

        })
        
        res.json({success: true, session_url: session.url})
        
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }

    
}

// verifyStripe
const verifyStripe = async(req, res) => {
    const {orderId, success, userId} = req.body

    try {
        if(success === 'true'){

            await orderModel.findByIdAndUpdate(orderId, {payment: true})
            await userModel.findByIdAndUpdate(userId, {cartData: {}})
            res.json({success: true})
        }else{
            await orderModel.findByIdAndDelete(orderId)
            res.json({success: false})

        }
            

    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

// Placing orders using Razorpay Method 
const placeOrderRazorpay = async (req, res) => {

    try {
        
        const {userId, items, address} = req.body

        const {orderItems, amount} = await buildOrderItemsAndAmount(items)

        const orderData = {
            userId,
            items: orderItems,
            address,
            amount,
            paymentMethod: 'Razorpay',
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        const options = {
            amount: amount * 100,
            currency: currency.toUpperCase(),
            receipt: newOrder._id.toString()
        }

        // await razorpayInstance.orders.create(options, (error, order) => {
        //     if(error)
        //     {
        //         console.log(error)
        //         return res.json({success: false, message: error})
        //     }
        //     res.json({seccess: true, order})
            
        // })

        const order = await razorpayInstance.orders.create(options)
        res.json({success: true, order})

    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

const verifyRazorpay = async (req, res) => {
    
    try {
        const {userId, razorpay_order_id, razorpay_orderId} = req.body
        const orderId = razorpay_order_id || razorpay_orderId
        if(!orderId)
        {
            return res.json({success:false, message: 'Missing Razorpay order id'})
        }
        const orderInfo = await razorpayInstance.orders.fetch(orderId)
        if(orderInfo.status === 'paid')
        {
            await orderModel.findByIdAndUpdate(orderInfo.receipt, {payment: true})
            await userModel.findByIdAndUpdate(userId, {cartData: {}})
            res.json({success:true, message: 'Payment Successful'})
        }
        else{
            res.json({success:false, message: 'Payment Failed'})
        }
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }

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

    try {
        
        const {orderId, status} = req.body

        await orderModel.findByIdAndUpdate(orderId, {status})
        res.json({success: true, message: 'Status Updated'})

    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }


}


export { 
    placeOrder, 
    placeOrderStripe, 
    placeOrderRazorpay, 
    allOrders, 
    userOrders, 
    updateStatus,
    verifyStripe,
    verifyRazorpay
};
