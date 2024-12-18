import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {  HttpClientModule } from '@angular/common/http';

import { RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Components/login/login.component';
import { SignupComponent } from './Components/signup/signup.component';
import { FournotfourComponent } from './Components/fournotfour/fournotfour.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Needed for Material animations
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatBadgeModule } from '@angular/material/badge';

import {MatStepperModule} from '@angular/material/stepper';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { HeaderComponent } from './Components/Header/header/header.component';
import { CartComponent } from './Components/Cart/cart/cart.component';
import { MyCartComponent } from './Components/MyCart/my-cart/my-cart.component';
import { WishlistComponent } from './Components/WishList/wishlist/wishlist.component';
import { MatSelectModule } from '@angular/material/select';
import { OrderComponent } from './Components/Order/order/order.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    DashboardComponent,
    FournotfourComponent,
    HeaderComponent,
    CartComponent,
    MyCartComponent,
    WishlistComponent,
    OrderComponent,

  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatTableModule,
    MatMenuModule,
    MatSelectModule,
    MatStepperModule,
    MatBadgeModule
  
  ],
  providers: [  
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
