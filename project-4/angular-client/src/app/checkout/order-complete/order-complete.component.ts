import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IcartProduct } from 'src/interfaces/cart';
import { Iorder } from 'src/interfaces/order';
import { CartsService } from 'src/services/carts.service';


@Component({
  selector: 'app-order-complete',
  templateUrl: './order-complete.component.html',
  styleUrls: ['./order-complete.component.css'],
})
export class OrderCompleteComponent {
  @Input() order!: Iorder;
  constructor(
    private router: Router,
    private cartService: CartsService
  ) {}

  goHome() {
    this.router.navigate([''], { replaceUrl: true });
  }
  private generateReceiptContent(order: any): string {
    const receiptContent = `
  Order ID: ${order.id}
  Customer Email: ${order.customerEmail}
  
  Items:
  ${order.customerCart.products
    .map(
      (product: IcartProduct) => `
    Name: ${product.name}
    Quantity: ${product.quantity}
    Unit Price $${product.unitPrice}
    Total Price: $${product.totalProductPrice}
  `
    )
    .join('')}
  
  Total Price: $${order.customerCart.totalPrice}
  
  Billing Address:
    City: ${order.billingAddress.city}
    Street: ${order.billingAddress.street}
  
  Delivery Date: ${order.deliveryDate}
  Order Date: ${order.orderDate}
  Card Ends With: ${order.cardEndsWith}
  Status: ${order.status}
  `;

    return receiptContent;
  }

  downloadReceipt(order: any): void {
    const receiptContent = this.generateReceiptContent(order);
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt-${order.id}.txt`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    this.cartService.setCartStatus(true);

    this.router.navigate([''], { replaceUrl: true });
  }
}
