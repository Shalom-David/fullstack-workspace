import { IcartProduct } from './cart';

export interface Iorder {
  customerEmail: string;
  customerCart: {
    products: IcartProduct[];
    totalPrice: number;
  };
  billingAddress: { city: string; street: string };
  deliveryDate: string;
  orderDate: string;
  cardEndsWith: number;
  status: 'confirmed' | 'rejected' | 'canceled';
}

export interface IplaceOrder {
  customerEmail: string;
  billingAddress: { city: string; street: string };
  deliveryDate: string;
  creditCard: string;
}
