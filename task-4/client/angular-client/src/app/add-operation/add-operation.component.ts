import { Component, OnInit } from '@angular/core';
import { AccountOperationsService } from 'src/services/account-operations.service';
import { Operation, OperationErrors } from 'src/interfaces/operation';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-add-operation',
  templateUrl: './add-operation.component.html',
  styleUrls: ['./add-operation.component.css'],
})
export class AddOperationComponent implements OnInit {
  operatoinType!: 'withdraw' | 'deposit' | 'loan';
  accountNumber!: number;
  operationAmount!: number;
  operationDate: string = new Date().toISOString().substring(0, 10);
  loanInterestRate!: number;
  loanNumberOfPayments!: number;
  formData!: Operation;
  errors: OperationErrors = {
    accountNumberError: '',
    amountError: '',
    interestRateError: '',
    numberofPaymentsError: '',
  };
  constructor(
    private operationService: AccountOperationsService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit() {
    this.activeRoute.params.subscribe((params) => {
      this.accountNumber = params['accountNumber'];
    });
  }
  postOperation() {
    this.formData = {
      accountNumber: this.accountNumber,
      operation: {
        type: this.operatoinType,
        amount: this.operationAmount,
        operationDate: this.operationDate,
      },
    };
    if (this.operatoinType === 'loan') {
      this.formData.operation.interestRate = this.loanInterestRate;
      this.formData.operation.numberOfPayments = this.loanNumberOfPayments;
    }
    this.operationService.postOperation(this.formData).subscribe({
      error: (error) =>
        error.error.errors.forEach((err: any) => {
          switch (err.msg) {
            case 'invalid account number':
              this.errors = {
                ...this.errors,
                accountNumberError: err.msg,
              };
              break;
            case 'invalid amount':
              this.errors = {
                ...this.errors,
                amountError: err.msg,
              };
              break;
            case 'invalid interest rate':
              this.errors = {
                ...this.errors,
                interestRateError: err.msg,
              };
              break;
            case 'invalid number of payments':
              this.errors = {
                ...this.errors,
                numberofPaymentsError: err.msg,
              };
              break;
          }
        }),
    });
  }

  goBack(){
    this.router.navigate(['../', ], {
      relativeTo: this.activeRoute,
    });
  }
}
