import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { SignupComponent } from './Components/signup/signup.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { FournotfourComponent } from './Components/fournotfour/fournotfour.component';
import { AuthGuard } from './Auth/auth.guard';
import { CartComponent } from './Components/Cart/cart/cart.component';
import { MyCartComponent } from './Components/MyCart/my-cart/my-cart.component';


const routes: Routes = [
 { path:'', component:LoginComponent },
 { path:'signup', component:SignupComponent},
 { path:'dashboard', component:DashboardComponent, canActivate: [AuthGuard.canActivate] },// Protect route,
 {path:'cart', component: CartComponent, canActivate: [AuthGuard.canActivate]},
 {path:"myCart", component:MyCartComponent, canActivate: [AuthGuard.canActivate]} , 
 { path:'**', component:FournotfourComponent}, // Wildcard route for 404

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
