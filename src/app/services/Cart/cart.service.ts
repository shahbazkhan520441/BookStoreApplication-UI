import { Observable, throwError } from 'rxjs';
import { HttpService } from './../Http/http.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  url: string = 'http://localhost:8080/api/v1';

   customerId:number | undefined;

  constructor(private httpService: HttpService) {
    let userId = localStorage.getItem('userId');
    if (userId) {
      this.customerId = parseInt(userId);
      console.log(this.customerId);
    } else {
      console.error("User ID not found");
    }
  
  }
  addToCart(data: any): Observable<any> {
  

  
    return this.httpService.postService(`${this.url}/customers/${this.customerId}`, data);
  }

  
  
  getCartById(): Observable<any> {
   
   
    return this.httpService.getService(`${this.url}/customer/${this.customerId}`);
  }

  unCart(cartId:number){
   
    return this.httpService.deleteService(`${this.url}/customers/${this.customerId}/${cartId}`)
  }

  updateCartQuantity(cartId: number, quantity: number): Observable<any> {
    const url = `/api/cart/${cartId}?selectedQuantity=${quantity}`;
    return this.httpService.putService(url, null); // No request body required if parameters are in URL
  }
  

}