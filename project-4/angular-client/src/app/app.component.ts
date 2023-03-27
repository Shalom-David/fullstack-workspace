import { Component, OnDestroy, OnInit } from '@angular/core';
import { UsersService } from 'src/services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'angular-client';
  userData!: {
    email: string;
    token: string;
  };
  constructor(private usersService: UsersService) {
    const storedData = localStorage.getItem('userData');
    console.log('hm');
    console.log(storedData);
    if (storedData) {
      this.userData = JSON.parse(storedData);
      this.usersService.setUserAccessData(
        this.userData.email,
        this.userData.token,
        true
      );
      localStorage.removeItem('userData');
    }
  }
  ngOnInit() {
    if (this.userData) {
      console.log(this.userData.token);
    }
    this.usersService.userAccessData$.subscribe((data) => {
      if (data.customerEmail && data.customerEmail && data.loggedIn) {
        this.userData = {
          email: data.customerEmail,
          token: data.token,
        };

        window.addEventListener('beforeunload', this.beforeUnloadHandler);
      }
      if (!data.loggedIn) {
        window.removeEventListener('beforeunload', this.beforeUnloadHandler);
        console.log('idkwtf');
      }
    });
  }


  private beforeUnloadHandler = () => {
    localStorage.setItem(
      'userData',
      JSON.stringify({
        email: this.userData.email,
        token: this.userData.token,
      })
    );
  };
}
