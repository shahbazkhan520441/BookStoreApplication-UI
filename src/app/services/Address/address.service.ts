import { Injectable } from '@angular/core';
import { HttpService } from '../Http/http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
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


  addAddress(data: any): Observable<any> {
  
  console.log(data);
  
    return this.httpService.postService(`${this.url}/customers/${this.customerId}`, data);
  }

  getAddress(): Observable<any> {
   
    return this.httpService.getService(`${this.url}/customers/${this.customerId}/cart-books`);
  }
}
