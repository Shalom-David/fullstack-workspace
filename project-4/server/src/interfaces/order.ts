import { IcartProduct } from './cart'

export interface Iorder {
  id?: string
  customerEmail: string
  customerCart: {
    products: IcartProduct[]
    totalPrice: number
  }
  billingAddress: { city: string; street: string }
  deliveryDate: string
  orderDate: string
  cardEndsWith: number
  status: 'confirmed' | 'rejected' | 'canceled'
}
