import {
  Component,
  EventEmitter,
  inject,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first, Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { map } from 'rxjs/operators';

import { Iproduct, IupdateProduct } from 'src/interfaces/product';
import { ProductService } from 'src/services/products.service';
import { Buffer } from 'buffer';
import { PageEvent } from '@angular/material/paginator';
import { StatesService } from 'src/services/states.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { CartsService } from 'src/services/carts.service';
import { IuserDetail } from 'src/interfaces/user';
import { IcartData, IcartProduct } from 'src/interfaces/cart';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { UsersService } from 'src/services/users.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidatorsService } from 'src/services/custom-validators.service';
import { ErrorsService } from 'src/services/errors.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent implements OnInit {
  @Output() showSnackbar = new EventEmitter<void>();
  selectedFile: File | null = null;
  addProductForm!: FormGroup;
  user!: IuserDetail;
  token!: string;
  errorMessage = this.errors.getErrorMessage;
  serverError!: string;

  constructor(
    private _formBuilder: FormBuilder,

    private customValidators: CustomValidatorsService,
    private usersService: UsersService,
    private productsService: ProductService,
    private errors: ErrorsService,
    private router: Router
  ) {}
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
              if (error.status === 403 || error.status === 401) {
                this.usersService.logout();
                this.router.navigate(['login'], { replaceUrl: true });
              }
            },
          });
      }
    });

    this.addProductForm = this._formBuilder.group({
      name: ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(999)]],
      price: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      category: ['', Validators.required],
      image: ['', Validators.required],
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files ? input.files[0] : null;
    console.log(file);
    if (file) {
      const res = this.customValidators.checkFile(file);
      console.log(res);
      switch (true) {
        case res?.['fileType']:
          this.addProductForm.controls['image'].setErrors({ fileType: true });
          break;
        case res?.['fileSize']:
          this.addProductForm.controls['image'].setErrors({ fileSize: true });
          break;
      }
      if (res?.['fileType']) {
      }
      this.selectedFile = file;
    } else {
      this.selectedFile = null;
    }
  }

  addProduct() {
    if (this.addProductForm.valid) {
      const productData: Omit<Iproduct, 'productId'> = {
        name: this.addProductForm.get('name')?.value,
        description: this.addProductForm.get('description')?.value,
        category: this.addProductForm.get('category')?.value,
        price: this.addProductForm.get('price')?.value,
        imageData: this.selectedFile!,
      };
      this.productsService.addProduct(productData, this.token).subscribe({
        next: (data: Iproduct) => {
          console.log(data);
        },
        error: (error: any) => {
          console.error(error);
          switch (true) {
            case error.status === 403 || error.status === 401:
              this.usersService.logout();
              this.router.navigate(['login'], { replaceUrl: true });
              if (error.status === 403) this.showSnackbar.emit();
              return;
            case error.status === 400 &&
              error.message.includes('already exists'):
              this.serverError = error.error;
              this.addProductForm.get('name')?.setErrors({ serverError: true });
              return;
          }
        },
      });
    }
  }
}
