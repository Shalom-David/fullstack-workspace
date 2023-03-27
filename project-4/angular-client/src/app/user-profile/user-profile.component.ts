import { Component, OnInit } from '@angular/core';
import { IuserDetail } from 'src/interfaces/user';
import { UsersService } from 'src/services/users.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  user!: IuserDetail;
  token!: string;
  constructor(private usersService: UsersService) {}
  ngOnInit(): void {
    this.usersService.userAccessData$.subscribe((userData) => {
      if (userData.customerEmail && userData.token && userData.loggedIn) {
        this.usersService
          .getUser(userData.customerEmail, userData.token)
          .subscribe({
            next: (userDetail) => {
              this.user = userDetail;
              this.token = userData.token;
            },
            error: (error) => {
              console.error(error);
            },
          });
      }
    });
  }
}
