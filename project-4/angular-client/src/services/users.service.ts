import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  IuserDetail,
  IuserRegistrationDetail,
  IuserWithAccessToken,
} from 'src/interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private userUrl = 'http://localhost:8080/user';

  private userAccessData = {
    customerEmail: '',
    token: '',
    loggedIn: false,
  };

  userAccessData$ = new BehaviorSubject(this.userAccessData);
  constructor(private httpClient: HttpClient) {}

  login(userLoginData: {
    email: string;
    password: string;
  }): Observable<IuserWithAccessToken> {
    return this.httpClient.post<IuserWithAccessToken>(
      `${this.userUrl}/login`,
      userLoginData
    );
  }
  register(
    userRegistrationData: IuserRegistrationDetail
  ): Observable<IuserWithAccessToken> {
    return this.httpClient.post<IuserWithAccessToken>(
      `${this.userUrl}/register`,
      userRegistrationData
    );
  }

  logout() {
    console.log('idk');
    this.userAccessData.loggedIn = false;
    this.userAccessData.customerEmail = '';
    this.userAccessData.token = '';
    this.userAccessData$.next(this.userAccessData);
  }

  getUser(email: string, token: string): Observable<IuserDetail> {
    const headers = new HttpHeaders({
      customerEmail: email,
      Authorization: 'Bearer ' + token,
    });

    return this.httpClient.get<IuserDetail>(this.userUrl, { headers: headers });
  }

  checkExistingEmail(email: { email: string }): Observable<boolean> {
    console.log(email);
    return this.httpClient.post<boolean>(`${this.userUrl}/checkEmail`, email);
  }
  setUserAccessData(email: string, token: string, loggedIn: boolean) {
    this.userAccessData.customerEmail = email;
    this.userAccessData.token = token;
    this.userAccessData.loggedIn = loggedIn;
    this.userAccessData$.next(this.userAccessData);
  }
}
