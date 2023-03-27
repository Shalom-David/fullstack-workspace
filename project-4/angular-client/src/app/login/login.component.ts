import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from 'src/services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  hide = true;
  loginForm!: FormGroup;
  error!: string;
  constructor(
    private _formBuilder: FormBuilder,
    private usersService: UsersService,
    private router: Router
  ) {}
  ngOnInit() {
    this.loginForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  getErrorMessage(controlName: string) {
    console.log(this.loginForm.controls[controlName].errors);
    switch (true) {
      case this.loginForm.controls[controlName].hasError('required'):
        return 'You must enter a value';
      case controlName === 'email' &&
        this.loginForm.controls[controlName].hasError('email'):
        return 'Not a valid Email';
      case controlName === 'password' &&
        this.error &&
        this.loginForm.controls[controlName].hasError('serverError'):
        console.log('????');
        return this.error;
      default:
        return '';
    }
  }

  login() {
    this.usersService.login(this.loginForm.value).subscribe({
      next: (data) => {
        this.usersService.setUserAccessData(data.user.email, data.token, true);
        this.router.navigate([''], { replaceUrl: true });
      },
      error: (error) => {
        this.error = error.error;
        this.loginForm.get('password')?.setErrors({ serverError: true });
      },
    });
  }
}
