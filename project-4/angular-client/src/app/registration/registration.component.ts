import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatStepper, StepperOrientation } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UsersService } from 'src/services/users.service';
import { IuserDetail, IuserRegistrationDetail } from 'src/interfaces/user';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit, AfterViewInit {
  stepperOrientation: Observable<StepperOrientation>;
  @ViewChild(MatStepper) stepper!: MatStepper;
  hidePassword = true;
  hideConfirmPassword = true;
  registrationFormStep1!: FormGroup;
  registrationFormStep2!: FormGroup;
  email!: string;
  token!: string;
  error!: string
  constructor(
    private _formBuilder: FormBuilder,
    breakpointObserver: BreakpointObserver,
    private usersService: UsersService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }
  private passwordComplexityValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const value = control.value;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);

    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      return { passwordComplexity: true };
    }

    return null;
  }
  private passwordMatchValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }

    return null;
  }

  private emailExistsValidator(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {
    return this.usersService.checkExistingEmail({ email: control.value }).pipe(
      map((emailExists) => {
        return emailExists ? { emailExists: true } : null;
      })
    );
  }

  private setStepByFragment(): void {
    const stepName = this.route.snapshot.fragment;
    if (stepName) {
      const stepIndex = this.switchLabelToStepIndex(stepName);
      if (stepIndex !== -1) {
        this.stepper.selectedIndex = stepIndex;
      }
    } else {
      this.router.navigate(['register'], { fragment: 'Step 1' });
    }
  }

  private updateFragmentOnStepChange(): void {
    this.stepper.selectionChange.subscribe((change) => {
      const stepName = change.selectedStep?.label;
      if (stepName) {
        this.router.navigate(['register'], { fragment: stepName });
      }
    });
  }

  private switchLabelToStepIndex(label: string): number {
    return this.stepper._steps
      .toArray()
      .findIndex((step) => step.label === label);
  }
  ngOnInit() {
    this.registrationFormStep1 = this._formBuilder.group(
      {
        email: [
          '',
          {
            validators: [Validators.required, Validators.email],
            asyncValidators: [this.emailExistsValidator.bind(this)],
            updateOn: 'blur',
          },
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(18),
            this.passwordComplexityValidator,
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
    this.registrationFormStep2 = this._formBuilder.group({
      city: ['', Validators.required],
      street: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
    });
  }
  ngAfterViewInit(): void {
    this.setStepByFragment();
    this.updateFragmentOnStepChange();
  }
  getErrorMessage(formGroup: FormGroup, controlName: string) {
    const control = formGroup.controls[controlName];
    switch (true) {
      case control.hasError('required'):
        return 'You must enter a value';
      case controlName === 'email' && control.hasError('email'):
        return 'Not a valid Email';
      case controlName === 'email' && control.hasError('emailExists'):
        return 'email already in use';
      case controlName === 'password' && control.hasError('minlength'):
        return 'Password must be at least 8 characters';
      case controlName === 'password' && control.hasError('maxlength'):
        return 'Password must not exceed 18 characters';
      case controlName === 'password' && control.hasError('passwordComplexity'):
        return 'Password must contain at least one uppercase letter, lowercase letter, and one number';
      case controlName === 'confirmPassword' &&
        control.hasError('passwordMismatch'):
        return 'passwords do not match';
      default:
        return '';
    }
  }
  goHome() {
    this.usersService.setUserAccessData(this.email, this.token, true);
    this.router.navigate([''], { replaceUrl: true });
  }
  register() {
    console.log(
      this.registrationFormStep1.valid && this.registrationFormStep2.valid
    );
    const user: IuserRegistrationDetail = {
      firstName: this.registrationFormStep2.get('firstName')?.value,
      lastName: this.registrationFormStep2.get('lastName')?.value,
      email: this.registrationFormStep1.get('email')?.value,
      password: this.registrationFormStep1.get('password')?.value,
      billingAddress: {
        city: this.registrationFormStep2.get('city')?.value,
        street: this.registrationFormStep2.get('street')?.value,
      },
    };
    this.usersService.register(user).subscribe({
      next: (data) => {
        this.email = data.user.email;
        this.token = data.token;
      },
      error: (error) => console.log(error.error),
    });
  }
}
