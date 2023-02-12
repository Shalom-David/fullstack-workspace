import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddOperationComponent } from './add-operation/add-operation.component';
import { MainPageComponent } from './main-page/main-page.component';

const routes: Routes = [
  { path: 'home', component: MainPageComponent },
  { path: 'add-operation/:accountNumber', component: AddOperationComponent },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
