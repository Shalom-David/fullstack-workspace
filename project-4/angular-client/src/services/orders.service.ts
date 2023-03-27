import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Iorder, IplaceOrder } from 'src/interfaces/order';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private ordersUrl = 'http://localhost:8080/order';
  constructor(private httpClient: HttpClient) {}

  getOrders(token: string): Observable<Iorder[]> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });

    return this.httpClient.get<Iorder[]>(this.ordersUrl, { headers: headers });
  }
  placeOrder(order: IplaceOrder, token: string): Observable<Iorder> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });

    return this.httpClient.post<Iorder>(this.ordersUrl, order, {
      headers: headers,
    });
  }
}
