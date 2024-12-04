import { Injectable } from '@angular/core';
import { HttpService } from '../Http/http.service';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  url: string = 'http://localhost:8080/api/v1';
  token: any;
  constructor(private httpService: HttpService) {
  }


  
 

  addToWishList(data: any): Observable<any> {
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
  
    return this.httpService.postService(`${this.url}/addWishlist/${customerId}`, data);
  }


  getWishList() {
    let userId = localStorage.getItem('userId');
    let customerId: number;
  
    if (userId) {
      customerId = parseInt(userId);
      console.log(customerId);
    } else {
      console.error("User ID not found");
      return throwError(() => new Error("User ID not found")); // Graceful error handling
    }
    return this.httpService.getService(`${this.url}/wishlist/${customerId}`)
  }


  removeWishlistItem(wishlistId: number): Observable<any> {
    const book = { bookId: wishlistId }; // Correct object definition
    let customerId: number;
  
    const userId = localStorage.getItem('userId');
    if (userId) {
      customerId = parseInt(userId, 10); // Ensure base 10 for parseInt
      console.log(customerId);
    } else {
      console.error("User ID not found");
      return throwError(() => new Error("User ID not found")); // Graceful error handling
    }
  
    // Assuming the backend accepts a body in DELETE requests
    return this.httpService.deleteServiceRequest(`${this.url}/remove/${customerId}`, book);
  }
  


}
