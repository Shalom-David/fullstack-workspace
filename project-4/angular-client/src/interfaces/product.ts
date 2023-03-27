export interface Iproduct {
  productId: string;
  name: string;
  category: string;
  price: number;
  imageData: string;
  description: string;
}

export interface IpaginatedProducts {
  products: Iproduct[];
  maxPageCount: number;
}

export interface IsearchProducts {
  name: string;
  category: string;
}
