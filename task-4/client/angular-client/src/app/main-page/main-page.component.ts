import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { Operation } from 'src/interfaces/operation';
import { AccountOperationsService } from 'src/services/account-operations.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
})
export class MainPageComponent {
  operations!: Operation[];
  accountNumber!: number;
  constructor(
    private operationService: AccountOperationsService,
    private router: Router
  ) {}
  errorMessage = '';
  // isGetOperationsSuccess: boolean = false;
  getAccountOperations() {
    this.operationService
      .getOperations(this.accountNumber)
      .pipe(first())
      .subscribe({
        next: (data) => {
          this.operations = data;
          // this.isGetOperationsSuccess = true;
        },
        error: (error) =>
          error.error.errors.forEach((err: any) => {
            if (err.msg === 'invalid account number')
              return (this.errorMessage = err.msg);
          }),
      });
  }
  addNewOperation() {
    this.router.navigate(['/add-operation', this.accountNumber || '']);
  }
}
