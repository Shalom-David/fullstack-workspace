import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './checkout/cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { LoginComponent } from './login/login.component';
import { MainPageComponent } from './main-page/main-page.component';
import { RegistrationComponent } from './registration/registration.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'category/:', component: MainPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'checkout', redirectTo: 'checkout/#Cart', pathMatch: 'full' },
  { path: 'checkout/:step', component: CheckoutComponent },
  { path: 'register', redirectTo: 'register/', pathMatch: 'full' },
  { path: 'register/:step', component: RegistrationComponent },
  { path: 'profile', component: UserProfileComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
