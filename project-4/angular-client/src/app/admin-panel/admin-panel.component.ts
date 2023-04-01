import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map } from 'rxjs';
import { OrdersComponent } from '../orders/orders.component';
import { UsersService } from 'src/services/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css'],
})
export class AdminPanelComponent implements OnInit {
  @ViewChild('ordersComponent', { static: false })
  ordersComponent!: OrdersComponent;
  snackBarVerticalPosition!: 'top' | 'bottom';
  token!: string;
  role!: string;
  constructor(
    private usersService: UsersService,
    private _snackBar: MatSnackBar,
    private breakpointObserver: BreakpointObserver,
    private router: Router
  ) {
    this.breakpointObserver
      .observe([Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape])
      .pipe(
        map(({ matches }) => {
          return matches ? 'top' : 'bottom';
        })
      )
      .subscribe((position) => {
        this.snackBarVerticalPosition = position;
      });
  }

  openSnackBar() {
    this._snackBar.open('You do not have permissions!', undefined, {
      duration: 10000,
      horizontalPosition: 'center',
      verticalPosition: this.snackBarVerticalPosition,
    });
  }
  ngOnInit(): void {
    this.usersService.userAccessData$.subscribe((accessData) => {
      if (accessData.customerEmail && accessData.token && accessData.loggedIn) {
        this.usersService
          .getUser(accessData.customerEmail, accessData.token)
          .subscribe({
            next: (data) => {
              this.token = accessData.token;
              this.role = data.role;
              if (data.role === 'admin') {
                this.ordersComponent.subscribeToOrders(this.token);
              }
            },
            error: (error) => {
              if (error.status === 403 || error.status === 401) {
                this.usersService.logout();
                this.router.navigate(['login'], { replaceUrl: true });
              }
            },
          });
      }
    });
  }
}
