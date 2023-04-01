import { Component, OnInit } from '@angular/core';
import { Iorder } from 'src/interfaces/order';
import { OrdersService } from 'src/services/orders.service';
import { UsersService } from 'src/services/users.service';
import { Buffer } from 'buffer';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  panelOpenState = false;
  orders!: Iorder[];
  token!: string;
  email!: string;
  isMobile = false;
  constructor(
    private ordersService: OrdersService,
    private usersService: UsersService,
    private breakpointObserver: BreakpointObserver,
    private router: Router
  ) {
    this.breakpointObserver
      .observe([Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape])
      .subscribe((result) => {
        this.isMobile = result.matches;
      });
  }

  cancelOrder(orderId: string) {
    this.ordersService.cancelOrder({ orderId }, this.token).subscribe({
      next: (data) => {
        this.ordersService.setOrderStatus(true);
      },
      error: (error) => {
        if (error.status === 403 || error.status === 401) {
          this.usersService.logout();
          this.router.navigate(['login'], { replaceUrl: true });
        }
      },
    });
  }

  ngOnInit(): void {
    this.ordersService.ordersState$.subscribe((state) => {
      if (state.orderUpdated) {
        this.subscribeToOrders(this.token, this.email);
      }
    });
    this.usersService.userAccessData$.subscribe((accessData) => {
      if (accessData.customerEmail && accessData.token && accessData.loggedIn) {
        this.subscribeToOrders(accessData.token, accessData.customerEmail);
      }
    });
  }

  subscribeToOrders(token: string, email?: string) {
    this.ordersService.getOrders(token, email).subscribe({
      next: (data) => {
        console.log(data);
        this.orders = data;
        this.token = token;
        if (email) this.email = email;
      },
      error: (error) => {
        if (error.status === 403 || error.status === 401) {
          this.usersService.logout();
          this.router.navigate(['login'], { replaceUrl: true });
        }
      },
    });
  }
}
