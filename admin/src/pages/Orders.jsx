import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

function Orders({ token }) {

  const [orders, setOrders] = useState([])

  const fetchAllOrders = async () => {
    if (!token) return

    try {
      const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } })

      if (response.data.success) {
        setOrders(response.data.orders.reverse())
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const statusHandler = async(event, orderId) => {
    try {
      const response = await axios.post(backendUrl + '/api/order/status', {orderId, status: event.target.value}, {headers: {token}})

      if(response.data.success)
      {
        await fetchAllOrders()
      }

    } catch (error) {
      console.log(error)
      toast.error(response.data.message)
    }
  }

  useEffect(() => {
    fetchAllOrders()
  }, [token])

  return (
    <div className="border-t pt-12 px-4 md:px-8">

      <h3 className="text-2xl font-semibold mb-6">
        Orders
      </h3>

      <div className="flex flex-col gap-6">

        {orders.map((order, index) => (
          <div
            key={index}
            className="border rounded-md p-5 bg-white shadow-sm grid grid-cols-1 md:grid-cols-[0.5fr_2fr_1fr_1fr_1fr_1fr] gap-4 items-start"
          >

            {/* Parcel Icon */}
            <img
              src={assets.parcel_icon}
              alt=""
              className="w-12"
            />

            {/* Items + Address */}
            <div className="text-sm text-gray-700">

              {/* Items */}
              <div className="mb-2">
                {order.items.map((item, i) => (
                  <p key={i}>
                    {item.name} x {item.quantity}
                    <span className="ml-2 text-gray-500">({item.size})</span>
                  </p>
                ))}
              </div>

              {/* Customer */}
              <p className="font-medium text-black">
                {order.address.firstName} {order.address.lastName}
              </p>

              <p>
                {order.address.street},
              </p>
              <p>
                {order.address.city}, {order.address.country} - {order.address.zipcode}
              </p>

              <p className="mt-1">
                {order.address.phone}
              </p>
            </div>

            {/* Order Info */}
            <div className="text-sm text-gray-700">
              <p>Items: {order.items.length}</p>
              <p>Method: {order.paymentMethod}</p>
              <p>
                Payment:
                <span className={`ml-1 ${order.payment ? 'text-green-600' : 'text-red-500'}`}>
                  {order.payment ? 'Done' : 'Pending'}
                </span>
              </p>
              <p>Date: {new Date(order.date).toLocaleDateString()}</p>
            </div>

            {/* Amount */}
            <p className="text-sm font-medium text-black">
              {currency}{order.amount}
            </p>

            {/* Status */}
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <p className="text-sm">Order Placed</p>
            </div>

            {/* Update Status */}
            <select onChange={(e) => statusHandler(e, order._id)} value={order.status} className="border px-3 py-2 text-sm rounded outline-none">
              <option value="Order Placed">Order Placed</option>
              <option value="Packing">Packing</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>

          </div>
        ))}

        {orders.length === 0 && (
          <p className="text-gray-500 text-sm">
            No orders found
          </p>
        )}

      </div>
    </div>
  )
}

export default Orders
