import { Observable, throwError } from 'rxjs';
import { HttpService } from './../Http/http.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  url: string = 'http://localhost:8080/api/v1';

  constructor(private httpService: HttpService) {
  
  }
  addToCart(data: any): Observable<any> {
    console.log(data)
    let userId = localStorage.getItem('userId');
    let customerId: number;
  
    if (userId) {
      customerId = parseInt(userId);
      console.log(customerId);
    } else {
      console.error("User ID not found");
      return throwError(() => new Error("User ID not found")); // Graceful error handling
    }
  
    return this.httpService.postService(`${this.url}/customers/${customerId}`, data);
  }
  
  getCartById(): Observable<any> {
   
    return this.httpService.getService(this.url + '/GetCartByID');
  }

}