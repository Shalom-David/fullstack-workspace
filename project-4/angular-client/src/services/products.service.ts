import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IpaginatedProducts, Iproduct } from 'src/interfaces/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productsUrl = 'http://localhost:8080/products';
  constructor(private httpClient: HttpClient) {}

  getProducts(
    category?: string,
    page?: number,
    searchQuery?: string
  ): Observable<Iproduct[] | IpaginatedProducts> {
    console.log(searchQuery);
    switch (true) {
      case Boolean(page && !category && !searchQuery):
        return this.httpClient.get<IpaginatedProducts>(
          `${this.productsUrl}?page=${page}`
        );
      case Boolean(page && searchQuery && !category):
        return this.httpClient.get<IpaginatedProducts>(
          `${this.productsUrl}?search=${searchQuery}&page=${page}`
        );
      case Boolean(category && page && !searchQuery):
        return this.httpClient.get<IpaginatedProducts>(
          `${this.productsUrl}?category=${category}&page=${page}`
        );
      case Boolean(category && page && searchQuery):
        return this.httpClient.get<IpaginatedProducts>(
          `${this.productsUrl}?search=${searchQuery}&category=${category}&page=${page}`
        );
      default:
        return this.httpClient.get<Iproduct[]>(this.productsUrl);
    }
  }
}
