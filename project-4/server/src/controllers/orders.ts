import { Document } from 'mongoose'
import { Iorder } from '../interfaces/order'
import { IcartProduct } from '../interfaces/cart'
import { Order } from '../models/order'
import { findCart } from './carts'
import { Cart } from '../models/cart'
export const createOrder = async (
  doc: any
): Promise<Document<unknown, any, Iorder> | Iorder> => {
  const cart = await findCart(doc.customerEmail)

  if (!cart)
    throw {
      status: 400,
      message: 'cart is empty',
    }
  const { products, totalPrice } = cart
  const order: Iorder = {
    customerEmail: doc.customerEmail,
    customerCart: {
      products: products,
      totalPrice: totalPrice,
    },
    billingAddress: doc.billingAddress,
    deliveryDate: doc.deliveryDate,
    orderDate: new Date().toLocaleDateString(),
    cardEndsWith: parseInt(doc.creditCard.split(' ')[3]),
    status: /\b(?:\d[ -]*?){16}\b/.test(doc.creditCard)
      ? 'confirmed'
      : 'rejected',
  }
  const newOrder = new Order(order)
  await Cart.deleteOne(cart)
  await newOrder.save()
  order.customerCart.products = order.customerCart.products.map((product) => {
    const { imageData, ...orderDetail } = product
    return orderDetail
  })
  order.id = newOrder._id.toString()
  return order
}
export const findOrders = async (email?: string): Promise<Iorder[]> => {
  return await Order.find(email ? { customerEmail: email } : {})
}
export const findOrder = async (id: string): Promise<Iorder | null> => {
  return await Order.findById(id)
}

export const cancelOrder = async (orderId: string): Promise<Iorder> => {
  return await Order.findOneAndUpdate(
    { _id: orderId },
    { $set: { status: 'canceled' } },
    { upsert: true, new: true }
  )
}
