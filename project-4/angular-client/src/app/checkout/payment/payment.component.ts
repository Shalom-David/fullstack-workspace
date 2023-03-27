import { DatePipe } from '@angular/common';
import {
  Component,
  OnInit,
  ViewEncapsulation,
  Output,
  EventEmitter,
  AfterViewInit,
} from '@angular/core';
import {
  FormControl,
  Validators,
  FormBuilder,
  FormGroup,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import {
  DateFilterFn,
  MatCalendarCellClassFunction,
} from '@angular/material/datepicker';
import { first } from 'rxjs';
import { IuserDetail } from 'src/interfaces/user';
import { OrdersService } from 'src/services/orders.service';
import { UsersService } from 'src/services/users.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class PaymentComponent implements OnInit, AfterViewInit {
  @Output() formGroupChange = new EventEmitter<FormGroup>();
  private shouldFormatCardNumber = true;
  private repeatingDates!: Set<string>;
  user!: IuserDetail;
  formGroup!: FormGroup;
  currentDate = new Date();

  constructor(
    private datePipe: DatePipe,
    private _formBuilder: FormBuilder,
    private ordersService: OrdersService,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.ordersService
      .getOrders('abcds')
      .pipe(first())
      .subscribe({
        next: (data) => {
          this.repeatingDates = this.getRepeatingDates(data, 3);
        },
        error: (error) => console.error(error.error),
      });
    this.usersService.userAccessData$.subscribe((userData) => {
      if (userData.customerEmail && userData.token && userData.loggedIn) {
        this.usersService
          .getUser(userData.customerEmail, userData.token)
          .subscribe({
            next: (data) => {
              this.user = data;
              this.formGroup.patchValue({
                firstName: this.user.firstName,
                lastName: this.user.lastName,
                city: this.user.billingAddress.city,
                street: this.user.billingAddress.street,
              });
            },
            error: (error) => {
              console.error(error);
            },
          });
      }
    });
    this.formGroup = this._formBuilder.group({
      firstName: [this.user ? this.user.firstName : '', Validators.required],
      lastName: [this.user ? this.user.lastName : '', Validators.required],
      city: [
        this.user ? this.user.billingAddress.city : '',
        Validators.required,
      ],
      street: [
        this.user ? this.user.billingAddress.street : '',
        Validators.required,
      ],
      date: ['', [Validators.required, this.dateNotBeforeTodayValidator]],
      cardNumber: [
        '',
        [Validators.required, Validators.pattern('^\\d{4}(\\s\\d{4}){3}$')],
      ],
    });

    this.formGroupChange.emit(this.formGroup);
  }

  ngAfterViewInit(): void {
    if (this.shouldFormatCardNumber) {
      this.formatCardNumber();
      this.shouldFormatCardNumber = false;
    }
  }

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if (view === 'month') {
      const formatedDate = this.datePipe.transform(cellDate, 'dd/MM/yyyy');
      return this.repeatingDates.has(formatedDate!) ? 'custom-date-class' : '';
    }

    return '';
  };

  filterDates: DateFilterFn<Date | null> = (date: Date | null) => {
    if (date) {
      const formattedDate = this.datePipe.transform(date, 'dd/MM/yyyy');

      return !this.repeatingDates.has(formattedDate!);
    }
    return false;
  };

  formatCardNumber(): void {
    const input = this.formGroup.get('cardNumber') as FormControl;
    if (!input.value) {
      return;
    }
    let cardNumber = input.value.replace(/\s+/g, '');

    if (cardNumber.length > 16) {
      cardNumber = cardNumber.substring(0, 16);
    }

    const formattedCardNumber = [];

    for (let i = 0; i < cardNumber.length; i += 4) {
      formattedCardNumber.push(cardNumber.substring(i, i + 4));
    }

    input.setValue(formattedCardNumber.join(' '));
  }

  dateNotBeforeTodayValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to compare only the date part

    if (selectedDate < today) {
      return { dateNotBeforeToday: true };
    }
    return null;
  }
  getErrorMessage(controlName: string): string {
    const control = this.formGroup.get(controlName);

    if (control) {
      switch (true) {
        case control.hasError('required'):
          return 'This field is required';
        case control.hasError('pattern'):
          return 'invalid format';
        case control.hasError('dateNotBeforeToday'):
          return 'date cannot be before today';
      }
    }

    return '';
  }

  private getRepeatingDates(orders: any[], threshold: number): Set<string> {
    const dateCount: { [date: string]: number } = {};
    const result = new Set<string>();

    for (const order of orders) {
      const date = order.deliveryDate;

      if (dateCount[date]) {
        dateCount[date]++;
      } else {
        dateCount[date] = 1;
      }

      if (dateCount[date] >= threshold) {
        result.add(date);
      }
    }

    return result;
  }
}
